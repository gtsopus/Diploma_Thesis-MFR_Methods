#version 460

#extension GL_NV_gpu_shader5 : enable

out vec4 FragColor;

uniform layout(binding=0, rgba8) coherent image2DArray abufferTex;

vec4 blendFinalColor(vec4 fragmentList[KBUFFER_SIZE], int fragNumber){}

void main(void) {
	vec4 fragmentList[KBUFFER_SIZE];
	float fragmentAlpha = 0.4f;
	vec4 bgColor = vec4(1.0f);

	ivec2 coords = ivec2(gl_FragCoord.xy);

	int fragCounter = 0;

	for(int i=0; i<KBUFFER_SIZE; i++){
		fragmentList[i] = imageLoad(abufferTex, ivec3(coords, i));
		if(fragmentList[i].a != 256.0f){ //Count total number changed, if fragments < Buffer Size
			fragCounter++;
		}
	}

	FragColor = blendFinalColor(fragmentList,fragCounter);
		
}