/*eslint-disable no-undef*/
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
} else {
    __webpack_public_path__ = window.Config.BASE_URL + "/"; 
}
/*eslint-enable no-undef*/
