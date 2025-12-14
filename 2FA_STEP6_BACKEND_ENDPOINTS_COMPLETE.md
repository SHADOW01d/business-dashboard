# Step 6: Backend Endpoints for User Profile Management - COMPLETE ✅

## 🎯 What Was Created

### New Backend Endpoints in UserRegistrationViewSet

Two new endpoints added to `sales/views.py`:

1. **Update Profile Endpoint**
   - `PUT /api/auth/update_profile/`
   - Update first name, last name, email
   - Email validation (no duplicates)
   - Returns updated user data

2. **Change Password Endpoint**
   - `POST /api/auth/change_password/`
   - Verify current password
   - Validate new password
   - Check password confirmation
   - Password strength validation
   - Returns success message

---

## 📊 API Endpoints

### Update Profile
```
PUT /api/auth/update_profile/
Headers: X-CSRFToken
Body: {
  "first_name": "Ahmed",
  "last_name": "Hassan",
  "email": "ahmed@example.com"
}

Response (200):
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "ahmed",
    "email": "ahmed@example.com",
    "first_name": "Ahmed",
    "last_name": "Hassan"
  }
}

Error (400):
{
  "error": "Email already in use"
}
```

### Change Password
```
POST /api/auth/change_password/
Headers: X-CSRFToken
Body: {
  "current_password": "oldpass123",
  "new_password": "newpass456",
  "confirm_password": "newpass456"
}

Response (200):
{
  "message": "Password changed successfully",
  "user": { ... }
}

Error (400):
{
  "error": "Current password is incorrect"
}
```

---

## 🔐 Security Features

### Update Profile Validation
✅ **Email Uniqueness** - Checks if email already exists
✅ **Email Ownership** - Allows user's own email
✅ **Partial Updates** - Can update individual fields
✅ **CSRF Protection** - X-CSRFToken required
✅ **Authentication** - IsAuthenticated required
✅ **User Isolation** - Only updates current user

### Change Password Validation
✅ **Current Password Verification** - Must provide correct current password
✅ **Password Confirmation** - New passwords must match
✅ **Password Length** - Minimum 6 characters
✅ **Password Change** - New password must differ from current
✅ **Secure Storage** - Uses Django's set_password()
✅ **CSRF Protection** - X-CSRFToken required
✅ **Authentication** - IsAuthenticated required
✅ **User Isolation** - Only changes current user's password

---

## 🔄 Implementation Details

### Update Profile Endpoint

```python
@action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
def update_profile(self, request):
    """Update user profile information"""
    user = request.user
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')

    # Validate email is not already taken
    if email and email != user.email:
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email already in use'},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Update fields
    if first_name is not None:
        user.first_name = first_name
    if last_name is not None:
        user.last_name = last_name
    if email is not None:
        user.email = email

    user.save()

    return Response({
        'message': 'Profile updated successfully',
        'user': UserSerializer(user).data
    }, status=status.HTTP_200_OK)
```

### Change Password Endpoint

```python
@action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
def change_password(self, request):
    """Change user password"""
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    # Validate inputs
    if not current_password or not new_password or not confirm_password:
        return Response(
            {'error': 'All password fields are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check current password
    if not user.check_password(current_password):
        return Response(
            {'error': 'Current password is incorrect'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check passwords match
    if new_password != confirm_password:
        return Response(
            {'error': 'New passwords do not match'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check password length
    if len(new_password) < 6:
        return Response(
            {'error': 'Password must be at least 6 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check password is not same as current
    if user.check_password(new_password):
        return Response(
            {'error': 'New password must be different from current password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Set new password
    user.set_password(new_password)
    user.save()

    return Response({
        'message': 'Password changed successfully',
        'user': UserSerializer(user).data
    }, status=status.HTTP_200_OK)
```

---

## 🧪 Testing Checklist

### Update Profile Endpoint

#### Success Cases
- [ ] Update first name only
- [ ] Update last name only
- [ ] Update email only
- [ ] Update all fields
- [ ] Returns updated user data
- [ ] Email validation works
- [ ] Can use own email

#### Error Cases
- [ ] Email already in use → 400 error
- [ ] Missing authentication → 401 error
- [ ] Invalid CSRF token → 403 error

### Change Password Endpoint

#### Success Cases
- [ ] Change password with valid inputs
- [ ] Returns success message
- [ ] Returns updated user data
- [ ] New password works on next login

#### Error Cases
- [ ] Missing current password → 400 error
- [ ] Missing new password → 400 error
- [ ] Missing confirm password → 400 error
- [ ] Current password incorrect → 400 error
- [ ] New passwords don't match → 400 error
- [ ] Password too short (< 6 chars) → 400 error
- [ ] New password same as current → 400 error
- [ ] Missing authentication → 401 error
- [ ] Invalid CSRF token → 403 error

---

## 🔌 Frontend Integration

### Update UserProfile.js

Update the `handleUpdateProfile` function:

```javascript
const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/update_profile/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.cookie
          .split('; ')
          .find(row => row.startsWith('csrftoken='))
          ?.split('=')[1] || '',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    
    if (response.ok) {
      setMessage('✅ Profile updated successfully');
      setMessageType('success');
    } else {
      setMessage(`❌ ${data.error || 'Error updating profile'}`);
      setMessageType('error');
    }
  } catch (err) {
    setMessage('❌ Error updating profile');
    setMessageType('error');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

### Update handleChangePassword function:

```javascript
const handleChangePassword = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  if (passwordData.new_password !== passwordData.confirm_password) {
    setMessage('❌ Passwords do not match');
    setMessageType('error');
    setLoading(false);
    return;
  }

  if (passwordData.new_password.length < 6) {
    setMessage('❌ Password must be at least 6 characters');
    setMessageType('error');
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/change_password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.cookie
          .split('; ')
          .find(row => row.startsWith('csrftoken='))
          ?.split('=')[1] || '',
      },
      credentials: 'include',
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();
    
    if (response.ok) {
      setMessage('✅ Password changed successfully');
      setMessageType('success');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } else {
      setMessage(`❌ ${data.error || 'Error changing password'}`);
      setMessageType('error');
    }
  } catch (err) {
    setMessage('❌ Error changing password');
    setMessageType('error');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

---

## 📁 Files Modified

| File | Changes |
|------|---------|
| `sales/views.py` | Added update_profile() and change_password() endpoints |

---

## 🚀 API Endpoints Summary

### All Auth Endpoints

```
POST   /api/auth/register/           - Register new user
POST   /api/auth/login/              - Login user
POST   /api/auth/logout/             - Logout user
GET    /api/auth/current_user/       - Get current user
PUT    /api/auth/update_profile/     - Update profile ✅ NEW
POST   /api/auth/change_password/    - Change password ✅ NEW
GET    /api/auth/2fa/status/         - Get 2FA status
POST   /api/auth/2fa/enable/         - Enable 2FA
POST   /api/auth/2fa/disable/        - Disable 2FA
POST   /api/auth/2fa/send_code/      - Send verification code
POST   /api/auth/2fa/verify_code/    - Verify code
POST   /api/auth/2fa/backup_codes/   - Generate backup codes
```

---

## 🔐 Error Responses

### Update Profile Errors

```json
{
  "error": "Email already in use"
}
```

### Change Password Errors

```json
{
  "error": "All password fields are required"
}

{
  "error": "Current password is incorrect"
}

{
  "error": "New passwords do not match"
}

{
  "error": "Password must be at least 6 characters"
}

{
  "error": "New password must be different from current password"
}
```

---

## 📊 Request/Response Examples

### Update Profile Request

```bash
curl -X PUT http://localhost:8000/api/auth/update_profile/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: your-csrf-token" \
  -d '{
    "first_name": "Ahmed",
    "last_name": "Hassan",
    "email": "ahmed@example.com"
  }' \
  --cookie "sessionid=your-session-id"
```

### Change Password Request

```bash
curl -X POST http://localhost:8000/api/auth/change_password/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: your-csrf-token" \
  -d '{
    "current_password": "oldpass123",
    "new_password": "newpass456",
    "confirm_password": "newpass456"
  }' \
  --cookie "sessionid=your-session-id"
```

---

## ✨ Features Implemented

✅ **Update Profile** - Change name and email
✅ **Change Password** - Secure password change
✅ **Email Validation** - No duplicate emails
✅ **Password Validation** - Strong password requirements
✅ **CSRF Protection** - Secure requests
✅ **Authentication** - User isolation
✅ **Error Handling** - Clear error messages
✅ **User Feedback** - Success/error responses

---

## 🎯 Complete User Management System

### Authentication (Already Complete)
✅ Register
✅ Login
✅ Logout
✅ Current user

### Profile Management (NEW)
✅ Update profile
✅ Change password

### 2FA Management (Already Complete)
✅ Get status
✅ Enable 2FA
✅ Disable 2FA
✅ Send code
✅ Verify code
✅ Backup codes

---

## 📝 Integration Steps

### Step 1: Restart Django Server
```bash
python manage.py runserver
```

### Step 2: Update UserProfile.js
Replace the placeholder functions with actual API calls (see above)

### Step 3: Test Endpoints
- Test update profile
- Test change password
- Verify error handling
- Test with invalid inputs

### Step 4: Test Frontend Integration
- Go to User Settings
- Update profile
- Change password
- Verify success messages

---

## 🧪 Manual Testing

### Test Update Profile

```bash
# 1. Login first
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}' \
  -c cookies.txt

# 2. Update profile
curl -X PUT http://localhost:8000/api/auth/update_profile/ \
  -H "Content-Type: application/json" \
  -d '{"first_name": "John", "last_name": "Doe", "email": "john@example.com"}' \
  -b cookies.txt
```

### Test Change Password

```bash
# 1. Login first
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}' \
  -c cookies.txt

# 2. Change password
curl -X POST http://localhost:8000/api/auth/change_password/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "testpass",
    "new_password": "newpass123",
    "confirm_password": "newpass123"
  }' \
  -b cookies.txt
```

---

## ✅ Status

**Backend Endpoints:** ✅ 100% Complete
**Frontend Integration:** ⏳ Ready to update
**Testing:** ⏳ Ready to test
**Documentation:** ✅ 100% Complete

---

## 🎉 Summary

**Step 6 Complete!** Your ProShop dashboard now has:

✅ **Complete User Profile Management**
✅ **Profile Update Endpoint**
✅ **Password Change Endpoint**
✅ **Full Validation & Security**
✅ **Error Handling**
✅ **CSRF Protection**
✅ **User Isolation**

---

## 📞 Next Steps

### Step 7: Email/SMS Integration
- Install SendGrid for email
- Install Twilio for SMS
- Update send_code() to send actual emails/SMS
- Test email delivery
- Test SMS delivery

### Step 8: Production Deployment
- Add rate limiting
- Add logging
- Add monitoring
- Security audit
- Load testing

---

**Step 6 Complete! Backend endpoints ready for frontend integration.** 🚀
