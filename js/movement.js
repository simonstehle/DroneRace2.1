/**
 * Created by simonstehle on 03.08.16.
 */

/**
 * Area for detecting the collisions
 */


/**
 * all legitimate zones are stored in this array,
 * so the drone is only allowed to fly there
 * additionally, there will be forbiddenZones within allowedZones,
 * which resemble the obstacles in the court
 * @type {Array}
 */
var allowedZones = [];

var flyTroughObjects = [];
var flyOverObjects = [];

//Declaration of Moving Flags
/**
 * is true when when keyUp is pressed
 * @type {boolean}
 */
var moveForward = false;

/**
 * is true when keyDown is pressed
 * @type {boolean}
 */
var moveBackward = false;
/**
 * is true when moveLeft is pressed
 * @type {boolean}
 */
var moveLeft = false;

/**
 * is true when moveRight is pressed
 * @type {boolean}
 */
var moveRight = false;

//Declaration of rotation Flags
var rotateLeft = false;
var rotateRight = false;

//Declaration of Up and Down Flags
var moveDroneUp = false;
var moveDroneDown = false;

//Var for the glogal Angle to control the Drone after rotating around y
var globalAngle = 0;

// flags that do not rely on key-control but on inertia
var movingForward = false;
var movingBackward = false;
var movingLeft = false;
var movingRight = false;

//Declaration of Speed Variables
var speedForward = 50;
var speedBackwards = 50;
var speedSidewards = 40;
var speedRotationRadian = 0.05;
var speedUpDown = 20;

var maxSpeed = 300;
var maxAcceleration = 7;
var currentSpeed = 0;

var boundaryBottom = -80;
var forbiddenZones = [];
var crash = false; //set true if someone crashes the drone

//vars to score the Game
var yBoundaries = [];
var gameScore = 0;
var hindernisse = [];
hindernisse[0] = false;

function resetMoving () {
    movingForward = false;
    movingBackward = false;
    movingLeft = false;
    movingRight = false;
}



function drone_movement() {
    if (detectCollisions()) {
        if (moveForward && movingForward && !movingBackward) calcMovement(true, 38, false);
        if (moveBackward && movingBackward && !movingForward) calcMovement(true, 40, false);
        if (moveLeft && movingLeft && !movingRight) calcMovement(true, 37, false);
        if (moveRight && movingRight && !movingLeft) calcMovement(true, 39, false);

        if (!moveForward && movingForward) calcMovement(false, 38, false);
        if (!moveBackward && movingBackward) calcMovement(false, 40, false);
        if (!moveLeft && movingLeft) calcMovement(false, 37, false);
        if (!moveRight && movingRight) calcMovement(false, 39, false);

        if (moveBackward && movingForward) calcMovement(false, 38, true);
        if (moveForward && movingBackward) calcMovement(false, 40, true);
        if (moveRight && movingLeft) calcMovement(false, 37, true);
        if (moveLeft && movingRight) calcMovement(false, 39, true);

         /*
        if (!moveBackward ) calcMovement(true, 40);
        if (!moveLeft ) calcMovement(true, 37);
        if (!moveRight ) calcMovement(true, 39);

        //if (!moveForward && movingForward) addMovementDelta(currentSpeed,38);
        */

    }

    if (rotateLeft) rotateOnYaxis(65);
    if (rotateRight) rotateOnYaxis(68);

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



function rotateOnYaxis (keycode) {
    collisionBool = true;
    switch (keycode) {
        case 65:
            globalAngle += speedRotationRadian;
            marker.rotation.y += speedRotationRadian;
            break;
        case 68:
            globalAngle -= speedRotationRadian;
            marker.rotation.y -= speedRotationRadian;
            break;
    }
}

function droneDidCrash(){
    if (crash){
        marker.position.set(0,0,8000);
        currentSpeed = 0;
        resetMoving();
        setTimeout(function(){
            crash = false;
        }, 500);
    }
}

/*
function addOrSubstractSpeed(aMax, vMax, vCurr) {
    var speedToAdd;
    if (moveForward) {
        acc(aMax, vMax, vCurr);
    }
    else if(!moveForward && movingForward) {
        negAcc(aMax, vMax, vCurr)

    }
    return speedToAdd;
}
*/

/**
 * This function uses current rotation and pace of
 an object to calculate how far it has to move on
 X and Z in one iteration (pace).
 It uses quadrants to calculate if
 the change of position is negative and positive and
 weather sin or cos hast to be used.


 Param "direction" is an int; you give me the keycode between 37 and 40,
 so the function can determine in which direction relative to the current rotation you want to move

 * @param forward
 * @param direction

 * @returns {{}}
 */
function calcMovement (inKeyDirection, direction, reverseThrust){

    var angle = globalAngle;
    var speedToAdd = 0;
    var speedToSubtract = 0;

    console.log(currentSpeed);

    if (inKeyDirection) {
        speedToAdd = acc(maxAcceleration, maxSpeed, currentSpeed);
        if (speedToAdd < maxAcceleration / 10) currentSpeed = maxSpeed;
        else currentSpeed += speedToAdd;
    }

    if (!inKeyDirection){
        speedToSubtract = negAcc(maxAcceleration, maxSpeed, currentSpeed);
        if (reverseThrust) {
            //console.log("nur Trägheit: "+speedToSubtract);
            speedToSubtract -= (acc(maxAcceleration, maxSpeed, 0));
            //console.log("mit Thrust : "+speedToSubtract);
        }
        if (speedToSubtract > maxAcceleration / -100 && !reverseThrust) {
            currentSpeed = 0;
            resetMoving();
        }
        else currentSpeed += speedToSubtract;
    }

    if (!inKeyDirection && reverseThrust) {

    }

    var vNew = currentSpeed;


    var quadrant, net_angle, moveZ, moveX, PiHalf;
    quadrant = -1;
    PiHalf = Math.PI/2;

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
            break;
    }

    for (var i = angle; i >= 0; i -= PiHalf) {quadrant++;}
    quadrant = quadrant % 4;

    net_angle = angle % PiHalf;

    if (net_angle < 0) net_angle += PiHalf*4;


    switch (quadrant) {
        case 0:
            moveZ = -(Math.cos(net_angle)*vNew);
            moveX = -(Math.sin(net_angle)*vNew);
            break;
        case 1:
            moveZ = (Math.sin(net_angle)*vNew);
            moveX = -(Math.cos(net_angle)*vNew);
            break;
        case 2:
            moveZ = (Math.cos(net_angle)*vNew);
            moveX = (Math.sin(net_angle)*vNew);
            break;
        case 3:
            moveZ = -(Math.sin(net_angle)*vNew);
            moveX = (Math.cos(net_angle)*vNew);
            break;
    }

    marker.position.z += moveZ;
    marker.position.x += moveX;
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
    var intersect = rayCaster.intersectObjects(forbiddenZones);
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

function getQ (vMax) {
    var q = Math.pow(10, 1/vMax);
    return q;
}

function getNegQ (vMax) {
    var negQ = Math.pow(10, -1/vMax);
    return negQ;
}

function acc(aMax, vMax, vCurr) {
    var q = getQ(vMax);
    var aCurr = aMax*Math.pow(q, -vCurr);
    if (vCurr + aCurr >= vMax) {
        return 0;
    } else {
        return aCurr;
    }
}

function negAcc(aMax, vMax, vCurr) {
    if (vCurr === 0) {
        return 0;
    } else {
        var aStart = aMax * 1/10;
        var qStr = getNegQ(vMax);
        var aCurr = -aStart*Math.pow(qStr, -vCurr);
        if (vCurr + aCurr <= aStart) {
            return vCurr;
        } else {
            return aCurr;

        }
    }
}



/**
 * Ob eine Beschleunigung auf den Pace addiert oder davon subtrahiert wird,
 * hängt davon ab, wie die Bewegung bisher ausgesehen hat.
 * Wurde sich mit arrowUp nach vorne bewegt, dann wirkt bei keyUp die negAcc;
 * wird dann zusätzlich arrowDown gedrückt, wirkt die Beschleunigung in die andere Richtung solange bis pace = 0,
 * danach wird die BEschleunigung wieder positiv
 *
 * NegAcc wirkt bei pace != 0 und wenn keine Taste gedrückt wird
 *
 */
