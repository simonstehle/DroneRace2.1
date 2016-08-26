/**
 * Created by simonstehle on 03.08.16.
 */


/**
 * JS function on the object "document"
 * uses the keycode of the pressed key to set the corresponding flags
 * and makes the drone tilt a bit
 */
document.addEventListener('keydown', function (event) {

    event.preventDefault();

    var code = event.keyCode;

    switch (code) {
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
            drone_mesh.rotation.z = Math.PI * 0.05;
            break;
        case 68:
            //Rotate right d
            rotateRight = true;
            drone_mesh.rotation.z = Math.PI * -0.05;
            break;

        case 38:
            //Move Forward Arrow up
            moveForward = true;
            movingForward = true;
            drone_mesh.rotation.x = Math.PI * -0.05;
            break;
        case 40:
            //Move Backwards Arrow down
            moveBackward = true;
            movingBackward = true;
            drone_mesh.rotation.x = Math.PI * 0.05;
            break;
        case 37:
            //Move Left arrow left
            moveLeft = true;
            movingLeft = true;
            drone_mesh.rotation.z = Math.PI * 0.05;
            break;
        case 39:
            //Move right arrow right
            moveRight = true;
            movingRight = true;
            drone_mesh.rotation.z = Math.PI * -0.05;
            break;
        case 90:
            zepCrashFlag = true;
            break;
        case 16:
            droneMarker.position.y = 6000;
            break;
    }


});

/**
 * uses the keycode of the key which is moved up to set the corresponding flags
 * and make the drone not tilt anymore
 */
document.addEventListener('keyup', function (event) {
    var code = event.keyCode;

    switch (code) {
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
            drone_mesh.rotation.z = 0;
            rotateLeft = false;
            break;
        case 68:
            //Rotate right d
            drone_mesh.rotation.z = 0;
            rotateRight = false;
            break;
        case 38:
            //Move Forward Arrow up
            moveForward = false;
            drone_mesh.rotation.x = 0;
            break;
        case 40:
            //Move Backwards Arrow down
            drone_mesh.rotation.x = 0;
            moveBackward = false;
            break;
        case 37:
            //Move Left arrow left
            moveLeft = false;
            drone_mesh.rotation.z = 0;
            break;
        case 39:
            //Move right arrow right
            moveRight = false;
            drone_mesh.rotation.z = 0;
            break;
        case 32:
            giveBoost = false;
            break;
    }
});