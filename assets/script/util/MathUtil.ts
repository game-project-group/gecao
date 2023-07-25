import { _decorator, IVec3Like, Vec3, v3, math } from 'cc';

let tempVec: Vec3 = v3()
let tempVec2: Vec3 = v3()
let tempVec3: Vec3 = v3()
let up = v3()

/**
 * 通用数学库
 */
export class MathUtil {

    /**
     * Rodrigues’ Rotation Formula
     * 使 v 绕 u 轴旋转 maxAngleDelta （弧度）
     * @param out 
     * @param v 
     * @param u 
     * @param maxAngleDelta 
     */
    static rotateAround(out: Vec3, v: Vec3, u: Vec3, maxAngleDelta: number) {

        //out = v*cos + uxv*sin  + (u*v)*u*(1- cos);
        const cos = Math.cos(maxAngleDelta);
        const sin = Math.sin(maxAngleDelta);

        // v * cos 
        Vec3.multiplyScalar(tempVec, v, cos);

        // u x v 
        Vec3.cross(tempVec2, u, v);

        // v*cos + uxv*sin
        Vec3.scaleAndAdd(tempVec3, tempVec, tempVec2, sin);

        const dot = Vec3.dot(u, v);

        // + (u*v)*u*(1-cos)
        Vec3.scaleAndAdd(out, tempVec3, u, dot * (1.0 - cos));

    }

    /**
     * 将 from 向 to 旋转 maxAngleDelta 弧度
     * @param out 
     * @param from 
     * @param to 
     * @param maxAngleDelta 
     */
    static rotateToward(out: Vec3, from: Vec3, to: Vec3, maxAngleDelta: number) {
        Vec3.cross(up, from, to);
        this.rotateAround(out, from, up, maxAngleDelta);
    }

    /**
     * 求两个向量间的夹角（带符号）
     * @param from 
     * @param to 
     * @param axis 
     * @returns 
     */
    static signAngle(from: Vec3, to: Vec3, axis: Vec3): number {
        const angle = Vec3.angle(from, to);
        Vec3.cross(tempVec, from, to);
        const sign = Math.sign(axis.x * tempVec.x + axis.y * tempVec.y + axis.z * tempVec.z);
        return angle * sign;
    }
}

