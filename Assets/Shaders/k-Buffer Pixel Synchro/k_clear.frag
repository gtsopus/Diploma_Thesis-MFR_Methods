#extension GL_NV_gpu_shader5 : enable

uniform layout(binding=0,	rgba8) coherent image2DArray kBufferTex;

in vec2 textureCoord;

void main() {
	ivec2 coords = ivec2(gl_FragCoord.xy);
	
	//reset the depths (use depth texture instead of 1 global texture?)
	for(int i=0; i<KBUFFER_SIZE; i++){
		//set depth to infinite (high value, 256)
		imageStore(kBufferTex,ivec3(coords,i),vec4(1.0f,1.0f,1.0f,256.0f));
	}

}

