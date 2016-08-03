/**
 * Created by simonstehle on 03.08.16.
 */

/**
 * Area for detectingt the collisions
 */


/**
 * Array to store every Object in it, which is needed for the drone
 * to move inside
 * @type {Array}
 */
var allowedZones = [];


var flyTroughObjects = [];
var flyOverObjects = [];

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

//Var for the glogal Angle to control the Drone after rotating around y
var globalAngle = 0;

//Declaration of Speed Variables
var speedForward = 50;
var speedBackwards = 50;
var speedSidewards = 40;
var speedRotationRadian = 0.05;
var speedUpDown = 20;



var boundaryBottom = -80;
var forbiddenZones = [];
var crash = false; //set true if someone crashes the drone

//vars to score the Game
var yBoundaries = [];
var gameScore = 0;
var hindernisse = [];
hindernisse[0] = false;


function addMovementDelta (){
    var tempMoveObj = calcMovement(globalAngle, speedForward, 38);
    //console.log(tempMoveObj.Z + " " + tempMoveObj.X)
    marker.position.z += tempMoveObj.Z;
    marker.position.x += tempMoveObj.X;
}

function drone_movement() {
    if (moveForward) {
        if (detectCollisions()) {
            addMovementDelta();
            //marker.position.z -= speedForward;
        }



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

