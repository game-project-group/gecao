import { _decorator, Node, resources, Prefab, instantiate, director, math, Animation, SkeletalAnimationState, System } from 'cc';
import { Actor } from '../actor/Actor';
import { StateDefine } from '../actor/StateDefine';
import { EffectManager } from '../effect/EffectManager';
import { Events } from '../events/Events';
import { DynamicResourceDefine } from '../resource/ResourceDefine';
import { Pools } from '../util/Pools';
const { ccclass, property } = _decorator;

/**
 * 角色管理器
 */
@ccclass('ActorManager')
export class ActorManager {

    private static _instance: ActorManager;
    static get instance() {
        if (this._instance == null) {
            this._instance = new ActorManager();
        }
        return this._instance;
    }

    private enemyPools: Pools<string, Node> = new Pools();
    private enemyNames: Array<string> = [];
    enemies: Array<Node> = [];

    private _playerActor: Actor | null = null;

    get playerActor(): Actor | null {
        return this._playerActor;
    }

    set playerActor(actor: Actor | null) {
        this._playerActor = actor;
    }

    init(onComplete: () => void) {
        const enemyPath = DynamicResourceDefine.Actor.Enemy.Path;
        resources.loadDir(enemyPath, () => {
            var result = [];
            resources.getDirWithPath(enemyPath, Prefab, result);

            for (let addressable of result) {
                let prefab = resources.get(addressable.path, Prefab)
                this.createEnemyPool(prefab);
            }
            onComplete();
        })
    }

    private createEnemyPool(prefab: Prefab) {
        const enemyCount = 10;
        this.enemyNames.push(prefab.name);
        this.enemyPools.newPool(prefab.name, (): Node => {
            let node = instantiate(prefab!);
            node.active = false;
            director.getScene().addChild(node);
            return node;
        }, enemyCount, (node: Node) => {
            node.removeFromParent();
        });
    }

    clear() {
        this.enemyPools.destroyAll();
        this.enemyNames = [];
        this.enemies = [];
    }

    createRandomEnemy(): Node {
        let name = this.enemyNames[math.randomRangeInt(0, this.enemyNames.length)];
        let node = this.enemyPools.allocc(name);
        node.active = true;
        this.enemies.push(node);
        node.once(Events.onDead, this.onEnemyDead, this);
        return node;
    }

    private onEnemyDead(node: Node) {
        let skeletonAnimation = node.getComponent(Actor).skeletalAnimation;
        skeletonAnimation.once(Animation.EventType.FINISHED, (type: Animation.EventType, state: SkeletalAnimationState) => {
            if (state.name == StateDefine.Die) {
                this.enemyPools.free(node.name, node);
                let index = this.enemies.indexOf(node);
                this.enemies.splice(index, 1);
                EffectManager.instance?.play(
                    DynamicResourceDefine.Effect.EffDie,
                    node.worldPosition);
                node.active = false;
            }
        }, this);
    }

    get randomEnemy(): Node {
        return this.enemies[math.randomRangeInt(0, this.enemies.length)];
    }
}

