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





/**
 function calcMovement
 This function uses current rotation and pace of
 an object to calculate how far it has to move on
 X and Z in one iteration (pace).
 It uses quadrants to calculate if
 the change of position is negative and positive and
 weather sin or cos hast to be used.


 Param "direction" is an int; you give me the keycode between 37 and 40,
 so the function can determine in which direction relative to the current rotation you want to move

 */

function calcMovement (angle, pace, direction){
    var quadrant, net_angle, moveZ, moveX, PiHalf;
    quadrant = -1;
    PiHalf = Math.PI/2;





    //if (direction==false) angle -= PiHalf*2;

    while (angle<0) { angle+=PiHalf*4; }

    switch (direction) {
        case 37:
            angle += PiHalf;
            break;
        case 39:
            angle += PiHalf*3;
            break;
        case 40:
            angle += PiHalf*2;
            break;
        case 38:
            angle = angle;
            break;
    }

    for (var i = angle; i >= 0; i -= PiHalf) {quadrant++;}
    quadrant = quadrant % 4;

    net_angle = angle % PiHalf;

    if (net_angle < 0) net_angle += PiHalf*4;

    //console.log("Quadrant: " + quadrant+ " Angle: " + net_angle);


    switch (quadrant) {
        case 0:
            moveZ = -(Math.cos(net_angle)*pace);
            moveX = -(Math.sin(net_angle)*pace);
            break;
        case 1:
            moveZ = (Math.sin(net_angle)*pace);
            moveX = -(Math.cos(net_angle)*pace);
            break;
        case 2:
            moveZ = (Math.cos(net_angle)*pace);
            moveX = (Math.sin(net_angle)*pace);
            break;
        case 3:
            moveZ = -(Math.sin(net_angle)*pace);
            moveX = (Math.cos(net_angle)*pace);
            break;
    }
    var move = {};
    move.X = moveX;
    move.Z = moveZ;
    //console.log("X: " + move.X + "Z: " + move.Z);

    return move;


}
