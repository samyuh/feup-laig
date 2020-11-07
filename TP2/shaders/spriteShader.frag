#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D texture;

uniform float sizeN;
uniform float sizeM;

void main() {
  vec4 color = texture2D(texture, vTextureCoord);

  gl_FragColor =  color;
}