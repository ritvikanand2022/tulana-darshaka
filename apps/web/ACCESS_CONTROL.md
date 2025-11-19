# Comparo Access Control System

## Overview

Comparo includes a temporary password protection system to secure the application during beta/development phases. This prevents unauthorized access while maintaining a smooth user experience for authorized users.

## How It Works

1. **Password Gate**: Users visiting the app for the first time see a password entry screen
2. **Local Storage**: Once authenticated, the access is stored in localStorage
3. **Persistent Access**: Users don't need to re-enter the password on subsequent visits
4. **Easy Reset**: Clear localStorage to require password re-entry

## Default Passwords

The following passwords are configured by default (development/beta use):

- `comparo2024` (recommended for development)
- `beta123` (recommended for beta testing)
- `preview2024` (recommended for client previews)

## Configuration

### Adding/Changing Passwords

Edit `apps/web/pages/index.vue` and modify the `validPasswords` array:

```typescript
const validPasswords = [
  'comparo2024',
  'beta123',
  'preview2024',
  'your-custom-password',  // Add your passwords here
]
```

### Disabling Password Protection

To disable the password gate entirely, you can:

**Option 1**: Pre-authorize in localStorage
```javascript
localStorage.setItem('app_authorized', 'true')
```

**Option 2**: Modify `apps/web/pages/index.vue`
```typescript
// Change this line
const isAppAuthorized = computed(() => true)  // Always authorized
```

## For Production

⚠️ **Important Security Notes**:

1. **Use Environment Variables**: Move passwords to `.env` file
   ```
   NUXT_PUBLIC_APP_PASSWORDS=password1,password2,password3
   ```

2. **Strong Passwords**: Use cryptographically strong passwords
   ```bash
   # Generate strong password
   openssl rand -base64 32
   ```

3. **Consider Alternatives**: For production, consider:
   - OAuth2/OIDC authentication
   - API key-based access
   - IP whitelisting
   - VPN access

4. **Rate Limiting**: Implement rate limiting to prevent brute force attacks

## User Flow

```
User visits site
    ↓
Password gate shown
    ↓
User enters password
    ↓
Password validated against list
    ↓
✓ Valid: Store authorization → Show landing page
✗ Invalid: Show error → Retry
```

## Clearing Access

### For Users
Clear browser localStorage:
```javascript
localStorage.removeItem('app_authorized')
```
Or clear all site data in browser settings.

### For Developers
```bash
# Chrome DevTools
Application → Storage → Local Storage → Clear
```

## Development Mode

In development, a hint message shows the default password:
```
DEV MODE: Default password is "comparo2024"
```

This is automatically hidden in production builds.

## API Integration

This is a **client-side only** protection suitable for:
- Beta testing
- Client previews
- Development environments
- Low-security scenarios

For production applications, implement **server-side authentication** with your backend API.

## Troubleshooting

### Password not working
1. Check for typos (passwords are case-sensitive)
2. Ensure JavaScript is enabled
3. Clear browser cache and cookies
4. Check browser console for errors

### Access lost after browser update
This is normal - localStorage can be cleared by browsers. Just re-enter the password.

### Password gate not showing
1. Check that `isAppAuthorized` is false in index.vue
2. Verify localStorage is empty
3. Hard refresh the page (Ctrl+Shift+R)

## Best Practices

1. ✅ **Change default passwords** immediately
2. ✅ **Document passwords** securely (password manager)
3. ✅ **Rotate passwords** periodically
4. ✅ **Use different passwords** per environment
5. ✅ **Monitor access** logs (when integrated with backend)
6. ❌ **Don't commit** passwords to git
7. ❌ **Don't share** passwords via email
8. ❌ **Don't use** for high-security requirements

## Future Enhancements

Consider implementing:
- [ ] Time-limited access codes
- [ ] User invitation system
- [ ] Multi-factor authentication
- [ ] Session management
- [ ] Activity logging
- [ ] Password expiration
- [ ] Role-based access control
