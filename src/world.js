if (BABYLON.Engine.isSupported()) {

    const canvas = document.getElementById("renderCanvas"); // Get the canvas element
    const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

    /******* Add the create scene function ******/
    let createScene = function () {

        // Create the scene space
        const scene = new BABYLON.Scene(engine);

        // Add a camera to the scene and attach it to the canvas
        const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.lowerAlphaLimit = Math.PI / 2;
        camera.upperAlphaLimit = Math.PI / 2;
        camera.lowerBetaLimit = Math.PI / 2;
        camera.upperBetaLimit = Math.PI / 2;

        //Skybox
        const skySphere = BABYLON.Mesh.CreateSphere("skySphere", 40, 2200, scene);
        const skySphereMaterial = new BABYLON.StandardMaterial("skySphereMaterial", scene);
        skySphereMaterial.backFaceCulling = false;
        skySphereMaterial.reflectionTexture = new BABYLON.Texture("img/milkyway2.jpg", scene);
        skySphereMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.PROJECTION_MODE;
        skySphereMaterial.diffuseColor = BABYLON.Color3.Black();
        skySphereMaterial.specularColor = BABYLON.Color3.Black();
        skySphere.material = skySphereMaterial;

        // Add lights to the scene
        const sun = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-3, -1.7, -3), scene);
        sun.diffuse = new BABYLON.Color3(1.0, 0.73, 0.47);
        sun.specular = new BABYLON.Color3(1.0, 0.73, 0.47);
        sun.radius - 10;
        sun.intensity = 4.3;

        // Sphere to render planet surface
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1}, scene);
        const ground = new BABYLON.PBRMaterial("ground", scene);
        ground.albedoColor = BABYLON.Color3.White();
        ground.albedoTexture = new BABYLON.Texture("textures/waterworld3.png", scene);
        ground.reflectivityTexture = new BABYLON.Texture("textures/waterworld3_spec.png", scene);
        ground.microSurface = 1.0;
        ground.bumpTexture = new BABYLON.Texture("textures/waterworld3_nrm.png", scene);
        ground.invertNormalMapX = true;
        ground.invertNormalMapY = true;
        ground.receiveShadows = true;
        ground.environmentIntensity = 1;
        ground.specularIntensity = 2;
        const planetAxis = new BABYLON.Vector3(Math.sin(-16 * Math.PI/180), Math.cos(5 * Math.PI/180), 0);
        sphere.position = new BABYLON.Vector3(0,0,0);
        sphere.material = ground;
        const angle = 0.0009; //Rotation angle to determine rotation speed

        //Ground rotation
        scene.registerBeforeRender(function() {
            sphere.rotate(planetAxis, angle, BABYLON.Space.LOCAL);
        })

        //Cloud layer
        const clouds = new BABYLON.StandardMaterial("clouds", scene);
        clouds.opacityTexture = new BABYLON.Texture("textures/earth_clouds.png", scene);
        clouds.useAlphaFromDiffuseTexture = false;
        const sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1.012}, scene);

        //Cloud layer axis
        const cloudAxis = new BABYLON.Vector3(Math.sin(23 * Math.PI/180), Math.cos(23 * Math.PI/180), 0);
        sphere2.position = new BABYLON.Vector3(0,0,0);          
        sphere2.material = clouds;                
        clouds.alpha = 1.0;
        const cloudAngle = 0.0016; //Rotation angle to determine rotation speed
        
        scene.registerBeforeRender(function() {
            sphere2.rotate(planetAxis, cloudAngle, BABYLON.Space.LOCAL);
        });

        //Atmosphere
        const sky = new BABYLON.StandardMaterial("sky", scene);
        sky.diffuseColor = new BABYLON.Color3(0.0, 0.2, 0.636);                
        const sphere3 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1.02}, scene);
        sphere3.position = new BABYLON.Vector3(0,0,0);                
        sphere3.material = sky;
        sphere3.turbidity = 1;
        sphere3.rayleigh = 6;
        sphere3.mieDirectionalG = 0.8;
        sky.alpha = 0.2;

        // Shadows
	    const shadowGenerator = new BABYLON.ShadowGenerator(1024, sun);
        shadowGenerator.getShadowMap().renderList.push(clouds);
        ground.receiveShadows = true;
                
        return scene;
    };

    /******* End of the create scene function ******/
    const scene = createScene(); //Call the createScene function

    engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
        scene.render();
    });

    window.addEventListener("resize", function () { // Watch for browser/canvas resize events
        engine.resize();
    });

}
