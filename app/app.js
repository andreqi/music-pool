var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');

function sendAsSeen(url, cb) {
    $.post('/view', {
        url: url, 
    }, cb);
}

function initPlayer(spec) {
    var url = spec.url;
    var duration = spec.duration;
    console.log(url, duration);
    var time = duration.match(/((\d*)M)?((\d*)S)/);
    var mins = time[2] ? parseInt(time[2]) : 0;
    var secs = time[4] ? parseInt(time[4]) : 0;
    setTimeout(function() {
        sendAsSeen(url, function() {
            location.reload();
        })
    }, (mins*60 + secs + 4) * 1000);
}

if (ExecutionEnvironment.canUseDOM) {
    var rawProps = document.getElementById('props').innerHTML;
    initPlayer(JSON.parse(rawProps));
}
