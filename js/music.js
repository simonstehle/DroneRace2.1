/**
 * Created by simonstehle on 23.08.16.
 */
/**
 *Find Docs here
 * https://github.com/goldfire/howler.js
 */


var mainSound;

if(getCookie("playSounds") === ""){
    setCookie("playSounds", "true",100);
}

var startPlaying;
if(getCookie("playSounds")=== "true"){
    startPlaying = true;
} else{
    startPlaying = false;
}
 




function makeMusic() {

    mainSound.play();
    //mainSound.seek(80);
}

function stopMakingMusic() {
    mainSound.stop();
}

function setMainSound(path)
{
    mainSound = new Howl({
        src: [path],
        loop: true,
        volume: 0.5

    });
}




//mainSound.play();



var scoringSound = new Howl({
    src: ['objects/scoring_sound.mp3'],
    loop: false,
    volume: 0.5,

});

function madePointSound() {
    if(getCookie("playSounds") === "true"){
        scoringSound.play();
    }

}


var dyingSound = new Howl({
    src: ['objects/dying_sound.mp3'],
    loop: false,
    volume: 1,

});

function dyingSoundPlay() {
    dyingSound.play();
}

var droneCrashSound = new Howl({
    src: ['objects/crash_drone.mp3'],
    loop: false,
    volume: 1,

});

function droneCrashSoundPlay() {
    droneCrashSound.play();
}


function setGlyphiconMusicStart() {
    if(getCookie("playSounds")==="true"){
        document.getElementById("volumeGlyphicon").className = "glyphicon glyphicon-volume-up";
    }else{
        document.getElementById("volumeGlyphicon").className = "glyphicon glyphicon-volume-off";
    }

}
function stopMusic(){


    var className =  document.getElementById("volumeGlyphicon").className;

    if (className === "glyphicon glyphicon-volume-up"){
        setCookie("playSounds", "false",100);
        stopMakingMusic();
        document.getElementById("volumeGlyphicon").className = "glyphicon glyphicon-volume-off";
    } else {

        setCookie("playSounds", "true",100);
        document.getElementById("volumeGlyphicon").className = "glyphicon glyphicon-volume-up";
        makeMusic();
    }
}

