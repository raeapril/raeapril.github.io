import * as THREE from "three";

const BG = 0x0c0c0e;
const BG_CSS = "#0c0c0e";
const INK = "#f2efe9";
const POINT = "#8FB8FF";

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a, b, t) => a + (b - a) * t;

// 섹션 앵커(hero → work → about → contact)마다 클로버가 머무를 위치·크기
const KEYFRAMES = [
  { x: 0, y: 0.05, s: 1 },
  { x: 2.5, y: 0.75, s: 0.55 },
  { x: -2.6, y: -0.55, s: 0.68 },
  { x: 0, y: 0.15, s: 1.2 },
];

// 원 4개를 겹친 네잎 클로버 실루엣을 두께감 있게 압출한다.
function cloverGeometry() {
  const d = 0.5;
  const r = 0.56;
  const s = Math.sqrt(2 * r * r - d * d);
  const k = (d + s) / 2;
  const shape = new THREE.Shape();
  const centers = [[0, d], [-d, 0], [0, -d], [d, 0]];
  const cusps = [[k, k], [-k, k], [-k, -k], [k, -k], [k, k]];
  shape.moveTo(k, k);
  centers.forEach(([cx, cy], i) => {
    const [ax, ay] = cusps[i];
    const [bx, by] = cusps[i + 1];
    shape.absarc(cx, cy, r, Math.atan2(ay - cy, ax - cx), Math.atan2(by - cy, bx - cx), false);
  });
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.16,
    bevelSegments: 14,
    curveSegments: 64,
  });
  g.center();
  g.computeVertexNormals();
  return g;
}

// 유리 굴절이 살아나도록 컬러 라이트 패널로 만든 가짜 스튜디오 환경맵
function studioEnvironment(renderer) {
  const env = new THREE.Scene();
  env.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(20, 32, 16),
      new THREE.MeshBasicMaterial({ color: 0x0a0a0c, side: THREE.BackSide })
    )
  );
  const panel = (w, h, hex, k, pos) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(hex).multiplyScalar(k),
        side: THREE.DoubleSide,
      })
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  panel(10, 2.5, 0xffffff, 3.2, [0, 8, 3]);
  panel(3, 8, 0x8fb8ff, 3.5, [-8, 0.5, 2]);
  panel(3, 7, 0xb8b2ff, 2.6, [8, -1, 3]);
  panel(6, 1.2, 0xffffff, 1.6, [0, -6, 5]);
  panel(8, 4, 0xd6e6ff, 0.8, [0, 1, -9]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.03).texture;
  pmrem.dispose();
  return tex;
}

/**
 * 고정 배경 캔버스: 뒤쪽 평면에 "WEB PUBLISHER" 타이포를 그리고,
 * 그 앞에서 유리 클로버가 스크롤 구간마다 위치를 옮겨 다닌다.
 */
export function createCloverScene(host, { autoRotate = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(BG);
  renderer.domElement.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  cam.position.set(0, 0, 6);
  scene.environment = studioEnvironment(renderer);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.06,
    transmission: 1,
    thickness: 1.4,
    ior: 1.42,
    iridescence: 0.7,
    iridescenceIOR: 1.25,
    iridescenceThicknessRange: [120, 480],
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    attenuationColor: new THREE.Color(0xd9e8ff),
    attenuationDistance: 2.4,
    specularIntensity: 1,
    envMapIntensity: 1.3,
  });
  const clover = new THREE.Mesh(cloverGeometry(), glassMat);
  const pivot = new THREE.Group();
  pivot.add(clover);
  scene.add(pivot);

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0x8fb8ff,
    metalness: 1,
    roughness: 0.18,
    clearcoat: 1,
  });
  const orbs = [0.17, 0.11, 0.07].map((r, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 32), i === 1 ? glassMat : chrome);
    pivot.add(m);
    return m;
  });

  const tc = document.createElement("canvas");
  const textTex = new THREE.CanvasTexture(tc);
  textTex.colorSpace = THREE.SRGBColorSpace;
  const textPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: textTex, toneMapped: false })
  );
  textPlane.position.z = -1.6;
  scene.add(textPlane);

  const S = { vw: 0, vh: 0, visH: 1, fit: 1 };

  function drawText() {
    const ctx = tc.getContext("2d");
    tc.width = 2048;
    tc.height = Math.round(2048 / (S.vw / S.vh));
    ctx.fillStyle = BG_CSS;
    ctx.fillRect(0, 0, tc.width, tc.height);
    const display = (px) => `800 ${px}px "Bricolage Grotesque", sans-serif`;
    const hasLS = "letterSpacing" in ctx;

    // "PUBLISHER" 가 화면 폭의 92% 를 채우도록 글자 크기 역산
    ctx.font = display(100);
    if (hasLS) ctx.letterSpacing = "-4.5px";
    const fs = (100 * tc.width * 0.92) / ctx.measureText("PUBLISHER").width;
    ctx.font = display(fs);
    if (hasLS) ctx.letterSpacing = `${-fs * 0.045}px`;

    const x = tc.width * 0.04;
    const lh = fs * 0.86;
    const y2 = tc.height * 0.54 + lh * 0.55;
    const y1 = y2 - lh;
    ctx.fillStyle = INK;
    ctx.textBaseline = "alphabetic";
    ctx.fillText("WEB", x, y1);
    ctx.fillText("PUBLISHER", x, y2);

    if (hasLS) ctx.letterSpacing = "0px";
    ctx.font = `400 ${Math.max(22, fs * 0.075)}px "JetBrains Mono", monospace`;
    ctx.fillStyle = POINT;
    ctx.textAlign = "right";
    ctx.fillText(`(PORTFOLIO — ${new Date().getFullYear()})`, tc.width * 0.96, y1 - fs * 0.6);
    ctx.textAlign = "left";
    textTex.needsUpdate = true;
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    S.vw = w;
    S.vh = h;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    const dist = cam.position.z - textPlane.position.z;
    S.visH = 2 * dist * Math.tan((cam.fov * Math.PI) / 360);
    textPlane.scale.set(S.visH * cam.aspect, S.visH, 1);
    S.fit = clamp(cam.aspect / 1.5, 0.45, 1);
    drawText();
  }

  /**
   * @param time   씬 시작 후 경과 초
   * @param y      window.scrollY
   * @param mouse  { x, y } -1..1 로 보간된 포인터 위치
   * @param anchors 섹션 시작 스크롤 위치 4개
   */
  function render(time, y, mouse, anchors) {
    if (!S.vw) return;
    const intro = ease(clamp((time - 0.2) / 1.6));

    // 배경 타이포는 페이지와 함께 위로 스크롤되어 사라진다
    textPlane.position.y = (y / S.vh) * S.visH;

    let i = 0;
    while (i < anchors.length - 2 && y > anchors[i + 1]) i++;
    const seg = ease(clamp((y - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i])));
    const A = KEYFRAMES[i];
    const B = KEYFRAMES[i + 1];
    const tx = lerp(A.x, B.x, seg) * S.fit;
    const ty = lerp(A.y, B.y, seg);
    const ts = lerp(A.s, B.s, seg) * lerp(0.75, 1, S.fit);
    pivot.position.x += (tx - pivot.position.x) * 0.08;
    pivot.position.y += (ty - pivot.position.y) * 0.08;
    pivot.scale.setScalar(Math.max(0.001, ts * intro));

    const spin = autoRotate ? Math.sin(time * 0.45) * 0.55 : 0;
    clover.rotation.set(
      0.18 + mouse.y * 0.3 + Math.sin(time * 0.6) * 0.08,
      spin + mouse.x * 0.5 + Math.sin(y * 0.002) * 0.9 + (1 - intro) * 4,
      time * 0.12 + y * 0.0012
    );
    orbs.forEach((o, k) => {
      const ang = time * (0.5 + k * 0.22) + k * 2.1;
      const rad = 1.55 + k * 0.28;
      o.position.set(
        Math.cos(ang) * rad,
        Math.sin(ang * 1.3) * 0.5 + (k - 1) * 0.3,
        Math.sin(ang) * rad * 0.6
      );
    });

    renderer.render(scene, cam);
  }

  function dispose() {
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
    glassMat.dispose();
    chrome.dispose();
    textPlane.material.dispose();
    textTex.dispose();
    scene.environment?.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { resize, render, dispose };
}
