class MyPiece {
	constructor(scene) {
        this.scene = scene;
        this.pieces = [];
        this.x = 0;
        this.y = 2;
        this.z = 0;

        this.initPieces();
    }

    initPieces() {
        this.pieces.push(new MyCube(this.scene));
        this.pieces.push(new MyCube(this.scene));
    }

    updatePosition(x, z) {
        this.x = x;
        this.z = z;
    }

    display() {
        
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        
        //this.scene.registerForPick(100, this.pieces[0]);
        this.pieces[0].display();
        //this.scene.translate(1, 0, 0);
        //this.scene.registerForPick(101, this.pieces[1]);
        //this.pieces[1].display();

        

        /*
        for (let i = 0; i < 2; i++) {
            this.pieces[i].display();
        }
        */
        
        this.scene.popMatrix();
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}