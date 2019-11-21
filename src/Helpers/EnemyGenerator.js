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
    constructor(scene, damageSufferGroups, damageDonnerGroups, lacaioKeys, monstroKeys, aberracaoKeys, mensageiroKeys){
        this.scene = scene;
        this.damageSufferGroups = Array.isArray(damageSufferGroups) ? damageSufferGroups : [ damageSufferGroups ] ;
        this.damageDonnerGroups = Array.isArray(damageDonnerGroups) ? damageDonnerGroups : [ damageDonnerGroups ] ;
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
    createEnemy(group, key, anchor, position){
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
}