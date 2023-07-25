export const DynamicResourceDefine = {

    directory: ["effect", "audio", "actor", "ui"],

    Actor: {
        Enemy: {
            Path: "actor/prefab/enemy",
        }
    },

    Effect: {
        Path: "effect/prefab/",
        EffExplore: "effect/prefab/EffExplore",
        EffDie: "effect/prefab/EffDie",
    },

    audio: {        
        Bgm: "audio/prefab/Bgm",
        SfxHit: "audio/prefab/SfxHit",
        SfxShoot: "audio/prefab/SfxShoot",
    },
}
