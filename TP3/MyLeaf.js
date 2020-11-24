/**
 * Myleaf class, saving the leafs of nodes
 * @constructor
 * @param {CGFobject} primitive - Reference to CGFobject
 * @param {integer} afs - Texture afs value
 * @param {integer} aft - Texture aft value
 */
class MyLeaf {
	constructor(primitive, afs, aft) {
        this.primitive = primitive;

        this.afs = afs;
        this.aft = aft;
    }

    /**
     * Display the primitive
     */
    display() {
        this.primitive.display();
    }

    /**
     * Update Texture Coordinates of the primitive
     */
    updateTexCoords() {
        this.primitive.updateTexCoords(this.afs, this.aft) ;
    }
}