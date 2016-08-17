/**
 * Created by simonstehle on 03.08.16.
 */


//Marker for grouping object, drone and droneCamera
var marker = new THREE.Object3D();

marker.add(droneCamera);

var drone_mesh;
initDrone01();
// console.log(drone_mesh);
// marker.add(drone_mesh);

scene.add(marker);

initBonooneStadium();

function animate() {
    requestAnimationFrame(animate);

    //Reset Drone if crashed
    droneDidCrash();

    //Handle Control of Drone by Flags

    drone_movement();

    renderer.render( scene, textureCamera, firstRenderTarget, true );
    // slight problem: texture is mirrored.
    //    solve problem by rendering (and hence mirroring) the texture again
    // render another scene containing just a quad with the texture
    //    and put the result into the final texture
    renderer.render( screenScene, screenCamera, finalRenderTarget, true );
    renderer.render( scene,droneCamera); 
}
animate();