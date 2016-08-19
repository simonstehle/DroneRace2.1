/**
 * Created by simonstehle on 03.08.16.
 */


var ringBlock = [];

var ringGeometry = new THREE.RingGeometry(200,250, 30);
var ringMaterial = new THREE.MeshBasicMaterial();
ringMaterial.side = THREE.DoubleSide;
var flyTroughRingMesh = new THREE.Mesh(ringGeometry,ringMaterial);
flyTroughRingMesh.position.x = 250;
flyTroughRingMesh.position.y = 250;
var flyOverBoxGeometry = new THREE.BoxGeometry(500, 1, 10);
var flyOverBoxMaterial = new THREE.MeshBasicMaterial();
flyOverBoxMaterial.side = THREE.DoubleSide;
var flyOverBox = new THREE.Mesh(flyOverBoxGeometry, flyOverBoxMaterial);
flyOverBox.position.x = 250;

var circleGeo = new THREE.CircleGeometry(200,30);
var circlmeMat = new THREE.MeshBasicMaterial({color: 0x69201C});
circlmeMat.side = THREE.DoubleSide;
circlmeMat.visible = false;
var circleMesh = new THREE.Mesh(circleGeo, circlmeMat);
circleMesh.position.x = 250;
circleMesh.position.y = 250;

flyTroughObjects.push(circleMesh);
flyOverObjects.push(flyOverBox);

ringBlock.push(circleMesh);
forbiddenZones.push(flyTroughRingMesh);
yBoundaries.push(flyTroughRingMesh);
scene.add(circleMesh);
scene.add(flyTroughRingMesh);
scene.add(flyOverBox);



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



    }, onProgress, onError );

});