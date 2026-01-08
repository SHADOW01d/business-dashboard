# Use Python 3.11 slim image (better compatibility)
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Ensure psycopg3 is installed (works with Python 3.13)
RUN pip install --no-cache-dir "psycopg[binary]==3.3.2"

# Copy project
COPY . .

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/auth/current_user/ || exit 1

# Create startup script
RUN echo '#!/bin/bash\n\
echo "🔍 Testing database connection..."\n\
python manage.py dbshell --command "SELECT 1;" && echo "✅ Database connection successful" || echo "❌ Database connection failed"\n\
echo "🗄️ Running migrations..."\n\
python manage.py migrate --noinput\n\
echo "📁 Collecting static files..."\n\
python manage.py collectstatic --noinput\n\
echo "🚀 Starting server..."\n\
gunicorn config.wsgi:application --bind 0.0.0.0:8000' > /app/start.sh && \
chmod +x /app/start.sh

# Start command
CMD ["/app/start.sh"]
