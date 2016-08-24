/**
 * Created by simonstehle on 23.08.16.
 */


var scoreboard = new  Scoreboard();

startOnLoad();
scoreboard.timer();

function startOnLoad() {
    setHelp();
}

function inAnimate() {
    showSpeed();
}

function setHelp() {
    scoreboard.help("Fliege durch die grün markierten Hindernisse!");
    scoreboard.showHelp();
}

function startTimer() {
    scoreboard.startTimer();
}

function resetTimer() {
    scoreboard.resetTimer();
}

function stopTimer() {
    scoreboard.stopTimer();
}

function showSpeed() {
    scoreboard.message("Forward Speed: " + speedDisplay(currentStraightSpeed));
    scoreboard.addMessage("Side Speed: " + speedDisplay(currentSideSpeed));
    scoreboard.addMessage("You're playing Level ");
    scoreboard.showMessage();
}

function getActualTime() {
    return scoreboard.getTime();
}
