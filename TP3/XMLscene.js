/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myInterface 
     */
    constructor(myInterface) {
        super();

        this.interface = myInterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.defaultAppearance = new CGFappearance(this);

        // -- Loading -- //
        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress = 0;

        // -- Music -- //
        this.musicActive = false;
        this.audio = new Audio('scenes/music/music.mp3');
        this.audio.volume = 0.3;

        // -- Theme -- //
        this.textureIds = {
            'Mountains': 0,
            'Japan': 1,
        };
        this.numberLoadedThemes = 0;
        this.numberThemes = 2;
        this.selectedTheme = 1;
        
        // -- Camera -- //
        this.selectedView = 0;
        this.animationCamera = null;

        // -- Game Orchestrator -- //
        this.gameOrchestrator = new MyGameOrchestrator(this);
        this.setPickEnabled(true);
    }

    initScene() {
        this.graph = [];
        let theme1 = new MySceneGraph("mountains.xml", this);
        let theme2 = new MySceneGraph("japan.xml", this);
    }

    /**
     * Method for activate and deactivate music through interface
     */
    updateMusic() {
        if (this.musicActive) {
            this.audio.loop = true;
            this.audio.play();
        } else {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    updateCamera(cameraId) {
        this.animationCamera = new MyCameraAnimation(this, this.camera, this.graph[this.selectedTheme].cameras[cameraId]);

        this.camera = this.graph[this.selectedTheme].cameras[cameraId];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Method for updating themes on a change made by the user
     */
    updateThemes() {    
        this.gameOrchestrator.initGraph(this.graph[this.selectedTheme]);

        this.axis = new CGFaxis(this, this.graph[this.selectedTheme].referenceLength);
        this.gl.clearColor(...this.graph[this.selectedTheme].background);
        this.setGlobalAmbientLight(...this.graph[this.selectedTheme].ambient);
        this.initXMLCameras();
        this.setUpdatePeriod(100);
        this.gameOrchestrator.initGraph(this.graph[this.selectedTheme]);

        this.interface.updateCameras();
        
        this.turnOffLights();
        this.deleteLights();
        this.initXMLLights();
        this.interface.updateLights();

        if(this.gameOrchestrator.lastCamera != null) {
            this.updateCamera(this.gameOrchestrator.lastCamera);
        }
    }

    updateInterfaceCameras() {
        this.animationCamera = new MyCameraAnimation(this, this.camera, this.graph[this.selectedTheme].cameras[this.selectedView]);

        this.camera = this.graph[this.selectedTheme].cameras[this.selectedView];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene Cameras with the values read from the XML file.
     */
    initXMLCameras() {
        this.camera = this.graph[this.selectedTheme].cameras[this.graph[this.selectedTheme].selectedView];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initXMLLights() {
        // Lights index.
        let i = 0;
        // Reads the lights from the scene graph.
        for (let key in this.graph[this.selectedTheme].lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph[this.selectedTheme].lights.hasOwnProperty(key)) {
                var graphLight = this.graph[this.selectedTheme].lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);
                this.lights[i].light_id = key;

                this.lights[i].setVisible(true);
                
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();
                
                this.lights[i].update();

                i++;
            }
        }
    }

    deleteLights() {
        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].light_id = undefined;
            this.lights[i].disable();
        }
    }

    turnOffLights() {
        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update();
            if (this.lights[i].light_id != undefined)
                this.lights[i].setVisible(false);
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        if(this.numberLoadedThemes == (this.numberThemes - 1)) {
            this.axis = new CGFaxis(this, this.graph[this.selectedTheme].referenceLength);
            this.gl.clearColor(...this.graph[this.selectedTheme].background);
            this.setGlobalAmbientLight(...this.graph[this.selectedTheme].ambient);
            this.initXMLLights();
            this.initXMLCameras();
            this.setUpdatePeriod(100);
            this.gameOrchestrator.initGraph(this.graph[this.selectedTheme]);
            
            // ---- CHANGE THIS ---- //
            this.interface.initInterfaceCameras();
            this.interface.initInterfaceLights();
            this.interface.initMiscellaneous();
            this.interface.initInterfaceThemes();
            this.interface.initGameInterface();
            // ---- CHANGE THIS ---- //

            this.sceneInited = true;
        } else {
            this.numberLoadedThemes++;
        }
    }
    /**
     * Method called periodically (as per setUpdatePeriod() in init())
     * @param {integer} t 
     */
    update(t) {
        // -- Time Parser -- //
        let elapsedTime;

        if(this.time == null) 
            elapsedTime = 0;
        else 
            elapsedTime = t - this.time;

        this.time = t;
        // -- Time Parser -- //

        // -- Camera Animation -- //
        if (this.animationCamera != null)
            this.animationCamera.update(elapsedTime / 1000);
        // -- Camera Animation -- //

        // -- Scene Graph Animations -- //
        for (let k in this.graph[this.selectedTheme].shadersAnim)
            this.graph[this.selectedTheme].shadersAnim[k].update(t);

        for (let k in this.graph[this.selectedTheme].keyframesAnimation)
            this.graph[this.selectedTheme].keyframesAnimation[k].update(elapsedTime / 1000);

        for (let k in this.graph[this.selectedTheme].spritesAnim)
            this.graph[this.selectedTheme].spritesAnim[k].update(elapsedTime / 1000);
        // -- Scene Graph Animations -- //

        // -- Game Orchestrator Animations -- //
        this.gameOrchestrator.update(elapsedTime / 1000);
        // -- Game Orchestrator Animations -- //
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Camera animation if any
        if (this.animationCamera != null)
            this.animationCamera.apply();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update();
            if (this.lights[i].light_id != undefined)
                this.lights[i].setVisible(true);
        }

        if (this.sceneInited && this.gameOrchestrator.allLoaded) {
            // Draw axis
            this.axis.display();
            this.defaultAppearance.apply();
            // Displays the scene
            this.gameOrchestrator.display();
        }
        else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}