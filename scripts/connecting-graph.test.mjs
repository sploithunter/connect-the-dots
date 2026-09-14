import test from 'node:test';
import assert from 'node:assert/strict';
import {connectingEdges,expandConnectingGraphs} from '../lib/connecting-graph.mjs';
import {graphView,connectionsBetween} from '../lib/graph-view.mjs';
import {readFileSync} from 'node:fs';
const edge=(id,source,target)=>({id,source,target});
function brute(edges,left,right){
 const found=new Set();
 for(const start of left)for(const end of right){
  if(start===end)continue;
  const visit=(node,seen,path)=>{
   if(node===end){for(const e of path)found.add(e.id);return;}
   for(const e of edges){const next=e.source===node?e.target:e.target===node?e.source:null;if(next!==null&&!seen.has(next))visit(next,new Set([...seen,next]),[...path,e]);}
  };visit(start,new Set([start]),[]);
 }
 return [...found].sort();
}
test('seven-link outer limit includes tangential routes and excludes longer ones and dead-end branches',()=>{
 const route=Array.from({length:8},(_,i)=>edge(String(i),String(i),String(i+1)));
 const branches=[edge('branch','2','dead'),edge('cycle1','3','x'),edge('cycle2','x','y'),edge('cycle3','y','3')];
 assert.deepEqual(connectingEdges([...route,...branches],['0'],['7']).edges,route.slice(0,7));
 assert.deepEqual(connectingEdges(route,['0'],['8']).edges,[]);
 assert.equal(connectingEdges(route,['0'],['7']).nodeHops.get('4'),7);
});
test('all alternative routes, parallel records and original directions survive',()=>{
 const edges=[edge('1','a','b'),edge('2','c','b'),edge('3','a','d'),edge('4','d','c'),edge('5','c','b'),edge('loop','a','a')];
 assert.deepEqual(connectingEdges(edges,['a'],['c']).edges,edges.slice(0,5));
 assert.deepEqual(connectingEdges(edges,['a'],['absent']).edges,[]);
 assert.deepEqual(connectingEdges(edges,['a'],['a']).edges,[]);
});
test('block decomposition matches exhaustive simple paths across varied overlapping terminal sets',()=>{
 let seed=42;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 for(let trial=0;trial<200;trial++){
  const ids=['0','1','2','3','4','5'],edges=[];
  for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)if(random()<.38)edges.push(edge(`${i}-${j}`,ids[i],ids[j]));
  const left=ids.filter(()=>random()<.3),right=ids.filter(()=>random()<.3);
  assert.deepEqual(connectingEdges(edges,left,right).edges.map(e=>e.id).sort(),brute(edges,left,right),`trial ${trial}`);
 }
});
test('context limits branches but never removes connecting records; every connector is rendered',()=>{
 const edges=[edge('1','a','b'),edge('2','b','c'),edge('3','c','d'),edge('4','a','branch'),edge('5','branch','leaf')];
 const base=[{ids:['a','branch'],edges:[edges[3]]},{ids:['d'],edges:[]}];
 const result=expandConnectingGraphs(edges,base);
 assert(!result.panes.some(p=>p.ids.includes('leaf')));
 assert(result.panes[0].ids.includes('branch'));
 assert(result.panes.some(p=>p.ids.includes('b'))&&result.panes.some(p=>p.ids.includes('c')));
 const crossing=connectionsBetween(edges,result.panes[0].ids,result.panes[1].ids).cross;
 const visible=new Set([...result.panes.flatMap(p=>p.edges.map(e=>e.id)),...crossing.map(c=>c.edge.id)]);
 assert(result.bridge.every(e=>visible.has(e.id)));
});
test('SBF–Sanders depth-one views retain both Conjecture–ControlAI routes',()=>{
 const raw=JSON.parse(readFileSync(new URL('../data/evidence.json',import.meta.url)));
 const config=JSON.parse(readFileSync(new URL('../config/network.json',import.meta.url)));
 const base=['Sam Bankman-Fried','Bernie Sanders'].map(anchor=>graphView(raw.nodes,raw.edges,config,{view:'neighborhood',anchor,depth:1}));
 const result=expandConnectingGraphs(raw.edges,base,[['Sam Bankman-Fried'],['Bernie Sanders']]);
 assert(result.panes[0].ids.includes('Connor Leahy'));
 assert(result.panes[0].ids.includes('Gabriel Alfour'));
 assert(result.panes[1].ids.includes('ControlAI'));
 assert(['E051','E058','E059','E063','E064','E068'].every(id=>result.bridge.some(e=>e.id===id)));
});

test('bounded search reports budget exhaustion without labeling partial results complete',()=>{
 const edges=[edge('1','a','b'),edge('2','b','c'),edge('3','a','c')];
 assert.equal(connectingEdges(edges,['a'],['c'],{maxExpansions:1}).truncated,true);
});
