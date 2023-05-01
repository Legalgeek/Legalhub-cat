module.exports = (router) => {
    router.get('/lifa', require('./lifa'));
    router.get('/msaj', require('./msaj'));
    router.get('/xsaj', require('./xsaj'));
    router.get('/xzaj', require('./xzaj'));
    router.get('/dxal', require('./dxal'));
    router.get('/msyj', require('./msyj'));
    router.get('/xsyj', require('./xsyj'));
    router.get('/xzyj', require('./xzyj'));
    router.get('/zgfy', require('./zgfy'));
};
