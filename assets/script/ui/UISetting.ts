import { _decorator, Component, Slider, math, ProgressBar, Button, Node } from 'cc';
import { Setting } from '../config/Setting';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

/**
 * 设置界面脚本
 */
@ccclass('UISetting')
export class UISetting extends Component {

    /**
     * BGM 的滑动器组件
     */
    sliderBgmVolume: Slider | null = null;

    /**
     * 背景音乐音量进度条
     */
    progressBgmVolume: ProgressBar | null = null;

    /**
     * SFX 音效的滑动器组件
     */
    sliderSfxVolume: Slider | null = null;

    /**
     * 音效的音量进度条
     */
    progressSfxVolume: ProgressBar | null = null;

    /**
     * 关闭按钮
     */
    btnClose: Node | null = null;

    start() {
        this.sliderBgmVolume = this.node.getChildByName("Bgm").getComponent(Slider);
        this.sliderBgmVolume.node.on("slide", this.onBgmVolumeChanged, this);
        this.progressBgmVolume = this.sliderBgmVolume.node.getChildByName("ProgressBar").getComponent(ProgressBar);

        this.sliderSfxVolume = this.node.getChildByName("Sfx").getComponent(Slider);
        this.sliderSfxVolume.node.on("slide", this.onSfxVolumeChanged, this);
        this.progressSfxVolume = this.sliderSfxVolume.node.getChildByName("ProgressBar").getComponent(ProgressBar);

        this.sliderBgmVolume.progress = Setting.instance.bgmVolume;
        this.sliderSfxVolume.progress = Setting.instance.sfxVolume;

        this.progressBgmVolume.progress = Setting.instance.bgmVolume;
        this.progressSfxVolume.progress = Setting.instance.sfxVolume;

        this.btnClose = this.node.getChildByName("BtnClose");
        this.btnClose.on(Button.EventType.CLICK, this.onClose, this);
    }

    onDisable() {
        this.btnClose?.off(Button.EventType.CLICK, this.onClose, this);
    }

    onBgmVolumeChanged(value: Slider) {
        Setting.instance.bgmVolume = math.clamp01(value.progress);
        this.progressBgmVolume.progress = value.progress;
    }

    onSfxVolumeChanged(value: Slider) {
        Setting.instance.sfxVolume = math.clamp01(value.progress);
        this.progressSfxVolume.progress = value.progress;
    }

    onClose() {
        UIManager.instance.closePanel(this.node.name, false);
    }
}

