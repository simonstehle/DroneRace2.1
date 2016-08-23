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
    circleMesh.position.set(positionX,positionY,positionZ);
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



function addWallObstacle(width, height,positionX, positionZ, rotationY, flyTrueOnLeft) {
    var wallMarker = new THREE.Object3D();



        //Wall that is an obstacle
        var wallGeo = new THREE.PlaneGeometry(width, height);
        var wallMat = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
        wallMat.side = THREE.DoubleSide;
        var wallMesh = new THREE.Mesh(wallGeo, wallMat);
        wallMesh.position.set(positionX, 0, positionZ);


        //Wall that ist not an obstacle, detects point/success
        var flytrueWallGeo = new THREE.PlaneGeometry(width, height);
        var flytrueWallMat = new THREE.MeshBasicMaterial({color: 0x00FFFF, side: THREE.DoubleSide});
        flytrueWallMat.side = THREE.DoubleSide;
        flytrueWallMat.visible = false;
        var flytrueWallMesh = new THREE.Mesh(flytrueWallGeo, flytrueWallMat);



        //Zylinder to make boundary to score point
        var zylinderGeometry = new THREE.CylinderGeometry( 50, 50, height, 5,5 );
        var zylinderMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var zylinderMesh = new THREE.Mesh( zylinderGeometry, zylinderMaterial );



        if (flyTrueOnLeft){
            flytrueWallMesh.position.set((positionX - width), 0, positionZ); //the Wall to fly true ist based on the right side
            zylinderMesh.position.set(positionX - width*1.5, 0, positionZ);
        }
        else{
            flytrueWallMesh.position.set((positionX + width), 0, positionZ); //the Wall to fly true ist based on the right side
            zylinderMesh.position.set(positionX + width*1.5, 0, positionZ);
        }

        //Box to detect a collision. Placed under the wallMesh
        var wallFlyOverBoxGeometry = new THREE.BoxGeometry(width, 1, -80);
        var wallFlyOverBoxMaterial = new THREE.MeshBasicMaterial();
        wallFlyOverBoxMaterial.side = THREE.DoubleSide;
        wallFlyOverBoxMaterial.visible = false;
        var wallFlyOverBox = new THREE.Mesh(wallFlyOverBoxGeometry, wallFlyOverBoxMaterial);
        wallFlyOverBox.position.x = positionX;
        wallFlyOverBox.position.z = positionZ;
        wallFlyOverBox.position.y = -80;




        wallMarker.add(wallMesh);
        wallMarker.add(wallFlyOverBox);
        wallMarker.add(flytrueWallMesh);
        wallMarker.add(zylinderMesh);

    wallMarker.rotation.y = rotationY;
    scene.add(wallMarker);

}


function build3WallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY) {

    addWallObstacle(widthSegment,heightSegment, posXStarting,       posZStarting,       rotationY, false);
    addWallObstacle(widthSegment,heightSegment, (posXStarting+1000),(posZStarting+1000),rotationY, true);
    addWallObstacle(widthSegment,heightSegment, posXStarting,       (posZStarting+2000),rotationY, false);
    addWa
}








