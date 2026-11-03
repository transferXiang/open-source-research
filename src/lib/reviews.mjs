import fs from 'node:fs';
const base=new URL('file://'+process.cwd()+'/content/');
export function hydrate(r){
 if(!r.bodyPath)return r;
 const markdown=fs.readFileSync(new URL(r.bodyPath,base),'utf8');
 const parts=markdown.split(/^## /m).slice(1);
 const sections=parts.map((s,i)=>{const [title,...lines]=s.split('\n');return ['chapter-'+(i+1),title,[lines.join('\n').trim()]]});
 return {...r,markdown,sections};
}
export function loadReports(){
 return fs.readdirSync(new URL('reviews/',base)).filter(x=>/^\d{4}-\d{2}-\d{2}\.json$/.test(x)).sort().flatMap(f=>JSON.parse(fs.readFileSync(new URL('reviews/'+f,base),'utf8')).map(hydrate));
}
