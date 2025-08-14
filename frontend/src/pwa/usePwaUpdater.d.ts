export declare function usePwaUpdater(): {
    waiting: ServiceWorker | null;
    update: () => void | undefined;
};
