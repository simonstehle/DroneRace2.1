/**
 * Created by Marcel Hauser on 19.08.2016.
 */

"use strict";

/**
 *
 * @type {boolean}
 */
var zepCrashFlag = false;
var zeppelinRotation = 0.005;
var firstTime = 0;

function zeppelin_circle(rotation) {
    if (rotation > 0.06) rotation = 0.06;
    zepMarker.rotateY(rotation);
}


function speedDisplay(speed) {
    var displaySpeed = Math.round(speed);
    return displaySpeed;
}

function zeppelin_crash() {
    if (zepMarker.position.y > -5000) zepMarker.position.y -= 70;
    if (zeppelin.position.z = 0) zeppelin.position.x -= 10;
    if (zeppelin.position.x = 0) zeppelin.position.z -= 10;
}


function moveZeppelin (crash) {

    if (crash) {
        if (firstTime<3) firstTime ++;
        if (firstTime === 1) dyingSoundPlay();
        //console.log("Zeppelin crash!");
        zeppelin_crash();
        zeppelinRotation += 0.001;
        zeppelin_circle(zeppelinRotation);
    }
    else {
        zeppelin_circle(zeppelinRotation);
    }

}