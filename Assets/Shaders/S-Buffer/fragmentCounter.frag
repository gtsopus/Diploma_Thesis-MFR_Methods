layout(binding = 0, r32ui) coherent uniform uimage2D    image_counter;
layout(binding = 4, offset = 0)	    uniform atomic_uint total_counter;

void incrementPixelFragmentCounter() {
     imageAtomicAdd(image_counter, ivec2(gl_FragCoord.xy), 1U);
}

void main(void)
{
	//Increase total fragments and pixel fragment count
	atomicCounterIncrement(total_counter);
	incrementPixelFragmentCounter();
}
