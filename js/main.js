/**
 * Created by simonstehle on 03.08.16.
 *
 *
 * This file is specially for the animate function and to load the ressources after selecting them inside the
 * indexpage
 */

/**
 * Marker for grouping object, drone and droneCamera
 * @type {THREE.Object3D}
 */
var droneMarker = new THREE.Object3D();
droneMarker.add(droneCamera);


/**
 * Mesh of the drone
 * @type {THREE.Group}
 */
var drone_mesh;
initDrone01();
init();
scene.add(droneMarker);

/**
 * Load the stadium inside the world
 */
initBonooneStadium();


/**
 * Build the selected Level inside the world
 */
buildLevels();

/**
 * Animate function gets called for every frame to update and render the game
 */
function animate() {

    requestAnimationFrame(animate);

    //Handle Control of Drone by Flags
    drone_movement();
    moveObstacles();
    moveZeppelin(zepCrashFlag);
    rotors.forEach(rotateRotor);

    showSpeed();


    textureCamera.lookAt(droneMarker.position);
    renderer.render(scene, textureCamera, firstRenderTarget, true);
    renderer.render(screenScene, screenCamera, finalRenderTarget, true);

    renderer.render(scene, droneCamera);

}
animate();
resetDrone();
gameLoaded = true;
resetTargets();
/**
 * Rotate the rotor
 * @param element -element to rotate
 */
function rotateRotor(element) {
    element.rotation.y += Math.PI * 0.3;
}
