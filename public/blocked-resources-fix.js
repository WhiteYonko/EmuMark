// Development helper to handle blocked resources
(function() {
  'use strict';
  
  // Override console.error to filter out blocked resource errors
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('ERR_BLOCKED_BY_CLIENT') || 
        message.includes('net::ERR_BLOCKED_BY_CLIENT')) {
      console.warn('🔒 Resource blocked by browser extension:', args[0]);
      return;
    }
    originalError.apply(console, args);
  };
  
  // Handle fetch errors
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).catch(error => {
      if (error.message && error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        console.warn('🔒 Fetch blocked by browser extension:', args[0]);
        return Promise.resolve(new Response('{}', { status: 200 }));
      }
      throw error;
    });
  };
  
  // Handle XMLHttpRequest errors
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this.addEventListener('error', function(event) {
      if (event.target.status === 0 && event.target.readyState === 4) {
        console.warn('🔒 XHR blocked by browser extension:', url);
      }
    });
    return originalXHROpen.call(this, method, url, ...args);
  };
  
  console.log('🛡️ Blocked resources handler loaded');
})();
