layout(binding = 3, std430)	coherent  buffer  ADDRESS_MAP {uint head_s[];};
layout(binding = 5, std430)	coherent  buffer  CPR_MAP	  {uint head_cpr_s[];};

void main(){

	//Ensure that sum is calculated only 1 time
	if((uint(gl_FragCoord.y) == 0U) && (gl_FragCoord.x < COUNTERS)){
		int id = int(gl_FragCoord.x);
		int COUNTERS_2d = COUNTERS >> 1;

#if inverse
		int  k = (id < COUNTERS_2d) ? 0 : COUNTERS_2d;
#else
		int  k = 0;
#endif
		uint sum = 0;
		for(int i = id; i > k; i--){
			sum += head_s[i-1];
		}
		//Calculate and save Cpr
		head_cpr_s[id] = sum;
	}
}