"use strict";

/**
 * This file sets up the basics of the scene, droneCamera and rendering
 */


var scene;
// Camera looks at the scene.
var aspectRatio;
var droneCamera;
// Renderer draws what the droneCamera sees on the screen.
var renderer;

scene = new THREE.Scene();

aspectRatio = window.innerWidth / window.innerHeight;
droneCamera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 30000);

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45, ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

droneCamera.position.z = 320;
droneCamera.position.y = 100;

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xFFCEB8);
document.body.appendChild(renderer.domElement);


/**
 * Our ambient Light for the Stadium and other objects
 * @type {THREE.AmbientLight}
 */
var ambient = new THREE.AmbientLight( 0xAAAAAA);
scene.add( ambient );

var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
directionalLight.position.set( 200, 500, 100 ).normalize();
directionalLight.rotateX(Math.PI*0.5);
scene.add( directionalLight );




//Texture As Camera
var textureCamera = new THREE.PerspectiveCamera( 5, ASPECT_RATIO, NEAR, FAR );
scene.add(textureCamera);
textureCamera.position.set(5000,800,4000);

var screenScene = new THREE.Scene();

var screenCamera = new THREE.OrthographicCamera(
    window.innerWidth  / -2, window.innerWidth  /  2,
    window.innerHeight /  2, window.innerHeight / -2,
    -10000, 10000 );
screenCamera.position.set(0,0,-1);
screenScene.add( screenCamera );

var screenGeometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );

var firstRenderTarget = new THREE.WebGLRenderTarget( 1024, 1024, { format: THREE.RGBFormat } );
var screenMaterial = new THREE.MeshBasicMaterial( { map: firstRenderTarget } );

var quad = new THREE.Mesh( screenGeometry, screenMaterial );
// quad.rotation.x = Math.PI / 2;
screenScene.add( quad );

// final version of camera texture, used in scene.
var screenGeometry = new THREE.CubeGeometry( 4000, 2000, 1, 1 );
var finalRenderTarget = new THREE.WebGLRenderTarget( 1024, 1024, { format: THREE.RGBFormat } );
var screenMaterial = new THREE.MeshBasicMaterial( { map: finalRenderTarget } );
var screen = new THREE.Mesh( screenGeometry, screenMaterial );
screen.position.set(0,1900,-9500);
scene.add(screen);
// pseudo-border for plane, to make it easier to see
var screenGeometry = new THREE.CubeGeometry( 4000, 2000, 1, 1 );
var screenMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
var screen = new THREE.Mesh( screenGeometry, screenMaterial );
screen.position.set(0,1900,-9500);
scene.add(screen);

//End Camera as Texture