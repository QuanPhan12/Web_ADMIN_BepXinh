import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, getDoc, updateDoc, getDocs, collection, Timestamp, serverTimestamp, terminate } from 'firebase/firestore';
const require = createRequire(import.meta.url), { encode } = require('../../app_bep_xinh/tool/firebase_cli_client.cjs');
assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8080');
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,'127.0.0.1:9099');
const apps=[];
async function profile(uid, role, status='active') {
  const fields=encode({id:uid,role,status}).mapValue.fields;
  const response=await fetch('http://127.0.0.1:8080/v1/projects/demo-bepxinh/databases/(default)/documents:commit',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer owner'},body:JSON.stringify({writes:[{update:{name:`projects/demo-bepxinh/databases/(default)/documents/users/${uid}`,fields}}]})});
  assert.equal(response.status,200);
}
async function actor(role) {
  const app=initializeApp({projectId:'demo-bepxinh',apiKey:'demo',appId:'demo'},'direct-'+crypto.randomUUID());apps.push(app);
  const auth=getAuth(app);connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
  const db=getFirestore(app);connectFirestoreEmulator(db,'127.0.0.1',8080);
  const user=(await createUserWithEmailAndPassword(auth,crypto.randomUUID()+'@example.test','EmulatorOnly123!')).user;
  await profile(user.uid,role); return {db,user};
}
try {
  const admin=await actor('admin'), user=await actor('user'), other=await actor('user'), moderator=await actor('moderator');
  const version=((await getDoc(doc(admin.db,'ai_settings/runtime'))).data()?.version ?? 0)+1;
  const config={provider:'gemini',endpoint:'https://generativelanguage.googleapis.com',model:'gemini-test-flash',enabled:true,dailyLimit:1,version,apiKey:'demo-test-key-only-123',updatedBy:admin.user.uid,updatedAt:serverTimestamp()};
  await setDoc(doc(admin.db,'ai_settings/runtime'),config);
  assert.equal((await getDoc(doc(user.db,'ai_settings/runtime'))).data().apiKey,config.apiKey);
  await assert.rejects(updateDoc(doc(user.db,'ai_settings/runtime'),{enabled:false}),e=>e.code==='permission-denied');
  await assert.rejects(updateDoc(doc(moderator.db,'ai_settings/runtime'),{enabled:false}),e=>e.code==='permission-denied');
  const messagePath=`ai_chat_threads/${user.user.uid}/messages/test`;
  await setDoc(doc(user.db,messagePath),{role:'user',text:'Gợi ý món',recipes:[],createdAtMillis:Date.now()});
  await assert.rejects(getDoc(doc(other.db,messagePath)),e=>e.code==='permission-denied');
  const id=user.user.uid+'_'+'a'.repeat(32), now=Date.now();
  await setDoc(doc(user.db,'ai_chat_events/'+id),{uid:user.user.uid,status:'processing',attempts:1,attemptedAtMillis:now,leaseUntil:now+60000,expiresAt:Timestamp.fromMillis(now+7*86400000)});
  await updateDoc(doc(user.db,'ai_chat_events/'+id),{status:'done'});
  await assert.rejects(getDocs(collection(user.db,'ai_chat_events')),e=>e.code==='permission-denied');
  assert.equal((await getDocs(collection(admin.db,'ai_chat_events'))).size,1);
  await assert.rejects(updateDoc(doc(other.db,'ai_chat_events/'+id),{status:'failed'}),e=>e.code==='permission-denied');
  const quota=doc(user.db,`ai_chat_threads/${user.user.uid}/days/2026-11-18`);
  await setDoc(quota,{count:1,activeUntil:now+60000});
  await assert.rejects(updateDoc(quota,{count:2}),e=>e.code==='permission-denied');
  await updateDoc(quota,{activeUntil:0});
  await profile(user.user.uid,'user','locked');
  await assert.rejects(getDoc(doc(user.db,'ai_settings/runtime')),e=>e.code==='permission-denied');
  console.log('PASS: direct AI settings, admin roles, private history, quota, stats and locked-account rules.');
} finally { for(const app of apps){await terminate(getFirestore(app));await deleteApp(app);} }
