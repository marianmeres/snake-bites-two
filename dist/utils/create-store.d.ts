export interface StoreReadable {
    get: Function;
    subscribe: Function;
    subscribeOnce: Function;
}
export interface StoreLike extends StoreReadable {
    set: Function;
    update: Function;
}
export declare const isStoreLike: (v: any) => boolean;
export declare const createStore: (initial: any, { persist }?: {
    persist: any;
}) => StoreLike;
