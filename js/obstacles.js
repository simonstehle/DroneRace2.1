/**
 * Created by simonstehle on 03.08.16.
 */

function addTargetRing(innerRadius, outerRadius, positionX, positionY, positionZ, rotationY, parent) {
    var segmentCount = 30;
    var hitBoxInnerRadius = innerRadius - 20;
    var hitBoxOuterRadius = outerRadius + 20;

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

    var hitBoxFlyOverMeshCollection = [];
    hitBoxFlyOverMeshCollection.push(flyOverBox);

    addTarget(circleMesh,flyOverBox,flyThroughRingMesh, hitBoxCollection,hitBoxFlyOverMeshCollection);
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
    var wallTexture = textureLoader.load('objects/woodTexture.jpg');
    wallTexture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set( 1,1 );

    var wallMaterial = new THREE.MeshPhysicalMaterial( {
        color: 0xffffff,
        specular:0xffffff,
        shininess: 10,
        map: wallTexture,
        combine: THREE.MixOperation,
        reflectivity: 0.05,
        side: THREE.DoubleSide
    } );

        //Wall that is an obstacle
        var wallGeo = new THREE.PlaneGeometry(width, height);
        //var wallMat = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
        //wallMat.side = THREE.DoubleSide;
        var wallMesh = new THREE.Mesh(wallGeo, wallMaterial);
        wallMesh.position.set(positionX, 0, positionZ);


    //Box to detect a collision. Placed under the wallMesh
    var wallFlyOverBoxGeometry = new THREE.BoxGeometry(width,1, -maxStraightSpeed);
    var wallFlyOverBoxMaterial = new THREE.MeshBasicMaterial({color: 0xff0055});
    wallFlyOverBoxMaterial.visible = true;
    var wallFlyOverBox = new THREE.Mesh(wallFlyOverBoxGeometry, wallFlyOverBoxMaterial);

    wallFlyOverBox.position.set(positionX, -80, positionZ);


        var zylinderRadius = 50;

        //Zylinder to make boundary to score point
        var zylinderGeometry = new THREE.CylinderGeometry( zylinderRadius, zylinderRadius, height, 5,5 );
        var zylinderMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var zylinderMesh = new THREE.Mesh( zylinderGeometry, zylinderMaterial );

        var zylinderFlyOverCircleGeo = new THREE.CircleGeometry(zylinderRadius*2,30);
        var zylinderFlyOverCircleMat = new THREE.MeshBasicMaterial({color: 0xffff00});
    zylinderFlyOverCircleMat.visible = true;
    zylinderFlyOverCircleMat.side = THREE.DoubleSide;
        var zylinderFlyOverCircle = new THREE.Mesh(zylinderFlyOverCircleGeo, zylinderFlyOverCircleMat);
        zylinderFlyOverCircle.position.z = positionZ;
        zylinderFlyOverCircle.position.y = -100;
    zylinderFlyOverCircle.rotation.x = Math.PI*0.5;


    //Wall that ist not an obstacle, detects point/success
    var flytrueWallGeo = new THREE.PlaneGeometry(width, height);
    var flytrueWallMat = new THREE.MeshBasicMaterial({color: 0x00FFFF, side: THREE.DoubleSide});
    flytrueWallMat.side = THREE.DoubleSide;
    flytrueWallMat.visible = false;
    var flytrueWallMesh = new THREE.Mesh(flytrueWallGeo, flytrueWallMat);

//targetFlyOverBox
    var targetFlyOverBoxGeometry = new THREE.BoxGeometry(width,1, maxStraightSpeed);
    var targetFlyOverBoxMaterial = new THREE.MeshBasicMaterial({color: 0x00FFFF});
    targetFlyOverBoxMaterial.visible = true;
    targetFlyOverBoxMaterial.side = THREE.DoubleSide;
    var targetFlyOverBox = new THREE.Mesh(targetFlyOverBoxGeometry, targetFlyOverBoxMaterial);


    if (flyTrueOnLeft){
        flytrueWallMesh.position.set((positionX - width), 0, positionZ); //the Wall to fly true ist based on the right side
        targetFlyOverBox.position.set((positionX - width), -100, positionZ);
        zylinderMesh.position.set(positionX - width*1.5, 0, positionZ);
        zylinderFlyOverCircle.position.set(positionX - width*1.5, -100, positionZ);
        wallFlyOverBox.position.x = positionX;
    }
    else{
        flytrueWallMesh.position.set((positionX + width), 0, positionZ); //the Wall to fly true ist based on the right side
        targetFlyOverBox.position.set((positionX + width), -100, positionZ);
        zylinderMesh.position.set(positionX + width*1.5, 0, positionZ);
        zylinderFlyOverCircle.position.set(positionX + width*1.5, -100, positionZ);
        wallFlyOverBox.position.x = positionX;
    }

        wallMarker.add(wallMesh);
        wallMarker.add(wallFlyOverBox);
        wallMarker.add(flytrueWallMesh);
        wallMarker.add(targetFlyOverBox);
        wallMarker.add(zylinderMesh);
    wallMarker.add(zylinderFlyOverCircle);

    wallMarker.rotation.y = rotationY;
    var hitBoxMeshCollection = [];
    var hitBoxFlyOverMeshCollection = [];
    hitBoxMeshCollection.push(zylinderMesh);
    hitBoxFlyOverMeshCollection.push(zylinderFlyOverCircle);
    hitBoxMeshCollection.push(wallMesh);
    hitBoxFlyOverMeshCollection.push(wallFlyOverBox);
    addTarget(flytrueWallMesh,targetFlyOverBox,zylinderMesh,hitBoxMeshCollection,hitBoxFlyOverMeshCollection);
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
            var hitBoxFlyOverMeshCollection = [];
            hitBoxFlyOverMeshCollection.push(flyOverBox);
            addTarget(rectMesh,flyOverBox,frame, hitBoxCollection,hitBoxFlyOverMeshCollection);
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


    var startFlyTrueGeo = new THREE.BoxGeometry(width,600,20);
    var startFlyTrueMat = new THREE.MeshBasicMaterial();
    startFlyTrueMat.side = THREE.DoubleSide;
    startFlyTrueMat.visible =false;
    var startFlyTrueMesh = new THREE.Mesh(startFlyTrueGeo, startFlyTrueMat);
    startFlyTrueMesh.position.set(positionX,0,positionZ);
   // startFlyTrueMesh.rotation.x = Math.PI *0.5;
    startFinishMarker.add(startFlyTrueMesh);

    var zylinder1 = makeAZylinder(positionX-width/2,0 , positionZ,height)
    var flyOverCircle1 = makeAFlyOverCircle(positionX-width/2, -150 , positionZ,80);
    var zylinder2 = makeAZylinder(positionX+width/2, 0, positionZ,height)
    var flyOverCircle2 = makeAFlyOverCircle(positionX+width/2, -150, positionZ,80);

    startFinishMarker.add(zylinder1);
    startFinishMarker.add(zylinder2);
    startFinishMarker.add(flyOverCircle1);
    startFinishMarker.add(flyOverCircle2);


    var hitBoxMeshCollection = [];
    var hitBoxFlyOverMeshCollection =[];
    hitBoxMeshCollection.push(zylinder1);
    hitBoxFlyOverMeshCollection.push(flyOverCircle1);
    hitBoxMeshCollection.push(zylinder2);
    hitBoxFlyOverMeshCollection.push(flyOverCircle2);
    hitBoxMeshCollection.push(startTopMesh);
    hitBoxFlyOverMeshCollection.push(startlineMesh);



    startFinishMarker.position.set(positionX, 0,positionZ);
    startFinishMarker.rotation.y = rotationY;
    addTarget(startFlyTrueMesh,startlineMesh,startTopMesh,hitBoxMeshCollection,hitBoxFlyOverMeshCollection);
    scene.add(startFinishMarker);


}

function makeAZylinder(positionX,positionY, positionZ, height) {
    var zylinderGeometry = new THREE.CylinderGeometry( 50, 50, height, 5,5 );
    var zylinderMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var zylinderMesh = new THREE.Mesh( zylinderGeometry, zylinderMaterial );
    zylinderMesh.position.set(positionX, positionY,positionZ);

    return zylinderMesh;
}

function makeAFlyOverCircle(positionX,positionY, positionZ, radius) {
    var circleGeometry = new THREE.CircleGeometry(radius,30 );
    var circleMaterial = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
    circleMaterial.side = THREE.DoubleSide;
    circleMaterial.visible = true;
    var circleMesh = new THREE.Mesh( circleGeometry, circleMaterial );
    circleMesh.position.set(positionX,positionY, positionZ);
    circleMesh.rotation.x = Math.PI*0.5;
    return circleMesh;
}



