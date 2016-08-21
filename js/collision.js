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

function addTarget(flyThroughMesh, flyOverMesh, indicatorMesh, hitBoxMesh)
{
    flyThroughMeshs.push(flyThroughMesh);
    flyOverMeshs.push(flyOverMesh);
    indicatorMeshs.push(indicatorMesh);
    hitBoxMeshs.push(hitBoxMesh);
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
    console.log(bottomIntersect.length);
    if(bottomIntersect.length>0)
    {
        detectFlyThrough(index);
        detectHit(index);

    }
}

function detectFlyThrough(index){
    var frontVector = new THREE.Vector3(0,0,-1);
    var frontRayCaster = new THREE.Raycaster(marker.position, frontVector);
    var frontIntersect = frontRayCaster.intersectObject(flyThroughMeshs[index]);
    if(frontIntersect.length>0)
    {
        changeColorOfObject(indicatorMeshs[index],0,255,0);
        window.setTimeout(function () {
            changeColorOfObject(indicatorMeshs[index],0,255,255);},3000);
    }
}

function detectHit(index){
    var frontVector = new THREE.Vector3(0,0,-1);
    var frontRayCaster = new THREE.Raycaster(marker.position, frontVector);
    var frontIntersect = frontRayCaster.intersectObject(hitBoxMeshs[index]);
    if(frontIntersect.length>0)
    {
        console.log('Hit');
        changeColorOfObject(hitBoxMeshs[index],255,0,0);
        window.setTimeout(function () {
            changeColorOfObject(hitBoxMeshs[index],0,0,255);},3000);
        crash = true;
    }
}

