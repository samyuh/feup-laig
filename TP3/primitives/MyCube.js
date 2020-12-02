/**
 * MyCube
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
class MyCube {
	constructor(scene) {
        this.scene = scene;
        this.frontface = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.backface = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.leftface = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.rightface = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.topface = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.bottomface = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
    }

    /**
   *    Display the cube faces
   */
    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.frontface.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.backface.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.leftface.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.rightface.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.topface.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.bottomface.display();
        this.scene.popMatrix();
    }

    /**
   * Updates the list of texture coordinates - Not used on MyCube
   * @param {integer} afs - dx/afs
   * @param {integer} aft - dy/aft
   */
    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}