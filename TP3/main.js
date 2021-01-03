//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 

//Include additional files here
serialInclude(['../lib/CGF.js', 
                'XMLscene.js', 
                'MySceneGraph.js', 
                'MyInterface.js', 
                'MyLeaf.js', 
                'MyNode.js',
                './animation/MyAnimation.js',
                './animation/MyKeyframe.js',
                './animation/MyKeyframeAnimation.js',
                './animation/MyPieceAnimation.js',
                './animation/MyCameraAnimation.js',
                './game/MyServer.js',
                './game/board/MyBoard.js',
                './game/board/MyBoardSet.js',
                './game/board/MyAuxBoard.js',
                './game/board/MyTile.js',
                './game/board/MyPiece.js',
                './game/menu/MyGameInfo.js',
                './game/menu/MyGameEndInfo.js',
                './game/menu/MyMenu.js',
                './game/menu/MyGameMenu.js',
                './game/menu/MyButton.js',
                './game/orchestrator/MyGameOrchestrator.js',
                './game/orchestrator/state/GameState.js',
                './game/orchestrator/state/GameStateMovie.js',
                './game/orchestrator/state/GameStateAnime.js',
                './game/orchestrator/state/GameStateEnd.js',
                './game/orchestrator/state/GameStateTurn.js',
                './game/orchestrator/state/GameStateBot.js',
                './game/orchestrator/state/GameStateLoading.js',
                './game/orchestrator/sequence/MyGameMove.js',
                './game/orchestrator/sequence/MyGameSequence.js',
                './primitives/obj/MyOBJ.js',
                './primitives/obj/CGFOBJModel.js',
                './primitives/obj/CGFResourceReader.js',
                './primitives/spritesheets/MySpriteAnim.js',
                './primitives/spritesheets/MySpriteSheet.js',
                './primitives/spritesheets/MySpriteText.js',
                './primitives/MyWaveAnimation.js',
                './primitives/MyRectangle.js', 
                './primitives/MyCylinder.js', 
                './primitives/MyTriangle.js', 
                './primitives/MySphere.js', 
                './primitives/MyTorus.js', 
                './primitives/MyHalfTorus.js',
                './primitives/MyPlane.js',
                './primitives/MyPatch.js',
                './primitives/MyDefBarrel.js',
                './primitives/MyCube.js',

main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
    //var filename=getUrlVars()['file'] || "demo.xml";

	// create and load graph, and associate it to scene. 
	// Check console for loading errors
	//var myGraph = new MySceneGraph(filename, myScene);
    myScene.initScene();
	// start
    app.run();
}

]);