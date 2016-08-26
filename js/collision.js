/**
 * Created by simonstehle on 03.08.16.
 */

/**
 * Area for detecting the collisions
 */

/**
 * Meshes for marking the next target and indicating fly-troughs. Usually the visible obstacle itself.
 * @type {Array}
 */
var indicatorMeshes = [];
/**
 * Hit box meshes for fly-through
 * @type {Array}
 */
var flyThroughMeshes = [];
/**
 * Fly-over meshes for fly-through
 * @type {Array}
 */
var flyOverMeshes = [];
/**
 * Hit box meshes for collision
 * @type {Array}
 */
var hitBoxMeshes = [];
/**
 * Fly-over meshes for fly-collision
 * @type {Array}
 */
var hitBoxFlyOverMeshes = [];
/**
 * Number of next target
 * @type {number}
 */
var nextTarget = -1;
/**
 * Number of last target
 * @type {number}
 */
var lastTarget = -1;

resetTargets();

/**
 *
 * @param flyThroughMesh - Hit box mesh for fly-through
 * @param flyOverMesh - Fly-over mesh for fly-through
 * @param indicatorMesh - Mesh for marking the next target and indicating fly-troughs
 * @param hitBoxMeshCollection - Hit box meshes for collision
 * @param hitBoxFlyOverMeshCollection - Fly-over meshes for fly-collision
 */
function addTarget(flyThroughMesh, flyOverMesh, indicatorMesh, hitBoxMeshCollection, hitBoxFlyOverMeshCollection) {
    flyThroughMeshes.push(flyThroughMesh);
    flyOverMeshes.push(flyOverMesh);
    indicatorMeshes.push(indicatorMesh);
    hitBoxMeshes.push(hitBoxMeshCollection);
    hitBoxFlyOverMeshes.push(hitBoxFlyOverMeshCollection);
    lastTarget = lastTarget + 1;
}

/**
 * Change color of mesh
 * @param mesh - Mesh to change the color
 * @param color - New color (format 0xffffff)
 */
function changeColorOfMesh(mesh, color) {
    if (mesh != undefined)
        mesh.traverse(function (child) {
            if ((child instanceof THREE.Mesh)) {
                child.material.color.set(color);
            }
        });
}

/**
 * Detect collisions and fly-through
 * @returns {boolean}
 */
function detectCollisions() {
    if (!gameLoaded)
        return false;
    detectTargetHit();
    /**
     * Bottom vector
     * @type {THREE.Vector3}
     */
    var vector = new THREE.Vector3(0, -1, 0);
    /**
     * Bottom raycaster
     * @type {THREE.Raycaster}
     */
    var rayCaster = new THREE.Raycaster(droneMarker.position, vector);
    /**
     * Bottom intersect
     * @type {Array}
     */
    var intersect = rayCaster.intersectObjects(forbiddenZones);
    if (intersect.length === 0) {
        resetDrone();
        return false;
    }
    else
        return true;
}

/**
 * Detect intersect between drone and object
 * @param intersectObject - Hit box mesh
 * @returns {boolean}
 */
function detectBottomIntersect(intersectObject) {
    /**
     * Bottom vector
     * @type {THREE.Vector3}
     */
    var bottomVector = new THREE.Vector3(0, -1, 0);
    /**
     * Bottom raycaster
     * @type {THREE.Raycaster}
     */
    var bottomRayCaster = new THREE.Raycaster(droneMarker.position, bottomVector);
    /**
     * Bottom intersect
     * @type {Array}
     */
    var bottomIntersect = bottomRayCaster.intersectObject(intersectObject)
    if(bottomIntersect.length>0)
        return true;
    return false;
}


/**
 * Detect collisions and fly through for all targets
 */
function detectTargetHit() {
    flyThroughMeshes.forEach(detectFlyOver)
}

/**
 * Detect collisions and fly through. Detect bottom intersect first to save ressources
 * @param element - Target
 * @param index - Number of target
 */
function detectFlyOver(element, index) {

    if (detectBottomIntersect(flyOverMeshes[index])) {
        detectFlyThrough(index);
    }

    for (var i = 0; i < hitBoxFlyOverMeshes[index].length; i++) {
        if (detectBottomIntersect(hitBoxFlyOverMeshes[index][i])) {
            detectHit(hitBoxMeshes[index][i]);
        }
    }
}

/**
 * Detect a successful target fly trough
 * @param index
 */
function detectFlyThrough(index) {

    if (index === nextTarget
        && detectIntersect(flyThroughMeshes[index])) {
        changeColorOfMesh(indicatorMeshes[index], 0x3366ff);
        refreshTarget();
        madePointSound();
    }
}

/**
 * Detect Intersect between drone and hit box. Checked directions: Front, back, left, right
 * @param intersectObject - Object to be checked
 * @returns {boolean}
 */
function detectIntersect(intersectObject) {
    if (getRaycastIntersect(intersectObject, new THREE.Vector3(0, 0, -1))
        || getRaycastIntersect(intersectObject, new THREE.Vector3(0, 0, 1))
        || getRaycastIntersect(intersectObject, new THREE.Vector3(-1, 0, 0))
        || getRaycastIntersect(intersectObject, new THREE.Vector3(1, 0, 0)))
        return true;
    return false;
}

/**
 * Detect raycast intersect
 * @param object - Object to be checked
 * @param vector - Intersect vector
 * @returns {boolean}
 */
function getRaycastIntersect(object, vector) {
    if (object === undefined)
        return false;
    /**
     * Raycaster
     * @type {THREE.Raycaster}
     */
    var rayCaster = new THREE.Raycaster(droneMarker.position, vector);
    /**
     * Intersect
     * @type [Array}
     */
    var intersect = rayCaster.intersectObject(object, true);
    if (intersect.length > 0)
        return true;
    return false;
}

/**
 * Detects collision between drone and hit box mesh
 * @param hitBoxesMesh
 */
function detectHit(hitBoxMesh) {
    if (detectIntersect(hitBoxMesh)) {
        resetDrone();
    }
}

function refreshTarget() {
    if (nextTarget === 2)
        startTimer();
    if (nextTarget < lastTarget) {
        nextTarget += 1;
        changeColorOfMesh(indicatorMeshes[nextTarget], 0x33ee33);
    }
    else {
        stopTimer();
        stopGame();
    }
}

/**
 * Reset targets and timer to restart game
 */
function resetTargets() {
    if (!gameLoaded)
        return;
    nextTarget = -1;
    console.log('Reset Targets');
    //startTimer();
    for (var i = 0; i < indicatorMeshes.length; i++) {
        changeColorOfMesh(indicatorMeshes[i], 0xffffff);
    }
    refreshTarget();
    resetTimer();
}

/**
 * Stop the game after flying through all targets
 */
function stopGame() {

    if (gameLoaded === false) return;
    gameLoaded = false;

    /**
     * Last personal best time
     * @type {string}
     */
    var recentPersonalBestTime = getCookie("Level" + getCookie("ActualLevel"));
    //Check ift the Time was better than the latest personal best. If it was, overwrite the cookie
    console.log("Current Highscore" + recentPersonalBestTime);
    console.log("Time: " + getCurrentTime());
    if ((getCookie("Level" + getCookie("ActualLevel")) > getCurrentTime())) {

        setCookie("Level" + getCookie("ActualLevel"), getCurrentTime(), 100);
    }
    if (getCookie("Level" + getCookie("ActualLevel")) == undefined || getCookie("Level" + getCookie("ActualLevel")) == 0) {
        setCookie("Level" + getCookie("ActualLevel"), getCurrentTime(), 100);
    }
    document.getElementById('overlaytext').className = "overlayingTextBox";
    document.getElementById('timeJustFlew').innerHTML = getCurrentTime();

    if (recentPersonalBestTime > getCurrentTime()) {
        document.getElementById("resultText").innerHTML = "Congrats, you set a new highscore for this level!";
    }
    else if (recentPersonalBestTime === undefined || recentPersonalBestTime === "") {
        document.getElementById("resultText").innerHTML = "You set a first highscore. Try to get better by flying again!";
    }
    else {
        document.getElementById("resultText").innerHTML = "Damn, you couldn't set another highscore. Go ahead and try again!";
    }


    
}

/**
 * Reset the drone to it's starting position
 */
function resetDrone() {
    droneMarker.position.set(-8000, 0, 400);
    droneMarker.rotation.y = 0;
    globalAngle = 0;
    resetStraight();
    resetSide();
    setTimeout(function () {
        crash = false;
    }, 500);

    if (gameLoaded)
        resetTargets();
}

