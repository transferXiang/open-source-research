import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync('content/'+p,'utf8'));
const projects=read('projects.json'),topics=read('topics.json'),tests=read('tests.json'),editions=read('editions.json');
const ids=new Set(projects.map(p=>p.id));assert.equal(ids.size,projects.length);
for(const p of projects){const date=p.currentReviewId.slice(-10);assert.match(date,/^\d{4}-\d{2}-\d{2}$/);const r=read('reviews/'+date+'.json').find(r=>r.id===p.id);assert.ok(r,'missing current review');assert.equal(r.sections.length,8);assert.ok(r.sources.length>=2);assert.ok(JSON.stringify(r.sections).length>1000);for(const s of r.sources)assert.ok(s[1].startsWith('https://'));for(const section of r.sections)for(const paragraph of section[2])for(const match of paragraph.matchAll(/\[(\d+)\]/g))assert.ok(r.sources[Number(match[1])-1]);}
for(const t of topics)for(const id of t.ids)assert.ok(ids.has(id));
for(const t of tests){assert.ok(ids.has(t.project));if(t.status==='planned')assert.equal(t.result,null);}
for(const e of editions)for(const id of e.reviewIds){const date=id.slice(-10),project=id.slice(0,-11);assert.ok(read('reviews/'+date+'.json').some(r=>r.id===project));}
console.log('Content OK: '+projects.length+' projects, '+topics.length+' topics, '+tests.length+' planned tests.');
