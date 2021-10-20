(() => {
    const RESOLUTION = 2;
    const vertexShader = `precision highp float;
precision mediump int;

attribute vec3 position;
attribute vec2 aUv;

varying vec2 vUv;
void main (){
  vUv = aUv;
  gl_Position = vec4(position, 1.0);
}
`
    const fragmentShader = `precision highp float;
precision mediump int;

varying vec2 vUv;
uniform float uTime;

mat2 rotateMatrix(float rad){
  float s = sin(rad);
  float c = cos(rad);

  return mat2(
  c, s,
  -s, c
  );
}

void main(){
  mat2 rotation = rotateMatrix(
  uTime * radians(360.0)
  );
  vec2 uv = (vUv * rotation);

  gl_FragColor = vec4(
  mix(
  vec4(vec3(1.0), 1.0),
  vec4(0.2 * uv.y, uv.x, uv.y, 1.0),
  0.12
  )
  );

}
`
    const w = document.body.offsetWidth || window.innerWidth
    const h = window.innerHeight
    const cw = w * RESOLUTION;
    const ch = h * RESOLUTION;

    const cvs = document.querySelector('canvas');


    if (!cvs) return;


    cvs.width = cw;
    cvs.height = ch;

    cvs.style.cssText += `width:${w}px;height:${h}px;`;

    // 頂点座標
    const vertexBufferSource = new Float32Array([-1, 1, 0, 1, 1, 0, 1, -1, 0, -1, -1, 0]);
    const indices = new Int16Array([0, 2, 1, 0, 3, 2]);

    // uniforms
    const INITIAL_TIME = 0.95; // MAGIC NUMBER


    const gl = createWebGLContext(cvs);

    // WebGLProgramの作成
    const program = gl.createProgram();

    // 頂点シェーダー、フラグメントシェーダーを用意
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);

    if (!fs || !vs || !program) {
        return;
    }

    // シェーダー文字列を紐付け
    gl.shaderSource(vs, vertexShader);
    gl.shaderSource(fs, fragmentShader);

    // コンパイル
    gl.compileShader(vs);
    gl.compileShader(fs);

    // シェーダーコンパイルのチェック
    const vsIsCompiled = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
    const fsIsCompiled = gl.getShaderParameter(fs, gl.COMPILE_STATUS);

    if (!vsIsCompiled) {
        console.error("VERTEX SHADER", gl.getShaderInfoLog(vs)); // シェーダーデバッグ用
        return;
    }
    if (!fsIsCompiled) {
        console.error("FRAGMENT SHADER", gl.getShaderInfoLog(fs)); // シェーダーデバッグ用
        return;
    }

    // シェーダーをプログラムに紐付け
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    const programIsLinked = gl.getProgramParameter(program, gl.LINK_STATUS);

    // チェック
    if (!programIsLinked) {
        console.error(gl.getProgramInfoLog(program)); // シェーダーデバッグ用
        return;
    }

    // WebGLProgramの使用
    gl.useProgram(program);

    // position作成
    const aPositionLocation = gl.getAttribLocation(program, "position");

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vertexBufferSource, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(aPositionLocation);
    gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // UV座標
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([/* uv01 */ 0, 0, /* uv02 */ 1, 0, /* uv03 */ 0, 1, /* uv04 */ 1, 1]),
        gl.STATIC_DRAW
    );

    const aUvLocation = gl.getAttribLocation(program, "aUv");

    gl.enableVertexAttribArray(aUvLocation);
    gl.vertexAttribPointer(aUvLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // uniform割当
    const uTimeLocation = gl.getUniformLocation(program, "uTime");

    // WebGLのviewport設定
    gl.viewport(0, 0, cw, ch);


    requestAnimationFrame(render)

    // レンダリング
    function render(t) {
        const DURATION = 10000; // [ms]
        const time = (t % DURATION) / DURATION; // [ms/ms]

        gl.clear(gl.COLOR_BUFFER_BIT);
        uTimeLocation && gl.uniform1f(uTimeLocation, time);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(render);
    }

    function createWebGLContext(cvs) {
        const gl2 = cvs.getContext("webgl2");
        if (gl2) {
            return gl2;
        }

        const gl1 = cvs.getContext("webgl");
        if (!gl1) {
            throw new Error("Failed to obtain WebGL 1.0 context");
        }
        return gl1;
    }
})();




