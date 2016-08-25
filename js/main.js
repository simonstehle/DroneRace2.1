/**
 * Created by simonstehle on 03.08.16.
 *
 *
 * This file is specially for the animate function and to load the ressources after selecting them inside the
 * indexpage
 */
//Marker for grouping object, drone and droneCamera
var droneMarker = new THREE.Object3D();
droneMarker.add(droneCamera);


/**
 * Initialize the drona.
 */
var drone_mesh;
initDrone01();
scene.add(droneMarker);

/**
 * Load the stadium inside the world
 */
initBonooneStadium();


/**
 * Build the selected Level inside the world
 */
buildLevels();



function animate() {

    requestAnimationFrame(animate);

    //Reset Drone if crashed
    droneDidCrash();

    //Handle Control of Drone by Flags
    drone_movement();
    moveObstacles();
    moveZeppelin(zepCrashFlag);
    rotors.forEach(rotateRotor);


    showSpeed();


    textureCamera.lookAt(droneMarker.position);
    renderer.render( scene, textureCamera, firstRenderTarget, true);
    renderer.render( screenScene, screenCamera, finalRenderTarget, true);

    renderer.render( scene, droneCamera);
    
}
animate();
ResetDrone();
gameLoaded = true;
ResetTargets();

function rotateRotor(element, index)
{
    element.rotation.y += Math.PI*0.2;
}
