import * as Phaser from "phaser";

/**
 * @property {function(Being)} onDidDie
 */
export default class Being extends Phaser.Physics.Arcade.Sprite{
    /**
     * 
     * @param {Phaser.Scene} scene Scene a qual adicionar.
     * @param {number} x Posição X do ser.
     * @param {number} y Posição Y do ser.
     * @param {string} texture Textura do ser.
     * @param {number} hp Vida do ser.
     * @param {boolean} imortal tem redução de vida?
     */
    constructor(scene, x, y, texture, hp, imortal){
        super(scene, x, y, texture);
        this.scene.add.existing(this);
        this.hp = hp;
        this.imortal = imortal;
    }
    /**
     * Adiciona grupos ao ser.
     * @param {Phaser.Physics.Arcade.Group|Array<Phaser.Physics.Arcade.Group>} groups 
     */
    addGroups(groups){
        if(!Array.isArray(groups)){
            groups.add(this);
        }
        else{
            groups.forEach((group)=>{
                group.add(this);
            })
        }
    }
    /**
     * Método de morte do ser, é ativado quando o HP do ser alcança 0.
     * Pode ser sobrescrito para ativar efeitos adicionais ou causar a morte de outras formas.
     */
    die(){
        this.destroy();
    }
    /**
     * 
     * @param {Being} being 
     */
    onWillDie(being){
    }
    /**
     * Método para ser sobrescrito
     * @param {Being} being 
     */
    onDidDie(being){
    }
    /**
     * 
     * @param {function(Being)} callback 
     */
    setOnWillDie(callback){
        this.onWillDie = callback;
    }
    /**
     * 
     * @param {function(Being)} callback 
     */
    setOnDidDie(callback){
        this.onDidDie = callback;
    }
    hit(damage){
        if(!this.imortal){
            this.hp = this.hp - damage;
            if(this.hp <= 0){
                this.onWillDie(this);
                this.die();
                this.onDidDie(this);
            }
        }
        return this.hp;
    }
}