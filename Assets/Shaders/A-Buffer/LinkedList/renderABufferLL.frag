#version 460
#extension GL_NV_gpu_shader5 : enable


struct LLNode
{
    highp uint   next;
    highp uint   color;
    highp float  depth;
};

layout(binding = 0, std430) buffer Mybuffer{ LLNode nodes[];};

uniform layout(binding=1, r32ui)	highp coherent uimage2D list_heads;
layout (binding = 2, offset = 0)	uniform atomic_uint counter;

vec4 computeColor(){}

void main(void) {
    uint page_id = atomicCounterIncrement(counter) + 1u;

    if(page_id < uint(nodes.length())){
        
        //Create fragment to be stored
		vec4 col = computeColor();

        uint prev_id         = imageAtomicExchange(list_heads, ivec2(gl_FragCoord.xy), page_id);
        nodes[page_id].color = packUnorm4x8(vec4(col.rgb,1.0f));
        nodes[page_id].depth = gl_FragCoord.z;
        nodes[page_id].next  = prev_id;
    }
}