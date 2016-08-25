/**
 * Created by simonstehle on 03.08.16.
 */
"use strict";


/**
 * Function to initialise the different drones
 *
 */
function initDrone01() {

    mtlLoader.load('objects/DroneV2.mtl', function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load('objects/DroneV2.obj', function (object) {
            drone_mesh = object;
            drone_mesh.boundingSphere;
            drone_mesh.scale.set(8, 8, 8);
            droneMarker.add(drone_mesh);

            var offsetX = 2.5;
            var offsetY = 0.3;
            var offsetZBack = 1.5;
            var offsetZFront = -3.5;
            var scale = 1.6;

            AddRotor(offsetX, offsetY, offsetZFront, scale);
            AddRotor(offsetX, offsetY, offsetZBack, scale);
            AddRotor(-offsetX, offsetY, offsetZFront, scale);
            AddRotor(-offsetX, offsetY, offsetZBack, scale);

        }, onProgress, onError);

    });


}

function AddRotor(positionX, positionY, positionZ, scale) {
    var rotorMesh;
    mtlLoader.load('objects/Rotor.mtl', function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load('objects/Rotor.obj', function (object) {
            rotorMesh = object;
            rotorMesh.boundingSphere;
            rotorMesh.scale.set(scale, scale, scale);
            rotorMesh.position.set(positionX, positionY, positionZ);
            drone_mesh.add(rotorMesh);
            rotors.push(rotorMesh);

        }, onProgress, onError);

    })
}

