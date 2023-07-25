import { _decorator, Component, Node, Layout, Prefab, Pool, instantiate, Sprite, resources, SpriteFrame } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

const replacement = new Map();
replacement.set("/", "Slash");

/**
 * 将图片显示为 Label 
 */
@ccclass('UIIMageLabel')
@requireComponent(Layout)
export class UIIMageLabel extends Component {

    private _string: string = '';

    set string(value: string) {
        if (this._string == value) {
            return;
        }
        this._string = value;
        this.resetString();
    }

    get string(): string {
        return this._string;
    }

    @property(Prefab)
    numPrefab: Prefab | null = null;

    numPool: Pool<Node> | null = null;

    layout: Layout;

    onLoad() {
        this.layout = this.node.getComponent(Layout);

        this.numPool = new Pool((): Node => {
            let node = instantiate(this.numPrefab!);
            node.active = false;
            return node;
        }, 1, (node: Node) => {
            node.removeFromParent();
        })
    }

    onDestroy() {
        this.numPool.destroy();
    }

    clearString() {
        for (let child of this.node.children) {
            child.active = false;
            this.numPool.free(child);
        }
    }

    resetString() {

        this.clearString();

        const dir = "ui/art/num/";

        resources.loadDir(dir, () => {
            for (let i = 0; i < this.string.length; i++) {
                const char = this.string[i];

                let str = char.toString();
                if (replacement.has(str)) {
                    str = replacement.get(str);
                }

                const path = dir + str + "/spriteFrame";
                const spriteFrame = resources.get(path, SpriteFrame);

                let node = this.numPool.alloc();
                if (node.parent == null) {
                    this.node.addChild(node);
                }
                node.active = true;
                node.setSiblingIndex(i);
                let sprite = node.getComponent(Sprite);
                sprite.spriteFrame = spriteFrame;
            }
            this.layout.updateLayout();
        })
    }
}

