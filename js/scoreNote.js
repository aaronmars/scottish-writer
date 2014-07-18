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
    var _dynamicFont = {
        family: 'times',
        size: 14,
        weight: 'bold italic'
    };
    Polymer('smw-score-note', {
        created: function() {
            this._noteVoices = {};
        },
        _calculateNote: function() {
            var thisDuration = this.data.value.toString();
            var noteSpec = { keys: [ _noteMapping[this.data.hand] ], duration: thisDuration };
            var dynamicSpec = { duration: thisDuration, font: { family: 'Arial', size: 8, weight: '' } };
            var hasDots = 'dots' in this.data;
            if(hasDots) {
                noteSpec.dots = this.data.dots;
                dynamicSpec.dots = this.data.dots;
            }
            var vexNote = new Vex.Flow.StaveNote(noteSpec);
            if(hasDots) {
                for(var i = 0; i < this.data.dots; i++) {
                    vexNote.addDot(0);
                }
            }
            if('flam' in this.data && this.data.flam === true) {
                var flam = new Vex.Flow.GraceNote({ keys: [ _graceNoteMapping[this.data.hand] ], duration: '8', slash: true });
                vexNote.addModifier(0, new Vex.Flow.GraceNoteGroup([ flam ]));
            }
            if('drag' in this.data && this.data.drag === true) {
                var drag = [
                    new Vex.Flow.GraceNote({ keys: [ _graceNoteMapping[this.data.hand] ], duration: '16' }),
                    new Vex.Flow.GraceNote({ keys: [ _graceNoteMapping[this.data.hand] ], duration: '16' })
                ];
                vexNote.addModifier(0, new Vex.Flow.GraceNoteGroup(drag).beamNotes());
            }
            if('ruff' in this.data && this.data.ruff === true) {
                var ruff = [
                    new Vex.Flow.GraceNote({ keys: [ _noteMapping[this.data.hand] ], duration: '32' }),
                    new Vex.Flow.GraceNote({ keys: [ _graceNoteMapping[this.data.hand] ], duration: '32' }),
                    new Vex.Flow.GraceNote({ keys: [ _graceNoteMapping[this.data.hand] ], duration: '32' })
                ];
                vexNote.addModifier(0, new Vex.Flow.GraceNoteGroup(ruff).beamNotes());
            }
            if('accent' in this.data && this.data.accent === true) {
                vexNote.addArticulation(0, new Vex.Flow.Articulation('a>').setPosition(Vex.Flow.Modifier.Position.ABOVE));
            }
            if('rollHashes' in this.data && this.data.rollHashes > 0) {
                vexNote.addArticulation(0, new Vex.Flow.Tremolo(this.data.rollHashes));
            }
            if('dynamic' in this.data) {
                dynamicSpec.text = this.data.dynamic;
                dynamicSpec.font = _dynamicFont;
                this.dynamic = new Vex.Flow.TextNote(dynamicSpec).setLine(11);
            } else {
                this.dynamic = new Vex.Flow.GhostNote(dynamicSpec);
            }
            vexNote.setContext(this.context);
            this.dynamic.setContext(this.context);
            return vexNote;
        },
        get vexNote() {
            if(!this._vexNote) {
                this._vexNote = this._calculateNote();
            }
            return this._vexNote;
        }
    });
})();
