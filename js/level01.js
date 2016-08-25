/**
 * Created by simonstehle on 03.08.16.
 */

var actualLevel = getCookie("ActualLevel");

function buildLevels() {

    if(actualLevel == 1){
        buildLevel1();
    }
    if (actualLevel == 2){
        buildLevel2();
    }
    if (actualLevel == 3){
        buildLevel3();
    }

}


function buildLevel1()
{
    addStartFinishLine(1000,100,-4000,-80,0,0,800);

    addTube(25,200,250,1500,0,-7000, Math.PI * 0.3);

    build3WallObstacle(1000,2000,6000,-4000, Math.PI*0.2);

    addTargetRing(200, 300, 6000, 200, 0,0, scene,0,0);
    addTargetRing(200, 300, 5500, 200, 800,0, scene,0,0);
    addTargetRing(200, 300, 6100, 200, 1600,0, scene,0,0);

    build3WallObstacle(1000,2000,0,-6000, Math.PI*1.2);


    addTargetRing(200, 250, 250, 250, 3250,Math.PI*0.5, scene, 0,0);

    addTube(30,200,250,-3000,40,3000, 0);


    addTargetFrame(800,-5000,800,3000, Math.PI *0.25);

}

function buildLevel2()
{
    addStartFinishLine(1000,100,-4000,-80,0,0,800);

    addTargetRing(200, 300, 5000, 200, 0,0, scene,-10,100);
    addTargetRing(200, 300, 5500, 200, 800,0, scene,0,0);
    addTargetRing(200, 300, 6000, 200, 1600,0, scene,10,100);

    build3MovingWallObstacle(1000,2000,0,-6000, Math.PI*1.2, 10, 100);






    
    addTargetFrame(800,-5000,800,3000, Math.PI *0.25);

}

function buildLevel3(){
    addStartFinishLine(1000,100,-4000,-80,0,0,800);

}















