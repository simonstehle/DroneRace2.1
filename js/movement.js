/**
 * The entire movement of the drone is controlled in this file
 * Several flags are used to control acceleration and movement in each direction
 * Collision detection also happens in this file
 */


/**
 * true when arrowUp is pressed
 * makes the drone accelerate forward relative to the current position and rotation
 * @type {boolean}
 */
var moveForward = false;


/**
 * true when arrowDown is pressed
 * makes the drone accelerate backward relative to the current position and rotation
 * @type {boolean}
 */
var moveBackward = false;


/**
 * true when arrowLeft is pressed
 * makes the drone accelerate left relative to the current position and rotation
 * @type {boolean}
 */
var moveLeft = false;


/**
 * true when arrowRight is pressed
 * makes the drone accelerate right relative to the current position and rotation
 * @type {boolean}
 */
var moveRight = false;



/**
 * true when A is pressed
 * makes the drone rotate around the Y axis anticlockwise
 * @type {boolean}
 */
var rotateLeft = false;


/**
 * true when D is pressed
 * makes the drone rotate around the Y axis clockwise
 * @type {boolean}
 */
var rotateRight = false;


/**
 * true when W is pressed
 * makes the drone move up the Y axis (value increases)
 * @type {boolean}
 */
var moveDroneUp = false;

/**
 * true when W is pressed
 * makes the drone move down the Y axis (value decreases)
 * @type {boolean}
 */
var moveDroneDown = false;

/**
 * angle around which the drone has been rotated relative to the starting position
 * starts at 0, one full rotation is |2*Pi|
 * @type {number}
 */
var globalAngle = 0;

/**
 * the following flags do not entirely rely on keys pressed
 * each becomes true when a certain key is pressed, but remains true when the key is up
 * they represent the drones inertia and become false upon braking
 * braking happens either by inertia or acceleration on the reverse direction
 */

/**
 * is true whenever the drone is moving forward relative to its current position and rotation
 * @type {boolean}
 */
var movingForward = false;

/**
 * is true whenever the drone is moving backward relative to its current position and rotation
 * @type {boolean}
 */
var movingBackward = false;

/**
 * is true whenever the drone is moving left relative to its current position and rotation
 * @type {boolean}
 */
var movingLeft = false;

/**
 * is true whenever the drone is moving right relative to its current position and rotation
 * @type {boolean}
 */
var movingRight = false;

var giveBoost = false;


/**
 * the following variables are global variables that control extent of the movement
 */

/**
 * radian around which the drone is maximally turned around the Y axis; value is lowered with increasing speed
 * @type {number}
 */
var maxRotation = 0.035;

/**
 * speed at which the drone moves up and down the Y axis; value is lowered with increasing speed
 * @type {number}
 */
var speedUpDown = 20;

/**
 * maximal speed the drone can reach by steady acceleration
 * @type {number}
 */
var maxStraightSpeed = 90;

var boostSpeed = 20;

/**
 *
 * @type {number}
 */
var maxSideSpeed = maxStraightSpeed * 0.8;

/**
 * maximal acceleration of the drone at rest (currentStraightSpeed = 0)
 * when maxStraightSpeed is reached, the drone will not accelerate anymore
 * @type {number}
 */
var maxStraightAcceleration = 3;

/**
 *
 * @type {number}
 */
var maxSideAcceleration = maxStraightAcceleration * 0.8;


/**
 * current speed of the drone
 * acceleration at any point is controlled by keys pressed and the current speed
 * the faster the drone, the lower the acceleration
 * @type {number}
 */
var currentStraightSpeed = 0;

/**
 *
 * @type {number}
 */
var currentSideSpeed = 0;

var diagonalMovement = false;

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
var crash = false;





/**
 * this function is called in the "animate()" function in the main.js file and therefor executed all the time
 * at first, cleanUpMovement() checks all the keys pressed to determine whether the drone should now move straight
 * in one direction or diagonally
 *
 * afterwards several combination of flags are checked to determine which params must be passed to calcMovement(),
 * a function where acceleration, breaking and moving with rotation is calculated
 */
function drone_movement() {


    //console.log(currentStraightSpeed, currentSideSpeed);
    if (detectCollisions()) {

        //logPosition();

        // keyDown in moving direction; normal acceleration
        if (moveForward && movingForward && !movingBackward) calcMovement(true, 38, false);
        if (moveBackward && movingBackward && !movingForward) calcMovement(true, 40, false);
        if (moveLeft && movingLeft && !movingRight) calcMovement(true, 37, false);
        if (moveRight && movingRight && !movingLeft) calcMovement(true, 39, false);

        // no keyDown in moving direction, nor against moving direction; slowing by inertia
        if (!moveForward && movingForward) calcMovement(false, 38, false);
        if (!moveBackward && movingBackward) calcMovement(false, 40, false);
        if (!moveLeft && movingLeft) calcMovement(false, 37, false);
        if (!moveRight && movingRight) calcMovement(false, 39, false);

        // keyDown against moving direction: slowing by inertia and braking
        if (moveBackward && movingForward) calcMovement(false, 38, true);
        if (moveForward && movingBackward) calcMovement(false, 40, true);
        if (moveRight && movingLeft) calcMovement(false, 37, true);
        if (moveLeft && movingRight) calcMovement(false, 39, true);

        // keyDown sidewards to moving direction

        if ((moveForward || moveBackward) && (moveLeft || moveRight)) diagonalMovement = true;

        //cleanUpMovement();

    }

    if (rotateLeft) rotateOnYaxis(65);
    if (rotateRight) rotateOnYaxis(68);

    if (moveDroneUp){
        droneMarker.position.y += speedUpDown;
    }
    if (moveDroneDown){
        if (droneMarker.position.y > boundaryBottom){
            droneMarker.position.y -= speedUpDown;
        }
    }
}

/**
 * checks all the keys pressed to determine whether
 * the drone should now move straight in one direction
 * or diagonally
 */
function cleanUpMovement() {
    if (!diagonalMovement) {
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
}


/**
 * makes the drone rotate around the Y axis
 * with increasing speed, the rotation decreases slightly (max: 0.05; min: 0.03)
 * @param keycode - can have two values which determine whether the drone turns clockwise or anticlockwise
 */
function rotateOnYaxis (keycode) {
    var currentRotation;
    currentRotation = maxRotation - currentStraightSpeed / maxStraightSpeed * 0.02;
    switch (keycode) {
        case 65:
            globalAngle += currentRotation;
            droneMarker.rotation.y += currentRotation;
            break;
        case 68:
            globalAngle -= currentRotation;
            droneMarker.rotation.y -= currentRotation;
            break;
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

    var speedToAdd = 0;
    var speedToSubtract = 0;

    var localSpeed;
    var localMaxAcc;
    var localMaxSpeed;

    var straight;

    if (direction === 38 || direction === 40) {
        localSpeed = currentStraightSpeed;
        localMaxAcc = maxStraightAcceleration;
        localMaxSpeed = maxStraightSpeed;
        straight = true;
    }
    if (direction === 37 || direction === 39) {
        localSpeed = currentSideSpeed;
        localMaxAcc = maxSideAcceleration;
        localMaxSpeed = maxSideSpeed;
        straight = false;
    }


    if (rotateRight || rotateLeft) {
        localMaxAcc *= 0.9;
        localMaxSpeed *= 0.9;
    }

    if (inKeyDirection) {
        speedToAdd = acc(localMaxAcc, localMaxSpeed, localSpeed);
        if (speedToAdd < localMaxAcc / 10) localSpeed = localMaxSpeed;
        else localSpeed += speedToAdd;
    }

    if (!inKeyDirection){
        speedToSubtract = negAcc(localMaxAcc, localMaxSpeed, localSpeed);

        if (reverseThrust || diagonalMovement) {
            speedToSubtract -= (acc(localMaxAcc, localMaxSpeed, 0));
        }

        if (speedToSubtract > localMaxAcc / -100 || localSpeed <= 0) {
            localSpeed = 0;
            if (straight) resetStraight();
            else (resetSide());
        }
        else {
            localSpeed += speedToSubtract;
        }
    }



    if (rotateRight || rotateLeft) {
        var quotientVMax = localSpeed / localMaxSpeed;
        quotientVMax *= 0.5;
        vNew *= 1-quotientVMax;
    }

    var vNew = localSpeed;

    var angle = globalAngle;
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

    droneMarker.position.z += moveZ;
    droneMarker.position.x += moveX;

    if (direction === 38 || direction === 40) {
        currentStraightSpeed = localSpeed;
    }
    else if (direction === 37 || direction === 39) {
        currentSideSpeed = localSpeed;
    }

}


/**
 * function to reset all the moving___ flags to false
 * is used
 * - when the drone has crashed and is respawned and therefor not moving
 * - when the drone has reached currentStraightSpeed = 0 and is therefor not moving in any direction
 */
function resetStraight () {
    movingForward = false;
    movingBackward = false;
    currentStraightSpeed = 0;
}

function resetSide() {
    movingLeft = false;
    movingRight = false;
    currentSideSpeed = 0;
}

/**
 * checks all the keys pressed to determine whether
 * the drone should now move straight in one direction
 * or diagonally
 */
function cleanUpMovement() {
    if (!diagonalMovement) {
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
}


/**
 * makes the drone rotate around the Y axis
 * with increasing speed, the rotation decreases slightly (max: 0.05; min: 0.03)
 * @param keycode - can have two values which determine whether the drone turns clockwise or anticlockwise
 */
function rotateOnYaxis (keycode) {
    var currentRotation;
    currentRotation = maxRotation - currentStraightSpeed / maxStraightSpeed * 0.02;
    switch (keycode) {
        case 65:
            globalAngle += currentRotation;
            droneMarker.rotation.y += currentRotation;
            break;
        case 68:
            globalAngle -= currentRotation;
            droneMarker.rotation.y -= currentRotation;
            break;
    }
}

/**
 * when the global variable "crash" is true, the drone is respawned at the start/finish line including a 0.5 s timeout
 */
function droneDidCrash(){
    if (crash){
        droneMarker.position.set(-8000,0,400);
        droneMarker.rotation.y = 0;
        globalAngle = 0;
        resetStraight();
        resetSide();
        setTimeout(function(){
            crash = false;
        }, 500);
        ResetTargets();
    }
}

/**
 * helper function for acc(), calculates on value
 * @param vMax
 * @returns {number}
 */
function getQ (vMax) {
    var q = Math.pow(10, 1/vMax);
    return q;
}

/**
 * helper function for negAcc(), calculates on value
 * @param vMax
 * @returns {number}
 */
function getNegQ (vMax) {
    var negQ = Math.pow(10, -1/vMax);
    return negQ;
}

/**
 * uses the three variables (current and maximal speed, maximal acceleration)
 * to calculate the next acceleration
 * @param aMax - maxStraightSpeed of the drone
 * @param vMax
 * @param vCurr
 * @returns {number} - this int is added to the current speed
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
 * uses the three variables (current and maximal speed, maximal acceleration)
 * to calculate the braking effect by not acceleration anymore
 * @param aMax
 * @param vMax
 * @param vCurr
 * @returns {number} - this int is subtracted from the current speed
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

function logPosition() {
    console.log(droneMarker.position.x + "; " + droneMarker.position.z);
}