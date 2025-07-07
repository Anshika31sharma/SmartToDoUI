import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function useCountdown(deadline) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const update = () => {
      if (!deadline) {
        setLabel("No deadline");
        return;
      }

      const time = new Date(deadline);
      if (isNaN(time)) {
        setLabel("Invalid date");
        return;
      }

      const now = new Date();
      const diff = time - now;

      const formatted = formatDistanceToNow(time, { addSuffix: true });

      if (diff < 0) {
        setLabel(`Overdue ${formatted}`);
      } else {
        setLabel(`Due ${formatted}`);
      }
    };

    update();
    const timer = setInterval(update, 1000 * 60);

    return () => clearInterval(timer);
  }, [deadline]);

  return label;
}
