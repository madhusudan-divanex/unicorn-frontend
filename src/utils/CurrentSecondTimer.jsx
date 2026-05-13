import { useEffect, useState } from "react";

const ClockSyncedTimer = ({ timeFrame }) => {
  const getRemainingTime = () => {
    const nowSec = Math.floor(Date.now() / 1000);

    // Current candle start time
    const bucketStart = nowSec - (nowSec % timeFrame);

    // Remaining seconds in this timeframe
    const remaining = timeFrame - (nowSec - bucketStart);

    return remaining;
  };

  const [remaining, setRemaining] = useState(getRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [timeFrame]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <span className="px-3 py-2 rounded bg-dark border border-secondary text-white small fw-medium font-monospace shadow-sm">
      {mm}:{ss}
    </span>
  );
};

export default ClockSyncedTimer;
