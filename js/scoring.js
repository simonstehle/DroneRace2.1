/**
 * Created by simonstehle on 03.08.16.
 */


function detectFlyThrough(flyThroughObjects, flyOverObjects) {
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