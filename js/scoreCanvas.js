(function() {
    'use strict';
    Polymer('smw-score-canvas', {
        width: 850,
        height: 1100,
        measuresPerStaff: 4,
        linesConfig: [ false, false, true, false, false ],
        staffConfig: [],
        vexContext: null,
        created: function() {
            this.data = {};
        },
        dataChanged: function() {
            this.vexContext.clear();
        },
        ready: function() {
            this.vexContext = new Vex.Flow.Renderer(this.$.vexflowCanvas, Vex.Flow.Renderer.Backends.CANVAS).getContext();
        }
    });
})();
