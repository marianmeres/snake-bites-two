export declare const createPubSub: () => {
    publish: (event: any, data?: {}) => void;
    subscribe: (event: any, cb: any) => () => any;
    subscribeOnce: (event: any, cb: any) => () => any;
    unsubscribeAll: (event: any) => boolean;
};
