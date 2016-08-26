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


/**
 * the following variables are global variables that control the settings of the movement
 */

/**
 * radian around which the drone is maximally turned around the Y axis; value is lowered with increasing speed
 * @type {number}
 */
var maxRotation = 0.03;

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


/**
 * maximum side speed the drone can reach by steady acceleration
 * @type {number}
 */
var maxSideSpeed = 80;

/**
 * maximal acceleration of the drone at rest (currentStraightSpeed = 0)
 * when maxStraightSpeed is reached, the drone will not accelerate anymore
 * @type {number}
 */
var maxStraightAcceleration = 3;

/**
 * maximal acceleration of the drone at rest (currentSideSpeed = 0)
 * when maxSideSpeed is reached, the drone will not accelerate anymore
 * @type {number}
 */
var maxSideAcceleration = 2.7;


/**
 * current straight speed of the drone
 * acceleration at any point is controlled by keys pressed and the current speed
 * the faster the drone, the lower the acceleration
 * @type {number}
 */
var currentStraightSpeed = 0;

/**
 * current straight speed of the drone
 * @type {number}
 */
var currentSideSpeed = 0;


/**
 * is true when two arrow keys are pressed and their directions form a rectangle
 * @type {boolean}
 */
var diagonalMovement = false;

/**
 * the drone can not fly lower than this boundary
 * @type {number}
 */
var boundaryBottom = -80;

/**
 * this function is called in the "animate()" function in the main.js file and therefor executed all the time
 * at first, cleanUpMovement() checks all the keys pressed to determine whether the drone should now move straight
 * in one direction or diagonally
 *
 * afterwards several combination of flags are checked to determine which params must be passed to calcMovement(),
 * a function where acceleration, breaking and moving with rotation is calculated
 */
function drone_movement() {

    // console.log(currentStraightSpeed);
    // console.log(droneMarker.position.x, droneMarker.position.z);

    if (detectCollisions()) {
        rotateOnYAxis();
        moveUpAndDown();

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
    }
}

/**
 *
 * This is the function that unifies both functions that calculate the movement
 * at first, with all the flags from droneMovement, the acceleration is calculated and then
 * applied to the direction in X and Z where the drone should move
 *
 *
 * @param inKeyDirection {boolean} - is the drone moving in the direction of the key that is pressed?
 * @param direction {number} - in which direction should the drone be accelerated
 * @param reverseThrust {boolean} - should the drone be accelerated against the current moving direction?
 */
function calcMovement(inKeyDirection, direction, reverseThrust) {
    calculateDirection(direction,(calculateAcceleration(inKeyDirection, direction, reverseThrust)));
}

/**
 * Uses all the movement settings (flags, current and maximal speed, etc.) to calculate
 * how much the drone should move in the next iteration
 * helper function acc() and negAcc() are used to calculate the numbers themselves
 * combinations of flags are used to determine what acceleration must be added to what speed
 *
 * @param inKeyDirection {boolean} - is the drone moving in the direction of the key that is pressed?
 * @param direction {number} - in which direction should the drone be accelerated
 * @param reverseThrust {boolean} - should the drone be accelerated against the current moving direction?
 * @returns {number}
 */
function calculateAcceleration(inKeyDirection, direction, reverseThrust) {
    /**
     * how much the drone does accelerate in this iteration
     * @type {number}
     */
    var speedToAdd = 0;

    /**
     * how much the drone does break in this iteration
     * @type {number}
     */
    var speedToSubtract = 0;

    /**
     * straight or side speed depending in direction
     * @type {number}
     */
    var localSpeed = 0;

    /**
     * straight or side maxAcc depending on direction
     * @type {number}
     */
    var localMaxAcc = 0;

    /**
     * straight or side maxSpeed depending on direction
     * @type {number}
     */
    var localMaxSpeed = 0;

    /**
     * true when the drone moves straight
     * @type {boolean}
     */
    var straight;

    /**
     * checks which settings must be used
     */
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

    /**
     * determines how much in which direction the drone should accelerate / brake
     */
    if (inKeyDirection) {
        speedToAdd = acc(localMaxAcc, localMaxSpeed, localSpeed);
        if (speedToAdd < localMaxAcc / 10) localSpeed = localMaxSpeed;
        else localSpeed += speedToAdd;
    }
    if (!inKeyDirection) {
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

    return localSpeed;
}

/**
 * Calculates how much on the X and Z axis the drone moves,
 * which depends on the rotation around the Y-axis (globalAngle)
 * and on the key that is pressed (direction)
 *
 * @param direction {number}
 * @param localSpeed {number}
 */
function calculateDirection (direction, localSpeed) {

    /**
     * calculated new speed which is now needed to calc the exact movement
     * @type {number}
     */
    var vNew = localSpeed;

    /**
     * angle around which the marker / drone has already been turned
     * become the net angle relative to a quarter circle
     * @type {number}
     */
    var net_angle = globalAngle;

    /**
     * quadrant of the XZ coordinate system in which the direction is pointing
     * @type {number}
     */
    var quadrant = -1;

    /**
     * how much the drone moves on Z
     * @type {number}
     */
    var moveZ;

    /**
     * how much the drone moves on X
     * @type {number}
     */
    var moveX;

    /**
     * shortcut to the radian which amount a quarter of a full circle
     * @type {number}
     */
    var PiHalf = Math.PI / 2;


    while (net_angle < 0) {
        net_angle += PiHalf * 4;
    }

    switch (direction) {
        case 37:
            net_angle += PiHalf;
            break;
        case 39:
            net_angle += PiHalf * 3;
            break;
        case 40:
            net_angle += PiHalf * 2;
            break;
        case 38:
            break;
    }

    for (var i = net_angle; i >= 0; i -= PiHalf) {
        quadrant++;
    }
    quadrant = quadrant % 4;

    net_angle = net_angle % PiHalf;

    if (net_angle < 0) net_angle += PiHalf * 4;


    switch (quadrant) {
        case 0:
            moveZ = -(Math.cos(net_angle) * vNew);
            moveX = -(Math.sin(net_angle) * vNew);
            break;
        case 1:
            moveZ = (Math.sin(net_angle) * vNew);
            moveX = -(Math.cos(net_angle) * vNew);
            break;
        case 2:
            moveZ = (Math.cos(net_angle) * vNew);
            moveX = (Math.sin(net_angle) * vNew);
            break;
        case 3:
            moveZ = -(Math.sin(net_angle) * vNew);
            moveX = (Math.cos(net_angle) * vNew);
            break;
    }

    droneMarker.position.z += moveZ;
    droneMarker.position.x += moveX;

    if (direction === 38 || direction === 40) {
        currentStraightSpeed = vNew;
    }
    else if (direction === 37 || direction === 39) {
        currentSideSpeed = vNew;
    }

}

/**
 * uses flags to determine whether the drone should move up or down the Y axis
 * the speed on the Y axis slightly decreases, the faster the drone is straight and sidewards
 */
function moveUpAndDown() {
    /**
     * speed the drone moves up and down depending on straight and side speed
     * @type {number}
     */
    var currentSpeedUpDown = speedUpDown - ((currentStraightSpeed / maxStraightSpeed) + (currentSideSpeed / maxSideSpeed)) / 2 * 5;
    if (moveDroneUp ) {
        droneMarker.position.y += currentSpeedUpDown;
    }
    if (moveDroneDown) {
        if (droneMarker.position.y > boundaryBottom) {
            droneMarker.position.y -= currentSpeedUpDown;
        }
    }
}

/**
 * makes the drone rotate around the Y axis
 * with increasing speed, the rotation decreases slightly (max: 0.05; min: 0.03)
 */
function rotateOnYAxis() {

    /**
     * radian around which the drone rotates depending on straight and side speed
     * @type {number}
     */
    var currentRotation = maxRotation - (currentStraightSpeed / maxStraightSpeed)  * 0.01;
    if (rotateLeft) {
        globalAngle += currentRotation;
        droneMarker.rotation.y += currentRotation;
    }
    if (rotateRight) {
        globalAngle -= currentRotation;
        droneMarker.rotation.y -= currentRotation;
    }
}


/**
 * function to reset all the straight moving flags to false
 * is used
 * - when the drone has crashed and is respawned and therefore not moving
 * - when the drone has reached currentStraightSpeed = 0 and is therefore not moving in any direction
 */
function resetStraight() {
    movingForward = false;
    movingBackward = false;
    currentStraightSpeed = 0;
}

/**
 * function to reset all the side moving flags to false
 * is used
 * - when the drone has crashed and is respawned and therefore not moving
 * - when the drone has reached currentStraightSpeed = 0 and is therefore not moving in any direction
 */
function resetSide() {
    movingLeft = false;
    movingRight = false;
    currentSideSpeed = 0;
}


/**
 * helper function for acc(), calculates one value
 * @param vMax {number} - maximum speed in the used direction
 * @returns {number} - q which is needed to calcualte
 */
function getQ(vMax) {
    return q = Math.pow(10, 1 / vMax);
}

/**
 * helper function for negAcc(), calculates one value
 * @param vMax {number} - maximum speed in the used direction
 * @returns {number} - q which is needed to calcualte
 */
function getNegQ(vMax) {
    return negQ = Math.pow(10, -1 / vMax);
}

/**
 * uses the three variables (current and maximal speed, maximal acceleration)
 * to calculate the next acceleration
 * @param aMax
 * @param vMax
 * @param vCurr
 * @returns {number} - this int is added to the current speed
 */
function acc(aMax, vMax, vCurr) {
    var q = getQ(vMax);
    var aCurr = aMax * Math.pow(q, -vCurr);
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
        var aStart = aMax * 1 / 10;
        var qStr = getNegQ(vMax);
        var aCurr = -aStart * Math.pow(qStr, -vCurr);
        if (vCurr + aCurr <= aStart) {
            aCurr = vCurr;
            return aCurr;
        } else {
            return aCurr;

        }
    }
}