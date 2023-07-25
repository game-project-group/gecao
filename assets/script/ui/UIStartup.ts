import { _decorator, Component, director, Button } from 'cc';
import { Setting } from '../config/Setting';
import { UISetting } from './UISetting';
const { ccclass, property } = _decorator;

/**
 * 开始界面
 */
@ccclass('UIStartup')
export class UIStartup extends Component {

    start() {
        let btnStart = this.node.getChildByName("BtnStart");
        btnStart.on(Button.EventType.CLICK, this.onClickEnterGame, this);

        Setting.instance.load();
    }

    onClickEnterGame() {
        director.loadScene("game");
    }

}

