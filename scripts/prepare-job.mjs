import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {BRIEF_LIMITS,BRIEF_TOTAL_LIMIT,briefLength,swarmBuildBrief} from './creator-brief.mjs';
const brief=JSON.parse(await readFile('brief.json','utf8'));
for(const [key,max] of Object.entries(BRIEF_LIMITS)){const value=brief[key]??'';if(typeof value!=='string'||value.length>max)throw Error(`${key} must be text up to ${max} characters.`);brief[key]=value;}
if(brief.idea.trim().length<20)throw Error('Describe the game idea in at least 20 characters.');
if(briefLength(brief)>BRIEF_TOTAL_LIMIT)throw Error('Keep the combined brief within 7000 characters.');
const objective=swarmBuildBrief(brief);
if(objective.length>8000)throw Error('Swarm objective exceeds 8000 characters.');
await mkdir('.private',{recursive:true,mode:0o700});await writeFile('.private/job.json',JSON.stringify({objective,skill:'build-website',github:true,ipfs:true,onchain:false},null,2),{mode:0o600});
console.log('Swarm job prepared in .private/job.json. Submit once using your agent’s authorized Swarm access. Continue with npm run release -- --job JOB_UUID after admission.');
