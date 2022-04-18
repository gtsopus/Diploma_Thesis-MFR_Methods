layout(binding = 0, r32ui ) readonly	uniform uimage2D		image_counter;
layout(binding = 4, offset = 0)			uniform atomic_uint		total_counter;
layout(binding = 6, r32f )			 	uniform image2D			image_importance;

void storeImportance(float val) 		{imageStore(image_importance, ivec2(gl_FragCoord.xy),     vec4(val,0f,0f,0f));}

float random( vec2 p )
{
    vec2 K1 = vec2(
        23.14069263277926, // e^pi (Gelfond's constant)
         2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
    );
    return fract( cos( dot(p,K1) ) * 12345.6789 );
}

void main()
{
	//Importance map parameters
	int NLimit = 18; //Hardcoded scene maximum layers
	float lambda = 0.1; //Noise level
	float ksi = random(vec2(gl_FragCoord.xy));

	uint pixelTotalLayers = imageLoad(image_counter,ivec2(gl_FragCoord.xy)).r;
	
	if (pixelTotalLayers == 0U) 
	{
		storeImportance(0);
		return;
	}

	//Foveated Importance

	float I_fov = length(gl_FragCoord.xy - vec2(WIDTH/2,HEIGHT/2)) / (1.1*length(vec2(WIDTH/2,HEIGHT/2)));

	I_fov = pow(I_fov,3);
	I_fov = 1 - clamp(I_fov, 0.0, 1.0);

	//Depth Complexity Importance

	float alpha = 0.375; //Not referring to transparency
	float I_depth = alpha + (1-alpha)*min(1,pixelTotalLayers/NLimit);

	//Combined importance
	float total_importance = max(0,I_fov*I_depth+lambda*(ksi-0.5));
	float scalar = 50.0;
	float importance = clamp(total_importance, 0.01, 1.0) ;
	uint int_importance = uint(floor(importance*scalar+0.5));
	
	storeImportance(importance);
	for (int i = 0; i < int_importance && i < int(scalar); ++i){
		atomicCounterIncrement(total_counter);	
	}
}