import grama from "../assets/images/grama.png";
import terra from "../assets/images/terra.png";
import undeadking from "../assets/images/enemies/undeadking.png";
import MyScene from "./MyScene";
import { EnemyGenerator } from "../Helpers";


export default class Inicio extends MyScene{
    constructor(){
        super({key: "Inicio"});
    }
    preload(){
        super.preload();
        this.load.image("terra",terra);
        this.load.image("grama",grama);
        this.load.spritesheet("undeadking", undeadking, { frameWidth: 32, frameHeight: 64 });
    }
    create(){
        super.create("grama","terra");
        this.eg = new EnemyGenerator(this, {undeadking: "undeadking"});
        let inimigo = this.eg.createEnemy("lacaios",20,20,"undeadking");
        let anima = this.anims.create({
            key: "undeadking_run",
            frames: this.anims.generateFrameNames("undeadking", { start: 0, end: 2 }),
            repeat: -1,
            frameRate: 16,
        });
        inimigo.anims.play(anima,true);
    }
    update(){
        super.update();
    }
}