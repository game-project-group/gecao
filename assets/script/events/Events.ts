import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 全局事件定义
 */
@ccclass('Events')
export class Events {

    /**
     * Actor 死亡事件
     */
    static onDead: string = "onDead";

    /**
     * 杀死怪物
     */
    static onEnemyKilled: string = "onKilled";

    /**
     * 受伤
     */
    static onHurt: string = "onHurt";

    /**
     * 投射物销毁
     */
    static onProjectileDead: string = "onProjectileDead";

    /**
     * 玩家获取经验值
     */
    static onExpGain: string = "onExpGain";

    /**
     * 玩家升级
     */
    static onPlayerUpgrade: string = "onPlayerUpgrade";

    /**
     * 设置面板的背景音乐音量变化
     */
    static onBgmVolumeChanged: string = "onBgmVolumeChanged";

}

