/**
 * Created by simonstehle on 23.08.16.
 */
/**
 *Find Docs here
 * https://github.com/goldfire/howler.js
 */

var sound = new Howl({
    src: ['objects/everything_is_awesome.mp3'],
    loop: true,
    volume: 0.5,
    onend: function() {
        console.log('Finished!');
    }
});

//sound.play();