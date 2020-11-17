class MyPlane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.initSurface();
    }

    initSurface() {
        this.makeSurface(1, // degree on U: 2 control vertexes U
        1, // degree on V: 2 control vertexes on V
        [	// U = 0
            [ // V = 0..1;
                [-0.5, 0.0, 0.5, 1 ],
                [-0.5,  0.0, -0.5, 1 ]
                
            ],
            // U = 1
            [ // V = 0..1
                [ 0.5, 0.0, 0.5, 1 ],
                [ 0.5,  0.0, -0.5, 1 ]		 
            ]
        ]);
    }

    makeSurface(degree1, degree2, controlvertexes) {
		this.nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

        // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface);
    }
    
    display() {
        this.scene.pushMatrix();
        this.obj.display();
        this.scene.popMatrix();
    }

    /**
     * Updates the list of texture coordinates
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */

    updateTexCoords(afs, aft) {
        // Do Nothing
    }
}