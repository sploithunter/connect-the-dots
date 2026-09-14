import test from 'node:test';
import assert from 'node:assert/strict';
import {graphView,connectionsBetween} from '../lib/graph-view.mjs';
const nodes=['a','b','c','d','isolated'].map(id=>({id}));
const edges=[{id:'1',source:'a',target:'b',type:'funding'},{id:'2',source:'c',target:'b',type:'employment'},{id:'3',source:'c',target:'d',type:'funding'}];
const config={overviewPositions:{a:[0,0],b:[1,1]},views:{capital:{seeds:['a']},governance:{seeds:['c']}}};
test('named views include incoming and outgoing records and work for config-only additions',()=>{
 assert.deepEqual(graphView(nodes,edges,config,{view:'capital'}).edges,[edges[0]]);
 assert.deepEqual(graphView(nodes,edges,config,{view:'governance'}).edges,[edges[1],edges[2]]);
 const extended={...config,views:{...config.views,newView:{seeds:['b']}}};
 assert.deepEqual(graphView(nodes,edges,extended,{view:'newView'}).edges,[edges[0],edges[1]]);
});
test('overview, all, filters, neighborhood depth and snapshots retain their defined semantics',()=>{
 assert.deepEqual(graphView(nodes,edges,config,{view:'overview'}).edges,[edges[0]]);
 assert(graphView(nodes,edges,config,{view:'all'}).ids.includes('isolated'));
 assert.deepEqual(graphView(nodes,edges,config,{view:'governance',excluded:['funding']}).edges,[edges[1]]);
 assert.deepEqual(graphView(nodes,edges,config,{view:'neighborhood',anchor:'a',depth:2}).edges,[edges[0],edges[1]]);
 assert.deepEqual(graphView(nodes,edges,config,{view:'neighborhood',anchor:'isolated'}).ids,['isolated']);
 assert.deepEqual(graphView(nodes,edges,config,{view:'snapshot',snapshot:{ids:['c','d'],edgeIds:['3']}}).edges,[edges[2]]);
});
test('bridges work between named views without requiring node picks and preserve record direction',()=>{
 const a=graphView(nodes,edges,config,{view:'capital'}),b=graphView(nodes,edges,config,{view:'governance'});
 const result=connectionsBetween(edges,a.ids,b.ids);
 assert.deepEqual(result.shared,['b']);
 assert.deepEqual(result.cross.map(c=>c.edge.id),['1','2']);
 assert.deepEqual(result.cross[1],{edge:edges[1],left:'b',right:'c'});
 assert.equal(result.cross[1].edge.source,'c');
});
test('duplicate views retain a single cross record per edge and disconnected views have none',()=>{
 const result=connectionsBetween(edges,nodes.map(n=>n.id),nodes.map(n=>n.id));
 assert.equal(result.cross.length,edges.length);
 assert.equal(new Set(result.cross.map(c=>c.edge.id)).size,edges.length);
 assert.deepEqual(connectionsBetween(edges,['a'],['isolated']),{cross:[],shared:[]});
});
