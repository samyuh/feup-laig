const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

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

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
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
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.onXMLMinorError("To do: Parse views.");

        this.cameras = {};
        var children = viewsNode.children;

        var default_view = this.reader.getString(viewsNode, 'default');
        if (default_view == null)
            this.onXMLMinorError("no default_view defined for scene");  // Use defaultView?

        if (children.length === 0)
            this.onXMLMinorError("No views declared in <views>");  // Use defaultView?

        for (var i = 0; i < children.length; i++) {
            var camera = {};
            var nodeType = children[i].nodeName;    // Either perspective or ortho
            if (nodeType == null) {
                this.onXMLMinorError("Camera with no type in <views>");
                continue;   // Ignore camera with no type
            }

            var id = this.reader.getString(children[i], 'id');
            if (id == null) {
                this.onXMLMinorError("Camera with no 'id' atribute in <views>. Ignoring camera...");
                continue;
            }

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
            }
            else if (nodeType === "ortho") {
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
            }
            else {
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

            if (fromIndex == -1) {
                return ('Camera ' + id + " is missing the 'from' attribute");
            }
            if (toIndex == -1) {
                return ('Camera ' + id + " is missing the 'to' attribute");
            }

            camera.from = {};
            camera.to = {};
            var x, y, z;

            x = this.reader.getFloat(grandChildren[fromIndex], 'x');
            if (x == null) {
                this.onXMLMinorError("Camera with no 'x' value of 'from' atribute in <views>. Using x = 30");
                x = 30;
            }

            y = this.reader.getFloat(grandChildren[fromIndex], 'y');
            if (y == null) {
                this.onXMLMinorError("Camera with no 'y' value of 'from' atribute in <views>. Using y = 15");
                y = 15;
            }

            z = this.reader.getFloat(grandChildren[fromIndex], 'z');
            if (z == null) {
                this.onXMLMinorError("Camera with no 'z' value of 'from' atribute in <views>. Using z = 30");
                z = 30;
            }

            camera.from.x = x;
            camera.from.y = y;
            camera.from.z = z;

            x = this.reader.getFloat(grandChildren[toIndex], 'x');
            if (x == null) {
                this.onXMLMinorError("Camera with no 'x' value of 'to' atribute in <views>. Using x = 30");
                x = 30;
            }

            y = this.reader.getFloat(grandChildren[toIndex], 'y');
            if (y == null) {
                this.onXMLMinorError("Camera with no 'y' value of 'to' atribute in <views>. Using y = 15");
                y = 15;
            }

            z = this.reader.getFloat(grandChildren[toIndex], 'z');
            if (z == null) {
                this.onXMLMinorError("Camera with no 'z' value of 'to' atribute in <views>. Using z = 30");
                z = 30;
            }

            camera.to.x = x;
            camera.to.y = y;
            camera.to.z = z;

            // Process "up" point of ortho cameras
            if (nodeType === "ortho") {
                camera.up = {};
                var upIndex = nodeNames.indexOf("up");
                if (upIndex == -1) {    // 'up' atribute is optional: if not defined, using up = (0,1,0)
                    camera.up.x = 0;
                    camera.up.y = 1;
                    camera.up.z = 0;
                }
                else {
                    x = this.reader.getFloat(grandChildren[upIndex], 'x');
                    if (x == null)
                        x = 0;  // if not defined, using x = 0

                    y = this.reader.getFloat(grandChildren[upIndex], 'y');
                    if (y == null)
                        y = 1;  // if not defined, using y = 1

                    z = this.reader.getFloat(grandChildren[upIndex], 'z');
                    if (z == null) {
                        z = 0;  // if not defined, using z = 0
                    }
                    camera.up.x = x;
                    camera.up.y = y;
                    camera.up.z = z;
                }
            }

            // Obtained all data, adding camera to the scene cameras
            if (nodeType === "perspective") {
                this.cameras[id] = new CGFcamera(camera.angle * Math.PI / 180.0, camera.near, camera.far, vec3.fromValues(camera.from.x, camera.from.y, camera.from.z), vec3.fromValues(camera.to.x, camera.to.y, camera.to.z));
            }
            else if (nodeType === "ortho") {
                this.cameras[id] = new CGFcameraOrtho(camera.left, camera.right, camera.bottom, camera.top, camera.near, camera.far, vec3.fromValues(camera.from.x, camera.from.y, camera.from.z), vec3.fromValues(camera.to.x, camera.to.y, camera.to.z), vec3.fromValues(camera.up.x, camera.up.y, camera.up.z));
            }
        }

        this.scene.camera = this.cameras[default_view];
        this.scene.interface.setActiveCamera(this.scene.camera);
        
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

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

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
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
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
                }
                else
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
        this.onXMLMinorError("To do: Parse textures.");

        this.textures = {};

        var children = texturesNode.children;

        for (var i = 0; i < children.length; i++) {
            var id = this.reader.getString(children[i], 'id');

            // Check if texture has no ID
            if (id == null) {
                return "Texture with no ID found on <textures>";
            }
            // Check if texture has repeated ID
            if (this.textures[id] != null) {
                return "Texture with repeated ID found on <textures> (" + id + ")";
            }

            var file = this.reader.getString(children[i], 'path');

            // Check if texture has no file path
            if (file == null) {
                return "Texture with no file path found on <textures> (" + id + ")";
            }

            let new_texture = new CGFtexture(this.scene, file);
            this.textures[id] = new_texture;
        }

        this.log("Parsed textures");

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
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            else if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

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
            if (shininessIndex == -1) {
                return ("<shininess> tag missing from material " + materialID + " in <materials>");
            }

            var shininess_value = this.reader.getFloat(grandChildren[shininessIndex], 'value');

            if (shininess_value == null) {
                this.onXMLMinorError("Missing 'value' of <shininess> tag, from material " + materialID + " in <materials>. Using value = 1.0");
                shininess_value = 1.0;
            }

            else if (shininess_value <= 0) {
                this.onXMLMinorError("Invalid 'value' of <shininess> tag, from material " + materialID + " in <materials>. Using value = 1.0");
                shininess_value = 1.0;
            }

            // ----- Process "ambient" data of the material -----
            if (ambientIndex == -1) {
                return ("<ambient> tag missing from material " + materialID + " in <materials>");
            }

            var ambient_values = {};

            // 'R' component of "ambient"
            ambient_values.r = this.reader.getFloat(grandChildren[ambientIndex], 'r');

            if (ambient_values.r == null) {
                this.onXMLMinorError("Value 'r' missing from <ambient> tag, in material " + materialID + " in <materials>. Using r = 0.0");
                ambient_values.r = 0.0;
            }

            else if (ambient_values.r < 0.0 || ambient_values.r > 1.0) {
                this.onXMLMinorError("Invalid value 'r' from <ambient> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using r = 0.0");
                ambient_values.r = 0.0;
            }

            // 'G' component of "ambient"
            ambient_values.g = this.reader.getFloat(grandChildren[ambientIndex], 'g');

            if (ambient_values.g == null) {
                this.onXMLMinorError("Value 'g' missing from <ambient> tag, in material " + materialID + " in <materials>. Using g = 0.0");
                ambient_values.g = 0.0;
            }

            else if (ambient_values.g < 0.0 || ambient_values.g > 1.0) {
                this.onXMLMinorError("Invalid value 'g' from <ambient> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using g = 0.0");
                ambient_values.g = 0.0;
            }

            // 'B' component of "ambient"
            ambient_values.b = this.reader.getFloat(grandChildren[ambientIndex], 'b');

            if (ambient_values.b == null) {
                this.onXMLMinorError("Value 'b' missing from <ambient> tag, in material " + materialID + " in <materials>. Using b = 0.0");
                ambient_values.b = 0.0;
            }

            else if (ambient_values.b < 0.0 || ambient_values.b > 1.0) {
                this.onXMLMinorError("Invalid value 'g' from <ambient> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using b = 0.0");
                ambient_values.b = 0.0;
            }

            // 'A' component of "ambient"
            ambient_values.a = this.reader.getFloat(grandChildren[ambientIndex], 'a');

            if (ambient_values.a == null) {
                this.onXMLMinorError("Value 'a' missing from <ambient> tag, in material " + materialID + " in <materials>. Using a = 1.0");
                ambient_values.a = 1.0;
            }

            else if (ambient_values.a < 0.0 || ambient_values.a > 1.0) {
                this.onXMLMinorError("Invalid value 'a' from <ambient> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using a = 1.0");
                ambient_values.a = 1.0;
            }

            // ----- Process "diffuse" data of the material -----
            if (diffuseIndex == -1) {
                return ("<diffuse> tag missing from material " + materialID + " in <materials>");
            }

            var diffuse_values = {};

            // 'R' component of "diffuse"
            diffuse_values.r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');

            if (diffuse_values.r == null) {
                this.onXMLMinorError("Value 'r' missing from <diffuse> tag, in material " + materialID + " in <materials>. Using r = 0.0");
                diffuse_values.r = 0.0;
            }

            else if (diffuse_values.r < 0.0 || diffuse_values.r > 1.0) {
                this.onXMLMinorError("Invalid value 'r' from <diffuse> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using r = 0.0");
                diffuse_values.r = 0.0;
            }

            // 'G' component of "diffuse"
            diffuse_values.g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');

            if (diffuse_values.g == null) {
                this.onXMLMinorError("Value 'g' missing from <diffuse> tag, in material " + materialID + " in <materials>. Using g = 0.0");
                diffuse_values.g = 0.0;
            }

            else if (diffuse_values.g < 0.0 || diffuse_values.g > 1.0) {
                this.onXMLMinorError("Invalid value 'g' from <diffuse> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using g = 0.0");
                diffuse_values.g = 0.0;
            }

            // 'B' component of "diffuse"
            diffuse_values.b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');

            if (diffuse_values.b == null) {
                this.onXMLMinorError("Value 'b' missing from <diffuse> tag, in material " + materialID + " in <materials>. Using b = 0.0");
                diffuse_values.b = 0.0;
            }

            else if (diffuse_values.b < 0.0 || diffuse_values.b > 1.0) {
                this.onXMLMinorError("Invalid value 'b' from <diffuse> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using b = 0.0");
                diffuse_values.b = 0.0;
            }

            // 'A' component of "diffuse"
            diffuse_values.a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');

            if (diffuse_values.a == null) {
                this.onXMLMinorError("Value 'a' missing from <diffuse> tag, in material " + materialID + " in <materials>. Using a = 1.0");
                diffuse_values.a = 1.0;
            }

            else if (diffuse_values.a < 0.0 || diffuse_values.a > 1.0) {
                this.onXMLMinorError("Invalid value 'a' from <diffuse> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using a = 1.0");
                diffuse_values.a = 1.0;
            }

            // ----- Process "specular" data of the material -----
            if (specularIndex == -1) {
                return ("<specular> tag missing from material " + materialID + " in <materials>");
            }

            var specular_values = {};

            // 'R' component of "specular"
            specular_values.r = this.reader.getFloat(grandChildren[specularIndex], 'r');

            if (specular_values.r == null) {
                this.onXMLMinorError("Value 'r' missing from <specular> tag, in material " + materialID + " in <materials>. Using r = 0.0");
                specular_values.r = 0.0;
            }

            else if (specular_values.r < 0.0 || specular_values.r > 1.0) {
                this.onXMLMinorError("Invalid value 'r' from <specular> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using r = 0.0");
                specular_values.r = 0.0;
            }

            // 'G' component of "specular"
            specular_values.g = this.reader.getFloat(grandChildren[specularIndex], 'g');

            if (specular_values.g == null) {
                this.onXMLMinorError("Value 'g' missing from <specular> tag, in material " + materialID + " in <materials>. Using g = 0.0");
                specular_values.g = 0.0;
            }

            else if (specular_values.g < 0.0 || specular_values.g > 1.0) {
                this.onXMLMinorError("Invalid value 'g' from <specular> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using g = 0.0");
                specular_values.g = 0.0;
            }

            // 'B' component of "specular"
            specular_values.b = this.reader.getFloat(grandChildren[specularIndex], 'b');

            if (specular_values.b == null) {
                this.onXMLMinorError("Value 'b' missing from <specular> tag, in material " + materialID + " in <materials>. Using b = 0.0");
                specular_values.b = 0.0;
            }

            else if (specular_values.b < 0.0 || specular_values.b > 1.0) {
                this.onXMLMinorError("Invalid value 'g' from <specular> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using b = 0.0");
                specular_values.b = 0.0;
            }

            // 'A' component of "specular"
            specular_values.a = this.reader.getFloat(grandChildren[specularIndex], 'a');

            if (specular_values.a == null) {
                this.onXMLMinorError("Value 'a' missing from <specular> tag, in material " + materialID + " in <materials>. Using a = 1.0");
                specular_values.a = 1.0;
            }

            else if (specular_values.a < 0.0 || specular_values.a > 1.0) {
                this.onXMLMinorError("Invalid value 'a' from <specular> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using a = 1.0");
                specular_values.a = 1.0;
            }

            // ----- Process "emissive" data of the material -----
            if (emissiveIndex == -1) {
                return ("<emissive> tag missing from material " + materialID + " in <materials>");
            }

            var emissive_values = {};

            // 'R' component of "emissive"
            emissive_values.r = this.reader.getFloat(grandChildren[emissiveIndex], 'r');

            if (emissive_values.r == null) {
                this.onXMLMinorError("Value 'r' missing from <emissive> tag, in material " + materialID + " in <materials>. Using r = 0.0");
                emissive_values.r = 0.0;
            }

            else if (emissive_values.r < 0.0 || emissive_values.r > 1.0) {
                this.onXMLMinorError("Invalid value 'r' from <emissive> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using r = 0.0");
                emissive_values.r = 0.0;
            }
            // 'G' component of "emissive"
            emissive_values.g = this.reader.getFloat(grandChildren[emissiveIndex], 'g');

            if (emissive_values.g == null) {
                this.onXMLMinorError("Value 'g' missing from <emissive> tag, in material " + materialID + " in <materials>. Using g = 0.0");
                emissive_values.g = 0.0;
            }
            else if (emissive_values.g < 0.0 || emissive_values.g > 1.0) {
                this.onXMLMinorError("Invalid value 'g' from <emissive> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using g = 0.0");
                emissive_values.g = 0.0;
            }

            // 'B' component of "emissive"
            emissive_values.b = this.reader.getFloat(grandChildren[emissiveIndex], 'b');

            if (emissive_values.b == null) {
                this.onXMLMinorError("Value 'b' missing from <emissive> tag, in material " + materialID + " in <materials>. Using b = 0.0");
                emissive_values.b = 0.0;
            }
            else if (emissive_values.b < 0.0 || emissive_values.b > 1.0) {
                this.onXMLMinorError("Invalid value 'b' from <emissive> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using b = 0.0");
                emissive_values.b = 0.0;
            }

            // 'A' component of "emissive"
            emissive_values.a = this.reader.getFloat(grandChildren[emissiveIndex], 'a');

            if (emissive_values.a == null) {
                this.onXMLMinorError("Value 'a' missing from <emissive> tag, in material " + materialID + " in <materials>. Using a = 1.0");
                emissive_values.a = 1.0;
            }
            else if (emissive_values.a < 0.0 || emissive_values.a > 1.0) {
                this.onXMLMinorError("Invalid value 'a' from <emissive> tag, in material " + materialID + " in <materials>. It must be between 0 and 1. Using a = 1.0");
                emissive_values.a = 1.0;
            }

            // ----- Create material and add to scene materials ----- //

            let material = new CGFappearance(this.scene);

            material.setShininess(shininess_value);
            material.setAmbient(ambient_values.r, ambient_values.g, ambient_values.b, ambient_values.a);
            material.setDiffuse(diffuse_values.r, diffuse_values.g, diffuse_values.b, diffuse_values.a);
            material.setSpecular(specular_values.r, specular_values.g, specular_values.b, specular_values.a);
            material.setEmission(emissive_values.r, emissive_values.g, emissive_values.b, emissive_values.a);

            this.materials[materialID] = material;

            no_materials_defined = false;
        }
        if (no_materials_defined) {
            return "No materials found in tag <materials>. At least one material should be present.";
        }

        this.onXMLMinorError("To do: Parse materials.");

        this.log("Parsed materials");
        return null;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
        var children = nodesNode.children; // -- Get all elements of node

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            this.nodes[nodeID] = new MyNode(this, nodeID);
            
            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            // ---------- Transformations --------------- //
            
            if (transformationsIndex == -1) {
                return ("[TRANSFORMATIONS] <transformations> tag missing from node " + nodeID + " in <nodes>");
            }

            var transformations = grandChildren[transformationsIndex].children;
            for (var j = 0; j < transformations.length; j++) {
                if (transformations[j].nodeName == "translation") {
                    let x = this.reader.getFloat(transformations[j], 'x');
                    let y = this.reader.getFloat(transformations[j], 'y');
                    let z = this.reader.getFloat(transformations[j], 'z');

                    if (x == null || y == null || z == null)
                        return ("[TRANSFORMATIONS] Invalid values of x, y and z in transformations on " + nodeID);

                    mat4.translate(this.nodes[nodeID].transformation, this.nodes[nodeID].transformation, [x, y, z]);
                }
                else if (transformations[j].nodeName == "rotation") {
                    let axis = this.reader.getString(transformations[j], 'axis');
                    let angle = this.reader.getFloat(transformations[j], 'angle');
                    
                    if (angle == null)
                        return ("[TRANSFORMATIONS] Invalid values of angle in transformations on " + nodeID);

                    if (axis == 'x' || axis == 'y' || axis == 'z')
                        mat4.rotate(this.nodes[nodeID].transformation, this.nodes[nodeID].transformation, angle * DEGREE_TO_RAD, this.axisCoords[axis]);
                    else
                        return ("[TRANSFORMATIONS] Invalid axis in transformations on " + nodeID);
                }
                else if (transformations[j].nodeName == "scale") {
                    let sx = this.reader.getFloat(transformations[j], 'sx');
                    let sy = this.reader.getFloat(transformations[j], 'sy');
                    let sz = this.reader.getFloat(transformations[j], 'sz');

                    if (sx == null || sy == null || sz == null)
                        return ("[TRANSFORMATIONS] Invalid values of sx, sy and sz in transformations on " + nodeID);

                    mat4.scale(this.nodes[nodeID].transformation, this.nodes[nodeID].transformation, [sx, sy, sz]);
                }
            }
            
            // ---------- Material ---------- //

            if (materialIndex == -1) {
                return ("[MATERIAL] <material> tag missing from node " + nodeID + " in <nodes>");
            }

            var materialID = this.reader.getString(grandChildren[materialIndex], 'id');

            if (materialID == null)
                return ("[MATERIAL] Material ID missing from <material> tag, node " + nodeID + " in <nodes>");

            else if (this.materials[materialID] == null && materialID != "null") {
                return ("[MATERIAL] Material ID invalid (" + materialID + ") from <material> tag, node " + nodeID + " in <nodes>");
            }
            else {
                this.nodes[nodeID].material = materialID;
            }

            // ---------- Texture ---------- //

            if (textureIndex == -1) {
                return ("[TEXTURE] <texture> tag missing from node " + nodeID + " in <nodes>");
            }

            let textureID = this.reader.getString(grandChildren[textureIndex], 'id');

            if (textureID == null) {
                return ("[TEXTURE] Texture ID missing from <texture> tag, node " + nodeID + " in <nodes>");
            }
            else if (this.textures[textureID] == null && textureID != "null" && textureID != "clear")  {
                return ("[TEXTURE] Texture ID invalid (" + textureID + ") from <texture> tag, node " + nodeID + " in <nodes>");
            }
            else {
                this.nodes[nodeID].texture = textureID;
            }

            // ---------- Descendants ---------- //

            var descendants = children[i].children[descendantsIndex].children;
            
            if (descendantsIndex == -1) {
                return ("[DESCENDANTS] <descendants> tag missing from node " + nodeID + " in <nodes>");
            }

            if (descendants.length == 0) {
                return ("[DESCENDANTS] " + nodeID + " in <nodes> don't have any descendant");
            }
            for (let j = 0; j < descendants.length; j++) {
                if (descendants[j].nodeName == "noderef") {
                    let id = this.reader.getString(descendants[j], 'id');

                    if (id == null) {
                        return ("[DESCENDANTS] Invalid nodeID on descendants of" + nodeID);
                    }
                    else if (nodeID == id) {
                        return ("[DESCENDANTS] A node can't be a child and father at same time. Error on node " + nodeID);
                    }

                    this.nodes[nodeID].addDescendants(id);
                }
                else if (descendants[j].nodeName == "leaf") {
                    let type = this.reader.getItem(descendants[j], 'type', ['rectangle', 'cylinder', 'triangle', 'sphere', 'torus', 'halftorus']);

                    if (type == null) {
                        return ("[DESCENDANTS] Type of leaf not found on " + nodeID + " in <nodes>");
                    }
                    else {
                        this.nodes.push(new MyLeaf(this, descendants[j]));
                        this.nodes[nodeID].addLeaf(new MyLeaf(this, descendants[j]));
                    }
                }
                else {
                    return ("[DESCENDANTS] All descendants of " + nodeID + " in <nodes> should be leafs or noderef");
                }
            } 
        }
    }

    // -------- Parse Leafs -----------//

    // -------- Auxiliar parser functions -----------//

    /**
     * Parse the 
     * @param {} node
     * @param {} name
     * @param {} messageError
     */
    parseBoolean(node, name, messageError) {
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 1;
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
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    // -------- Display Scene -----------//

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
       // Display loop for transversing the scene graph, calling the root node's display function
       let new_texture = new CGFtexture(this.scene, "./scenes/images/glass.jpg");

        this.processNode(this.idRoot, this.nodes[this.idRoot].material, new_texture);
    }

    /**
    * Process each node
    * @param {nodeID} node
    */
    processNode(node, material, texture) {
        let currentMaterial = material;
        let currentTexture = texture;
        let currentNode = this.nodes[node];
        
        this.scene.pushMatrix();
        this.scene.multMatrix(this.nodes[node].transformation);

        if (currentNode.material != "null") {
            currentMaterial = this.materials[currentNode.material];
        }
/*
        if (currentNode.texture != "null") {  
            if (currentNode.texture != "clear") {
                currentTexture = currentNode.texture;
            } else currentTexture = null;

*/          

            
/* 
            if (this.nodes[node].texture == "clear")
                console.log("asd");
                // currentMaterial.setTexture(null);
            else {
                console.log(this.textures[this.nodes[node].texture]);
                // currentTexture.bind();
            } 
        }
*/
        currentMaterial.setTexture(currentTexture);
        currentMaterial.apply();

        for(var i = 0; i < this.nodes[node].descendants.length; i++) {
            this.processNode(this.nodes[node].descendants[i], currentMaterial, currentTexture);
        }
        
        for(var i = 0; i < this.nodes[node].leaves.length; i++) {
            this.nodes[node].leaves[i].display();
        }
        
        this.scene.popMatrix();
    } 
}