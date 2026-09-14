import test from 'node:test';
import assert from 'node:assert/strict';
import {neighborhoodEdges,bridgeLayout} from '../lib/explore-graph.mjs';
const edges=[['a','b'],['b','c'],['c','d'],['b','e'],['e','c'],['x','y']].map(([source,target])=>({source,target}));
test('neighborhood expands one ring at a time and retains links among reached nodes',()=>{
 assert.deepEqual(neighborhoodEdges(edges,'a',1),[edges[0]]);
 assert.deepEqual(neighborhoodEdges(edges,'a',2),[edges[0],edges[1],edges[3],edges[4]]);
 assert.equal(neighborhoodEdges(edges,'a',3).length,5);
 assert.deepEqual(neighborhoodEdges(edges,'isolated',3),[]);
});
test('two-focus layout preserves endpoints, includes isolated selections and avoids overlapping labels',()=>{
 const ids=['a','b','c','d','e'];
 const points=bridgeLayout(ids,[{nodes:['a','b','c','d']},{nodes:['a','e','d']}],'a','d');
 assert.equal(points.length,ids.length);
 const left=points.find(p=>p.id==='a'),right=points.find(p=>p.id==='d');
 assert(points.every(p=>p.x>=left.x&&p.x<=right.x));
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)assert(Math.abs(points[i].x-points[j].x)>=220||Math.abs(points[i].y-points[j].y)>=112);
 assert.equal(bridgeLayout(['a','z'],[],'a','z').length,2);
});
