#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D waterMap;
uniform sampler2D waterTex;

void main() {
		// Color movement
		vec4 color = texture2D(waterTex, vTextureCoord);
		vec4 filter = texture2D(waterMap, vTextureCoord);

		gl_FragColor =  vec4(color.r + filter.r * 0.1, color.g + filter.g * 0.1, color.b + filter.b * 0.1, 1.0);
}