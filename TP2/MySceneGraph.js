const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITE_SHEET_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();

        this.scene.interface.initInterfaceCameras();
        this.scene.interface.initInterfaceLights();
        this.scene.interface.initMiscellaneous();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    // ---------------- Parse XML --------------- //

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITE_SHEET_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse spritesheets block
            if ((error = this.parseSpriteSheets(nodes[index])) != null)
                return error;
        }
        

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            this.onXMLMinorError("tag <animations> missing");
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if ((index != NODES_INDEX) && (index != (NODES_INDEX + 1)))
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene - tag <root> missing from <initials> tag.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene - 'id' atribute missing from tag <root>, in <initials> tag.";

        this.idRoot = id;

        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene - tag <reference> missing from <initials> tag; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene - 'length' atribute missing from tag <reference>, in <initials> tag; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.cameras = [];

        this.scene.viewIDs = [];

        let default_cam_error = true;

        let children = viewsNode.children;

        var default_view = this.reader.getString(viewsNode, 'default');

        if (default_view == null)
            return "No default View defined for scene - atribute 'default' missing from tag <views>";

        this.scene.selectedView = default_view;

        if (children.length === 0)
            return "No views declared in <views>";

        for (var i = 0; i < children.length; i++) {
            var camera = {};
            var nodeType = children[i].nodeName; // Either perspective or ortho

            if (nodeType == null) {
                this.onXMLMinorError("Camera with no type in <views>");
                continue; // Ignore camera with no type
            }

            var id = this.reader.getString(children[i], 'id');
            if (id == null) {
                this.onXMLMinorError("Camera with no 'id' atribute in <views>. Ignoring camera...");
                continue;
            }

            if (id == default_view) 
                default_cam_error = false;
            
            this.scene.viewIDs.push(id);

            // Process common atributes between perspective and ortho cameras (near and far)
            var near = this.reader.getFloat(children[i], 'near');
            if (near == null) {
                this.onXMLMinorError("Camera with no 'near' atribute in <views>. Using near = 0.1");
                near = 0.1;
            }

            var far = this.reader.getFloat(children[i], 'far');
            if (far == null) {
                this.onXMLMinorError("Camera with no 'far' atribute in <views>. Using far = 500");
                far = 500;
            }

            camera.near = near;
            camera.far = far;

            // Process different atributes between perspective and ortho cameras (perspective - angle ; ortho - left, right, top, bottom)
            if (nodeType === "perspective") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (angle == null) {
                    this.onXMLMinorError("Perspective Camera with no 'angle' atribute in <views>. Using angle = 45");
                    angle = 45;
                }

                camera.angle = angle;
            } else if (nodeType === "ortho") {
                var left = this.reader.getFloat(children[i], 'left');
                if (left == null) {
                    this.onXMLMinorError("Ortho Camera with no 'left' atribute in <views>. Using left = -0.2");
                    left = -0.2;
                }

                var right = this.reader.getFloat(children[i], 'right');
                if (right == null) {
                    this.onXMLMinorError("Ortho Camera with no 'right' atribute in <views>. Using right = 0.2");
                    right = 0.2;
                }

                var top = this.reader.getFloat(children[i], 'top');
                if (top == null) {
                    this.onXMLMinorError("Ortho Camera with no 'top' atribute in <views>. Using top = 0.2");
                    top = 0.2;
                }

                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (bottom == null) {
                    this.onXMLMinorError("Ortho Camera with no 'bottom' atribute in <views>. Using bottom = -0.2");
                    bottom = -0.2;
                }

                camera.left = left;
                camera.right = right;
                camera.top = top;
                camera.bottom = bottom;
            } else {
                this.onXMLMinorError("Not Perspective/Ortho camera found in <views>. Ignoring Camera...");
                continue;
            }

            // Process "from" and "to" points of cameras
            var grandChildren = children[i].children;
            var nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);

            var fromIndex = nodeNames.indexOf("from");
            var toIndex = nodeNames.indexOf("to");

            camera.from = {};
            camera.to = {};
            var x, y, z;

            if (fromIndex == -1) {
                this.onXMLMinorError("Camera " + id + " is missing the 'from' attribute. Using FROM: x = 0, y = 15, z = 60");
                camera.from.x = 0;
                camera.from.y = 15;
                camera.from.z = 60;
            }
            if (toIndex == -1) {
                this.onXMLMinorError("Camera " + id + " is missing the 'to' attribute. Using TO: x = 0, y = 10, z = 0");
                camera.to.x = 0;
                camera.to.y = 10;
                camera.to.z = 0;
            }

            if (fromIndex != -1) {
                x = this.reader.getFloat(grandChildren[fromIndex], 'x');
                if (x == null) {
                    this.onXMLMinorError("Camera with no 'x' value of 'from' atribute in <views>. Using x = 0");
                    x = 0;
                }

                y = this.reader.getFloat(grandChildren[fromIndex], 'y');
                if (y == null) {
                    this.onXMLMinorError("Camera with no 'y' value of 'from' atribute in <views>. Using y = 15");
                    y = 15;
                }

                z = this.reader.getFloat(grandChildren[fromIndex], 'z');
                if (z == null) {
                    this.onXMLMinorError("Camera with no 'z' value of 'from' atribute in <views>. Using z = 60");
                    z = 60;
                }

                camera.from.x = x;
                camera.from.y = y;
                camera.from.z = z;
            }

            if (toIndex != -1) {
                x = this.reader.getFloat(grandChildren[toIndex], 'x');
                if (x == null) {
                    this.onXMLMinorError("Camera with no 'x' value of 'to' atribute in <views>. Using x = 0");
                    x = 0;
                }

                y = this.reader.getFloat(grandChildren[toIndex], 'y');
                if (y == null) {
                    this.onXMLMinorError("Camera with no 'y' value of 'to' atribute in <views>. Using y = 10");
                    y = 10;
                }

                z = this.reader.getFloat(grandChildren[toIndex], 'z');
                if (z == null) {
                    this.onXMLMinorError("Camera with no 'z' value of 'to' atribute in <views>. Using z = 0");
                    z = 0;
                }

                camera.to.x = x;
                camera.to.y = y;
                camera.to.z = z;
            }

            // Process "up" point of ortho cameras
            if (nodeType === "ortho") {
                camera.up = {};
                var upIndex = nodeNames.indexOf("up");
                if (upIndex == -1) { // 'up' atribute is optional: if not defined, using up = (0,1,0)
                    camera.up.x = 0;
                    camera.up.y = 1;
                    camera.up.z = 0;
                } else {
                    x = this.reader.getFloat(grandChildren[upIndex], 'x');
                    if (x == null)
                        x = 0; // if not defined, using x = 0

                    y = this.reader.getFloat(grandChildren[upIndex], 'y');
                    if (y == null)
                        y = 1; // if not defined, using y = 1

                    z = this.reader.getFloat(grandChildren[upIndex], 'z');
                    if (z == null) {
                        z = 0; // if not defined, using z = 0
                    }
                    camera.up.x = x;
                    camera.up.y = y;
                    camera.up.z = z;
                }
            }

            // Obtained all data, adding camera to the scene cameras
            if (nodeType === "perspective") {
                this.cameras[id] = new CGFcamera(camera.angle * Math.PI / 180.0, camera.near, camera.far, vec3.fromValues(camera.from.x, camera.from.y, camera.from.z), vec3.fromValues(camera.to.x, camera.to.y, camera.to.z));
            } else if (nodeType === "ortho") {
                this.cameras[id] = new CGFcameraOrtho(camera.left, camera.right, camera.bottom, camera.top, camera.near, camera.far, vec3.fromValues(camera.from.x, camera.from.y, camera.from.z), vec3.fromValues(camera.to.x, camera.to.y, camera.to.z), vec3.fromValues(camera.up.x, camera.up.y, camera.up.z));
            }
        }

        if (default_cam_error)
            return "Default View defined for scene have an invalid ID";

        this.log("Parsed Views.");

        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = [];

        if (ambientIndex == -1) {
            this.onXMLMinorError("Missing tag <ambient> from <illumination> tag");
            color.push(...[0.2, 0.2, 0.2, 1.0]);
            this.ambient = color;
        }

        if (backgroundIndex == -1) {
            this.onXMLMinorError("Missing tag <background> from <illumination> tag");
            color.push(...[0.1, 0.1, 0.1, 1.0]);
            this.background = color;
        }

        if (ambientIndex != -1) {
            color = this.parseColor(children[ambientIndex], "ambient");
            if (!Array.isArray(color))
                return color;
            else
                this.ambient = color;
        }

        if (backgroundIndex != -1) {
            color = this.parseColor(children[backgroundIndex], "background");
            if (!Array.isArray(color))
                return color;
            else
                this.background = color;
        }

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                } else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        //For each texture in textures block, check ID and file URL
        this.textures = {};

        var children = texturesNode.children;

        for (var i = 0; i < children.length; i++) {
            var id = this.reader.getString(children[i], 'id');

            // Check if texture has no ID
            if (id == null) {
                this.onXMLMinorError("Texture with no ID found on <textures>. Ignoring texture...");
                continue;
            }
            // Check if texture has repeated ID
            if (this.textures[id] != null) {
                this.onXMLMinorError("Texture with repeated ID found on <textures> (" + id + "). Ignoring texture...");
                continue;
            }

            var file = this.reader.getString(children[i], 'path');

            // Check if texture has no file path
            if (file == null) {
                this.onXMLMinorError("Texture with no file path found on <textures> (" + id + "). Ignoring texture...");
                continue;
            }

            let new_texture = new CGFtexture(this.scene, file);
            this.textures[id] = new_texture;
        }

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <spritesheets> block. 
     * @param {spritesheets block element} spriteSheetsNode
     */
    parseSpriteSheets(spriteSheetsNode) {
        var children = spriteSheetsNode.children;

        this.spritesheets = [];

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "spritesheet") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">. Ignoring tag...");
                continue;
            }

            // Get id of the current spritesheet.
            let spriteID = this.reader.getString(children[i], 'id');
            if (spriteID == null) {
                this.onXMLMinorError("No ID defined for spritesheet in <spritesheets>. Ignoring spritesheet...");
                continue;
            }

            // Get the path of the current spritesheet.
            let path = this.reader.getString(children[i], 'path');
            if (path == null) {
                this.onXMLMinorError("No path defined for spritesheet with ID " + spriteID + " in <spritesheets>. Ignoring spritesheet...");
                continue;
            }

            // Get the sizeM of the current spritesheet.
            let sizeM = this.reader.getString(children[i], 'sizeM');
            if (sizeM == null) {
                this.onXMLMinorError("No sizeM defined for spritesheet with ID " + spriteID + " in <spritesheets>. Ignoring spritesheet...");
                continue;
            }

            // Get the sizeN of the current spritesheet.
            let sizeN = this.reader.getString(children[i], 'sizeN');
            if (sizeN == null) {
                this.onXMLMinorError("No sizeN defined for spritesheet with ID " + spriteID + " in <spritesheets>. Ignoring spritesheet...");
                continue;
            }

            this.spritesheets[spriteID] = new MySpriteSheet(this.scene, path, sizeM, sizeN);
        }

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];
        var grandChildren = [];
        var nodeNames = [];

        var no_materials_defined = true;

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">. Ignoring tag...");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null) {
                this.onXMLMinorError("No ID defined for material in <materials>. Ignoring material...");
                continue;
            }

            // Checks for repeated IDs.
            else if (this.materials[materialID] != null) {
                this.onXMLMinorError("ID must be unique for each material (conflict: ID = " + materialID + "). Ignoring material...");
                continue;
            }

            grandChildren = children[i].children;

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var shininessIndex = nodeNames.indexOf("shininess");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");
            var emissiveIndex = nodeNames.indexOf("emissive");

            // ----- Process "shininess" data of the material -----
            var shininess_value;

            if (shininessIndex == -1) {
                this.onXMLMinorError("<shininess> tag missing from material " + materialID + " in <materials>. Using shininess value = 1.0");
                shininess_value = 1.0;
            } else
                shininess_value = this.reader.getFloat(grandChildren[shininessIndex], 'value');

            if (shininess_value == null) {
                this.onXMLMinorError("Missing 'value' of <shininess> tag, from material " + materialID + " in <materials>. Using value = 1.0");
                shininess_value = 1.0;
            } else if (shininess_value <= 0) {
                this.onXMLMinorError("Invalid 'value' of <shininess> tag, from material " + materialID + " in <materials>. Using value = 1.0");
                shininess_value = 1.0;
            }

            // ----- Process "ambient" data of the material -----
            var ambient_values = [];

            if (ambientIndex == -1) {
                this.onXMLMinorError("<ambient> tag missing from material " + materialID + " in <materials>. Using Ambient R = 0.5, G = 0.5, B = 0.5, A = 1.0");
                ambient_values.push(...[0.5, 0.5, 0.5, 1.0]);
            } else
                ambient_values = this.parseColor(grandChildren[ambientIndex], "<ambient> tag, in material " + materialID + " in <materials>.");

            // ----- Process "diffuse" data of the material -----
            var diffuse_values = [];

            if (diffuseIndex == -1) {
                this.onXMLMinorError("<diffuse> tag missing from material " + materialID + " in <materials>. Using Diffuse R = 0.5, G = 0.5, B = 0.5, A = 1.0");
                diffuse_values.push(...[0.5, 0.5, 0.5, 1.0]);
            } else
                diffuse_values = this.parseColor(grandChildren[diffuseIndex], "<diffuse> tag, in material " + materialID + " in <materials>.");

            // ----- Process "specular" data of the material -----
            var specular_values = [];

            if (specularIndex == -1) {
                this.onXMLMinorError("<specular> tag missing from material " + materialID + " in <materials>. Using Specular R = 0.5, G = 0.5, B = 0.5, A = 1.0");
                specular_values.push(...[0.5, 0.5, 0.5, 1.0]);
            } else
                specular_values = this.parseColor(grandChildren[specularIndex], "<specular> tag, in material " + materialID + " in <materials>.");

            // ----- Process "emissive" data of the material -----
            var emissive_values = [];

            if (emissiveIndex == -1) {
                this.onXMLMinorError("<emissive> tag missing from material " + materialID + " in <materials>. Using Specular R = 0.0, G = 0.0, B = 0.0, A = 1.0");
                emissive_values.push(...[0.0, 0.0, 0.0, 1.0]);
            } else
                emissive_values = this.parseColor(grandChildren[emissiveIndex], "<emissive> tag, in material " + materialID + " in <materials>.");

            // ----- Create material and add to scene materials ----- //

            let material = new CGFappearance(this.scene);

            material.setShininess(shininess_value);
            material.setAmbient(ambient_values[0], ambient_values[1], ambient_values[2], ambient_values[3]);
            material.setDiffuse(diffuse_values[0], diffuse_values[1], diffuse_values[2], diffuse_values[3]);
            material.setSpecular(specular_values[0], specular_values[1], specular_values[2], specular_values[3]);
            material.setEmission(emissive_values[0], emissive_values[1], emissive_values[2], emissive_values[3]);

            this.materials[materialID] = material;

            no_materials_defined = false;
        }
        if (no_materials_defined) {
            return "No materials found in tag <materials>. At least one material should be present.";
        }

        this.log("Parsed materials");

        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {nodes block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children; // -- Get all elements of node
        
        this.keyframesAnimation = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("Unknown tag <" + children[i].nodeName + "> in <animations> tag. Ignoring tag...");
                continue;
            }

            let animationID = this.reader.getString(children[i], 'id');
            if (animationID == null) {
                this.onXMLMinorError("No ID defined for animation in <animations>. Ignoring node...");
                continue;
            }

            var nKeyFrameAnim = new MyKeyframeAnimation(this.scene);

            let grandChildren = children[i].children;
            for (var j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("Unknown tag <" + grandChildren[j].nodeName + "> in animation " + " animationsID " + " on <animations> tag. Ignoring tag...");
                    continue;
                }
    
                let keyframeInstant = this.reader.getFloat(grandChildren[j], 'instant');
                
                let transformations = grandChildren[j].children;

                let translation = transformations[0]; 
                let rotationX = transformations[1]; 
                let rotationY = transformations[2]; 
                let rotationZ = transformations[3]; 
                let scale = transformations[4]; 

                if (translation.nodeName != "translation") {
                    continue;
                }
                let xTranslation = this.reader.getFloat(translation, 'x');
                if (!(xTranslation != null && !isNaN(xTranslation))) {
                    this.onXMLMinorError("Missing/Invalid value for parameter 'xTranslation' in animation " + animationID + ". Using x = 0");
                    xTranslation = 0;
                }

                let yTranslation = this.reader.getFloat(translation, 'y');
                if (!(yTranslation != null && !isNaN(yTranslation))) {
                     this.onXMLMinorError("Missing/Invalid value for parameter 'yTranslation' in animation " + animationID);
                     yTranslation = 0;
                }
                
                let zTranslation = this.reader.getFloat(translation, 'z');
                if (!(zTranslation != null && !isNaN(zTranslation))) {
                     this.onXMLMinorError("Missing/Invalid value for parameter 'zTranslation' in animation " + animationID);
                     zTranslation = 0;
                }

                if (rotationX.nodeName != "rotation") {
                    continue;
                }

                let axisX = this.reader.getString(rotationX, 'axis');
                if (axisX == null || axisX != 'x') {
                     this.onXMLMinorError("Missing/Invalid value (valid = x) for parameter 'axis' in first rotation of animation " + animationID);
                }
                let angleX = this.reader.getFloat(rotationX, 'angle');
                if (!(angleX != null && !isNaN(angleX))) {
                     this.onXMLMinorError("Missing/Invalid value for parameter 'angle' in first rotation of animation " + animationID);
                     angleX = 0;
                }


                if (rotationY.nodeName != "rotation") {
                    continue;
                }
                let axisY = this.reader.getString(rotationY, 'axis');
                if (axisY == null || axisY != 'y') {
                     this.onXMLMinorError("Missing/Invalid value (valid = y) or parameter 'axis' in second rotation of animation " + animationID);
                }
                let angleY = this.reader.getFloat(rotationY, 'angle');
                if (!(angleY != null && !isNaN(angleY))) {
                     this.onXMLMinorError("Missing/Invalid value for parameter 'angle' in second rotation of animation " + animationID);
                     angleY = 0;
                }


                if (rotationZ.nodeName != "rotation") {
                    continue;
                }
                let axisZ = this.reader.getString(rotationZ, 'axis');
                if (axisZ == null || axisZ != 'z') {
                     this.onXMLMinorError("Missing/Invalid value (valid = z) for parameter 'axis' in third rotation of animation " + animationID);
                }
                let angleZ = this.reader.getFloat(rotationZ, 'angle');
                if (!(angleZ != null && !isNaN(angleZ))) {
                     this.onXMLMinorError("Missing/Invalid value for parameter 'angle' in third rotation of animation " + animationID);
                     angleZ = 0;
                }

                if (scale.nodeName != "scale") {
                    continue;
                }
                let sx = this.reader.getFloat(scale, 'sx');
                if (!(sx != null && !isNaN(sx))) {
                     this.onXMLMinorError("Missing/Invalid value for parameter 'scale' in animation " + animationID);
                     sx = 1;
                }

                let sy = this.reader.getFloat(scale, 'sy');
                if (!(sy != null && !isNaN(sy))) {
                     this.onXMLMinorError("Missing/Invalid value for parameter 'scale' in animation " + animationID);
                     sy = 1;
                }

                let sz = this.reader.getFloat(scale, 'sz');
                if (!(sz != null && !isNaN(sz))) {
                     this.onXMLMinorError("Missing/Invalid value for parameter 'scale' in animation " + animationID);
                     sz = 1;
                }
                
                let newKeyFrame = new MyKeyframe(keyframeInstant, [xTranslation, yTranslation, zTranslation], [angleX, angleY, angleZ], [sx, sy, sz]);
                nKeyFrameAnim.addKeyframe(newKeyFrame);
            }
            nKeyFrameAnim.updateTimeValues();

            this.keyframesAnimation[animationID] = nKeyFrameAnim;
        }

        this.log("Parsed animations");

        return null;
    }

    /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        var children = nodesNode.children; // -- Get all elements of node

        this.nodes = [];
        this.spritesAnim = [];

        var grandChildren = [];
        var nodeNames = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "node") {
                this.onXMLMinorError("Unknown tag <" + children[i].nodeName + "> in <nodes> tag. Ignoring tag...");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null) {
                this.onXMLMinorError("No ID defined for node in <nodes>. Ignoring node...");
                continue;
            }

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null) {
                this.onXMLMinorError("ID must be unique for each node (conflict: ID = " + nodeID + "). Ignoring node...");
                continue;
            }

            this.nodes[nodeID] = new MyNode(nodeID);

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var animationIndex = nodeNames.indexOf("animationref");
            var descendantsIndex = nodeNames.indexOf("descendants");

            // ---------- Transformations --------------- //
            if (transformationsIndex == -1) {
                this.onXMLMinorError("<transformations> tag missing from node " + nodeID + " in <nodes>. Considering no transformations...");
            } else this.parseNodeTransformations(nodeID, transformationsIndex, grandChildren);

            // ---------- Material ---------- //
            if (materialIndex == -1 && this.idRoot != nodeID) {
                this.onXMLMinorError("<material> tag missing from node " + nodeID + " in <nodes>. Considering material with id = 'null'");
                this.nodes[nodeID].material = "null";
            } else this.parseNodeMaterial(nodeID, materialIndex, grandChildren);

            // ---------- Texture ---------- //
            if (textureIndex == -1) {
                this.onXMLMinorError("<texture> tag missing from node " + nodeID + " in <nodes>. Considering texture id = 'clear'");
                this.nodes[nodeID].texture = "clear";
            } else this.parseNodeTexture(nodeID, textureIndex, grandChildren);

            // ---------- Animation -------- //
            if (animationIndex != -1) {
                let animationID = this.reader.getString(grandChildren[animationIndex], 'id');

                if(this.keyframesAnimation[animationID] == null) {
                    this.onXMLMinorError("AnimationID " + animationID + " not defined on node " + nodeID);
                }
                else this.nodes[nodeID].animationID = animationID;
            } 

            // ---------- Descendants ---------- //
            if (descendantsIndex == -1) {
                this.onXMLMinorError("<descendants> tag missing from node " + nodeID + " in <nodes>. Considering no descendants...");
            } else this.parseNodeDescendants(nodeID, descendantsIndex, grandChildren);
        }

        this.verifyInvalidNodes(this.idRoot);

        this.log("Parsed nodes");
    }

    // -------- Parse Node Transformations -----------//

     /**
     * Parse node transformations
     * @param {nodeID} nodeID node that contains nodeID
     * @param {transformationsIndex} transformationsIndex index of transformation tag
     * @param {array} grandChildren contains transformation node
     */
    parseNodeTransformations(nodeID, transformationsIndex, grandChildren) {

        let transformations = grandChildren[transformationsIndex].children;

        for (let j = 0; j < transformations.length; j++) {
            switch(transformations[j].nodeName) {
                case "translation":
                    this.parseTransformationTranslation(transformations[j], nodeID);
                    break;
                case "rotation":
                    this.parseTransformationRotation(transformations[j], nodeID);
                    break;
                case "scale":
                    this.parseTransformationScale(transformations[j], nodeID);
                    break;
                default:
                    this.onXMLMinorError("Not a valid transformation on " + nodeID);
                    break;
            }
        }
    }

     /**
     * Parse Translation Transformation
     * @param {node transformation} transformation transformation tag and information
     * @param {nodeID} nodeID  nodeID
     */
    parseTransformationTranslation(transformation, nodeID) {
        let x = this.reader.getFloat(transformation, 'x');
        let y = this.reader.getFloat(transformation, 'y');
        let z = this.reader.getFloat(transformation, 'z');

        if (x == null || isNaN(x)) {
            this.onXMLMinorError("Missing/Invalid value of x in <translation> tag, from <transformations> tag on node " + nodeID + " in <nodes>. Using x = 0.0");
            x = 0.0;
        }
        if (y == null || isNaN(y)) {
            this.onXMLMinorError("Missing/Invalid value of y in <translation> tag, from <transformations> tag on node " + nodeID + " in <nodes>. Using y = 0.0");
            y = 0.0;
        }
        if (z == null || isNaN(z)) {
            this.onXMLMinorError("Missing/Invalid value of y in <translation> tag, from <transformations> tag on node " + nodeID + " in <nodes>. Using z = 0.0");
            z = 0.0;
        }

        mat4.translate(this.nodes[nodeID].transformation, this.nodes[nodeID].transformation, [x, y, z]);
    }

     /**
     * Parse Rotation Transformation
     * @param {node transformation} transformation transformation tag and information
     * @param {nodeID} nodeID nodeID
     */
    parseTransformationRotation(transformation, nodeID) {
        let axis = this.reader.getString(transformation, 'axis');
        let angle = this.reader.getFloat(transformation, 'angle');

        if (angle == null || isNaN(angle)) {
            this.onXMLMinorError("Missing/Invalid value of 'angle' in <rotation> tag, from <transformations> tag on node " + nodeID + " in <nodes>. Using angle = 0.0");
            angle = 0.0;
        }

        if (axis == null || (axis != 'x' && axis != 'y' && axis != 'z')) {
            this.onXMLMinorError("Missing/Invalid value of 'axis' in <rotation> tag, from <transformations> tag on node " + nodeID + " in <nodes>. Using axis = x");
            axis = 'x';
        }

        mat4.rotate(this.nodes[nodeID].transformation, this.nodes[nodeID].transformation, angle * DEGREE_TO_RAD, this.axisCoords[axis]);
    }

    /**
     * Parse Scale Transformation
     * @param {node transformation} transformation transformation tag and information
     * @param {nodeID} nodeID nodeID
     */
    parseTransformationScale(transformation, nodeID) {
        let sx = this.reader.getFloat(transformation, 'sx');
        let sy = this.reader.getFloat(transformation, 'sy');
        let sz = this.reader.getFloat(transformation, 'sz');

        if (sx == null || isNaN(sx)) {
            this.onXMLMinorError("Missing/Invalid value of 'sx' in <scale> tag, from <transformations> tag on node " + nodeID + " in <nodes>. Using sx = 1.0");
            sx = 1.0;
        }
        if (sy == null || isNaN(sy)) {
            this.onXMLMinorError("Missing/Invalid value of 'sy' in <scale> tag, from <transformations> tag on node " + nodeID + " in <nodes>. Using sy = 1.0");
            sy = 1.0;
        }
        if (sz == null || isNaN(sz)) {
            this.onXMLMinorError("Missing/Invalid value of 'sz' in <scale> tag, from <transformations> tag on node " + nodeID + " in <nodes>. Using sz = 1.0");
            sz = 1.0;
        }

        mat4.scale(this.nodes[nodeID].transformation, this.nodes[nodeID].transformation, [sx, sy, sz]);
    }

    // -------- Parse Node Material ------------------//

    /**
     * Parse node material
     * @param {nodeID} nodeID node that contains nodeID
     * @param {materialIndex} materialIndex index of material tag
     * @param {array} grandChildren contains texture node
     */
    parseNodeMaterial(nodeID, materialIndex, grandChildren) {
        let materialID = this.reader.getString(grandChildren[materialIndex], 'id');

        if (this.idRoot == nodeID && (materialID == null || this.materials[materialID] == null)) {
            this.onXMLMinorError("idRoot doesn't have a valid material! Creating a temporary material with ID: _TEMP_MATERIAL");

            let tempMaterial = new CGFappearance(this.scene);

            tempMaterial.setShininess(1.0);
            tempMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
            tempMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
            tempMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
            tempMaterial.setEmission(0.5, 0.5, 0.5, 1.0);

            this.materials["_TEMP_MATERIAL"] = tempMaterial;

            this.nodes[nodeID].material = "_TEMP_MATERIAL";

        } else if (materialID == null) {
            this.onXMLMinorError("Atribute 'id' missing from <material> tag, node " + nodeID + " in <nodes>. Considering id = 'null'");
            this.nodes[nodeID].material = "null";
        } else if (this.materials[materialID] == null && materialID != "null") {
            this.onXMLMinorError("Invalid atribute 'id' (" + materialID + ") from <material> tag, node " + nodeID + " in <nodes>. Considering id = 'null'");
            this.nodes[nodeID].material = "null";
        } else {
            this.nodes[nodeID].material = materialID;
        }
    }

    // -------- Parse Node Textures ------------ //

    /**
     * Parse node textures
     * @param {nodeID} nodeID node that contains nodeID
     * @param {textureIndex} textureIndex index of texture tag
     * @param {array} grandChildren contains texture node
     */
    parseNodeTexture(nodeID, textureIndex, grandChildren) {
        let textureID = this.reader.getString(grandChildren[textureIndex], 'id');

        if (textureID == null) {
            this.onXMLMinorError("Atribute 'id' missing from <texture> tag, node " + nodeID + " in <nodes>. Considering texture id = 'clear'");
            this.nodes[nodeID].texture = "clear";
        } else if (this.textures[textureID] == null && textureID != "null" && textureID != "clear") {
            this.onXMLMinorError("Invalid 'id' (" + textureID + ") from <texture> tag, node " + nodeID + " in <nodes>. Considering texture id = 'clear'");
            this.nodes[nodeID].texture = "clear";
        } else {
            this.nodes[nodeID].texture = textureID;
        }

        let amplification = grandChildren[textureIndex].children[0];

        if (amplification == null) {
            this.onXMLMinorError("Amplification is undefined on " + nodeID + ". Using afs = 1.0 and aft = 1.0");
        }
        else if (amplification.nodeName != "amplification") {
            this.onXMLMinorError("Missing/Invalid amplification tag from <texture> tag, node " + nodeID + " in <nodes>. Using afs = 1.0 and aft = 1.0");
            this.nodes[nodeID].afs = 1.0;
            this.nodes[nodeID].aft = 1.0;
        } else {
            let afs = this.reader.getFloat(amplification, 'afs');
            let aft = this.reader.getFloat(amplification, 'aft');

            if (!(afs != null && !isNaN(afs))) {
                this.onXMLMinorError("unable to parse afs value on node " + nodeID + ". Using afs = 1.0");
                this.nodes[nodeID].afs = 1.0;
            }
            if (!(aft != null && !isNaN(aft))) {
                this.onXMLMinorError("unable to parse afs value on node " + nodeID + ". Using aft = 1.0");
                this.nodes[nodeID].aft = 1.0;
            }
            
            this.nodes[nodeID].afs = afs;
            this.nodes[nodeID].aft = aft;
        }
    }

    // -------- Parse Node Descendants -----------//

    /**
     * Parse node descendants
     * @param {nodeID} nodeID node that contains nodeID
     * @param {descendantsIndex} descendantsIndex index of descendants tag
     * @param {array} grandChildren contains all descendants from nodeID
     */
    parseNodeDescendants(nodeID, descendantsIndex, grandChildren) {
        let descendants = grandChildren[descendantsIndex].children;

        if (descendants.length == 0) {
            this.onXMLMinorError("No descendants from node " + nodeID + " in <nodes>");
        }
        for (let j = 0; j < descendants.length; j++) {
            if (descendants[j].nodeName == "noderef") {
                let id = this.reader.getString(descendants[j], 'id');

                if (id == null) {
                    this.onXMLMinorError("Missing atribute 'id' on descendant of " + nodeID + ". Ignoring descendant...");
                } else if (nodeID == id) {
                    this.onXMLMinorError("Invalid atribute 'id' on descendant of " + nodeID + " - A node can't be a child and father at same time. Ignoring descendant...");
                }
                else {
                    this.nodes[nodeID].addDescendants(id);
                }
            } else if (descendants[j].nodeName == "leaf") {
                let type = this.reader.getItem(descendants[j], 'type', ['rectangle', 'cylinder', 'triangle', 'sphere', 'torus', 'halftorus',
                                                                        'spritetext', 'spriteanim', 'plane', 'patch', 'defbarrel']);

                if (type == null) {
                    this.onXMLMinorError("Missing/Invalid type of leaf found on " + nodeID + " in <nodes>. Ignoring leaf...");
                } else {
                    this.nodes.push(new MyLeaf(this, descendants[j]));

                    let nPrimitive = this.parseDescendantsLeafs(descendants[j], type, nodeID);

                    if (typeof nPrimitive === 'string')
                        this.onXMLMinorError(nPrimitive);
                    else {
                        let nLeaf = new MyLeaf(nPrimitive, this.nodes[nodeID].afs, this.nodes[nodeID].aft)
                        nLeaf.updateTexCoords();

                        this.nodes[nodeID].addLeaf(nLeaf);

                        if (type =="spriteanim") {
                            this.spritesAnim.push(nPrimitive);
                        }
                    }
                }
            } else {
                this.onXMLMinorError("Invalid descendant found in " + nodeID + ". All descendants in <nodes> should be leafs or noderef.");
            }
        }
    }

    // -------- Parse Descendants Leafs -----------//

    /**
     * Parse triangle from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {primitive type} type node that contains primitive type
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parseDescendantsLeafs(descendants, type, messageError) {
        switch (type) {
            case "torus":
                return this.parseTorus(descendants, messageError);
            case "halftorus":
                return this.parseHalfTorus(descendants, messageError);
            case "cylinder":
                return this.parseCylinder(descendants, messageError);
            case "sphere": 
                return this.parseSphere(descendants, messageError);
            case "rectangle":
                return  this.parseRectangle(descendants, messageError);
            case "triangle":
                return this.parseTriangle(descendants, messageError);
            case "spritetext":
                return this.parseSpriteText(descendants, messageError);
            case "spriteanim":
                return this.parseSpriteAnim(descendants, messageError);
            case "plane":
                return this.parsePlane(descendants, messageError);
            case "patch":
                return this.parsePatch(descendants, messageError);
            case "defbarrel":
                return this.parseDefbarrel(descendants, messageError);
            default:
                return "not a valid leaf on node " + messageError;
        }
    }

    /**
     * Parse Torus from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parseTorus(descendants, messageError) {
        let inner = this.reader.getFloat(descendants, 'inner');
        if (!(inner != null && !isNaN(inner))) {
            return "unable to parse inner value of the torus on node " + messageError;
        }

        let outer = this.reader.getFloat(descendants, 'outer');
        if (!(outer != null && !isNaN(outer))) {
            return "unable to parse outer value of the torus on node " + messageError;
        }

        let slices = this.reader.getFloat(descendants, 'slices');
        if (!(slices != null && !isNaN(slices))) {
            return "unable to parse slices value of the torus on node " + messageError;
        }

        let loops = this.reader.getFloat(descendants, 'loops');
        if (!(loops != null && !isNaN(loops))) {
            return "unable to parse loops value of the torus on node " + messageError;
        }

        return new MyTorus(this.scene, inner, outer, slices, loops);
    }

    /**
     * Parse Half Torus from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parseHalfTorus(descendants, messageError) {
        let inner = this.reader.getFloat(descendants, 'inner');
        if (!(inner != null && !isNaN(inner))) {
            return "unable to parse inner value of the Half Torus on node " + messageError;
        }

        let outer = this.reader.getFloat(descendants, 'outer');
        if (!(outer != null && !isNaN(outer))) {
            return "unable to parse outer value of the Half Torus on node " + messageError;
        }

        let slices = this.reader.getFloat(descendants, 'slices');
        if (!(slices != null && !isNaN(slices))) {
            return "unable to parse slices value of the Half Torus on node " + messageError;
        }

        let loops = this.reader.getFloat(descendants, 'loops');
        if (!(loops != null && !isNaN(loops))) {
            return "unable to parse loops value of the Half Torus on node " + messageError;
        }

        return new MyHalfTorus(this.scene, inner, outer, slices, loops);
    }

    /**
     * Parse cylinder from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parseCylinder(descendants, messageError) {
        let height = this.reader.getFloat(descendants, 'height');
        if (!(height != null && !isNaN(height))) {
            return "unable to parse height value of the cylinder on node " + messageError;
        }

        let topRadius = this.reader.getFloat(descendants, 'topRadius');
        if (!(topRadius != null && !isNaN(topRadius))) {
            return "unable to parse topRadius value of the cylinder on node " + messageError;
        }

        let bottomRadius = this.reader.getFloat(descendants, 'bottomRadius');
        if (!(bottomRadius != null && !isNaN(bottomRadius))) {
            return "unable to parse bottomRadius value of the cylinder on node " + messageError;
        }

        let stacks = this.reader.getFloat(descendants, 'stacks');
        if (!(stacks != null && !isNaN(stacks))) {
            return "unable to parse stacks value of the cylinder on node " + messageError;
        }

        let slices = this.reader.getFloat(descendants, 'slices');
        if (!(slices != null && !isNaN(slices))) {
            return "unable to parse slices value of the cylinder on node " + messageError;
        }

        return new MyCylinder(this.scene, height, topRadius, bottomRadius, stacks, slices);
    }

    /**
     * Parse sphere from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parseSphere(descendants, messageError) {
        let radius = this.reader.getFloat(descendants, 'radius');
        if (!(radius != null && !isNaN(radius))) {
            return "unable to parse radius value of the sphere on node " + messageError;
        }

        let slices = this.reader.getFloat(descendants, 'slices');
        if (!(slices != null && !isNaN(slices))) {
            return "unable to parse slices value of the sphere on node " + messageError;
        }

        let stacks = this.reader.getFloat(descendants, 'stacks');
        if (!(stacks != null && !isNaN(stacks))) {
            return "unable to parse stacks value of the sphere on node " + messageError;
        }

        return new MySphere(this.scene, radius, slices, stacks);
    }

    /**
     * Parse rectangle from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parseRectangle(descendants, messageError) {
        let x1 = this.reader.getFloat(descendants, 'x1');
        if (!(x1 != null && !isNaN(x1))) {
            return "unable to parse x1-coordinate of the rectangle on node " + messageError;
        }

        let y1 = this.reader.getFloat(descendants, 'y1');
        if (!(y1 != null && !isNaN(y1))) {
            return "unable to parse y1-coordinate of the rectangle on node " + messageError;
        }

        let x2 = this.reader.getFloat(descendants, 'x2');
        if (!(x2 != null && !isNaN(x2))) {
            return "unable to parse x2-coordinate of the rectangle on node " + messageError;
        }

        let y2 = this.reader.getFloat(descendants, 'y2');
        if (!(y2 != null && !isNaN(y2))) {
            return "unable to parse y2-coordinate of the rectangle on node " + messageError;
        }

        return new MyRectangle(this.scene, x1, y1, x2, y2);
    }

    /**
     * Parse triangle from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parseTriangle(descendants, messageError) {
        let x1 = this.reader.getFloat(descendants, 'x1');
        if (!(x1 != null && !isNaN(x1))) {
            return "unable to parse x1-coordinate of the triangle on node " + messageError;
        }

        let y1 = this.reader.getFloat(descendants, 'y1');
        if (!(y1 != null && !isNaN(y1))) {
            return "unable to parse y1-coordinate of the triangle on node " + messageError;
        }

        let x2 = this.reader.getFloat(descendants, 'x2');
        if (!(x2 != null && !isNaN(x2))) {
            return "unable to parse x2-coordinate of the triangle on node " + messageError;
        }

        let y2 = this.reader.getFloat(descendants, 'y2');
        if (!(y2 != null && !isNaN(y2)))
        return "unable to parse y2-coordinate of the triangle on node " + messageError;

        let x3 = this.reader.getFloat(descendants, 'x3');
        if (!(x3 != null && !isNaN(x3))) {
            return "unable to parse x3-coordinate of the triangle on node " + messageError;
        }

        let y3 = this.reader.getFloat(descendants, 'y3');
        if (!(y3 != null && !isNaN(y3))) {
            return "unable to parse y3-coordinate of the triangle on node " + messageError;
        }

        return new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3);
    }

    /**
     * Parse SpriteText from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parseSpriteText(descendants, messageError) {
        let text = this.reader.getString(descendants, 'text');

        if (text == null) {
            return "Parameter 'text' of spritetext leaf is missing on node " + messageError;
        }
        else if (text == "") {
            return "Parameter 'text' of spritetext leaf is empty on node " + messageError;
        }

        return new MySpriteText(this.scene, text);
    }

    /**
     * Parse SpriteAnime from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parseSpriteAnim(descendants, messageError) {
        // Get ssID of the current spriteanim.
        let id = this.reader.getString(descendants, 'ssid');
        if (id == null) {
            return "No ssID defined for spriteanim on node " + messageError;
        }

        if(this.spritesheets[id] == null) {
            return "Invalid ID for spriteanim on node " + messageError;
        }

        // Get startCell of the current spriteanim.
        let startCell = this.reader.getInteger(descendants, 'startCell');
        if (!(startCell != null && !isNaN(startCell))) {
            return "Missing/Invalid value for parameter 'startCell' of spriteAnim with ID " + id + " on node " + messageError;
        }
        
        // Get endCell of the current spriteanim.
        let endCell = this.reader.getInteger(descendants, 'endCell');
        if (!(endCell != null && !isNaN(endCell))) {
            return "Missing/Invalid value for parameter 'endCell' of spriteAnim with ID " + id + " on node " + messageError;
        }

        // Get duration of the current spriteanim.
        let duration = this.reader.getInteger(descendants, 'duration');
        if (!(duration != null && !isNaN(duration))) {
            return "Missing/Invalid value for parameter 'duration' of spriteAnim with ID " + id + " on node " + messageError;
        }

        let last = this.spritesheets[id].sizeN * this.spritesheets[id].sizeM - 1;

        if((startCell < 0) || (endCell < 0)) {
            return "StartCell/EndCell can't be minus than 0 on spriteAnim with ID " + id;
        }

        if((startCell > last) || (endCell > last)) {
            return "StartCell/EndCell can't be higher than" + last +  " on spriteAnim with ID " + id;
        }

        if(startCell > endCell) {
            return "StartCell can't be higher than endCell on spriteAnime with ID " + id;
        }

        return new MySpriteAnim(this.scene, this.spritesheets[id], startCell, endCell, duration);
    }

    /**
     * Parse Plane from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parsePlane(descendants, messageError) {
        // Get npartsU of the current plane.
        let npartsU = this.reader.getInteger(descendants, 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU))) {
            return "Missing/Invalid value for parameter 'npartsU' of plane on node " + messageError;
        }

        // Get npartsV of the current plane.
        let npartsV = this.reader.getInteger(descendants, 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV))) {
            return "Missing/Invalid value for parameter 'npartsV' of plane on node " + messageError;
        }

        return new MyPlane(this.scene, npartsU, npartsV);
    }
    
    /**
     * Parse Patch from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parsePatch(descendants, messageError) {
        // Get npointsU of the current patch.
        let npointsU = this.reader.getInteger(descendants, 'npointsU');
        if (!(npointsU != null && !isNaN(npointsU))) {
            return "Missing/Invalid value for parameter 'npointsU' of patch on node " + messageError;
        }

        // Get npointsV of the current patch.
        let npointsV = this.reader.getInteger(descendants, 'npointsV');
        if (!(npointsV != null && !isNaN(npointsV))) {
            return "Missing/Invalid value for parameter 'npointsV' of patch on node " + messageError;
        }
        
        // Get duration of the current patch.
        let npartsU = this.reader.getInteger(descendants, 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU))) {
            return "Missing/Invalid value for parameter 'npartsU' of patch  on node " + messageError;
        }
        
        // Get duration of the current patch.
        let npartsV = this.reader.getInteger(descendants, 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV))) {
            return "Missing/Invalid value for parameter 'npartsV' of patch  on node " + messageError;
        }

        let children = descendants.children;

        let vertexArray = [];

        for(let i = 0; i < children.length; i++) {
            let coords = this.parseCoordinates3D(children[i], messageError);
            
            vertexArray.push(coords);
        }

        let size = npointsU * npointsV;

        if(vertexArray.length != size) {
            return "Invalid number of controlpoints (" + vertexArray.length + ") given " + npointsU + " points on U and " + npointsV +  " points on V on" + messageError;
        }

        let controlPoints = [];

        for (let i = 0; i < npointsU; i++) {
            let pointsU = [];
            
            for (let j = 0; j < npointsV; j++) {
                let point = [];

                point.push(...vertexArray[i * npointsV + j], 1);

                pointsU.push(point);
            }
            controlPoints.push(pointsU);
        }

        return new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);
    }

    /**
     * Parse Defbarrel from XML
     * @param {node leaf} descendants node that contains primitive information
     * @param {message to be displayed in case of error} messageError error message given if some of value isn't parsable
     */
    parseDefbarrel(descendants, messageError) {
         // Get ssID of the current spriteanim.
         let base = this.reader.getFloat(descendants, 'base');
         if (!(base != null && !isNaN(base))) {
            return "Missing/Invalid value for parameter 'base' of defbarrel on node " + messageError;
        }
        
         let middle = this.reader.getFloat(descendants, 'middle');
         if (!(middle != null && !isNaN(middle))) {
            return "Missing/Invalid value for parameter 'middle' of defbarrel on node " + messageError;
        }

    
         let height = this.reader.getFloat(descendants, 'height');
         if (!(height != null && !isNaN(height))) {
            return "Missing/Invalid value for parameter 'height' of defbarrel on node " + messageError;
        }
        
         let slices = this.reader.getInteger(descendants, 'slices');
         if (!(slices != null && !isNaN(slices))) {
            return "Missing/Invalid value for parameter 'slices' of defbarrel on node " + messageError;
        }

         let stacks = this.reader.getInteger(descendants, 'stacks');
         if (!(stacks != null && !isNaN(stacks))) {
            return "Missing/Invalid value for parameter 'stacks' of defbarrel on node " + messageError;
        }
 
        return new MyDefBarrel(this.scene, base, middle, height, slices, stacks);
    }

    // -------- Auxiliary parser functions -----------//
    /**
     * Iterates through the SceneGraph to find and delete Invalid Nodes
     * @param {block element} nodeID nodeID
     */
    verifyInvalidNodes(nodeID) {
        let currentNode = this.nodes[nodeID];

        if(this.nodes[nodeID] == null)
            return -1;
        else {
            for (let i = 0; i < currentNode.descendants.length; i++) 
                if (this.verifyInvalidNodes(currentNode.descendants[i]) == -1) {
                    this.onXMLMinorError("Deleting " + currentNode.descendants[i] + " from descendants of " + nodeID);

                    currentNode.descendants.splice(i, 1);
                }
        }

        return 0;
    }

    /**
     * Parse the Booleans
     * @param {block element} node
     * @param {string} name
     * @param {message to be displayed in case of error} messageError
     */
    parseBoolean(node, name, messageError) {
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node 
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1)) {
            this.onXMLMinorError("Unable to parse R component of the " + messageError + ". Using r = 0.5");
            r = 0.5;
        }

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1)) {
            this.onXMLMinorError("Unable to parse G component of the " + messageError + ". Using g = 0.5");
            g = 0.5;
        }

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1)) {
            this.onXMLMinorError("Unable to parse B component of the " + messageError + ". Using b = 0.5");
            b = 0.5;
        }

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1)) {
            this.onXMLMinorError("Unable to parse A component of the " + messageError + ". Using a = 1.0");
            a = 1.0;
        }

        color.push(...[r, g, b, a]);

        return color;
    }

    // -------- Display Scene -----------//

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // Display loop for transversing the scene graph, calling the root node's display function

        this.processNode(this.idRoot, this.nodes[this.idRoot].material, this.nodes[this.idRoot].texture);
    }

    /**
     * Process each node
     * @param {nodeID} parentNode
     * @param {materialID} parentMaterial
     * @param {textureID} parentTexture
     */
    processNode(parentNode, parentMaterial, parentTexture) {
        let currentNode = this.nodes[parentNode];
        
        // ------- Material ------ //
        let currentMaterial;

        switch (currentNode.material) {
            // -- If node material is null, then it will inherit parent's material
            case "null":
                currentMaterial = parentMaterial;
                break;
            // -- Otherwise, it will have the material ID
            default:
                currentMaterial = this.materials[currentNode.material];
                break;
        }

        // -------- Texture ------ //
        let currentTexture;

        switch (currentNode.texture) {
            // -- If node texture is clear, then it will don't have texture
            case "clear":
                currentTexture = "null";
                break;
            // -- If node texture is null, then it will inherit parent's texture
            case "null":
                currentTexture = parentTexture;
                break;
            // -- Otherwise, it will have the texture ID
            default:
                currentTexture = currentNode.texture;
                break;
        }

        // Bind texture   
        if (currentTexture == "null") {
            currentMaterial.setTexture(null);
        } else {
            currentMaterial.setTexture(this.textures[currentTexture]);
            currentMaterial.setTextureWrap('REPEAT', 'REPEAT');
        }

        currentMaterial.apply();

        // ------ Transformation ------ //
        this.scene.pushMatrix();
        this.scene.multMatrix(currentNode.transformation);

        let display;
        if(currentNode.animationID != null) {
            display = this.keyframesAnimation[currentNode.animationID].apply();
        }

        if (display != 0) {
            // ------ Display Leaves ------ //
            for (let i = 0; i < this.nodes[parentNode].leaves.length; i++) {
                currentNode.leaves[i].display();
                currentMaterial.apply();
            }

            // ------ Process next node ------ //
            for (var i = 0; i < currentNode.descendants.length; i++) {
                this.processNode(currentNode.descendants[i], currentMaterial, currentTexture);
            }
        }
        this.scene.popMatrix();
    }
}