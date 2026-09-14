import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const readJson=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
export const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const md=s=>String(s).replace(/\[/g,'\\[').replace(/\]/g,'\\]');
export function validateData(data,profiles){
 const errors=[], fail=s=>errors.push(s), nodes=new Set(), edgeIds=new Set(), slugs=new Set();
 const present=s=>typeof s==='string'&&s.trim().length>0;
 const placeholder=s=>/\b(TODO|TBD|placeholder|lorem ipsum|coming soon)\b/i.test(s);
 const refs=(list,where)=>{if(!Array.isArray(list)||!list.length){fail(`${where}: sources required`);return;}for(const id of list)if(!data.sources[id])fail(`${where}: unknown source ${id}`);};
 for(const n of data.nodes){
  if(nodes.has(n.id))fail(`duplicate node ${n.id}`);nodes.add(n.id);
  if(slugs.has(slug(n.id)))fail(`wiki slug collision ${n.id}`);slugs.add(slug(n.id));
  if(!present(n.label))fail(`${n.id}: label required`);
  const p=profiles[n.id];if(!p){fail(`${n.id}: profile required`);continue;}
  if(!['person','organization','policy','group','topic'].includes(p.kind))fail(`${n.id}: invalid kind`);
  if(!present(p.subtitle)||p.subtitle.length>64||placeholder(p.subtitle))fail(`${n.id}: concise subtitle required (maximum 64 characters)`);
  if(!present(p.summary)||p.summary.trim().length<80||placeholder(p.summary))fail(`${n.id}: substantive summary required (80+ characters, no placeholders)`);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(p.updated)||Number.isNaN(Date.parse(p.updated)))fail(`${n.id}: valid updated date required`);
  refs(p.sources,`${n.id} profile`);
 }
 for(const id of Object.keys(profiles))if(!nodes.has(id))fail(`orphan profile ${id}`);
 for(const e of data.edges){
  if(edgeIds.has(e.id))fail(`duplicate edge ${e.id}`);edgeIds.add(e.id);
  if(!nodes.has(e.source)||!nodes.has(e.target))fail(`${e.id}: missing endpoint`);
  if(!present(e.relation)||!present(e.date)||!present(e.evidence))fail(`${e.id}: relation, date and status required`);
  if(!['documented','reported','unverified lead'].includes(e.evidence))fail(`${e.id}: invalid evidence status`);
  if(!['investment','funding','employment','governance','family','access','legislation','proposal','amplification'].includes(e.type))fail(`${e.id}: invalid relationship type`);
  refs(e.sources,e.id);
 }
 for(const [id,s] of Object.entries(data.sources)){
  if(s.id!==id||!present(s.title)||!present(s.kind)||(!present(s.accessed)&&!(s.kind==='unretrieved lead'&&present(s.note))))fail(`${id}: complete source metadata required`);
  try{if(!['https:','http:'].includes(new URL(s.url).protocol))throw Error();}catch{fail(`${id}: valid HTTP(S) URL required`);}
 }
 for(const [i,e] of data.events.entries())refs(e.sources,`event ${i}`);
 for(const [i,e] of data.leads.entries())refs(e.sources,`lead ${i}`);
 return errors;
}
export function compileWiki(data,profiles){
 const files=new Map(), citation=id=>`[${id}](../sources/${id}.md)`, entity=id=>`[${md(id)}](${slug(id)}.md)`;
 for(const n of data.nodes){
  const p=profiles[n.id],edges=data.edges.filter(e=>[e.source,e.target].includes(n.id));
  const related=[...new Set(edges.flatMap(e=>[e.source,e.target]))].filter(id=>id!==n.id);
  files.set(`wiki/entities/${slug(n.id)}.md`,`---\ntitle: ${JSON.stringify(n.label)}\ntype: entity\nkind: ${p.kind}\nupdated: ${p.updated}\n---\n\n# ${n.label}\n\n**${p.subtitle}**\n\n${p.summary}\n\nProfile sources: ${p.sources.map(citation).join(', ')}.\n\n## Dated relationship records\n\n${edges.map(e=>`- **${e.date} · ${e.evidence} · ${e.id}:** ${entity(e.source)} → ${md(e.relation)} → ${entity(e.target)}. ${e.sources.map(citation).join(', ')}.`).join('\n')}\n\n## Related pages\n\n${related.map(id=>`- ${entity(id)}`).join('\n')}\n\n[Entity index](../entities.md) · [Wiki home](../index.md)\n\n<!-- Generated from data/node-profiles.json and data/evidence.json. Edit those records, then run npm run wiki:build. -->\n`);
 }
 for(const [id,s] of Object.entries(data.sources)){
  const es=data.edges.filter(e=>e.sources.includes(id)),ps=data.nodes.filter(n=>profiles[n.id].sources.includes(id));
  const leads=data.leads.filter(l=>l.sources.includes(id));
  const events=data.events.filter(e=>e.sources.includes(id));
  files.set(`wiki/sources/${id}.md`,`---\ntitle: ${JSON.stringify(s.title)}\ntype: source\nsource_id: ${id}\naccessed: ${s.accessed||'Not retrieved; lead only'}\n---\n\n# ${s.title}\n\n[Original external source](${s.url})\n\nType: **${s.kind}**. Recorded access date: **${s.accessed||'Not retrieved; lead only'}**.\n\n## Use in this investigation\n\nThis source is referenced by ${ps.length} node profiles, ${es.length} relationship records, ${events.length} timeline entries and ${leads.length} follow-up leads. The statements below describe its recorded use, rather than an independent summary of the entire publication.\n\n${es.map(e=>`- **${e.id} · ${e.date} · ${e.evidence}:** [${md(e.source)}](../entities/${slug(e.source)}.md) → ${md(e.relation)} → [${md(e.target)}](../entities/${slug(e.target)}.md).`).join('\n')||'Consult the timeline or lead records in the dataset for this source’s recorded use.'}\n\n## Profile backlinks\n\n${ps.map(n=>`- [${md(n.label)}](../entities/${slug(n.id)}.md)`).join('\n')||'No node profile currently cites this source.'}\n\n## Provenance\n\nThe starting dataset is preserved in the [imported investigation snapshot](../../raw/2026-09-14-investigation-seed.json). That snapshot is a research dataset, not an archived copy of the external publication. Read the original before extending claims. Newly introduced sources should document their capture in the source registry’s optional rawPath field.\n\n${s.rawPath?`[Local capture](../../${s.rawPath})\n\n`:''}[Source index](../sources.md) · [Wiki home](../index.md)\n\n<!-- Generated by npm run wiki:build; edit canonical data rather than this page. -->\n`);
 }
 files.set('wiki/entities.md',`# Entity index\n\n${data.nodes.length} populated profiles. Open a page for its description, dated relationships, citations and related entities.\n\n${data.nodes.map(n=>`- [${md(n.label)}](entities/${slug(n.id)}.md) — ${profiles[n.id].kind}. ${profiles[n.id].summary}`).join('\n')}\n\n[Wiki home](index.md)\n`);
 files.set('wiki/sources.md',`# Source index\n\n${Object.keys(data.sources).length} source records with usage notes and backlinks.\n\n${Object.entries(data.sources).map(([id,s])=>`- [${id}: ${md(s.title)}](sources/${id}.md) — ${s.kind}; recorded access ${s.accessed||'Not retrieved; lead only'}.`).join('\n')}\n\n[Wiki home](index.md)\n`);
 return files;
}
