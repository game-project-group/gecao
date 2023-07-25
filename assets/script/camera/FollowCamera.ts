import { _decorator, Component, Node, Camera, Vec3, v3 } from 'cc';
const { ccclass, property } = _decorator;

let tempPos : Vec3 = v3();

/**
 * 固定跟随相机
 */
@ccclass('FollowCamera')
export class FollowCamera extends Component {

    @property(Node)
    target: Node | null = null;

    @property(Camera)
    camera:Camera | null = null;    

    initialDirection: Vec3 = v3();    
    
    speed: number = 0.0;
    
    start() {        
        Vec3.subtract(this.initialDirection, this.node.worldPosition, this.target!.worldPosition);        
        this.camera.node.lookAt(this.target.worldPosition, Vec3.UP);
    }

    update(deltaTime: number) {
        Vec3.add(tempPos, this.target!.worldPosition, this.initialDirection);                
        this.node.setWorldPosition(tempPos);
    }
}

