/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by default)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    
    /**
     * Init Interface Cameras
     */
    initInterfaceCameras() {
        this.cameras = this.gui.addFolder('Cameras');

        this.cameras.add(this.scene, 'selectedView', this.scene.viewIDs).name('Camera View').onChange(
            () => {
                this.scene.camera = this.scene.graph.cameras[this.scene.selectedView];

                this.setActiveCamera(this.scene.camera);
            }
        );
    }
     
    /**
     * Init Interface Lights
     */
    initInterfaceLights() {
        this.lights = this.gui.addFolder('Lights');

        for (const light of this.scene.lights) {
            if (light.light_id != undefined) {
                this.lights.add(light, 'enabled').name(light.light_id).onChange(
                    () => {
                        light.update();
                    }
                );
            }
        }
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}