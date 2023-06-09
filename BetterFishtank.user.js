// ==UserScript==
// @name        BetterFishtank
// @namespace   Violentmonkey Scripts
// @match       *://*.fishtank.live/*
// @grant       none
// @version     1.2
// @author      BowDown097
// @homepageURL https://github.com/BowDown097/BetterFishtank
// @description Improvements to the fishtank.live website.
// @icon        https://pbs.twimg.com/profile_images/1647770068749516802/8i6HgC65_200x200.jpg
// @require     https://unpkg.com/keycode-js@3.1.0/dist/keycode.min.js
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// ==/UserScript==

function createIconButton(svg) {
    const restoreChatBtn = document.createElement("button");

    const restoreChatIcon = document.createElement("div");
    restoreChatIcon.className = "Icon_icon__rliEl";
    restoreChatIcon.style.pointerEvents = "auto";

    restoreChatIcon.insertAdjacentHTML("afterbegin", svg);
    restoreChatBtn.appendChild(restoreChatIcon);

    return restoreChatBtn;
}

const fullScreenSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
<path style="fill:currentcolor;" d="M 1.199219 1.199219 L 1.199219 8.398438 L 3.601562 8.398438 L 3.601562 3.601562 L 8.398438 3.601562 L 8.398438 1.199219 Z M 3.601562 15.601562 L 1.199219 15.601562 L 1.199219 22.800781 L 8.398438 22.800781 L 8.398438 20.398438 L 3.601562 20.398438 Z M 20.398438 20.398438 L 15.601562 20.398438 L 15.601562 22.800781 L 22.800781 22.800781 L 22.800781 15.601562 L 20.398438 15.601562 Z M 20.398438 1.199219 L 15.601562 1.199219 L 15.601562 3.601562 L 20.398438 3.601562 L 20.398438 8.398438 L 22.800781 8.398438 L 22.800781 1.199219 Z M 20.398438 1.199219 "/>
</svg>
`;

const restoreChatSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
<path style="fill:currentcolor;" d="M 1.921875 12 L 1.921875 22.078125 L 4.078125 22.078125 L 4.078125 20.160156 L 6 20.160156 L 6 18 L 22.078125 18 L 22.078125 1.921875 L 1.921875 1.921875 Z M 19.921875 9.960938 L 19.921875 15.839844 L 6 15.839844 L 6 18 L 4.078125 18 L 4.078125 4.078125 L 19.921875 4.078125 Z M 19.921875 9.960938 "/>
</svg>
`;

/*** Chat collapse ***/
document.arrive(".Chat_chat__Bdojy", function(chatDiv) {
    const collapseButton = document.createElement("button");
    collapseButton.className = "Button_button__WqJhY Button_small__1CiMC";
    collapseButton.innerText = "COLLAPSE";
    collapseButton.style.padding = "0";

    collapseButton.onclick = function() {
        document.querySelector(".Chat_chat__Bdojy").style.display = "none";
        document.querySelector(".MainPanel_main-panel__imCh9").style.gridColumn = "2/4";

        document.arrive(".LiveStreamsControls_controls__w8C5J", {existing: true}, function (controls) {
            const restoreChatBtn = createIconButton(restoreChatSvg);
            restoreChatBtn.onclick = function() {
                document.querySelector(".Chat_chat__Bdojy").style.display = "flex";
                document.querySelector(".MainPanel_main-panel__imCh9").style.gridColumn = "2/3";
                document.unbindArrive(".LiveStreamsControls_controls__w8C5J");
                restoreChatBtn.remove();
            };
            restoreChatBtn.style = "position: absolute; top: 0; right: 48px; margin: 8px; pointer-events: auto";

            controls.appendChild(restoreChatBtn);
        });
    };

    chatDiv.appendChild(collapseButton);
});

/*** Fullscreen button in controls ***/
document.arrive(".LiveStreamsControls_prev-next__pbktS", function(controls) {
    const fullScreenBtn = createIconButton(fullScreenSvg);
    fullScreenBtn.onclick = () => document.querySelector(".LiveStreamsCloudflarePlayer_live-streams-player__OCZ2v iframe").requestFullscreen();
    controls.appendChild(fullScreenBtn);
});

/*** Auto Dismiss Seasonpass Toast ***/
const t0 = Date.now();
document.arrive(".Toast_close__c0JjL", function(controls) {
    if ((Date.now() - t0)/1000 < 9) { //still allow using the GET SEASON PASS button
        document.querySelector('.Toast_close__c0JjL').click();
    }
});

//capture keyboard input over the player
document.arrive(".LiveStreamsCloudflarePlayer_live-streams-player__OCZ2v", function(player) {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = "inherit";
    overlay.style.height = "inherit";
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.tabIndex = '0'; // Make the overlay focusable

    player.appendChild(overlay);
});

//set thumbnails to HD (still right click on thumbnails in grid view)
document.arrive(".LiveStreamsGridItem_thumbnail__LAKyg",function(thumb) {
    if (thumb.firstElementChild) {
        let src = thumb.firstElementChild.src;
        if (src.substring(src.length-4,src.length) !== "1080") {
            thumb.firstElementChild.src = src + "?height=1080";
        }
    }
});

//make room label smaller
document.arrive(".LiveStreamsFullScreen_name__TtYJX",function(label) {
   label.style.fontSize="24px";
});

//define keyboard controls
const roomToKeys = [["1","NUMPAD1"],["2","NUMPAD2"],["3","NUMPAD3"],["4","NUMPAD4"],["5","NUMPAD5"],["6","NUMPAD6"],["7","NUMPAD7"],["8","NUMPAD8"],["9","NUMPAD9"],["0","NUMPAD0","MULTIPLY"],["DASH","SUBTRACT"]];
const keyCodeToRoom = {};
for (let n=0; n<roomToKeys.length; n++) {
    const keys = roomToKeys[n];
    for (let j=0; j<keys.length; j++) {
        keyCodeToRoom[ KeyCode["KEY_"+keys[j]] ] = n;
    }
}

//concept of showing keys in place of [online] (not enabling by default)
/***
document.arrive(".LiveStreamsListItem_status__9Q3_6",function(statusdiv) {
    const n = Array.from(statusdiv.parentNode.parentNode.parentNode.children).indexOf(statusdiv.parentNode.parentNode) - 2;
    if (roomToKeys[n]) {
        statusdiv.textContent = "[KEY " + KeyCode["VALUE_"+roomToKeys[n][0]] + "]";
    }
});
***/

/*** Keyboard camera navigation (numbers + arrows) ***/
document.addEventListener("keydown", function(event) {
    if (event.isComposing || document.activeElement?.selectionStart !== undefined || document.activeElement?.isContentEditable) {
        return;
    }

    if (keyCodeToRoom[event.keyCode] != null) {
        document.querySelector(".LiveStreamsListItem_live-streams-list-item__rALBj:nth-child("+(keyCodeToRoom[event.keyCode]+3)+")")?.click();
    } else if (event.keyCode === KeyCode.KEY_UP) {
        document.querySelector(".LiveStreamsControls_prev-next__pbktS button")?.click();
    } else if (event.keyCode === KeyCode.KEY_DOWN) {
        document.querySelector(".LiveStreamsControls_prev-next__pbktS button:nth-child(2)")?.click();
    } else if (event.keyCode === KeyCode.KEY_M) {
        document.querySelector(".LiveStreamsControls_mute__POpUL")?.click();
    }
});
