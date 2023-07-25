import { _decorator, Component, Node, Prefab, AudioSource, resources, instantiate, director } from 'cc';
import { Setting } from '../config/Setting';
import { Events } from '../events/Events';
import { DynamicResourceDefine } from '../resource/ResourceDefine';
import { Pools } from '../util/Pools';
const { ccclass, property } = _decorator;

/**
 * 音效管理器
 */
@ccclass('AudioManager')
export class AudioManager extends Component {

    static _instance: AudioManager;
    static get instance(): AudioManager {
        return this._instance;
    }

    private bgm: AudioSource | null = null;

    private sfx: Map<string, AudioSource> = new Map()

    onLoad() {
        AudioManager._instance = this;
        Setting.instance.on(Events.onBgmVolumeChanged, this.onBgmVolumeChanged, this)
    }

    onDestroy() {
        AudioManager._instance = null;
        Setting.instance.off(Events.onBgmVolumeChanged, this.onBgmVolumeChanged, this)
    }
    init() {

        resources.load(DynamicResourceDefine.audio.Bgm, Prefab, (err: Error, bgmPrefab: Prefab) => {
            let bgmNode = instantiate(bgmPrefab);
            this.node.addChild(bgmNode);
            this.bgm = bgmNode.getComponent(AudioSource);
        });

        this.initSfx(DynamicResourceDefine.audio.SfxHit);
        this.initSfx(DynamicResourceDefine.audio.SfxShoot);

    }

    private initSfx(path: string) {
        resources.load(DynamicResourceDefine.audio.Bgm, Prefab, (err: Error, prefab: Prefab) => {
            let node = instantiate(prefab);
            this.node.addChild(node);
            const as = node.getComponent(AudioSource);

            this.sfx.set(path, as);
        });
    }

    playBgm() {
        if (!this.bgm) {
            return;
        }
        if (this.bgm) {
            this.bgm.stop()
        }
        let node = this.bgm.node;
        node.active = true;
        let as = node.getComponent(AudioSource);
        as.volume = Setting.instance.bgmVolume;
        this.bgm = as;
    }

    playSfx(path: string) {
        if (!this.sfx.has(path)) {
            return;
        }
        let node = this.sfx.get(path).node;
        node.active = true;
        let as = node.getComponent(AudioSource);
        as.volume = Setting.instance.sfxVolume;        
        as.play();
    }

    onBgmVolumeChanged() {
        if (this.bgm) {
            this.bgm.volume = Setting.instance.bgmVolume;
        }
    }
}

