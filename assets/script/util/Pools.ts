import { _decorator, Pool } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 内存池
 */
@ccclass('Pools')
export class Pools<TKey, TValue> {

    pools: Map<TKey, Pool<TValue>> = new Map();

    pool(key: TKey): Pool<TValue> {
        return this.pools.get(key)!;
    }

    newPool(key: TKey, ctor: () => TValue, elementsPerBatch: number, dtor?: (obj: TValue) => void) {
        let pool = new Pool<TValue>(ctor, elementsPerBatch, dtor);
        this.pools.set(key, pool);
    }

    allocc(key: TKey): TValue {
        return this.pool(key).alloc();
    }

    free(key: TKey, node: TValue) {
        this.pool(key).free(node);
    }

    destory(key: TKey) {
        this.pool(key).destroy()
    }

    destroyAll() {
        for (let pool of this.pools.values()) {
            pool.destroy();
        }
        this.pools.clear()
    }
}