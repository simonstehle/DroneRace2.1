"use strict";

/**
 * This file sets up the basics of the scene, droneCamera and rendering
 */

/**
 * Indicates whether game is fully loaded
 * @type {boolean}
 */
var gameLoaded = false;
/**
 * Shared Material Loader
 * @type {THREE.MTLLoader}
 */
var mtlLoader = new THREE.MTLLoader();
// Renderer draws what the droneCamera sees on the screen.

/**
 * Main scene
 * @type {THREE.Scene}
 */
var scene;

/**
 * Main renderer
 * @type {THREE.WebGLRenderer}
 */
var renderer;
// Camera looks at the scene.

/**
 * 3rd person view camera
 * @type {THREE.PerspectiveCamera}
 */
var droneCamera;

/**
 * Camera for filming the drone
 * @type {THREE.PerspectiveCamera}
 */
var textureCamera;
/**
 * Scene beeing shown on screen
 * @type {THREE.Scene}
 */
var screenScene;
/**
 * Camera filming the screenScene to avoid mirroring
 * @type {THREE.PerspectiveCamera}
 */
var screenCamera;
/**
 * Render target of the textureCamera
 * @type {THREE.WebGLRenderTarget}
 */
var firstRenderTarget;
/**
 * Render target of the screenCamera
 * @type {THREE.WebGLRenderTarget}
 */
var finalRenderTarget;

/**
 * Width of user's screen
 * @type {Number|*}
 */
var SCREEN_WIDTH = window.innerWidth;
/**
 * Height of user's screen
 * @type {Number|*}
 */
var SCREEN_HEIGHT = window.innerHeight;
/**
 * Aspect Ratio of user's screen
 * @type {Number|*}
 */
var ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
/**
 * Minimum render distance
 * @type {number}
 */
var NEAR = 0.1;
/**
 * Maximum render distance
 * @type {number}
 */
var FAR = 50000;

/**
 * Zeppelin
 * @type {THREE.Group}
 */
var zeppelin;
/**
 * Marker to which the zeppelin is attached
 * @type {THREE.Object3D}
 */
var zepMarker = new THREE.Object3D();

/**
 * Collection drone's rotors
 * @type {Array}
 */
var rotors = [];

init();

/**
 * Initializes the basics for every level (scenes, cameras, lights, basic objects, ...)
 */
function init() {

    scene = new THREE.Scene();

    droneCamera = new THREE.PerspectiveCamera(50, ASPECT_RATIO, NEAR, FAR);
    droneCamera.position.z = 320;
    droneCamera.position.y = 100;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Adding Lights
    /**
     * Ambient light
     * @type {THREE.AmbientLight}
     */
    var ambient = new THREE.AmbientLight(0xCCCCCC);
    scene.add(ambient);
    /**
     * Directional light
     * @type {THREE.DirectionalLight}
     */
    var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1200, 3500, 1500);
    directionalLight.rotateX(Math.PI * 0.75);
    directionalLight.rotateY(Math.PI * 0.75);
    scene.add(directionalLight);

    /**
     * Geometry for the sky
     * @type {THREE.SphereGeometry}
     */
    var skyGeo = new THREE.SphereGeometry(40000, 25, 25);
    /**
     * Texture for the sky
     * @type {THREE.Texture}
     */
    var texture = THREE.ImageUtils.loadTexture("objects/skyDome.jpg");

    /**
     * Material for the sky
     * @type {THREE.MeshPhongMaterial}
     */
    var material = new THREE.MeshPhongMaterial({
        map: texture,
    });
    /**
     * Mesh of for the sky
     * @type {THREE.Mesh}
     */
    var sky = new THREE.Mesh(skyGeo, material);
    sky.rotation.z = Math.PI;
    sky.material.side = THREE.BackSide;
    scene.add(sky);


    //Zeppelin
    mtlLoader.load('objects/Zeppelin.mtl', function (materials) {

        materials.preload();
        /**
         * 
         * @type {THREE.OBJLoader}
         */
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load('objects/Zeppelin.obj', function (object) {

            zeppelin = object;
            zeppelin.boundingSphere;
            zeppelin.rotation.y = Math.PI * 0.5;
            zeppelin.scale.set(500, 500, 500);
            zeppelin.position.set(0, 2000, -11000);

            zepMarker.position.set(0, 6000, 0);
            zepMarker.add(zeppelin);
            scene.add(zepMarker);

        }, onProgress, onError);

    });

    //Texture As Camera
    textureCamera = new THREE.PerspectiveCamera(1, ASPECT_RATIO, NEAR, FAR * 5);
    textureCamera.position.set(11000, 3000, -3000);
    scene.add(textureCamera);

    screenScene = new THREE.Scene();
    screenCamera = new THREE.OrthographicCamera(
        window.innerWidth / -2, window.innerWidth / 2,
        window.innerHeight / 2, window.innerHeight / -2,
        -10000, 10000);
    screenCamera.position.set(0, 0, -1);
    screenScene.add(screenCamera);
    var screenGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
    firstRenderTarget = new THREE.WebGLRenderTarget(1024, 1024, {format: THREE.RGBFormat});
    var screenMaterial = new THREE.MeshBasicMaterial({map: firstRenderTarget.texture});
    var quad = new THREE.Mesh(screenGeometry, screenMaterial);
    //quad.rotation.x = Math.PI / 2;
    screenScene.add(quad);

    // final version of camera texture, used in scene.
    var screenGeometry = new THREE.CubeGeometry(4000, 2000, 1, 1);
    finalRenderTarget = new THREE.WebGLRenderTarget(1024, 1024, {format: THREE.RGBFormat});
    var screenMaterial = new THREE.MeshBasicMaterial({map: finalRenderTarget.texture});
    var screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1900, -9450);
    scene.add(screen);
    // pseudo-border for plane, to make it easier to see
    var screenGeometry = new THREE.CubeGeometry(4000, 2000, 50, 1);
    var screenMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    var screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1900, -9550);
    scene.add(screen);

//End Camera as Texture
}

var zepCrashFlag = false;
var zeppelinRotation = 0.005;
var firstTime = 0;

function zeppelin_circle(rotation) {
    if (rotation > 0.06) rotation = 0.06;
    zepMarker.rotateY(rotation);
}

function zeppelin_crash() {
    if (zepMarker.position.y > -5000) zepMarker.position.y -= 70;
    if (zeppelin.position.z = 0) zeppelin.position.x -= 10;
    if (zeppelin.position.x = 0) zeppelin.position.z -= 10;
}

function moveZeppelin(crash) {

    if (crash) {
        if (firstTime < 3) firstTime++;
        if (firstTime === 1) dyingSoundPlay();
        //console.log("Zeppelin crash!");
        zeppelin_crash();
        zeppelinRotation += 0.001;
        zeppelin_circle(zeppelinRotation);
    }
    else {
        zeppelin_circle(zeppelinRotation);
    }

}











