// Illustrative building surfaces and camera poses, not research results.
export async function initReconstruction(viewport) {
  const probe = document.createElement("canvas");
  const gl = probe.getContext("webgl2");
  if (!gl) {
    viewport.dataset.state = "fallback";
    return;
  }
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  const THREE = await import("../vendor/three/three.module.min.js");
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  viewport.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const center = new THREE.Vector3(0, 0.9, 0);
  const group = new THREE.Group();
  scene.add(group);
  const grid = new THREE.GridHelper(10, 20, 0xb8c8b8, 0xd4dfce);
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  group.add(grid);
  let seed = 971009;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const positions = [],
    colors = [];
  const buildings = [
    [-1.3, 0.85, -0.2, 2.1, 1.7, 1.7],
    [0.9, 1.45, -0.8, 1.55, 2.9, 1.65],
    [0.1, 0.5, 1.25, 2.8, 1, 1.2],
  ];
  for (let i = 0; i < 7600; i++) {
    const [cx, cy, cz, w, h, d] = buildings[i % buildings.length];
    let x = (random() - 0.5) * w,
      y = (random() - 0.5) * h,
      z = (random() - 0.5) * d;
    const face = Math.floor(random() * 5);
    if (face === 0) x = -w / 2;
    else if (face === 1) x = w / 2;
    else if (face === 2) z = -d / 2;
    else if (face === 3) z = d / 2;
    else y = h / 2;
    positions.push(cx + x, cy + y, cz + z);
    const tint = new THREE.Color().setHSL(
      0.39 + random() * 0.08,
      0.25 + random() * 0.2,
      0.1 + ((cy + y) / 3) * 0.12 + random() * 0.03,
    );
    colors.push(tint.r, tint.g, tint.b);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const splatCanvas = document.createElement("canvas");
  splatCanvas.width = 32;
  splatCanvas.height = 32;
  const ctx = splatCanvas.getContext("2d");
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.5, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  const texture = new THREE.CanvasTexture(splatCanvas);
  const material = new THREE.PointsMaterial({
    size: 0.048,
    map: texture,
    vertexColors: true,
    transparent: true,
    opacity: 0.86,
    depthWrite: false,
    alphaTest: 0.02,
  });
  group.add(new THREE.Points(geometry, material));
  const trajectory = [];
  for (let i = 0; i <= 80; i++) {
    const a = -0.3 + (i / 80) * Math.PI * 1.7;
    trajectory.push(
      new THREE.Vector3(Math.cos(a) * 3.8, 0.45, Math.sin(a) * 3.5),
    );
  }
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xac723d,
    transparent: true,
    opacity: 0.8,
  });
  group.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(trajectory),
      lineMaterial,
    ),
  );
  const frustumPoints = [];
  const corners = [
    new THREE.Vector3(-0.24, -0.16, -0.4),
    new THREE.Vector3(0.24, -0.16, -0.4),
    new THREE.Vector3(0.24, 0.16, -0.4),
    new THREE.Vector3(-0.24, 0.16, -0.4),
  ];
  corners.forEach((c, i) =>
    frustumPoints.push(new THREE.Vector3(), c, c, corners[(i + 1) % 4]),
  );
  const frustumGeometry = new THREE.BufferGeometry().setFromPoints(
    frustumPoints,
  );
  for (let i = 4; i < 80; i += 13) {
    const frustum = new THREE.LineSegments(frustumGeometry, lineMaterial);
    frustum.position.copy(trajectory[i]);
    frustum.lookAt(frustum.position.clone().multiplyScalar(2).sub(center));
    group.add(frustum);
  }
  const density = document.querySelector("#density"),
    rotate = document.querySelector("#rotate"),
    controls = document.querySelector(".scene-controls");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let rotation = 0,
    pointerX = 0,
    pointerY = 0,
    visible = true,
    rotating = false,
    frame = 0,
    previous = 0,
    disposed = false,
    lost = false;
  const events = new AbortController();
  const on = (target, type, fn) =>
    target.addEventListener(type, fn, { signal: events.signal });
  function draw(time = 0) {
    frame = 0;
    if (disposed || lost || !visible || document.hidden) {
      previous = 0;
      return;
    }
    if (rotating && !reduced.matches) {
      rotation += Math.min(time - previous || 0, 40) * 0.00012;
      previous = time;
    }
    const angle = 0.7 + rotation + pointerX * 0.12;
    camera.position.set(
      Math.sin(angle) * 10.8,
      6.6 + pointerY * 0.3,
      Math.cos(angle) * 10.8,
    );
    camera.lookAt(center);
    renderer.render(scene, camera);
    if (rotating && !reduced.matches) frame = requestAnimationFrame(draw);
  }
  function requestDraw() {
    if (!frame && !disposed && !lost && visible && !document.hidden)
      frame = requestAnimationFrame(draw);
  }
  function resize() {
    const { width, height } = viewport.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  function setDensity() {
    geometry.setDrawRange(
      0,
      Math.round(650 + (Number(density.value) / 100) * 6950),
    );
    material.size = 0.06 + (Number(density.value) / 100) * 0.04;
    requestDraw();
  }
  function stopRotation() {
    rotating = false;
    previous = 0;
    rotate.setAttribute("aria-pressed", "false");
    rotate.textContent = "Rotate view";
    requestDraw();
  }
  on(density, "input", setDensity);
  on(rotate, "click", () => {
    rotating = !rotating;
    previous = 0;
    rotate.setAttribute("aria-pressed", String(rotating));
    rotate.textContent = rotating ? "Pause rotation" : "Rotate view";
    requestDraw();
  });
  on(viewport, "pointermove", (e) => {
    if (reduced.matches || e.pointerType === "touch") return;
    const r = viewport.getBoundingClientRect();
    pointerX = (e.clientX - r.left) / r.width - 0.5;
    pointerY = (e.clientY - r.top) / r.height - 0.5;
    requestDraw();
  });
  on(viewport, "pointerleave", () => {
    pointerX = pointerY = 0;
    requestDraw();
  });
  on(document, "visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    } else requestDraw();
  });
  function motionChange() {
    if (reduced.matches) {
      stopRotation();
      pointerX = pointerY = 0;
    }
    rotate.hidden = reduced.matches;
    requestDraw();
  }
  on(reduced, "change", motionChange);
  on(renderer.domElement, "webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    viewport.dataset.state = "fallback";
    controls.hidden = true;
  });
  on(renderer.domElement, "webglcontextrestored", () => {
    lost = false;
    viewport.dataset.state = "ready";
    controls.hidden = false;
    resize();
  });
  const intersection = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (!visible) {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    } else requestDraw();
  });
  intersection.observe(viewport);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewport);
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    events.abort();
    intersection.disconnect();
    resizeObserver.disconnect();
    const geometries = new Set(),
      materials = new Set();
    scene.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) materials.add(object.material);
    });
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    texture.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    viewport.dataset.state = "fallback";
    controls.hidden = true;
  }
  on(window, "pagehide", (e) => {
    if (!e.persisted) dispose();
  });
  on(window, "pageshow", () => requestDraw());
  setDensity();
  resize();
  motionChange();
  controls.hidden = false;
  viewport.dataset.state = "ready";
  return dispose;
}
