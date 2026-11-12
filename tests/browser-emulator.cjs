// Tự mở Chrome với profile riêng, chỉ seed demo emulator; không dùng tài khoản thật.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { encode } = require('../../app_bep_xinh/tool/firebase_cli_client.cjs');
const { loadCatalog } = require('../../app_bep_xinh/tool/ingredient_catalog_data.cjs');
process.chdir(path.resolve(__dirname, '..'));
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8080');
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, '127.0.0.1:9099');
const root = 'projects/demo-bepxinh/databases/(default)/documents';
const base = `http://127.0.0.1:8080/v1/${root}`;
const delay = ms => new Promise(r => setTimeout(r, ms));
const artifacts = path.resolve('node_modules/.cache/admin-smoke');
mkdirSync(artifacts, { recursive: true });
async function post(url, body, token) {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
  assert.equal(response.status, 200, await response.clone().text()); return response.json();
}
const write = (name, value, stamps = []) => ({ update: { name: `${root}/${name}`, fields: encode(value).mapValue.fields }, updateTransforms: stamps.map(fieldPath => ({ fieldPath, setToServerValue: 'REQUEST_TIME' })) });
async function account(role) {
  const email = `sdk-${crypto.randomUUID()}@example.test`, password = 'EmulatorOnly123!';
  const result = await post('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo', { email, password, returnSecureToken: true });
  const id = result.localId;
  await post(`${base}:commit`, { writes: [write(`users/${id}`, { schemaVersion: 1, id, name: role, handle: `bep_${id}`, bio: '', showBio: true, cookedCount: 0, role, status: 'active', lockedAt: null, lockReason: null }, ['createdAt', 'updatedAt'])] }, 'owner');
  return { id, email, password };
}
(async () => {
  const admin = await account('admin'), author = await account('user');
  const recipeId = `r_browser_${crypto.randomUUID()}`;
  const { data, contentHash } = loadCatalog();
  const recipe = { schemaVersion: 2, id: recipeId, authorId: author.id, author: { id: author.id, name: 'user', handle: `bep_${author.id}` }, status: 'pending', isBanner: false, contentHash: 'a'.repeat(64), catalogVersion: data.version, revisionOf: null, reviewedAt: null, reviewedBy: null, reviewReason: null,
    content: { title: 'SDK Browser Recipe', description: 'Firebase integration', cover: { id: 'cover', name: 'cover.png', url: 'https://res.cloudinary.com/ddqouziau/image/upload/v1/test.png', publicId: 'test' }, preparationMinutes: 5, cookingMinutes: 10, servings: 2, difficulty: 'easy', meals: ['dinner'], categories: ['quick'], storageNotes: '', ingredientGroups: [{ id: 'main', name: 'Main' }], ingredients: [{ id: 'i', ingredientId: null, name: 'Custom', amount: null, unitId: null, note: '', toTaste: true, groupId: 'main' }], steps: [{ id: 's', title: 'Cook', instruction: 'Cook thoroughly.', minutes: null, tip: '', photo: null }] } };
  await post(`${base}:commit`, { writes: [write('catalogs/ingredients', { ...data, contentHash }, ['updatedAt']), write(`recipes/${recipeId}`, recipe, ['submittedAt'])] }, 'owner');
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '11500', '--strictPort'], { env: { ...process.env, VITE_USE_EMULATORS: 'true' }, windowsHide: true, stdio: 'ignore' });
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless', '--no-first-run', '--disable-extensions', '--remote-debugging-port=11502', `--user-data-dir=${path.join(artifacts, `chrome-${Date.now()}`)}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let ws;
  try {
    let pages;
    for (let i = 0; i < 50; i++) { try { await fetch('http://127.0.0.1:11500'); pages = await (await fetch('http://127.0.0.1:11502/json/list')).json(); break; } catch { await delay(200); } }
    assert.ok(pages, 'Vite/Chrome startup');
    ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r, { once: true }));
    let id = 0; const pending = new Map(), errors = [];
    ws.addEventListener('message', event => { const m = JSON.parse(event.data); if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text); if (pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); if (m.error) p.reject(m.error); else p.resolve(m.result); } });
    const call = (method, params = {}) => new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); });
    const evaluate = async expression => { const r = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
    await call('Runtime.enable'); await call('Network.enable');
    await call('Network.setBlockedURLs', { urls: ['https://identitytoolkit.googleapis.com/*', 'https://securetoken.googleapis.com/*', 'https://firestore.googleapis.com/*'] });
    await call('Page.navigate', { url: 'http://127.0.0.1:11500' });
    for (let i = 0; i < 100; i++) { if (await evaluate('!!document.querySelector("input[type=email]")')) break; await delay(200); }
    assert.ok(await evaluate('!!document.querySelector("input[type=email]")'), 'Login renders');
    const result = await evaluate(`import('/tests/browser-driver.ts').then(m => m.run(${JSON.stringify({ email: admin.email, password: admin.password, recipeId, authorId: author.id })}))`);
    for (let i = 0; i < 100; i++) { if (await evaluate('!!document.querySelector(".admin-sidebar")')) break; await delay(100); }
    assert.ok(await evaluate('!!document.querySelector(".admin-sidebar")'), 'Authenticated admin layout');
    await evaluate(`Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('Banner')).click()`);
    for (let i = 0; i < 100; i++) { if (await evaluate('document.body.textContent.includes("SDK Browser Recipe")')) break; await delay(100); }
    assert.ok(await evaluate('document.body.textContent.includes("SDK Browser Recipe")'), 'Realtime banner displayed');
    const shot = await call('Page.captureScreenshot', { format: 'png' }); writeFileSync(path.join(artifacts, 'banners.png'), Buffer.from(shot.data, 'base64'));
    await evaluate(`Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('Danh mục')).click()`);
    for (let i = 0; i < 100; i++) { if (await evaluate('document.querySelectorAll("tbody tr").length > 200')) break; await delay(100); }
    assert.ok(await evaluate('document.querySelectorAll("tbody tr").length > 200'), 'Live catalog rendered');
    await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Thêm nguyên liệu')).click()`);
    assert.ok(await evaluate('!!document.querySelector("dialog[open]")'), 'Catalog editor opens');
    await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    const mobile = await call('Page.captureScreenshot', { format: 'png' }); writeFileSync(path.join(artifacts, 'catalog-mobile.png'), Buffer.from(mobile.data, 'base64'));
    assert.equal(errors.length, 0, `Browser exceptions: ${errors.join(', ')}`);
    console.log(`PASS: ${result.checks} Firebase SDK checks + 6 portal UI checks; screenshots: node_modules/.cache/admin-smoke`);
  } finally { ws?.close(); chrome.kill(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
