(function() {
    'use strict';
    Polymer('smw-score-canvas', {
        //width: 850,
        //height: 1100,
        width: 1700,
        height: 2200,
        measuresPerStaff: 2,
        linesConfig: [ false, false, true, false, false ],
        staffConfig: [],
        vexContext: null,
        created: function() {
            this.data = {};
        },
        ready: function() {
            var scaleFactor = 0.5;
            var backend = Vex.Flow.Renderer.Backends.RAPHAEL;
            var renderer = new Vex.Flow.Renderer(this.$.vexflowCanvas, backend);
            this.vexContext = renderer.getContext();
            this.vexContext.setViewBox('0 0 ' + this.width + ' ' + this.height);
            this.vexContext.scale(scaleFactor, scaleFactor);
            this.vexContext.resize(this.width * scaleFactor, this.height * scaleFactor);
        },
        dataChanged: function() {
            if(this.vexContext) {
                this.vexContext.clear();
            }
        }
    });
})();
