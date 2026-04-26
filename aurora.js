// Aurora effect — vanilla JS port of the React Bits Aurora component
// Depends on OGL loaded via CDN (see index.html)

(function () {
  const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0),
                           dot(x12.xy, x12.xy),
                           dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

vec3 colorRamp(vec3 c0, vec3 c1, vec3 c2, float t) {
  if (t < 0.5) {
    return mix(c0, c1, t / 0.5);
  } else {
    return mix(c1, c2, (t - 0.5) / 0.5);
  }
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec3 rampColor = colorRamp(uColorStops[0], uColorStops[1], uColorStops[2], uv.x);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}`;

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ] : [0, 0, 0];
  }

  function initAurora(container, options) {
    const {
      colorStops = ['#5227FF', '#7cff67', '#5227FF'],
      amplitude = 1.0,
      blend = 0.5,
      speed = 0.5
    } = options || {};

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true
    });

    if (!gl) {
      console.warn('Aurora: WebGL2 not supported');
      return;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // Compile shaders
    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Aurora shader error:', gl.getShaderInfoLog(s));
      }
      return s;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full-screen triangle (covers clip space with 3 vertices)
    const verts = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTime       = gl.getUniformLocation(program, 'uTime');
    const uAmplitude  = gl.getUniformLocation(program, 'uAmplitude');
    const uBlend      = gl.getUniformLocation(program, 'uBlend');
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uColorStops = gl.getUniformLocation(program, 'uColorStops');

    function resize() {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uResolution, w, h);
    }

    resize();
    window.addEventListener('resize', resize);

    // Set static uniforms
    gl.uniform1f(uAmplitude, amplitude);
    gl.uniform1f(uBlend, blend);
    gl.uniform3fv(uColorStops, new Float32Array(colorStops.flatMap(hexToRgb)));

    let rafId;
    function render(t) {
      rafId = requestAnimationFrame(render);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t * 0.001 * speed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    rafId = requestAnimationFrame(render);

    // Cleanup hook (optional)
    container._auroraCleanup = () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }

  // Auto-init on any element with data-aurora
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-aurora]').forEach(el => {
      initAurora(el, {
        colorStops: (el.dataset.auroraColors || '#5227FF,#B497CF,#7cff67').split(',').map(s => s.trim()),
        amplitude:  parseFloat(el.dataset.auroraAmplitude  || '1.0'),
        blend:      parseFloat(el.dataset.auroraBlend      || '0.5'),
        speed:      parseFloat(el.dataset.auroraSpeed      || '0.5')
      });
    });
  });

  window.initAurora = initAurora;
})();
