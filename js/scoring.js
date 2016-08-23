/**
 * Created by simonstehle on 23.08.16.
 */


var scoreboard = new Scoreboard();
scoreboard.timer()
scoreboard.help(
    'Hey du,<br>'
    + 'Fliege mit der Drone durch das Zeug durch das Grül leuchtet<br> '
    + 'Pass auf dich auf mein Freund<br> '
    + 'Stößt du dagegen stirbst du'
);


function startTimer() {

    scoreboard.startsTimer()

}

function resetTimer() {
    scoreboard.resetTimer()

}


function stopTimer() {

    scoreboard.stopTimer()

}


function scorePoints() {
    if (scoreboard.getTimeRemaining() > 0) {
        scoreboard.addPoints(10);
    }
}