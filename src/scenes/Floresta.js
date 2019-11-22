import grama from "../assets/images/grama.png";
import terra from "../assets/images/terra.png";
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
        this.lacaios = [
            this.ssManager.useAsset(this.ssManager.list.undeadking),
        ]
        
    }
    create(){
        super.create("grama","terra");
        this.ssManager.createAnims();
        this.eg = new EnemyGenerator(this, this.grupoJogador, this.grupoFlechas, this.lacaios, [], [], [], this.jogador.body.position);
        let inimigo = this.eg.createEnemy("lacaios", 0,0,0);
    }
    update(){
        super.update();
    }
}