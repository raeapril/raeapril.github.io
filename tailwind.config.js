export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  // 터치 기기에서 탭 후 hover 색이 남는 문제 방지 — hover는 실제 hover 지원 기기에서만
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // 다크 + 따뜻한 핑크 포인트
        night: "#0c0c0e", // 배경
        cream: "#f2efe9", // 본문
        point: "#E8B4BC", // 포인트
        sub: "#b9b6b0", // 보조 텍스트
        dim: "#8d8a85", // 캡션
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        display: ['"Bricolage Grotesque"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
