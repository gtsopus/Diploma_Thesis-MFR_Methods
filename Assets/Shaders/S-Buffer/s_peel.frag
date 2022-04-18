struct NodeTypeDataSB
{
    highp uint   color;
	highp float	 depth;
};

uniform vec3 objColor;
in vec3 Normal;
out vec4 test;

layout(binding = 1, r32ui)  uniform uimage2D				image_head;
layout(binding = 2, std430) buffer  SBUFFER					{NodeTypeDataSB nodes []; };
layout(binding = 5, std430)	coherent  buffer  CPR_MAP		{uint head_cpr_s[];};

int hashFunction(ivec2 coords){
	return (coords.x + WIDTH * coords.y)%COUNTERS;
}

vec4 computeColor(){}

uint addPixelHeadAddress() 	{ 
	return imageAtomicAdd	(image_head, ivec2(gl_FragCoord.xy), 1U);
}

void main(void)
{	
	int COUNTERS_2d = COUNTERS >> 1;

	uint  page_id = addPixelHeadAddress();
	int   hash_id = hashFunction(ivec2(gl_FragCoord.xy));
	uint  sum     = head_cpr_s[hash_id] + page_id;
	
	#if inverse
		uint  index = hash_id < COUNTERS_2d ? sum : nodes.length() + 1U - sum;
	#else
		uint  index = sum;
	#endif

	nodes[index].color		= packUnorm4x8(computeColor());
	nodes[index].depth		= gl_FragCoord.z;
}
