/**
 * Created by simonstehle on 24.08.16.
 */

/**
 * This file is for using the cookies inside the games.
 *
 */


/**
 * This function is to set/create a cookie inside the browser.
 *
 * @param cname - the name of the cookie
 * @param cvalue - the value of the cookie
 * @param exdays - days until the cookie expires
 */

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

/**
 * Function to get the value of a cookie.
 * @param cname - the name of the cookie to be loaded
 * @returns {*} - returns the value of the cookie
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}


