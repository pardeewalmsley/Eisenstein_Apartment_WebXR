// JavaScript source code
const createScene = () => {

    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Ground for positional reference
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 25, height: 25});
    ground.material = new BABYLON.GridMaterial("groundMat");
    ground.material.backFaceCulling = false;
    ground.position.y = -0.5;

    // Sphere
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
    // make sphere invisible
    sphere.layerMask = 0;

    const particleSystem = new BABYLON.ParticleSystem("particles", 1000, scene, null, true);
    particleSystem.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/pardeewalmsley/Eisenstein_Apartment_WebXR/particle_system_test/VFX/vxf_textures/Fire_SpriteSheet2_8x8.png", scene, true, false);
    particleSystem.isAnimationSheetEnabled = true;
    particleSystem.billboardMode = true;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

    particleSystem.startSpriteCellID = 0;
    particleSystem.endSpriteCellID = 4;
    particleSystem.spriteCellHeight = 128;
    particleSystem.spriteCellWidth = 129;
    particleSystem.spriteCellLoop = true;

    //Color
    particleSystem.color1 = new BABYLON.Color4(0.620,0.596,0.498,0.494);
    particleSystem.color2 = new BABYLON.Color4(0.431,0.424,0.353,1);
    particleSystem.colorDead = new BABYLON.Color4(0,0,0,0);

    //Emission
    particleSystem.emitter = sphere; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, -0.3); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0.3); // To...

    // Size of each particle (random between...
    particleSystem.minSize = 0.5;
    particleSystem.maxSize = 0.6;

    // Lifetime of each particle (random between...
    particleSystem.minLifeTime = 15;
    particleSystem.maxLifeTime = 20;

    // Emission rate
    particleSystem.emitRate = 500;

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-2, 0, 0);
    particleSystem.direction2 = new BABYLON.Vector3(-2, 0, 0);


    // Speed -low power, higher speed to match sprite animation
    particleSystem.minEmitPower = 0.1;
    particleSystem.maxEmitPower = 0.1;
    particleSystem.updateSpeed = 0.1;

    // Start the particle system
    particleSystem.start();

// #Region PATH
	// Create array of points to describe the curve
	var points = [];
	var n = 450; // number of points
	var r = 10; //radius
	for (var i = 0; i < n + 1; i++) {
		points.push( new BABYLON.Vector3((r + (r/5)*Math.sin(8*i*Math.PI/n))* Math.sin(2*i*Math.PI/n), 0, (r + (r/10)*Math.sin(6*i*Math.PI/n)) * Math.cos(2*i*Math.PI/n)));
	}	
	
    //Draw the curve
	var track = BABYLON.MeshBuilder.CreateLines('track', {points: points}, scene);
	track.color = new BABYLON.Color3(0, 0, 0);

    
    
// #Region MOVE OBJECT ON PATH
    // set position and rotation
    sphere.position.y = 2;
    sphere.position.z = r;


    var path3d = new BABYLON.Path3D(points);
    var normals = path3d.getNormals();
    var theta = Math.acos(BABYLON.Vector3.Dot(BABYLON.Axis.Z, normals[0]));
    sphere.rotate(BABYLON.Axis.Y, theta, BABYLON.Space.WORLD);

    // animate movement
    var i = 0;
    scene.registerAfterRender(function(){
        sphere.position.x = points[i].x;
        sphere.position.z = points[i].z;

        theta = Math.acos(BABYLON.Vector3.Dot(normals[i], normals[i+1]));
        var direction = BABYLON.Vector3.Cross(normals[i], normals[i+1]).y;
        var direction = direction / Math.abs(direction);

        sphere.rotate(BABYLON.Axis.Y, direction * theta, BABYLON.Space.WORLD);

        i = (i+1) % (n-1);
    });
    return scene;

};