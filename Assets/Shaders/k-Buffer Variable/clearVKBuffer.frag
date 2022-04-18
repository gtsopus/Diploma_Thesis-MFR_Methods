layout(binding = 7, r32ui)  uniform uimage2D total_k_stored;

void main(void)
{
	imageStore(total_k_stored,ivec2(gl_FragCoord.xy),uvec4(0U));
}