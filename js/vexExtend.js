(function(Beam) {
    'use strict';
    Beam.generateFlatBeams = function(notes, options) {
        console.log(options);
        console.log(notes);
        return Beam.generateBeams(notes, options);
    };
})(Vex.Flow.Beam);
