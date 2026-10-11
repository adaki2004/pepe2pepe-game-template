import {cp,mkdir,rm,readFile} from 'node:fs/promises';
import {validateManifest} from './release-game.mjs';
validateManifest(JSON.parse(await readFile('game/pepe-game.json','utf8')));
await rm('dist',{recursive:true,force:true});await mkdir('dist');await cp('game','dist',{recursive:true});console.log('Static game exported to dist.');
