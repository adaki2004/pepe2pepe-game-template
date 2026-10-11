#!/usr/bin/env node
// Coordinating Swarm agent: wait for hosting, validate the pinned export, submit once.
import {readFile,writeFile,mkdir,open,unlink} from 'node:fs/promises';
import {randomUUID,randomBytes} from 'node:crypto';
import {parseArgs} from 'node:util';
import {pathToFileURL} from 'node:url';
import {dirname,resolve} from 'node:path';
export const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const CID=/^bafybei[a-z2-7]{52}$/;
export function validateManifest(m){
 if(m?.schemaVersion!=='pepe-browser-game/1'||m.players!==1||typeof m.mobile!=='boolean'||!['arcade','puzzle','action','strategy','casual'].includes(m.genre))throw Error('Unsupported game manifest');
 for(const [key,min,max] of [['title',2,60],['summary',10,160],['description',10,2000],['controls',5,500]])if(typeof m[key]!=='string'||m[key].trim().length<min||m[key].length>max||/[\x00-\x1f\x7f]/.test(m[key]))throw Error('Invalid manifest '+key);
 if(!/^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(m.version))throw Error('Invalid version');
 for(const [key,ext]of [['entry','html'],['cover','svg|png|jpg|jpeg|webp']])if(typeof m[key]!=='string'||!new RegExp('^[a-zA-Z0-9_-][a-zA-Z0-9_./-]{0,119}\\.('+ext+')$').test(m[key])||m[key].includes('..')||m[key].includes('//'))throw Error('Invalid asset path');
 return m;
}
export function publication(job,id){
 if(job.id!==id)throw Error('Swarm returned a different job');
 if(['failed','cancelled'].includes(job.state)||job.site?.takenDownAt||job.site?.supersededBy)throw Error('The Swarm job or published site is unavailable');
 if(job.state!=='completed'||!['pinned','naming','named'].includes(job.site?.status)||!CID.test(job.site?.cid))return null;
 if(job.site.jobId!==id)throw Error('Published site belongs to another job');
 return {cid:job.site.cid,ensName:job.site.ensName||null};
}
export async function boundedJson(response,max=131072){
 if(!response.ok)throw Error('Remote request failed ('+response.status+')');
 const reader=response.body.getReader();let bytes=0;const chunks=[];
 try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>max)throw Error('Remote JSON too large');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});}
 return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
function origin(value){const u=new URL(value);if(u.origin!==value||u.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(u.hostname))throw Error('Expected an HTTPS origin');return value;}
export async function release(o,{fetcher=fetch,sleep=ms=>new Promise(r=>setTimeout(r,ms)),log=console.log}={}){
 if(!UUID.test(o.job||''))throw Error('Supply --job JOB_UUID. Your agent receives it from Swarm admission.');
 const api=origin(process.env.PEPE_GAME_API||'https://game-api-production-2d95.up.railway.app'),swarm=origin(process.env.SWARM_API||'https://api.imd.fun'),gateway=origin(process.env.SWARM_GATEWAY||'https://ipfs.imd.fun');
 const file=resolve(o.receipt||`.private/release-${o.job}.json`);await mkdir(dirname(file),{recursive:true,mode:0o700});let lock;
 try{
 lock=await open(file+'.lock','wx',0o600);
 let receipt;try{receipt=JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
 if(receipt&&(receipt.input?.jobId!==o.job||receipt.api!==api||!UUID.test(receipt.id)||!/^[-_A-Za-z0-9]{43}$/.test(receipt.capability)))throw Error('Receipt does not belong to this job/API');
 const request=(url,init={})=>fetcher(url,{...init,redirect:'error',signal:AbortSignal.timeout(20000)});
 if(o.status&&!receipt)throw Error('No saved receipt. Run release with this job first.');
 if(!receipt){
 const seconds=Number(o.timeout||7200);if(!Number.isFinite(seconds)||seconds<1||seconds>86400)throw Error('Timeout must be 1–86400 seconds');
 const until=Date.now()+seconds*1000;let site;
 while(!site){site=publication(await boundedJson(await request(swarm+'/jobs/'+o.job)),o.job);if(site)break;if(Date.now()>=until)throw Error('Publication is still pending. Resume with the same job; do not pay for another.');log('Swarm is building or publishing. Checking again in 20 seconds.');await sleep(20000);}
 const root=gateway+'/ipfs/'+site.cid+'/';
 const manifest=validateManifest(await boundedJson(await request(root+'pepe-game.json'),12000));
 for(const path of [manifest.entry,manifest.cover]){const r=await request(root+path,{method:'HEAD'});if(!r.ok)throw Error('Published asset unavailable: '+path);}
 const input={id:randomUUID(),cid:site.cid,manifest,contact:o.contact||'Swarm job '+o.job,jobId:o.job};
 receipt={id:input.id,api,capability:randomBytes(32).toString('base64url'),input,site:{url:root+manifest.entry,ensName:site.ensName},createdAt:new Date().toISOString()};
 const out=await open(file,'wx',0o600);try{await out.writeFile(JSON.stringify(receipt,null,2));await out.sync();}finally{await out.close();}
 }
 const headers={'content-type':'application/json','x-game-submission':receipt.capability};
 const response=await request(api+'/v1/game-submissions'+(o.status?'/'+receipt.id:''),{method:o.status?'GET':'POST',headers,body:o.status?undefined:JSON.stringify(receipt.input)});
 if(!response.ok)throw Error(`Submission API ${response.status}. Private receipt retained. Resume this same command; never create a replacement to recover a timeout.`);
 const result=await boundedJson(response);const report={id:receipt.id,status:result.status,website:receipt.site.url,ensName:receipt.site.ensName,job:'https://explorer.imd.fun/jobs/'+o.job,review:'Administrator review required before listing',...(result.status==='approved'?{play:'https://pepe2pepe.fun/games/play/'+receipt.id}:{})};
 await writeFile(file.replace(/\.json$/,'')+'.result.json',JSON.stringify(report,null,2),{mode:0o600});log(JSON.stringify(report,null,2));return report;
 }finally{if(lock){await lock.close();await unlink(file+'.lock');}}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const {values}=parseArgs({options:{job:{type:'string'},contact:{type:'string'},receipt:{type:'string'},timeout:{type:'string'},status:{type:'boolean'}}});try{await release(values);}catch(e){console.error(e.message);process.exitCode=1;}}
