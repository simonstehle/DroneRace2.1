/**
 * Created by simonstehle on 03.08.16.
 */
"use strict";



/**
 * Necessary for loading objects with OBJLoader
 * @param xhr
 */
var onProgress = function (xhr) {
};

/**
 * Necessary for loading objects with OBJLoader
 * @param xhr
 */
var onError = function (xhr) {
};

function initBonooneStadium() {
    mtlLoader.load('objects/Stadium.mtl', function (materials) {
        materials.preload();
        /**
         * Object loader to load 3D objets exported from Blender
         * @type {THREE.OBJLoader}
         */
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load('objects/Stadium.obj', function (object) {
            /**
             * The stadium
             * @type {THREE.Group}
             */
            var bonooneStadium = object;
            bonooneStadium.boundingSphere;
            bonooneStadium.scale.set(2000, 2000, 2000);
            bonooneStadium.position.set(0, -150, 0);
            scene.add(bonooneStadium);

        }, onProgress, onError);

    });


}


/**
 * Texture for the ground
 */
var groundTexture = textureLoader.load('objects/Grass_1.png');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(30, 30);

var grassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 10,
    map: groundTexture,
    combine: THREE.MixOperation,
    reflectivity: 0.05
});

/**
 * Circle geometry for the ground and as allowed zone fly over hit box
 * @type {THREE.CircleGeometry}
 */
var geometry = new THREE.CircleGeometry(9690, 50);
/**
 * Mesh for the ground cirle
 * @type {THREE.Mesh}
 */
var circle = new THREE.Mesh(geometry, grassMaterial);
circle.position.y = -87;
circle.position.x = -235;
circle.rotation.x += -Math.PI / 2;
forbiddenZones.push(circle);
scene.add(circle);