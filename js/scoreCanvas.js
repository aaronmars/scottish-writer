(function() {
    'use strict';
    Polymer('smw-score-canvas', {
        /*width: 850,
        height: 1100,*/
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
            var backend = Vex.Flow.Renderer.Backends.RAPHAEL;
            var renderer = new Vex.Flow.Renderer(this.$.vexflowCanvas, backend);
            this.vexContext = renderer.getContext();
            this.vexContext.scale(0.5, 0.5);
        },
        dataChanged: function() {
            if(this.vexContext) {
                this.vexContext.clear();
            }
        }
    });
})();
