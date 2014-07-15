/*jshint camelcase: false */
(function() {
    'use strict';
    var _measureWidth = 0;
    Polymer('smw-score-canvas', {
        width: 850,
        height: 1100,
        measuresPerStaff: 4,
        linesConfig: [ false, false, true, false, false ],
        staffConfig: [],
        vexContext: null,
        musicChanged: function(signal) {
            var info = signal.detail;
            switch(info.command) {
                case 'add-bar':
                    this.addMeasure();
                    break;
            }
        },
        created: function() {
            this.data = {};
        },
        ready: function() {
            this.vexContext = new Vex.Flow.Renderer(this.$.vexflowCanvas, Vex.Flow.Renderer.Backends.CANVAS).getContext();
            this.linesConfig.forEach(function(line) {
                this.staffConfig.push({ visible: line });
            }, this);
            _measureWidth = (this.width / this.measuresPerStaff) - 1;
        },
        addMeasure: function() {
            if(!('staves' in this.data)) {
                this.data.staves = [ { measures: [] } ];
            }
            var staffIndex = this.data.staves.length - 1;
            if(this.data.staves[staffIndex].measures.length === this.measuresPerStaff) {
                this.data.staves.push({ measures: [] });
                staffIndex++;
            }
            this.data.staves[staffIndex].measures.push({});
        }
    });
})();
