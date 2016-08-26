/**
 * Created by simonstehle on 23.08.16.
 */

/**
 * Scoreboard for displaying Time, speed and current level
 * @type {Scoreboard}
 */
var scoreboard = new Scoreboard();

startOnLoad();

/**
 * Set help text and initialize timer
 */
function startOnLoad() {
    setHelp();
    scoreboard.timer();
}

/**
 * Display help text on scoreboard
 */
function setHelp() {
    //scoreboard.help("Fly through the green marked obstacles!");
    scoreboard.showHelp();
}

/**
 * Start timer
 */
function startTimer() {
    scoreboard.startTimer();
}

/**
 * Reset timer
 */
function resetTimer() {
    scoreboard.resetTimer();
}

/**
 * Stop timer
 */
function stopTimer() {
    scoreboard.stopTimer();
}

/**
 * Show info on scoreboard
 */
function showSpeed() {
    scoreboard.message("Straight Speed: " + getDisplaySpeed(currentStraightSpeed));
    scoreboard.addMessage("Side Speed: " + getDisplaySpeed(currentSideSpeed));
    var showLevel = getCookie("ActualLevel");
    scoreboard.addMessage("You're playing Level " + showLevel);
    scoreboard.showMessage();
}

/**
 * Get current game time of
 */
function getCurrentTime() {
    return scoreboard.getTime();
}

/**
 * Round the speed for a better look
 * @param speed - Speed to round
 * @returns {number}
 */
function getDisplaySpeed(speed) {
    var displaySpeed = Math.round(speed);
    return displaySpeed;
}
