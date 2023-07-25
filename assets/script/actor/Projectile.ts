import { CCFloat, Collider, Component, ICollisionEvent, math, Node, ParticleSystem, v3, Vec3, _decorator } from 'cc';
import { AudioManager } from '../audio/AudioManager';
import { EffectManager } from '../effect/EffectManager';
import { Events } from '../events/Events';
import { DynamicResourceDefine } from '../resource/ResourceDefine';
import { MathUtil } from '../util/MathUtil';
import { ProjectileProperty } from './ProjectileProperty';
const { ccclass, property } = _decorator;

let temp = v3();

/**
 * 投射物
 */
@ccclass('Projectile')
export class Projectile extends Component {

    @property(Collider)
    private collider: Collider | null = null;

    private startTime: number = 0;

    private position: Vec3 = v3()

    projectProperty: ProjectileProperty = new ProjectileProperty();

    host: Node | null = null;

    target: Node | null = null;

    private forward: Vec3 = v3()

    @property(CCFloat)
    private angularSpeed: number = 180;

    @property(CCFloat)
    private linearSpeed: number = 0.0;

    particleSystems: ParticleSystem[] = [];

    start() {
        this.collider?.on("onTriggerEnter", this.onTriggerEnter, this);
        this.particleSystems = this.node.getComponentsInChildren(ParticleSystem);
    }

    onDisable() {
        for (let particleSystem of this.particleSystems) {
            particleSystem.stop();
        }
    }

    onDestroy() {
        this.collider.off("onTriggerEnter", this.onTriggerEnter, this);
    }

    fire() {
        this.startTime = 0;
        for (let particleSystem of this.particleSystems) {
            particleSystem.play();
        }
    }

    update(deltaTime: number) {
        this.startTime += deltaTime;
        if (this.startTime >= this.projectProperty!.liftTime) {
            this.node.emit(Events.onProjectileDead, this);
        }

        if (this.projectProperty?.chase) {
            Vec3.subtract(this.forward, this.target!.worldPosition, this.node.worldPosition);
            this.forward.y = 0;
            this.forward.normalize();
            let maxAngle = this.angularSpeed * deltaTime;

            MathUtil.rotateToward(temp, this.node.forward, this.forward, math.toRadian(maxAngle))
            this.node.forward = temp;
        }

        Vec3.scaleAndAdd(this.position, this.node.worldPosition, this.node.forward, this.linearSpeed * deltaTime);
        this.node.worldPosition = this.position;
    }

    onTriggerEnter(event: ICollisionEvent) {
        this.projectProperty!.penetration--;
        if (this.projectProperty!.penetration <= 0) {
            this.node.emit(Events.onProjectileDead, this)
        }
        EffectManager.instance?.play(DynamicResourceDefine.Effect.EffExplore, event.selfCollider.node.worldPosition);
        AudioManager.instance.playSfx(DynamicResourceDefine.audio.SfxHit);
    }
}

