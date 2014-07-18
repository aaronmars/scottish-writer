(function() {
    'use strict';
    var _staffIndex = 0;
    Polymer('smw-score-staff', {
        index: 0,
        get notes() {
            if(this._notes.length === 0) {
                if(this._measures.length === 0) {
                    this._measures = this.shadowRoot.querySelectorAll('smw-score-measure').array();
                }
                this._measures.forEach(function(measure) {
                    this._notes = this._notes.concat(measure.notes);
                }, this);
            }
            return this._notes;
        },
        created: function() {
            this._measures = [];
            this._notes = [];
            this._rollStartNote = null;
            this.index = _staffIndex;
            _staffIndex++;
        },
        ready: function() {
            var tieStartNote = null;
            var crescStartNote = null;
            var decrescStartNote = null;
            this.notes.forEach(function(note, noteIndex) {
                var data = note.data;
                var vex = note.vexNote;
                var isLastNote = (noteIndex === this.notes.length - 1);

                // Here, we want to draw things that can span multiple bars:
                //  * Ties
                if('tieEnd' in data && data.tieEnd === true) {
                    (new Vex.Flow.StaveTie({
                        first_note: tieStartNote,
                        last_note: vex,
                        first_indices: [ 0 ],
                        last_indices: [ 0 ]
                    })).setContext(this.context).draw();
                }
                if('tieStart' in data && data.tieStart === true) {
                    tieStartNote = vex;
                    if(isLastNote) {
                        (new Vex.Flow.StaveTie({
                            first_note: tieStartNote,
                            last_note: null,
                            first_indices: [ 0 ],
                            last_indices: [ 0 ]
                        })).setContext(this.context).draw();
                    }
                }

                // * Hairpins
                var hairpinRender = {
                    height: 10,
                    y_shift: 0,
                    left_shift_px: 0,
                    right_shift_px: vex.getBoundingBox().w
                };
                var hairpin = { draw: false, type: null, first: null, last: null };
                if('crescendo' in data) {
                    hairpin.type = Vex.Flow.StaveHairpin.type.CRESC;
                    hairpin.first = crescStartNote;
                    if(data.crescendo === 'off') {
                        hairpin.draw = true;
                        hairpin.last = vex;
                    }
                    if(data.crescendo === 'on') {
                        crescStartNote = vex;
                        if(isLastNote) {
                            hairpin.draw = true;
                            hairpin.first = vex;
                        }
                    }
                }
                if('decrescendo' in data) {
                    hairpin.type = Vex.Flow.StaveHairpin.type.DECRESC;
                    hairpin.first = decrescStartNote;
                    if(data.decrescendo === 'off') {
                        hairpin.draw = true;
                        hairpin.last = vex;
                    }
                    if(data.decrescendo === 'on') {
                        decrescStartNote = vex;
                        if(isLastNote) {
                            hairpin.draw = true;
                            hairpin.first = vex;
                        }
                    }
                }
                if(hairpin.draw) {
                    hairpin.last = hairpin.last || hairpin.first;
                    var hp = new Vex.Flow.StaveHairpin({ first_note: hairpin.first, last_note: hairpin.last }, hairpin.type);
                    hp.setContext(this.context);
                    if(isLastNote) {
                        hp.setRenderOptions(hairpinRender);
                    }
                    hp.draw();
                }
            }, this);
        }
    });
})();
