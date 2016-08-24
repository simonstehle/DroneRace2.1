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
    volume: 0.05,
    onend: function() {
        console.log('Finished!');
    }
});

