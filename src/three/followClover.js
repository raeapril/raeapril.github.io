import * as THREE from "three";
import { clamp, lerp } from "../lib/math";
import { cloverGeometry, studioEnvironment } from "./cloverScene";

const EXTENT = 2.44; // 베벨 포함 클로버 바깥 폭
const TINTS = { pink: 0xffd9df, clear: 0xffffff, lilac: 0xdcd8ff };

/**
 * 화면 전체에 고정된 캔버스 위의 유리 클로버 하나.
 * 페이지가 매 프레임 setTarget(화면 px 기준 중심·폭)으로 목표를 주면 그 자리로 미끄러지듯 따라간다
 * — 섹션마다 비워 둔 자리(slot)를 옮겨 다니게 하려는 용도.
 */
export function createFollowClover(host, { tint = "pink", autoSpin = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  // 유리 굴절(transmission)은 웹페이지를 비출 수 없고, 투명 배경이면 three 가 굴절 배경을 반투명 흰색으로 채워
  // 클로버가 회색 덩어리로 보인다. 그래서 검정 배경에 그린 뒤 screen 으로 합성한다
  // — 검정(유리 몸통)은 사라지고 반사광·무지개빛 테두리만 페이지 위에 빛으로 얹힌다.
  renderer.setClearColor(0x000000, 1);
  // host 는 fixed + z-index 라 자체 합성 영역이 된다. 그래서 캔버스가 아니라 host 에 합성 모드를 건다
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.style.mixBlendMode = "screen";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer);
  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  cam.position.set(0, 0, 6);

  const glass = new THREE.MeshPhysicalMaterial({
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
    attenuationColor: new THREE.Color(TINTS[tint] ?? TINTS.pink),
    attenuationDistance: 2.4,
    specularIntensity: 1,
    envMapIntensity: 1.3,
  });
  const clover = new THREE.Mesh(cloverGeometry(), glass);
  const pivot = new THREE.Group();
  pivot.add(clover);
  scene.add(pivot);

  // 굴절 전용 배경판: 유리 뒤가 완전히 검으면 몸통이 페이지 배경에 묻혀 안 보인다.
  // 글자·무늬 없이 페이지보다 살짝 밝은 단색만 깔아, 스모크 유리처럼 형태만 드러나게 한다.
  // 화면에는 그리지 않고(colorWrite 끔) 굴절 패스에서만 그린다.
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshBasicMaterial({ color: 0x2a2a30, toneMapped: false, depthWrite: false })
  );
  backdrop.position.z = -1.6;
  backdrop.onBeforeRender = (r, _s, _c, _g, mat) => {
    mat.colorWrite = r.getRenderTarget() !== null;
  };
  pivot.add(backdrop);

  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe8b4bc, metalness: 1, roughness: 0.18, clearcoat: 1 });
  const orbs = [0.17, 0.11, 0.07].map((r, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 32), i === 1 ? glass : chrome);
    pivot.add(m);
    return m;
  });

  const S = {
    vw: 1, vh: 1, visH: 1,
    tx: 0, ty: 0, ts: 0.001,
    mx: 0, my: 0, smx: 0, smy: 0,
    hover: 0, h: 0, spin: 0, flip: 0,
    auto: autoSpin, init: false, px: 0, py: 0,
  };

  const resize = () => {
    S.vw = window.innerWidth;
    S.vh = window.innerHeight;
    renderer.setSize(S.vw, S.vh, false);
    cam.aspect = S.vw / S.vh;
    cam.updateProjectionMatrix();
    S.visH = 2 * cam.position.z * Math.tan((cam.fov * Math.PI) / 360);
  };
  resize();
  window.addEventListener("resize", resize);
  const onMove = (e) => {
    S.mx = (e.clientX / S.vw) * 2 - 1;
    S.my = (e.clientY / S.vh) * 2 - 1;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  /** 화면 좌표(px)의 중심 (cx, cy) 와 폭 w 에 클로버가 꽉 차도록 목표를 잡는다 */
  function setTarget(cx, cy, w) {
    const visW = S.visH * cam.aspect;
    S.tx = (cx / S.vw - 0.5) * visW;
    S.ty = -(cy / S.vh - 0.5) * S.visH;
    S.ts = Math.max(0.001, ((w / S.vw) * visW) / EXTENT);
    if (!S.init) {
      S.init = true;
      pivot.position.set(S.tx, S.ty, 0);
    }
  }
  const setHover = (on) => (S.hover = on ? 1 : 0);
  // 프로젝트가 바뀌면 한 바퀴
  const spin = () => (S.flip = 1);
  // 프로젝트 대표 색: 유리 속 배경판과 유리 두께 색에 은은하게 섞는다. 바뀔 때는 매 프레임 조금씩 따라간다
  const BACKDROP_BASE = new THREE.Color(0x2a2a30);
  const ATTEN_BASE = new THREE.Color(TINTS[tint] ?? TINTS.pink);
  const tintTarget = { backdrop: BACKDROP_BASE.clone(), atten: ATTEN_BASE.clone() };
  /** 대표 색(css hex). 비우면 기본 색으로 */
  function setTint(hex) {
    if (!hex) {
      tintTarget.backdrop.copy(BACKDROP_BASE);
      tintTarget.atten.copy(ATTEN_BASE);
      return;
    }
    const c = new THREE.Color(hex);
    tintTarget.backdrop.copy(BACKDROP_BASE).lerp(c, 0.25);
    tintTarget.atten.set(0xffffff).lerp(c, 0.25);
  }

  function setOpts({ tint: tn, autoSpin: as } = {}) {
    if (tn) glass.attenuationColor.set(TINTS[tn] ?? TINTS.pink);
    if (as !== undefined) S.auto = as;
  }

  let raf = 0;
  let intro = 0;
  const t0 = performance.now();
  const loop = () => {
    raf = requestAnimationFrame(loop);
    backdrop.material.color.lerp(tintTarget.backdrop, 0.05);
    glass.attenuationColor.lerp(tintTarget.atten, 0.05);
    const t = (performance.now() - t0) / 1000;
    const y = window.scrollY;
    // 처음 뜰 때 0 → 1 로 커지며 빠르게 돌다 멈춘다
    intro = Math.min(1, intro + 0.02);
    const ie = 1 - Math.pow(1 - intro, 3);
    S.smx += (S.mx - S.smx) * 0.06;
    S.smy += (S.my - S.smy) * 0.06;
    S.h += (S.hover - S.h) * 0.08;
    if (S.hover) S.spin += 0.07;
    if (S.flip > 0) {
      S.spin += 0.14 * S.flip;
      S.flip = Math.max(0, S.flip - 0.016);
    }

    S.px = pivot.position.x;
    S.py = pivot.position.y;
    pivot.position.x += (S.tx - pivot.position.x) * 0.09;
    pivot.position.y += (S.ty - pivot.position.y) * 0.09;
    const cur = pivot.scale.x;
    pivot.scale.setScalar(Math.max(0.001, cur + (S.ts * ie * lerp(1, 1.08, S.h) - cur) * 0.09));
    // 이동 속도만큼 진행 방향으로 기울인다
    const visW = S.visH * cam.aspect;
    const vx = (pivot.position.x - S.px) / visW;
    const vy = (pivot.position.y - S.py) / S.visH;

    const idle = S.auto ? Math.sin(t * 0.45) * 0.55 : 0;
    clover.rotation.set(
      0.18 + S.smy * 0.3 + Math.sin(t * 0.6) * 0.08 + clamp(-vy * 12, -0.4, 0.4),
      idle + S.smx * 0.5 + Math.sin(y * 0.002) * 0.9 + S.spin + clamp(vx * 12, -0.5, 0.5) + (1 - ie) * t * 2.4,
      t * 0.12 + y * 0.0012
    );
    orbs.forEach((o, n) => {
      const ang = t * (0.5 + n * 0.22) + n * 2.1;
      const rad = 1.55 + n * 0.28;
      o.position.set(Math.cos(ang) * rad, Math.sin(ang * 1.3) * 0.5 + (n - 1) * 0.3, Math.sin(ang) * rad * 0.6);
    });
    renderer.render(scene, cam);
  };
  loop();

  function dispose() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
    scene.environment?.dispose();
    scene.traverse((o) => o.geometry?.dispose());
    backdrop.material.dispose();
    glass.dispose();
    chrome.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    host.style.mixBlendMode = "";
  }

  return { setTarget, setHover, spin, setOpts, setTint, dispose };
}
