# 开源研究室

公开站：https://transferxiang.github.io/open-source-research/

## 当前发布

2026-11-04：完成 8 篇资料型产品评估（6 个 11 月 3 日热门候选，加 Qwen 图片与 LTX 视频补充），连同 11 月 3 日重新研究的 MarkItDown，共 9 篇正式项目档案。不称为 11 月 4 日实时榜单，不下载安装或运行被研究产品。

本期：Hex、agent-desktop、Worktrunk、claude-mem、Scrapling、Matt Pocock Skills、Qwen-Image、LTX-2。每篇解释定位、输入输出、具体工作流程、功能边界、外部评价、替代路线、用户用途与成本。效果证据不足时明确保留未知；不把官方样片、目录排名或第三方数字当作本站实测。

2026-11-03 撤回此前 13 份浅层短评。旧稿在站点外备份及 Git 历史中可恢复，不得自动重新导入。新档案不继承旧推荐结论。

## 内容架构

- content/articles：分项目、日期保存长文 Markdown。
- content/reviews：固定日期的评估元数据、来源与正文路径；保留 MarkItDown 原八节结构。
- content/projects.json：通过编辑标准的项目与当前评估指针。
- content/snapshots：对应日期的仓库元数据；Star 是累计快照，非增长或质量指标。
- content/editions.json：期刊引用固定评估，当前档案可在未来更新。
- 专题导航只组织阅读路径；实测记录目前为 0，不能把计划冒充结果。

新增文章时写明版本与资料日期；配齐 8 节说明及逐项引用，再加入当期目录和项目清单。代码许可、模型权重与云服务条款应分别核验。

## 媒体与隐私

Hex 信息图由 AI 生成，仅用于解释原理，不是真实界面或测试截图。Qwen 官方样图与 LTX 官方视频作为外部展示入口，注明归属与厂商选样限制，未下载或再托管。读者展开/播放外部媒体会向原站发送网络请求。

网站没有服务端账号或收藏同步；收藏与比较保存在当前浏览器。公开内容不得包含本机路径、私人原始文件、密钥或登录状态。

## 维护与验证

Node.js 24；运行 npm ci、npm run validate、npm run build。推送 main 后由 GitHub Actions 发布 GitHub Pages。

内容检查验证八节结构、来源引用、快照与期刊指针；站点检查验证内部链接与私有路径；scripts/qa.cjs 检查搜索、收藏、比较、撤稿边界和 375/390/768/1440 宽度排版。需要可用的 Playwright 和 Chrome，QA_URL 可用于检查已部署网站。这些都是网站质量检查，不是产品实测。
