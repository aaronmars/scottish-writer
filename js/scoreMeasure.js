/*jshint camelcase: false*/
(function()  {
    'use strict';
    var _measureIndex = 0;
    var _staffConfig = [
        { visible: false },
        { visible: false },
        { visible: false },
        { visible: false },
        { visible: false }
    ];
    var _barLineMap = null;
    Polymer('smw-score-measure', {
        index: 0,
        firstInStaff: false,
        lastInStaff: false,
        get notes() {
            if(this._notes.length === 0) {
                this._notes = this.shadowRoot.querySelectorAll('smw-score-note').array();
            }
            return this._notes;
        },
        created: function() {
            if(!_barLineMap) {
                _barLineMap = {
                    repeatBegin: Vex.Flow.Barline.type.REPEAT_BEGIN,
                    repeatEnd: Vex.Flow.Barline.type.REPEAT_END,
                    single: Vex.Flow.Barline.type.SINGLE,
                    double: Vex.Flow.Barline.type.DOUBLE,
                    end: Vex.Flow.Barline.type.END,
                    none: Vex.Flow.Barline.type.NONE
                };
            }
            this._notes = [];
            this.scoreIndex = _measureIndex;
            _measureIndex++;
        },
        ready: function() {
            var vexNotes = this.notes.map(function(note) {
                return note.vexNote;
            }, this);
            this.index = this.scoreIndex % this.settings.measuresPerStaff;
            this.staffIndex = Math.floor(this.scoreIndex / this.settings.measuresPerStaff);
            if(this.index === 0) {
                this.firstInStaff = true;
            } else if(this.index === this.settings.measuresPerStaff - 1) {
                this.lastInStaff = true;
            }
            if(this.settings.instrument === 'snare') {
                _staffConfig[2].visible = true;
            }
            var stave = new Vex.Flow.Stave(
                this.width * this.index,
                this.settings.staffHeight * this.staffIndex,
                this.width
            );

            // Override barlines for the measure, if specified.  Otherwise, both
            //  of the barlines will be "plain"
            if('beginningBar' in this.data) {
                stave.setBegBarType(_barLineMap[this.data.beginningBar]);
            } else if(!this.firstInStaff) {
                stave.setBegBarType(_barLineMap.none);
            }
            if('endingBar' in this.data) {
                stave.setEndBarType(_barLineMap[this.data.endingBar]);
            }

            // Add the time signature to the first bar in the score
            if(this.firstInStaff && this.staffIndex === 0) {
                var timeSig = this.settings.timeSignature.beats + '/' + this.settings.timeSignature.value;
                stave.addTimeSignature(timeSig, 100);
            }

            // Draw the single staff correspondign to the measure.
            stave.setNumLines(_staffConfig.length)
                .setConfigForLines(_staffConfig)
                .setContext(this.context)
                .draw();

            // Draw note beams here since they involve multiple notes, but don't
            //  cross measure boudaries.
            var beams = Vex.Flow.Beam.generateBeams(vexNotes, {
                stem_direction: -1,
                groups: [ new Vex.Flow.Fraction(3, 8) ]
            });
            Vex.Flow.Formatter.FormatAndDraw(this.context, stave, vexNotes, 0);
            beams.forEach(function(beam) {
                beam.setContext(this.context).draw();
            }, this);
        }
    });
})();
