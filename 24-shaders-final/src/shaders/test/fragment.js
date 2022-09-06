// 如果色值为rgba,则需要设置transparent
var testFragmentShader = () =>
    `
    uniform vec3 uColor;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main()
    {
        vec4 textureColor = texture2D(uTexture, vUv);
        // 通过z位置的变化来增添明暗
        textureColor.rgb *= vElevation * 2.0 + 0.65;
        gl_FragColor = textureColor;
    }`
