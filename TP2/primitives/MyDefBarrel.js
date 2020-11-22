/**
 * MyDefBarrel
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} base - the radius of the bases of the DefBarrel
 * @param {integer} middle - the radius of the middle part of the DefBarrel
 * @param {integer} height - the height of the DefBarrel
 * @param {integer} slices - the number of slices of the DefBarrel
 * @param {integer} stacks - the number of stacks of the DefBarrel
 */
class MyDefBarrel extends CGFobject {
	constructor(scene, base, middle, height, slices, stacks) {
        super(scene);
        
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.surfaces = [];

        this.initSurfaces();
    }
    
    /**
     * Initialize the parameters (degrees and control vertexes) that make the DefBarrel surface
     */
    initSurfaces() {
        let L = this.height;
        
        let r = this.base;
        let h = 4/3 * this.base;

        let H = 4/3 * (this.middle - this.base);
        
        let tanA = Math.tan(30 * Math.PI / 180);

        this.makeSurface(3, // degree on U: 4 control vertexes U
        3, // degree on V: 4 control vertexes on V
        [	// U = 0
          [   // V = 0
            [r,        0,      0,          1],
            [r + H,    0,      H/tanA,     1],
            [r + H,    0,      L - H/tanA, 1],
            [r,        0,      L,          1]
          ],
          // U = 1 
          [ // V = 1
              [r,        h,                0,          1],
              [r + H,    (4/3) * (r + H),  H/tanA, 1],
              [r + H,    (4/3) * (r + H),  L - H/tanA,     1],
              [r,        h,                L,          1]
          ],
          // U = 2 
          [ // V = 2
            [-r,         h,                0,              1],
            [-r - H,     (4/3) * (r + H),  H/tanA, 1],
            [-r - H,     (4/3) * (r + H),  L - H/tanA,     1],
            [-r,         h,                L,          1]
          ],

          // U = 3 
          [  // V = 3
            [-r,        0,      0,          1],
            [-r - H,    0,      H/tanA, 1],
            [-r - H,    0,      L -H/tanA,     1],
            [-r,        0,      L,          1]
          ]
        ]);
        
        this.makeSurface(3, // degree on U: 4 control vertexes U
          3, // degree on V: 4 control vertexes on V
          [	// U = 0
            [   // V = 0
              [-r,        0,      0,          1],
              [-r - H,    0,      H/tanA,     1],
              [-r - H,    0,      L - H/tanA, 1],
              [-r,        0,      L,          1]
            ],
            // U = 1 
            [ // V = 1
                [-r,        -h,                0,          1],
                [-r - H,    -(4/3) * (r + H),  H/tanA, 1],
                [-r - H,    -(4/3) * (r + H),  L - H/tanA,     1],
                [-r,        -h,                L,          1]
            ],
            // U = 2 
            [ // V = 2
              [r,         -h,                         0, 1],
              [r + H,     -(4/3) * (r + H),  H/tanA, 1],
              [r + H,     -(4/3) * (r + H),  L - H/tanA,     1],
              [r,         -h,        L,          1]
            ],
  
            // U = 3 
            [  // V = 3
              [r,        0,      0,          1],
              [r + H,    0,      H/tanA, 1],
              [r + H,    0,      L -H/tanA,     1],
              [r,        0,      L,          1]
            ]
          ]);
    }

    /**
     * Creates the DefBarrel surface based on the parameters received
     * @param {integer} degree1 - Degree on U
     * @param {integer} degree2 - Degree on V
     * @param {Array} controlvertexes - Control Vertexes that form the DefBarrel surface
     */
    makeSurface(degree1, degree2, controlvertexes) {
		    let nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

        let obj = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);

        this.surfaces.push(obj);
    }
    
  /**
   * Display the nurbs object created which makes the DefBarrel
   */
	display() {
        for (let i = 0 ; i < this.surfaces.length ; i++) {
            this.surfaces[i].display();
        }
	}

  /**
   * Updates the list of texture coordinates - Not used on MyDefBarrel
   * @param {integer} afs - dx/afs
   * @param {integer} aft - dy/aft
   */
	updateTexCoords(afs, aft) {
		// Do nothing
	}
}