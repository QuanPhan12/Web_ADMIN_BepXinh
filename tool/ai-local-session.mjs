import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const real = process.argv.includes('--real');
if (real && (process.env.GCLOUD_PROJECT !== 'bepxinh-b0be7' || process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST)) {
  throw new Error('Real mode requires bepxinh-b0be7 without Auth/Firestore emulators.');
}
if (!real && (process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8080' || process.env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099')) {
  throw new Error('Start with npm run dev:ai. This command only supports local demo emulators.');
}
const appRoot = fileURLToPath(new URL('../../app_bep_xinh/', import.meta.url));
const adminRoot = fileURLToPath(new URL('../', import.meta.url));
if (!real) {
  const seed = spawnSync(process.execPath, ['functions/tool/seed-local.mjs'], { cwd: appRoot, env: process.env, stdio: 'inherit' });
  if (seed.status !== 0) process.exit(seed.status ?? 1);
}

process.env.VITE_USE_EMULATORS = real ? 'false' : 'true';
process.env.VITE_AI_API_URL = `http://127.0.0.1:5001/${real ? 'bepxinh-b0be7' : 'demo-bepxinh'}/asia-southeast1/bepXinhAi`;
const port = Number(process.env.BX_ADMIN_PORT || 5173);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid admin port.');
const server = await createServer({ root: adminRoot, server: { host: '127.0.0.1', port, strictPort: true } });
await server.listen();
console.log(`\nAdmin AI local: http://localhost:${port}/?view=settings`);
console.log(real ? 'REAL DATA: sign in with your existing admin account. No demo accounts or seed data.' : 'Demo login: local-admin@example.test / BepXinhLocal123!');
console.log('Open Settings > Bep Xinh AI, enter your provider key, then check and save.');
console.log(real ? 'Ctrl+C stops local servers. Saved AI settings and chat history remain in real Firestore. Keep functions/.secret.local to decrypt the saved API key.\n' : 'Ctrl+C stops admin and emulators. Demo data is temporary for this session.\n');
let stopping = false;
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => {
  if (stopping) return;
  stopping = true;
  await server.close();
  process.exit(0);
});
