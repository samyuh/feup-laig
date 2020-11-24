/**
 * MyPlane
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} npartsU - the number of divisions in the U direction
 * @param {integer} npartsV - the number of divisions in the V direction
 */
class MyPlane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.initSurface();
    }

    /**
     * Initialize the parameters (degrees and control vertexes) that make the Plane surface
     */
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

    /**
     * Creates the Plane surface based on the parameters received
     * @param {integer} degree1 - Degree on U
     * @param {integer} degree2 - Degree on V
     * @param {Array} controlvertexes - Control Vertexes that form the Plane surface
     */
    makeSurface(degree1, degree2, controlvertexes) {
		this.nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

        // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface);
    }
    
    /**
     * Display the nurbs object created which makes the Plane
     */
    display() {
        this.obj.display();
    }

    /**
     * Updates the list of texture coordinates - Not used on MyPlane
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {
        // Do Nothing
    }
}