/**
 * Created by simonstehle on 03.08.16.
 */

function addTargetRing(innerRadius, outerRadius, positionX, positionY, positionZ, rotationY, parent) {
    var segmentCount = 30;
    var hitBoxInnerRadius = innerRadius - 30;
    var hitBoxOuterRadius = outerRadius + 50;

    var circleGeo = new THREE.CircleGeometry(hitBoxInnerRadius, segmentCount);
    var circleMat = new THREE.MeshBasicMaterial({color: 0x69201C});
    circleMat.side = THREE.DoubleSide;
    circleMat.visible = false;
    var circleMesh = new THREE.Mesh(circleGeo, circleMat);
    circleMesh.position.set(positionX,positionY,positionZ);
    circleMesh.rotation.y = rotationY;

    var flyOverBoxGeometry = new THREE.BoxGeometry(hitBoxOuterRadius*2, 1, maxStraightSpeed+1);
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

    parent.add(circleMesh);
    parent.add(flyThroughRingMesh);
    parent.add(flyOverBox);
    parent.add(hitBoxMesh);

    var hitBoxCollection = [];
    hitBoxCollection.push(hitBoxMesh);

    addTarget(circleMesh,flyOverBox,flyThroughRingMesh, hitBoxCollection);
}

function addTube(numberOfRings, innerRadius, outerRadius, positionX, positionY, positionZ, rotationY) {
    var tubeMarker = new THREE.Object3D();
    for (var i=0; i<numberOfRings; i++){

        addTargetRing(innerRadius,outerRadius,positionX+i*80,positionY,positionZ,Math.PI *0.5, tubeMarker);
       console.log("done")
    }
    tubeMarker.rotation.y = rotationY;
    scene.add(tubeMarker);
}



function addWallObstacle(width, height,positionX, positionZ, rotationY, flyTrueOnLeft, moving) {
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





        //Box to detect a collision. Placed under the wallMesh
        var wallFlyOverBoxGeometry = new THREE.BoxGeometry(width*2,1, -maxStraightSpeed);
        var wallFlyOverBoxMaterial = new THREE.MeshBasicMaterial();
        wallFlyOverBoxMaterial.side = THREE.DoubleSide;
        wallFlyOverBoxMaterial.visible = false;
        var wallFlyOverBox = new THREE.Mesh(wallFlyOverBoxGeometry, wallFlyOverBoxMaterial);

        wallFlyOverBox.position.z = positionZ;
        wallFlyOverBox.position.y = -80;



    if (flyTrueOnLeft){
        flytrueWallMesh.position.set((positionX - width), 0, positionZ); //the Wall to fly true ist based on the right side
        zylinderMesh.position.set(positionX - width*1.5, 0, positionZ);
        wallFlyOverBox.position.x = positionX-width/2;
    }
    else{
        flytrueWallMesh.position.set((positionX + width), 0, positionZ); //the Wall to fly true ist based on the right side
        zylinderMesh.position.set(positionX + width*1.5, 0, positionZ);
        wallFlyOverBox.position.x = positionX+width/2;
    }

        wallMarker.add(wallMesh);
        wallMarker.add(wallFlyOverBox);
        wallMarker.add(flytrueWallMesh);
        wallMarker.add(zylinderMesh);

    wallMarker.rotation.y = rotationY;
    var hitBoxMeshCollection = [];
    hitBoxMeshCollection.push(zylinderMesh);
    hitBoxMeshCollection.push(wallMesh);
    addTarget(flytrueWallMesh,wallFlyOverBox,zylinderMesh,hitBoxMeshCollection);
    scene.add(wallMarker);

    if (moving) {
        wallMarker.rotateY(0.1);
    }

}


function build3WallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY) {

    addWallObstacle(widthSegment,heightSegment, posXStarting,       posZStarting,       rotationY, false, false);
    addWallObstacle(widthSegment,heightSegment, (posXStarting+1000),(posZStarting+1000),rotationY, true, false);
    addWallObstacle(widthSegment,heightSegment, posXStarting,       (posZStarting+2000),rotationY, false, false);
}

function build3MovingWallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY) {

    addWallObstacle(widthSegment,heightSegment, posXStarting,       posZStarting,       rotationY, false, true);
    addWallObstacle(widthSegment,heightSegment, (posXStarting+1000),(posZStarting+1000),rotationY, true, true);
    addWallObstacle(widthSegment,heightSegment, posXStarting,       (posZStarting+2000),rotationY, false, true);
}


function addTargetFrame(width, positionX, positionY, positionZ, rotationY) {

    var pixelToScale = width/3.25;


    var rectGeo = new THREE.PlaneGeometry(width,width);
    var rectMat = new THREE.MeshBasicMaterial({color: 0x69201C});
    rectMat.side = THREE.DoubleSide;
    rectMat.visible = false;
    var rectMesh = new THREE.Mesh(rectGeo, rectMat);
    rectMesh.position.set(positionX,positionY,positionZ);
    rectMesh.rotation.y = rotationY;

    var flyOverBoxGeometry = new THREE.BoxGeometry(width*1.3,1, maxStraightSpeed+1);
    var flyOverBoxMaterial = new THREE.MeshBasicMaterial();
    flyOverBoxMaterial.side = THREE.DoubleSide;
    flyOverBoxMaterial.visible = false;
    var flyOverBox = new THREE.Mesh(flyOverBoxGeometry, flyOverBoxMaterial);
    flyOverBox.position.x = positionX;
    flyOverBox.position.z = positionZ;
    flyOverBox.rotation.y = rotationY;

    var frame;
    mtlLoader.load( 'objects/Frame.mtl', function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );

        objLoader.load( 'objects/Frame.obj', function ( object ) {
            frame = object;
            frame.boundingSphere;
            frame.scale.set(pixelToScale, pixelToScale, pixelToScale);
            frame.position.set(positionX,positionY,positionZ);
            frame.rotation.y = rotationY;
            var hitBoxCollection = [];
            hitBoxCollection.push(frame);
            addTarget(rectMesh,flyOverBox,frame, hitBoxCollection);
            scene.add(frame);
            scene.add(rectMesh);
            scene.add(flyOverBox);
        }, onProgress, onError );

    });


}


function addStartFinishLine(width,depth, positionX, positionY, positionZ, rotationY, height) {
    var startFinishMarker = new THREE.Object3D();

    var startlineGeo = new THREE.BoxGeometry(width,1,depth);
    var startlineMat = new THREE.MeshBasicMaterial();
    startlineMat.side = THREE.DoubleSide;
    var startlineMesh = new THREE.Mesh(startlineGeo, startlineMat);

    startlineMesh.position.set(positionX,positionY,positionZ);
    startFinishMarker.add(startlineMesh);


    var startTopGeo = new THREE.BoxGeometry(width,1,depth);
    var startTopMat = new THREE.MeshBasicMaterial();
    startTopMat.side = THREE.DoubleSide;
    var startTopMesh = new THREE.Mesh(startTopGeo, startTopMat);

    startTopMesh.position.set(positionX,355,positionZ);
    startTopMesh.rotation.x = Math.PI *0.5;

    startFinishMarker.add(startTopMesh);


    startFinishMarker.add(makeAZylinder(positionX-width/2,0 , positionZ,height));
    startFinishMarker.add(makeAZylinder(positionX+width/2, 0, positionZ,height));



    startFinishMarker.position.set(positionX, 0,positionZ);
    startFinishMarker.rotation.y = rotationY;
    scene.add(startFinishMarker);
}

function makeAZylinder(zylPositionX, zylPositionY, zylPositionZ, height) {
    var zylinderGeometry = new THREE.CylinderGeometry( 50, 50, height, 5,5 );
    var zylinderMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var zylinderMesh = new THREE.Mesh( zylinderGeometry, zylinderMaterial );
    zylinderMesh.position.set(zylPositionX, zylPositionY,zylPositionZ);

    return zylinderMesh;
}


var wallTextureLoader = new THREE.TextureLoader();
var wallTexture = wallTextureLoader.load('objects/woodTexture.jpg');
wallTexture.wrapS = texture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set( 30,30 );
wallTexture.side = THREE.DoubleSide;

var wallMaterial = new THREE.MeshPhysicalMaterial( {
    color: 0xffffff,
    specular:0xffffff,
    shininess: 10,
    map: texture,
    combine: THREE.MixOperation,
    reflectivity: 0.05
} );
