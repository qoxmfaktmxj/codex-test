// Verification tool only; uses an already-installed Playwright, not a game dependency.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/root/.openclaw/workspace/vibe-grid/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=process.cwd(),folder=path.join(root,'daily/2026-09-13-bagatelle'),log=[];
const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(req.url.split('?')[0]));try{const b=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':'image/png');res.end(b)}catch{res.writeHead(404);res.end()}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
try{const url=`http://127.0.0.1:${server.address().port}/daily/2026-09-13-bagatelle/index.html`,errors=[];
const page=await browser.newPage({viewport:{width:1440,height:1050}});page.on('pageerror',e=>errors.push(e.message));
await page.goto(url);await page.screenshot({path:path.join(folder,'screenshot.png'),fullPage:true});
for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:1050});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(folder,`evidence/viewport-${width}.png`),fullPage:true});}log.push('375/768/1024/1440 no horizontal overflow; actual screenshots saved');
await page.locator('#power').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#power').inputValue(),'61');
await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'launch');await page.keyboard.press('Enter');
await page.waitForFunction(()=>document.querySelector('#remaining').textContent==='4');assert.ok(await page.locator('#launch').isDisabled());
await page.waitForTimeout(500);const pos=await page.locator('#ball').getAttribute('cy');assert.notEqual(pos,'630');
await page.screenshot({path:path.join(folder,'evidence/desktop-in-flight.png'),fullPage:true});
await page.locator('#reset').click();await page.waitForTimeout(500);assert.equal(await page.locator('#remaining').textContent(),'5');assert.equal(await page.locator('#ball').getAttribute('cy'),'630');assert.equal(await page.locator('#score').textContent(),'000');log.push('Desktop keyboard slider/launch, rolling lock, ball movement, reset during motion PASS');
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});const mobile=await context.newPage();mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(url);await mobile.screenshot({path:path.join(folder,'screenshot-mobile.png'),fullPage:true});
for(let shot=0;shot<5;shot++){
 const power=mobile.locator('#power');const box=await power.boundingBox();await mobile.touchscreen.tap(box.x+box.width*(.25+shot*.12),box.y+box.height/2);
 await mobile.locator('#launch').tap();assert.equal(await mobile.locator('#remaining').textContent(),String(4-shot));
 if(shot===0){await mobile.waitForTimeout(550);await mobile.screenshot({path:path.join(folder,'evidence/mobile-in-flight.png'),fullPage:true});}
 await mobile.waitForFunction(n=>document.querySelectorAll('#history .played').length===n,shot+1,{timeout:35000});
 log.push(`Mobile touch shot ${shot+1}: power ${await power.inputValue()}, score ${await mobile.locator('#score').textContent()}`);
}
assert.ok(await mobile.locator('#launch').isDisabled());assert.match(await mobile.locator('#message').textContent(),/총 .*점/);
const sum=await mobile.locator('#history li').evaluateAll(items=>items.reduce((n,el)=>n+Number(el.textContent),0));assert.equal(Number(await mobile.locator('#score').textContent()),sum);
await mobile.screenshot({path:path.join(folder,'evidence/mobile-finished.png'),fullPage:true});
await mobile.locator('#reset').tap();assert.equal(await mobile.locator('#remaining').textContent(),'5');assert.equal(await mobile.locator('#score').textContent(),'000');assert.equal(await mobile.locator('#history .played').count(),0);log.push('Mobile five shots, sum, finish lock, restart PASS');
await mobile.emulateMedia({reducedMotion:'reduce'});await mobile.locator('#launch').tap();await mobile.waitForTimeout(500);assert.ok(await mobile.locator('#trail circle').evaluateAll(els=>els.every(e=>e.getAttribute('opacity')==='0')));await mobile.locator('#reset').tap();log.push('Reduced-motion hides trails; game and reset still work PASS');
assert.deepEqual(errors,[]);log.push('Browser uncaught errors: 0');console.log(log.join('\n'));fs.writeFileSync(path.join(folder,'evidence/browser-results.txt'),log.join('\n')+'\n');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
