// 导入所需模组
const got = require('@/utils/got'); // 自订的 got
const cheerio = require('cheerio'); // 可以使用类似 jQuery 的 API HTML 解析器
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const baseUrl = 'https://www.chinacourt.org';
    // 从URL当中获取参数
    // const { tagName = 'ElasticSearch' } = ctx.params;

    const { data: response } = await got(`https://www.chinacourt.org/article/index/id/MzAwNDAwNTAwMiACAAA.shtml`);
    const $ = cheerio.load(response);

    const list = $('#articleList li')
        // 使用“toArray()”方法将选择的所有 DOM 元素以数组的形式返回。
        .toArray()
        .slice(0, 15)
        // 使用“map()”方法遍历数组，并从每个元素中解析需要的数据。
        .map((item) => {
            item = $(item);
            const a = item.find('a').first();
            return {
                title: a.text(),
                // `link` 需要一个绝对 URL，但 `a.attr('href')` 返回一个相对 URL。
                link: `${baseUrl}${a.attr('href')}`,
                pubDate: parseDate(item.find('.right').text()),
                description: `发布时间：${item.find('.right').text()};<br/>链接地址：${baseUrl}${a.attr('href')}`,
                author: 'LegalHub',
                // category: item
                //     .find('a[id^=label]')
                //     .toArray()
                //     .map((item) => $(item).text()),
            };
        });

    const items = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(
                item.link,
                async () => {
                    const { data: response } = await got(item.link);
                    const $ = cheerio.load(response);

                    // 选择类名为“comment-body”的第一个元素
                    const detail = $('.detail_txt').first().html();
                    item.description = `原链接：${item.link}<br/><br/>发布时间：${item.pubDate}<br/><br/>摘要：<br/>${detail}`;

                    // 上面每个列表项的每个属性都在此重用，
                    // 并增加了一个新属性“description”
                    return item;
                },
                259200
            )
        )
    );

    ctx.state.data = {
        // 在此处输出您的 RSS
        // 源标题
        title: `刑事研究 · 中国法院网`,
        // 源链接
        link: `https://www.chinacourt.org/article/index/id/MzAwNDAwNTAwMiACAAA.shtml`,
        item: items,
    };
};
