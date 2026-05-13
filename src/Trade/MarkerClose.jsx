export const MarketClosedOverlay = ({ pair }) => {
  return (
    <div className="chart-container market-chart-container">
      <div>
        <div style={styles.iconBox}>
        {/* <img src="/assets/images/market-close.png" alt=""/> */}
        📉
      </div>

      <h3 style={styles.title}>
        {pair} chart is not available
      </h3>

      <p style={styles.subtitle}>
        Market is closed or data unavailable
      </p>
      </div>
    </div>
  );
};
const styles = {
 
  iconBox: {
    fontSize: "40px",
    marginBottom: "12px",
    opacity: 0.8,
  },
  title: {
    color: "#e2e8f0",
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "6px",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: "1.4",
  },
};