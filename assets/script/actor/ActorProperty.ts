import { math, _decorator } from 'cc';

/**
 * Actor 属性
 */
export class ActorProperty {

    /**
     * 最大生命值
     */
    maxHp : number = 100;

    /**
     * 生命
     */
    hp: number = this.maxHp;    

    /**
     * 攻击力
    */
    attack: number = 10;

    /**
     * 等级
     */
    level: number = 1;

    //#region 投射物属性
    /**
     * 跟踪几率
     */
    chaseRate: number = 0;

    /**
     * 穿透次数
     */
    penetration: number = 0;

    /**
     * 投射物数量
     */
    projectileCount: number = 1;

    //#region 经验

    /**
     * 当前经验
     */
    exp: number = 0;

    /**
     * 本级最大经验
     */
    maxExp: number = 20;

    /**
     * 获取血量百分比
     */
    get hpPercent():number{
        return math.clamp01(this.hp/this.maxHp);
    }
}

