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

    //addTube(30,200,250,-3000,40,3000, 0);


    addTargetFrame(800,-5000,800,3000, Math.PI *0.25);

    setMainSound('objects/bennyHillTheme.mp3');
    if(startPlaying)
        makeMusic();

}

function buildLevel2()
{
    addStartFinishLine(1000,100,-4000,-80,0,0,800);

    addTargetRing(150, 250, -8000, 200,-2000,0, scene,-10,100);

    addTube(25,200,250,1500,1500,-7000, Math.PI * 0.3);

    build3MovingWallObstacle(600,1000,7000,0, Math.PI*0.5, 20, 150);

    addTargetRing(400, 500, 3500, 1900, -4000,Math.PI*0.25, scene,0,0);
    addTargetRing(400, 500, 4500, 500, -2000,Math.PI*0.25, scene,0,0);

    addTargetRing(200, 300, 5000, 200, 0,0, scene,-10,100);
    addTargetRing(200, 300, 5500, 200, 800,0, scene,0,0);
    addTargetRing(200, 300, 6000, 200, 1600,0, scene,5,200);

    addTargetRing(250, 300, 6000, 400, 4500,Math.PI*0.75, scene,0,0);

    build3MovingWallObstacle(1000,2000,0,-6000, Math.PI*1.2, 10, 100);

    addTube(50,200,250,1000,0,-2500, Math.PI*1.2);



    addTargetFrame(800,-5000,800,3000, Math.PI *0.25);
    addTargetFrame(800,-6000,2000,1000, Math.PI*0.25);
    addTargetFrame(800,-6500,4000,-2000, Math.PI*0.25);

    setMainSound('objects/euromir_song.mp3');
    if(startPlaying)
        makeMusic();
}

function buildLevel3(){
    addStartFinishLine(1000,100,-4000,-80,0,0,800);
    setMainSound('objects/everything_is_awesome.mp3');
    if(startPlaying)
        makeMusic();
}















