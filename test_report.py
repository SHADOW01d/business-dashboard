#!/usr/bin/env python
"""
Test script to verify report generation functionality
"""
import os
import sys
import django

# Setup Django
sys.path.append('/home/dreamer/business-dashboard')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from datetime import date, timedelta
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch

def test_pdf_generation():
    """Test basic PDF generation"""
    try:
        print("Testing PDF generation...")
        
        # Create PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=1,  # Center
            textColor=colors.HexColor('#1a365d')
        )

        # Build PDF content
        content = []
        content.append(Paragraph("Test Report", title_style))
        content.append(Paragraph("This is a test PDF to verify reportlab is working.", styles['Normal']))
        
        # Build PDF
        doc.build(content)
        buffer.seek(0)
        
        # Check if PDF was created
        pdf_data = buffer.getvalue()
        print(f"PDF generated successfully! Size: {len(pdf_data)} bytes")
        
        # Save test PDF
        with open('/home/dreamer/business-dashboard/test_report.pdf', 'wb') as f:
            f.write(pdf_data)
        print("Test PDF saved as test_report.pdf")
        
        return True
        
    except Exception as e:
        print(f"Error generating PDF: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = test_pdf_generation()
    if success:
        print("✅ PDF generation test passed!")
    else:
        print("❌ PDF generation test failed!")
