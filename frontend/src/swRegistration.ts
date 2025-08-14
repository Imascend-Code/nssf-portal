// src/swRegistration.ts
import { registerSW } from 'virtual:pwa-register';

const intervalMS = 60 * 60 * 1000; // check hourly

export const updateSW = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('pwa-update-ready'));
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('pwa-offline-ready'));
  },
  onRegisteredSW(_url, reg) {
    setInterval(() => reg?.update(), intervalMS);
  }
});
