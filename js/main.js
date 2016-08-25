/**
 * Created by simonstehle on 03.08.16.
 */
//Marker for grouping object, drone and droneCamera
var droneMarker = new THREE.Object3D();
droneMarker.add(droneCamera);

var drone_mesh;
initDrone01();
//droneMarker.add(drone_mesh);

scene.add(droneMarker);


initBonooneStadium();


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
