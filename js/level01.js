/**
 * Created by simonstehle on 03.08.16.
 */


var circleGeo = new THREE.CircleGeometry(150,30);
var circleMat = new THREE.MeshBasicMaterial({color: 0x69201C});
circleMat.side = THREE.DoubleSide;
circleMat.visible = false;
var circleMesh = new THREE.Mesh(circleGeo, circleMat);
circleMesh.position.x = 250;
circleMesh.position.y = 250;

var flyOverBoxGeometry = new THREE.BoxGeometry(600, 1,200);
var flyOverBoxMaterial = new THREE.MeshBasicMaterial();
flyOverBoxMaterial.side = THREE.DoubleSide;
var flyOverBox = new THREE.Mesh(flyOverBoxGeometry, flyOverBoxMaterial);
flyOverBox.position.x = 250;

var ringGeometry = new THREE.RingGeometry(200,250, 30);
var ringMaterial = new THREE.MeshBasicMaterial();
ringMaterial.side = THREE.DoubleSide;
var flyTroughRingMesh = new THREE.Mesh(ringGeometry,ringMaterial);
flyTroughRingMesh.position.x = 250;
flyTroughRingMesh.position.y = 250;

var ringGeometry = new THREE.RingGeometry(150,300, 30);
var ringMaterial = new THREE.MeshBasicMaterial({color: 0x69201C});
ringMaterial.side = THREE.DoubleSide;
ringMaterial.visible = false;
var hitBoxMesh = new THREE.Mesh(ringGeometry,ringMaterial);
hitBoxMesh.position.x = 250;
hitBoxMesh.position.y = 250;


scene.add(circleMesh);
scene.add(flyTroughRingMesh);
scene.add(flyOverBox);
scene.add(hitBoxMesh);

addTarget(circleMesh,flyOverBox,flyTroughRingMesh, hitBoxMesh);

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