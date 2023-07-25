import { Component, math, Node, randomRange, v3, Vec3, _decorator } from 'cc';
import { Events } from '../events/Events';
import { VirtualInput } from '../input/VirtualInput';
import { MathUtil } from '../util/MathUtil';
import { Actor } from './Actor';
import { StateDefine } from './StateDefine';
import { ProjectileEmitter } from './ProjectileEmiter';
import { ActorManager } from '../level/ActorManager';
import { DynamicResourceDefine } from '../resource/ResourceDefine';
import { AudioManager } from '../audio/AudioManager';
const { ccclass, property, requireComponent } = _decorator;

let tempForward = v3();

/**
 * 玩家控制器
 */
@ccclass('PlayerController')
@requireComponent(Actor)
@requireComponent(ProjectileEmitter)
export class PlayerController extends Component {

    @property(Node)
    bow: Node | null = null;
 
    @property(Node)
    bowstring: Node | null = null;

    projectileEmitter: ProjectileEmitter;

    shootDirection: Vec3 = v3();

    private _splitAngle: number[] = [0];

    actor: Actor | null = null;

    start() {
        this.actor = this.node.getComponent(Actor);
        ActorManager.instance.playerActor = this.actor;
        this.projectileEmitter = this.node.getComponent(ProjectileEmitter);
        this.node.on("onFrameAttackLoose", this.onFrameAttackLoose, this);
        this.node.on(Events.onEnemyKilled, this.onKilled, this);
        this.projectileCount = 2;
    }

    onDestroy() {
        ActorManager.instance.playerActor = null;

        this.node.off("onFrameAttackLoose", this.onFrameAttackLoose, this);
        this.node.off(Events.onEnemyKilled, this.onKilled, this);
    }

    update(dt: number) {
        if (this.actor.currState == StateDefine.Die || this.actor.currState == StateDefine.Hit) {
            return;
        }

        const len = this.handleInput();
        if (len > 0.1) {
            this.actor.changeState(StateDefine.Run);
        } else {
            // 查找面前是否有怪物
            let enemy = this.getNeareastEnemy()
            if (enemy) {
                Vec3.subtract(this.actor.destForward, enemy.worldPosition, this.node.worldPosition);
                this.actor.destForward.normalize()

                // 如果有射击
                this.actor.changeState(StateDefine.Attack);
            } else {
                this.actor.changeState(StateDefine.Idle);
            }
        }
    }

    handleInput(): number {
        let x = VirtualInput.horizontal;
        let y = VirtualInput.vertical;

        this.actor.destForward.x = x;
        this.actor.destForward.z = -y;
        this.actor.destForward.y = 0;
        this.actor.destForward.normalize();
        return this.actor.destForward.length();
    }

    onFrameAttackLoose() {
        AudioManager.instance.playSfx(DynamicResourceDefine.audio.SfxShoot);
        const arrowStartPos = this.bowstring!.worldPosition;
        Vec3.subtract(this.shootDirection, this.bow!.worldPosition, arrowStartPos);
        this.shootDirection.normalize();

        for (let i = 0; i < this.projectileCount; i++) {
            let projectile = this.projectileEmitter.create();

            MathUtil.rotateAround(tempForward, this.node.forward, Vec3.UP, this._splitAngle[i]);
            projectile.node.forward = tempForward.clone();

            projectile.node.worldPosition = arrowStartPos;
            projectile.host = this.node;

            let property = projectile.projectProperty;
            property.penetration = this.actor.actorProperty.penetration;
            const willChase = randomRange(0, 100) < this.actor.actorProperty.chaseRate;
            if (willChase) {
                projectile.target = ActorManager.instance.randomEnemy;
                property.chase = willChase && projectile.target != null;
            }
            projectile?.fire();
        }
    }

    set projectileCount(count: number) {
        let actorProperty = this.actor.actorProperty;
        if (count <= 0) {
            actorProperty.projectileCount = 1;
        }
        actorProperty.projectileCount = count;
        this._splitAngle = [];

        const a = math.toRadian(10);
        const even = count % 2 != 0;

        const len = Math.floor(actorProperty.projectileCount / 2);
        for (let i = 0; i < len; i++) {
            this._splitAngle.push(-a * (i + 1));
            this._splitAngle.push(a * (i + 1));
        }

        if (even) {
            this._splitAngle.push(0);
        }
    }

    get projectileCount(): number { return this.actor.actorProperty.projectileCount; }

    set chaseRate(val: number) {
        this.actor.actorProperty.chaseRate = math.clamp(this.actor.actorProperty.chaseRate + val, 0, 100);
    }

    get chaseRate(): number {
        return this.actor.actorProperty.chaseRate;
    }

    onKilled(actor: Actor) {
        let acotrProperty = this.actor.actorProperty;
        acotrProperty.exp++;
        this.node.emit(Events.onExpGain);

        if (acotrProperty.exp >= acotrProperty.maxExp) {
            acotrProperty.exp -= acotrProperty.maxExp;
            acotrProperty.maxExp *= 1.1;
            acotrProperty.level++;
            this.onUpgradeLevel();
        }
    }

    onUpgradeLevel() {
        this.node.emit(Events.onPlayerUpgrade);
    }

    set penetraion(val: number) {
        this.actor.actorProperty.penetration = math.clamp(this.actor.actorProperty.penetration + val, 0, 100);
    }

    getNeareastEnemy(): Node | null {
        let enemies = ActorManager.instance.enemies;
        if (!enemies || enemies?.length == 0) {
            return null;
        }

        let nearDistance = 99999;
        let nearastEnemy: Node | null = null;
        for (let enemy of enemies) {

            const actor = enemy.getComponent(Actor);
            if (actor.dead) {
                continue;
            }

            const distance = Vec3.distance(this.node.worldPosition, enemy.worldPosition);
            if (distance < nearDistance) {
                nearDistance = distance;
                nearastEnemy = enemy;
            }
        }

        return nearastEnemy;
    }
}

