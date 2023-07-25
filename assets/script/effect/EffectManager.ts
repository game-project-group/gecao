import { _decorator, Node, Prefab, Vec3, Pool, instantiate, director, ParticleSystem, resources } from 'cc';
import { DynamicResourceDefine } from '../resource/ResourceDefine';
import { Pools } from '../util/Pools';
const { ccclass, property } = _decorator;

/**
 * 特效管理器
 */
@ccclass('EffectManager')
export class EffectManager {

    static _instance: EffectManager;
    static get instance() {
        if (this._instance == null) {
            this._instance = new EffectManager();
        }
        return this._instance;
    }

    pools: Pools<string, Node> = new Pools();

    init() {
        resources.loadDir(DynamicResourceDefine.Effect.Path, () => {
            const hitEffect = resources.get(DynamicResourceDefine.Effect.EffExplore, Prefab);
            this.pools.newPool(DynamicResourceDefine.Effect.EffExplore, (): Node => {
                return instantiate(hitEffect);
            }, 50, (node: Node) => {
                node.removeFromParent()
                node.destroy()
            })

            const exploreEffect = resources.get(DynamicResourceDefine.Effect.EffDie, Prefab);
            this.pools.newPool(DynamicResourceDefine.Effect.EffDie, (): Node => {
                return instantiate(exploreEffect);
            }, 50, (node: Node) => {
                node.removeFromParent()
                node.destroy()
            })
        })
    }

    destory() {
        EffectManager._instance = null;

        this.pools.destroyAll();
    }

    play(key: string, worldPosition: Vec3) {
        const pool = this.pools.pool(key);
        this.playEffect(pool, worldPosition);
    }

    private playEffect(pool: Pool<Node>, worldPosition: Vec3) {
        let node = pool.alloc()

        director.getScene()?.addChild(node);
        node.worldPosition = worldPosition;
        node.active = true;

        let ps = node.getComponent(ParticleSystem);
        ps.scheduleOnce(() => {
            node.active = false;
            pool.free(node);
        }, ps.duration);
        ps.play();
    }
}

