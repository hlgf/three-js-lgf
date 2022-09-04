const basicsFragement = () => 
`
// 初始化float的精度
precision mediump float;


// shader实例化的中的uniform属性,如果该属性不存在也不会报错,需要仔细
uniform vec3 uColor;
uniform sampler2D uTexture;

// vertex传递过来二点参数 
varying float vRandom;
varying vec2 vUv;

void main () {
    gl_FragColor = texture2D(uTexture, vUv);
}
`