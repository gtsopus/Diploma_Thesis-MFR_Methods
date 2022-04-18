//-----------------------------------------------------------------------------------------------
// Implementation of "Variable K-Buffer using Importance Maps" adapted from S-Buffer method 
// as described in VVPM by "A. A. Vasilakis et al., 
// Variable K-Buffer using Importance Maps", EG 2017 - Short Papers".
//-----------------------------------------------------------------------------------------------

#extension GL_NV_fragment_shader_interlock : enable

struct NodeTypeDataSB
{
    highp uint   color;
	highp float	 depth;
};

uniform vec3 objColor;
in vec3 Normal;

layout(binding = 0, r32ui ) readonly  uniform uimage2D		image_counter;
layout(binding = 1, r32ui)  uniform uimage2D				image_head;
layout(binding = 2, std430) buffer  SBUFFER					{NodeTypeDataSB nodes []; };
layout(binding = 5, std430)	coherent  buffer  CPR_MAP		{uint head_cpr_s[];};
layout(binding = 7, r32ui)  uniform uimage2D				total_stored_k;

int hashFunction(ivec2 coords){
	return (coords.x + WIDTH * coords.y)%COUNTERS;
}

vec4 computeColor(){}

void main(void)
{	
	uint  page_id = imageLoad(image_head, ivec2(gl_FragCoord.xy)).x;
	int   hash_id = hashFunction(ivec2(gl_FragCoord.xy));
	uint  sum     = head_cpr_s[hash_id] + page_id;
	int   pixelK    = int(imageLoad(image_counter, ivec2(gl_FragCoord.xy)).x);

	uint  index = sum;

	if(pixelK > MAX_LOCAL_ARRAY_NUMBER){
		pixelK = MAX_LOCAL_ARRAY_NUMBER;
	}
	
	float fragmentsD[MAX_LOCAL_ARRAY_NUMBER];
	uint  fragmentsC[MAX_LOCAL_ARRAY_NUMBER];


	beginInvocationInterlockNV();

	uint  storedK = imageLoad(total_stored_k, ivec2(gl_FragCoord.xy)).x;
	
	//If local array max capacity is reached
	if(storedK == pixelK){
		for(int i=0;i<pixelK;i++){
			fragmentsD[i] = nodes[index+i].depth;
			fragmentsC[i] = nodes[index+i].color;
		}

		uint value = packUnorm4x8(computeColor());
		float depth = gl_FragCoord.z;

		uint tempC;
		float tempD;

		for(int i=0;i<pixelK;i++){
			if(depth <= fragmentsD[i] || fragmentsD[i] == 0.123f){
				tempC = value;
				tempD = depth;

				value = fragmentsC[i];
				depth = fragmentsD[i];

				fragmentsD[i] = tempD;
				fragmentsC[i] = tempC;
			}		
		}

		for(int i=0;i<pixelK;i++){
			nodes[index+i].color = fragmentsC[i];
			nodes[index+i].depth = fragmentsD[i];
		}
	}
	else{
		nodes[index+storedK].color = packUnorm4x8(computeColor());
		nodes[index+storedK].depth = gl_FragCoord.z;
		imageAtomicAdd(total_stored_k,ivec2(gl_FragCoord.xy),1U);
		
		//Last one to add
		if(storedK == pixelK-1){
			uint tempC;
			float tempD;
			
			for(int i=0;i<pixelK;i++){
				fragmentsD[i] = nodes[index+i].depth;
				fragmentsC[i] = nodes[index+i].color;
			}

			//bubble sort before insertion sort starts
			for (int i = (pixelK - 2); i >= 0; --i) {
				for (int j = 0; j <= i; ++j) {
					if (fragmentsD[j] > fragmentsD[j+1]) {
						tempC = fragmentsC[j+1];
						tempD = fragmentsD[j+1];

						fragmentsC[j+1] = fragmentsC[j];
						fragmentsD[j+1] = fragmentsD[j];

						fragmentsC[j] = tempC;
						fragmentsD[j] = tempD;
					}				
				}
			}
			for(int i=0;i<pixelK;i++){
				nodes[index+i].color = fragmentsC[i];
				nodes[index+i].depth = fragmentsD[i];
			}
		}
	}


	endInvocationInterlockNV();

}
