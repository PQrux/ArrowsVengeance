import { Scene } from "phaser";
import Sprite from "../Models/Sprite";
import undeadking from "../assets/images/enemies/undeadking.png"

export default class SpriteSheetManager{
    /**
     * 
     * @param {Scene} scene 
     */
    constructor(scene){
        this.scene = scene;
        /**@type {Object<string, Sprite>} */
        this.used = {};
        this.list = {
            "undeadking": new Sprite("undeadking", undeadking, 32, 64, 0, 2, 20),
        };
    }
    /**
     * 
     * @param {Sprite} sprite 
     */
    useAsset(sprite){
        if(!this.used[sprite.nome]){
            this.scene.load.spritesheet(sprite.nome, sprite.arquivo, { frameWidth: sprite.width, frameHeight: sprite.height });
            this.used[sprite.nome] = sprite;
        }
    }
    createAnims(){
        for(let key in this.used){
            let sprite = this.used[key];
            this.scene.anims.create({
                key: `${sprite.nome}_walk`,
                frames: this.scene.anims.generateFrameNames(sprite.nome, { start: sprite.startFrame, end: sprite.endFrame }),
                repeat: sprite.repeat,
                frameRate: sprite.frameRate,
            });
        }
    }
}