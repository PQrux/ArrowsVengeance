import Tile from "./Tile";
import SimplexNoise from "simplex-noise";
const simplex = new SimplexNoise();
export default class Chunk {
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scene, x, y, mostNoise, fewNoise) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.mostNoise = mostNoise;
        this.fewNoise = fewNoise;
        this.tiles = this.scene.add.group();
        this.isLoaded = false;
    }
    unload() {
        if (this.isLoaded) {
            this.tiles.clear(true, true);
            this.isLoaded = false;
        }
    }
    determineKey(perlinValue){
        if (perlinValue < 0.7) {
            return this.mostNoise;
        }
        else if (perlinValue >= 0.7) {
            return this.fewNoise;
        }
        else{
            return "";
        }
        
    }
    load() {
        if (!this.isLoaded) {
            for (let x = 0; x < this.scene.chunkSize; x++) {
                for (let y = 0; y < this.scene.chunkSize; y++) {
                    let tileX = (this.x * (this.scene.chunkSize * this.scene.tileSize)) + (x * this.scene.tileSize);
                    let tileY = (this.y * (this.scene.chunkSize * this.scene.tileSize)) + (y * this.scene.tileSize);
                    let perlinValue = simplex.noise2D(tileX / 300, tileY / 300);
                    let key = this.determineKey(perlinValue);
                    let tile = new Tile(this.scene, tileX, tileY, key);
                    this.tiles.add(tile);
                }
            }
            this.isLoaded = true;
        }
    }
    
}