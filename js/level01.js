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