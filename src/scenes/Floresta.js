import grama from "../assets/images/grama.png";
import terra from "../assets/images/terra.png";
import music1 from "../assets/musics/music1.mp3";
import MyScene from "./MyScene";
import { EnemyGenerator } from "../Helpers";

let tempo = 23.05;
let qntd = 5;
export default class Inicio extends MyScene{
    constructor(){
        super({key: "Inicio"});
    }
    preload(){
        super.preload();
        this.load.image("terra",terra);
        this.load.image("grama",grama);
        this.load.audio("music1", music1);
        this.lacaios = [
            this.ssManager.useAsset(this.ssManager.list.cavaleiroBlue),
            this.ssManager.useAsset(this.ssManager.list.cavaleiroRed),
            this.ssManager.useAsset(this.ssManager.list.lagartoAzul),
            this.ssManager.useAsset(this.ssManager.list.laranjaChifre),
            this.ssManager.useAsset(this.ssManager.list.laranjaMonstro),
            this.ssManager.useAsset(this.ssManager.list.monstroAsas),
            this.ssManager.useAsset(this.ssManager.list.redMonster),
            this.ssManager.useAsset(this.ssManager.list.monstroEspada),
            this.ssManager.useAsset(this.ssManager.list.monstroSoquete),
            this.ssManager.useAsset(this.ssManager.list.papagaioLaranja),
        ];
        this.monstros = [
            this.ssManager.useAsset(this.ssManager.list.anEsqueleto),
            this.ssManager.useAsset(this.ssManager.list.cavaleiroRoxo),
            this.ssManager.useAsset(this.ssManager.list.chifreGreen),
            this.ssManager.useAsset(this.ssManager.list.undeadking),
        ];
        this.aberracoes = [
            this.ssManager.useAsset(this.ssManager.list.giganteMorc),
            this.ssManager.useAsset(this.ssManager.list.quatroGiant),
        ];
        this.mensageiros = [
            this.ssManager.useAsset(this.ssManager.list.abelhaMonster),
            this.ssManager.useAsset(this.ssManager.list.olhoAzul),
        ];
    }
    create(){
        super.create("grama","terra");
        this.ssManager.createAnims();
        this.eg = new EnemyGenerator(
            this, this.grupoJogador, this.grupoFlechas, this.lacaios, this.monstros, 
            this.aberracoes, this.mensageiros, this.jogador.body.position
        );
        this.musica = this.sound.add("music1");
        this.musica.play();
        this.startCounter(); 
    }
    update(){
        super.update();
        if(this.getCounterSeconds() > tempo){
            tempo = this.getCounterSeconds() + Phaser.Math.Between(5, 15);
            qntd = Phaser.Math.Between(5,10);
            for(let i = 0; i < qntd; i++){
                this.eg.createEnemy(0, 0, 0, 0, 0, Phaser.Math.Between(1,3));
            }
        }
    }
}