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
     * @returns {string}
     */
    grupoAleatorio(){
        return EnemyGenerator.hpGroups()[Phaser.Math.Between(1,4)];
    }
    /**
     * @returns {string}
     */
    keyAleatoria(group){
        return this.keys[group][Phaser.Math.Between(0, this.keys[group].length-1)];
    }
    /**
     * @returns {string}
     */
    anchorAleatoria(){
        return EnemyGenerator.anchors()[Phaser.Math.Between(1,4)];
    }
    /**
     * @returns {number}
     */
    duracaoAleatoria(){
        let novaDuracao = 0;
        while(novaDuracao >= 0 && novaDuracao < 12){
            novaDuracao = Phaser.Math.Between(-5, 70);
        }
        return novaDuracao;
    }
    behaviorAleatoria(){
        return EnemyGenerator.behaviors()[Phaser.Math.Between(1,2)];
    }
    velocidadeAleatoria(){
        return Phaser.Math.Between(1,5);
    }
    pontoCentralXAleatoria(){
        return Phaser.Math.Between(10,this.scene.game.config.width-10);
    }
    pontoCentralYAleatoria(){
        return Phaser.Math.Between(10,this.scene.game.config.height-10);
    }
    raioAleatoria(){
        return Phaser.Math.Between(5,50);
    }
    expansaoRaioAleatoria(){
        return Phaser.Math.Between(0,50);
    }
    /**
     * Cria um inimigo na tela.
     * @param {"lacaios"|"monstros"|"aberrecoes"|"mensageiros"|0} group Grupo a qual o inimigo pertence.
     * @param {"TOP"|"RIGHT"|"LEFT"|"BOTTOM"|0} anchor Define extremidade inicial do inimigo.
     * @param {number} position Posição na extremidade inicial do inimigo.
     * @param {string} key nome do sprite do inimigo. 
     * @param {string} behavior Funcionamento do inimigo.
     * @param {number} duracao tempo em que o inimigo permanecerá na tela.
     * @param {{
        velocidade: number,
        pontosParaIrX: number[],
        pontosParaIrY: number[],
        pontoCentralX: number,
        pontoCentralY: number,
        raio: number,
        expansaoRaio: number,
        
     * }} options
     */
    createEnemy(group, key, anchor, position, duracao, behavior, options){
        if(!group) group = this.grupoAleatorio();
        else if(typeof group === "number") group = EnemyGenerator.hpGroups()[group];

        if(!key) key = this.keyAleatoria(group);
        
        let x;
        let y;

        if(!anchor) anchor = this.anchorAleatoria();
        else if(typeof anchor === "number") anchor = EnemyGenerator.anchors()[anchor];

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

        let enemy = new Being(this.scene,x,y,key, EnemyGenerator.hpGroups()[group],(group === "mensageiros" ? true : false));
        enemy.setDepth(10);
        enemy.setScrollFactor(0,0);
        enemy.addGroups(this.groups.inimigos);
        enemy.addGroups(this.groups[group]);
        enemy.anims.play(`${key}_walk`,true);
        
        if(!behavior) behavior = this.behaviorAleatoria();
        else if(typeof behavior === "number") behavior = EnemyGenerator.behaviors()[behavior];
        console.log(behavior);
        if(this["apply_enemy_behavior_"+behavior]) this["apply_enemy_behavior_"+behavior](enemy,options);
        
        if(!duracao) duracao = this.duracaoAleatoria();
        if(duracao >= 0){
            setTimeout(() => {
                this.apply_enemy_behavior_death(enemy, options);
            }, duracao*1000);
        }
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
    /**
     * 
     * @param {Being} enemy 
     * @param {{
        velocidade: number,
     * }} options 
     */
    apply_enemy_behavior_perseguidor(enemy, options){
        if(!enemy) return;
        if(!options|| typeof options !== "object"){
            options = {};
        }
        if(!options.velocidade){
            options.velocidade = this.velocidadeAleatoria();
        }
        let pathFinderAnchor = this.pathFinderAnchor;
        function enemyUpdate(){
            if(enemy.x < pathFinderAnchor.x){
                enemy.x+=options.velocidade;
            }
            else if(enemy.x > pathFinderAnchor.x){
                enemy.x-=options.velocidade;
            }
            if(enemy.y < pathFinderAnchor.y){
                enemy.y+=options.velocidade;
            }
            else if(enemy.y > pathFinderAnchor.y){
                enemy.y-=options.velocidade;
            }
        }
        enemy.update = enemyUpdate;
    }
    /**
     * 
     * @param {Being} enemy 
     * @param {{
        velocidade: number,
        pontosParaIrX: number[],
        pontosParaIrY: number[],
     * }} options 
     */
    apply_enemy_behavior_direcionador(enemy, options){
        if(!enemy) return;
        if(!options|| typeof options !== "object"){
            options = {};
        }
        if(!options.velocidade){
            options.velocidade = this.velocidadeAleatoria();
        }
        let pontoXAleatorio = false;
        let pontoYAleatorio = false;
        if(!options.pontosParaIrX||options.pontosParaIrX.length < 1){
            pontoXAleatorio = true;
        }
        if(!options.pontosParaIrX||options.pontosParaIrX.length < 1){
            pontoYAleatorio = true;
        }
        let counterX = -1;
        let counterY = -1;
        let decidirProximoPontoX = () =>{
            if(pontoXAleatorio){
                return this.pontoCentralXAleatoria();
            }
            else{
                counterX = counterX+1 >= options.pontosParaIrX.length ? 0 : counterX+=1;
                return options.pontosParaIrX[counterX];
            }
        }
        let decidirProximoPontoY = () =>{
            if(pontoYAleatorio){
                return this.pontoCentralYAleatoria();
            }
            else{
                counterY = counterY+1 >= options.pontosParaIrY.length ? 0 : counterY+=1;
                return options.pontosParaIrY[counterY];
            }
        }
        let proximoPontoX = decidirProximoPontoX();
        let proximoPontoY = decidirProximoPontoY();
        let xAlcancado = false;
        let yAlcancado = false;
        function enemyUpdate(){
            //console.log({x: enemy.x, y: enemy.y,xIr: proximoPontoX, yIr: proximoPontoY, xOk: (enemy.x >= proximoPontoX-5 && enemy.x <= proximoPontoX+5), yOk: (enemy.y >= proximoPontoY-5 && enemy.y <= proximoPontoY+5)})
            console.log({xAlcancado, yAlcancado});
            if(!xAlcancado){
                if(enemy.x <= proximoPontoX+3){
                    enemy.x+=options.velocidade;
                }
                else if(enemy.x >= proximoPontoX-3){
                    enemy.x-=options.velocidade;
                }
            }
            if(!yAlcancado){
                if(enemy.y <= proximoPontoY+3){
                    enemy.y+=options.velocidade;
                }
                else if(enemy.y >= proximoPontoY-3){
                    enemy.y-=options.velocidade;
                }
            }
            if((enemy.x >= proximoPontoX-5 && enemy.x <= proximoPontoX+5) && !xAlcancado){
                xAlcancado = true;
            }
            if((enemy.y >= proximoPontoY-5 && enemy.y <= proximoPontoY+5) && !yAlcancado){
                yAlcancado = true;
            }
            if(xAlcancado && yAlcancado){
                proximoPontoX = decidirProximoPontoX();
                proximoPontoY = decidirProximoPontoY();
                xAlcancado = false;
                yAlcancado = false;
            }
        }
        enemy.update = enemyUpdate;
    }
    /**
     * 
     * @param {Being} enemy 
     * @param {{
        velocidade: number,
        pontoCentralX: number,
        pontoCentralY: number,
        raio: number,
        expansaoRaio: number,
     * }} options 
     */
    apply_enemy_behavior_circulador(enemy, options){
        if(!enemy) return;
        if(!options|| typeof options !== "object"){
            options = {};
        }
        if(!options.velocidade){
            options.velocidade = this.velocidadeAleatoria();
        }
        if(!options.pontoCentralX){
            options.pontoCentralX = this.pontoCentralXAleatoria();
        }
        if(!options.pontoCentralY){
            options.pontoCentralY = this.pontoCentralYAleatoria();
        }
        if(!options.raio){
            options.raio = this.raioAleatoria();
        }
        if(!options.expansaoRaio){
            options.expansaoRaio = this.expansaoRaioAleatoria();
        }
        let pontoCentralXAlcancado = false;
        let pontoCentralYAlcancado = false;
        let direcaoAtual = 1; //Sendo 1=cima, 2=direita, 3=baixo e 4=esquerda
        function enemyUpdate(){
            if(!pontoCentralYAlcancado||!pontoCentralXAlcancado){
                if(enemy.x < options.pontoCentralX-3){
                    enemy.x+=options.velocidade;
                }
                else if(enemy.x > options.pontoCentralX+3){
                    enemy.x-=options.velocidade;
                }
                else{
                    pontoCentralXAlcancado = true;
                }
                if(enemy.y < options.pontoCentralY-3){
                    enemy.y+=options.velocidade;
                }
                else if(enemy.y > options.pontoCentralY+3){
                    enemy.y-=options.velocidade;
                }
                else{
                    pontoCentralYAlcancado = true;
                }
            }
            else{
                switch(direcaoAtual){
                    //Diminui esquerda aumenta cima
                    case 1:
                        if(enemy.y < options.pontoCentralY+options.raio){
                            enemy.y = enemy.y + options.velocidade;
                        }
                        else{
                            direcaoAtual = 2;
                        }
                        if(enemy.x < options.pontoCentralX){
                            enemy.x = enemy.x + options.velocidade;
                        }
                    break;
                    //Diminui cima aumenta direita
                    case 2:
                        if(enemy.y > options.pontoCentralY){
                            enemy.y = enemy.y - options.velocidade;
                        }
                        if(enemy.x < options.pontoCentralX+options.raio){
                            enemy.x = enemy.x + options.velocidade;
                        }
                        else{
                            direcaoAtual = 3;
                        }
                    break;
                    //Diminui direita aumenta baixo
                    case 3:
                        if(enemy.y > options.pontoCentralY-options.raio){
                            enemy.y = enemy.y - options.velocidade;
                        }
                        else{
                            direcaoAtual = 4;
                        }
                        if(enemy.x > options.pontoCentralX){
                            enemy.x = enemy.x - options.velocidade;
                        }
                    break;
                    //Diminui baixo aumenta esquerda
                    case 4:
                        if(enemy.y < options.pontoCentralY){
                            enemy.y = enemy.y + options.velocidade;
                        }
                        if(enemy.x > options.pontoCentralX - options.raio){
                            enemy.x = enemy.x - options.velocidade;
                        }
                        else{
                            direcaoAtual = 1;
                            options.raio += options.expansaoRaio;
                        }
                    break;
                }
            }
        }
        enemy.update = enemyUpdate;
    }
    /**
     * 
     * @param {Being} enemy 
     * @param {{
        velocidade: number,
     * }} options 
     */
    apply_enemy_behavior_death(enemy, options){
        if(!enemy) return;
        if(!options|| typeof options !== "object"){
            options = {};
        }
        if(!options.velocidade){
            options.velocidade = this.velocidadeAleatoria();
        }
        let pontoprasedestruirX;
        let pontoprasedestruirY;
        let gameHeight = this.scene.game.config.height;
        let gameWidth = this.scene.game.config.width;
        
        if(enemy.x < (gameWidth/2)){
            pontoprasedestruirX = -60;
        }
        else{
            pontoprasedestruirX = gameWidth+60;
        }
        if(enemy.y < (gameHeight/2)){
            pontoprasedestruirY = -60;
        }
        else{
            pontoprasedestruirY = gameHeight+60;
        }
        function enemyUpdate(){
            if(enemy.x < pontoprasedestruirX-3){
                enemy.x+=options.velocidade;
            }
            else if(enemy.x > pontoprasedestruirX+3){
                enemy.x-=options.velocidade;
            }
            if(enemy.y < pontoprasedestruirY-3){
                enemy.y+=options.velocidade;
            }
            else if(enemy.y > pontoprasedestruirY+3){
                enemy.y-=options.velocidade;
            }
            if(enemy.x <= -50||enemy.x >= gameWidth+50||enemy.y <= -50|| enemy.y >= gameHeight+50){
                enemy.destroy();
            }
        }
        enemy.update = enemyUpdate;
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
            perseguidor: 1,
            circulador: 2,
            direcionador: 3,
            1: "perseguidor",
            2: "circulador",
            3: "direcionador",
        }
    }
}