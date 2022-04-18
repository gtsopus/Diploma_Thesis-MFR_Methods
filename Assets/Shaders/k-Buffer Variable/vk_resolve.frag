precision highp float;

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


vec4 blendFinalColor(vec4 fragmentList[MAX_LOCAL_ARRAY_NUMBER], int fragNumber){}

int hashFunction(ivec2 coords){
	return (coords.x + WIDTH * coords.y)%COUNTERS;
}

void main(void)
{	
	int COUNTERS_2d = COUNTERS >> 1;

	uint  page_id = imageLoad(image_head, ivec2(gl_FragCoord.xy)).x;
	int   hash_id = hashFunction(ivec2(gl_FragCoord.xy));
	uint  sum     = head_cpr_s[hash_id] + page_id;
	int	  pixelK    = int(imageLoad(image_counter, ivec2(gl_FragCoord.xy)).x);

	if(pixelK <= 0){
		FragColor = vec4(1.0f);
		return;
	}

	uint  index = sum;

	vec4 fragments[MAX_LOCAL_ARRAY_NUMBER];

	if(pixelK > MAX_LOCAL_ARRAY_NUMBER){
		pixelK = MAX_LOCAL_ARRAY_NUMBER;
	}

	for(int i=0;i<pixelK;i++){
		fragments[i] = unpackUnorm4x8(nodes[index+i].color);
		fragments[i].a = nodes[index+i].depth;
	}


	FragColor = blendFinalColor(fragments,pixelK);
}