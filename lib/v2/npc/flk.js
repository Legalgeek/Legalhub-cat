// 导入所需模组
const got = require('@/utils/got'); // 自订的 got
const { parseDate } = require('@/utils/parse-date');
// const cheerio = require('cheerio'); // 可以使用类似 jQuery 的 API HTML 解析器

module.exports = async (ctx) => {
    // 编写逻辑
    const { category = 'flfg' } = ctx.params;

    let leixing = '';

    switch (category) {
        case 'flfg':
            leixing = '法律';
            break;
        case 'xzfg':
            leixing = '行政法规';
            break;
        case 'jcfg':
            leixing = '监察法规';
            break;
        case 'sfjs':
            leixing = '司法解释';
            break;
        case 'dfxfg':
            leixing = '地方性法规';
            break;
    }

    // 发送 HTTP GET 请求到 API 并解构返回的数据对象
    const { data } = await got(`https://flk.npc.gov.cn/api/?type=${category}&searchType=title%3Bvague&sortTr=f_bbrq_s%3Bdesc&gbrqStart=&gbrqEnd=&sxrqStart=&sxrqEnd=&sort=true&page=1&size=10`, {
        headers: {
            // 为简单起见，此示例使用 HTML 而不是推荐的 'application/vnd.github+json'，
            // 因后者返回 Markdown 并需要进一步处理
            accept: 'application/json, text/javascript, */*; q=0.01',
        },
    });

    // 从 API 响应中提取相关数据
    const items = data.result.data.map((item) => ({
        // 文章标题
        title: item.title,
        // 文章链接
        link: item.url,
        // 文章正文
        description: `发布时间:${item.publish};   <br/> 发布单位:${item.office};    <br/> 效力层级:${item.type};    <br/> 链接地址:${item.url}`,
        // 文章发布日期
        pubDate: parseDate(item.publish),
        // 如果有的话，文章作者
        author: item.office,
        // 如果有的话，文章分类
        category: item.type,
    }));

    ctx.state.data = {
        // 源标题
        title: `${leixing} · 国家法律法规数据库`,
        // 源链接
        link: `https://flk.npc.gov.cn/`,
        // 源文章
        item: items,
    };
};
