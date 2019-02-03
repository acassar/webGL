attribute vec3 position;
attribute vec4 color;
uniform mat4 perspective;
uniform mat4 rotation;
uniform mat4 translation;
uniform mat4 scale;

varying vec4 vColor;
void main() {
     gl_Position = perspective  * translation * rotation * scale * vec4(position[0], position[1], position[2], 1);
     gl_PointSize = 10.0;
     vColor = color;
}
