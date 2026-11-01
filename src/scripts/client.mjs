import {createRenderer, publicLinks, link} from '../lib/render.mjs';
const data=JSON.parse(document.querySelector('#data').textContent), view=createRenderer(data);
const $=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
const path=$('main').dataset.path;
const safeRead=key=>{try{const x=JSON.parse(localStorage.getItem(key)||'[]');return new Set(Array.isArray(x)?x.filter(id=>data.reports.some(r=>r.id===id)):[]);}catch{return new Set();}};
let saved=safeRead('open-source-research:saved'), chosen=safeRead('open-source-research:compare'), filter='全部', query='', sort='priority';
function persist(key,set){try{localStorage.setItem('open-source-research:'+key,JSON.stringify([...set]));}catch{toast('浏览器存储不可用；本次页面仍可使用，但刷新后不会保留。');}}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').hidden=true,3000);}
function sync(){view.setSaved(saved);view.setCompare(chosen);all('[data-save]').forEach(b=>{b.setAttribute('aria-pressed',String(saved.has(b.dataset.save)));b.textContent=saved.has(b.dataset.save)?'已收藏':'收藏项目';});all('[data-compare]').forEach(b=>{b.setAttribute('aria-pressed',String(chosen.has(b.dataset.compare)));b.textContent=chosen.has(b.dataset.compare)?'已加入比较':'加入比较';});}
function updateList(){
 if(!$('#project-cards')) return;
 let list=view.R.filter(r=>(path!=='saved'||saved.has(r.id))&&(filter==='全部'||r.category===filter)&&JSON.stringify(r).toLowerCase().includes(query.toLowerCase()));
 if(sort==='stars')list.sort((a,b)=>data.evidence.projects.find(m=>m.repo===b.repo).stars-data.evidence.projects.find(m=>m.repo===a.repo).stars);
 view.setCompare(chosen);$('#project-cards').innerHTML=publicLinks(view.cards(list));$('#count').textContent='找到 '+list.length+' 个项目';
 $('#comparison').replaceChildren();
 if(chosen.size){const bar=document.createElement('div');bar.className='compare-bar';const label=document.createElement('span');label.textContent='已选择 '+chosen.size+' 个项目';const a=document.createElement('a');a.href=link('compare')+'?ids='+[...chosen].join(',');a.textContent='按用途比较 →';const b=document.createElement('button');b.dataset.clearCompare='';b.textContent='清空';bar.append(label,a,b);$('#comparison').append(bar);}
}
$('.mobile-menu').addEventListener('click',e=>{const open=$('.primary').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('.primary').classList.remove('open');$('.mobile-menu').setAttribute('aria-expanded','false');}if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();location.href=link('search');}});
document.addEventListener('click',e=>{
 const f=e.target.closest('[data-filter]');if(f){filter=f.dataset.filter;all('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===f)));updateList();}
 const c=e.target.closest('[data-compare]');if(c){const id=c.dataset.compare;if(chosen.has(id))chosen.delete(id);else if(chosen.size<3)chosen.add(id);else return toast('最多比较三个项目，请先移除一个。');persist('compare',chosen);sync();updateList();}
 if(e.target.closest('[data-clear-compare]')){chosen.clear();persist('compare',chosen);updateList();}
 const s=e.target.closest('[data-save]');if(s){const id=s.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);persist('saved',saved);sync();updateList();toast(saved.has(id)?'已收藏到当前浏览器':'已取消收藏');}
});
$('#find')?.addEventListener('input',e=>{query=e.target.value;updateList();});
$('#sort')?.addEventListener('change',e=>{sort=e.target.value;updateList();});
if(path==='compare'){
 const params=new URLSearchParams(location.search);if(!params.has('ids')&&params.has('projects'))params.set('ids',params.get('projects'));if(!params.has('ids'))params.set('ids',[...chosen].join(','));
 // Renderer escapes all query-derived labels by accepting only known project IDs.
 $('main').innerHTML=publicLinks(view.comparePage(params));
}
if(path==='search'){
 const params=new URLSearchParams(location.search);$('#global-q').value=params.get('q')||'';
 function search(){const term=$('#global-q').value.trim();const hits=term?data.entries.filter(r=>(r.title+' '+r.text).toLowerCase().includes(term.toLowerCase())):[];$('.status-line').textContent=term?'找到 '+hits.length+' 条内容':'输入关键词开始搜索';$('.grid').replaceChildren();for(const r of hits){const card=document.createElement('article');card.className='project-card';const type=document.createElement('span');type.className='pill';type.textContent=({projects:'项目档案',topics:'专题指南',tests:'待测试计划',research:'调研期刊',about:'研究方法'})[r.type];const h=document.createElement('h2'),a=document.createElement('a');a.href=link(r.url);a.textContent=r.title;h.append(a);const p=document.createElement('p');const text=r.text.replace(/\s+/g,' ').trim();const at=Math.max(0,text.toLowerCase().indexOf(term.toLowerCase())-35);p.textContent=text.slice(at,at+160)+'…';card.append(type,h,p);$('.grid').append(card);}if(term&&!hits.length){const empty=document.createElement('div');empty.className='empty';empty.textContent='没有匹配内容，请换一个关键词。';$('.grid').append(empty);}sync();}
 $('#search-form').addEventListener('submit',e=>{e.preventDefault();const url=new URL(location.href);url.searchParams.set('q',$('#global-q').value);history.pushState({},'',url);search();});window.addEventListener('popstate',()=>{$('#global-q').value=new URLSearchParams(location.search).get('q')||'';search();});search();
}
if(path==='saved'){
 const box=document.createElement('div');box.className='notice';box.textContent='收藏只保存在当前浏览器，不上传、不跨设备同步。更换浏览器前可导出备份。';const b=document.createElement('button');b.textContent='导出收藏';b.addEventListener('click',()=>{const blob=new Blob([JSON.stringify([...saved],null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='open-source-research-saved.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});box.append(document.createElement('br'),b);$('main').append(box);
}
sync();updateList();
