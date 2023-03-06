let deltaTime = 0.0;
let then = 0;
let cubeRotation = 0.0;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    gl.clearColor(135, 0.7, 0.5, 2);
    cube = new Cube(gl, 500);
    render();
}

function render(now) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    now *= 0.001; //to seconds
    deltaTime = now - then;
    then = now;

    cube.render();
    cubeRotation += deltaTime;
    requestAnimationFrame(render);
}
window.onload = init;