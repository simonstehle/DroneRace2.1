/**
 * Created by Marcel Hauser on 22.07.2016.
 *
 * This file contains functions that are called up in other files.
 *
 * /


 /*
 function calcMovement
 This function uses current rotation and pace of
 an object to calculate how far it has to move on
 X and Z in one iteration (pace).
 It uses quadrants to calculate if
 the change of position is negative and positive and
 weather sin or cos hast to be used.


 Param "direction" is an int; you give me the keycode between 37 and 40,
 so the function can determine in which direction relative to the current rotation you want to move

 */

function calcMovement (angle, pace, direction){
    var quadrant, net_angle, moveZ, moveX, PiHalf;
    quadrant = -1;
    PiHalf = Math.PI/2;





    //if (direction==false) angle -= PiHalf*2;

    while (angle<0) { angle+=PiHalf*4; }

    switch (direction) {
        case 37:
            angle += PiHalf;
            break;
        case 39:
            angle += PiHalf*3;
            break;
        case 40:
            angle += PiHalf*2;
            break;
        case 38:
            angle = angle;
            break;
    }

    for (var i = angle; i >= 0; i -= PiHalf) {quadrant++;}
    quadrant = quadrant % 4;

    net_angle = angle % PiHalf;

    if (net_angle < 0) net_angle += PiHalf*4;

    //console.log("Quadrant: " + quadrant+ " Angle: " + net_angle);


    switch (quadrant) {
        case 0:
            moveZ = -(Math.cos(net_angle)*pace);
            moveX = -(Math.sin(net_angle)*pace);
            break;
        case 1:
            moveZ = (Math.sin(net_angle)*pace);
            moveX = -(Math.cos(net_angle)*pace);
            break;
        case 2:
            moveZ = (Math.cos(net_angle)*pace);
            moveX = (Math.sin(net_angle)*pace);
            break;
        case 3:
            moveZ = -(Math.sin(net_angle)*pace);
            moveX = (Math.cos(net_angle)*pace);
            break;
    }
    var move = {};
    move.X = moveX;
    move.Z = moveZ;
    //console.log("X: " + move.X + "Z: " + move.Z);

    return move;


}

function acceleration(vMax, aMax, vCurr) {

}

function arrowUpAcc (vMax, aMax, vCurr) {
    var m = aMax / ((0.5*vMax)*(0.5*vMax));
    var aCurr;
    aCurr = - m * (vCurr - (0.5*vMax))+aMax;
    return aCurr;
}

function arrowDownAcc () {}