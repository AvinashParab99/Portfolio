/* ============================================================================
   WEBGL — ek hi fixed canvas:
     1) background (single rose colour + grain, scroll par halka grey-white)
     2) "fold card" helper — project & shout cards DOM ke upar WebGL se draw hote
        hain aur screen ke edge par fold hote hain (projects: upar, shout: left).
   ============================================================================ */

const GL = (function setupWebGL() {

  const renderer = new THREE.WebGLRenderer({ canvas: $('#gl'), antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 1, 6000);

  /* ---------- 1) BACKGROUND ---------- */
  const bgUniforms = { uTime: { value: 0 }, uScroll: { value: 0 } };

  const background = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      depthTest: false,
      uniforms: bgUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }`,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uScroll;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

        void main() {
          // single colour family: halka gradient
          vec3 top    = vec3(0.937, 0.843, 0.855);
          vec3 bottom = vec3(0.902, 0.776, 0.796);
          vec3 color  = mix(bottom, top, vUv.y);

          // soft light spot
          color += 0.03 * smoothstep(0.8, 0.0, length(vUv - vec2(0.7, 0.8)));

          // scroll karne par rose -> grey-white
          float lum = dot(color, vec3(0.333));
          color = mix(color, mix(vec3(lum), vec3(0.93), 0.55), uScroll);

          // film grain
          color += (hash(vUv * 500.0 + uTime) - 0.5) * 0.045;
          gl_FragColor = vec4(color, 1.0);
        }`
    })
  );
  background.frustumCulled = false;
  background.renderOrder = -1;
  scene.add(background);

  /* ---------- 2) FOLD CARDS ---------- */

  // Shared fragment shader: texture + halka RGB-split (scroll speed / fold ke hisaab se) + fold shading
  const foldFragment = `
    uniform sampler2D map;
    uniform float uV;
    varying vec2 vUv;
    varying float vFold;

    void main() {
      float split = abs(uV) * 0.0035 + vFold * 0.005;
      vec4 r = texture2D(map, vUv + vec2(split, 0.0));
      vec4 g = texture2D(map, vUv);
      vec4 b = texture2D(map, vUv - vec2(split, 0.0));
      vec4 color = vec4(r.r, g.g, b.b, max(max(r.a, g.a), b.a));
      color.rgb = mix(color.rgb, vec3(0.78, 0.76, 0.80), vFold * 0.28);
      gl_FragColor = color;
    }`;

  // Vertical fold: card screen ke UPAR edge par cylinder jaise peeche mud jaata hai.
  const verticalVertex = `
    varying vec2 vUv;
    varying float vFold;
    uniform vec2 uC;        // card center (px, top-left origin)
    uniform vec2 uS;        // card size (px)
    uniform float uW, uH;   // viewport
    uniform float uV;       // scroll velocity

    void main() {
      vUv = uv;
      vec2 p = position.xy * uS;
      float yTop = uC.y - p.y;                 // vertex ki screen y (upar se)

      float foldLine = uH * 0.34;              // yahan se fold shuru
      float radius   = uH * 0.20;
      float dist     = max(foldLine - yTop, 0.0);
      float angle    = min(dist / radius, 1.5);
      float extra    = max(dist - radius * 1.5, 0.0);

      float y = yTop;
      float z = 0.0;
      if (dist > 0.0) {
        y = foldLine - radius * sin(angle) - extra * cos(1.5);
        z = -radius * (1.0 - cos(angle)) - extra * sin(1.5);
      }
      vFold = clamp(dist / (radius * 1.5), 0.0, 1.0);

      // scroll velocity: halka bend + skew
      z += sin(uv.x * 3.1416) * uV * 70.0;
      y += (uv.x - 0.5) * uV * 26.0;

      float x = uC.x - uW * 0.5 + p.x;
      gl_Position = projectionMatrix * viewMatrix * vec4(x, uH * 0.5 - y, z, 1.0);
    }`;

  // Horizontal fold: card screen ke LEFT edge par fold hota hai (shout outs).
  const horizontalVertex = `
    varying vec2 vUv;
    varying float vFold;
    uniform vec2 uC;
    uniform vec2 uS;
    uniform float uW, uH;
    uniform float uV;

    void main() {
      vUv = uv;
      vec2 p = position.xy * uS;
      float xLeft = uC.x + p.x;

      float foldLine = uW * 0.30;
      float radius   = uW * 0.17;
      float dist     = max(foldLine - xLeft, 0.0);
      float angle    = min(dist / radius, 1.5);
      float extra    = max(dist - radius * 1.5, 0.0);

      float x = xLeft;
      float z = 0.0;
      if (dist > 0.0) {
        x = foldLine - radius * sin(angle) - extra * cos(1.5);
        z = -radius * (1.0 - cos(angle)) - extra * sin(1.5);
      }
      vFold = clamp(dist / (radius * 1.5), 0.0, 1.0);

      z += sin(uv.y * 3.1416) * uV * 70.0;
      float y = uC.y - p.y + (uv.x - 0.5) * uV * 22.0;

      gl_Position = projectionMatrix * viewMatrix * vec4(x - uW * 0.5, uH * 0.5 - y, z, 1.0);
    }`;

  const verticalGeometry   = new THREE.PlaneGeometry(1, 1, 12, 56);
  const horizontalGeometry = new THREE.PlaneGeometry(1, 1, 56, 12);

  /** axis: 'y' (projects) ya 'x' (shout). Returns { mesh, uniforms }. */
  function createFoldCard(axis, texture) {
    const uniforms = {
      map: { value: texture },
      uC:  { value: new THREE.Vector2() },
      uS:  { value: new THREE.Vector2() },
      uW:  { value: App.W },
      uH:  { value: App.H },
      uV:  { value: 0 }
    };
    const mesh = new THREE.Mesh(
      axis === 'y' ? verticalGeometry : horizontalGeometry,
      new THREE.ShaderMaterial({
        transparent: true,
        depthTest: false,
        uniforms,
        vertexShader: axis === 'y' ? verticalVertex : horizontalVertex,
        fragmentShader: foldFragment
      })
    );
    mesh.frustumCulled = false;
    mesh.renderOrder = 1;
    scene.add(mesh);
    return { mesh, uniforms };
  }

  /** DOM element ki rect ke hisaab se card ko position karo. Visible ho to true. */
  function syncFoldCard(card, element, velocityBoost = 1) {
    const rect = element.getBoundingClientRect();
    const margin = App.H * 0.6;
    const visible = !element.hidden &&
                    rect.bottom > -margin && rect.top < App.H + 200 &&
                    rect.right  > -App.W * 0.7 && rect.left < App.W + 200;
    card.mesh.visible = visible;
    if (!visible) return false;

    card.uniforms.uC.value.set(rect.left + rect.width / 2, rect.top + rect.height / 2);
    card.uniforms.uS.value.set(rect.width, rect.height);
    card.uniforms.uV.value = App.velocity * velocityBoost;
    return true;
  }

  /* ---------- resize + frame ---------- */
  function resize() {
    renderer.setSize(App.W, App.H, false);
    camera.aspect = App.W / App.H;
    camera.position.z = App.H / 2 / Math.tan(camera.fov * Math.PI / 360);
    camera.updateProjectionMatrix();
    scene.children.forEach(obj => {
      const u = obj.material && obj.material.uniforms;
      if (u && u.uW) { u.uW.value = App.W; u.uH.value = App.H; }
    });
  }
  App.onResize(resize);
  resize();

  let scrollMix = 0;
  App.onTick(() => {
    scrollMix = lerp(scrollMix, clamp(scrollY / (App.H * 0.85), 0, 1), 0.08);
    bgUniforms.uTime.value   = App.time;
    bgUniforms.uScroll.value = scrollMix;
  });

  // render sabse last me (main.js me `GL.render` call hota hai)
  return {
    scene, camera, renderer,
    createFoldCard, syncFoldCard,
    render() { renderer.render(scene, camera); }
  };
})();
