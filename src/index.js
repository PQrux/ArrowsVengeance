import * as Phaser from "phaser";
import { Floresta } from "./scenes";
import multiStorager from "./Helpers/MultiStorager";
class MyGame extends Phaser.Game{
    constructor(){
        //Passa para o super a game config como parametro!
        super({
            type: Phaser.AUTO,
            parent: "game",
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            //Você pode adicionar mais telas ao seu jogo aqui!
            scene: [
                Floresta,
            ]
        })
        multiStorager.DataStorager.set("vidas",3);
    }
}
//Inicializa o jogo.
new MyGame();