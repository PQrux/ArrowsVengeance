import * as Phaser from "phaser";
import { Inicio } from "./scenes";
class MyGame extends Phaser.Game{
    constructor(){
        //Passa para o super a game config como parametro!
        super({
            type: Phaser.AUTO,
            parent: "game",
            width: 800,
            height: 600,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 200 }
                }
            },
            //Você pode adicionar mais telas ao seu jogo aqui!
            scene: [
                Inicio,
            ]
        })
    }
}
//Inicializa o jogo.
new MyGame();