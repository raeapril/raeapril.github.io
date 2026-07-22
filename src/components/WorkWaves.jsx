/**
 * 최근 작업 섹션 배경 — 흐르는 웨이브 오브젝트.
 * 주기적(periodic) 웨이브 라인을 좌로 흘려 무한 반복(translateX -50%)한다.
 * 여러 겹을 서로 다른 속도로 흘려 깊이감(parallax)을 준다.
 * prefers-reduced-motion 시 정지.
 */

// 주기 period(기본 360)로 반복되는 부드러운 웨이브 path 생성.
// width=2880 = 8주기 → 절반(1440=4주기) 지점이 시작과 동일해 translateX(-50%)가 매끄럽게 반복됨.
function buildWave(baseY, amp, period = 360, width = 2880) {
  const half = period / 2;
  let d = `M0 ${baseY} Q ${half / 2} ${baseY - amp} ${half} ${baseY}`;
  for (let x = half; x < width; x += half) {
    d += ` T ${x + half} ${baseY}`;
  }
  return d;
}

const LAYERS = [
  { cls: "wave-c", d: buildWave(305, 55), stroke: "#1e40af", w: 2.5, o: 0.5 },
  { cls: "wave-a", d: buildWave(210, 42), stroke: "#2563eb", w: 2, o: 0.4 },
  { cls: "wave-b", d: buildWave(120, 30), stroke: "#60a5fa", w: 1.5, o: 0.25 },
];

function WorkWaves() {
  return (
    <div className="work-waves" aria-hidden="true">
      {LAYERS.map((l, i) => (
        <div key={i} className={`wave-track ${l.cls}`}>
          <svg viewBox="0 0 2880 400" preserveAspectRatio="none">
            <path
              d={l.d}
              stroke={l.stroke}
              strokeWidth={l.w}
              opacity={l.o}
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default WorkWaves;
