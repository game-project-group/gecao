import { _decorator, Component, Node, Prefab, Pool, director, instantiate } from 'cc';
import { Events } from '../events/Events';
import { Projectile } from './Projectile';
const { ccclass, property } = _decorator;

/**
 * 投射物发射器
 */
@ccclass('ProjectileEmitter')
export class ProjectileEmitter extends Component {

    /**
     * 投射物预制体
     */
    @property(Prefab)
    projectile: Prefab | null = null;

    /**
     * 投射物内存池
     */
    prefabPool: Pool<Node> | null = null;

    start() {
        const poolCount = 5;

        this.prefabPool = new Pool(() => {
            return instantiate(this.projectile!);
        }, poolCount, (node: Node) => {
            node.removeFromParent();
        });
    }

    onDestroy() {
        this.prefabPool.destroy();
    }

    create(): Projectile {
        console.log('>>>>>>>>',this.node.name);
        let node = this.prefabPool.alloc();
        if (node.parent == null)
            director.getScene().addChild(node);
        node.active = true;
        node.once(Events.onProjectileDead, this.onProjectileDead, this);
        let projectile = node.getComponent(Projectile);
        return projectile;
    }

    onProjectileDead(projectile: Projectile) {
        projectile.node.active = false;
        this.prefabPool.free(projectile.node);
    }
}

