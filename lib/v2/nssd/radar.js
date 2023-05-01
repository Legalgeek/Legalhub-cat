module.exports = {
    '/www.nssd.cn': {
        _name: 'nssd',
        '.': [
            {
                title: '国家哲学社会科学学术期刊数据库',
                docs: 'https://www.nssd.cn/',
                source: ['/flk/:category'],
                target: '/npc/flk/',
            },
        ],
    },
};
