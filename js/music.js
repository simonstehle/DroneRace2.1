/**
 * Created by simonstehle on 23.08.16.
 */
/**
 *Find Docs here
 * https://github.com/goldfire/howler.js
 */

var startPlaying = false;

function makeMusic() {
    sound.play();
}

var sound = new Howl({
    src: ['objects/everything_is_awesome.mp3'],
    loop: true,
    volume: 0.5,
    onend: function() {
        console.log('Finished!');
    }
});

//sound.play();



var scoringSound = new Howl({
    src: ['objects/scoring_sound.mp3'],
    loop: false,
    volume: 0.5,
    onend: function() {
        console.log('Finished!');
    }
});

function madePointSound() {
    scoringSound.play();
}


var dyingSound = new Howl({
    src: ['objects/dying_sound.mp3'],
    loop: false,
    volume: 1,
    onend: function() {
        console.log('Finished!');
    }
});

function dyingSoundPlay() {
    dyingSound.play();
}