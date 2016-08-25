/**
 * Created by simonstehle on 03.08.16.
 */
"use strict";

/**
 * Circle to set the allowed zone for the drones to fly in
 * @type {THREE.Mesh}
 */



/**
 * Can this be deleted?
 * @param xhr
 */
var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        //console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
};

/**
 * Can this be deleted?
 * @param xhr
 */
var onError = function ( xhr ) { };
THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );


/**
 * Importing the Libraries for loading and placing the models into the scene
 */


function initBonooneStadium(){

    mtlLoader.load( 'objects/Stadium.mtl', function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );

        objLoader.load( 'objects/Stadium.obj', function ( object ) {

            var bonooneStadium = object;
            bonooneStadium.boundingSphere;
            bonooneStadium.scale.set(2000, 2000, 2000);
            bonooneStadium.position.set(0,-150,0);
            scene.add(bonooneStadium);

        }, onProgress, onError );

    });
    
    
    
}

var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load('objects/Grass_1.png');
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 30,30 );


var grassMaterial = new THREE.MeshPhysicalMaterial( {
    color: 0xffffff,
    specular:0xffffff,
    shininess: 10,
    map: texture,
    combine: THREE.MixOperation,
    reflectivity: 0.05
} );


//we need to set a circle around the stadium
var geometry = new THREE.CircleGeometry(9690, 50);
//var material = new THREE.MeshBasicMaterial( {  opacity: 0.1} );
//Stadion Circle = Allowed Zone
var circle = new THREE.Mesh( geometry, grassMaterial );
circle.position.y = -78;
circle.position.x = -235;
circle.rotation.x += -Math.PI/2;
forbiddenZones.push(circle);
scene.add( circle );