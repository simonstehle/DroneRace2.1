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

function addTarget(flyThroughMesh, flyOverMesh, indicatorMesh, hitBoxMeshCollection)
{
    flyThroughMeshs.push(flyThroughMesh);
    flyOverMeshs.push(flyOverMesh);
    indicatorMeshs.push(indicatorMesh);
    hitBoxMeshs.push(hitBoxMeshCollection);
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
    detectTargetHit();
    var vector = new THREE.Vector3(0,-1,0);
    var rayCaster = new THREE.Raycaster(marker.position, vector);
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

function detectFlyOver(element, index)
{
    var bottomVector = new THREE.Vector3(0,-1,0);
    var bottomRayCaster = new THREE.Raycaster(marker.position, bottomVector);
    var bottomIntersect = bottomRayCaster.intersectObject(flyOverMeshs[index])
    //console.log(bottomIntersect.length);
    if(bottomIntersect.length>0)
    {
        detectFlyThrough(index);
        detectHit(index);

    }
}

function detectFlyThrough(index){

    if(GetRaycastIntersect(flyThroughMeshs[index], new THREE.Vector3(0,0,-1))
        || GetRaycastIntersect(flyThroughMeshs[index], new THREE.Vector3(0,0,1))
        ||GetRaycastIntersect(flyThroughMeshs[index], new THREE.Vector3(-1,0,0))
        ||GetRaycastIntersect(flyThroughMeshs[index], new THREE.Vector3(1,0,0)))
    {
        changeColorOfObject(indicatorMeshs[index],0,255,0);
        window.setTimeout(function () {
            changeColorOfObject(indicatorMeshs[index],0,255,255);},3000);
    }
}

function GetIntersect(intersectObjects)
{
    for (var i = 0; i < intersectObjects.length; i++) {
        if(GetRaycastIntersect(intersectObjects[i], new THREE.Vector3(0,0,-1))
            || GetRaycastIntersect(intersectObjects[i], new THREE.Vector3(0,0,1))
            ||GetRaycastIntersect(intersectObjects[i], new THREE.Vector3(-1,0,0))
            ||GetRaycastIntersect(intersectObjects[i], new THREE.Vector3(1,0,0)))
            return true;
    }

    return false;
}

function GetRaycastIntersect(object, vector)
{
    var rayCaster = new THREE.Raycaster(marker.position, vector);
    var intersect = rayCaster.intersectObject(object);
    if(intersect.length>0)
        return true;
    return false;
}

function detectHit(index){
    if(GetIntersect(hitBoxMeshs[index]))
    {
        console.log('Hit');
        changeColorOfObject(flyThroughMeshs[index],255,0,0);
        window.setTimeout(function () {
            changeColorOfObject(flyThroughMeshs[index],0,0,255);},3000);
        crash = true;
    }
}

