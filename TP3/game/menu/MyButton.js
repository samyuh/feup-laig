class MyButton {
    constructor(scene, gameOrchestrator, prototype, text, spriteSheet) {
        this.scene = scene; 
        this.gameOrchestrator = gameOrchestrator;
        this.prototype = prototype;

        this.button = new MyCube(scene);
        this.text = new MySpriteText(this.scene, text, spriteSheet);
    }

    apply() {
        this.prototype.call(this.gameOrchestrator);
    }

    display() {
        this.scene.pushMatrix();
        this.button.display();

        this.scene.scale(0.2, 0.2, 0.2);
        this.scene.translate(0, 5, 2);
        this.text.display();
        this.scene.popMatrix();
    }
}