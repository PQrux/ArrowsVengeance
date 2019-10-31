import * as Phaser from "phaser";
import { Chunk } from "../Helpers";
import arsImg from "../assets/images/ars.png";
import arrow from "../assets/images/arrow.png";

export default class MyScene extends Phaser.Scene{
    /**
     * 
     * @param {string|Phaser.Types.Scenes.SettingsConfig} config 
     */
    constructor(config,chunkSize,tileSize,cameraSpeed){
        super(config);

        this.chunkSize = chunkSize||6.3;
        //Tamanho dos tiles.
        this.tileSize = tileSize||32;
        //Velocidade da camera.
        this.cameraSpeed = cameraSpeed||4;
        this.isJogadorCriado = false;
        this.flechaCriavel = true;
    }
    preload(){
        this.load.spritesheet({key: "ars", url: arsImg, frameConfig: { frameHeight: 60, frameWidth: 23.875 }});
        this.load.image("arrow", arrow);
    }
    /**
     * 
     * @param {string} mostNoiseId 
     * @param {string} fewNoiseId 
     */
    create(mostNoiseId, fewNoiseId){
        this.mostNoiseId = mostNoiseId;
        this.fewNoiseId = fewNoiseId;
        //Ponto central utilizado para a renderização do mapa.
        this.followPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
            this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
        );
        //Pedaços do mapa
        this.chunks = [];
        //Cor de fundo da camera.
        this.cameras.main.setBackgroundColor("#FFFFFF");
        if(!this.isJogadorCriado){
            this.criarJogador();
        }
        this.jogador.anims.play("player_run",true);
    }
    update(){
        this.loadChunk();
        this.followPoint.y -= this.cameraSpeed;
        this.cameras.main.centerOn(this.followPoint.x,this.followPoint.y);
        this.criarFlecha();
    }
    getChunk(x, y) {
        var chunk = null;
        for (var i = 0; i < this.chunks.length; i++) {
            if (this.chunks[i].x == x && this.chunks[i].y == y) {
                chunk = this.chunks[i];
            }
        }
        return chunk;
    }
    loadChunk(){
        let snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
        let snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));
        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;
        for (let x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
            for (let y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
                let existingChunk = this.getChunk(x, y);
                if (existingChunk == null) {
                    let newChunk = new Chunk(this, x, y, this.mostNoiseId, this.fewNoiseId);
                    this.chunks.push(newChunk);
                }
            }
        }
        for (let i = 0; i < this.chunks.length; i++) {
            let chunk = this.chunks[i];
            if (Phaser.Math.Distance.Between(
                snappedChunkX,
                snappedChunkY,
                chunk.x,
                chunk.y
            ) < 3) {
                if (chunk !== null) {
                    chunk.load();
                }
            }
            else {
                if (chunk !== null) {
                    chunk.unload();
                }
            }
        }
    }
    /**
     * 
     * @param {Phaser.GameObjects.GameObject} gameObject 
     * @param {number} plusValue 
     */
    checkBoundsX(gameObject, plusValue){
        if(
            gameObject.x+plusValue < 0 ||
            gameObject.x+plusValue > this.game.config.width
        ){
            return false;
        }
        return true;
    }
    /**
     * 
     * @param {Phaser.GameObjects.GameObject} gameObject 
     * @param {number} plusValue 
     */
    checkBoundsY(gameObject, plusValue){
        if(
            gameObject.y+plusValue < 0 ||
            gameObject.y+plusValue > this.game.config.height
        ){
            return false;
        }
        return true;
    }
    criarJogador(){
        this.jogador = this.add.sprite((this.game.config.width/2)-23.875,this.game.config.height-60,"ars");
        this.jogador.setScrollFactor(0,0);
        this.jogador.setDepth(10);
        this.anims.create({
            key: "player_run",
            frames: this.anims.generateFrameNames("ars", { start: 0, end: 7 }),
            repeat: -1,
            frameRate: 50,
        });
        this.game.canvas.addEventListener("pointerdown", ()=>{
            this.game.input.mouse.requestPointerLock();
        });
        this.input.on("pointermove", (pointer)=>{
            if(this.input.mouse.locked){
                if(this.checkBoundsX(this.jogador,pointer.movementX)){
                    this.jogador.x += pointer.movementX;
                }
                if(this.checkBoundsY(this.jogador,pointer.movementY)){
                    this.jogador.y += pointer.movementY;
                }
            }
        });

        this.isJogadorCriado = true;
    }
    criarFlecha(){
        if(this.game.input.activePointer.leftButtonDown() && this.flechaCriavel){
            this.flechaCriavel = false;
            let flecha = this.add.sprite(this.jogador.x, this.jogador.y,"arrow");
            flecha.setDepth(11);
            flecha.setScrollFactor(0,0);
        }
        if(this.game.input.activePointer.leftButtonReleased() && !this.flechaCriavel){
            this.flechaCriavel = true;
        }
    }
}