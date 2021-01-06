const createScene = () => {

    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Ground for positional reference
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 25, height: 25 });
    ground.material = new BABYLON.GridMaterial("groundMat");
    ground.material.backFaceCulling = false;
    ground.position.y = -0.5;

    // Sphere
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
    // make sphere invisible
    sphere.layerMask = 0;

    const particleSystem = new BABYLON.ParticleSystem("trail_particles", 1000, scene, null, true);
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
    particleSystem.color1 = new BABYLON.Color4(0.620, 0.596, 0.498, 0.494);
    particleSystem.color2 = new BABYLON.Color4(0.431, 0.424, 0.353, 1);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);

    //Emission
    particleSystem.emitter = sphere; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, -0.1); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0.1); // To...

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.2;

    // Lifetime of each particle (random between...
    particleSystem.minLifeTime = 15;
    particleSystem.maxLifeTime = 25;

    // Emission rate
    particleSystem.emitRate = 500;

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-0.1, 0, -0.1);
    particleSystem.direction2 = new BABYLON.Vector3(0.1, 0, 0.1);


    // Speed -low power, higher speed to match sprite animation
    particleSystem.minEmitPower = 0.1;
    particleSystem.maxEmitPower = 0.1;
    particleSystem.updateSpeed = 0.1;

    // Start the particle system
    particleSystem.start();

    // #Region Catmull-Roll Spline
    //First Spline:
    var firstP1 = new BABYLON.Vector3(-0.21, 1.6, 0.84);
    var firstP2 = new BABYLON.Vector3(-2.29, 1.6, 2.46);
    var firstP3 = new BABYLON.Vector3(-2.61, 1.6, 5.29);
    var firstP4 = new BABYLON.Vector3(0.85, 1.6, 6.43);

    var firstSpline = BABYLON.Curve3.CreateCatmullRomSpline(
        [firstP1, firstP2, firstP3, firstP4], 50);
    var firstSplineMesh = BABYLON.Mesh.CreateLines("First_Spline", firstSpline.getPoints(), scene);
    firstSplineMesh.position = new BABYLON.Vector3(-2.635, 0, 1.101);
    firstSplineMesh.rotation.y = Math.PI / 4;
    // TODO: Uncomment this line to make line invisible
    //firstSplineMesh.layerMask = 0;

    //Second Spline:
    var secondP1 = new BABYLON.Vector3(0.16, 1.6, 0.73);
    var secondP2 = new BABYLON.Vector3(0.8, 1.6, 3);
    var secondP3 = new BABYLON.Vector3(3.1, 1.6, 3.19);
    var secondP4 = new BABYLON.Vector3(4.45, 1.6, 1.9);
    var secondP5 = new BABYLON.Vector3(4.78, 1.6, 1.96);
    var secondP6 = new BABYLON.Vector3(4.77, 1.6, 2.35);

    var secondSpline = BABYLON.Curve3.CreateCatmullRomSpline([secondP1, secondP2, secondP3, secondP4, secondP5, secondP6], 10);
    var secondSplineMesh = BABYLON.Mesh.CreateLines("Second_Spline", secondSpline.getPoints(), scene);
    secondSplineMesh.position = new BABYLON.Vector3(1.199, 0, 4.675);
    secondSplineMesh.rotation.y = Math.PI / 2;
    //Third Spline:
    var thirdP1 = new BABYLON.Vector3(3.33, 1.6, 2.57);
    var thirdP2 = new BABYLON.Vector3(1.74, 1.6, -0.03);
    var thirdP3 = new BABYLON.Vector3(0.49, 1.6, 1.69);
    var thirdP4 = new BABYLON.Vector3(-1.43, 1.6, 2.33);
    var thirdP5 = new BABYLON.Vector3(-0.78, 1.6, 3.71);

    var thirdSpline = BABYLON.Curve3.CreateCatmullRomSpline([thirdP1, thirdP2, thirdP3, thirdP4, thirdP5], 10);
    var thirdSplineMesh = BABYLON.Mesh.CreateLines("Third_Spline", thirdSpline.getPoints(), scene);
    thirdSplineMesh.position = new BABYLON.Vector3(-2.112, 0, -2.694);
    thirdSplineMesh.rotation.y = Math.PI / 8;

    // #Region MOVE OBJECT ON FIRST SPLINE
    // Move particles on the first spline. TODO make a method and pass pline
    sphere.setParent(firstSplineMesh);
    sphere.position = firstP1;

    var pathPoints = firstSpline.getPoints();
    var numberOfPoints = pathPoints.length;
    var path3d = new BABYLON.Path3D(pathPoints);
    var normals = path3d.getNormals();

    var theta = Math.acos(BABYLON.Vector3.Dot(BABYLON.Axis.Z, normals[0]));

    var i = 0;
    scene.registerAfterRender(function () {
        sphere.position = pathPoints[i];

        theta = Math.acos(BABYLON.Vector3.Dot(normals[i], normals[i + 1]));
        var direction = BABYLON.Vector3.Cross(normals[i], normals[i + 1]).y;
        var direction = direction / Math.abs(direction);

        sphere.rotate(BABYLON.Axis.Y, direction * theta, BABYLON.Space.WORLD);

        i = (i + 1) % (numberOfPoints - 1);
    });

    return scene;
};