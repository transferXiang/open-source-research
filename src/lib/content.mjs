import fs from 'node:fs';
import {createRenderer,publicLinks,link} from './render.mjs';
import {reviewPage} from './review.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../../../content/'+p,import.meta.url),'utf8'));
export const projects=read('projects.json');
export const reports=read('reviews/2026-11-03.json');
export const evidence=read('snapshots/2026-11-03.json');
export const topics=read('topics.json'),tests=read('tests.json'),editions=read('editions.json');
export const data={reports,evidence,topics,tests};
export const render=createRenderer(data);
export const routes=['','projects','saved','compare','search','research','research/2026-11-03','topics','tests','about/methodology','about/changelog','about/correction','projects/markitdown','projects/markitdown/history','reviews/markitdown/2026-11-03'];
const notes={
'about/methodology':['研究标准','文章的长度不是深度，决定质量的是证据和解释。','<h2>产品说明必须具体</h2><p>解释产品在实际流程中负责哪一步，列明输入、处理方式、输出与不负责的任务。不能只复制支持格式、功能清单或 Star 数量。</p><h2>四类证据分开</h2><p>官方文档用于核验定位与版本；独立评测检查样本、配置和可复现性；用户报告注明时间与版本；本站判断解释这些材料能支持多窄的结论。本机实测必须有环境、输入、输出和原始记录，网页布局测试不算产品实测。</p><h2>外部评价不等于中立</h2><p>核验来源是否属于厂商、竞品作者、赞助内容或推广页面。厂商基准不是自动无效，但必须披露利益关系。同一份数据的多个转述不算多份独立证据，失效或无法核验的原文不支撑具体数字。</p><h2>图片和视频的角色</h2><p>优先展示能解释操作、输入输出和失败条件的材料。示意图、官方演示与真实测试截图分别标注；不使用 AI 生成的虚构产品截图冒充实际界面。不为装饰嵌入无关视频，不复制整篇评测。</p><h2>准入与撤稿</h2><p>完整评估须包含使用流程、证据分歧、替代路线、成本、风险、具体用途与验收条件。达不到标准就撤下或留在私人候选池，不公开填充。2026-11-03 已撤回此前 13 份短评，MarkItDown 用重新研究的文章替代，其余项目暂不发布。</p><h2>仍有未知</h2><p>当前保留的文章是交叉资料评估，不是本机产品基准。未知效果不填数字，不打缺乏依据的综合分，也不把第三方的测试结果说成本站实测。</p>'],
'about/changelog':['修订与撤稿记录','公开记录内容标准的变化。','<h2>2026-11-03 · 撤回旧短评并重写</h2><p>此前两期共 13 份短评未达到详细产品评估要求，已从正式项目库、搜索、RSS 和期刊撤下。旧的待测试计划、专题框架也一并撤下，避免继续制造完成度假象。</p><p>同日发布 MarkItDown 重写评估，取代原短版，新增独立教程、社区反馈、第三方比较、具体风险、示意图与任务化结论。旧稿在站点外本地备份，Git 历史也可恢复；没有删除私人原始资料。</p><p>当前正式文章 1 篇，本机产品实测 0 项。其他项目只有完成重新研究才会恢复，不承诺保留旧推荐结论。</p>'],
'about/correction':['纠错与反馈','请给出具体页面、版本和依据。','<p>欢迎提供原文链接、错误位置、软件版本与复现材料；不要提交密钥或私人文件。</p><p><a href="https://github.com/transferXiang/open-source-research/issues/new">提交 GitHub Issue →</a></p>']
};
export function page(path){
const [kind,id,sub]=path.split('/');let html='';
if(!kind)html=render.home();
else if(notes[path]){const [title,desc,body]=notes[path];html=render.pageHead(title,desc,path)+'<article class="reading" style="max-width:780px">'+body+'</article>';}
else if(kind==='projects'&&sub==='history')html=render.pageHead('MarkItDown · 修订历史','旧短评已撤回，不再作为有效结论。',path)+'<div class="feature"><h2>2026-11-03 · 交叉资料评估重写</h2><p>替代同日短版；从统一推荐改为按任务分流。</p><a href="'+link('reviews/markitdown/2026-11-03')+'">阅读完整版本 →</a></div>';
else if((kind==='projects'||kind==='reviews')&&id)html=reviewPage(reports[0],evidence.projects[0],'2026-11-03',kind==='reviews');
else if(kind==='projects'||kind==='saved')html=render.projectList(kind==='saved').replace('<div class="grid" id="project-cards"></div>','<div class="grid" id="project-cards">'+(kind==='saved'?'':render.cards(reports))+'</div>');
else if(kind==='research')html=render.pageHead('重新评估：MarkItDown','原两期短评已撤回，本期只发布完成重写的内容。',path)+'<article class="feature"><div class="kicker">2026-11-03 · 修订版</div><h2>一个转换工具，为什么必须分任务评价？</h2><p>完整产品说明、第三方评价的分歧、具体风险、工作场景和试点门槛。</p><a class="cta" href="'+link('reviews/markitdown/2026-11-03')+'">阅读完整评估 →</a></article>';
else if(kind==='topics'||kind==='tests')html=render.pageHead(kind==='topics'?'专题指南':'实测记录','原有框架与计划已撤下，避免与完成的研究混淆。',path)+'<div class="notice">目前没有达到发布标准的'+(kind==='topics'?'独立专题':'本机实测')+'。请先阅读项目评估；后续只有具备依据的内容才会发布。</div>';
else if(kind==='search')html=render.searchPage(new URLSearchParams()).split('<p class="home-note">')[0]+'<p class="home-note">搜索仅包含当前正式发布内容；已撤短评不进入索引。</p>';
else if(kind==='compare')html=render.comparePage(new URLSearchParams());
return publicLinks(html);
}
