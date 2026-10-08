// 원 4개로 그린 클로버 마크 (3D 클로버와 같은 실루엣)
function CloverIcon({ className = "", opacity = 1 }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {[
        [12, 7],
        [12, 17],
        [7, 12],
        [17, 12],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="currentColor" fillOpacity={opacity} />
      ))}
    </svg>
  );
}

export default CloverIcon;
