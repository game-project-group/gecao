import { EventTarget, math, _decorator } from 'cc';
import { Events } from '../events/Events';
import { PlayerPreference } from './PlayerPreference';
const { ccclass, property } = _decorator;

/**
 * 配置
 */
@ccclass('Setting')
export class Setting extends EventTarget {

    private static _instance: Setting = new Setting();
    static get instance(): Setting {
        return this._instance;
    }

    /**
     * 背景音量
     */
    private _bgmVolume: number = 1.0;

    set bgmVolume(value: number) {
        this._bgmVolume = math.clamp01(value);
        PlayerPreference.setFloat("bgmVolume", value);
        this.emit(Events.onBgmVolumeChanged, this._bgmVolume);
    }

    get bgmVolume(): number {
        return this._bgmVolume;
    }

    /**
     * 音效音量
     */
    private _sfxVolume: number = 1.0;

    set sfxVolume(value: number) {
        this._sfxVolume = math.clamp01(value);
        PlayerPreference.setFloat("sfxVolume", value);
    }

    get sfxVolume(): number {
        return this._sfxVolume;
    }

    load() {
        this._bgmVolume = PlayerPreference.getFloat("bgmVolume");
        if (isNaN(this._bgmVolume)) {
            this._bgmVolume = 1.0;
        }
        this._sfxVolume = PlayerPreference.getFloat("sfxVolume");
        if (isNaN(this._sfxVolume)) {
            this._sfxVolume = 1.0;
        }
    }
}
