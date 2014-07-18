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
            if(this.firstInStaff && staffIndex === 0) {
                var timeSig = this.settings.timeSignature.beats + '/' + this.settings.timeSignature.value;
                stave.addTimeSignature(timeSig);
            }
            var tsSpec = {
                num_beats: this.settings.timeSignature.beats,
                beat_value: this.settings.timeSignature.value,
                resolution: Vex.Flow.RESOLUTION
            };
            var vexNotes = [];
            var dymanics = [];
            this.notes.forEach(function(note) {
                vexNotes.push(note.vexNote);
                dymanics.push(note.dynamic);
            }, this);
            var notesVoice = new Vex.Flow.Voice(tsSpec).addTickables(vexNotes);
            var dymanicVoice = new Vex.Flow.Voice(tsSpec).addTickables(dymanics);
            (new Vex.Flow.Formatter())
                .joinVoices([ notesVoice, dymanicVoice ])
                .formatToStave([ notesVoice, dymanicVoice ], stave);
            var beams = Vex.Flow.Beam.generateBeams(vexNotes, {
                stem_direction: -1,
                groups: [ new Vex.Flow.Fraction(3, 8) ]
            });
            /*this.notes.forEach(function(note) {
                if('chips' in note.data) {
                    var voltaType = null;
                    switch(note.data.chips) {
                        case 'single':
                            voltaType = Vex.Flow.Volta.type.BEGIN_END;
                            break;
                        case 'on':
                            voltaType = Vex.Flow.Volta.type.BEGIN;
                            break;
                        case 'off':
                            voltaType = Vex.Flow.Volta.type.END;
                            break;
                        default:
                            voltaType = Vex.Flow.Volta.type.MID;
                            break;
                    }
                    var volta = new Vex.Flow.Volta(voltaType, '', 30, 30);
                    stave.modifiers.push(volta);
                }
            }, this);*/
            stave.setNumLines(_staffConfig.length).setConfigForLines(_staffConfig).setContext(this.context).draw();
            notesVoice.draw(this.context, stave);
            dymanicVoice.draw(this.context, stave);
            beams.forEach(function(beam) {
                beam.setContext(this.context).draw();
            }, this);
        }
    });
})();
