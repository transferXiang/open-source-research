const {chromium}=require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const p=await browser.newPage({viewport:{width:1440,height:1000}}),base=process.env.QA_URL||'http://127.0.0.1:4321/open-source-research/';
const errors=[];p.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('qa',{recursive:true});
await p.goto(base+'projects/');await p.locator('#find').fill('MarkItDown');await p.waitForFunction(()=>document.querySelectorAll('.project-card').length===1);
await p.goto(base+'projects/markitdown/');assert.equal(await p.locator('section[id^="s-"]').count(),8);assert.equal(await p.locator('.sources li').count(),9);assert.ok(await p.locator('.reading').innerText().then(s=>s.includes('Hacker News')));
await p.locator('[data-save]').click();await p.waitForFunction(()=>document.querySelector('[data-save]').getAttribute('aria-pressed')==='true');await p.goto(base+'saved/');await p.locator('.project-card').waitFor();
await p.goto(base+'search/?q='+encodeURIComponent('精度'));await p.locator('.project-card').first().waitFor();
for(const width of [375,390,768,1440]){await p.setViewportSize({width,height:900});for(const route of ['', 'projects/markitdown/','about/methodology/']){await p.goto(base+route);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}}
await p.setViewportSize({width:390,height:844});await p.goto(base);await p.getByRole('button',{name:'菜单',exact:true}).click();assert.ok(await p.locator('.primary').isVisible());await p.getByRole('button',{name:'菜单',exact:true}).click();await p.screenshot({path:'qa/rebuilt-home-mobile.png',fullPage:true});
await p.goto(base+'projects/markitdown/');await p.screenshot({path:'qa/deep-review-mobile.png',fullPage:true});
if(!process.env.QA_URL){for(const id of ['hyperframes','archify','digup','context-mode'])assert.ok(!fs.existsSync('dist/projects/'+id+'/index.html'));assert.ok(!fs.existsSync('dist/research/2026-11-01/index.html'));}
assert.deepEqual(errors,[]);await browser.close();console.log('QA passed: rewritten article, 9 sources, mobile layout, search, saved and withdrawn routes.');
})().catch(e=>{console.error(e);process.exit(1)});
