#version 460
#extension GL_NV_gpu_shader5 : enable

precision highp float;

in vec3 Normal;

//A-Buffer textures
uniform layout(binding=0,	rgba32f) coherent image2DArray abufferTex;
uniform layout(binding=2,	r32f)  coherent image2DArray abufferDepthTex;
uniform layout(binding = 1, r32ui) coherent uimage2D abufferCounterTex;
uniform vec3 objColor;

out vec4 test;

vec4 computeColor(){}

void main(void) {
	
	ivec2 coords=ivec2(gl_FragCoord.xy);
	
	//Calculate next fragment position
	int fragNum= int(imageAtomicAdd(abufferCounterTex, coords, 1U));

	vec4 abuffval = computeColor();
	abuffval.a	  = gl_FragCoord.z;
	//Store the fragment data into the A-Buffer
	imageStore(abufferTex, ivec3(coords, fragNum), abuffval);
	imageStore(abufferDepthTex, ivec3(coords, fragNum), vec4(gl_FragCoord.z, 0.0f, 0.0f, 0.0f));

}