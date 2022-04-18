layout(binding = 0, r32ui) coherent uniform uimage2D    image_counter;


void incrementPixelFragmentCounter() {
     imageAtomicAdd(image_counter, ivec2(gl_FragCoord.xy), 1U);
}

void main()
{
	//Increase pixel fragment count
	incrementPixelFragmentCounter();
}
