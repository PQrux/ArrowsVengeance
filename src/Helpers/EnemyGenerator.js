import * as Phaser from "phaser";
import Sprite from "../Models/Sprite";
import Being from "../Models/Being";

export default class EnemyGenerator{
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Phaser.Physics.Arcade.Group|Array<Phaser.Physics.Arcade.Group>} damageSufferGroups Grupos que sofrem dano dos inimigos.
     * @param {Phaser.Physics.Arcade.Group|Array<Phaser.Physics.Arcade.Group>} damageDonnerGroups Grupos que causam dano nos inimigos.
     * @param {Object<string,Sprite>} lacaioKeys 
     * @param {Object<string,Sprite>} monstroKeys 
     * @param {Object<string,Sprite>} aberracaoKeys 
     * @param {Object<string,Sprite>} mensageiroKeys 
     */
    constructor(scene, damageSufferGroups, damageDonnerGroups, lacaioKeys, monstroKeys, aberracaoKeys, mensageiroKeys){
        this.scene = scene;
        this.damageSufferGroups = Array.isArray(damageSufferGroups) ? damageSufferGroups : [ damageSufferGroups ] ;
        this.damageDonnerGroups = Array.isArray(damageDonnerGroups) ? damageDonnerGroups : [ damageDonnerGroups ] ;
        this.lacaioKeys = lacaioKeys||{};
        this.monstroKeys = monstroKeys||{};
        this.aberracaoKeys = aberracaoKeys||{};
        this.mensageiroKeys = mensageiroKeys||{};
        this.inimigos = this.scene.add.group();
        this.lacaios = this.scene.add.group();
        this.monstros = this.scene.add.group();
        this.aberrecoes = this.scene.add.group();
        this.mensageiros = this.scene.add.group();
        this.scene.physics.add.collider(this.inimigos, this.damageDonnerGroups, this.sufferDamage);
        this.scene.physics.add.collider(this.inimigos, this.damageSufferGroups, this.doDamage);
    }
    /**
     * Cria um inimigo na tela.
     * @param {"lacaios"|"monstros"|"aberrecoes"|"mensageiros"} group Grupo a qual o inimigo pertence.
     * @param {number} x Posição no eixo X.
     * @param {number} y Posição no eixo Y.
     * @param {string} key nome do sprite do inimigo. 
     */
    createEnemy(group, x, y, key){
        let enemy = new Being(this.scene,x,y,key, EnemyGenerator.hpGroups()[group],(group === "mensageiros" ? true : false));
        enemy.setDepth(10);
        enemy.setScrollFactor(0,0);
        enemy.addGroups(this.inimigos);
        enemy.addGroups(this[group]);
        enemy.anims.play(`${key}_walk`,true);
        return enemy;
    }
    /**
     * @param {Phaser.GameObjects.GameObject} enemy
     * @param {Phaser.GameObjects.GameObject} damageSuffer
     */
    doDamage(enemy, damageSuffer){

    }
    /**
     * @param {Phaser.GameObjects.GameObject} enemy
     * @param {Phaser.GameObjects.GameObject} damageDonner
     */
    sufferDamage(enemy, damageDonner){

    }
    static hpGroups() {
        return {
            lacaios: 1,
            monstros: 2,
            aberrecoes: 3,
            mensageiros: 4,
        }
    }
}