import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 动画监听器
 */
@ccclass('AnimationEventListener')
export class AnimationEventListener extends Component {

    onFrameAttackLoose() {
        this.node.parent?.emit("onFrameAttackLoose");
    }

    onFrameAttack(){
        this.node.parent?.emit("onFrameAttack");
    }
}

