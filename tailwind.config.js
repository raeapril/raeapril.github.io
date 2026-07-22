export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 하늘색 + 진한 브라운 팔레트
        ink: "#1a0f0a", // 진한 에스프레소 브라운 (어두운 섹션·본문·버튼)
        paper: "#f4f6f8", // 쿨 오프화이트 (밝은 배경, 미세한 푸른기)
        muted: "#7d6a5c", // 브라운 그레이 (보조 텍스트)
        line: "#cbdae6", // 연한 블루그레이 (구분선)
        accent: "#a8703f", // 카라멜 브라운 (포인트)
        // 기존 컬러 호환 유지
        "main-blue": "#3490dc",
        "point-pink": "#ff69b4",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        serif: ["Fraunces", "Georgia", "Times New Roman", "serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        layout: "1440px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
