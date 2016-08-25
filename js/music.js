/**
 * Created by simonstehle on 23.08.16.
 */
/**
 *Find Docs here
 * https://github.com/goldfire/howler.js
 *
 *
 * This file includes everything related to music in the Game.
 *
 * We are using the howler.js libary to use mp3 songs
 *
 * every Song is stored inside the objects directory and cut to abour 1 minute to make loading faster
 */



var mainSound;

if (getCookie("playSounds") === "") {
    setCookie("playSounds", "true", 100);
}

var startPlaying;
if (getCookie("playSounds") === "true") {
    startPlaying = true;
} else {
    startPlaying = false;
}


function makeMusic() {

    mainSound.play();
    //mainSound.seek(80);
}

function stopMakingMusic() {
    mainSound.stop();
}

/**
 * Function to set the main sound to play.
 * @param path - String to set the mp3 file to play
 */
function setMainSound(path) {
    mainSound = new Howl({
        src: [path],
        loop: true,
        volume: 0.5

    });
}


/**
 * Sound to be played after a obstacle is done.
 * Initializing
 * @type {*|Howl}
 */
var scoringSound = new Howl({
    src: ['objects/scoring_sound.mp3'],
    loop: false,
    volume: 0.5

});

/**
 * Actually let the scoring sound play.
 * chacks if music is muted
 */
function madePointSound() {
    if (getCookie("playSounds") === "true") {
        scoringSound.play();
    }

}

/**
 * Sound for the Zeppelin
 * initializing
 * @type {*|Howl}
 */
var dyingSound = new Howl({
    src: ['objects/dying_sound.mp3'],
    loop: false,
    volume: 1

});

/**
 * let the dying sound play once
 */
function dyingSoundPlay() {
    if (getCookie("playSounds") === "true") {
        dyingSound.play();
    }

}


/**
 * function to set the mute/play icon at the right top
 */
function setGlyphiconMusicStart() {
    if (getCookie("playSounds") === "true") {
        document.getElementById("volumeGlyphicon").className = "glyphicon glyphicon-volume-up";
    } else {
        document.getElementById("volumeGlyphicon").className = "glyphicon glyphicon-volume-off";
    }

}

/**
 * Function to be called when the user is muting the music
 * Also checks and sets the glyphicons
 */
function stopMusic() {
    var className = document.getElementById("volumeGlyphicon").className;

    if (className === "glyphicon glyphicon-volume-up") {
        setCookie("playSounds", "false", 100);
        stopMakingMusic();
        document.getElementById("volumeGlyphicon").className = "glyphicon glyphicon-volume-off";
    } else {

        setCookie("playSounds", "true", 100);
        document.getElementById("volumeGlyphicon").className = "glyphicon glyphicon-volume-up";
        makeMusic();
    }
}

