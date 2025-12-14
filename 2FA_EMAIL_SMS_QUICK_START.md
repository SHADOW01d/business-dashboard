# Email & SMS 2FA - Quick Start (5 Minutes) ⚡

## 🚀 Quick Setup

### Option 1: Email Only (Recommended for Testing)

#### Step 1: Get SendGrid API Key (2 min)
```bash
# 1. Go to https://sendgrid.com
# 2. Sign up (free account)
# 3. Go to Settings → API Keys
# 4. Create API Key
# 5. Copy the key
```

#### Step 2: Update Environment (1 min)
```bash
# Create/edit .env file
echo "SENDGRID_API_KEY=SG.your-key-here" >> .env
```

#### Step 3: Install & Test (2 min)
```bash
# Activate virtual environment
source venv/bin/activate

# Install packages
pip install sendgrid==6.11.0

# Restart Django
python manage.py runserver
```

#### Step 4: Test It!
```bash
# 1. Go to http://localhost:3000
# 2. Login
# 3. Go to Settings → 2FA
# 4. Click Enable 2FA
# 5. Select "Email"
# 6. Click Enable
# 7. Check your email for code
# 8. Enter code in modal
# 9. Success! ✅
```

---

### Option 2: SMS Only

#### Step 1: Get Twilio Credentials (2 min)
```bash
# 1. Go to https://twilio.com
# 2. Sign up (free account with $15 credit)
# 3. Verify phone number
# 4. Go to Account → API Keys & Tokens
# 5. Copy Account SID
# 6. Copy Auth Token
# 7. Go to Phone Numbers → Get a Number
# 8. Buy a phone number
# 9. Copy the number
```

#### Step 2: Update Environment (1 min)
```bash
# Create/edit .env file
echo "TWILIO_ACCOUNT_SID=ACxxxxxxxx" >> .env
echo "TWILIO_AUTH_TOKEN=your-token" >> .env
echo "TWILIO_PHONE_NUMBER=+1234567890" >> .env
```

#### Step 3: Install & Test (2 min)
```bash
# Activate virtual environment
source venv/bin/activate

# Install packages
pip install twilio==9.0.0

# Restart Django
python manage.py runserver
```

#### Step 4: Test It!
```bash
# 1. Go to http://localhost:3000
# 2. Login
# 3. Go to Settings → 2FA
# 4. Click Enable 2FA
# 5. Select "SMS"
# 6. Enter your phone number
# 7. Click Enable
# 8. Check your phone for SMS
# 9. Enter code in modal
# 10. Success! ✅
```

---

### Option 3: Both Email & SMS

#### Step 1: Get Both Credentials (3 min)
```bash
# SendGrid: https://sendgrid.com → API Keys
# Twilio: https://twilio.com → Account → API Keys
```

#### Step 2: Update Environment (1 min)
```bash
# Create/edit .env file
echo "SENDGRID_API_KEY=SG.your-key-here" >> .env
echo "TWILIO_ACCOUNT_SID=ACxxxxxxxx" >> .env
echo "TWILIO_AUTH_TOKEN=your-token" >> .env
echo "TWILIO_PHONE_NUMBER=+1234567890" >> .env
```

#### Step 3: Install & Test (1 min)
```bash
# Activate virtual environment
source venv/bin/activate

# Install both packages
pip install sendgrid==6.11.0 twilio==9.0.0

# Restart Django
python manage.py runserver
```

#### Step 4: Test Both!
```bash
# Test Email:
# 1. Settings → 2FA → Enable
# 2. Select "Email" → Enable
# 3. Check email for code

# Test SMS:
# 1. Settings → 2FA → Disable
# 2. Settings → 2FA → Enable
# 3. Select "SMS" → Enter phone → Enable
# 4. Check SMS for code
```

---

## 📋 What You Need

### For Email (SendGrid)
- ✅ Email address
- ✅ 2 minutes to sign up
- ✅ Free account (100 emails/day)

### For SMS (Twilio)
- ✅ Phone number
- ✅ 2 minutes to sign up
- ✅ Free trial ($15 credit)

### For Both
- ✅ 5 minutes total
- ✅ Both free accounts
- ✅ No credit card needed (for free tier)

---

## 🔑 Environment Variables

### .env File Template
```bash
# Email (SendGrid)
SENDGRID_API_KEY=SG.your-api-key-here

# SMS (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_PHONE_NUMBER=+1234567890
```

### How to Create .env File
```bash
# In project root directory
cat > .env << EOF
SENDGRID_API_KEY=SG.your-key-here
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
EOF
```

---

## ✅ Verification Checklist

### Email Setup
- [ ] SendGrid account created
- [ ] API key copied
- [ ] .env file updated
- [ ] sendgrid package installed
- [ ] Django restarted
- [ ] Email received in test

### SMS Setup
- [ ] Twilio account created
- [ ] Credentials copied
- [ ] Phone number purchased
- [ ] .env file updated
- [ ] twilio package installed
- [ ] Django restarted
- [ ] SMS received in test

### Frontend Testing
- [ ] Can enable email 2FA
- [ ] Can enable SMS 2FA
- [ ] Can enable authenticator 2FA
- [ ] Code received via chosen method
- [ ] Code verification works
- [ ] Login successful

---

## 🧪 Quick Test Commands

### Test Email Sending
```bash
# In Django shell
python manage.py shell

from sales.views import TwoFactorAuthViewSet
from django.contrib.auth.models import User

user = User.objects.first()
viewset = TwoFactorAuthViewSet()
viewset._send_email_code(user, "123456")

# Check console output
```

### Test SMS Sending
```bash
# In Django shell
python manage.py shell

from sales.views import TwoFactorAuthViewSet

viewset = TwoFactorAuthViewSet()
viewset._send_sms_code("+1234567890", "123456")

# Check console output
```

---

## 🚀 One-Command Setup

### Email Only
```bash
source venv/bin/activate && \
echo "SENDGRID_API_KEY=SG.your-key-here" >> .env && \
pip install sendgrid==6.11.0 && \
python manage.py runserver
```

### SMS Only
```bash
source venv/bin/activate && \
echo "TWILIO_ACCOUNT_SID=ACxxxxxxxx" >> .env && \
echo "TWILIO_AUTH_TOKEN=your-token" >> .env && \
echo "TWILIO_PHONE_NUMBER=+1234567890" >> .env && \
pip install twilio==9.0.0 && \
python manage.py runserver
```

### Both
```bash
source venv/bin/activate && \
echo "SENDGRID_API_KEY=SG.your-key-here" >> .env && \
echo "TWILIO_ACCOUNT_SID=ACxxxxxxxx" >> .env && \
echo "TWILIO_AUTH_TOKEN=your-token" >> .env && \
echo "TWILIO_PHONE_NUMBER=+1234567890" >> .env && \
pip install sendgrid==6.11.0 twilio==9.0.0 && \
python manage.py runserver
```

---

## 🎯 Testing Workflow

### 1. Enable Email 2FA
```
Dashboard → Settings → 2FA Tab
↓
Click "Enable 2FA"
↓
Select "Email"
↓
Click "Enable"
↓
Save backup codes
↓
Logout
↓
Login again
↓
2FA modal appears
↓
Check email for code
↓
Enter code
↓
Success! ✅
```

### 2. Enable SMS 2FA
```
Dashboard → Settings → 2FA Tab
↓
Click "Disable 2FA" (to disable email)
↓
Click "Enable 2FA"
↓
Select "SMS"
↓
Enter phone number
↓
Click "Enable"
↓
Save backup codes
↓
Logout
↓
Login again
↓
2FA modal appears
↓
Check SMS for code
↓
Enter code
↓
Success! ✅
```

---

## 📊 Status After Setup

| Feature | Status |
|---------|--------|
| Email 2FA | ✅ Working |
| SMS 2FA | ✅ Working |
| Authenticator 2FA | ✅ Working |
| Backup Codes | ✅ Working |
| Login Flow | ✅ Working |
| User Settings | ✅ Working |
| Dark/Light Mode | ✅ Working |

---

## 🎉 You're Done!

Your ProShop 2FA system is now fully functional with:
- ✅ Email verification
- ✅ SMS verification
- ✅ Authenticator app support
- ✅ Backup codes
- ✅ Professional UI
- ✅ Production ready

---

## 📞 Troubleshooting

### Email Not Working?
```bash
# 1. Check API key in .env
# 2. Verify sender email in SendGrid
# 3. Check console for errors
# 4. Restart Django server
```

### SMS Not Working?
```bash
# 1. Check credentials in .env
# 2. Verify phone number format
# 3. Check Twilio account has credit
# 4. Check console for errors
# 5. Restart Django server
```

### Still Not Working?
```bash
# Check detailed setup guide:
# See: 2FA_EMAIL_SMS_SETUP.md
```

---

**Email & SMS 2FA Setup Complete! 🚀**
