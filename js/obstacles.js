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
var basicMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});

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
     * Geometry for target circle (hit box indicating a fly through)
     * @type {THREE.CircleGeometry}
     */
    var circleGeo = new THREE.CircleGeometry(hitBoxInnerRadius, segmentCount);

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
    ringTexture.wrapS = ringTexture.wrapT = THREE.RepeatWrapping;
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
     * Collection of all fly over meshes of the ring
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
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
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
     * Mesh for wall fly over hit box
     * @type {THREE.Mesh}
     */
    var wallFlyOverBoxGeometry = new THREE.BoxGeometry(width, 1, maxStraightSpeed);
    /**
     * Material for wall fly over hit box
     * @type {THREE.MeshBasicMaterial}
     */
    var wallFlyOverBoxMaterial = new THREE.MeshBasicMaterial({color: 0xff0055});
    wallFlyOverBoxMaterial.visible = true;
    /**
     * Mesh for wall fly over hit box
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
     * Geometry for cylinder (as visible boundary of the fly through plane)
     * @type {THREE.CylinderGeometry}
     */
    var cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, height, 5, 5);
    /**
     * Lambert Material
     * @type {THREE.MeshLambertMaterial}
     */
    var lambertMaterial = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
    /**
     * Mesh for the cylinder
     * @type {THREE.Mesh}
     */
    var cylinderMesh = new THREE.Mesh(cylinderGeometry, lambertMaterial);

    /**
     * Geometry for cylinder fly over hit box
     * @type {THREE.CircleGeometry}
     */
    var cylinderFlyOverCircleGeo = new THREE.CircleGeometry(cylinderRadius * 2, 30);
    basicMaterial.visible = true;
    /**
     * Mesh for cylinder fly over hit box
     * @type {THREE.Mesh}
     */
    var cylinderFlyOverCircle = new THREE.Mesh(cylinderFlyOverCircleGeo, basicMaterial);
    cylinderFlyOverCircle.position.z = positionZ;
    cylinderFlyOverCircle.rotation.x = Math.PI * 0.5;

    /**
     * Geometry for target plane (hit box indicating a fly through)
     * @type {THREE.PlaneGeometry}
     */
    var flyThroughWallGeo = new THREE.PlaneGeometry(width, height);
    basicMaterial.visible = false;
    /**
     * Mesh for the target plane
     * @type {THREE.Mesh}
     */
    var flyThroughWallMesh = new THREE.Mesh(flyThroughWallGeo, basicMaterial);

    /**
     * Geometry for target plane fly over hit box
     * @type {THREE.BoxGeometry}
     */
    var targetFlyOverBoxGeometry = new THREE.BoxGeometry(width, 1, maxStraightSpeed);
    basicMaterial.visible = true;
    /**
     * Mesh for target plane fly over hit box
     * @type {THREE.Mesh}
     */
    var targetFlyOverBox = new THREE.Mesh(targetFlyOverBoxGeometry, basicMaterial);

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
    /**
     * Collection of all hit boxes of the ring
     * @type {Array}
     */
    var hitBoxMeshCollection = [];
    /**
     * Collection of all fly over meshes of the ring
     * @type {Array}
     */
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

/**
 * Build an obstacle with three walls
 * @param widthSegment - Width of the visible wall elements
 * @param heightSegment - Height of the wall segments
 * @param posXStarting - X-position
 * @param posZStarting - Z-position
 * @param rotationY - Y-rotation
 */
function build3WallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY) {
    addWallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY, false, 0, 0);
    addWallObstacle(widthSegment, heightSegment, (posXStarting + 1000), (posZStarting + 1000), rotationY, true, 0, 0);
    addWallObstacle(widthSegment, heightSegment, posXStarting, (posZStarting + 2000), rotationY, false, 0, 0);
}

/**
 * Build an obstacle with three moving walls
 * @param widthSegment - Width of the visible wall elements
 * @param heightSegment - Height of the wall segments
 * @param posXStarting - Start x-position
 * @param posZStarting - Start z-position
 * @param rotationY - Y-rotation
 * @param movingPace - Starting pace
 * @param movingDuration - Starting duration of movement in frames
 */
function build3MovingWallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY, movingPace, movingDuration) {
    addWallObstacle(widthSegment, heightSegment, posXStarting, posZStarting, rotationY, false, movingPace, movingDuration);
    addWallObstacle(widthSegment, heightSegment, (posXStarting + 1000), (posZStarting + 1000), rotationY, true, movingPace, movingDuration);
    addWallObstacle(widthSegment, heightSegment, posXStarting, (posZStarting + 2000), rotationY, false, movingPace, movingDuration);
}

/**
 * Add a rectangular frame as obstacle
 * @param width - Width of the frame
 * @param positionX - X-position
 * @param positionY - Y-position
 * @param positionZ - Z-position
 * @param rotationY - Y-rotation
 */
function addTargetFrame(width, positionX, positionY, positionZ, rotationY) {
    /**
     * Factor to get the correct import scale by pixels
     * @type {number}
     */
    var pixelToScale = width / 3.25;
    /**
     * Geometry for the fly through plane
     * @type {THREE.PlaneGeometry}
     */
    var rectGeo = new THREE.PlaneGeometry(width, width);
    basicMaterial.visible = false;
    /**
     * Mesh for the fly through plane
     * @type {THREE.Mesh}
     */
    var rectMesh = new THREE.Mesh(rectGeo, basicMaterial);
    rectMesh.position.set(positionX, positionY, positionZ);
    rectMesh.rotation.y = rotationY;

    /**
     * Geometry for fly over hit box
     * @type {THREE.BoxGeometry}
     */
    var flyOverBoxGeometry = new THREE.BoxGeometry(width * 1.3, 1, maxStraightSpeed + 1);
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
     * Visible Frame
     * @type {THREE.Group}
     */
    var frame;
    mtlLoader.load('objects/Frame.mtl', function (materials) {

        materials.preload();
        /**
         * Object loader to load 3D objets exported from Blender
         * @type {THREE.OBJLoader}
         */
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load('objects/Frame.obj', function (object) {
            frame = object;
            frame.boundingSphere;
            frame.scale.set(pixelToScale, pixelToScale, pixelToScale);
            frame.position.set(positionX, positionY, positionZ);
            frame.rotation.y = rotationY;
            /**
             * Collection of all hit boxes of the ring
             * @type {Array}
             */
            var hitBoxCollection = [];
            hitBoxCollection.push(frame);
            /**
             * Collection of all fly over meshes of the ring
             * @type {Array}
             */
            var hitBoxFlyOverMeshCollection = [];
            hitBoxFlyOverMeshCollection.push(flyOverBox);
            addTarget(rectMesh, flyOverBox, frame, hitBoxCollection, hitBoxFlyOverMeshCollection);
            scene.add(frame);
            scene.add(rectMesh);
            scene.add(flyOverBox);
        }, onProgress, onError);

    });
}

/**
 * Add a start line
 * @param width
 * @param depth
 * @param positionX
 * @param positionY
 * @param positionZ
 * @param rotationY
 * @param height
 */
function addStartLine(width, depth, positionX, positionY, positionZ, rotationY, height) {
    /**
     * Marker for all components of the start line
     * @type {THREE.Object3D}
     */
    var startLineMarker = new THREE.Object3D();
    /**
     * Geometry for the start line
     * @type {THREE.BoxGeometry}
     */
    var startLineGeo = new THREE.BoxGeometry(width, 1, depth);
    /**
     * Lambert Material
     * @type {THREE.MeshLambertMaterial}
     */
    var lambertMaterial = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
    /**
     * Mesh for the start line
     * @type {THREE.Mesh}
     */
    var startLineMesh = new THREE.Mesh(startLineGeo, lambertMaterial);

    startLineMesh.position.set(positionX, positionY, positionZ);

    startLineMarker.add(startLineMesh);

    /**
     * Geometry for the upper bar
     * @type {THREE.BoxGeometry}
     */
    var startTopGeo = new THREE.BoxGeometry(width, 1, depth);
    /**
     * Lambert Material
     * @type {THREE.MeshLambertMaterial}
     */
    var lambertMaterial = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
    /**
     * Mesh for the upper bar
     * @type {THREE.Mesh}
     */
    var startTopMesh = new THREE.Mesh(startTopGeo, lambertMaterial);
    startTopMesh.position.set(positionX, 355, positionZ);
    startTopMesh.rotation.x = Math.PI * 0.5;
    startLineMarker.add(startTopMesh);

    /**
     * Geometry for the fly through target box
     * @type {THREE.BoxGeometry}
     */
    var startFlyThroughGeo = new THREE.BoxGeometry(width, 600, 20);
    basicMaterial.visible = false;
    /**
     * Mesh for the fly through target box
     * @type {THREE.Mesh}
     */
    var startFlyThroughMesh = new THREE.Mesh(startFlyThroughGeo, basicMaterial);
    startFlyThroughMesh.position.set(positionX, 0, positionZ);
    startLineMarker.add(startFlyThroughMesh);

    /**
     * First cylinder for the start line
     * @type {THREE.Mesh}
     */
    var cylinder1 = createCylinder(positionX - width / 2, 0, positionZ, height)
    /**
     * Fly over circle for collision detection of first cylinder
     * * @type {THREE.Mesh}
     */
    var flyOverCircle1 = createFlyOverCircle(positionX - width / 2, -150, positionZ, 80);
    /**
     * Second cylinder for the start line
     * * @type {THREE.Mesh}
     */
    var cylinder2 = createCylinder(positionX + width / 2, 0, positionZ, height)
    /**
     * Fly over circle for collision detection of second cylinder
     * * @type {THREE.Mesh}
     */
    var flyOverCircle2 = createFlyOverCircle(positionX + width / 2, -150, positionZ, 80);

    startLineMarker.add(cylinder1);
    startLineMarker.add(cylinder2);
    startLineMarker.add(flyOverCircle1);
    startLineMarker.add(flyOverCircle2);
    /**
     * Collection of all hit boxes of the ring
     * @type {Array}
     */
    var hitBoxMeshCollection = [];
    /**
     * Collection of all fly over meshes of the ring
     * @type {Array}
     */
    var hitBoxFlyOverMeshCollection = [];
    hitBoxMeshCollection.push(cylinder1);
    hitBoxFlyOverMeshCollection.push(flyOverCircle1);
    hitBoxMeshCollection.push(cylinder2);
    hitBoxFlyOverMeshCollection.push(flyOverCircle2);
    hitBoxMeshCollection.push(startTopMesh);
    hitBoxFlyOverMeshCollection.push(startLineMesh);

    startLineMarker.position.set(positionX, 0, positionZ);
    startLineMarker.rotation.y = rotationY;
    addTarget(startFlyThroughMesh, startLineMesh, startTopMesh, hitBoxMeshCollection, hitBoxFlyOverMeshCollection);
    scene.add(startLineMarker);

}

/**
 * Create a cylinder
 * @param positionX - X-position
 * @param positionY - Y-position
 * @param positionZ - Z-position
 * @param height - Height
 * @returns {THREE.Mesh}
 */
function createCylinder(positionX, positionY, positionZ, height) {
    /**
     * Geometry for the cylinder
     * @type {THREE.CylinderGeometry}
     */
    var cylinderGeometry = new THREE.CylinderGeometry(50, 50, height, 5, 5);
    /**
     * Lambert Material
     * @type {THREE.MeshLambertMaterial}
     */
    var lambertMaterial = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
    /**
     * Mesh for the cylinder
     * @type {THREE.Mesh}
     */
    var cylinderMesh = new THREE.Mesh(cylinderGeometry, lambertMaterial);
    cylinderMesh.position.set(positionX, positionY, positionZ);
    return cylinderMesh;
}
/**
 * Create a circle facing upwards
 * @param positionX - X-position
 * @param positionY - Y-position
 * @param positionZ - Z-position
 * @param radius - Circle radius
 * @returns {THREE.Mesh}
 */
function createFlyOverCircle(positionX, positionY, positionZ, radius) {
    /**
     * Geometry for the circle
     * @type {THREE.CircleGeometry}
     */
    var circleGeometry = new THREE.CircleGeometry(radius, 30);
    /**
     * Mesh for the circle
     * @type {THREE.Mesh}
     */
    var circleMesh = new THREE.Mesh(circleGeometry, basicMaterial);
    circleMesh.position.set(positionX, positionY, positionZ);
    circleMesh.rotation.x = Math.PI * 0.5;
    return circleMesh;
}

/**
 * uses mostly the same logic as the drone movement to calculate
 * how much on X and Z the obstacles has to move relative to its current rotation
 * so that it moves rectangular to the direction it should be crossed
 * @param rotation
 * @param speed
 * @returns {Object}
 */
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

/**
 * makes the obstacles move
 * every obstacle becomes an object with a move() function
 * it uses the results of calcObstacleMovement and how far and how fast the object should be moved
 * it has a random element, which can make the obstacle faster or slower
 * but still travelling the same distance every time
 *
 * one call of the move function makes the obstacle move just a bit
 * to one entire back and forth cycle takes aproxximately several hundred call (moving duration * 2)
 *
 * @param obstacle
 * @param rotationY
 * @param movingPace
 * @param movingDuration
 */
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

/**
 * this function is called in the animate() function
 * everytime it is called, it iterates over obstaclesToMove[] and the
 * move()-function of each obstacle
 */
function moveObstacles() {
    for (var i = 0; i < obstaclesToMove.length; i++) {
        obstaclesToMove[i].move();
    }
}

