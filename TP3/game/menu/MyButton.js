class MyButton {
    constructor(gameOrchestrator, scene, texture, prototype, selected, radioType, ...args) {
        this.gameOrchestrator = gameOrchestrator;
        this.scene = scene; 
        
        this.prototype = prototype;
        this.radioType = radioType;

        this.button = new MyCube(scene);
        this.rectangle = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.selected = selected;

        this.material = new CGFappearance(scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material.setDiffuse(0.6, 0.6, 0.6, 1.0);
        this.material.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.material.setShininess(5.0);
        this.material.setTexture(texture);

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
        
        if(this.selected)
            this.scene.translate(0, 0, -0.5);
        
        this.button.display();
        this.material.apply();
        this.scene.translate(0, 0, 0.6);
        this.rectangle.display();
        this.scene.popMatrix();
    }
}