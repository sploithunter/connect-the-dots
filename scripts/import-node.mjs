import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,readJson,validateData,compileWiki} from './knowledge.mjs';

// Pure preparation: reject invalid imports before touching any repository file.
export function prepareImport(data,profiles,config,packet){
 const d=structuredClone(data),p=structuredClone(profiles),c=structuredClone(config);
 const n=packet.node;
 if(!n?.id||!n.label)throw Error('node.id and node.label are required');
 if(d.nodes.some(existing=>existing.id===n.id))throw Error(`Node already exists: ${n.id}; edit its canonical records to update it.`);
 for(const source of packet.sources||[]){
  if(d.sources[source.id])throw Error(`Source already exists: ${source.id}; reference its ID instead of redefining it.`);
  d.sources[source.id]=source;
 }
 const {id,label,...profile}=n;
 d.nodes.push({id,label});d.nodes.sort((a,b)=>a.id.localeCompare(b.id));p[id]=profile;
 if(!Array.isArray(packet.connections)||!packet.connections.length)throw Error('At least one sourced connection is required');
 for(const edge of packet.connections){
  if(edge.source!==id&&edge.target!==id)throw Error(`Connection ${edge.id} must involve the new node`);
  d.edges.push({note:'',amount:null,...edge});
 }
 for(const view of packet.views||[]){
  if(!c.views[view]||['overview','all','neighborhood'].includes(view))throw Error(`Unknown or reserved focus view: ${view}. Use overviewPosition for the overview.`);
  if(!c.views[view].seeds.includes(id))c.views[view].seeds.push(id);
 }
 if(packet.overviewPosition)c.overviewPositions[id]=packet.overviewPosition;
 if(packet.startNode)c.startNodes.push(id);
 const errors=validateData(d,p,c);
 if(errors.length)throw Error(errors.join('\n'));
 return {data:d,profiles:p,config:c};
}

function main(){
 const args=process.argv.slice(2),file=args.find(a=>!a.startsWith('--'));
 if(!file||args.includes('--help')){
  console.log('Usage: npm run node:add -- path/to/node.json [--dry-run]\nSee examples/node.template.json and wiki/configuration.md.');return;
 }
 const packet=JSON.parse(fs.readFileSync(path.resolve(file),'utf8'));
 const result=prepareImport(readJson('data/evidence.json'),readJson('data/node-profiles.json'),readJson('config/network.json'),packet);
 const output=compileWiki(result.data,result.profiles), json=value=>JSON.stringify(value,null,2)+'\n';
 output.set('data/evidence.json',json(result.data));output.set('data/node-profiles.json',json(result.profiles));output.set('config/network.json',json(result.config));
 const date=new Date().toISOString().slice(0,10);
 output.set('wiki/log.md',fs.readFileSync(path.join(root,'wiki/log.md'),'utf8')+`\n## [${date}] ingest — ${packet.node.label}\n\nImported a populated node profile, ${packet.connections.length} cited relationship records and ${(packet.sources||[]).length} new source records from a node packet. Regenerated entity/source pages and indexes. Review affected topic guides before publication.\n`);
 if(args.includes('--dry-run')){console.log(`Valid import: ${packet.node.id}. Would update ${output.size} data/config/wiki files; no files written.`);return;}
 // Preserve pre-import contents so a filesystem failure can be rolled back.
 const backups=new Map([...output.keys()].map(file=>{const target=path.join(root,file);return[file,fs.existsSync(target)?fs.readFileSync(target):null];}));
 try{for(const [file,body] of output){const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,body);}}
 catch(error){for(const [file,body] of backups){const target=path.join(root,file);if(body===null){if(fs.existsSync(target))fs.unlinkSync(target);}else fs.writeFileSync(target,body);}throw error;}
 console.log(`Added ${packet.node.id}; updated data, configuration, wiki and log. Next: review the diff and affected topics, then npm run build. No commit or push was made.`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main();}catch(error){console.error(error.message);process.exitCode=1;}}
