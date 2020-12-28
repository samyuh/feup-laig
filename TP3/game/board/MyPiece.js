class MyPiece {
	constructor(scene, color, whiteTexture, blackTexture) {
        this.scene = scene;
        this.pieces = [];
        this.y = 1;

        this.x = 0;
        this.z = 1;
        this.xb = 0;
        this.zb = 0;
        
        this.color = color;

        this.pieceMaterial = new CGFappearance(scene);
        this.whiteTexture = whiteTexture;
        this.blackTexture = blackTexture;

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

        if(this.color == 'white') {
            this.scene.pushMatrix();
            this.scene.translate(this.x, this.y, this.z);
            this.pieceMaterial.setTexture(this.whiteTexture);
            this.pieceMaterial.apply();
            this.pieces[0].display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(this.xb, this.y, this.zb);
            this.pieceMaterial.setTexture(this.blackTexture);
            this.pieceMaterial.apply();
            this.pieces[1].display();
            this.scene.popMatrix();
        }
        else {
            this.scene.pushMatrix();
            this.scene.translate(this.x, this.y, this.z);
            this.pieceMaterial.setTexture(this.blackTexture);
            this.pieceMaterial.apply();
            this.pieces[0].display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(this.xb, this.y, this.zb);
            this.pieceMaterial.setTexture(this.whiteTexture);
            this.pieceMaterial.apply();
            this.pieces[1].display();
            this.scene.popMatrix();
        }
        
        this.scene.popMatrix();
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}