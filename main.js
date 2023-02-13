function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    gl.clearColor(245, 0.5, 0.5, 2);
    cone = new Cone(gl, 500);
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    cone.render();
}
window.onload = init;