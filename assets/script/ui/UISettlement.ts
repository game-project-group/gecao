import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 结算面板
 */
@ccclass('UISettlement')
export class UISettlement extends Component {

    resStartGame() {
        director.loadScene("game", null);
    }

}

