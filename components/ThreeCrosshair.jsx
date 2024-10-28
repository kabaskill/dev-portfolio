export default function ThreeCrosshair({ isHoveringFrame }) {
  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ transition: "all 0.3s ease", zIndex: 9999 }}
    >
      <svg
        width={isHoveringFrame ? "40" : "20"}
        height={isHoveringFrame ? "40" : "20"}
        viewBox="0 0 40 40"
        style={{ transition: "all 0.2s ease" }}
      >
        <circle
          cx="20"
          cy="20"
          r={isHoveringFrame ? "12" : "8"}
          fill="#e5e5e5"
          opacity={isHoveringFrame ? "0.8" : "0.5"}
        />
      </svg>
    </div>
  );
}
