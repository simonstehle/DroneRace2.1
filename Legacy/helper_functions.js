/

function acceleration(vMax, aMax, vCurr) {

}

function arrowUpAcc (vMax, aMax, vCurr) {
    var m = aMax / ((0.5*vMax)*(0.5*vMax));
    var aCurr;
    aCurr = - m * (vCurr - (0.5*vMax))+aMax;
    return aCurr;
}

function arrowDownAcc () {}