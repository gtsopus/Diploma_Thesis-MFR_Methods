#version 460

out vec4 FragColor;

struct LLNode
{
    highp uint   next;
    highp uint   color;
    highp float  depth;
};

layout(binding = 0, std430) buffer Mybuffer{ LLNode nodes[];};
uniform layout(binding=1, r32ui)	highp coherent uimage2D list_heads;

//Generic function that blends final color
vec4 blendFinalColor(vec4 fragmentList[8], int fragNumber){}

uint  getPixelFragHead() {return imageLoad (list_heads, ivec2(gl_FragCoord.xy)).r;}

void main(){
    uint index = getPixelFragHead();

    const int MAX_LOCAL_SIZE = 8;

    vec2 fragmentList[MAX_LOCAL_SIZE];


    if(index>0u){

        //store fragments to local memory
        int counter = 0;
        while(index != 0u){
            fragmentList[counter] = vec2(float(index), nodes[index].depth);
            index	           = nodes[index].next;
            counter++;
        }

        int fragNumber = min(counter,MAX_LOCAL_SIZE);

	//Sort array using bubble sort or any sorting algorithm
	for (int i = (fragNumber - 2); i >= 0; --i) {
		for (int j = 0; j <= i; ++j) {
			if (fragmentList[j].g > fragmentList[j+1].g) {
				vec2 temp = fragmentList[j+1];
				fragmentList[j+1] = fragmentList[j];
				fragmentList[j] = temp;
			}				
		}
	}
		
  
	vec4 frags[MAX_LOCAL_SIZE];
	for(int i=0; i<fragNumber; i++){
		frags[i] = unpackUnorm4x8(nodes[int(fragmentList[i].r)].color);
	}

	FragColor = blendFinalColor(frags,fragNumber);
    }
    else{
	FragColor = bgColor;
    }
}