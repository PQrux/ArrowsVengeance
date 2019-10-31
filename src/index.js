import * as Phaser from "phaser";
import { Floresta } from "./scenes";
class MyGame extends Phaser.Game{
    constructor(){
        //Passa para o super a game config como parametro!
        super({
            type: Phaser.AUTO,
            parent: "game",
            width: 800,
            height: 600,
            //Você pode adicionar mais telas ao seu jogo aqui!
            scene: [
                Floresta,
            ]
        })
    }
}
//Inicializa o jogo.
new MyGame();