module.exports = (router) => {
    router.get('/tags/:tagName', require('./tags'));
};
