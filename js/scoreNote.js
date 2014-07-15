(function() {
    'use strict';
    var _noteMapping = {
        r: 'c/5',
        l: 'a/4'
    };
    var _graceNoteMapping = {
        r: 'a/4',
        l: 'c/5'
    };
    Polymer('smw-score-note', {
        _vexNote: null,
        get vexNote() {
            if(this._vexNote) {
                return this._vexNote;
            }
            var noteSpec = {
                keys: [ _noteMapping[this.data.hand] ],
                duration: this.data.value.toString(),
            };
            var hasDots = 'dots' in this.data;
            if(hasDots) {
                noteSpec.dots = this.data.dots;
            }
            this._vexNote = new Vex.Flow.StaveNote(noteSpec);
            if(hasDots) {
                for(var i = 0; i < this.data.dots; i++) {
                    this._vexNote.addDot(0);
                }
            }
            if('flam' in this.data && this.data.flam === true) {
                var flam = new Vex.Flow.GraceNote({
                    keys: [ _graceNoteMapping[this.data.hand] ],
                    duration: '8',
                    slash: true
                });
                this._vexNote.addModifier(0, new Vex.Flow.GraceNoteGroup([ flam ]));
            }
            if('drag' in this.data && this.data.drag === true) {
                var drag = [
                    new Vex.Flow.GraceNote({
                        keys: [ _graceNoteMapping[this.data.hand] ],
                        duration: '16'
                    }),
                    new Vex.Flow.GraceNote({
                        keys: [ _graceNoteMapping[this.data.hand] ],
                        duration: '16'
                    })
                ];
                this._vexNote.addModifier(0, new Vex.Flow.GraceNoteGroup(drag).beamNotes());
            }
            if('ruff' in this.data && this.data.ruff === true) {
                var ruff = [
                    new Vex.Flow.GraceNote({
                        keys: [ _noteMapping[this.data.hand] ],
                        duration: '32'
                    }),
                    new Vex.Flow.GraceNote({
                        keys: [ _graceNoteMapping[this.data.hand] ],
                        duration: '32'
                    }),
                    new Vex.Flow.GraceNote({
                        keys: [ _graceNoteMapping[this.data.hand] ],
                        duration: '32'
                    })
                ];
                this._vexNote.addModifier(0, new Vex.Flow.GraceNoteGroup(ruff).beamNotes());
            }
            if('accent' in this.data && this.data.accent === true) {
                this._vexNote.addArticulation(0, new Vex.Flow.Articulation('a>').setPosition(Vex.Flow.Modifier.Position.ABOVE));
            }
            if('rollHashes' in this.data && this.data.rollHashes > 0) {
                this._vexNote.addArticulation(0, new Vex.Flow.Tremolo(this.data.rollHashes));
            }
            return this._vexNote;
        }
    });
})();
