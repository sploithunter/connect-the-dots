import fs from 'node:fs';
import path from 'node:path';
import {root,readJson,validateData,compileWiki} from './knowledge.mjs';
const data=readJson('data/evidence.json'), profiles=readJson('data/node-profiles.json');
const errors=validateData(data,profiles);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
const files=compileWiki(data,profiles), check=process.argv.includes('--check');
for(const [file,body] of files){
 const absolute=path.join(root,file);
 if(check){if(!fs.existsSync(absolute)||fs.readFileSync(absolute,'utf8')!==body)errors.push(`Stale wiki page: ${file}; run npm run wiki:build`);}
 else{fs.mkdirSync(path.dirname(absolute),{recursive:true});fs.writeFileSync(absolute,body);}
}
for(const folder of ['wiki/entities','wiki/sources'])for(const name of fs.readdirSync(path.join(root,folder))){const file=`${folder}/${name}`;if(name.endsWith('.md')&&!files.has(file))errors.push(`Orphan generated page: ${file}; review and remove or migrate it.`);}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name));}
for(const file of walk(path.join(root,'wiki')).filter(p=>p.endsWith('.md'))){
 for(const match of fs.readFileSync(file,'utf8').matchAll(/\]\(([^)]+)\)/g)){
  const target=match[1];if(/^(https?:|#|mailto:)/.test(target))continue;
  if(!fs.existsSync(path.resolve(path.dirname(file),decodeURIComponent(target.split('#')[0]))))errors.push(`Broken wiki link in ${path.relative(root,file)}: ${target}`);
 }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`${check?'Validated':'Compiled'} ${data.nodes.length} profiles, ${data.edges.length} relationships, ${Object.keys(data.sources).length} sources and ${files.size} generated wiki pages.`);
