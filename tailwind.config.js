export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 화이트 + 블랙 + 블루 포인트 (미니멀)
        ink: "#111111", // 블랙 (본문·어두운 섹션·버튼)
        paper: "#ffffff", // 화이트 (밝은 배경)
        muted: "#6b7280", // 그레이 (보조 텍스트)
        line: "#e5e7eb", // 연한 그레이 (구분선)
        accent: "#2563eb", // 블루 (포인트)
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
