import { _decorator, resources, Prefab, instantiate, find, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum DialogDef {
    UISetting = "UISetting",
    UISkillUpgrade = "UISkillUpgrade",
    UISettlement = "UISettlement",
}

/***
 *  UI 管理器
 */
@ccclass("UIManager")
export class UIManager {

    private static _instance: UIManager;
    static get instance(): UIManager {
        if (!this._instance) {
            this._instance = new UIManager();
        }
        return this._instance;
    }

    /**
     * UI 的根节点
     */
    private uiRoot: Node | null = null;

    /**
     * 面板
     */
    private panels: Map<string, Node> = new Map();

    /**
     * 打开面板
     * @param prefabName 预制体的名字
     * @param bringToTop 是否将面板展示在最上
     * @returns 
     */
    openPanel(prefabName: string, bringToTop: boolean = true) {

        if (!this.uiRoot) {
            this.uiRoot = find("UIRoot");
        }

        if (this.panels.has(prefabName)) {
            let panel = this.panels.get(prefabName);
            panel.active = true;
            if (bringToTop) {
                panel.setSiblingIndex(this.uiRoot.children.length - 1);
            }
            return;
        }

        resources.load("ui/prefab/" + prefabName, Prefab, (err, data: Prefab) => {
            let node = instantiate(data);
            this.uiRoot.addChild(node)
            this.panels.set(prefabName, node);
            if (bringToTop) {
                node.setSiblingIndex(this.uiRoot.children.length - 1)
            }
        })
    }

    /**
     * 关闭面板
     * @param nodeName 节点的名字
     * @param destory 销毁
     */
    closePanel(nodeName: string, destory: boolean = false) {
        if (this.panels.has(nodeName)) {
            let panel = this.panels.get(nodeName);
            if (panel) {
                if (destory) {
                    panel.removeFromParent();
                } else {
                    panel.active = false;
                }
            }
        }
    }

    /**
     * 弹出对话框
     * 对话框只能有1个
     * @param name 
     */
    showDialog(name: string) {
        for (let dialogName in DialogDef) {
            if (dialogName == name) {
                this.openPanel(dialogName);
            } else {
                this.closePanel(dialogName);
            }
        }
    }

    /**
     * 关闭对话框
     */
    closeDialog() {
        for (let dialogName in DialogDef) {
            this.closePanel(dialogName);
        }
    }

    /**
     * 关闭并销毁所有面板
     */
    clearAllPanels() {
        for (let panel of this.panels.values()) {
            panel.removeFromParent();
        }
        this.panels = new Map();
        this.uiRoot = null;
    }
}