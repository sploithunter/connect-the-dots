import {test} from 'node:test';import assert from 'node:assert/strict';
import {findPaths} from '../lib/find-paths.mjs';
const e=(id,source,target,type='funding',evidence='documented')=>({id,source,target,type,evidence});
const edges=[e('1','A','B'),e('2','B','C'),e('3','A','C'),e('4','C','A'),e('5','B','D','employment','reported'),e('6','D','C')];
test('paths are shortest first and contain no repeated nodes',()=>{const r=findPaths(edges,'A','C');assert.ok(r.paths.length);assert.deepEqual(r.paths.map(p=>p.steps.length),r.paths.map(p=>p.steps.length).sort((a,b)=>a-b));for(const p of r.paths)assert.equal(new Set(p.nodes).size,p.nodes.length);});
test('reverse traversal preserves recorded direction and forward mode excludes it',()=>{assert.equal(findPaths([e('1','A','B')],'B','A').paths[0].steps[0].reverse,true);assert.equal(findPaths([e('1','A','B')],'B','A',{directed:true}).paths.length,0);});
test('relationship and evidence filters apply to every edge',()=>{const r=findPaths(edges,'A','D',{types:['funding']});assert.ok(r.paths.every(p=>!p.steps.some(s=>s.edgeId==='5')));assert.equal(findPaths(edges,'A','D',{statuses:['unverified lead']}).paths.length,0);});
test('depth limit, identical endpoints, missing endpoints and cap are explicit',()=>{assert.equal(findPaths(edges,'A','D',{maxHops:1}).paths.length,0);assert.equal(findPaths(edges,'A','A').paths.length,0);assert.equal(findPaths(edges,'A','Z').paths.length,0);assert.equal(findPaths(edges,'A','C',{maxResults:1}).truncated,true);assert.equal(findPaths(edges,'A','C',{maxExpansions:1}).truncated,true);});
