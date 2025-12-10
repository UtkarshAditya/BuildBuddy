# 🧪 BuildBuddy Authentication Testing Guide

## ✅ Authentication Setup Complete!

All pages are now protected with authentication. Users can **ONLY** view the home page without signing in!

---

## 🚀 Quick Start

### 1. Start Both Servers

**Frontend (Terminal 1):**

```powershell
npm run dev
```

Frontend will run on: http://localhost:3000

**Backend (Terminal 2):**

```powershell
cd backend
python manage.py runserver
```

Backend will run on: http://127.0.0.1:8000

---

## 📝 Demo Accounts

All demo accounts use the same password: **`password123`**

| Email                      | Name           | Role                 | Skills                 |
| -------------------------- | -------------- | -------------------- | ---------------------- |
| sarah.chen@example.com     | Sarah Chen     | Full Stack Developer | React, Node.js, Python |
| marcus.johnson@example.com | Marcus Johnson | UI/UX Designer       | Figma, UI Design       |
| alex.rodriguez@example.com | Alex Rodriguez | Backend Engineer     | Django, PostgreSQL     |
| priya.patel@example.com    | Priya Patel    | Data Scientist       | Python, TensorFlow     |
| david.kim@example.com      | David Kim      | Mobile Developer     | React Native, Swift    |
| emma.wilson@example.com    | Emma Wilson    | Frontend Developer   | React, TypeScript      |

---

## 🔐 Test Scenarios

### Test 1: Unauthenticated User Flow ✨

**Expected Behavior:** User can ONLY see home page

1. **Open browser in incognito/private mode**

   - Go to: http://localhost:3000

2. **Verify Home Page Access** ✅

   - ✅ Home page loads successfully
   - ✅ Navigation shows only "Home" link
   - ✅ Right side shows "Sign In" and "Sign Up" buttons
   - ✅ Hero section visible with tagline
   - ✅ Feature cards visible
   - ✅ Stats counter animation works

3. **Try Accessing Protected Pages Directly** 🚫

   - Try: http://localhost:3000/browse
     - ❌ Should redirect to `/login`
   - Try: http://localhost:3000/hackathons
     - ❌ Should redirect to `/login`
   - Try: http://localhost:3000/browse-teams
     - ❌ Should redirect to `/login`
   - Try: http://localhost:3000/messages
     - ❌ Should redirect to `/login`
   - Try: http://localhost:3000/team-dashboard
     - ❌ Should redirect to `/login`
   - Try: http://localhost:3000/settings
     - ❌ Should redirect to `/login`

4. **Verify Navigation Links** 🔍
   - Click on navigation items (Browse, Teams, Hackathons, etc.)
   - ❌ All should redirect to `/login`

**✅ PASS CRITERIA:**

- Home page is fully accessible
- All other pages redirect to login
- Navigation only shows "Home" link
- Sign In/Sign Up buttons visible

---

### Test 2: User Registration Flow 📝

**Expected Behavior:** New user can register and is auto-logged in

1. **Click "Sign Up" button**

   - Should navigate to: http://localhost:3000/register

2. **Fill Registration Form**

   - Full Name: `Test User`
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: `testpass123`
   - Confirm Password: `testpass123`

3. **Click "Create Account"**

   - ✅ Should show loading state
   - ✅ Should redirect to `/browse` page
   - ✅ Should be automatically logged in

4. **Verify Logged-In State**

   - ✅ Navigation shows ALL menu items:
     - Home, Browse, Browse Teams, Hackathons, Messages, My Teams
   - ✅ Sign In/Sign Up buttons are GONE
   - ✅ User dropdown appears (top right)
   - ✅ Dropdown shows: "Test User" or "testuser123"
   - ✅ Dropdown menu items: Settings, My Teams, Sign Out

5. **Navigate to Different Pages**
   - Click "Hackathons" → ✅ Should load
   - Click "Messages" → ✅ Should load
   - Click "My Teams" → ✅ Should load
   - Click "Settings" → ✅ Should load

**✅ PASS CRITERIA:**

- Registration successful
- Auto-login works
- Redirected to /browse
- All protected pages accessible
- User menu shows with correct name

---

### Test 3: User Login Flow 🔑

**Expected Behavior:** Existing user can log in with credentials

1. **Go to Login Page**

   - Click "Sign In" button OR
   - Go directly to: http://localhost:3000/login

2. **See Demo Credentials**

   - ✅ Demo credentials displayed on page
   - ✅ Shows: `sarah.chen@example.com / password123`

3. **Enter Credentials**

   - Email: `sarah.chen@example.com`
   - Password: `password123`

4. **Click "Sign In"**

   - ✅ Should show loading state
   - ✅ Should redirect to `/browse` page
   - ✅ Should be logged in

5. **Verify Logged-In State**

   - ✅ Navigation shows all protected items
   - ✅ Sign In button is GONE
   - ✅ User dropdown shows "Sarah Chen"
   - ✅ Browse page shows 6 real users from database

6. **Test Wrong Password**
   - Logout (if logged in)
   - Try login with: `sarah.chen@example.com / wrongpassword`
   - ❌ Should show error message
   - ❌ Should NOT redirect
   - ❌ Should stay on login page

**✅ PASS CRITERIA:**

- Login with correct credentials works
- Redirected to /browse after login
- All pages accessible when logged in
- Wrong credentials show error

---

### Test 4: Navigation State Changes 🎯

**Expected Behavior:** Navigation dynamically updates based on auth state

**When NOT Logged In:**

```
┌─────────────────────────────────────────────┐
│ BuildBuddy    [Home]           [Sign In]    │
│                                [Sign Up]    │
└─────────────────────────────────────────────┘
```

**When Logged In:**

```
┌──────────────────────────────────────────────────────────┐
│ BuildBuddy  [Home][Browse][Teams][Hackathons]           │
│             [Messages][My Teams]           [User ▼]     │
└──────────────────────────────────────────────────────────┘
```

1. **Test Navigation Visibility**

   - Logout → ✅ Only "Home" visible
   - Login → ✅ All items visible

2. **Test Dropdown Menu**

   - Click user avatar/name
   - ✅ Dropdown opens with:
     - Settings
     - My Teams
     - Sign Out

3. **Click "Settings" in Dropdown**

   - ✅ Navigate to `/settings`

4. **Click "My Teams" in Dropdown**
   - ✅ Navigate to `/team-dashboard`

**✅ PASS CRITERIA:**

- Navigation items show/hide correctly
- Dropdown menu appears when logged in
- Dropdown items navigate correctly

---

### Test 5: Sign Out Flow 🚪

**Expected Behavior:** User can log out and protected pages become inaccessible

1. **While Logged In:**

   - Verify you're on any protected page (e.g., `/browse`)
   - ✅ Page content loads

2. **Click User Dropdown**

   - Click on user name/avatar (top right)
   - ✅ Dropdown opens

3. **Click "Sign Out"**

   - ✅ Should redirect to `/login`
   - ✅ Should show logged out state

4. **Verify Logged-Out State**

   - ✅ Navigation only shows "Home"
   - ✅ Sign In/Sign Up buttons reappear
   - ✅ User dropdown is GONE

5. **Try Accessing Previous Page**

   - Go to: http://localhost:3000/browse
   - ❌ Should redirect to `/login`

6. **Navigate to Home Page**
   - Click "Home" or go to: http://localhost:3000
   - ✅ Home page loads successfully

**✅ PASS CRITERIA:**

- Sign out redirects to login
- Protected pages no longer accessible
- Navigation returns to public state
- Home page still accessible

---

### Test 6: Token Persistence 💾

**Expected Behavior:** Login state persists across page refreshes

1. **Log In**

   - Use: `sarah.chen@example.com / password123`
   - ✅ Successfully logged in

2. **Navigate to Browse Page**

   - Go to: http://localhost:3000/browse
   - ✅ Page loads with user data

3. **Refresh Page (F5 or Ctrl+R)**

   - ✅ Should stay logged in
   - ✅ Page should load (no redirect)
   - ✅ User data still shows

4. **Open New Tab**

   - Open: http://localhost:3000/hackathons
   - ✅ Should be logged in
   - ✅ Page loads successfully

5. **Close and Reopen Browser**
   - Close all browser windows
   - Reopen: http://localhost:3000/browse
   - ✅ Should still be logged in
   - ✅ JWT token persisted in localStorage

**✅ PASS CRITERIA:**

- Login state persists on refresh
- Login state persists across tabs
- Login state persists after browser restart

---

### Test 7: Direct URL Access 🔗

**Expected Behavior:** Direct URL access respects authentication

**When NOT Logged In:**

1. **Paste URLs Directly**

   - http://localhost:3000/browse → ❌ Redirect to `/login`
   - http://localhost:3000/hackathons → ❌ Redirect to `/login`
   - http://localhost:3000/messages → ❌ Redirect to `/login`
   - http://localhost:3000/settings → ❌ Redirect to `/login`

2. **Public URLs**
   - http://localhost:3000 → ✅ Home page loads
   - http://localhost:3000/login → ✅ Login page loads
   - http://localhost:3000/register → ✅ Register page loads

**When Logged In:**

3. **Paste URLs Directly**
   - http://localhost:3000/browse → ✅ Loads
   - http://localhost:3000/hackathons → ✅ Loads
   - http://localhost:3000/messages → ✅ Loads
   - http://localhost:3000/settings → ✅ Loads

**✅ PASS CRITERIA:**

- Protected pages redirect when not logged in
- Protected pages load when logged in
- Public pages always accessible

---

### Test 8: Loading States ⏳

**Expected Behavior:** Smooth loading experience with spinners

1. **Login Loading**

   - Enter credentials
   - Click "Sign In"
   - ✅ Button shows loading state
   - ✅ Button disabled during loading

2. **Protected Route Loading**

   - Access protected page while logged in
   - ✅ Shows spinner during auth check
   - ✅ Spinner is centered on screen
   - ✅ No flash of content

3. **Page Transitions**
   - Navigate between pages
   - ✅ Smooth transitions
   - ✅ No authentication flickering

**✅ PASS CRITERIA:**

- Loading spinners appear
- No content flash during auth check
- Buttons disabled during loading

---

## 📊 Protected Pages Checklist

| Page         | Route             | Protected    | Test Status   |
| ------------ | ----------------- | ------------ | ------------- |
| Home         | `/`               | ❌ Public    | ✅ Accessible |
| Login        | `/login`          | ❌ Public    | ✅ Accessible |
| Register     | `/register`       | ❌ Public    | ✅ Accessible |
| Browse       | `/browse`         | ✅ Protected | 🧪 Test       |
| Browse Teams | `/browse-teams`   | ✅ Protected | 🧪 Test       |
| Hackathons   | `/hackathons`     | ✅ Protected | 🧪 Test       |
| Messages     | `/messages`       | ✅ Protected | 🧪 Test       |
| My Teams     | `/team-dashboard` | ✅ Protected | 🧪 Test       |
| Settings     | `/settings`       | ✅ Protected | 🧪 Test       |

---

## 🐛 Common Issues & Fixes

### Issue 1: "Not redirecting to login"

**Fix:** Check browser console for errors. Clear localStorage and try again.

```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### Issue 2: "Login but still seeing Sign In button"

**Fix:** Check if AuthContext is properly wrapping the app in `layout.tsx`

### Issue 3: "Page keeps redirecting"

**Fix:** Check if JWT tokens are being saved properly

```javascript
// In browser console:
console.log(localStorage.getItem("access_token"));
console.log(localStorage.getItem("refresh_token"));
```

### Issue 4: "Backend connection failed"

**Fix:** Ensure Django server is running on port 8000

```powershell
cd backend
python manage.py runserver
```

### Issue 5: "CORS errors"

**Fix:** Check Django CORS settings in `backend/buildbuddy/settings.py`

---

## ✨ What to Test Next

1. **Password Validation**

   - Test weak passwords (< 8 characters)
   - Test password mismatch on register

2. **Form Validation**

   - Test empty fields
   - Test invalid email formats
   - Test duplicate username/email

3. **API Integration**

   - Test Browse page with real user data
   - Test Hackathons page with real hackathon data
   - Test Teams page with real team data

4. **Error Handling**

   - Test network offline
   - Test backend server down
   - Test invalid tokens

5. **User Experience**
   - Test mobile responsive design
   - Test dark mode
   - Test keyboard navigation
   - Test screen readers

---

## 🎉 Success Criteria

**All tests pass when:**

✅ Unauthenticated users can ONLY access:

- Home page (`/`)
- Login page (`/login`)
- Register page (`/register`)

✅ All other pages require authentication:

- `/browse`
- `/browse-teams`
- `/hackathons`
- `/messages`
- `/team-dashboard`
- `/settings`

✅ Navigation dynamically shows/hides based on auth state

✅ Sign In button disappears when logged in

✅ User dropdown appears when logged in

✅ Logout works and returns to public state

✅ Login persists across page refreshes

---

## 📸 Visual Verification

### Unauthenticated State

```
┌─────────────────────────────────────────┐
│ 🏠 Home Page                            │
│                                         │
│ ✅ Fully visible                        │
│ ✅ Hero section                         │
│ ✅ Features                             │
│ ✅ Stats                                │
│                                         │
│ Nav: [Home] only                        │
│ Buttons: [Sign In] [Sign Up]           │
└─────────────────────────────────────────┘

Try accessing /browse → 🚫 Redirect to /login
```

### Authenticated State

```
┌─────────────────────────────────────────┐
│ 👥 Browse Page                          │
│                                         │
│ ✅ Real users from database             │
│ ✅ Search and filters working           │
│ ✅ All navigation items visible         │
│                                         │
│ Nav: [Home][Browse][Teams][Hackathons]  │
│      [Messages][My Teams]               │
│ Right: [User Name ▼]                    │
│                                         │
│ Sign In button: ❌ GONE!                │
└─────────────────────────────────────────┘

All protected pages → ✅ Accessible
```

---

**Happy Testing! 🚀**

If all tests pass, your authentication system is working perfectly! 🎉
