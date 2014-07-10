/* jshint camelcase: false */
(function() {
    'use strict';
    var _leftOffset = 0;
    var _topOffset = 10;
    var _measureWidth = 0;
    var _staffHeight = 100;
    var _noteMapping = {
        r: 'c/5',
        l: 'a/4'
    };
    var _graceNoteMapping = {
        r: 'a/4',
        l: 'c/5'
    };
    Polymer('smw-score-canvas', {
        width: 850,
        height: 1100,
        measuresPerStaff: 4,
        linesConfig: [ false, false, true, false, false ],
        staffConfig: [],
        vexContext: null,
        dataChanged: function() {
            this.drawScore();
        },
        musicChanged: function(signal) {
            var info = signal.detail;
            switch(info.command) {
                case 'add-bar':
                    this.addMeasure();
                    break;
            }
        },
        created: function() {
            this.data = {};
        },
        ready: function() {
            this.vexContext = new Vex.Flow.Renderer(this.$.vexflowCanvas, Vex.Flow.Renderer.Backends.CANVAS).getContext();
            this.linesConfig.forEach(function(line) {
                this.staffConfig.push({ visible: line });
            }, this);
            _measureWidth = (this.width / this.measuresPerStaff) - 1;
        },
        addMeasure: function() {
            if(!('staves' in this.data)) {
                this.data.staves = [ { measures: [] } ];
            }
            var staffIndex = this.data.staves.length - 1;
            if(this.data.staves[staffIndex].measures.length === this.measuresPerStaff) {
                this.data.staves.push({ measures: [] });
                staffIndex++;
            }
            this.data.staves[staffIndex].measures.push({});
            this.drawScore();
        },
        drawScore: function() {
            var score = this.data;
            this.vexContext.clear();
            if(!('staves' in score)) {
                return;
            }
            var staffIndex = 0;
            score.staves.forEach(function(staff, staffIndex) {
                this.drawStaff(staff, staffIndex);
            }, this);
        },
        drawStaff: function(staff, index) {
            if(!('measures' in staff)) {
                return;
            }
            var topOffset = _topOffset + (index * _staffHeight);
            this.rollStartNote = null;
            staff.measures.forEach(function(measure, measureIndex, measureArray) {
                var isLast = measureIndex === measureArray.length - 1;
                var drawTimeSig = (index === 0 && measureIndex === 0);
                this.drawMeasure(measure, topOffset, measureIndex, drawTimeSig, isLast);
            }, this);
        },
        drawMeasure: function(measure, top, index, ts, lastMeasure) {
            var leftOffset = _leftOffset + (index * _measureWidth);
            var stave = new Vex.Flow.Stave(leftOffset, top, _measureWidth);
            stave.setNumLines(this.staffConfig.length).setConfigForLines(this.staffConfig);
            if(index > 0) {
                stave.setBegBarType(Vex.Flow.Barline.type.NONE);
            }
            if(ts) {
                var timeSig = this.data.timeSignature.beats + '/' + this.data.timeSignature.value;
                stave.addTimeSignature(timeSig, 100);
            }
            stave.setContext(this.vexContext).draw();
            if('notes' in measure) {
                this.drawNotes(measure.notes, stave, lastMeasure);
            }
        },
        drawNotes: function(notes, stave, lastMeasure) {
            var vexNotes = [];
            var ties = [];
            notes.forEach(function(note, index, noteArray) {
                var noteSpec = {
                    keys: [ _noteMapping[note.hand] ],
                    duration: note.value.toString(),
                };
                if('dots' in note) {
                    noteSpec.dots = note.dots;
                }
                var vexNote = new Vex.Flow.StaveNote(noteSpec);
                if('dots' in note) {
                    for(var i = 0; i < note.dots; i++) {
                        vexNote.addDot(0);
                    }
                }
                if('flam' in note && note.flam === true) {
                    var flam = new Vex.Flow.GraceNote({
                        keys: [ _graceNoteMapping[note.hand] ],
                        duration: '8',
                        slash: true
                    });
                    vexNote.addModifier(0, new Vex.Flow.GraceNoteGroup([ flam ]));
                }
                if('drag' in note && note.drag === true) {
                    var drag = [
                        new Vex.Flow.GraceNote({
                            keys: [ _graceNoteMapping[note.hand] ],
                            duration: '16'
                        }),
                        new Vex.Flow.GraceNote({
                            keys: [ _graceNoteMapping[note.hand] ],
                            duration: '16'
                        })
                    ];
                    vexNote.addModifier(0, new Vex.Flow.GraceNoteGroup(drag).beamNotes());
                }
                if('accent' in note && note.accent === true) {
                    vexNote.addArticulation(0, new Vex.Flow.Articulation('a>').setPosition(Vex.Flow.Modifier.Position.ABOVE));
                }
                if('rollHashes' in note && note.rollHashes > 0) {
                    vexNote.addArticulation(0, new Vex.Flow.Tremolo(note.rollHashes));
                }
                if('rollStart' in note && note.rollStart === true) {
                    this.rollStartNote = vexNote;
                }
                if('rollEnd' in note && note.rollEnd === true) {
                    ties.push(new Vex.Flow.StaveTie({
                        first_note: this.rollStartNote,
                        last_note: vexNote,
                        first_indices: [ 0 ],
                        last_indices: [ 0 ]
                    }));
                }
                var lastNote = index === noteArray.length - 1;
                if(lastMeasure && lastNote && (this.rollStartNote !== null)) {
                    ties.push(new Vex.Flow.StaveTie({
                        first_note: this.rollStartNote,
                        last_note: null,
                        first_indices: [ 0 ],
                        last_indices: [ 0 ]
                    }));
                }
                vexNotes.push(vexNote);
            }, this);
            var beams = Vex.Flow.Beam.generateBeams(vexNotes, {
                stem_direction: -1,
                groups: [ new Vex.Flow.Fraction(3, 8) ]
            });
            Vex.Flow.Formatter.FormatAndDraw(this.vexContext, stave, vexNotes, 0);
            beams.forEach(function(beam) {
                beam.setContext(this.vexContext).draw();
            }, this);
            ties.forEach(function(tie) {
                tie.setContext(this.vexContext).draw();
            }, this);
        }
    });
})();
