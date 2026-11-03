const {chromium}=require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const p=await browser.newPage({viewport:{width:1440,height:1000}}),base=process.env.QA_URL||'http://127.0.0.1:4321/open-source-research/';
 const errors=[];p.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('qa',{recursive:true});
 const ids=['hex','agent-desktop','worktrunk','claude-mem','scrapling','mattpocock-skills','qwen-image','ltx-2'];
 await p.goto(base+'projects/');await p.waitForFunction(()=>document.querySelectorAll('.project-card').length===9);
 await p.getByRole('button',{name:'创作与表达',exact:true}).click();await p.waitForFunction(()=>document.querySelectorAll('.project-card').length===2);
 await p.goto(base+'research/2026-11-04/');assert.equal(await p.locator('.project-mini').count(),8);
 for(const id of ids){await p.goto(base+'projects/'+id+'/');assert.equal(await p.locator('h2[id^="s-chapter-"]').count(),8,id);assert.ok(await p.locator('.sources li').count()>=3,id);assert.ok((await p.locator('.reading').innerText()).length>1800,id);}
 await p.goto(base+'projects/hex/');await p.locator('[data-save]:visible').click();await p.waitForFunction(()=>document.querySelector('[data-save]').getAttribute('aria-pressed')==='true');await p.goto(base+'saved/');await p.waitForFunction(()=>document.querySelectorAll('.project-card').length===1);
 await p.goto(base+'search/?q='+encodeURIComponent('重定位'));await p.locator('.project-card').first().waitFor();
 await p.goto(base+'compare/?ids=hex,qwen-image');await p.waitForFunction(()=>document.querySelectorAll('table thead th').length===3);
 for(const width of [375,390,768,1440]){
  await p.setViewportSize({width,height:900});
  for(const route of ['', 'projects/','topics/','research/2026-11-04/',...ids.map(id=>'projects/'+id+'/')]){
   await p.goto(base+route);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),width+' overflow '+route);
  }
 }
 await p.setViewportSize({width:390,height:844});await p.goto(base);await p.getByRole('button',{name:'菜单',exact:true}).click();assert.ok(await p.locator('.primary').isVisible());await p.getByRole('button',{name:'菜单',exact:true}).click();await p.screenshot({path:'qa/home-mobile.png'});
 await p.goto(base+'projects/hex/');await p.screenshot({path:'qa/hex-mobile.png',fullPage:true});
 await p.setViewportSize({width:1440,height:1000});await p.goto(base);await p.screenshot({path:'qa/home-desktop.png'});
 await p.goto(base+'projects/qwen-image/');await p.screenshot({path:'qa/qwen-desktop.png'});
 if(!process.env.QA_URL){for(const id of ['hyperframes','archify','digup','context-mode'])assert.ok(!fs.existsSync('dist/projects/'+id+'/index.html'));assert.ok(!fs.existsSync('dist/research/2026-11-01/index.html'));}
 assert.deepEqual(errors,[]);await browser.close();console.log('QA passed: 9 dossiers, 8 new reviews, mobile/tablet/desktop, search, saved, compare and withdrawal boundaries.');
})().catch(e=>{console.error(e);process.exit(1)});
