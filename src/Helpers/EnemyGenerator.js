import * as Phaser from "phaser";

export default class EnemyGenerator{
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Object<string,string>} lacaioKeys 
     * @param {Object<string,string>} monstroKeys 
     * @param {Object<string,string>} aberracaoKeys 
     * @param {Object<string,string>} mensageiroKeys 
     */
    constructor(scene, lacaioKeys, monstroKeys, aberracaoKeys, mensageiroKeys){
        this.scene = scene;
        this.lacaioKeys = lacaioKeys||{};
        this.monstroKeys = monstroKeys||{};
        this.aberracaoKeys = aberracaoKeys||{};
        this.mensageiroKeys = mensageiroKeys||{};

        this.lacaios = this.scene.add.group();
        this.monstros = this.scene.add.group();
        this.aberrecoes = this.scene.add.group();
        this.mensageiros = this.scene.add.group();
    }
    createEnemy(group, x, y, key){
        let enemy = this.scene.add.sprite(x,y,key);
        enemy.setDepth(10);
        enemy.setScrollFactor(0,0);
        this[group].add(enemy);
        return enemy;
    }
}