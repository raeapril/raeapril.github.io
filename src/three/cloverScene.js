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

// 원 4개를 겹친 네잎 클로버 실루엣 (바깥 반경 = d + r = 1.06)
export const CLOVER_D = 0.5;
export const CLOVER_R = 0.56;
export function cloverShape() {
  const d = CLOVER_D;
  const r = CLOVER_R;
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
  return shape;
}

// 클로버 실루엣을 두께감 있게 압출한다.
export function cloverGeometry() {
  const g = new THREE.ExtrudeGeometry(cloverShape(), {
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
export function studioEnvironment(renderer) {
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
export function createCloverScene(host, { autoRotate = true, thumbs = [] } = {}) {
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

  // ── 클로버 안 썸네일 ──
  // 유리 바로 뒤에 클로버 모양으로 자른 썸네일 판을 두면, 유리를 통해 굴절돼 "썸네일 위에 유리가 얹힌" 느낌이 난다.
  // three 의 투과(transmission)는 불투명 물체만 비추므로 판은 불투명으로 두고, 나타나고 사라지는 건 배경색으로 페이드한다.
  const loader = new THREE.TextureLoader();
  // 이미지마다 비율이 달라도 가운데 정사각형만 쓰도록, 불러온 뒤 자를 범위(scale/offset)를 계산해 둔다
  const thumbTex = thumbs.map((url) => {
    const t = loader.load(url, () => {
      const a = t.image.width / t.image.height;
      t.userData.crop.set(a > 1 ? 1 / a : 1, a > 1 ? (1 - 1 / a) / 2 : 0, a < 1 ? a : 1, a < 1 ? (1 - a) / 2 : 0);
    });
    t.colorSpace = THREE.SRGBColorSpace;
    t.userData.crop = new THREE.Vector4(1, 0, 1, 0);
    return t;
  });
  const thumbGeo = new THREE.ShapeGeometry(cloverShape(), 48);
  {
    // 실루엣(±1.06) 기준 0..1 UV
    const ext = CLOVER_D + CLOVER_R;
    const pos = thumbGeo.attributes.position;
    const uv = thumbGeo.attributes.uv;
    for (let k = 0; k < pos.count; k++) {
      uv.setXY(k, (pos.getX(k) / ext) * 0.5 + 0.5, (pos.getY(k) / ext) * 0.5 + 0.5);
    }
    uv.needsUpdate = true;
  }
  const thumbMat = new THREE.ShaderMaterial({
    uniforms: {
      mapA: { value: thumbTex[0] ?? null },
      mapB: { value: thumbTex[0] ?? null },
      cropA: { value: new THREE.Vector4(1, 0, 1, 0) },
      cropB: { value: new THREE.Vector4(1, 0, 1, 0) },
      uMix: { value: 0 },
      uFade: { value: 0 },
      uBg: { value: new THREE.Color(BG) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D mapA;
      uniform sampler2D mapB;
      uniform vec4 cropA; // (u 배율, u 시작, v 배율, v 시작)
      uniform vec4 cropB;
      uniform float uMix;
      uniform float uFade;
      uniform vec3 uBg;
      varying vec2 vUv;
      void main() {
        vec2 uvA = vec2(vUv.x * cropA.x + cropA.y, vUv.y * cropA.z + cropA.w);
        vec2 uvB = vec2(vUv.x * cropB.x + cropB.y, vUv.y * cropB.z + cropB.w);
        vec3 c = mix(texture2D(mapA, uvA).rgb, texture2D(mapB, uvB).rgb, uMix);
        gl_FragColor = vec4(mix(uBg, c, uFade), 1.0);
        #include <colorspace_fragment>
      }`,
    toneMapped: false,
  });
  const thumb = new THREE.Mesh(thumbGeo, thumbMat);
  // 유리 뒷면(z ≈ -0.26) 바로 뒤. 클로버 자체는 돌아도 썸네일은 항상 정면을 본다
  thumb.position.z = -0.3;
  thumb.visible = false;
  pivot.add(thumb);
  const P = { k: 0, shown: -1, zLock: null, px: 0, py: 0 };

  // 클로버 뒤에 깔리는 화면 크기 타이포 판. 히어로("WEB PUBLISHER")와 Contact("LET'S WORK TOGETHER") 두 장
  function textLayer() {
    const canvas = document.createElement("canvas");
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
    );
    plane.position.z = -1.6;
    scene.add(plane);
    return { canvas, tex, plane };
  }
  const heroText = textLayer();
  const contactText = textLayer();
  const textPlane = heroText.plane;

  const S = { vw: 0, vh: 0, visH: 1, fit: 1, sizeFit: 1, heroLift: 0, heroBoost: 1, w0: 1, h0: 1 };

  const display = (px) => `800 ${px}px "Bricolage Grotesque", sans-serif`;

  /** 화면 비율에 맞춰 캔버스를 다시 잡고 배경색으로 비운다 */
  function prepare({ canvas, tex }) {
    const ctx = canvas.getContext("2d");
    const height = Math.round(2048 / (S.vw / S.vh));
    // WebGL2 텍스처는 처음 올린 크기로 고정된다. 화면 비율이 바뀌어 캔버스 크기가 달라지면
    // 기존 GPU 텍스처를 버려 새 크기로 다시 만들게 한다(안 그러면 글자가 늘어나 찌그러짐).
    if (canvas.height !== height) tex.dispose();
    canvas.width = 2048;
    canvas.height = height;
    ctx.fillStyle = BG_CSS;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return ctx;
  }

  function drawText() {
    drawHeroText();
    drawContactText();
  }

  function drawHeroText() {
    const tc = heroText.canvas;
    const ctx = prepare(heroText);
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
    heroText.tex.needsUpdate = true;
  }

  // Contact: 히어로와 같은 크기·자간으로 가운데 정렬. 마지막 마침표만 포인트 컬러
  function drawContactText() {
    const tc = contactText.canvas;
    const ctx = prepare(contactText);
    const hasLS = "letterSpacing" in ctx;
    const L1 = "LET\u2019S WORK";
    const L2 = "TOGETHER";

    ctx.font = display(100);
    if (hasLS) ctx.letterSpacing = "-4.5px";
    const widest = Math.max(ctx.measureText(L1).width, ctx.measureText(`${L2}.`).width);
    // 히어로(92%)보다 작게 — 긴 줄이 화면 폭의 52%
    const fs = (100 * tc.width * 0.52) / widest;
    ctx.font = display(fs);
    if (hasLS) ctx.letterSpacing = `${-fs * 0.045}px`;

    // 두 줄 덩어리(대문자 높이 ≈ 0.72fs)의 가운데를 화면 42% 높이에 둔다 — 아래쪽은 이메일 자리
    const lh = fs * 0.86;
    const y2 = tc.height * 0.42 + (lh + fs * 0.72) / 2;
    const y1 = y2 - lh;
    const cx = tc.width / 2;
    ctx.fillStyle = INK;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "center";
    ctx.fillText(L1, cx, y1);
    // 2줄은 "TOGETHER." 전체 폭 기준으로 가운데에 두고, 마침표만 색을 바꿔 이어 그린다
    const w2 = ctx.measureText(L2).width;
    const wDot = ctx.measureText(".").width;
    const x2 = cx - (w2 + wDot) / 2;
    ctx.textAlign = "left";
    ctx.fillText(L2, x2, y2);
    ctx.fillStyle = POINT;
    ctx.fillText(".", x2 + w2, y2);
    if (hasLS) ctx.letterSpacing = "0px";
    contactText.tex.needsUpdate = true;
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
    heroText.plane.scale.set(S.visH * cam.aspect, S.visH, 1);
    contactText.plane.scale.set(S.visH * cam.aspect, S.visH, 1);
    // 가로 이동 폭은 화면 비율에 맞춰 줄인다
    S.fit = clamp(cam.aspect / 1.5, 0.3, 1);
    // 클로버(폭 약 2.4)가 화면 폭의 50% 를 넘지 않게. 데스크톱(가로 화면)에서는 1 그대로
    const visW0 = 2 * cam.position.z * Math.tan((cam.fov * Math.PI) / 360) * cam.aspect;
    S.sizeFit = Math.min(1, (visW0 * 0.5) / 2.4);
    S.w0 = visW0;
    S.h0 = visW0 / cam.aspect;
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
   * @param preview Work 목록에서 호버 중인 프로젝트 번호 (-1 = 없음)
   * @param contactY Contact 타이포가 화면 정중앙에 오는 스크롤 위치
   */
  function render(time, y, mouse, anchors, intro, preview = -1, contactY = Infinity) {
    if (!S.vw) return;

    // 배경 타이포는 인트로 동안 화면 아래에서 올라오고, 이후 페이지와 함께 위로 스크롤된다
    textPlane.position.y = (y / S.vh) * S.visH - (1 - intro) * S.visH;
    // Contact 타이포도 페이지와 함께 움직이고, contactY 에서 화면 가운데에 온다
    contactText.plane.position.y = ((y - contactY) / S.vh) * S.visH;

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

    // 썸네일 미리보기: 호버 중이면 클로버가 커서 쪽으로 오고, 회전을 멈추고, 안에 썸네일이 차오른다
    const on = preview >= 0 && preview < thumbTex.length;
    P.k += ((on ? 1 : 0) - P.k) * 0.09;
    const k = ease(P.k);
    const goX = on ? mouse.tx * S.w0 * 0.5 : tx;
    const goY = on ? -mouse.ty * S.h0 * 0.5 : ty;
    const follow = on ? 0.12 : 0.08;
    P.px = pivot.position.x;
    P.py = pivot.position.y;
    pivot.position.x += (goX - pivot.position.x) * follow;
    pivot.position.y += (goY - pivot.position.y) * follow;
    // 로딩 중에는 작게 빙글빙글 돌다가 인트로가 끝나면 제 크기로 커진다
    const size = lerp(ts, 0.62 * S.sizeFit, k);
    pivot.scale.setScalar(Math.max(0.001, size * lerp(0.42, 1, intro)));

    const spin = autoRotate ? Math.sin(time * 0.45) * 0.55 : 0;
    const rx = 0.18 + mouse.y * 0.3 + Math.sin(time * 0.6) * 0.08;
    const ry = spin + mouse.x * 0.5 + Math.sin(y * 0.002) * 0.9 + (1 - intro) * time * 2.4;
    const rz = time * 0.12 + y * 0.0012;
    // 썸네일은 정면 고정이라, 유리 실루엣이 겹치도록 z 회전을 가장 가까운 90° 배수에 맞춘다(네잎이라 90° 대칭)
    if (on && P.zLock === null) P.zLock = Math.round(rz / (Math.PI / 2)) * (Math.PI / 2);
    if (!on && P.k < 0.01) P.zLock = null;
    // 미리보기 중에는 움직인 만큼만 살짝 기울어 관성감을 준다
    const vx = (pivot.position.x - P.px) / S.w0;
    const vy = (pivot.position.y - P.py) / S.h0;
    clover.rotation.set(
      lerp(rx, clamp(-vy * 9, -0.25, 0.25), k),
      lerp(ry, clamp(vx * 9, -0.3, 0.3), k),
      lerp(rz, P.zLock ?? rz, k)
    );
    // 두꺼운 유리는 썸네일을 너무 왜곡하므로 미리보기 중에는 얇게
    glassMat.thickness = lerp(1.4, 0.7, k);

    // 썸네일 교체: 다른 행으로 옮기면 이전 이미지에서 새 이미지로 교차 페이드
    const U = thumbMat.uniforms;
    if (on && preview !== P.shown) {
      if (U.uFade.value < 0.05) {
        // 거의 안 보이는 상태면 교차 페이드 없이 바로 교체
        U.mapA.value = U.mapB.value = thumbTex[preview];
        U.uMix.value = 0;
      } else {
        if (U.uMix.value > 0) U.mapA.value = U.mapB.value;
        U.mapB.value = thumbTex[preview];
        U.uMix.value = 0;
      }
      P.shown = preview;
    }
    if (U.mapB.value !== U.mapA.value) {
      U.uMix.value = Math.min(1, U.uMix.value + 0.06);
      if (U.uMix.value >= 1) {
        U.mapA.value = U.mapB.value;
        U.uMix.value = 0;
      }
    }
    if (!on && P.k < 0.01) P.shown = -1;
    if (U.mapA.value) {
      U.cropA.value.copy(U.mapA.value.userData.crop);
      U.cropB.value.copy(U.mapB.value.userData.crop);
    }
    U.uFade.value = k;
    thumb.visible = k > 0.002;

    orbs.forEach((o, n) => {
      const ang = time * (0.5 + n * 0.22) + n * 2.1;
      const rad = 1.55 + n * 0.28;
      o.position.set(
        Math.cos(ang) * rad,
        Math.sin(ang * 1.3) * 0.5 + (n - 1) * 0.3,
        Math.sin(ang) * rad * 0.6
      );
      // 미리보기 중에는 주변 구슬을 숨겨 덜 산만하게
      o.scale.setScalar(Math.max(0.001, 1 - k));
    });

    renderer.render(scene, cam);
  }

  function dispose() {
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
    glassMat.dispose();
    chrome.dispose();
    thumbMat.dispose();
    thumbTex.forEach((t) => t.dispose());
    [heroText, contactText].forEach((t) => {
      t.plane.material.dispose();
      t.tex.dispose();
    });
    scene.environment?.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { resize, render, dispose };
}
