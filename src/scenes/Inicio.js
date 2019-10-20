import * as Phaser from "phaser";
import space3 from "../assets/images/space3.png";
import phaser3Logo from "../assets/images/phaser3-logo.png";
import red from "../assets/images/red.png";

//O exemplo de cena foi baseado no hello world disponível na página da phaser!
//https://phaser.io/tutorials/getting-started-phaser3/part5

export default class Inicio extends Phaser.Scene{
    constructor(){
        super({key: "Inicio"});
    }
    preload(){
        //Você não precisar usar o baseURL, basta importar seus assets!
        this.load.image('sky', space3);
        this.load.image('logo', phaser3Logo);
        this.load.image('red', red);
    }
    create(){
        this.add.image(400, 300, 'sky');
        var particles = this.add.particles('red');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });
        var logo = this.physics.add.image(400, 100, 'logo');
        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);
        emitter.startFollow(logo);
    }
    update(){

    }
}