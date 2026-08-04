// 값을 [min, max] 범위로 가두기 (스크롤 진행도·모션 계산에서 공용 사용)
export const clamp = (v, min = 0, max = 1) => Math.min(Math.max(v, min), max);
