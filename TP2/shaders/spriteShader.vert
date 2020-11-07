attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

void main() {
    vTextureCoord = aTextureCoord;

    // vec3 offset = vec3(0.0, 0.0, 0.0);

    // offset = aVertexNormal * sin(aVertexPosition.x);

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

}