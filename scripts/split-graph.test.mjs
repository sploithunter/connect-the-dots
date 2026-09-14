import test from 'node:test';
import assert from 'node:assert/strict';
import {splitNeighborhoods} from '../lib/split-graph.mjs';
const edge=(id,source,target)=>({id,source,target});
test('split preserves each neighborhood and finds records across their boundaries',()=>{
 const edges=[edge('1','a','b'),edge('2','z','y'),edge('3','y','b'),edge('4','b','c')];
 const result=splitNeighborhoods(edges,['a','z'],[1,1],[]);
 assert.deepEqual(result.panes[0].ids,['a','b']);
 assert.deepEqual(result.panes[1].ids,['z','y']);
 assert.deepEqual(result.cross,[{edge:edges[2],left:'b',right:'y'}]);
 assert.equal(result.cross[0].edge.source,'y'); // Recorded direction survives screen placement.
 const expanded=splitNeighborhoods(edges,['a','z'],[2,1],[]);
 assert(expanded.panes[0].ids.includes('c'));
 assert.deepEqual(expanded.panes[1],result.panes[1]);
});
test('shared identities stay separate from actual relationship records',()=>{
 const edges=[edge('1','a','common'),edge('2','z','common')];
 const result=splitNeighborhoods(edges,['a','z'],[1,1],[]);
 assert.deepEqual(result.shared,['common']);
 assert(result.panes.every(p=>p.ids.includes('common')));
 assert.equal(result.cross.length,2);
 assert(result.cross.every(c=>edges.includes(c.edge)));
});
test('empty and disconnected selections retain their graphs without inventing cross links',()=>{
 const edges=[edge('1','a','b'),edge('2','z','y')];
 const disconnected=splitNeighborhoods(edges,['a','z'],[1,1],[]);
 assert.equal(disconnected.cross.length,0);
 assert.equal(disconnected.panes[0].edges.length,1);
 assert.equal(disconnected.panes[1].edges.length,1);
 assert.deepEqual(splitNeighborhoods([],['a','z'],[1,1],[]).panes.map(p=>p.ids),[['a'],['z']]);
 const browsing=splitNeighborhoods(edges,['','z'],[1,1],['a','b']);
 assert.deepEqual(browsing.panes[0].ids,['a','b']);
 assert.equal(browsing.cross.length,0);
});
