/////////////////////////////////////////////////////////////////////////////
//
//  Cube.js
//

function Cube(gl, vertexShader, fragmentShader) {

    vertexShader ||= "Cube-vertex-shader";
    fragmentShader ||= "Cube-fragment-shader";

    let program = initShaders(gl, vertexShader, fragmentShader);

    // Set up our data:
    //   - positions contains our vertex positions
    //   - indices contains how to organize the vertices
    //       into primitives
    //
    let positions = [
        // Front face
            -0.5, -0.5, 0.5, 
            0.5, -0.5, 0.5, 
            0.5, 0.5, 0.5, 
            -0.5, 0.5, 0.5,
    
            // Back face
            -0.5, -0.5, -0.5, 
            -0.5, 0.5, -0.5, 
            0.5, 0.5, -0.5, 
            0.5, -0.5, -0.5,
    
            // Top face
            -0.5, 0.5, -0.5, 
            -0.5, 0.5, 0.5, 
            0.5, 0.5, 0.5, 
            0.5, 0.5, -0.5,
    
            // Bottom face
            -0.5, -0.5, -0.5, 
            0.5, -0.5, -0.5, 
            0.5, -0.5, 0.5, 
            -0.5, -0.5, 0.5,
    
            // Right face
            0.5, -0.5, -0.5, 
            0.5, 0.5, -0.5, 
            0.5, 0.5, 0.5, 
            0.5, -0.5, 0.5,
    
            // Left face
            -0.5, -0.5, -0.5, 
            -0.5, -0.5, 0.5, 
            -0.5, 0.5, 0.5, 
            -0.5, 0.5, -0.5,
        ];

    let indices = [
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23, // left
    ];

    // Initialize all of our WebGL "plumbing" variables
    //
    let aPosition = new Attribute(gl, program, positions,
	    "aPosition", 3, gl.FLOAT);

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