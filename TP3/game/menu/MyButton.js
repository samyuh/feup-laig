class MyButton {
    constructor(scene, gameOrchestrator, prototype, radioType, text, spriteSheet, ...args) {
        this.scene = scene; 
        this.gameOrchestrator = gameOrchestrator;
        this.prototype = prototype;
        this.radioType = radioType;

        this.button = new MyCube(scene);
        this.selected = false;
        this.text = new MySpriteText(this.scene, text, spriteSheet);

        this.args = [];
        this.args.push(...args);
    }

    unselect() {
        this.selected = false;
    }

    apply() {
        this.prototype.call(this.gameOrchestrator, ...this.args);
        this.selected = true;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.pushMatrix();
        if(this.selected)
            this.scene.translate(0, 0, -0.5);
        this.button.display();
        this.scene.popMatrix();

        this.scene.scale(0.2, 0.2, 0.2);
        this.scene.translate(0, 3, 2);
        //this.text.display();
        this.scene.popMatrix();
    }
}