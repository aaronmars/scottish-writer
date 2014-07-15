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
            var rollStartNote = null;
            this.notes.forEach(function(note, noteIndex) {
                var data = note.data;
                var vex = note.vexNote;
                //var tie = null;

                // Here, we want to draw things that can span multiple bars like
                //  Ties, hairpins, brackets, etc...
                if('rollEnd' in data && data.rollEnd === true) {
                    (new Vex.Flow.StaveTie({
                        first_note: rollStartNote,
                        last_note: vex,
                        first_indices: [ 0 ],
                        last_indices: [ 0 ]
                    })).setContext(this.context).draw();
                }
                if('rollStart' in data && data.rollStart === true) {
                    rollStartNote = note.vexNote;
                    if(noteIndex === this.notes.length - 1) {
                        (new Vex.Flow.StaveTie({
                            first_note: rollStartNote,
                            last_note: null,
                            first_indices: [ 0 ],
                            last_indices: [ 0 ]
                        })).setContext(this.context).draw();
                    }
                }
            }, this);
        }
    });
})();
