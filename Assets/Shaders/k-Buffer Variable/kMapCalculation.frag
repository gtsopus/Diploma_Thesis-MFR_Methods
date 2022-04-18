layout(binding = 0, r32ui )				uniform uimage2D				image_counter;
layout(binding = 6, r32f )			 	uniform image2D					image_importance;

uniform float total_importance;
uniform float average_k;

float getImportance				(        ) { return imageLoad  (image_importance    , ivec2(gl_FragCoord.xy)).r;			   		   }
void  setMaxPixelKValue			(uint val) { 		imageStore (image_counter		, ivec2(gl_FragCoord.xy), uvec4(val)); }

void main(){
	float importance = getImportance();

	if (importance <= 0.0f){
		return;
	}

	uint counter = uint(imageLoad(image_counter, ivec2(gl_FragCoord.xy)).x);

	float k_xy = floor((importance/total_importance)*average_k*WIDTH*HEIGHT);

	if(uint(k_xy) <= counter){
		imageStore(image_counter,ivec2(gl_FragCoord.xy),uvec4(uint(k_xy)));
	}
}