const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.QA_URL||'http://127.0.0.1:4321/open-source-research/';fs.mkdirSync('qa',{recursive:true});
await page.goto(base);await page.screenshot({path:'qa/home-desktop.png',fullPage:true});
await page.goto(base+'projects/');await page.getByRole('button',{name:'创作与表达',exact:true}).click();assert.equal(await page.locator('.project-card').count(),3);
await page.getByRole('button',{name:'全部',exact:true}).click();await page.locator('[data-compare="hyperframes"]').click();await page.locator('[data-compare="digup"]').click();await page.getByRole('link',{name:'按用途比较 →'}).click();assert.equal(await page.locator('thead th').count(),3);
await page.goto(base+'projects/hyperframes/');await page.locator('[data-save]').click();await page.goto(base+'saved/');assert.equal(await page.locator('.project-card').count(),1);
await page.goto(base+'search/?q='+encodeURIComponent('中文'));assert.ok(await page.locator('.project-card').count()>0);
await page.goto(base+'reviews/hyperframes/2026-11-01/');assert.equal(await page.locator('.reading section[id^="s-"]').count(),8);await page.screenshot({path:'qa/article-desktop.png',fullPage:true});
for(const width of [375,390,768,844]){
await page.setViewportSize({width,height:width===844?390:844});
for(const route of ['','projects/','projects/hyperframes/','compare/?ids=hyperframes,digup','topics/video-workflow/','tests/rule-video/']){
await page.goto(base+route);const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));assert.ok(size.scroll<=size.width+1,`${width} ${route} overflow ${size.scroll}`);
}
}
await page.setViewportSize({width:390,height:844});await page.goto(base);await page.getByRole('button',{name:'菜单',exact:true}).click();assert.equal(await page.locator('.primary').isVisible(),true);await page.screenshot({path:'qa/home-mobile-menu.png',fullPage:true});await page.getByRole('button',{name:'菜单',exact:true}).click();await page.screenshot({path:'qa/home-mobile.png',fullPage:true});
await page.goto(base+'projects/hyperframes/');await page.screenshot({path:'qa/article-mobile.png',fullPage:true});assert.deepEqual(errors,[]);console.log('Browser QA passed: desktop, 375/390/768px and landscape; menus, filters, search, compare, saved.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
