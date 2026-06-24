export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 따뜻한 뉴트럴 팔레트 (Playfight 무드)
        ink: "#16140f", // 거의 검정 (따뜻한 톤)
        paper: "#f4f1ea", // 따뜻한 오프화이트
        muted: "#827c70", // 보조 텍스트
        line: "#dcd6c9", // 구분선
        accent: "#e0533d", // 포인트 (버닝 오렌지레드)
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
