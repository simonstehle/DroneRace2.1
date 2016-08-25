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
var indicatorMeshs = [];
var flyThroughMeshs = [];
var flyOverMeshs = [];
var hitBoxMeshs = [];
var hitBoxFlyOverMeshs =[];
var nextTarget = -1;
var lastTarget = -1;

ResetTargets();

function addTarget(flyThroughMesh, flyOverMesh, indicatorMesh, hitBoxMeshCollection, hitBoxFlyOverMeshCollection)
{
    flyThroughMeshs.push(flyThroughMesh);
    flyOverMeshs.push(flyOverMesh);
    indicatorMeshs.push(indicatorMesh);
    hitBoxMeshs.push(hitBoxMeshCollection);
    hitBoxFlyOverMeshs.push(hitBoxFlyOverMeshCollection);
    lastTarget=lastTarget+1;
}


function changeColorOfObject(mesh, r, g, b)
{
    if(mesh!=undefined)
    mesh.traverse(function(child){
        if ((child instanceof THREE.Mesh)) {
            child.material.color.setRGB(r,g,b);
        }
    });
}

/**
 * detect collision
 * @returns {boolean}
 */
function detectCollisions() {
    if(!gameLoaded)
        return false;
    detectTargetHit();
    var vector = new THREE.Vector3(0,-1,0);
    var rayCaster = new THREE.Raycaster(droneMarker.position, vector);
    var intersect = rayCaster.intersectObjects(forbiddenZones);
    //console.log("Länge des Intersect " + intersect.length);

    if (intersect.length === 0){
        crash =true;
        console.log("Crash: " +crash)
        return false;
    }
    else{
        return true;
    }
    // return (intersect.length === 0);
}


function detectTargetHit() {
    flyThroughMeshs.forEach(detectFlyOver)

}
//flyOverFirst to save ressources
function detectFlyOver(element, index)
{
    var bottomVector = new THREE.Vector3(0,-1,0);
    var bottomRayCaster = new THREE.Raycaster(droneMarker.position, bottomVector);

    var bottomIntersect = bottomRayCaster.intersectObject(flyOverMeshs[index])
    if(bottomIntersect.length>0)
    {
        detectFlyThrough(index);
    }

    for (var i = 0; i < hitBoxFlyOverMeshs[index].length; i++) {
        var bottomVector = new THREE.Vector3(0,-1,0);
        var bottomRayCaster = new THREE.Raycaster(droneMarker.position, bottomVector);
        var bottomIntersect = bottomRayCaster.intersectObject(hitBoxFlyOverMeshs[index][i])
        if(bottomIntersect.length>0)
        {
            detectHit(index,i);
        }
    }
}

function detectFlyThrough(index){

    if(index === nextTarget
        && (GetRaycastIntersect(flyThroughMeshs[index], new THREE.Vector3(0,0,-1))
        || GetRaycastIntersect(flyThroughMeshs[index], new THREE.Vector3(0,0,1))
        ||GetRaycastIntersect(flyThroughMeshs[index], new THREE.Vector3(-1,0,0))
        ||GetRaycastIntersect(flyThroughMeshs[index], new THREE.Vector3(1,0,0))))
    {
        changeColorOfObject(indicatorMeshs[index],155,155,155);
        RefreshTarget();
        madePointSound();
    }
}

function GetIntersect(intersectObject)
{
        if(GetRaycastIntersect(intersectObject, new THREE.Vector3(0,0,-1))
            ||GetRaycastIntersect(intersectObject, new THREE.Vector3(0,0,1))
            ||GetRaycastIntersect(intersectObject, new THREE.Vector3(-1,0,0))
            ||GetRaycastIntersect(intersectObject, new THREE.Vector3(1,0,0)))
            return true;
    return false;
}

function GetRaycastIntersect(object, vector)
{
    if(object === undefined)
        return false;
    var rayCaster = new THREE.Raycaster(droneMarker.position, vector);
    var intersect = rayCaster.intersectObject(object,true);
    if(intersect.length>0)
        return true;
    return false;
}

function detectHit(hitBoxes,index){
    if(GetIntersect(hitBoxMeshs[hitBoxes][index]))
    {
        changeColorOfObject(indicatorMeshs[hitBoxes],255,0,0);
        window.setTimeout(function () {
            changeColorOfObject(indicatorMeshs[hitBoxes],200,200,255);},3000);
        crash = true;
        ResetTargets();
    }
}

function RefreshTarget()
{
    console.log('Refresh Targets');
    if(nextTarget === 2)
        startTimer();
    if(nextTarget<lastTarget) {
        nextTarget += 1;
        changeColorOfObject(indicatorMeshs[nextTarget], 0, 255, 0);
    }
    else {
        stopTimer();
        stopGame();
    }




}

function ResetTargets()
{
    if(!gameLoaded)
        return;
    nextTarget=-1;
    console.log('Reset Targets');
    //startTimer();
    for (var i = 0; i < indicatorMeshs.length; i++) {
        changeColorOfObject(indicatorMeshs[i], 155, 155 , 155);
    }
    RefreshTarget();
    resetTimer();

}

function stopGame()
{

    if(gameLoaded === false) return;
    gameLoaded = false;

    var recentPersonalBestTime = getCookie("Level"+getCookie("ActualLevel"))
    //Check ift the Time was better than the latest personal best. If it was, overwrite the cookie
    console.log("Current Highscore"+ recentPersonalBestTime);
    console.log("Time: "+getActualTime());
    if((getCookie("Level"+getCookie("ActualLevel")) > getActualTime())){

        setCookie("Level"+getCookie("ActualLevel"),getActualTime(), 100);
    }
    if(getCookie("Level"+getCookie("ActualLevel")) == undefined || getCookie("Level"+getCookie("ActualLevel")) == 0 ) {
        setCookie("Level"+getCookie("ActualLevel"),getActualTime(), 100);
    }


    
    document.getElementById('overlaytext').className = "overlayingTextBox";
    document.getElementById('timeJustFlew').innerHTML = getActualTime();

    if (recentPersonalBestTime > getActualTime()){
        document.getElementById("resultText").innerHTML = "Congrats, you set a new highscore for this level!";
    }

    else if(recentPersonalBestTime === undefined || recentPersonalBestTime === ""){
            document.getElementById("resultText").innerHTML = "You set a first highscore. Try to get better by flying again!";
        }
   else {
        document.getElementById("resultText").innerHTML = "Damn, you couldn't set another highscore. Go ahead and try again!";
    }
}

/**
 * when the global variable "crash" is true, the drone is respawned at the start/finish line including a 0.5 s timeout
 */
function droneDidCrash(){
    if (crash){
        ResetDrone();
    }
}

function ResetDrone()
{
    droneMarker.position.set(-8000,0,400);
    droneMarker.rotation.y = 0;
    globalAngle = 0;
    resetStraight();
    resetSide();
    setTimeout(function(){
        crash = false;
    }, 500);

    if(gameLoaded)
        ResetTargets();
}

