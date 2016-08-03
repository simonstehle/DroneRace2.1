/**
 * Created by simonstehle on 03.08.16.
 */
"use strict";

/**
 * Function to initialise the different drones
 * The parameter is selecting the drone
 * 
 * @param droneID
 */
function initDrone01(droneID){

    
    mtlLoader.load( 'objects/DroneV' + droneID + '.mtl', function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );

        objLoader.load( 'objects/DroneV' + droneID + '.obj', function ( object ) {
            //TODO: Check here
            drone_mesh = object;
            drone_mesh.scale.set(20, 20, 20);
            
            
            

        }, onProgress, onError );

    });
    
    

    return drone_mesh;
}

