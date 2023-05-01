module.exports = {
    'flk.npc.gov.cn': {
        _name: 'flk',
        '.': [
            {
                title: '国家法律法规数据库',
                docs: 'https://docs.rsshub.app/programming.html#legalhub',
                source: ['/flk/:category'],
                target: '/npc/flk/',
            },
        ],
    },
};
