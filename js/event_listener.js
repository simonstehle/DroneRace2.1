/**
 * Created by simonstehle on 03.08.16.
 */


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
            rotateRight = true;
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
        case 32:
            zepCrashFlag = true;
            break;
        case 16:
            marker.position.y = 6000;
            break;
    }


});


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
    }


});