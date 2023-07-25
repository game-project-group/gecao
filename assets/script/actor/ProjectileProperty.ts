import { _decorator } from 'cc';

/**
 * 投射物属性
 */
export class ProjectileProperty {

    /**
     * 穿透
     */
    penetration: number = 1;

    /**
     * 时长
     */
    liftTime: number = 3.0;

    /**
     * 追踪
     */
    chase: boolean = false;
}

