// 导入所需模组
const got = require('@/utils/got'); // 自订的 got
const cheerio = require('cheerio'); // 可以使用类似 jQuery 的 API HTML 解析器
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const baseUrl = 'https://blog.legalhub.cn';
    // 从URL当中获取参数
    const { tagName = 'ElasticSearch' } = ctx.params;

    const { data: response } = await got(`${baseUrl}/tags/${tagName}`);
    const $ = cheerio.load(response);

    const list = $('article')
        // 使用“toArray()”方法将选择的所有 DOM 元素以数组的形式返回。
        .toArray()
        // 使用“map()”方法遍历数组，并从每个元素中解析需要的数据。
        .map((item) => {
            item = $(item);
            const a = item.find('a').first();
            return {
                title: a.text(),
                // `link` 需要一个绝对 URL，但 `a.attr('href')` 返回一个相对 URL。
                link: `${baseUrl}${a.attr('href')}`,
                pubDate: parseDate(item.find('time').attr('datetime')),
                author: 'LegalHub',
                // category: item
                //     .find('a[id^=label]')
                //     .toArray()
                //     .map((item) => $(item).text()),
            };
        });

    ctx.state.data = {
        // 在此处输出您的 RSS
        // 源标题
        title: `tags/${tagName}`,
        // 源链接
        link: `${baseUrl}/tags/${tagName}`,
        item: list,
    };
};
