# Authentication Implementation

## Overview
The application now includes a complete authentication system with user-specific data isolation. Each user has their own drafts and settings that are stored separately.

## User Accounts

### VSS Electricals User
- **Email:** `vsselectricals@vstudio.com`
- **Password:** `vss1234`
- **Permissions:** Full access to all templates including VSS and CVS templates
- **Templates Available:** VSS, CVS, Classic, Modern, Professional, Ginyard

### SV Electricals User
- **Email:** `svelectricals001@vstudio.com`
- **Password:** `sv1234`
- **Permissions:** Limited access - VSS and CVS templates are hidden
- **Templates Available:** Classic, Modern, Professional, Ginyard

## Features

### 1. **User Authentication**
- Hard-coded authentication with two user accounts
- Login page with email and password fields
- Session persistence using localStorage
- Automatic redirect to login for unauthenticated users
- Automatic redirect to dashboard for authenticated users

### 2. **User-Specific Data Isolation**
Each user has completely separate data:

#### Drafts
- Stored with user-specific key: `invoice-drafts-{user.email}`
- Each user can only see and manage their own drafts
- No cross-user data visibility

#### Settings
- Stored with user-specific key: `company-settings-{user.email}`
- Company information, logo, and default template preferences are unique per user
- Settings don't affect other users

### 3. **Template Access Control**
- **VSS User:** Can access all templates including VSS and CVS
- **SV User:** Cannot see or select VSS and CVS templates
- Template dropdown dynamically filters based on user permissions
- Default template selection respects user permissions

### 4. **User Interface Updates**
- Top header bar showing logged-in user's name and email
- Logout button in the header
- Login page with demo account credentials displayed
- All routes protected except `/login`

## Technical Implementation

### Files Created/Modified

#### New Files
1. `/src/lib/auth-context.tsx` - Authentication context provider
2. `/src/app/login/page.tsx` - Login page component
3. `/src/components/layout-wrapper.tsx` - Authentication-aware layout wrapper
4. `/docs/AUTHENTICATION.md` - This documentation

#### Modified Files
1. `/src/app/layout.tsx` - Added AuthProvider wrapper
2. `/src/components/app-layout.tsx` - Added user info header and logout
3. `/src/app/page.tsx` - Updated to redirect based on auth status
4. `/src/app/invoices/new/page.tsx` - User-specific drafts and template filtering
5. `/src/app/dashboard/page.tsx` - User-specific draft management
6. `/src/app/settings/page.tsx` - User-specific settings storage

### Data Storage Structure

```typescript
// LocalStorage Keys
localStorage['current-user']                          // Current logged-in user
localStorage['invoice-drafts-{email}']               // User-specific drafts
localStorage['company-settings-{email}']             // User-specific settings

// User Object
{
  email: string;
  name: string;
  canAccessVSSTemplates: boolean;
}
```

### Authentication Flow

1. **Initial Load**
   - App checks for `current-user` in localStorage
   - If found, auto-login and redirect to dashboard
   - If not found, redirect to login page

2. **Login Process**
   - User enters email and password
   - Credentials validated against hard-coded users
   - On success: User object saved to localStorage, redirect to dashboard
   - On failure: Error message displayed

3. **Protected Routes**
   - All routes except `/login` require authentication
   - LayoutWrapper component handles automatic redirects
   - Unauthenticated users cannot access protected pages

4. **Logout Process**
   - User clicks logout button
   - `current-user` removed from localStorage
   - User redirected to login page

## Usage Guide

### For VSS Electricals Users
1. Login with `vsselectricals@vstudio.com` / `vss1234`
2. Access all templates including VSS and CVS
3. Create and manage invoices/quotations
4. All drafts and settings are private to this account

### For SV Electricals Users
1. Login with `svelectricals001@vstudio.com` / `sv1234`
2. Access Classic, Modern, Professional, and Ginyard templates
3. VSS and CVS templates are not visible
4. All drafts and settings are private to this account

## Security Notes

⚠️ **Important:** This is a client-side only authentication system intended for demo/simple use cases.

- Passwords are hard-coded in the client-side code
- No actual server-side validation
- Data is stored in browser localStorage
- Not suitable for production with real user data
- Should be replaced with proper backend authentication for production use

## Future Enhancements

If you need to add more users in the future, edit `/src/lib/auth-context.tsx`:

```typescript
const USERS = {
  'vsselectricals@vstudio.com': {
    password: 'vss1234',
    name: 'VSS Electricals',
    canAccessVSSTemplates: true,
  },
  'svelectricals001@vstudio.com': {
    password: 'sv1234',
    name: 'SV Electricals',
    canAccessVSSTemplates: false,
  },
  // Add new users here
  'newuser@vstudio.com': {
    password: 'password123',
    name: 'New User Name',
    canAccessVSSTemplates: false, // or true for VSS/CVS access
  },
};
```

## Testing

1. **Test User Isolation:**
   - Login as VSS user, create some drafts
   - Logout and login as SV user
   - Verify SV user cannot see VSS user's drafts
   - Create drafts as SV user
   - Logout and login back as VSS user
   - Verify VSS user only sees their own drafts

2. **Test Template Access:**
   - Login as VSS user - verify VSS and CVS templates are available
   - Login as SV user - verify VSS and CVS templates are hidden

3. **Test Settings Isolation:**
   - Login as VSS user, configure settings
   - Login as SV user, configure different settings
   - Verify each user maintains their own settings
