export default class Sprite{
    /**
     * @param {string} nome Nome do Sprite.
     * @param {string} arquivo Arquivo do Sprite.
     * @param {number} width Largura do frame.
     * @param {number} height Altura do frame.
     * @param {number} startFrame Frame inicial da animação de caminhada.
     * @param {number} endFrame Frame final da animação de caminhada.
     * @param {number} frameRate Quantidade de frames por segundo.
     * @param {number} repeat Define se deve repetir ou não.
     */
    constructor(nome, arquivo, width, height, startFrame, endFrame, frameRate, repeat){
        this.nome = nome;
        this.arquivo = arquivo;
        this.width = width;
        this.height = height;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.frameRate = frameRate;
        this.repeat = repeat === false ? 0 : -1;
    }
}