import {Renderer, Geometry, Program, Mesh} from "ogl";
import vertex from '~glsl/vs';
import fragment from '~glsl/fs';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new Renderer({width, height, webgl: 1});
const gl = renderer.gl;
document.body.appendChild(gl.canvas);

const geometry = new Geometry(gl, {
    position: {size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3])},
    uv: {size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2])},
})

const program = new Program(gl, {
    vertex,
    fragment
})

const mesh = new Mesh(gl, {geometry, program})

requestAnimationFrame(update)

function update() {
    renderer.render({scene: mesh})
    requestAnimationFrame(update);
}