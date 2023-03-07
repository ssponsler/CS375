/////////////////////////////////////////////////////////////////////////////
//
//  Square.js
//

function Square(gl, vertexShader, fragmentShader) {

    vertexShader ||= "Square-vertex-shader";
    fragmentShader ||= "Square-fragment-shader";

    let program = initShaders(gl, vertexShader, fragmentShader);

    // Set up our data:
    //   - positions contains our vertex positions
    //   - indices contains how to organize the vertices
    //       into primitives
    //
    let positions = [
        0.0, 0.0,  // Vertex 0
        1.0, 0.0,  // Vertex 1
        0.0, 1.0,  // Vertex 2
        1.0, 1.0   // Vertex 3
    ];

    let indices = [
        0, 1, 2,
        1, 2, 3
    ];

    // Initialize all of our WebGL "plumbing" variables
    //
    let aPosition = new Attribute(gl, program, positions,
	    "aPosition", 2, gl.FLOAT);

    indices = new Indices(gl, indices);

    let MV = new Uniform(gl, program, "MV");
    let P  = new Uniform(gl, program, "P");

    this.render = () => {
        gl.useProgram(program);

        aPosition.enable();
        indices.enable();

        MV.update(this.MV);
        P.update(this.P);

        gl.drawElements(gl.TRIANGLES, indices.count, indices.type, 0);

        indices.disable();
        aPosition.disable();
    
    };
};