var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;

var gesturedZone = document.getElementById('task-list');

gesturedZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gesturedZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture();
}, false);

function handleGesture(callback) {
    var swiped = 'swiped: ';
    if (touchendX < touchstartX) {
        //alert(swiped + 'left!');
        callback("left");
    }
    if (touchendX > touchstartX) {
        // alert(swiped + 'right!');
        callback("right");
    }
    if (touchendY < touchstartY) {
        // alert(swiped + 'down!');
        callback("down");
    }
    if (touchendY > touchstartY) {
        // alert(swiped + 'up!');
        callback("up");
    }
    if (touchendY == touchstartY) {
        // alert('tap!');
    }
}
