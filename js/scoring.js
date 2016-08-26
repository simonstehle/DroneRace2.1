/**
 * Created by simonstehle on 23.08.16.
 */


var scoreboard = new Scoreboard();

startOnLoad();
scoreboard.timer();

function startOnLoad() {
    setHelp();
}

function inAnimate() {
    showSpeed();
}

function setHelp() {
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
    scoreboard.message("Straight Speed: " + speedDisplay(currentStraightSpeed));
    scoreboard.addMessage("Side Speed: " + speedDisplay(currentSideSpeed));
    var showLevel = getCookie("ActualLevel");
    scoreboard.addMessage("You're playing Level " + showLevel);
    scoreboard.showMessage();
}

function getActualTime() {
    return scoreboard.getTime();
}

function speedDisplay(speed) {
    var displaySpeed = Math.round(speed);
    return displaySpeed;
}
