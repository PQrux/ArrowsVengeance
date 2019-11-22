import * as Phaser from "phaser";
import Sprite from "../Models/Sprite";
import Being from "../Models/Being";

export default class EnemyGenerator{
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Phaser.Physics.Arcade.Group|Array<Phaser.Physics.Arcade.Group>} damageSufferGroups Grupos que sofrem dano dos inimigos.
     * @param {Phaser.Physics.Arcade.Group|Array<Phaser.Physics.Arcade.Group>} damageDonnerGroups Grupos que causam dano nos inimigos.
     * @param {Array<String>} lacaioKeys 
     * @param {Object<String>} monstroKeys 
     * @param {Object<String>} aberracaoKeys 
     * @param {Object<String>} mensageiroKeys 
     */
    constructor(scene, damageSufferGroups, damageDonnerGroups, lacaioKeys, monstroKeys, aberracaoKeys, mensageiroKeys, pathFinderAnchor){
        this.scene = scene;
        this.damageSufferGroups = Array.isArray(damageSufferGroups) ? damageSufferGroups : [ damageSufferGroups ] ;
        this.damageDonnerGroups = Array.isArray(damageDonnerGroups) ? damageDonnerGroups : [ damageDonnerGroups ] ;
        this.pathFinderAnchor = pathFinderAnchor;
        this.keys = {
            lacaios: lacaioKeys||[],
            monstros: monstroKeys||[],
            aberracoes: aberracaoKeys||[],
            mensageiros: mensageiroKeys||[],
        };
        this.groups = {
            inimigos: this.scene.physics.add.group(),
            lacaios: this.scene.physics.add.group(),
            monstros: this.scene.physics.add.group(),
            aberrecoes: this.scene.physics.add.group(),
            mensageiros: this.scene.physics.add.group(),
        };
        this.groups.inimigos.runChildUpdate = true;
        this.scene.physics.add.collider(this.groups.inimigos, this.damageDonnerGroups, this.sufferDamage);
        this.scene.physics.add.collider(this.groups.inimigos, this.damageSufferGroups, this.doDamage);
    }
    /**
     * Cria um inimigo na tela.
     * @param {"lacaios"|"monstros"|"aberrecoes"|"mensageiros"|0} group Grupo a qual o inimigo pertence.
     * @param {"TOP"|"RIGHT"|"LEFT"|"BOTTOM"|0} anchor Define extremidade inicial do inimigo.
     * @param {number} position Posição na extremidade inicial do inimigo.
     * @param {string} key nome do sprite do inimigo. 
     */
    createEnemy(group, key, anchor, position, behavior, behaviorOptions){
        if(!group){
            group = EnemyGenerator.hpGroups()[Phaser.Math.Between(1,4)];
        }
        if(!key){
            key = this.keys[group][Phaser.Math.Between(0, this.keys[group].length-1)];
        }
        let x;
        let y;
        if(!anchor){
            anchor = EnemyGenerator.anchors()[Phaser.Math.Between(1,4)];
        }
        if(anchor === "TOP") y= 20;
        else if(anchor === "BOTTOM") y = this.scene.game.config.height - 20;
        else if(anchor === "LEFT") x = 20;
        else x = this.scene.game.config.width - 20;
        if(!position){
            if(y) position = Phaser.Math.Between(20, this.scene.game.config.width-20);
            else position = Phaser.Math.Between(20, this.scene.game.config.height-20);
        }
        if(y) x = position;
        else y = position;
        console.log(anchor);
        let enemy = new Being(this.scene,x,y,key, EnemyGenerator.hpGroups()[group],(group === "mensageiros" ? true : false));
        enemy.setDepth(10);
        enemy.setScrollFactor(0,0);
        enemy.addGroups(this.groups.inimigos);
        enemy.addGroups(this.groups[group]);
        enemy.anims.play(`${key}_walk`,true);
        let perseguidorOptions = {
            velocidade: 0,
        }
        let circuladorOptions = {
            velocidade: 0,
            pontoInicialX: 0,
            pontoInicialY: 0,
            raio: 0,

        }
        let timeisover = false;
        //Se o inimigo está 50pts fora da tela, será destruído.
        setTimeout(() => {
            timeisover = true;
        }, 5000);
        let pontoPrairX = 300;
        let pontoPrairY = 200;
        let raio = 100;
        let ruidoCircunferencia = 1;
        let pontoPrairXalcancado = false;
        let pontoPrairYalcancado = false;
        let aumentoRuido = 20;
        let direcaoAtual = 1; //Sendo 1=cima, 2=direita, 3=baixo e 4=esquerda

        let pontoprasedestruirX = undefined;
        let pontoprasedestruirY = undefined;
        enemy.update = () =>{
            if(timeisover === true){
                if(pontoprasedestruirX === undefined|| pontoprasedestruirY === undefined){
                    if(enemy.x < (this.scene.game.config.width/2)){
                        pontoprasedestruirX = -60;
                    }
                    else{
                        pontoprasedestruirX = this.scene.game.config.width+60;
                    }
                    if(enemy.y < (this.scene.game.config.height/2)){
                        pontoprasedestruirY = -60;
                    }
                    else{
                        pontoprasedestruirY = this.scene.game.config.height+60;
                    }
                }
                else{
                    if(enemy.x < pontoprasedestruirX-3){
                        enemy.x+=2;
                    }
                    else if(enemy.x > pontoprasedestruirX+3){
                        enemy.x-=2;
                    }
                    if(enemy.y < pontoprasedestruirY-3){
                        enemy.y+=2;
                    }
                    else if(enemy.y > pontoprasedestruirY+3){
                        enemy.y-=2;
                    }
                }
                if(enemy.x <= -50||enemy.x >= this.scene.game.config.width+50||enemy.y <= -50|| enemy.y >= this.scene.game.config.height+50){
                    enemy.destroy();
                }
            }
            else if(!pontoPrairXalcancado||!pontoPrairYalcancado){
                if(enemy.x < pontoPrairX-3){
                    enemy.x+=2;
                    console.log("indo até x");
                }
                else if(enemy.x > pontoPrairX+3){
                    enemy.x-=2;console.log("indo até x");
                }
                else{
                    pontoPrairXalcancado = true;
                }
                if(enemy.y < pontoPrairY-3){
                    enemy.y+=2;console.log("indo até y");
                    console.log(`Y atual = ${enemy.y} Y alvo = ${pontoPrairY}`);
                }
                else if(enemy.y > pontoPrairY+3){
                    enemy.y-=2;console.log("indo até y");
                    console.log(`Y atual = ${enemy.y} Y alvo = ${pontoPrairY}`);
                }
                else{
                    pontoPrairYalcancado = true;
                }
            }
            else{
                console.log("girando");
                switch(direcaoAtual){
                    //Diminui esquerda aumenta cima
                    case 1:
                        if(enemy.y < pontoPrairY+raio){
                            enemy.y = enemy.y + ruidoCircunferencia;
                        }
                        else{
                            direcaoAtual = 2;
                        }
                        if(enemy.x < pontoPrairX){
                            enemy.x = enemy.x + ruidoCircunferencia;
                        }
                    break;
                    //Diminui cima aumenta direita
                    case 2:
                        if(enemy.y > pontoPrairY){
                            enemy.y = enemy.y - ruidoCircunferencia;
                        }
                        if(enemy.x < pontoPrairX+raio){
                            enemy.x = enemy.x+ruidoCircunferencia;
                        }
                        else{
                            direcaoAtual = 3;
                        }
                    break;
                    //Diminui direita aumenta baixo
                    case 3:
                        if(enemy.y > pontoPrairY-raio){
                            enemy.y = enemy.y - ruidoCircunferencia;
                        }
                        else{
                            direcaoAtual = 4;
                        }
                        if(enemy.x > pontoPrairX){
                            enemy.x = enemy.x-ruidoCircunferencia;
                        }
                    break;
                    //Diminui baixo aumenta esquerda
                    case 4:
                        if(enemy.y < pontoPrairY){
                            enemy.y = enemy.y + ruidoCircunferencia;
                        }
                        if(enemy.x > pontoPrairX-raio){
                            enemy.x = enemy.x-ruidoCircunferencia;
                        }
                        else{
                            direcaoAtual = 1;
                            raio += aumentoRuido;
                        }
                    break;
                }
            }
        }
        /*
        enemy.update = () =>{
            if(enemy.x < this.pathFinderAnchor.x){
                enemy.x+=2;
            }
            else if(enemy.x > this.pathFinderAnchor.x){
                enemy.x-=2;
            }
            if(enemy.y < this.pathFinderAnchor.y){
                enemy.y+=2;
            }
            else if(enemy.y > this.pathFinderAnchor.y){
                enemy.y-=2;
            }
        }*/
        return enemy;
    }
    /**
     * @param {Being} enemy
     * @param {Phaser.GameObjects.GameObject} damageSuffer
     */
    doDamage(enemy, damageSuffer){
        if(enemy.isBeing){
            enemy.hit(1);
        }
        if(damageSuffer.isBeing){
            damageSuffer.hit(1);
        }
    }
    /**
     * @param {Being} enemy
     * @param {Phaser.GameObjects.GameObject} damageDonner
     */
    sufferDamage(enemy, damageDonner){
        if(enemy.isBeing){
            enemy.hit(1);
        }
        damageDonner.destroy();
    }
    static hpGroups() {
        return {
            lacaios: 1,
            monstros: 2,
            aberrecoes: 3,
            mensageiros: 4,
            1: "lacaios",
            2: "monstros",
            3:"aberracoes",
            4: "mensageiros"
        }
    }
    static anchors() {
        return {
            TOP: 1,
            LEFT: 2,
            BOTTOM: 3,
            RIGHT: 4,
            1: "TOP",
            2: "LEFT",
            3:"BOTTOM",
            4: "RIGHT"
        }
    }
    static behaviors(){
        return {
            PERSEGUIDOR: 1,
            DIRECIONADO: 2,
            CIRCULADOR: 3,
        }
    }
}