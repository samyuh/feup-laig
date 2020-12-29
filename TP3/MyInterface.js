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

    /**
     * Init Interface Music
     */
    initMiscellaneous() {
        this.misc = this.gui.addFolder('Miscellaneous');
        this.misc.add(this.scene, 'musicActive').name('Music').onChange(this.scene.updateMusic.bind(this.scene));
    }

    /**
     * Init Interface Themes
     */
    initInterfaceThemes() {
        this.themes = this.gui.addFolder('Themes');

        this.themes.add(this.scene, 'selectedTheme', this.scene.textureIds).name('Selected SkyBox Texture').onChange(this.scene.updateSkyBoxTextures.bind(this.scene));
    }

    /**
     * Init Game Interface
     */
    initGameInterface() {
        this.gameInterface = this.gui.addFolder('Game');

        this.gameInterface.add(this.scene.gameOrchestrator, 'reset').name('Reset');
        this.gameInterface.add(this.scene.gameOrchestrator, 'movie').name('Movie');
        this.gameInterface.add(this.scene.gameOrchestrator, 'undo').name('Undo');
        this.gameInterface.add(this.scene.gameOrchestrator, 'boardSize', {'Small': '7', 'Medium': '9', 'Large': '11'}).name('Board Size');
        this.gameInterface.add(this.scene.gameOrchestrator, 'player2', { 'Player': '1', 'Random Bot': '2', 'Intelligent Bot': '3' }).name("Player 2");
        this.gameInterface.add(this.scene.gameOrchestrator, 'player1', { 'Player': '1', 'Random Bot': '2', 'Intelligent Bot': '3' }).name("Player 1");
        this.gameInterface.add(this.scene.gameOrchestrator, 'player2', { 'Player': '1', 'Random Bot': '2', 'Intelligent Bot': '3' }).name("Player 2");

        this.gameInterface.add(this.scene.gameOrchestrator, 'initGame').name('Init Game');

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