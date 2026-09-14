import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readJson,validateData,compileWiki} from './knowledge.mjs';
const data=readJson('data/evidence.json'),profiles=readJson('data/node-profiles.json');
test('current dataset has complete profiles and resolvable citations',()=>assert.deepEqual(validateData(data,profiles),[]));
test('new nodes cannot be added without populated profiles',()=>{const d=structuredClone(data);d.nodes.push({id:'New entity',label:'New entity'});assert.ok(validateData(d,profiles).some(e=>e.includes('New entity: profile required')));});
test('placeholder profiles and missing citations block publication',()=>{const p=structuredClone(profiles);p['METR'].summary='TODO';p['METR'].sources=['missing'];const errors=validateData(data,p);assert.ok(errors.some(e=>e.includes('substantive summary')));assert.ok(errors.some(e=>e.includes('unknown source')));});
test('dangling endpoints and unsafe source URLs are rejected',()=>{const d=structuredClone(data);d.edges[0].target='Unknown';d.sources.A1.url='javascript:alert(1)';const errors=validateData(d,profiles);assert.ok(errors.some(e=>e.includes('missing endpoint')));assert.ok(errors.some(e=>e.includes('HTTP(S) URL')));});
test('US proposal wiki page preserves both primary source paths',()=>{const page=compileWiki(data,profiles).get('wiki/entities/us-ban-asi-proposal.md');assert.ok(page.includes('../sources/C3.md'));assert.ok(page.includes('../sources/L1.md'));assert.ok(page.includes(profiles['US Ban ASI proposal'].summary));});

test('new profiles must include an informative graph subtitle',()=>{const p=structuredClone(profiles);delete p.METR.subtitle;assert.ok(validateData(data,p).some(e=>e.includes('subtitle required')));});
test('source wiki pages include archive links when present',()=>{const page=compileWiki(data,profiles).get('wiki/sources/X1.md');assert.ok(page.includes('Archived or Memento copy'));assert.ok(page.includes(data.sources.X1.archiveUrl));});
