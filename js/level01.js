/**
 * Created by simonstehle on 03.08.16.
 */



AddTargetRing(200, 250, 250, 250, 0,Math.PI*.25);
AddTargetRing(2000, 2500, 2500, 2500, 1000,0);

build3WallObstacle(1000,2000,3000,1500, Math.PI * 0.25);


//Easteregg
var sterlock;
mtlLoader.load( 'objects/SterlockV2.mtl', function( materials ) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );

    objLoader.load( 'objects/SterlockV2.obj', function ( object ) {

        sterlock = object;
        //mesh.position.Y = -200;
        //mesh.position.X = 3000;
        //mesh.position.Z = 200;
        //bonooneStadium.rotation.y = Math.PI*1.5;
        sterlock.boundingSphere
        sterlock.rotation.y = Math.PI;
        sterlock.scale.set(500, 500, 500);
        sterlock.position.set(0,200,9000);
        scene.add(sterlock);



    }, onProgress, onError );

});

var pipe1;
mtlLoader.load( 'objects/Pipe.mtl', function( materials ) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );

    objLoader.load( 'objects/Pipe.obj', function ( object ) {

        pipe1 = object;
        //mesh.position.Y = -200;
        //mesh.position.X = 3000;
        //mesh.position.Z = 200;
        //bonooneStadium.rotation.y = Math.PI*1.5;
        pipe1.boundingSphere
        pipe1.rotation.y = Math.PI*0.5;
        pipe1.scale.set(200, 200, 200);
        pipe1.position.set(0,100,-1000);
        scene.add(pipe1);
        forbiddenZones.push(pipe1);


    }, onProgress, onError );

});