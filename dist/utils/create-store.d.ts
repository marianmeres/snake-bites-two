export interface StoreLike {
    set: Function;
    get: Function;
    update: Function;
    subscribe: Function;
    subscribeOnce: Function;
}
export declare const isStoreLike: (v: any) => boolean;
export declare const createStore: (initial: any, { persist }?: {
    persist: any;
}) => StoreLike;
