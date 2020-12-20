class MyPiece {
	constructor(scene) {
        this.scene = scene;
        this.pieces = [];
        this.x = 0;
        this.y = 1;
        this.z = 0;

        this.whiteMaterial = new CGFappearance(scene);
        this.blackMaterial = new CGFappearance(scene);
        this.whiteTexture = new CGFtexture(scene, "scenes/images/white.jpg");
        this.blackTexture = new CGFtexture(scene, "scenes/images/black.jpg");

        this.whiteMaterial.setTexture(this.whiteTexture);
        this.blackMaterial.setTexture(this.blackTexture);

        this.initPieces();
    }

    initPieces() {
        this.pieces.push(new MyCube(this.scene));
        this.pieces.push(new MyCube(this.scene));
    }

    updatePosition(x, z, xb, zb) {
        this.x = x;
        this.z = z;
       
        this.xb = xb;
        this.zb = zb;
    }

    display() {
        this.scene.pushMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.x-3, this.y, this.z);
        this.whiteMaterial.apply();
        this.pieces[0].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.xb-3, this.y, this.zb);
        this.blackMaterial.apply();
        this.pieces[1].display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}