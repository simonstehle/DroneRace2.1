/**
 * Created by simonstehle on 03.08.16.
 */

/**
 * Area for detecting the collisions
 */


/**
 * all legitimate zones are stored in this array,
 * so the drone is only allowed to fly there
 * additionally, there will be forbiddenZones within allowedZones,
 * which resemble the obstacles in the court
 * @type {Array}
 */

/**
 * Meshs for marking the next target and indicating fly-troughs. Usually the obstacle itself.
 * @type {Array}
 */
var indicatorMeshes = [];
var flyThroughMeshes = [];
var flyOverMeshes = [];
var hitBoxMeshes = [];
var hitBoxFlyOverMeshes = [];
var nextTarget = -1;
var lastTarget = -1;

resetTargets();

function addTarget(flyThroughMesh, flyOverMesh, indicatorMesh, hitBoxMeshCollection, hitBoxFlyOverMeshCollection) {
    flyThroughMeshes.push(flyThroughMesh);
    flyOverMeshes.push(flyOverMesh);
    indicatorMeshes.push(indicatorMesh);
    hitBoxMeshes.push(hitBoxMeshCollection);
    hitBoxFlyOverMeshes.push(hitBoxFlyOverMeshCollection);
    lastTarget = lastTarget + 1;
}


function changeColorOfMesh(mesh, color) {
    if (mesh != undefined)
        mesh.traverse(function (child) {
            if ((child instanceof THREE.Mesh)) {
                child.material.color.set(color);
            }
        });
}

/**
 * detect collision
 * @returns {boolean}
 */
function detectCollisions() {
    if (!gameLoaded)
        return false;
    detectTargetHit();
    var vector = new THREE.Vector3(0, -1, 0);
    var rayCaster = new THREE.Raycaster(droneMarker.position, vector);
    var intersect = rayCaster.intersectObjects(forbiddenZones);
    if (intersect.length === 0) {
        resetDrone();
        console.log("Crash: " + crash)
        return false;
    }
    else
        return true;
}

function detectBottomIntersect(intersectObject) {
    var bottomVector = new THREE.Vector3(0, -1, 0);
    var bottomRayCaster = new THREE.Raycaster(droneMarker.position, bottomVector);
    var bottomIntersect = bottomRayCaster.intersectObject(intersectObject)
    if(bottomIntersect.length>0)
        return true;
    return false;
}



function detectTargetHit() {
    flyThroughMeshes.forEach(detectFlyOver)

}
//flyOverFirst to save ressources
function detectFlyOver(element, index) {

    if (detectBottomIntersect(flyOverMeshes[index])) {
        detectFlyThrough(index);
    }

    for (var i = 0; i < hitBoxFlyOverMeshes[index].length; i++) {
        if (detectBottomIntersect(hitBoxFlyOverMeshes[index][i])) {
            detectHit(index, i);
        }
    }
}

function detectFlyThrough(index) {

    if (index === nextTarget
        && detectIntersect(flyThroughMeshes[index])) {
        changeColorOfMesh(indicatorMeshes[index], 0x3366ff);
        refreshTarget();
        madePointSound();
    }
}

function detectIntersect(intersectObject) {
    if (getRaycastIntersect(intersectObject, new THREE.Vector3(0, 0, -1))
        || getRaycastIntersect(intersectObject, new THREE.Vector3(0, 0, 1))
        || getRaycastIntersect(intersectObject, new THREE.Vector3(-1, 0, 0))
        || getRaycastIntersect(intersectObject, new THREE.Vector3(1, 0, 0)))
        return true;
    return false;
}

function getRaycastIntersect(object, vector) {
    if (object === undefined)
        return false;
    var rayCaster = new THREE.Raycaster(droneMarker.position, vector);
    var intersect = rayCaster.intersectObject(object, true);
    if (intersect.length > 0)
        return true;
    return false;
}

function detectHit(hitBoxes, index) {
    if (detectIntersect(hitBoxMeshes[hitBoxes][index])) {
        changeColorOfMesh(indicatorMeshes[hitBoxes], 0xff0000);
        resetDrone();
    }
}

function refreshTarget() {
    console.log('Refresh Targets');
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

function stopGame() {

    if (gameLoaded === false) return;
    gameLoaded = false;

    var recentPersonalBestTime = getCookie("Level" + getCookie("ActualLevel"))
    //Check ift the Time was better than the latest personal best. If it was, overwrite the cookie
    console.log("Current Highscore" + recentPersonalBestTime);
    console.log("Time: " + getActualTime());
    if ((getCookie("Level" + getCookie("ActualLevel")) > getActualTime())) {

        setCookie("Level" + getCookie("ActualLevel"), getActualTime(), 100);
    }
    if (getCookie("Level" + getCookie("ActualLevel")) == undefined || getCookie("Level" + getCookie("ActualLevel")) == 0) {
        setCookie("Level" + getCookie("ActualLevel"), getActualTime(), 100);
    }
    document.getElementById('overlaytext').className = "overlayingTextBox";
    document.getElementById('timeJustFlew').innerHTML = getActualTime();

    if (recentPersonalBestTime > getActualTime()) {
        document.getElementById("resultText").innerHTML = "Congrats, you set a new highscore for this level!";
    }
    else if (recentPersonalBestTime === undefined || recentPersonalBestTime === "") {
        document.getElementById("resultText").innerHTML = "You set a first highscore. Try to get better by flying again!";
    }
    else {
        document.getElementById("resultText").innerHTML = "Damn, you couldn't set another highscore. Go ahead and try again!";
    }
}

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

