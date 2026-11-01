# 开源研究室

公开网站：https://transferxiang.github.io/open-source-research/

以证据理解项目，以任务判断价值。采用暖白、松绿与琥珀配色，适配手机、平板和桌面。静态页面由 Astro 构建，通过 GitHub Actions 发布到 GitHub Pages。

## 本地使用

需要 Node.js 24。执行 `npm ci`、`npm run validate`、`npm run dev`。发布前执行 `npm run build`，会检查静态页面内部链接。

## 长期内容结构

- `content/projects.json`：项目身份与当前评估指针。
- `content/reviews/YYYY-MM-DD.json`：当日深度评估，八节正文与证据来源。新判断另建日期文件，不覆盖旧版本。
- `content/snapshots/YYYY-MM-DD.json`：当日公开元数据快照。采集 Star 不等于重新研究。
- `content/editions.json`：期刊与固定评估引用。
- `content/topics.json`：任务指南与工具组合。
- `content/tests.json`：实测计划与状态。没有真实结果时 result 保持 null。
- `src/lib/content.mjs`：当前内容加载、页面路由和方法说明。
- `src/lib/render.mjs`：可复用页面呈现。

## 发布下一次研究

1. 核验官方仓库、正式版本、许可及重要 Issue；把事实、宣传与判断分开。
2. 新增评估日期文件与元数据快照，按项目更新 currentReviewId。评估 ID 使用 `项目ID-日期`。
3. 新增期刊引用并在 content.mjs 的 routes 中加入日期路径，更新对应渲染和 feed；目前期刊模板为首期，后续可泛化。
4. 在更新记录中记下真实研究截止日；不要仅改日期或 Star 冒充新研究。
5. 检查方法页、页脚与首页快照文案是否需要更新。日期目前明确写入模板，避免伪装实时更新。
6. 本地验证通过后提交 main，Actions 自动构建发布。固定评估页应始终读该日期版本，不随当前指针改变。

目前首期为 2026-11-01，10 个项目，3 个任务专题，3 项待测试计划，0 项已完成产品实测。不是实时榜单、不是 GitHub 官方排名，也未启用自动监测。

## 隐私与公开边界

仅发布本目录内的网站源码与公开调研；旧本地稿、个人配置、密钥、私人工作资料不上传。收藏和比较保存在浏览器，全文搜索不向服务端发送查询。GitHub Pages 作为托管方可能按其政策处理访问日志。本项目不额外加入分析脚本、广告或账号系统。

反馈请提交 Issue，附页面地址、错误原文、版本与官方依据；不要提交敏感信息。项目许可须以各原仓库为准，本站不重新授权第三方软件或素材。
