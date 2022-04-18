#extension GL_NV_fragment_shader_interlock : enable
layout(pixel_interlock_unordered) in;

layout(binding = 1, rg32f) coherent uniform image2D  scene_min_max;
layout(binding = 6, rg32f) coherent uniform image2D  local_min_max;

void main(){


	float localMin = imageLoad(local_min_max,ivec2(gl_FragCoord.xy)).x;
	float localMax = imageLoad(local_min_max,ivec2(gl_FragCoord.xy)).y;
	

	beginInvocationInterlockNV();

	float sceneMin = imageLoad(scene_min_max,ivec2(0,0)).x;
	float sceneMax = imageLoad(scene_min_max,ivec2(0,0)).y;

	if(localMin < sceneMin){
		sceneMin = localMin;
	}

	if(localMax > sceneMax){
		sceneMax = localMax;
	}

	imageStore(scene_min_max,ivec2(0,0),vec4(sceneMin,sceneMax,0.0f,0.0f));

	endInvocationInterlockNV();


}