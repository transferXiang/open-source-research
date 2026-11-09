import fs from 'node:fs';
import {createRenderer,publicLinks,link} from './render.mjs';
import {reviewPage} from './review.mjs';
import {longform} from './longform.mjs';
import {loadReports} from './reviews.mjs';
const contentRoot=new URL('file://'+process.cwd()+'/content/');
const read=p=>JSON.parse(fs.readFileSync(new URL(p,contentRoot),'utf8'));
export const projects=read('projects.json');
const allReports=loadReports();
export const reports=projects.map(p=>({...allReports.find(r=>r.id===p.id&&r.reviewedAt===p.currentReviewId.slice(-10)),priority:p.priority}));
const snapshots=fs.readdirSync(new URL('snapshots/',contentRoot)).filter(x=>x.endsWith('.json')).sort().map(f=>read('snapshots/'+f));
export const evidence={date:'2026-11-09',projects:[...new Map(snapshots.flatMap(s=>s.projects).map(m=>[m.repo,m])).values()]};
export const topics=read('topics.json'),tests=read('tests.json'),editions=read('editions.json');
export const data={reports:reports.map(({markdown,...r})=>r),evidence,topics,tests};
export const render=createRenderer(data);
export const routes=['','projects','saved','compare','search','research','topics','tests','about/methodology','about/changelog','about/correction',...editions.map(e=>'research/'+e.id),...projects.flatMap(p=>['projects/'+p.id,'projects/'+p.id+'/history']),...allReports.map(r=>'reviews/'+r.id+'/'+r.reviewedAt)];
const notes={
'about/methodology':['研究标准','文章的长度不是深度，决定质量的是证据和解释。','<h2>产品说明必须具体</h2><p>解释产品在实际流程中负责哪一步，列明输入、处理方式、输出与不负责的任务。不能只复制支持格式、功能清单或 Star 数量。</p><h2>四类证据分开</h2><p>官方文档用于核验定位与版本；独立评测检查样本、配置和可复现性；用户报告注明时间与版本；本站判断解释这些材料能支持多窄的结论。本机实测必须有环境、输入、输出和原始记录，网页布局测试不算产品实测。</p><h2>外部评价不等于中立</h2><p>核验来源是否属于厂商、竞品作者、赞助内容或推广页面。厂商基准不是自动无效，但必须披露利益关系。同一份数据的多个转述不算多份独立证据，失效或无法核验的原文不支撑具体数字。</p><h2>图片和视频的角色</h2><p>优先展示能解释操作、输入输出和失败条件的材料。示意图、官方演示与真实测试截图分别标注；不使用 AI 生成的虚构产品截图冒充实际界面。不为装饰嵌入无关视频，不复制整篇评测。</p><h2>准入与撤稿</h2><p>完整评估须包含使用流程、证据分歧、替代路线、成本、风险、具体用途与验收条件。达不到标准就撤下或留在私人候选池，不公开填充。2026-11-03 已撤回此前 13 份短评，MarkItDown 用重新研究的文章替代，其余项目只有完成重新研究才恢复。</p><h2>仍有未知</h2><p>当前保留的文章是交叉资料评估，不是本机产品基准。未知效果不填数字，不打缺乏依据的综合分，也不把第三方的测试结果说成本站实测。</p>'],
'about/changelog':['修订与撤稿记录','公开记录内容标准的变化。','<h2>2026-11-03 · 撤回旧短评并重写</h2><p>此前两期共 13 份短评未达到详细产品评估要求，已从正式项目库、搜索、RSS 和期刊撤下。旧的待测试计划、专题框架也一并撤下，避免继续制造完成度假象。</p><p>同日发布 MarkItDown 重写评估，取代原短版，新增独立教程、社区反馈、第三方比较、具体风险、示意图与任务化结论。旧稿在站点外本地备份，Git 历史也可恢复；没有删除私人原始资料。</p><p>2026-11-04 完成另外 8 篇资料型评估（6 个 11 月 3 日日榜选题、2 个图片视频补充），共 9 篇正式档案。本机产品实测仍为 0 项。其他项目只有完成重新研究才会恢复，不承诺保留旧推荐结论。</p>'],
'about/correction':['纠错与反馈','请给出具体页面、版本和依据。','<p>欢迎提供原文链接、错误位置、软件版本与复现材料；不要提交密钥或私人文件。</p><p><a href="https://github.com/transferXiang/open-source-research/issues/new">提交 GitHub Issue →</a></p>']
};

function edition(e){
 const list=e.reviewIds.map(id=>allReports.find(r=>r.id+'-'+r.reviewedAt===id));
 return '<article class="feature"><div class="kicker">'+e.id+' · '+list.length+' 篇</div><h2><a href="'+link('research/'+e.id)+'">'+e.title+'</a></h2><p>固定日期的资料型评估，不随当前档案静默更新。</p></article>'+list.map(r=>'<article class="issue-entry"><div><h3><a href="'+link('reviews/'+r.id+'/'+r.reviewedAt)+'">'+r.name+'</a></h3><p>'+r.tagline+'</p></div><a class="issue-entry-link" href="'+link('reviews/'+r.id+'/'+r.reviewedAt)+'">阅读评估 →</a></article>').join('');
}
function home(){
 return '<section class="hero"><div><div class="kicker">开源研究 / 2026.11.09</div><h1>先看懂产品，<br>再决定值不值得用。</h1><p>从输入、操作和产出解释项目；交叉阅读官方文档、外部评价和用户反馈，再判断它对工作与生活的价值。</p><div class="hero-actions"><a class="cta" href="'+link('research/2026-11-09')+'">阅读本期三篇研究 →</a><a class="text-link" href="'+link('about/methodology')+'">研究与证据标准 →</a></div></div><article class="feature"><div class="kicker">本期 / 三个周榜选题</div><h2>让 AI 更好用，<br>不只看功能清单。</h2><p>agent-browser 网页操作、Spec Kit 需求协作、Humanizer 文字编辑；重点核对旧评价与当前能力的落差。</p><div class="fact"><span>3 篇新评估 · 共 12 篇档案</span><span>资料研究 · 未下载安装</span></div><a href="'+link('projects/agent-browser')+'">先看网页操作的能力与边界 →</a></article></section><div class="notice">本期选题来自 11 月 9 日访问的 GitHub 周榜；不是新发布项目榜，也不报告增长排名。此前图片视频研究仍保留独立日期。Star 不是产品质量或近期增长的证明。</div><div class="section-head"><h2>按任务找到值得了解的项目</h2><a href="'+link('topics')+'">阅读路径 →</a></div><div class="grid">'+render.cards(reports)+'</div><p class="home-note">此前 13 份浅层短评已撤下。这里展示的是重新研究后的文章，不沿用旧评分或旧推荐结论。</p>';
}
export function page(path){
 const [kind,id,sub]=path.split('/');let html='';
 if(!kind)html=home();
 else if(notes[path]){const [title,desc,body]=notes[path];html=render.pageHead(title,desc,path)+'<article class="reading" style="max-width:780px">'+body+'</article>';}
 else if(kind==='projects'&&sub==='history'){
 const p=projects.find(p=>p.id===id);
 html=render.pageHead(p.name+' · 研究历史','只保留达到发布标准的评估；旧短评已撤回。',path)+allReports.filter(r=>r.id===id).map(r=>'<article class="feature"><h2>'+r.reviewedAt+' · '+r.stage+'</h2><p>'+r.tagline+'</p><a href="'+link('reviews/'+id+'/'+r.reviewedAt)+'">阅读固定评估 →</a></article>').join('');
 }
 else if((kind==='projects'||kind==='reviews')&&id){
 const r=kind==='projects'?reports.find(r=>r.id===id):allReports.find(r=>r.id===id&&r.reviewedAt===sub);
 const snap=snapshots.find(s=>s.date===r.reviewedAt);
 const m=snap?.projects.find(m=>m.repo===r.repo)||evidence.projects.find(m=>m.repo===r.repo);
 html=r.bodyPath?longform(r,m,kind==='reviews'):reviewPage(r,m,r.reviewedAt,kind==='reviews');
 }
 else if(kind==='projects'||kind==='saved')html=render.projectList(kind==='saved').replace('<div class="grid" id="project-cards"></div>','<div class="grid" id="project-cards">'+(kind==='saved'?'':render.cards(reports))+'</div>');
 else if(kind==='research')html=render.pageHead('调研期刊','每一期固定研究范围、资料日期和当时判断，不伪装成实时榜单。',path)+(id?edition(editions.find(e=>e.id===id)):editions.map(e=>'<div class="issue-block">'+edition(e)+'</div>').join(''));
 else if(kind==='topics')html=render.pageHead('专题指南','按任务组织阅读路径；这是资料研究，不是多产品对照测试。',path)+'<div class="tasks">'+[
 ['向 AI 讲清需求、整理材料','先用 Hex 理解口述输入，再读 MarkItDown 的资料预处理边界；如果材料来自网页，补读 Scrapling。',['hex','markitdown','scrapling']],
 ['让 AI 参与开发，但保留控制','从工程技能规范开始，理解 Worktrunk 的目录隔离与 claude-mem 的记忆边界；需要操作原生应用时再读 agent-desktop。',['mattpocock-skills','worktrunk','claude-mem','agent-desktop']],
 ['为文章制作图片或视频','Qwen 固定讨论生成与编辑模型；LTX 说明音画视频路线、硬件与社区许可。都不是“一键免校对”的最终交付。',['qwen-image','ltx-2']]
 ].map(([title,desc,ids])=>'<article class="task"><h2>'+title+'</h2><p>'+desc+'</p>'+ids.map(id=>'<p><a href="'+link('projects/'+id)+'">'+reports.find(r=>r.id===id).name+' →</a></p>').join('')+'</article>').join('')+'</div>';
 else if(kind==='tests')html=render.pageHead('实测记录','本轮仅进行资料调研；不下载安装或运行这些产品。',path)+'<div class="notice">已完成产品实测：0 项。网站构建、链接检查与手机排版检查只用于验证网页，不是产品功能或性能测试。</div>';
 else if(kind==='search')html=render.searchPage(new URLSearchParams()).split('<p class="home-note">')[0]+'<p class="home-note">仅检索当前正式发布内容，已撤短评不进入索引。</p>';
 else if(kind==='compare')html=render.comparePage(new URLSearchParams());
 return publicLinks(html);
}
