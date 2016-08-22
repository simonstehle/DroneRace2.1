/**
 * Created by simonstehle on 03.08.16.
 */

function AddTargetRing(innerRadius, outerRadius, positionX, positionY, positionZ, rotationY) {
    var segmentCount = 30;
    var hitBoxInnerRadius = innerRadius - 50;
    var hitBoxOuterRadius = outerRadius + 50;

    var circleGeo = new THREE.CircleGeometry(hitBoxInnerRadius, segmentCount);
    var circleMat = new THREE.MeshBasicMaterial({color: 0x69201C});
    circleMat.side = THREE.DoubleSide;
    circleMat.visible = false;
    var circleMesh = new THREE.Mesh(circleGeo, circleMat);
    circleMesh.position.set(positionX,positionY,positionZ)
    circleMesh.rotation.y = rotationY;

    var flyOverBoxGeometry = new THREE.BoxGeometry(hitBoxOuterRadius*2, 1, maxSpeed+1);
    var flyOverBoxMaterial = new THREE.MeshBasicMaterial();
    flyOverBoxMaterial.side = THREE.DoubleSide;
    flyOverBoxMaterial.visible = false;
    var flyOverBox = new THREE.Mesh(flyOverBoxGeometry, flyOverBoxMaterial);
    flyOverBox.position.x = positionX;
    flyOverBox.position.z = positionZ;
    flyOverBox.rotation.y = rotationY;


    var ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segmentCount);
    var ringMaterial = new THREE.MeshBasicMaterial();
    ringMaterial.side = THREE.DoubleSide;
    var flyThroughRingMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    flyThroughRingMesh.position.set(positionX,positionY,positionZ);
    flyThroughRingMesh.rotation.y = rotationY;

    var ringGeometry = new THREE.RingGeometry(hitBoxInnerRadius, hitBoxOuterRadius, segmentCount);
    var ringMaterial = new THREE.MeshBasicMaterial({color: 0x69201C});
    ringMaterial.side = THREE.DoubleSide;
    ringMaterial.visible = false;
    var hitBoxMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    hitBoxMesh.position.set(positionX,positionY,positionZ);
    hitBoxMesh.rotation.y = rotationY;

    scene.add(circleMesh);
    scene.add(flyThroughRingMesh);
    scene.add(flyOverBox);
    scene.add(hitBoxMesh);

    addTarget(circleMesh,flyOverBox,flyThroughRingMesh, hitBoxMesh);
}