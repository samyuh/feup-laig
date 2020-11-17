class MyDefBarrel extends CGFobject {
	constructor(scene, base, middle, height, slices, stacks) {
        super(scene);
        
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
    }
	
	display() {
        
	}

	 /**
     * Updates the list of texture coordinates
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
	updateTexCoords(afs, aft) {
		// Do nothing
	}
}