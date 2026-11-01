import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const files=fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'));
const privatePrefix=String.fromCharCode(47)+'Users/';
let links=0;
for(const f of files){const text=fs.readFileSync(path.join('dist',f),'utf8');assert.ok(text.includes('name="viewport"'));assert.ok(!text.includes('href="#/'),'prototype hash route remains');assert.ok(!text.includes(privatePrefix),'private path exposed');for(const match of text.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){const url=match[1];if(!url.startsWith('/open-source-research/'))continue;const p=decodeURI(url.split('?')[0].replace('/open-source-research/',''));assert.ok(fs.existsSync(path.join('dist',p)),f+' broken link '+url);links++;}}
console.log('Site OK: '+files.length+' HTML pages, '+links+' internal references.');
