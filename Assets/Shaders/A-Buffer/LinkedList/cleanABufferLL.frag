#version 460

layout(binding = 1, r32ui) uniform highp writeonly uimage2D list_heads;

void main(){
	//set all list heads to 0
	imageStore(list_heads, ivec2(gl_FragCoord.xy),uvec4(0u));
}
