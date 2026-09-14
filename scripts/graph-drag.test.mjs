import {test} from 'node:test';
import assert from 'node:assert/strict';
import {draggedPosition,graphBounds} from '../lib/graph-drag.mjs';
test('node movement accounts for SVG scaling after zoom',()=>{
 assert.deepEqual(draggedPosition({x:400,y:200},{x:100,y:-40},{a:.5,b:0,c:0,d:.5}),{x:450,y:180});
});
test('screen translation does not alter drag delta and off-center grab preserves position',()=>{
 assert.deepEqual(draggedPosition({x:130,y:120},{x:0,y:0},{a:2,b:0,c:0,d:2}),{x:130,y:120});
 assert.deepEqual(draggedPosition({x:130,y:120},{x:-25,y:50},{a:2,b:0,c:0,d:2}),{x:80,y:220});
});
test('fit and export bounds contain manually moved nodes outside original layout',()=>{
 const bounds=graphBounds([{x:-500,y:0},{x:2000,y:1000}]);
 assert.ok(bounds.x<-500);assert.ok(bounds.x+bounds.w>2000);assert.ok(bounds.y+bounds.h>1000);
});
