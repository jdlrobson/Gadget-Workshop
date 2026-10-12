Live previews and current code can be found at:
https://wvlistingeditor.netlify.app/

# Local development

```
npm run dev
```
Build new versions of the code using:
```
npm start
```

# Debugging saves

Saves to do not go to the server. You can override save requests to simulate a given response.
All requests are delayed.

```
window.__save_debug = -1; // error
window.__save_debug = -2; // force captcha
window.__save_debug = -3; // simulate spam
window.__save_debug = -4; // http error
window.__save_debug = -5; // empty - eg. no change
window.__save_debug = -6; // unknown error


window.__save_debug = 0; // success but no change
window.__save_debug = 1; // success
```
