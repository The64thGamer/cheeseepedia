  (function () {
    const tooltip = document.getElementById('tw-ocr-tooltip');
    if (!tooltip) return;

    const OFFSET_X = 14;
    const OFFSET_Y = 14;

    document.querySelectorAll('.ocr-region[data-tip]').forEach(function (region) {
      region.addEventListener('mouseenter', function () {
        tooltip.textContent = region.getAttribute('data-tip');
        tooltip.style.display = 'block';
      });

      region.addEventListener('mousemove', function (e) {
        let x = e.clientX + OFFSET_X;
        let y = e.clientY + OFFSET_Y;

        const tw = tooltip.offsetWidth;
        const th = tooltip.offsetHeight;
        if (x + tw > window.innerWidth - 8)  x = e.clientX - tw - OFFSET_X;
        if (y + th > window.innerHeight - 8) y = e.clientY - th - OFFSET_Y;

        tooltip.style.left = x + 'px';
        tooltip.style.top  = y + 'px';
      });

      region.addEventListener('mouseleave', function () {
        tooltip.style.display = 'none';
      });
    });
  })();

  
  (function () {
  const wrap = document.querySelector('.tw-evidence-wrap');
  if (!wrap) return;

  const img = wrap.querySelector('img');
  if (!img) return;

  const slider   = document.getElementById('ev-slider');
  const resetBtn = document.getElementById('ev-reset');
  const tabs     = document.querySelectorAll('.ev-tab');

  const values = { blacks: 0, mids: 0, whites: 0, sharpen: 0 };
  let active = 'blacks';
  let gl, program, texture, canvas;

  const VS = `
    attribute vec2 a_pos;
    attribute vec2 a_uv;
    varying vec2 v_uv;
    void main() {
      v_uv = a_uv;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const FS = `
    precision mediump float;
    uniform sampler2D u_tex;
    uniform vec2 u_texel;
    uniform float u_blacks;
    uniform float u_whites;
    uniform float u_mids;
    uniform float u_sharpen;
    varying vec2 v_uv;

    float applyLevels(float v) {
      float inBlack  = -u_blacks * 0.5;
      float inWhite  = 1.0 - u_whites * 0.5;
      float gamma    = u_mids >= 0.0
        ? 1.0 - u_mids * 0.9
        : 1.0 + abs(u_mids) * 2.5;
      float remapped = (v - inBlack) / (inWhite - inBlack);
      remapped = clamp(remapped, 0.0, 1.0);
      return pow(remapped, gamma);
    }

    void main() {
      // Unsharp mask: sample 4 neighbours
      vec4 center = texture2D(u_tex, v_uv);
      vec4 n = texture2D(u_tex, v_uv + vec2( 0.0,  u_texel.y));
      vec4 s = texture2D(u_tex, v_uv + vec2( 0.0, -u_texel.y));
      vec4 e = texture2D(u_tex, v_uv + vec2( u_texel.x,  0.0));
      vec4 w = texture2D(u_tex, v_uv + vec2(-u_texel.x,  0.0));
      vec4 blurred = (n + s + e + w) * 0.25;
      vec4 sharpened = center + (center - blurred) * u_sharpen;
      vec4 col = mix(center, sharpened, clamp(u_sharpen, 0.0, 1.0));

      // Apply levels per channel
      col.r = applyLevels(col.r);
      col.g = applyLevels(col.g);
      col.b = applyLevels(col.b);
      col.a = center.a;

      gl_FragColor = col;
    }
  `;

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  function initWebGL() {
    canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.style.maxWidth  = '100%';
    canvas.className = img.className;

    gl = canvas.getContext('webgl');
    if (!gl) { console.error('WebGL not supported'); return false; }

    // Compile program
    program = gl.createProgram();
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER,   VS));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    // Full-screen quad
    const verts = new Float32Array([
      -1, -1,  0, 1,
       1, -1,  1, 1,
      -1,  1,  0, 0,
       1,  1,  1, 0,
    ]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_pos');
    const aUV  = gl.getAttribLocation(program, 'a_uv');
    gl.enableVertexAttribArray(aPos);
    gl.enableVertexAttribArray(aUV);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(aUV,  2, gl.FLOAT, false, 16, 8);

    // Upload image as texture
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    gl.uniform1i(gl.getUniformLocation(program, 'u_tex'), 0);
    gl.uniform2f(gl.getUniformLocation(program, 'u_texel'),
      1.0 / canvas.width, 1.0 / canvas.height);

    img.replaceWith(canvas);
    return true;
  }

  function render() {
    if (!gl) return;
    gl.uniform1f(gl.getUniformLocation(program, 'u_blacks'),  values.blacks  / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_whites'),  values.whites  / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_mids'),    values.mids    / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_sharpen'), values.sharpen / 5);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function ensureInit() {
    if (!gl) initWebGL();
  }

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    active = tab.dataset.target;
    slider.min = active === 'sharpen' ? 0 : -100;
    slider.value = values[active];
  });
});
slider.addEventListener('input', () => {
  values[active] = slider.valueAsNumber;
  ensureInit();
  render();
});
  slider.addEventListener('input', () => {
    values[active] = slider.valueAsNumber;
    ensureInit();
    render();
  });

  resetBtn.addEventListener('click', () => {
    values.blacks = values.mids = values.whites = values.sharpen = 0;
    slider.value = 0;
    if (gl) render();
  });
})();