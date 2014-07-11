(function()  {
    'use strict';
    var _measureIndex = 0;
    Polymer('smw-score-measure', {
        index: 0,
        firstInStaff: false,
        lastInStaff: false,
        ready: function() {
            this.index = _measureIndex;
            var measuresPerStaff = this.settings.measuresPerStaff;
            if((this.index % measuresPerStaff) === 0) {
                this.staffIndex = this.index / measuresPerStaff;
                this.firstInStaff = true;
            } else if((this.index % measuresPerStaff) === (measuresPerStaff - 1)) {
                this.lastInStaff = true;
            }
            console.log(this.width);
            _measureIndex++;
            //var stave = new Vex.Flow.Stave(leftOffset, top, _measureWidth);
        }
    });
})();
