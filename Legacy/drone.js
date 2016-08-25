/**
 * Created by simonstehle on 21.07.16.
 */

/**
 * This file is for loading the drone and controls
 */









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









//Pasted

var container, stats, drone_mesh, bonooneStadium;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;





scene.add(createTreeAt(-500,0));
scene.add( createTreeAt(600,-750));
scene.add(createTreeAt(-750,-1000));
scene.add(createTreeAt(750,-1000));



//Collision detection


//we need to set a stadium_allowedCircle around the stadium




/**
 * detect collision
 * @returns {boolean}
 */
function detectCollisions() {
    if(detectFlyThrough(flyTroughObjects, flyOverObjects))
        console.log("Heureka!");
    var vector = new THREE.Vector3(0,-1,0);
    var rayCaster = new THREE.Raycaster(droneMarker.position, vector);
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
    var frontRayCaster = new THREE.Raycaster(droneMarker.position, frontVector);
    var frontIntersect = frontRayCaster.intersectObjects(flyThroughObjects);

    var bottomVector = new THREE.Vector3(0,-1,0);
    var bottomRayCaster = new THREE.Raycaster(droneMarker.position, bottomVector);
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

    

    // model

    

    

    

   

   



   

}


//EndPasted







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
