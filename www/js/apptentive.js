var app = {
    initialize: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    onDeviceReady: function() {
        document.addEventListener('resume', app.onResume, false);
        document.addEventListener('pause', app.onPause, false);
        Apptentive.deviceReady(app.successLogger, app.errorAlert);
    },
    onResume: function() {
        Apptentive.resume(app.successLogger, app.errorAlert);
    },
    onPause: function() {
        Apptentive.pause(app.successLogger, app.errorAlert);
    }
};
app.initialize();