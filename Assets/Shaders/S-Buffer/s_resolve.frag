struct NodeTypeDataSB
{
    highp uint   color;
	highp float	 depth;
};

out vec4 FragColor;

layout(binding = 0, r32ui ) readonly  uniform uimage2D		image_counter;
layout(binding = 1, r32ui ) uniform	  uimage2D				image_head;
layout(binding = 2, std430) coherent  buffer  SBUFFER		{ NodeTypeDataSB nodes []; };
layout(binding = 5, std430)	coherent  buffer  CPR_MAP		{uint head_cpr_s[];};

vec4 blendFinalColor(vec4 fragmentList[8], int fragNumber){}

int hashFunction(ivec2 coords){
	return (coords.x + WIDTH * coords.y)%COUNTERS;
}

void main(void){

	int COUNTERS_2d = COUNTERS >> 1;

	int counter = int(imageLoad (image_counter	, ivec2(gl_FragCoord.xy)).x);
	if(counter == 0){
		FragColor = vec4(1.0f);
		return;
	}
	uint address = imageLoad (image_head	, ivec2(gl_FragCoord.xy)).x-1U;
	int  hash_id = hashFunction(ivec2(gl_FragCoord.xy));

#if inverse	
	bool front_prefix = hash_id < COUNTERS_2d ? true : false;
#else
	bool front_prefix = true;
#endif

	uint sum = head_cpr_s[hash_id];

	uint init_page_id = front_prefix ? address + sum : nodes.length() + 1U - address - sum;
	uint direction    = front_prefix ? -1U : 1U;	

	uint page_id	  = init_page_id;

	if(counter>8){
		counter = 8;
	}

	vec4 fragmentList[8];
	for(uint i=0; i<counter; i++)
	{
		fragmentList[i] = vec4(vec3(unpackUnorm4x8(nodes[page_id].color)),nodes[page_id].depth);
		page_id += direction;
	}

	for (int i = (counter - 2); i >= 0; --i) {
		for (int j = 0; j <= i; ++j) {
			if (fragmentList[j].w > fragmentList[j+1].w) {
				vec4 temp = fragmentList[j+1];
				fragmentList[j+1] = fragmentList[j];
				fragmentList[j] = temp;
			}				
		}
	}

	FragColor = blendFinalColor(fragmentList,counter);

}