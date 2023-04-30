## 操作命令

```
- 打包 Docker 镜像
docker build --platform linux/amd64 -t legalgeek/legalhub:0.x .

- 推送 Docker 镜像
docker push legalgeek/legalhub:0.x

- 运行 镜像
docker run -d --name legalhub -p 1200:1200 legalgeek/legalhub:0.x

```

## 附：原始项目版权信息 MIT

RSSHub 是一个开源、简单易用、易于扩展的 RSS 生成器，可以给任何奇奇怪怪的内容生成 RSS 订阅源。RSSHub 借助于开源社区的力量快速发展中，目前已适配数百家网站的上千项内容

**RSSHub** © [DIYgod](https://github.com/DIYgod), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by DIYgod with help from contributors ([list](https://github.com/DIYgod/RSSHub/contributors)).

> Blog [@DIYgod](https://diygod.me) · GitHub [@DIYgod](https://github.com/DIYgod) · Twitter [@DIYgod](https://twitter.com/DIYgod) · Telegram Channel [@awesomeDIYgod](https://t.me/awesomeDIYgod)
