(function() {
    'use strict';
    var _vexContext = null;
    var _leftOffset = 0;
    var _topOffset = 10;
    var _measureWidth = 0;
    var _staffHeight = 100;
    Polymer('smw-scoreBody', {
        width: 850,
        height: 1100,
        measuresPerStaff: 4,
        linesConfig: [ false, true, false ],
        staffConfig: [],
        data: {},
        dataChanged: function() {
            this.drawScore(this.data);
        },
        ready: function() {
            var self = this;
            _vexContext = new Vex.Flow.Renderer(self.$.scoreCanvas, Vex.Flow.Renderer.Backends.CANVAS).getContext();
            self.linesConfig.forEach(function(line) {
                self.staffConfig.push({ visible: line });
            });
            _measureWidth = (this.width / this.measuresPerStaff) - 1;
        },
        scoreReceived: function(e) {
            _vexContext.clear();
            this.data = e.detail.response;
        },
        addMeasure: function() {
            if(!('staves' in this.data)) {
                this.data.staves = [ { measures: [] } ];
            }
            var staffIndex = this.data.staves.length - 1;
            if(this.data.staves[staffIndex].measures.length === this.measuresPerStaff) {
                this.data.staves.push({ measures: [] });
            }
            this.data.staves[staffIndex].measures.push({});
            this.drawMeasure();
        },
        drawScore: function(score) {
            if(!('staves' in score)) {
                return;
            }
            var staffIndex = 0;
            score.staves.forEach(function(staff) {
                this.drawStaff(staff, staffIndex++);
            }, this);
        },
        drawStaff: function(staff, index) {
            if(!('measures' in staff)) {
                return;
            }
            var topOffset = _topOffset + (index * _staffHeight);
            var measureIndex = 0;
            staff.measures.forEach(function(measure) {
                this.drawMeasure(measure, topOffset, measureIndex++);
            }, this);
        },
        drawMeasure: function(measure, top, index) {
            var leftOffset = _leftOffset + (index * _measureWidth);
            var stave = new Vex.Flow.Stave(leftOffset, top, _measureWidth);
            stave.setNumLines(this.staffConfig.length)
                .setConfigForLines(this.staffConfig);
            if(index > 0) {
                stave.setBegBarType(Vex.Flow.Barline.type.NONE);
            }
            stave.setContext(_vexContext).draw();
        }
    });
})();
