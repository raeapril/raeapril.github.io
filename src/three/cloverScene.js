import * as THREE from "three";
import { clamp, ease, lerp } from "../lib/math";

const BG = 0x0c0c0e;
const BG_CSS = "#0c0c0e";
const INK = "#f2efe9";
const POINT = "#E8B4BC";

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
  panel(3, 8, 0xe8b4bc, 3.5, [-8, 0.5, 2]);
  panel(3, 7, 0xb8b2ff, 2.6, [8, -1, 3]);
  panel(6, 1.2, 0xffffff, 1.6, [0, -6, 5]);
  panel(8, 4, 0xffe6d6, 0.8, [0, 1, -9]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.03).texture;
  pmrem.dispose();
  return tex;
}

/**
 * 고정 배경 캔버스: 뒤쪽 평면에 "WEB PUBLISHER" 타이포를 그리고,
 * 그 앞에서 유리 클로버가 스크롤 구간마다 위치를 옮겨 다닌다.
 */
export function createCloverScene(host, { autoRotate = true, onTextLayout } = {}) {
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
    attenuationColor: new THREE.Color(0xffd9df),
    attenuationDistance: 2.4,
    specularIntensity: 1,
    envMapIntensity: 1.3,
  });
  const clover = new THREE.Mesh(cloverGeometry(), glassMat);
  const pivot = new THREE.Group();
  pivot.add(clover);
  scene.add(pivot);

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xe8b4bc,
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

  const S = { vw: 0, vh: 0, visH: 1, fit: 1, sizeFit: 1, heroLift: 0, heroBoost: 1 };

  function drawText() {
    const ctx = tc.getContext("2d");
    const height = Math.round(2048 / (S.vw / S.vh));
    // WebGL2 텍스처는 처음 올린 크기로 고정된다. 화면 비율이 바뀌어 캔버스 크기가 달라지면
    // 기존 GPU 텍스처를 버려 새 크기로 다시 만들게 한다(안 그러면 글자가 늘어나 찌그러짐).
    if (tc.height !== height) textTex.dispose();
    tc.width = 2048;
    tc.height = height;
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
    // 캔버스가 화면 폭에 맞춰 축소되므로, 좁은 화면에서도 실제 화면 기준 11px 이상이 되게 한다
    const capPx = Math.max(fs * 0.075, (11 * tc.width) / S.vw);
    ctx.font = `400 ${capPx}px "JetBrains Mono", monospace`;
    ctx.fillStyle = POINT;
    ctx.textAlign = "right";
    ctx.fillText(`(PORTFOLIO — ${new Date().getFullYear()})`, tc.width * 0.96, y1 - fs * 0.6);
    ctx.textAlign = "left";
    textTex.needsUpdate = true;

    // 화면 기준(px) "PUBLISHER" 베이스라인 위치·왼쪽 끝 → HTML 문구를 타이포 바로 아래에 붙일 때 사용
    onTextLayout?.({ bottom: (y2 / tc.height) * S.vh, left: (x / tc.width) * S.vw });
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
    // 가로 이동 폭은 화면 비율에 맞춰 줄인다
    S.fit = clamp(cam.aspect / 1.5, 0.3, 1);
    // 클로버(폭 약 2.4)가 화면 폭의 50% 를 넘지 않게. 데스크톱(가로 화면)에서는 1 그대로
    const visW0 = 2 * cam.position.z * Math.tan((cam.fov * Math.PI) / 360) * cam.aspect;
    S.sizeFit = Math.min(1, (visW0 * 0.5) / 2.4);
    // 세로 화면 히어로: 클로버를 화면 폭의 약 85% 까지 키우고 화면 정중앙(y=0)에 둔다
    // (히어로 키프레임의 기본 y=0.05 살짝 위 오프셋을 상쇄)
    const portrait = clamp((1 - cam.aspect) / 0.5);
    S.heroLift = portrait * -KEYFRAMES[0].y;
    S.heroBoost = 1 + portrait * 0.7;
    drawText();
  }

  /**
   * @param time   씬 시작 후 경과 초
   * @param y      window.scrollY
   * @param mouse  { x, y } -1..1 로 보간된 포인터 위치
   * @param anchors 섹션 시작 스크롤 위치 4개
   * @param intro  인트로 로더가 끝난 뒤 0→1 로 차오르는 진행도
   */
  function render(time, y, mouse, anchors, intro) {
    if (!S.vw) return;

    // 배경 타이포는 인트로 동안 화면 아래에서 올라오고, 이후 페이지와 함께 위로 스크롤된다
    textPlane.position.y = (y / S.vh) * S.visH - (1 - intro) * S.visH;

    let i = 0;
    while (i < anchors.length - 2 && y > anchors[i + 1]) i++;
    const seg = ease(clamp((y - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i])));
    const A = KEYFRAMES[i];
    const B = KEYFRAMES[i + 1];
    const ay = A.y + (i === 0 ? S.heroLift : 0);
    const tx = lerp(A.x, B.x, seg) * S.fit;
    const ty = lerp(ay, B.y, seg);
    const as = A.s * (i === 0 ? S.heroBoost : 1);
    const ts = lerp(as, B.s, seg) * S.sizeFit;
    pivot.position.x += (tx - pivot.position.x) * 0.08;
    pivot.position.y += (ty - pivot.position.y) * 0.08;
    // 로딩 중에는 작게 빙글빙글 돌다가 인트로가 끝나면 제 크기로 커진다
    pivot.scale.setScalar(Math.max(0.001, ts * lerp(0.42, 1, intro)));

    const spin = autoRotate ? Math.sin(time * 0.45) * 0.55 : 0;
    clover.rotation.set(
      0.18 + mouse.y * 0.3 + Math.sin(time * 0.6) * 0.08,
      spin + mouse.x * 0.5 + Math.sin(y * 0.002) * 0.9 + (1 - intro) * time * 2.4,
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
