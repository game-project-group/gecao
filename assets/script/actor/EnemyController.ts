import { ccenum, CCFloat, CCInteger, Collider, Component, game, macro, math, Node, v3, Vec3, _decorator } from 'cc';
import { ActorManager } from '../level/ActorManager';
import { Actor } from './Actor';
import { ProjectileEmitter } from './ProjectileEmiter';
import { StateDefine } from './StateDefine';
const { ccclass, property, requireComponent } = _decorator;

let temp = v3();

class AIType {
    static readonly Chase: string = "chase";
    static readonly Attack: string = "attack";
    static readonly Idle: string = "idle";
}

export enum EnemyCareer {
    Melee = 0,
    Range = 1
}
ccenum(EnemyCareer)

/** 
 * 敌人控制器 
*/
@ccclass('EnemyController')
@requireComponent(Actor)
export class EnemyController extends Component {

    actor: Actor | null = null;

    @property(CCFloat)
    attackRange: number = 0.5;

    @property({ type: EnemyCareer })
    career: EnemyCareer = EnemyCareer.Melee;

    target: Actor | null = null;

    aiType: AIType = AIType.Chase;

    projectileEmitter: ProjectileEmitter;

    @property(Node)
    projectileStart: Node | null = null;

    @property(CCInteger)
    attackInterval: number = 5000;

    lastAttackTime: number = 0;

    start() {
        this.actor = this.node.getComponent(Actor);
        if (this.career == EnemyCareer.Range) {
            this.projectileEmitter = this.node.getComponent(ProjectileEmitter);
        }

        this.schedule(this.executeAI, 1.0, macro.REPEAT_FOREVER, 1.0)
        this.node.on("onFrameAttack", this.onFrameAttack, this);
        this.target = ActorManager.instance.playerActor;
    }

    onDestroy() {
        this.unschedule(this.executeAI);

        const collider = this.node.getComponent(Collider);
        this.node.off("onFrameAttack", this.onFrameAttack, this);
    }

    executeAI() {
        // 找不到目标
        if (this.target == null) {
            return;
        }

        // 我不处于 Run/Idle 状态
        if (this.actor.currState != StateDefine.Idle && this.actor.currState != StateDefine.Run) {
            return;
        }

        const canAttack = game.totalTime - this.lastAttackTime >= this.attackInterval;

        // 目标已死或我不能攻击
        if (this.target.currState == StateDefine.Die || !canAttack) {
            this.aiType = AIType.Idle;
            this.actor.changeState(AIType.Idle);
            return;
        }

        // 判断是否在攻击范围内
        const distance = Vec3.distance(this.node.worldPosition, this.target.node.worldPosition);

        if (distance > this.attackRange) {
            this.aiType = AIType.Chase;
            this.actor.changeState(StateDefine.Run);
            Vec3.subtract(temp, this.target!.node.worldPosition, this.node.worldPosition);
            temp.normalize();
            this.actor.destForward.set(temp.x, 0, temp.z);
            return;
        }

        this.aiType = AIType.Attack;
        Vec3.subtract(temp, this.target!.node.worldPosition, this.node.worldPosition);
        temp.normalize();
        this.actor.destForward.set(temp.x, 0, temp.z);
        this.actor.node.forward.set(temp.x, 0, temp.z);

        this.actor.changeState(StateDefine.Attack);
        this.lastAttackTime = game.totalTime;
    }

    isFaceTarget(): boolean {
        Vec3.subtract(temp, this.target.node.worldPosition, this.node.worldPosition);
        temp.y = 0;
        temp.normalize();
        return Vec3.angle(this.node.forward, temp) < math.toRadian(60);
    }


    onFrameAttack() {
        if (!this.target) {
            return;
        }

        if (this.career == EnemyCareer.Melee) {
            let dir = v3();
            Vec3.subtract(dir, this.target.node.worldPosition, this.node.worldPosition);
            let angle = Vec3.angle(this.node.forward, dir);
            if (angle < Math.PI * 0.5) {
                const distance = dir.length();

                if (distance < this.attackRange) {
                    this.target.hurt(this.actor.actorProperty.attack, this.actor, dir);
                }
            }
        } else {
            let projectile = this.projectileEmitter!.create();
            projectile.node.worldPosition = this.projectileStart.worldPosition;

            projectile.target = this.target.node;

            projectile.host = this.node;
            Vec3.subtract(temp, this.target.node.worldPosition, this.node.worldPosition);
            temp.normalize();
            projectile.node.forward = temp;
            projectile.fire();
        }
    }
}

