import { Scene } from "phaser";
import Sprite from "../Models/Sprite";
import undeadking from "../assets/images/enemies/undeadking.png"
import abelhaMonster from "../assets/images/enemies/abelhaMonster.png"
import anEsqueleto from "../assets/images/enemies/anEsqueleto.png"
import cavaleiroBlue from "../assets/images/enemies/cavaleiroBlue.png"
import cavaleiroRed from "../assets/images/enemies/cavaleiroRed.png"
import cavaleiroRoxo from "../assets/images/enemies/cavaleiroRoxo.png"
import chifreGreen from "../assets/images/enemies/chifreGreen.png"
import giganteMorc from "../assets/images/enemies/giganteMorc.png"
import giganteNum from "../assets/images/enemies/giganteNum.png"
import lagartoAzul from "../assets/images/enemies/lagartoAzul.png"
import laranjaChifre from "../assets/images/enemies/laranjaChifre.png"
import laranjaMonstro from "../assets/images/enemies/laranjaMonstro.png"
import monsterLar from "../assets/images/enemies/monsterLar.png"
import monstroAsas from "../assets/images/enemies/monstroAsas.png"
import monstroEspada from "../assets/images/enemies/monstroEspada.png"
import monstroSoquete from "../assets/images/enemies/monstroSoquete.png"
import olhoAzul from "../assets/images/enemies/olhoAzul.png"
import papagaioLaranja from "../assets/images/enemies/papagaioLaranja.png"
import quatroEsqueleto from "../assets/images/enemies/quatroEsqueleto.png"
import quatroGiant from "../assets/images/enemies/quatroGiant.png"
import redMonster from "../assets/images/enemies/redMonster.png"
import soldadoAsas from "../assets/images/enemies/soldadoAsas.png"
import soldadoCav from "../assets/images/enemies/soldadoCav.png"
import trueGiant from "../assets/images/enemies/trueGiant.png"

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
            "abelhaMonster": new Sprite("abelhaMonster", abelhaMonster, 35, 29, 0, 1, 10),
            "anEsqueleto": new Sprite("anEsqueleto", anEsqueleto, 66, 69, 0, 1, 10),
            "cavaleiroBlue": new Sprite("cavaleiroBlue", cavaleiroBlue, 29, 39, 0, 1, 10),
            "cavaleiroRed": new Sprite("cavaleiroRed", cavaleiroRed, 29, 40, 0, 1, 10),
            "cavaleiroRoxo": new Sprite("cavaleiroRoxo", cavaleiroRoxo, 45, 50, 0, 2, 10),
            "chifreGreen": new Sprite("chifreGreen", chifreGreen, 20, 51, 0, 1, 10),
            "giganteMorc": new Sprite("giganteMorc", giganteMorc, 69, 69, 0, 2, 10),
            "giganteNum": new Sprite("giganteNum", giganteNum, 69, 69, 0, 4, 10),
            "lagartoAzul": new Sprite("lagartoAzul", lagartoAzul, 24, 25, 0, 1, 10),
            "laranjaChifre": new Sprite("laranjaChifre", laranjaChifre, 27, 26, 0, 1, 10),
            "laranjaMonstro": new Sprite("laranjaMonstro", laranjaMonstro, 26, 32, 0, 1, 10),
            "monsterLar": new Sprite("monsterLar", monsterLar, 24, 32, 0, 1, 10),
            "monstroAsas": new Sprite("monstroAsas", monstroAsas, 33, 32, 0, 1, 10 ),
            "monstroEspada": new Sprite("monstroEspada", monstroEspada, 24, 31, 0, 1, 10),
            "monstroSoquete": new Sprite("monstroSoquete", monstroSoquete, 24, 37, 0, 1, 10),
            "olhoAzul": new Sprite("olhoAzul", olhoAzul, 23, 26, 0, 1, 10),
            "papagaioLaranja": new Sprite("papagaioLaranja", papagaioLaranja, 24, 31, 0, 1, 10),
            "quatroEsqueleto": new Sprite("quatroEsqueleto", quatroEsqueleto, 66, 69, 0, 3, 10),
            "quatroGiant": new Sprite("quatroGiant", quatroGiant, 68, 70, 0, 3, 10),
            "redMonster": new Sprite("redMonster", redMonster, 29, 23, 0, 1, 10),
            "soldadoAsas": new Sprite("soldadoAsas", soldadoAsas, 35, 39, 0, 3, 10),
            "soldadoCav": new Sprite("soldadoCav", soldadoCav, 35, 39, 0, 1, 10),
            "trueGiant": new Sprite("trueGiant", trueGiant, 68, 70, 0, 2, 10),
            "undeadking": new Sprite("undeadking", undeadking, 32, 64, 0, 11, 10),
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
        return sprite.nome;
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