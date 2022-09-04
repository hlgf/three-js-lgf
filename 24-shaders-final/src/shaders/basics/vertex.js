const  basicsVertex = () => 
`// 在THREE.ShaderMaterial中,自带属性默认进行了定义,都可以省略定义,否则会报错'xxx' : redefinition
// THREE.RawShaderMaterial自带属性也需要进行定位
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// shader矢量化的中的uniform属性 
uniform vec3 uColor; 

// geomotry自带的属性
attribute vec3 position;
attribute vec2 uv;

// 给geomotry自定义的属性
attribute float aRandom;

// 需要传递给fragement的信息
varying float vRandom;
varying vec2 vUv;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    modelPosition.x += 1.0;
	  // 建议先写矩阵,不然会有问题
    vec4 viewPosition = viewMatrix*modelPosition;
   
    vec4 projectionPosition = projectionMatrix*viewPosition;
    gl_Position  = projectionPosition;
    // gl_Position = projectionMatrix*viewMatrix*modelMatrix* vec4(position,1.0);
    vRandom = aRandom;
	 vUv = uv;
}
`