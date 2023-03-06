//---------------------------------------------------------------------------
//
//  --- Cube.js ---
//
//    A simple, encapsulated Cube object
//    Used a lot of code from 
//    https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL
//    (wasn't able to understand assignment without it)

const DefaultNumSides = 8;



function Cube( gl, numSides, vertexShaderId, fragmentShaderId ) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    const vertShdr = vertexShaderId || "Cube-vertex-shader";
    const fragShdr = fragmentShaderId || "Cube-fragment-shader";

    // Initialize the object's shader program from the provided vertex
    //   and fragment shaders.  We make the shader program private to
    //   the object for simplicity's sake.
    // 
    const shaderProgram = initShaders( gl, vertShdr, fragShdr );

    if ( shaderProgram < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }

    // Determine the number of vertices around the base of the Cube
    //
    const n = numSides || DefaultNumSides; // Number of sides 

    // We'll generate the Cube's geometry (vertex positions).  The Cube's
    //   base will be a one-unit radius circle in the XY plane, centered 
    //   at the origin.  The Cube's apex will be located one unit up the
    //   +Z access.  We'll build our positions using that specification,
    //   and some trigonometry.
    //
    // Initialize temporary arrays for the Cube's indices and vertex positions,
    //   storing the position and index for the base's center
    //
    
    positions = [ 0.0, 0.0, 0.0 ];
    indices = [ 0 ];

    // Generate the locations of the vertices for the base of the Cube.  
    //    Recall the base is in the XY plane (which means the z-coordinate
    //    is zero), and we use sines and cosines to find the rest of 
    //    the coordinates.
    //
    // Here we dynamically build up both the vertex locations (by pushing
    //   computed coordinates onto the end of the "positions" array), as well
    //   as the indices for the vertices.
    //
    /*
    for ( let i = 0; i < n; ++i ) {
        const dTheta = 2.0 * Math.PI / n;
        let theta = i * dTheta;
        positions.push( Math.cos(theta), Math.sin(theta), 0.0 );

        indices.push( i + 1 );
    }
    */
   /* Each vertex belongs to three different faces, therefore if we build an array of (8*3) = 24 vertices,
      we can communicate facedness via indices.
   */
    positions = [
    // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0], // Left face: purple
      ];

    var colors = [];

    for (let j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
        //repeating each color four times for each vertex of the face
        colors = colors.concat(c, c, c, c);
    }

    for (let i = 1; i <= positions.length; i++) {
        indices.push(i);
    }
    const count = indices.length;

    //positions.push( 0.0, 0.0, 1.0 );
    //indices.push( n + 1 );

    // Next, we need to append the rest of the vertices for the perimeter of the disk.
    // However, the Cube's perimeter vertices need to be reversed since it's effectively a
    // reflection of the bottom disk.
    //
    //indices = indices.concat( indices.slice( 1, n+2 ).reverse() );

    // Create our vertex buffer and initialize it with our positions data
    //

    aPosition = new Attribute(gl, shaderProgram, positions,
        "aPosition", 3, gl.FLOAT );
    indices = new Indices(gl, indices);
        
    // Create a render function that can be called from our main application.
    //   In this case, we're using JavaScript's "closure" feature, which
    //   automatically captures variable values that are necessary for this
    //   routine so we can be less particular about variables scopes.  As 
    //   you can see, our "positions", and "indices" variables went out of
    //   scope when the Cube() constructor exited, but their values were
    //   automatically saved so that calls to render() succeed.
    // 
    this.render = function () {
        // Enable our shader program
        gl.useProgram( shaderProgram );

        // Activate our vertex, enabling the vertex attribute we want data
        //   to be read from, and tell WebGL how to decode that data.
        //
        aPosition.enable();

        // Likewise enable our index buffer so we can use it for rendering
        //
        indices.enable();

        // Since our list of indices contains equal-sized sets of
        //    indices values that we'll use to specify how many
        //    vertices to render, we divide the length of the 
        //    indices buffer by two, and use that as the "count"
        //    parameter for each of our draw calls.
        let count = indices.count / 2;

        // Draw the Cube's base.  Since our index buffer contains two
        //   "sets" of indices: one for the top, and one for the base,
        //   we divide the number of indices by two to render each
        //   part separately
        //
        gl.drawElements( gl.POINTS, count, indices.type, 0 );

        // Draw the Cube's top.  In this case, we need to let WebGL know
        //   where in the index list we want it to start reading index
        //   values.  The offset value is in bytes, computed using the
        //   "count" value we computed when making the list, and knowing
        //   the size in bytes of an unsigned short type.
        //
        var offset = count;
        gl.drawElements( gl.POINTS, count, indices.type, offset );

        // Finally, reset our rendering state so that other objects we
        //   render don't try to use the Cube's data
        //
        aPosition.disable();
        indices.disable();
    }
};
