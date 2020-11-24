attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float actualN;
uniform float actualM;

uniform float sizeN;
uniform float sizeM;

void main() { 
    vTextureCoord = vec2((aTextureCoord.x + actualM) / sizeM, (aTextureCoord.y + actualN) / sizeN); 
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); 

} 
