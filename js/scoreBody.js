(function() {
    'use strict';
    Polymer('smw-score-body', {
        source: '',
        _setSettings: function(global, overrides) {
            global.timeSignature = overrides.music.timeSignature;
            return global;
        },
        sourceChanged: function() {
            this.$.scoreSource.go();
        },
        scoreReceived: function(e) {
            this.scoreData = e.detail.response;
            this.scoreSettings = this._setSettings(this.$.globalSettings.settings, this.scoreData);
            this.width = (this.scoreSettings.orientation === 'portrait') ? this.width : this.height;
        }
    });
})();
