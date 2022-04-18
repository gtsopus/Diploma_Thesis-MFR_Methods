#version 460
#extension GL_NV_gpu_shader5 : enable

out vec4 FragColor;

uniform layout(binding=0, rgba32f)	coherent image2DArray abufferTex;
uniform layout(binding=2, r32f)		coherent image2DArray abufferDepthTex;
uniform layout(binding=1, r32ui)	coherent uimage2D	  abufferCounterTex;

vec4 blendFinalColor(vec4 fragmentList[ABUFFER_SIZE], int fragNumber){}

void main(void) {
	vec4 fragmentList[ABUFFER_SIZE];

	ivec2 coords = ivec2(gl_FragCoord.xy);

	int fragNumber =int(imageLoad(abufferCounterTex, coords).r);

	if(fragNumber == 0){
		FragColor = vec4(1.0f);
		return;
	}

	//Load fragments into local memory
	for(int i=0; i<fragNumber; i++){
		fragmentList[i]= imageLoad(abufferTex, ivec3(coords, i));;
	}


	//Sort array using bubble sort (or any other technique)
	for (int i = (fragNumber - 2); i >= 0; --i) {
		for (int j = 0; j <= i; ++j) {
			if (fragmentList[j].w > fragmentList[j+1].w) {
				vec4 temp = fragmentList[j+1];
				fragmentList[j+1] = fragmentList[j];
				fragmentList[j] = temp;
			}				
		}
	}

	FragColor = blendFinalColor(fragmentList,fragNumber);
}