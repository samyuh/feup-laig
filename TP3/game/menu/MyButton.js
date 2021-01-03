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

        this.selectedMaterial = new CGFappearance(scene);
        this.selectedMaterial.setAmbient(0.2, 0.8, 0.2, 1.0);
        this.selectedMaterial.setDiffuse(0.2, 0.8, 0.2, 1.0);
        this.selectedMaterial.setSpecular(0.2, 0.8, 0.2, 1.0);
        this.selectedMaterial.setShininess(5.0);

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
        
        if(this.selected) {
            this.scene.translate(0, 0, -0.6);
            this.selectedMaterial.apply();
        }
        this.button.display();
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.depthMask(false);

        this.material.apply();
        
        this.scene.translate(0, 0, 0.6);
        this.rectangle.display();

        // Remove transparency properties
        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.popMatrix();
    }
}