// 导入所需模组
const got = require('@/utils/got'); // 自订的 got
const { parseDate } = require('@/utils/parse-date');
// const cheerio = require('cheerio'); // 可以使用类似 jQuery 的 API HTML 解析器

module.exports = async (ctx) => {
    // 编写逻辑
    const { gch = '82496X' } = ctx.params;

    let qikan = '';

    switch (gch) {
        case '81227X':
            qikan = '《法学》·华东政法大学';
            break;
        case '81418X':
            qikan = '《中国法学》·中国法学会';
            break;
        case '82464X':
            qikan = '《法学研究》·中国社会科学院法学研究所';
            break;
        case '81439X':
            qikan = '《中外法学》·北京大学';
            break;
        case '81213X':
            qikan = '《政法论坛》·中国政法大学';
            break;
        case '89403X':
            qikan = '《清华法学》·清华大学';
            break;
        case '81949A':
            qikan = '《环球法律评论》·中国社会科学院法学研究所';
            break;
        case '81698X':
            qikan = '《法学家》·中国人民大学';
            break;
        case '82101X':
            qikan = '《现代法学》·西南政法大学';
            break;
        case '81380A':
            qikan = '《法律科学》·西北政法大学';
            break;
        case '81622X':
            qikan = '《法学评论》·武汉大学';
            break;
        case '82329X':
            qikan = '《法制与社会发展》·吉林大学';
            break;
        case '81666A':
            qikan = '《法商研究》·中南财经政法大学';
            break;
        case '82496X':
            qikan = '《比较法研究》·中国政法大学';
            break;
        case '81908X':
            qikan = '《中国社会科学》·中国社会科学院';
            break;
        case '81084X':
            qikan = '《政治与法律》·上海社会科学院法学研究所';
            break;
        case '70334X':
            qikan = '《东方法学》·上海市法学会、上海人民出版社';
            break;
        case '82632A':
            qikan = '《华东政法大学学报》·华东政法大学';
            break;
        case '81658X':
            qikan = '《法学论坛》·山东省法学会';
            break;
        case '82208X':
            qikan = '《法学杂志》·北京市法学会';
            break;
        case '82198X':
            qikan = '《国家检察官学院学报》·国家检察官学院';
            break;
        case '82582X':
            qikan = '《行政法学研究》·中国政法大学';
            break;
        case '89413X':
            qikan = '《中国政法大学学报》·中国政法大学';
            break;
        case '84471X':
            qikan = '《中国应用法学》·最高人民法院主管，中国应用法学研究所、人民法院出版社';
            break;
        case '80352A':
            qikan = '《中国检察官》·最高人民检察院主管，国家检察官学院';
            break;
    }

    // 发送 HTTP GET 请求到 API 并解构返回的数据对象
    const { data } = await got(`https://www.nssd.cn/web/journalnavigation/zwqkinfo/get.do?gch=${gch}&yearNum=&type=0&isLU=true`, {
        headers: {
            accept: '*/*',
            referrer: 'https://www.nssd.cn/html/1/155/161/index.html?gch=81227X&yearNum=&type=0',
        },
    });

    // 从 API 响应中提取相关数据
    const list = data.data.articleList[0].articleList.map((item) => ({
        // 文章标题
        title: item.title,
        key: item.id,
        // 文章链接
        link: `https://www.nssd.cn/html/1/156/159/index.html?lngId=${item.id}`,
        // 文章正文
        description: '',
        // 文章发布日期
        pubDate: parseDate(item.publish),
        // 如果有的话，文章作者
        author: item.author,
        // 如果有的话，文章分类
        category: item.type,
    }));

    const items = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(
                item.key,
                async () => {
                    const { data } = await got(`https://www.nssd.cn/web/paper/findById.do?lngId=${item.key}`, {
                        headers: {
                            accept: '*/*',
                            referrer: 'https://www.nssd.cn/html/1/155/161/index.html?gch=81227X&yearNum=&type=0',
                        },
                    });
                    const content = data.data;

                    // 选择类名为“comment-body”的第一个元素
                    item.description = `关键词：${content.keyword_c || '无'}<br/><br/>摘要：${content.remark_c || '无'}<br/><br/>作者：${content.showwriter || '无'}<br/>作者单位：${content.organ || '无'}<br/>期刊：《${
                        content.media_c
                    }》${content.medias_qk}<br/><br/>原文链接： <br/> <a href="${item.link}">${item.link || '无'}</a>`;

                    // 上面每个列表项的每个属性都在此重用，
                    // 并增加了一个新属性“description”
                    return item;
                },
                259200
            )
        )
    );

    ctx.state.data = {
        // 源标题
        title: `${qikan} 主办 · NSSD `,
        // 源链接https://www.nssd.cn/html/1/155/161/index.html?gch=81658X&yearNum=&type=0
        link: `https://www.nssd.cn/html/1/155/161/index.html?gch=${gch}&yearNum=&type=0`,
        // 源文章
        item: items,
    };
};
