class MyButton {
    constructor(scene, gameOrchestrator, prototype, text, spriteSheet, ...args) {
        this.scene = scene; 
        this.gameOrchestrator = gameOrchestrator;
        this.prototype = prototype;

        this.button = new MyCube(scene);
        this.text = new MySpriteText(this.scene, text, spriteSheet);

        this.args = [];
        this.args.push(...args);
    }

    apply() {
        this.prototype.call(this.gameOrchestrator, ...this.args);
    }

    display() {
        this.scene.pushMatrix();
        this.button.display();

        this.scene.scale(0.2, 0.2, 0.2);
        this.scene.translate(0, 3, 2);
        this.text.display();
        this.scene.popMatrix();
    }
}