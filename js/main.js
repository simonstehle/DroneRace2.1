/**
 * Created by simonstehle on 03.08.16.
 */
//Marker for grouping object, drone and droneCamera
var marker = new THREE.Object3D();
marker.add(droneCamera);

var drone_mesh;
initDrone01();
//marker.add(drone_mesh);

scene.add(marker);





initBonooneStadium();

function animate() {
    requestAnimationFrame(animate);

    //Reset Drone if crashed
    droneDidCrash();

    //Handle Control of Drone by Flags

    drone_movement();
    moveZeppelin(zepCrashFlag);
    rotors.forEach(rotateRotor);


    showSpeed();


    textureCamera.lookAt(marker.position);
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
