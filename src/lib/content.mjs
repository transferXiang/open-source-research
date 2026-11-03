import fs from 'node:fs';
import { createRenderer, publicLinks, link } from './render.mjs';
import {reviewPage} from './review.mjs';
const read = p => JSON.parse(fs.readFileSync(new URL('../../..' + p, import.meta.url), 'utf8'));
export const evidence = {projects:fs.readdirSync(new URL('../../../content/snapshots/',import.meta.url)).filter(f=>f.endsWith('.json')).sort().flatMap(f=>read('/content/snapshots/'+f).projects)};
export const projects = read('/content/projects.json');
export const reviewFiles = fs.readdirSync(new URL('../../../content/reviews/',import.meta.url)).filter(f=>f.endsWith('.json'));
const reviewEntries=reviewFiles.flatMap(f=>read('/content/reviews/'+f).map(r=>({...r,reviewedAt:f.slice(0,-5)})));
export const reports = projects.map(p => {
  const date = p.currentReviewId.slice(-10);
  const review = read('/content/reviews/' + date + '.json').find(r => r.id === p.id);
  if (!review) throw new Error('Missing review: ' + p.currentReviewId);
  return {...review,reviewedAt:date};
});
export const topics = read('/content/topics.json');
export const tests = read('/content/tests.json');
export const editions = read('/content/editions.json');
export const data = { reports, evidence, topics, tests };
export const render = createRenderer(data);
const utility = {
  'about/methodology': ['研究方法', '先核验事实，再解释适用性。', '<h2>八个维度，回答真实选择</h2><p>每份评估依次解释：解决什么问题、输入与输出、近期变化、替代方案、工作生活用途、成本门槛、试用方法、最终判断。作者宣传、用户报告、分析判断和产品实测分别对待。</p><h2>热度不是推荐</h2><p>Star 是累计快照；没有连续采集记录时不宣称近七天增量，也不把入选项目称为全站排名。选择兼顾近期活动、创作价值和办公需求，不代表 GitHub 官方榜单。</p><h2>复核与版本</h2><p>内容按评估分别记录证据日期，目前覆盖 2026-11-01 与 2026-11-03。自动刷新 Star 不会修改研究复核日期。重大结论更新新增固定评估，旧评估保留；当前档案指向最新一版。</p><h2>实测与边界</h2><p>当前全部为公开文档、版本及问题抽样调研，已完成产品实测为 0。试用预算不是性能承诺。软件许可、模型、素材和服务条款需要分别核验。</p><h2>更新方式</h2><p>目前手动研究与发布，尚未启用自动监测。订阅 RSS 可跟踪后续发布；本地收藏不上传，也不跨设备同步。</p>'],
  'about/changelog': ['更新记录', '每次发布保留研究和修订的来处。', '<h2>2026-11-03 · 新增三份评估</h2><p>新增 Archify、MarkItDown 与 context-mode，项目库共 13 份档案。context-mode 为受限许可源码可用项目，单独标注。前一期记录与原始日期保留。</p><h2>2026-11-01 · 公开站首发</h2><p>发布 10 份深度评估、3 个专题、3 项待测试计划；支持手机、分类、全文搜索、本地收藏和三项目比较。内容基于当日研究快照，不是实时榜单。</p><p>本地探索稿未通过公开审查，不随站点发布。后续补充新一期研究时在此记录。</p>'],
  'about/correction': ['纠错与反馈', '欢迎带着来源补充和纠正。', '<h2>请提供这些信息</h2><p>页面链接、需要修正的原文、正确结论及官方来源、涉及的软件版本与日期。如为产品实测，请补充脱敏复现样本，不要提交密钥和私人文件。</p><p><a href="https://github.com/transferXiang/open-source-research/issues/new">在 GitHub 提交反馈 →</a></p><p>重要事实修订会记录原因和日期；推荐结论发生变化时新增评估版本。</p>']
};
export const routes = ['', 'projects','saved','compare','search','research',...editions.map(e=>'research/'+e.id),'topics','tests',...Object.keys(utility),...render.T.map(t=>'topics/'+t.id),...render.tests.map(t=>'tests/'+t.id),...reports.flatMap(r=>['projects/'+r.id,'projects/'+r.id+'/history']),...reviewEntries.map(r=>'reviews/'+r.id+'/'+r.reviewedAt)];
export function page(path) {
  const [kind,id,sub] = path.split('/'); let html;
  if (!kind) html=render.home();
  else if (utility[path]) {const [title,desc,body]=utility[path];html=render.pageHead(title,desc,path)+'<article class="reading" style="max-width:780px">'+body+'</article>';}
  else if (kind==='projects' && id && sub==='history') {const r=reports.find(r=>r.id===id);html=render.pageHead(r.name+' · 研究历史','每次判断都保留固定版本。',path)+reviewEntries.filter(r=>r.id===id).toSorted((a,b)=>b.reviewedAt.localeCompare(a.reviewedAt)).map(r=>`<article class="feature"><h2>${r.reviewedAt}</h2><p>${r.decision} · 文档调研，未实测</p><a href="${link('reviews/'+id+'/'+r.reviewedAt)}">阅读固定评估 →</a> · <a href="${link('projects/'+id)}">当前档案 →</a></article>`).join('');}
  else if ((kind==='projects'||kind==='reviews') && id) {const date=kind==='reviews'?sub:projects.find(p=>p.id===id).currentReviewId.slice(-10);const r=reviewEntries.find(r=>r.id===id&&r.reviewedAt===date);const snapshot=read('/content/snapshots/'+date+'.json');html=reviewPage(r,snapshot.projects.find(m=>m.repo===r.repo),date,kind==='reviews');}
  else if (kind==='projects'||kind==='saved') html=render.projectList(kind==='saved').replace('<div class="grid" id="project-cards"></div>','<div class="grid" id="project-cards">'+(kind==='saved'?'':render.cards(render.R))+'</div>');
  else if (kind==='research') {const chosen=editions.find(e=>e.id===id);html=render.pageHead(chosen?chosen.title:'调研期刊',chosen?(chosen.description||'固定评估与当时结论，后续更新不覆盖历史。'):'每一期引用固定日期的评估；从这里回看研究脉络。',path);if(!id)html+=editions.map(e=>'<article class="feature"><div class="kicker">'+e.id+'</div><h2><a href="'+link('research/'+e.id)+'">'+e.title+'</a></h2><p>'+e.reviewIds.length+' 份评估 · 文档调研，未实测</p></article>').join('');else html+='<div class="notice">证据截止 '+id+'；文档调研，未运行产品。缓存周榜仅用于发现候选，不用于计算实时涨幅。旧项目保留其原始复核日期。</div><div class="grid">'+chosen.reviewIds.map(ref=>{const date=ref.slice(-10),pid=ref.slice(0,-11),r=reviewEntries.find(r=>r.id===pid&&r.reviewedAt===date);return '<article class="project-card"><span class="pill">'+r.decision+'</span><h2>'+r.name+'</h2><p>'+r.tagline+'</p><p>'+r.verdict+'</p><a href="'+link('reviews/'+pid+'/'+date)+'">阅读八节深度评估 →</a></article>';}).join('')+'</div>';}
  else if (kind==='topics') html=render.topics(id);
  else if (kind==='tests') html=render.lab(id);
  else if (kind==='search') html=render.searchPage(new URLSearchParams()).replace(/<p class="home-note">[\s\S]*?<\/p>/,'<p class="home-note">搜索在浏览器中进行，不上传查询内容。</p>');
  else if (kind==='compare') html=render.comparePage(new URLSearchParams());
  return publicLinks(html);
}
