#version 460

#extension GL_NV_gpu_shader5 : enable

out vec4 FragColor;

//A-Buffer Textures
uniform layout(binding=1, r32ui)	coherent uimage2D abufferCounterTex;

in vec2 textureCoord;

void main() {
	ivec2 coords = ivec2(gl_FragCoord.xy);
	
	//reset the counter
	imageStore(abufferCounterTex, coords, uvec4(0.0f));	
}

