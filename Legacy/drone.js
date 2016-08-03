/**
 * Created by simonstehle on 21.07.16.
 */

/**
 * This file is for loading the drone and controls
 */

var scene;
// Camera looks at the scene.
var aspectRatio;
var camera;
// Renderer draws what the camera sees on the screen.
var renderer;

//Declaration of Moving Flags
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

//Declaration of rotation Flags
var rotateLeft = false;
var rotateRight = false;

//Declaration of Up and Down Flags
var moveDroneUp = false;
var moveDroneDown = false;

//Declaration of Speed Variables
var speedForward = 50;
var speedBackwards = 50;
var speedSidewards = 40;
var speedRotationRadian = 0.05;
var speedUpDown = 20;

//Var for the glogal Angle to control the Drone after rotating around y
var globalAngle = 0;

//Vars to set the boundaries
var boundaryBottom = -80;
var forbiddenZones = [];
var crash = false; //set true if someone crashes the drone

//vars to score the Game
var yBoundaries = [];
var gameScore = 0;
var hindernisse = [];
hindernisse[0] = false;

var flyTroughObjects = [];
var flyOverObjects = [];


scene = new THREE.Scene();

aspectRatio = window.innerWidth / window.innerHeight;
camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 30000);

//Rechtshändiges Koordinatensystem, Z ersticht einen
camera.position.z = 320;
camera.position.y = 100;


renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xFFCEB8);
document.body.appendChild(renderer.domElement);



//Pasted

var container, stats, mesh, bonooneStadium;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

//Marker for grouping object, drone and camera
var marker = new THREE.Object3D();
scene.add(marker);

marker.add(camera);

scene.add(createTreeAt(-500,0));
scene.add( createTreeAt(600,-750));
scene.add(createTreeAt(-750,-1000));
scene.add(createTreeAt(750,-1000));



//Collision detection


//we need to set a circle arount the stadium
var geometry = new THREE.CircleGeometry(9500, 50);
var material = new THREE.MeshBasicMaterial( {  opacity: 0.1} );
material.visible = false;
//Stadion Circle = Allowed Zone
var circle = new THREE.Mesh( geometry, material );
circle.position.y = -80;
circle.rotation.x += -Math.PI/2;
forbiddenZones.push(circle);
scene.add( circle );



/**
 * detect collision
 * @returns {boolean}
 */
function detectCollisions() {
    if(detectFlyThrough(flyTroughObjects, flyOverObjects))
        console.log("Heureka!");
    var vector = new THREE.Vector3(0,-1,0);
    var rayCaster = new THREE.Raycaster(marker.position, vector);
    var intersect = rayCaster.
    intersectObjects(forbiddenZones);
    //console.log("Länge des Intersect " + intersect.length);

    if (intersect.length === 0){
        crash =true;
        //console.log("Crash: " +crash)
        return false;
    }
    else{
        return true;
    }
   // return (intersect.length === 0);
}


function detectFlyThrough(flyThroughObjects, flyOverObjects) {
    var frontVector = new THREE.Vector3(0,0,-1);
    var frontRayCaster = new THREE.Raycaster(marker.position, frontVector);
    var frontIntersect = frontRayCaster.intersectObjects(flyThroughObjects);

    var bottomVector = new THREE.Vector3(0,-1,0);
    var bottomRayCaster = new THREE.Raycaster(marker.position, bottomVector);
    var bottomIntersect = bottomRayCaster.intersectObjects(flyOverObjects);
   // console.log('front' + frontIntersect.length)
   // console.log('bottom' + bottomIntersect.length)
    if(frontIntersect.length > 0 && bottomIntersect.length > 0){

        return true;

    }
    else{

        return false;
    }

}


init();



function init() {

   var ambient = new THREE.AmbientLight( 0xAAAAAA);
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
    directionalLight.position.set( 200, 500, 100 ).normalize();
    directionalLight.rotateX(Math.PI*0.5);
    scene.add( directionalLight );

    // model

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    var mtlLoader = new THREE.MTLLoader();

    mtlLoader.load( 'objects/DroneV1.mtl', function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );

        objLoader.load( 'objects/DroneV1.obj', function ( object ) {

            mesh = object;
            //mesh.position.Y = -200;
            //mesh.position.X = 3000;
            //mesh.position.Z = 200;
           
            mesh.scale.set(20, 20, 20);
            marker.add(mesh);

            //Temporary, use instead of marker
            //scene.add( mesh );

        }, onProgress, onError );

    });



    mtlLoader.load( 'objects/Stadium.mtl', function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );

        objLoader.load( 'objects/Stadium.obj', function ( object ) {

            bonooneStadium = object;
            //mesh.position.Y = -200;
            //mesh.position.X = 3000;
            //mesh.position.Z = 200;
            //bonooneStadium.rotation.y = Math.PI*1.5;
            bonooneStadium.boundingSphere
            bonooneStadium.scale.set(2000, 2000, 2000);
            bonooneStadium.position.set(0,-150,0);
            scene.add(bonooneStadium);



        }, onProgress, onError );

    });

}


//EndPasted






document.addEventListener('keydown', function (event) {
  //console.log("Key Pressed: " + event.keyCode);
    event.preventDefault();



    var code = event.keyCode;



    switch (code){
        case 87:
            //Move Upwards w
            moveDroneUp = true;
            break;
        case 83:
            //Move Down s
            moveDroneDown = true;
            break;
        case 65:
            //Rotate Left a
            rotateLeft = true;
            break;
        case 68:
            //Rotate right d
            //TODO: Hier der Algorithmusch
            rotateRight = true;
            break;
        case 38:
            //Move Forward Arrow up
            moveForward = true;

            mesh.rotation.x = Math.PI * -0.05;
            break;
        case 40:
            //Move Backwards Arrow down
            moveBackward = true;
            mesh.rotation.x = Math.PI * 0.05;
            break;
        case 37:
            //Move Left arrow left
            moveLeft = true;
            mesh.rotation.z = Math.PI * 0.05;

            break;
        case 39:
            //Move right arrow right
            moveRight = true;
            mesh.rotation.z = Math.PI * -0.05;
            break;
    }


})






document.addEventListener('keyup', function (event) {
    var code = event.keyCode;

    switch (code){
        case 87:
            //Move Upwards w
            moveDroneUp = false;
            break;
        case 83:
            //Move Down s
            moveDroneDown = false;
            break;
        case 65:
            //Rotate Left a
            rotateLeft = false;
            break;
        case 68:
            //Rotate right d
            rotateRight = false;
            break;
        case 38:
            //Move Forward Arrow up

            setTimeout(function () {
                moveForward = false;
                mesh.rotation.x = Math.PI * 0;

            }, 100)

            break;
        case 40:
            //Move Backwards Arrow down
            mesh.rotation.x = Math.PI * 0;
            moveBackward = false;
            break;
        case 37:
            //Move Left arrow left
            moveLeft = false;
            mesh.rotation.z = Math.PI * 0;
            break;
        case 39:
            //Move right arrow right
            moveRight = false;
            mesh.rotation.z = Math.PI * 0;
            break;
    }


})




function animate() {
    requestAnimationFrame(animate);

    //Reset Drone if crashed
    droneDidCrash();

    //Handle Control of Drone by Flags

    if (moveForward) {

        if (detectCollisions()) {
        var tempMoveObj = calcMovement(globalAngle, speedForward, 38);
        //console.log(tempMoveObj.Z + " " + tempMoveObj.X)
        marker.position.z += tempMoveObj.Z;
        marker.position.x += tempMoveObj.X;
        //marker.position.z -= speedForward;
    }
        /**if(detectVerticalCollisions(ringBlock, yBoundaries) && hindernisse[0] === false){
            gameScore++;
            console.log("Game Score: " + gameScore);
            hindernisse[0] = true;
        }*/


    }
    if (moveBackward){
        if (detectCollisions()) {
        var tempMoveObj = calcMovement(globalAngle, speedBackwards, 40);

        marker.position.z += tempMoveObj.Z;
        marker.position.x += tempMoveObj.X;
        //marker.position.z += speedBackwards;
    }}
    if (moveLeft){
        if (detectCollisions()) {
            var tempMoveObj = calcMovement(globalAngle, speedSidewards, 37);
            marker.position.z += tempMoveObj.Z;
            marker.position.x += tempMoveObj.X;
        }
            //marker.position.x -= speedSidewards;
    }
    if (moveRight){
        if (detectCollisions()) {
            var tempMoveObj = calcMovement(globalAngle, speedSidewards, 39);
            marker.position.z += tempMoveObj.Z;
            marker.position.x += tempMoveObj.X;
        }
        //marker.position.x += speedSidewards;
    }
    if (rotateLeft){
        collisionBool = true;
        globalAngle += speedRotationRadian;
        //console.log(globalAngle);
        marker.rotation.y += speedRotationRadian;
    }
    if (rotateRight){
        collisionBool = true;
        globalAngle -= speedRotationRadian;
        //console.log(globalAngle);
        marker.rotation.y -= speedRotationRadian;
    }
    if (moveDroneUp){
        marker.position.y += speedUpDown;

    }
    if (moveDroneDown){
        if (marker.position.y > boundaryBottom){
            marker.position.y -= speedUpDown;
            //console.log("Höhe : "+marker.position.y)
        }

    }






    renderer.render(scene,camera);
}
animate();



//Wald
function createTreeAt(x, z){
    var trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(50,50,20),
        new THREE.MeshBasicMaterial({color: 0xA0522D})
    );

    var top = new THREE.Mesh(
        new THREE.SphereGeometry(150,20, 20),
        new THREE.MeshBasicMaterial({color: 0x228B22})
    );

    top.position.y = 175;
    trunk.add(top);
    trunk.position.set(x, 0, z);
    return trunk;

}

function droneDidCrash(){
    if (crash){
        marker.position.set(0,0,0);
        setTimeout(function(){
            crash = false;
        }, 3000);



    }
}


/**
 *Area where the TEst Objects are stored
 */
var ringBlock = [];

var ringGeometry = new THREE.RingGeometry(200,250, 30);
var ringMaterial = new THREE.MeshBasicMaterial();
ringMaterial.side = THREE.DoubleSide;
var flyTrueRingMesh = new THREE.Mesh(ringGeometry,ringMaterial);
flyTrueRingMesh.position.x = 250;
flyTrueRingMesh.position.y = 250;
var flyOverBoxGeometry = new THREE.BoxGeometry(500, 1, 10);
var flyOverBoxMaterial = new THREE.MeshBasicMaterial();
flyOverBoxMaterial.side = THREE.DoubleSide;
var flyOverBox = new THREE.Mesh(flyOverBoxGeometry, flyOverBoxMaterial);
flyOverBox.position.x = 250;
//ringBottomMesh.position.y = 250;


var circleGeo = new THREE.CircleGeometry(200,30);
var circlmeMat = new THREE.MeshBasicMaterial({color: 0x69201C});
circlmeMat.side = THREE.DoubleSide;
var circleMesh = new THREE.Mesh(circleGeo, circlmeMat);
circleMesh.position.x = 250;
circleMesh.position.y = 250;

flyTroughObjects.push(circleMesh);
flyOverObjects.push(flyOverBox);

ringBlock.push(circleMesh);
forbiddenZones.push(flyTrueRingMesh);
yBoundaries.push(flyTrueRingMesh);
scene.add(circleMesh);
scene.add(flyTrueRingMesh);
scene.add(flyOverBox);
