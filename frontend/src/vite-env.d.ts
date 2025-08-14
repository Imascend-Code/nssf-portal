/// <reference types="vite/client" />

// If you import 'virtual:pwa-register', this quiets TS:
declare module 'virtual:pwa-register' {
  export type RegisterSWOptions = {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (r: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
    // you use this:
    onRegisteredSW?: (url: string, reg: ServiceWorkerRegistration | undefined) => void
  }
  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}