import { Prefab, SpriteFrame } from "cc";

export class ResourceManager {

    assets: Map<string, Prefab | SpriteFrame> = new Map();

    cacheAsset(name: string, data: Prefab | SpriteFrame) {
        data.addRef();
        this.assets.set(name, data);
    }

    releaseAsset(name: string, data: Prefab | SpriteFrame) {
        if (this.assets.has(name)) {
            const asset = this.assets.get(name);
            asset.decRef();
            this.assets.delete(name);
        }
    }

    releaseAllAssets() {
        for (let value of this.assets.values()) {
            value.decRef()
        }
        this.assets.clear();
    }
}

export let ResManager = new ResourceManager();