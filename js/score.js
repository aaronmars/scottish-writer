(function(VF) {
    'use strict';
    var barsPerLine = 4;
    var width = 800;
    var canvas = $('#score-main')[0];
    var renderer = new VF.Renderer(canvas, VF.Renderer.Backends.CANVAS);

    var ctx = renderer.getContext();
    var stave = new VF.Stave(0, 0, 0);
    stave.setConfigForLines([
        { visible: false },
        { visible: false },
        { visible: true },
        { visible: false },
        { visible: false }
    ]).setContext(ctx).draw();
    function addBar() {
        var currentWidth = stave.getWidth();
        var barWidth = width / barsPerLine;
        stave.setWidth(currentWidth + barWidth).draw();
    }
})(Vex.Flow);
