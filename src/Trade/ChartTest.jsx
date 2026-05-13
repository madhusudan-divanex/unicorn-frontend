import React from "react";

export default function ChartSkeleton() {
  return (
    <div style={styles.container}>
      <div style={styles.skeletonHeader} />
      <div style={styles.skeletonGrid}>
        {/* Simulate horizontal grid lines */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ ...styles.gridLine, top: `${(i + 1) * 16.6}%` }} />
        ))}

        {/* Simulate vertical grid lines */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ ...styles.gridLineVertical, left: `${(i + 1) * 8.33}%` }} />
        ))}

        {/* Loading bar animation */}
        <div style={styles.loadingBar} />
      </div>
      <p style={styles.text}>Loading Chart...</p>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: 400, // match your chart height
    backgroundColor: "#111827", // dark navy background (like your chart)
    borderRadius: 6,
    boxShadow: "0 0 12px rgba(0,0,0,0.7)",
    overflow: "hidden",
    marginTop: 20,
  },
  skeletonHeader: {
    height: 40,
    backgroundColor: "#1f2937", // darker bar on top to simulate chart header
    borderBottom: "1px solid #374151",
  },
  skeletonGrid: {
    position: "relative",
    flex: 1,
    height: "calc(100% - 40px)",
    backgroundColor: "#111827",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#374151", // grid lines color
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#374151",
  },
  loadingBar: {
    position: "absolute",
    bottom: 20,
    left: 0,
    width: "30%",
    height: 4,
    background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #2563eb 100%)",
    borderRadius: 2,
    animation: "loadingBarMove 1.5s infinite",
  },
  text: {
    position: "absolute",
    bottom: 5,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Arial, sans-serif",
  },
};

// Add keyframes for loadingBarMove animation to your CSS or style tag:

/*
@keyframes loadingBarMove {
  0% {
    left: 0;
    width: 30%;
  }
  50% {
    left: 50%;
    width: 40%;
  }
  100% {
    left: 100%;
    width: 30%;
  }
}
*/