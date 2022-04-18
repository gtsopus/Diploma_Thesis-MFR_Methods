#extension GL_NV_fragment_shader_interlock : enable
layout(pixel_interlock_unordered) in;


uniform layout(binding=0,	rgba8) coherent image2DArray kBufferTex;

uniform vec3 objColor;

in vec3 Normal;

vec4 computeColor(){}

void main(){

	ivec2 coords = ivec2(gl_FragCoord.xy);
	//Store fragment data values into 

	vec4 k[KBUFFER_SIZE];
	
	vec4 value = computeColor();
	value.a	   = gl_FragCoord.z;

	beginInvocationInterlockNV();

	for(int i=0; i<KBUFFER_SIZE; i++){
		k[i] = imageLoad(kBufferTex,ivec3(coords,i));
	}

	//Check if the fragment can be inserted into the buffer
	vec4 temp;
	for(int i=0; i<KBUFFER_SIZE; i++){
		if(value.a <= k[i].a)
		{
			temp    = value;
			value   = k[i];
			k[i] = temp;
		    imageStore(kBufferTex,ivec3(coords,i),temp);
		}
	}

	endInvocationInterlockNV();
}

