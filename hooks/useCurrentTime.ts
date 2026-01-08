import { useEffect, useState } from "react";

export default function useCurrentTime(intervalMs = 60_000) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const id = setInterval(() => {
            setNow(Date.now());
        }, intervalMs);

        return () => clearInterval(id);
    }, [intervalMs]);

    return now;
}
