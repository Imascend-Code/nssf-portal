import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';
export function usePwaUpdater() {
    const [waiting, setWaiting] = useState(null);
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const wb = new Workbox('/sw.js', { type: 'module' });
            wb.addEventListener('waiting', () => {
                // an updated SW is waiting to activate
                wb.messageSkipWaiting();
            });
            wb.addEventListener('controlling', () => {
                // reload to use the new SW
                window.location.reload();
            });
            wb.register();
        }
    }, []);
    return { waiting, update: () => waiting?.postMessage({ type: 'SKIP_WAITING' }) };
}
