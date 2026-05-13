export function ChartLoader() {
    return (
        <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(18, 26, 46, 0.7)",
            zIndex: 10,
            borderRadius: "inherit",
        }}>
            {/* Inner Content Wrapper */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px"
            }}>
                {/* Logo + Text */}
                <div className="loader-logo" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: "16px"
                }}>
                    <img
                        src="/assets/images/chart-nw-logo.png"
                        alt="logo"
                        style={{ height: 28 }}
                        onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <span className="loader-logo-text">Trading</span>
                </div>

                {/* Progress Bar */}
                <div className="loader-bar-wrap" style={{
                    width: "140px",
                    height: "4px",
                    background: "#1f2937",
                    borderRadius: "4px",
                    overflow: "hidden"
                }}>
                    <div className="loader-bar" style={{
                        width: "40%",
                        height: "100%",
                        background: "#3b82f6",
                        animation: "slide 1.2s ease-in-out infinite"
                    }} />
                </div>
            </div>

            {/* Animation */}
            <style>{`
                @keyframes slide {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}