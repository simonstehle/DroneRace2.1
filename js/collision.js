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
var flyThroughObjects = [];
var flyOverObjects = [];

function addTarget(flyThroughMesh,flyOverMesh, indicatorMesh)
{
    flyThroughObjects.push(flyThroughMesh);
    flyOverObjects.push(flyOverMesh);
    indicatorMeshs.push(indicatorMesh);
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
   /* if(detectTargetHit())
    {
        console.log("Heureka!");
        if(pipe1!=undefined) {
            changeColorOfObject(pipe1,0,255,0);
            flyTroughRingMesh.material = new THREE.MeshBasicMaterial({color: 0x00ff00, doubleSided: true});
            window.setTimeout(function () {
                changeColorOfObject(pipe1,0,255,255);

                flyTroughRingMesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, doubleSided: true});
            }, 4000)
        }
    }*/


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


function detectFlyThrough_old(flyThroughObjects, flyOverObjects) {
    var frontVector = new THREE.Vector3(0,0,-1);
    var frontRayCaster = new THREE.Raycaster(marker.position, frontVector);
    var frontIntersect = frontRayCaster.intersectObjects(flyThroughObjects);

    var bottomVector = new THREE.Vector3(0,-1,0);
    var bottomRayCaster = new THREE.Raycaster(marker.position, bottomVector);
    var bottomIntersect = bottomRayCaster.intersectObjects(flyOverObjects);
    // console.log('front' + frontIntersect.length)
    // console.log('bottom' + bottomIntersect.length)
    if(frontIntersect.length > 0 && bottomIntersect.length > 0){

        return true;

    }
    else{

        return false;
    }

}

function detectTargetHit() {

    flyThroughObjects.forEach(detectFlyThrough)

}

function detectFlyThrough(element, index){
    var frontVector = new THREE.Vector3(0,0,-1);
    var frontRayCaster = new THREE.Raycaster(marker.position, frontVector);
    var frontIntersect = frontRayCaster.intersectObject(flyThroughObjects[index]);
    console.log(frontIntersect);
    if(frontIntersect.length>0)
    {
        console.log('frontIntersect>0')

        detectFlyOver(index);

    }
}

function detectFlyOver(index)
{
    var bottomVector = new THREE.Vector3(0,-1,0);
    var bottomRayCaster = new THREE.Raycaster(marker.position, bottomVector);
    var bottomIntersect = bottomRayCaster.intersectObject(flyOverObjects[index])
    if(bottomIntersect.length>0);
    {
        console.log('bottomIntersect>0, target hit')
        changeColorOfObject(indicatorMeshs[index],0,255,0);
        window.setTimeout(function () {
            changeColorOfObject(indicatorMeshs[index],0,255,255);});
    }
}