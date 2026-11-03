import fs from 'node:fs';
import assert from 'node:assert/strict';
import {loadReports} from '../src/lib/reviews.mjs';
const read=p=>JSON.parse(fs.readFileSync('content/'+p,'utf8'));
const projects=read('projects.json'),topics=read('topics.json'),tests=read('tests.json'),editions=read('editions.json'),reports=loadReports();
const ids=new Set(projects.map(p=>p.id));assert.equal(ids.size,projects.length);
for(const p of projects){
 const date=p.currentReviewId.slice(-10);assert.match(date,/^\d{4}-\d{2}-\d{2}$/);
 const r=reports.find(r=>r.id===p.id&&r.reviewedAt===date);assert.ok(r,'missing current review');
 assert.equal(r.sections.length,8,r.id+' must have eight main sections');
 assert.ok(r.sources.length>=2);assert.ok(JSON.stringify(r.sections).length>1800);
 for(const s of r.sources)assert.ok(s[1].startsWith('https://'));
 for(const section of r.sections)for(const paragraph of section[2])for(const match of paragraph.matchAll(/\[(\d+)\]/g))assert.ok(r.sources[Number(match[1])-1],'invalid citation '+r.id);
 if(r.markdown){assert.ok(!r.markdown.includes('/Users/'));assert.ok(!/尚未发布|待验收资料型/.test(r.markdown));}
 const snap=read('snapshots/'+date+'.json');assert.ok(snap.projects.some(m=>m.repo===r.repo));
}
for(const t of topics)for(const id of t.ids)assert.ok(ids.has(id));
for(const t of tests){assert.ok(ids.has(t.project));if(t.status==='planned')assert.equal(t.result,null);}
for(const e of editions)for(const id of e.reviewIds)assert.ok(reports.some(r=>r.id+'-'+r.reviewedAt===id));
console.log('Content OK: '+projects.length+' projects; eight sections per article; citations, snapshots and edition references valid. Product tests: '+tests.length+'.');
