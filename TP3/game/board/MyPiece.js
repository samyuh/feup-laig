/**
 * MyPiece
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {String} color - color of the main part of the piece
 * @param {CGFtexture} whiteTexture - the texture of the white part of the piece
 * @param {CGFtexture} blackTexture - the texture of the black part of the piece
 */
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

    /**
     * Updates the position of the piece
     * @param {Integer} x - the coordinate x of the main part of the piece
     * @param {Integer} z - the coordinate z of the main part of the piece
     * @param {Integer} xb - the coordinate x of the other part of the piece
     * @param {Integer} zb - the coordinate z of the other part of the piece
     */
    updatePosition(x, z, xb, zb) {
        this.x = x;
        this.z = z;
       
        this.xb = xb;
        this.zb = zb;
    }

    /**
     * Display function, called periodically, which calls the display function of both parts of the piece
     */
    display() {
        this.scene.pushMatrix();
        this.scene.scale(1, 0.6, 1);
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

    /**
     * Updates the list of texture coordinates - Not used on MyPiece
     * @param {Integer} afs - dx/afs
     * @param {Integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}