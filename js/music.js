/**
 * Created by simonstehle on 23.08.16.
 */
/**
 *Find Docs here
 * https://github.com/goldfire/howler.js
 */



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
}

function stopMakingMusic() {
    mainSound.stop();
}


var mainSound = new Howl({
    src: ['objects/euromir_song.mp3'],
    loop: true,
    volume: 0.5,
    
});



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

