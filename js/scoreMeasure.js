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
    var _tsFractions = null;
    Polymer('smw-score-measure', {
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
            if(!_tsFractions) {
                _tsFractions = {
                    '2/4': new Vex.Flow.Fraction(2, 8),
                    '6/8': new Vex.Flow.Fraction(3, 8)
                };
            }
            this._notes = [];
            this.scoreIndex = _measureIndex;
            _measureIndex++;
        },
        ready: function() {
            var index = this.scoreIndex % this.settings.measuresPerStaff;
            var staffIndex = Math.floor(this.scoreIndex / this.settings.measuresPerStaff);
            if(index === 0) {
                this.firstInStaff = true;
            } else if(index === this.settings.measuresPerStaff - 1) {
                this.lastInStaff = true;
            }
            if(this.settings.instrument === 'snare') {
                _staffConfig[2].visible = true;
            }

            // Adjust the left offset in case of a thick beginning bar line
            var left = this.width * index;
            if(this.firstInStaff) {
                left += 2;
            }
            var stave = new Vex.Flow.Stave(
                left,
                this.settings.staffHeight * staffIndex,
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
            var timeSig = this.settings.timeSignature.beats + '/' + this.settings.timeSignature.value;
            if(this.firstInStaff && staffIndex === 0) {
                stave.addTimeSignature(timeSig);
            }
            var tsSpec = {
                num_beats: this.settings.timeSignature.beats,
                beat_value: this.settings.timeSignature.value,
                resolution: Vex.Flow.RESOLUTION
            };
            var notes = { vex: [], dynamics: [] };
            var tuplets = { notes: [], dynamics: [] };
            this.notes.forEach(function(note) {
                if('tuplet' in note.data && note.data.tuplet === true) {
                    tuplets.notes.push(note.vexNote);
                    tuplets.dynamics.push(note.dynamic);
                }
                notes.vex.push(note.vexNote);
                notes.dynamics.push(note.dynamic);
            }, this);
            var vexTuplets = null;
            if(tuplets.notes.length > 0) {
                vexTuplets = {
                    notes: new Vex.Flow.Tuplet(tuplets.notes),
                    dynamics: new Vex.Flow.Tuplet(tuplets.dynamics)
                };
            }
            var voices = {
                notes: new Vex.Flow.Voice(tsSpec).setStrict(true).addTickables(notes.vex),
                dynamics: new Vex.Flow.Voice(tsSpec).setStrict(true).addTickables(notes.dynamics)
            };
            var formatter = new Vex.Flow.Formatter();
            formatter.joinVoices([ voices.notes, voices.dynamics ])
                .formatToStave([ voices.notes, voices.dynamics ], stave);
            var beams = Vex.Flow.Beam.generateFlatBeams(notes.vex, {
                stem_direction: -1,
                groups: [ _tsFractions[timeSig] ]
            });

            // Draw the staff, notes, tuplets, and beams
            stave.setNumLines(_staffConfig.length)
                .setConfigForLines(_staffConfig)
                .setContext(this.context)
                .draw();
            voices.notes.draw(this.context, stave);
            voices.dynamics.draw(this.context, stave);
            if(vexTuplets) {
                vexTuplets.notes.setContext(this.context).draw();
            }
            beams.forEach(function(beam) {
                beam.setContext(this.context).draw();
            }, this);
        }
    });
})();
