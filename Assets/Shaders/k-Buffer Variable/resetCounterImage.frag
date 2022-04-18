layout(binding = 0, r32ui) coherent uniform uimage2D image_counter;
layout(binding = 3, std430)	coherent  buffer  ADDRESS_MAP {uint head_s[];};

void main(){
	imageStore(image_counter,ivec2(gl_FragCoord.xy),uvec4(0U));

	//Reset group counters ADDRESS_MAP
	for(int i=0;i<COUNTERS;i++){
		head_s[i] = 0U;
	}


}