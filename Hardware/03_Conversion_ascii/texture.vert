// https://github.com/aferriss/p5jsShaderExamples

attribute vec3 aPosition;
attribute vec2 aTexCoord;

// Obtener texcoords
varying vec2 vTexCoord;

void main() {

  // Copia los texcoords
  vTexCoord = aTexCoord;
  // Copia la poscicion de los datos en vec4, usando 1.0 como el componente w
  vec4 positionVec4 = vec4(aPosition, 1.0);

  // Escala la posicion por dos y la mueve al centro de la pantalla
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  // Envia la informacion del vertex al fragment shader
  gl_Position = positionVec4;
}