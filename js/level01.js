/**
 * Created by simonstehle on 03.08.16.
 */



addTargetRing(200, 250, 250, 250, 0,Math.PI*.25);
addTargetRing(2000, 2500, 2500, 2500, 1000,0);

build3WallObstacle(1000,2000,3000,1500, Math.PI * 0.25);



addTargetFrame(800,-1000,2000,-2000, 0);


for (var i=0; i<20; i++){

    addTargetRing(250,300,(i*180-250),0,(-1100),Math.PI*0.5);



}


addStartFinishLine(1000,100,1000,-80,2000,0,800);