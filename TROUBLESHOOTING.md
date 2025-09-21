# EmuMark Troubleshooting Guide

## ERR_BLOCKED_BY_CLIENT Error Fix

This error occurs when browser extensions block network requests. Here's how to fix it:

### Quick Fixes

1. **Open in Incognito Mode** (Recommended)
   ```bash
   # Open your browser in incognito/private mode
   # This disables most extensions
   ```

2. **Disable Extensions Temporarily**
   - Go to browser extensions settings
   - Disable ad blockers, privacy extensions
   - Refresh the page

3. **Whitelist Localhost**
   - For uBlock Origin: Click extension → "Disable on this site"
   - For AdBlock Plus: Add `localhost:3000` to whitelist
   - For Privacy Badger: Disable on localhost

### Development Commands

```bash
# Clean start (recommended)
npm run dev:clean

# Regular start
npm run dev

# Build for production
npm run build:clean
```

### Browser-Specific Solutions

#### Chrome/Edge
1. Open DevTools (F12)
2. Go to Network tab
3. Look for red/canceled requests
4. Right-click → "Open in new tab" to test

#### Firefox
1. Open DevTools (F12)
2. Go to Network tab
3. Check for blocked requests
4. Disable "Enhanced Tracking Protection" for localhost

#### Safari
1. Go to Safari → Preferences → Privacy
2. Uncheck "Prevent cross-site tracking"
3. Or use Develop menu → "Disable Cross-Origin Restrictions"

### Alternative Solutions

1. **Use Different Port**
   ```bash
   npm run dev -- --port 3001
   ```

2. **Use Different Host**
   ```bash
   npm run dev -- --host 127.0.0.1
   ```

3. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear site data in DevTools

### If Nothing Works

1. **Try Different Browser**
   - Use a browser without extensions
   - Or create a new browser profile

2. **Check Network Settings**
   - Disable VPN if using one
   - Check corporate firewall settings

3. **Use Production Build**
   ```bash
   npm run build
   npm run preview
   ```

### Common Blocked Resources

- Google Fonts
- Analytics scripts
- External CDNs
- Social media widgets
- Tracking pixels

### Prevention

The app is configured to handle these errors gracefully:
- Error handling in main.tsx
- CSP headers in index.html
- Optimized Vite configuration
- No external dependencies

### Still Having Issues?

1. Check browser console for specific errors
2. Try the clean development command: `npm run dev:clean`
3. Use incognito mode as a quick test
4. Check if your antivirus is blocking localhost connections
