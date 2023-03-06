/////////////////////////////////////////////////////////////////////////////
//
//  helpers.js
//
//  A collection of routines to help manage vertex attributes, uniforms,
//    and element buffers
//
"use strict";

//---------------------------------------------------------------------------
//
//  --- Attribute ---
//
//  Configure vertex attributes.
//
function Attribute(gl, program, values, variable, numComponents, type) {
    let location = gl.getAttribLocation(program, variable);

    if (location === null) {
        alert("Attribute: Variable '" + variable + "' not found");
        return;
    }

    let typedValues = undefined;
    switch(type) {
        case gl.BYTE:
            typedValues = new Int8Array(values);
            break;

        case gl.SHORT:
            typedValues = new Int16Array(values);
            break;

        case gl.UNSIGNED_BYTE:
            typedValues = new Uint8Array(values);
            break;

        case gl.UNSIGNED_SHORT:
            typedValues = new Uint16Array(values);
            break;

        case gl.FLOAT:
            typedValues = new Float32Array(values);
            break;
        
        default:
            alert("makeAttribute: Unknown value type: '" 
                + type.toString() + "'");
            return;
    }

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, typedValues, gl.STATIC_DRAW);

    this.count = values.length / numComponents;

    this.enable = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(location, numComponents, type, false, 0, 0);
        gl.enableVertexAttribArray(location);
    };

    this.disable = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.disableVertexAttribArray(location);
    }
};

//---------------------------------------------------------------------------
//
//  --- Uniform ---
//
//  Configure shader uniforms;
//

function Uniform(gl, program, variable, type) {
    let location = gl.getUniformLocation(program, variable);

    if (location === null) {
        alert("Uniform: Variable '" + variable + "' not found");
        return;
    }

    let info = gl.getActiveUniform(program, location);

    let uniformFunc = undefined;
    switch(info.type) {
        case gl.FLOAT:
            uniformFunc = value => gl.uniform1f(location, value);
            break;

        case gl.FLOAT_VEC2:
            uniformFunc = value => gl.uniform2fv(location, value);
            break;

        case gl.FLOAT_VEC3: 
            uniformFunc = value => gl.uniform3fv(location, value);
            break;

        case gl.FLOAT_VEC4: 
            uniformFunc = value => gl.uniform4fv(location, value);
            break;

        case gl.FLOAT_MAT2: 
            uniformFunc = value => 
                gl.uniformMatrix2fv(location, false, flatten(value));
            break;

        case gl.FLOAT_MAT3: 
            uniformFunc = value =>
                gl.uniformMatrix3fv(location, false, flatten(value));
            break;

        case gl.FLOAT_MAT4: 
            uniformFunc = value =>
                gl.uniformMatrix4fv(location, false, flatten(value));
            break;
    }; 

    this.update = value => uniformFunc(value);
}

//---------------------------------------------------------------------------
//
//  --- Elements ---
//
//  Configure element buffers.
//
function Indices(gl, indices) {

    let typedArray = undefined;
    let type = undefined;

    let max = indices.reduce((x, m) => { return x > m ? x : m; });
    if (max < 256) {
        typedArray = new Uint8Array(indices);
        type = gl.UNSIGNED_BYTE;
    }
    else if (max < 65536) {
        typedArray = new Uint16Array(indices);
        type = gl.UNSIGNED_SHORT;
    }
    else {
        typedArray = new Uint32Array(indices);
        type = gl.UNSIGNED_INT;
    }

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);

    this.count = indices.length;
    this.type = type;
    this.enable = () => gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    this.disable = () => gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}
