/**
 * Created by simonstehle on 03.08.16.
 */
/**
 * Collection of moving obstacles
 * @type {Array}
 */
var obstaclesToMove = [];
/**
 * Basic Material for different obstacles
 * @type {THREE.MeshBasicMaterial}
 */
var basicMaterial = new THREE.MeshBasicMaterial();

/**
 * Initialize a ring with collision detection and movement, add it to a parent (usually scene or marker)
 * @param innerRadius - Inner radius of ring
 * @param outerRadius - Outer radius of ring
 * @param positionX - X-position
 * @param positionY - Y-position
 * @param positionZ - Z-position
 * @param rotationY - Y-rotation
 * @param parent - Parent object (scene, marker, ...)
 * @param movingPace - Starting pace
 * @param movingDuration - Starting duration of movement in frames
 */
function addTargetRing(innerRadius, outerRadius, positionX, positionY, positionZ, rotationY, parent, movingPace, movingDuration) {
    /**
     * Count of circle segments
     * @type {number}
     */
    var segmentCount = 30;
    /**
     * Inner radius of hit box
     * @type {number}
     */
    var hitBoxInnerRadius = innerRadius - 20;
    /**
     * Outer radius of hit box
     * @type {number}
     */
    var hitBoxOuterRadius = outerRadius + 20;

    /**
     * Geometry for target circle  (hitbox indicating a fly through)
     * @type {THREE.CircleGeometry}
     */
    var circleGeo = new THREE.CircleGeometry(hitBoxInnerRadius, segmentCount);

    basicMaterial.side = THREE.DoubleSide;
    basicMaterial.visible = false;
    /**
     * Mesh for target circle
     * @type {THREE.Mesh}
     */
    var circleMesh = new THREE.Mesh(circleGeo, basicMaterial);
    circleMesh.position.set(positionX, positionY, positionZ);
    circleMesh.rotation.y = rotationY;

    /**
     * Geometry for fly over box (for collision detection
     * @type {THREE.BoxGeometry}
     */
    var flyOverBoxGeometry = new THREE.BoxGeometry(hitBoxOuterRadius * 2, 1, maxStraightSpeed + 1);

    basicMaterial.side = THREE.DoubleSide;
    basicMaterial.visible = false;
    /**
     * Mesh for fly over hit box
     * @type {THREE.Mesh}
     */
    var flyOverBox = new THREE.Mesh(flyOverBoxGeometry, basicMaterial);
    flyOverBox.position.x = positionX;
    flyOverBox.position.z = positionZ;
    flyOverBox.position.y = -150;
    flyOverBox.rotation.y = rotationY;

    /**
     * Geometry for the fly through ring (visible part of the obstacle)
     * @type {THREE.RingGeometry}
     */
    var ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segmentCount);

    /**
     * Texture for the fly through ring
     * @type {*|Howler|void}
     */
    var ringTexture = textureLoader.load('objects/metalTexture.jpg');
    ringTexture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    ringTexture.repeat.set(1, 1);

    /**
     * Material for the fly through ring
     * @type {THREE.MeshPhysicalMaterial}
     */
    var ringMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: ringTexture,
        reflectivity: 0.05,
        side: THREE.DoubleSide
    });

    /**
     * Mesh for the fly through ring
     * @type {THREE.Mesh}
     */
    var flyThroughRingMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    flyThroughRingMesh.position.set(positionX, positionY, positionZ);
    flyThroughRingMesh.rotation.y = rotationY;

    /**
     * Geometry for the ring hit box
     * @type {THREE.RingGeometry}
     */
    var ringGeometry = new THREE.RingGeometry(hitBoxInnerRadius, hitBoxOuterRadius, segmentCount);
    basicMaterial.side = THREE.DoubleSide;
    basicMaterial.visible = false;
    /**
     * Mesh for the ring hit box
     * @type {THREE.Mesh}
     */
    var hitBoxMesh = new THREE.Mesh(ringGeometry, basicMaterial);
    hitBoxMesh.position.set(positionX, positionY, positionZ);
    hitBoxMesh.rotation.y = rotationY;

    /**
     * Marker for all components of the ring
     * @type {THREE.Object3D}
     */
    var circleMarker = new THREE.Object3D();
    // circleMarker.rotation.y = rotationY;

    circleMarker.add(circleMesh);
    circleMarker.add(flyThroughRingMesh);
    circleMarker.add(flyOverBox);
    circleMarker.add(hitBoxMesh);

    parent.add(circleMarker);

    /**
     * Collection of all hit boxes of the ring
     * @type {Array}
     */
    var hitBoxCollection = [];
    hitBoxCollection.push(hitBoxMesh);

    /**
     * Collection of all fly over meshs of the ring
     * @type {Array}
     */
    var hitBoxFlyOverMeshCollection = [];
    hitBoxFlyOverMeshCollection.push(flyOverBox);

    addTarget(circleMesh, flyOverBox, flyThroughRingMesh, hitBoxCollection, hitBoxFlyOverMeshCollection);

    if (movingPace != 0 && movingDuration != 0) {
        console.log("test");
        makeThisObstacleMove(circleMarker, rotationY, movingPace, movingDuration);
    }
}

/**
 * Add a multiple rings as tube
 * @param numberOfRings
 * @param innerRadius - Inner radius of ring
 * @param outerRadius - Outer radius of ring
 * @param positionX - X-position
 * @param positionY - Y-position
 * @param positionZ - Z-position
 * @param rotationY - Y-rotation
 */
function addTube(numberOfRings, innerRadius, outerRadius, positionX, positionY, positionZ, rotationY) {
    /**
     * Marker for all rings
     * @type {THREE.Object3D}
     */
    var tubeMarker = new THREE.Object3D();
    for (var i = 0; i < numberOfRings; i++) {
        addTargetRing(innerRadius, outerRadius, positionX + i * 80, positionY, positionZ, Math.PI * 0.5, tubeMarker, 0, 0);
        console.log("done")
    }
    tubeMarker.rotation.y = rotationY;
    scene.add(tubeMarker);
}

/**
 *
 * @param width - Width of the visible wall element
 * @param height - Height of the wall
 * @param positionX - X-position
 * @param positionZ - Z-position
 * @param rotationY - Y-rotation
 * @param flyThroughOnLeft - Indicates on which side the fly through is positioned
 * @param movingPace - Starting pace
 * @param movingDuration - Starting duration of movement in frames
 */
function addWallObstacle(width, height, positionX, positionZ, rotationY, flyThroughOnLeft, movingPace, movingDuration) {
    /**
     * Marker for all components of the wall
     * @type {THREE.Object3D}
     */
    var wallMarker = new THREE.Object3D();
    /**
     * Texture for the wall
     * @type {THREE.Texture}
     */
    var wallTexture = textureLoader.load('objects/woodTexture.jpg');
    wallTexture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(1, 1);

    /**
     * Material for the wall
     * @type {THREE.MeshPhysicalMaterial}
     */
    var wallMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: wallTexture,
        reflectivity: 0.05,
        side: THREE.DoubleSide
    });

    /**
     * Geometry for the wall
     * @type {THREE.BoxGeometry}
     */
    var wallGeo = new THREE.BoxGeometry(width, height, 50);
    /**
     * Mesh for the wall
     * @type {THREE.Mesh}
     */
    var wallMesh = new THREE.Mesh(wallGeo, wallMaterial);
    wallMesh.position.set(positionX, 0, positionZ);


    /**
     * Mesh for fly over hit box
     * @type {THREE.Mesh}
     */
    var wallFlyOverBoxGeometry = new THREE.BoxGeometry(width, 1, maxStraightSpeed);
    /**
     * Material for fly over hit box
     * @type {THREE.MeshBasicMaterial}
     */
    var wallFlyOverBoxMaterial = new THREE.MeshBasicMaterial({color: 0xff0055});
    wallFlyOverBoxMaterial.visible = true;
    /**
     * Mesh for fly over hit box
     * @type {THREE.Mesh}
     */
    var wallFlyOverBox = new THREE.Mesh(wallFlyOverBoxGeometry, wallFlyOverBoxMaterial);

    wallFlyOverBox.position.set(positionX, -150, positionZ);

    /**
     * Radius of the cylinder
     * @type {number}
     */
    var cylinderRadius = 50;

    /**
     * Geometry for cylinder (the
     * @type {THREE.CylinderGeometry}
     */
    var cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, height, 5, 5);
    var cylinderMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
    var cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    var cylinderFlyOverCircleGeo = new THREE.CircleGeometry(cylinderRadius * 2, 30);
    var cylinderFlyOverCircleMat = new THREE.MeshBasicMaterial({color: 0xffff00});
    cylinderFlyOverCircleMat.visible = true;
    cylinderFlyOverCircleMat.side = THREE.DoubleSide;
    var cylinderFlyOverCircle = new THREE.Mesh(cylinderFlyOverCircleGeo, cylinderFlyOverCircleMat);
    cylinderFlyOverCircle.position.z = positionZ;
    cylinderFlyOverCircle.rotation.x = Math.PI * 0.5;

    //Wall that ist not an obstacle, detects point/success
    var flyThroughWallGeo = new THREE.PlaneGeometry(width, height);
    var flyThroughWallMat = new THREE.MeshBasicMaterial({color: 0x00FFFF, side: THREE.DoubleSide});
    flyThroughWallMat.side = THREE.DoubleSide;
    flyThroughWallMat.visible = false;
    var flyThroughWallMesh = new THREE.Mesh(flyThroughWallGeo, flyThroughWallMat);

//targetFlyOverBox
    var targetFlyOverBoxGeometry = new THREE.BoxGeometry(width, 1, maxStraightSpeed);
    var targetFlyOverBoxMaterial = new THREE.MeshBasicMaterial({color: 0x00FFFF});
    targetFlyOverBoxMaterial.visible = true;
    targetFlyOverBoxMaterial.side = THREE.DoubleSide;
    var targetFlyOverBox = new THREE.Mesh(targetFlyOverBoxGeometry, targetFlyOverBoxMaterial);

    if (flyThroughOnLeft) {
        flyThroughWallMesh.position.set((positionX - width), 0, positionZ); //the Wall to fly through ist based on the right side
        targetFlyOverBox.position.set((positionX - width), -150, positionZ);
        cylinderMesh.position.set(positionX - width * 1.5, 0, positionZ);
        cylinderFlyOverCircle.position.set(positionX - width * 1.5, -150, positionZ);
        wallFlyOverBox.position.x = positionX;
    }
    else {
        flyThroughWallMesh.position.set((positionX + width), 0, positionZ); //the Wall to fly through ist based on the right side
        targetFlyOverBox.position.set((positionX + width), -150, positionZ);
        cylinderMesh.position.set(positionX + width * 1.5, 0, positionZ);
        cylinderFlyOverCircle.position.set(positionX + width * 1.5, -150, positionZ);
        wallFlyOverBox.position.x = positionX;
    }

    wallMarker.add(wallMesh);
    wallMarker.add(wallFlyOverBox);
    wallMarker.add(flyThroughWallMesh);
    wallMarker.add(targetFlyOverBox);
    wallMarker.add(cylinderMesh);
    wallMarker.add(cylinderFlyOverCircle);

    wallMarker.rotation.y = rotationY;
    var hitBoxMeshCollection = [];
    var hitBoxFlyOverMeshCollection = [];
    hitBoxMeshCollection.push(cylinderMesh);
    hitBoxFlyOverMeshCollection.push(cylinderFlyOverCircle);
    hitBoxMeshCollection.push(wallMesh);
    hitBoxFlyOverMeshCollection.push(wallFlyOverBox);

    addTarget(flyThroughWallMesh, targetFlyOverBox, cylinderMesh, hitBoxMeshCollection, hitBoxFlyOverMeshCollection);
    scene.add(wallMarker);

    if (movingPace != 0 && movingDuration != 0) {
        makeThisObstacleMove(wallMarker, rotationY, movingPace, movingDuration);
    }
}


function build3WallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY) {
    addWallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY, false, 0, 0);
    addWallObstacle(widthSegment, heightSegment, (posXStarting + 1000), (posZStarting + 1000), rotationY, true, 0, 0);
    addWallObstacle(widthSegment, heightSegment, posXStarting, (posZStarting + 2000), rotationY, false, 0, 0);
}

function build3MovingWallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY, movingPace, movingDuration) {
    addWallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY, false, movingPace, movingDuration);
    addWallObstacle(widthSegment, heightSegment, (posXStarting + 1000), (posZStarting + 1000), rotationY, true, movingPace, movingDuration);
    addWallObstacle(widthSegment, heightSegment, posXStarting, (posZStarting + 2000), rotationY, false, movingPace, movingDuration);
}


function addTargetFrame(width, positionX, positionY, positionZ, rotationY) {
    var pixelToScale = width / 3.25;
    var rectGeo = new THREE.PlaneGeometry(width, width);
    var rectMat = new THREE.MeshLambertMaterial({color: 0x69201C});
    rectMat.side = THREE.DoubleSide;
    rectMat.visible = false;
    var rectMesh = new THREE.Mesh(rectGeo, rectMat);
    rectMesh.position.set(positionX, positionY, positionZ);
    rectMesh.rotation.y = rotationY;

    var flyOverBoxGeometry = new THREE.BoxGeometry(width * 1.3, 1, maxStraightSpeed + 1);
    var flyOverBoxMaterial = new THREE.MeshBasicMaterial();
    flyOverBoxMaterial.side = THREE.DoubleSide;
    flyOverBoxMaterial.visible = false;
    var flyOverBox = new THREE.Mesh(flyOverBoxGeometry, flyOverBoxMaterial);
    flyOverBox.position.x = positionX;
    flyOverBox.position.z = positionZ;
    flyOverBox.position.y = -150;
    flyOverBox.rotation.y = rotationY;

    var frame;
    mtlLoader.load('objects/Frame.mtl', function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load('objects/Frame.obj', function (object) {
            frame = object;
            frame.boundingSphere;
            frame.scale.set(pixelToScale, pixelToScale, pixelToScale);
            frame.position.set(positionX, positionY, positionZ);
            frame.rotation.y = rotationY;
            var hitBoxCollection = [];
            hitBoxCollection.push(frame);
            var hitBoxFlyOverMeshCollection = [];
            hitBoxFlyOverMeshCollection.push(flyOverBox);
            addTarget(rectMesh, flyOverBox, frame, hitBoxCollection, hitBoxFlyOverMeshCollection);
            scene.add(frame);
            scene.add(rectMesh);
            scene.add(flyOverBox);
        }, onProgress, onError);

    });
}


function addStartFinishLine(width, depth, positionX, positionY, positionZ, rotationY, height) {
    var startFinishMarker = new THREE.Object3D();

    var startlineGeo = new THREE.BoxGeometry(width, 1, depth);
    var startlineMat = new THREE.MeshLambertMaterial();
    startlineMat.side = THREE.DoubleSide;
    var startlineMesh = new THREE.Mesh(startlineGeo, startlineMat);

    startlineMesh.position.set(positionX, positionY, positionZ);

    startFinishMarker.add(startlineMesh);

    var startTopGeo = new THREE.BoxGeometry(width, 1, depth);
    var startTopMat = new THREE.MeshLambertMaterial();
    startTopMat.side = THREE.DoubleSide;
    var startTopMesh = new THREE.Mesh(startTopGeo, startTopMat);
    startTopMesh.position.set(positionX, 355, positionZ);
    startTopMesh.rotation.x = Math.PI * 0.5;
    startFinishMarker.add(startTopMesh);

    var startFlyThroughGeo = new THREE.BoxGeometry(width, 600, 20);
    var startFlyThroughMat = new THREE.MeshBasicMaterial();
    startFlyThroughMat.side = THREE.DoubleSide;
    startFlyThroughMat.visible = false;
    var startFlyThroughMesh = new THREE.Mesh(startFlyThroughGeo, startFlyThroughMat);
    startFlyThroughMesh.position.set(positionX, 0, positionZ);
    // startFlyThroughMesh.rotation.x = Math.PI *0.5;
    startFinishMarker.add(startFlyThroughMesh);

    var cylinder1 = createCylinder(positionX - width / 2, 0, positionZ, height)
    var flyOverCircle1 = createFlyOverCircle(positionX - width / 2, -150, positionZ, 80);
    var cylinder2 = createCylinder(positionX + width / 2, 0, positionZ, height)
    var flyOverCircle2 = createFlyOverCircle(positionX + width / 2, -150, positionZ, 80);

    startFinishMarker.add(cylinder1);
    startFinishMarker.add(cylinder2);
    startFinishMarker.add(flyOverCircle1);
    startFinishMarker.add(flyOverCircle2);

    var hitBoxMeshCollection = [];
    var hitBoxFlyOverMeshCollection = [];
    hitBoxMeshCollection.push(cylinder1);
    hitBoxFlyOverMeshCollection.push(flyOverCircle1);
    hitBoxMeshCollection.push(cylinder2);
    hitBoxFlyOverMeshCollection.push(flyOverCircle2);
    hitBoxMeshCollection.push(startTopMesh);
    hitBoxFlyOverMeshCollection.push(startlineMesh);

    startFinishMarker.position.set(positionX, 0, positionZ);
    startFinishMarker.rotation.y = rotationY;
    addTarget(startFlyThroughMesh, startlineMesh, startTopMesh, hitBoxMeshCollection, hitBoxFlyOverMeshCollection);
    scene.add(startFinishMarker);

}

function createCylinder(positionX, positionY, positionZ, height) {
    var cylinderGeometry = new THREE.CylinderGeometry(50, 50, height, 5, 5);
    var cylinderMaterial = new THREE.MeshLambertMaterial({color: 0x777777});
    var cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinderMesh.position.set(positionX, positionY, positionZ);
    return cylinderMesh;
}

function createFlyOverCircle(positionX, positionY, positionZ, radius) {
    var circleGeometry = new THREE.CircleGeometry(radius, 30);
    var circleMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff});
    circleMaterial.side = THREE.DoubleSide;
    circleMaterial.visible = true;
    var circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    circleMesh.position.set(positionX, positionY, positionZ);
    circleMesh.rotation.x = Math.PI * 0.5;
    return circleMesh;
}


function calcObstacleMovement(rotation, speed) {
    var currentRotation = rotation;
    var movingPace = speed;
    var moveX, moveZ;

    console.log(currentRotation, movingPace);

    var PiHalf = Math.PI / 2;
    var quadrant, net_angle;

    currentRotation += PiHalf;

    quadrant = -1;

    for (var i = currentRotation; i >= 0; i -= PiHalf) {
        quadrant++;
    }
    quadrant = quadrant % 4;

    net_angle = currentRotation % PiHalf;

    if (net_angle < 0) net_angle += PiHalf * 4;

    switch (quadrant) {
        case 0:
            moveZ = -(Math.cos(net_angle) * movingPace);
            moveX = -(Math.sin(net_angle) * movingPace);
            break;
        case 1:
            moveZ = (Math.sin(net_angle) * movingPace);
            moveX = -(Math.cos(net_angle) * movingPace);
            break;
        case 2:
            moveZ = (Math.cos(net_angle) * movingPace);
            moveX = (Math.sin(net_angle) * movingPace);
            break;
        case 3:
            moveZ = -(Math.sin(net_angle) * movingPace);
            moveX = (Math.cos(net_angle) * movingPace);
            break;
    }

    console.log("X: " + moveX + ", Z: " + moveZ);

    var output = new Object();
    output.moveInX = moveX;
    output.moveInZ = moveZ;

    return output;
}

function makeThisObstacleMove(obstacle, rotationY, movingPace, movingDuration) {

    var thisObstacleObj = new Object();
    thisObstacleObj.randomize = false;

    var obstacleMovement = calcObstacleMovement(rotationY, movingPace);

    thisObstacleObj.alreadyMoved = 0;
    thisObstacleObj.obstacle = obstacle;
    thisObstacleObj.back = true;
    thisObstacleObj.noOfMovements = movingDuration;
    thisObstacleObj.moveX = obstacleMovement.moveInX;
    thisObstacleObj.moveZ = obstacleMovement.moveInZ;
    thisObstacleObj.wholeWay = movingPace*movingDuration;



    thisObstacleObj.move = function () {

        if (thisObstacleObj.randomize) {
            var myRandom =  1-(Math.floor(100*Math.random()+1)/200);

            var newMovingPace = movingPace * myRandom;
            var newMovingDuration = thisObstacleObj.wholeWay / newMovingPace;
            thisObstacleObj.noOfMovements = newMovingDuration;
            obstacleMovement = calcObstacleMovement(rotationY, newMovingPace);
            thisObstacleObj.moveX = obstacleMovement.moveInX;
            thisObstacleObj.moveZ = obstacleMovement.moveInZ;
        }

        if (thisObstacleObj.alreadyMoved >= thisObstacleObj.noOfMovements || thisObstacleObj.alreadyMoved <= 0) {
            thisObstacleObj.back = !thisObstacleObj.back;
            if(thisObstacleObj.alreadyMoved<=0)
            {
                thisObstacleObj.randomize = true;
            }
            else
                thisObstacleObj.randomize=false;
        }
        else {
            thisObstacleObj.randomize = false;
        }

        if (thisObstacleObj.back === false) {
            thisObstacleObj.obstacle.position.x += thisObstacleObj.moveX;
            thisObstacleObj.obstacle.position.z += thisObstacleObj.moveZ;
            thisObstacleObj.alreadyMoved++;
        } else if (thisObstacleObj.back === true) {
            thisObstacleObj.obstacle.position.x -= thisObstacleObj.moveX;
            thisObstacleObj.obstacle.position.z -= thisObstacleObj.moveZ;
            thisObstacleObj.alreadyMoved--;
        }
    }
    obstaclesToMove.push(thisObstacleObj);
}


function moveObstacles() {
    for (var i = 0; i < obstaclesToMove.length; i++) {
        obstaclesToMove[i].move();
    }
}

