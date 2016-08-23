/**
 * Created by simonstehle on 03.08.16.
 */



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
/**
 *
 * @type {boolean}
 */
var rotateLeft = false;

/**
 *
 * @type {boolean}
 */
var rotateRight = false;

//Declaration of Up and Down Flags
/**
 *
 * @type {boolean}
 */
var moveDroneUp = false;

/**
 *
 * @type {boolean}
 */
var moveDroneDown = false;

//Var for the glogal Angle to control the Drone after rotating around y
/**
 *
 * @type {number}
 */
var globalAngle = 0;

// flags that do not rely on key-control but on inertia
/**
 *
 * @type {boolean}
 */
var movingForward = false;

/**
 *
 * @type {boolean}
 */
var movingBackward = false;

/**
 *
 * @type {boolean}
 */
var movingLeft = false;

/**
 *
 * @type {boolean}
 */
var movingRight = false;

/**
 *
 * @type {number}
 */
var maxRotation = 0.05;

/**
 *
 * @type {number}
 */
var speedUpDown = 20;

/**
 *
 * @type {number}
 */
var maxSpeed = 100;

/**
 *
 * @type {number}
 */
var maxAcceleration = 3;

/**
 *
 * @type {number}
 */
var currentSpeed = 0;

/**
 *
 * @type {number}
 */
var boundaryBottom = -80;

/**
 *
 * @type {Array}
 */
var forbiddenZones = [];

/**
 *
 * @type {boolean}
 */
var crash = false; //set true if someone crashes the drone

//vars to score the Game
/**
 *
 * @type {Array}
 */
var yBoundaries = [];
/**
 *
 * @type {number}
 */
var gameScore = 0;
/**
 *
 * @type {Array}
 */
var hindernisse = [];
hindernisse[0] = false;

/**
 *
 */
function resetMoving () {
    movingForward = false;
    movingBackward = false;
    movingLeft = false;
    movingRight = false;
}


/**
 *
 */
function drone_movement() {
    if (detectCollisions()) {

        cleanUpMovement();

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

function cleanUpMovement() {
    if (movingForward && (moveRight || moveLeft) && !moveForward) {
        movingForward = false;
    }

    if (movingBackward && (moveRight || moveLeft) && !moveBackward) {
        movingBackward = false;
    }

    if (movingLeft && (moveForward || moveBackward) && !moveLeft) {
        movingLeft = false;
    }

    if (movingRight && (moveForward || moveBackward) && !moveRight) {
        movingRight = false;
    }
}


/**
 *
 * @param keycode
 */
function rotateOnYaxis (keycode) {
    collisionBool = true;

    var currentRotation;

    currentRotation = maxRotation - currentSpeed / maxSpeed * 0.02;

    switch (keycode) {
        case 65:
            globalAngle += currentRotation;
            marker.rotation.y += currentRotation;
            break;
        case 68:
            globalAngle -= currentRotation;
            marker.rotation.y -= currentRotation;
            break;
    }
}

/**
 *
 */
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

/**
 * This function uses current rotation (globalAngle) of
 * an object to calculate how far it has to move on
 * X and Z in one iteration (pace).
 *
 * Furthermore, the current speed, the direction
 * in which the object is moving and in which direction the object
 * is accelerated is used the calculate the movement in the next iteration.
 *
 * @param inKeyDirection
 * @param direction
 * @param reverseThrust
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
            speedToSubtract -= (acc(maxAcceleration, maxSpeed, 0));
        }

        if (speedToSubtract > maxAcceleration / -100 || currentSpeed <= 0) {
            currentSpeed = 0;
            resetMoving();
        }
        else {
            currentSpeed += speedToSubtract;
        }
    }



    var vNew = currentSpeed;
    if (rotateRight || rotateLeft) {
        var quotientVMax = currentSpeed / maxSpeed;
        quotientVMax *= 0.5;
        vNew *= 1-quotientVMax;
    }


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
 *
 * @param vMax
 * @returns {number}
 */
function getQ (vMax) {
    var q = Math.pow(10, 1/vMax);
    return q;
}

/**
 *
 * @param vMax
 * @returns {number}
 */
function getNegQ (vMax) {
    var negQ = Math.pow(10, -1/vMax);
    return negQ;
}

/**
 *
 * @param aMax
 * @param vMax
 * @param vCurr
 * @returns {number}
 */
function acc(aMax, vMax, vCurr) {
    var q = getQ(vMax);
    var aCurr = aMax*Math.pow(q, -vCurr);
    if (vCurr + aCurr >= vMax) {
        return 0;
    } else {
        return aCurr;
    }
}

/**
 *
 * @param aMax
 * @param vMax
 * @param vCurr
 * @returns {number}
 */
function negAcc(aMax, vMax, vCurr) {
    if (vCurr === 0) {
        return 0;
    } else {
        var aStart = aMax * 1/10;
        var qStr = getNegQ(vMax);
        var aCurr = -aStart*Math.pow(qStr, -vCurr);
        if (vCurr + aCurr <= aStart) {
            aCurr = vCurr;
            return aCurr;
        } else {
            return aCurr;

        }
    }
}
