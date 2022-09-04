uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
attribute vec3 position;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    vec4 viewPosition = modelPosition * viewMatrix;
    vec4 projectionPosition = viewPosition * projectionMatrix;
    gl_Position = projectionPosition;
}