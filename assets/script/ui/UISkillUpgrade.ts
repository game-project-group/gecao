import { _decorator, Component, director } from 'cc';
import { Actor } from '../actor/Actor';
import { PlayerController } from '../actor/PlayerController';
import { ActorManager } from '../level/ActorManager';
const { ccclass, property } = _decorator;

/**
 * 角色升级面板
 */
@ccclass('UISkillUpgrade')
export class UISkillUpgrade extends Component {

    playerController : PlayerController| null = null;

    onEnable(){
        this.playerController = ActorManager.instance.playerActor.getComponent(PlayerController);
        director.pause()
    }

    onDisable(){
        director.resume()
    }

    onUpgradePenetration(){
        this.playerController!.penetraion += 10;        
        this.node.active = false;
    }

    onUpgradeProjectileCount(){
        this.playerController!.projectileCount++;
        this.node.active = false;
    }

    onUpgradeChaseRate(){
        this.playerController!.chaseRate += 10;        
        this.node.active = false;
    }
}

