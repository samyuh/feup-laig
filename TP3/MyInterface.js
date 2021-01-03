/**
* MyInterface class, creating a GUI interface.
* @constructor
*/
class MyInterface extends CGFinterface {
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
        this.gui.close();

        // add a group of controls (and open/expand by default)
        this.initKeys();

        return true;
    }

    /**
     * Keyboard Initialization
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

        this.camItem = this.cameras.add(this.scene, 'selectedView', this.scene.graph[this.scene.selectedTheme].viewIDs).name('Camera View').onChange(
            this.scene.updateInterfaceCameras.bind(this.scene)
        );
    }

    /**
     * Update Interface Cameras
     */
    updateCameras() {
        this.cameras.remove(this.camItem);

        this.camItem = this.cameras.add(this.scene, 'selectedView', this.scene.graph[this.scene.selectedTheme].viewIDs).name('Camera View').onChange(
            this.scene.updateInterfaceCameras.bind(this.scene)
        );
    }
     
    /**
     * Init Interface Lights
     */
    initInterfaceLights() {
        this.lights = this.gui.addFolder('Lights');
        this.lightsItems = [];

        for (const light of this.scene.lights) {
            if (light.light_id != undefined) {
                this.lightsItems.push(this.lights.add(light, 'enabled').name(light.light_id).onChange(
                    () => {
                        light.update();
                    }
                ));
            }
        }
    }

    updateLights() {
        for (const light of this.lightsItems) {
            this.lights.remove(light);
        }

        this.lightsItems = [];
        console.log(this.lightsItems);
        console.log(this.scene.lights);
        for (const light of this.scene.lights) {
            if (light.light_id != undefined) {
                this.lightsItems.push(this.lights.add(light, 'enabled').name(light.light_id).onChange(
                    () => {
                        light.update();
                    }
                ));
            }
        }
    }

    /**
     * Init Interface Music
     */
    initMiscellaneous() {
        this.misc = this.gui.addFolder('Miscellaneous');
        this.misc.add(this.scene, 'musicActive').name('Sound').onChange(this.scene.updateMusic.bind(this.scene));
    }

    /**
     * Init Interface Themes
     */
    initInterfaceThemes() {
        this.themes = this.gui.addFolder('Themes');

        this.themes.add(this.scene, 'selectedTheme', this.scene.textureIds).name('Selected SkyBox Texture').onChange(this.scene.updateThemes.bind(this.scene));
    }

    /**
     * Init Game Interface
     */
    initGameInterface() {
        this.gameInterface = this.gui.addFolder('Game');

        this.gameInterface.add(this.scene.gameOrchestrator, 'reset').name('Reset / New Game');
        this.gameInterface.add(this.scene.gameOrchestrator, 'movie').name('Movie');
        this.gameInterface.add(this.scene.gameOrchestrator, 'undo').name('Undo');
        this.gameInterface.add(this.scene.gameOrchestrator, 'timeout', 10, 120).name('TimeOut');
        this.gameInterface.add(this.scene.gameOrchestrator, 'boardSize', {'Small': '7', 'Medium': '9', 'Large': '11'}).name('Board Size');
        this.gameInterface.add(this.scene.gameOrchestrator, 'player1', { 'Player': '1', 'Random Bot': '2', 'Intelligent Bot': '3' }).name("White Player");
        this.gameInterface.add(this.scene.gameOrchestrator, 'player2', { 'Player': '1', 'Random Bot': '2', 'Intelligent Bot': '3' }).name("Black Player");

        this.gameInterface.open();
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