// Estas son definiciones necesarias que le permiten a la tarjeta gráfica saber cómo representar el sombreador
#ifdef GL_ES
precision mediump float;
#endif

// Le permiten a la tarjeta gráfica saber cómo representar el sombreador
varying vec2 vTexCoord;

// La textura que queremos manipular
uniform sampler2D u_img;
uniform int u_key;

// width y heidht con valores entre 0 y 1
uniform vec2 stepSize;

// Pasos en direccion distinta alrededor del pixel
vec2 offset[9];

// Guarda la matriz de convolucion
float kernel[9];

// Suma total de todos los valores en el kernel
//float kernelWeight = 0.0;

// Almaceena el valor de convolucion total
vec4 conv = vec4(0.0);

// Matrices de convolucion segun la tecla que se oprima 
void convolution(){
  if (u_key==0){
		kernel[0] = 0.0; kernel[1] = 0.0; kernel[2] = 0.0;
                kernel[3] = 0.0; kernel[4] = 1.0; kernel[5] = 0.0;
                kernel[6] = 0.0; kernel[7] = 0.0; kernel[8] = 0.0;
	} else if (u_key==1){
		kernel[0] = -1.0; kernel[1] = -1.0; kernel[2] = -1.0;
                kernel[3] = -1.0; kernel[4] =  9.0; kernel[5] = -1.0;
                kernel[6] = -1.0; kernel[7] = -1.0; kernel[8] = -1.0;
	} else if (u_key==2){
		kernel[0] = -2.0; kernel[1] = -1.0; kernel[2] =  0.0;
                kernel[3] = -1.0; kernel[4] =  1.0; kernel[5] =  1.0;
                kernel[6] =  0.0; kernel[7] =  1.0; kernel[8] =  2.0;
	} else if (u_key==3){
		kernel[0] =  1.0; kernel[1] =  0.0; kernel[2] = -1.0;
                kernel[3] =  0.0; kernel[4] =  0.0; kernel[5] =  0.0;
                kernel[6] = -1.0; kernel[7] =  0.0; kernel[8] =  1.0;
	} else if (u_key==4){
		kernel[0] =  0.0; kernel[1] =  1.0; kernel[2] =  0.0;
                kernel[3] =  1.0; kernel[4] = -4.0; kernel[5] =  1.0;
                kernel[6] =  0.0; kernel[7] =  1.0; kernel[8] =  0.0;
	} else if (u_key==5){
		kernel[0] = -1.0; kernel[1] = -1.0; kernel[2] = -1.0;
                kernel[3] = -1.0; kernel[4] =  8.0; kernel[5] = -1.0;
                kernel[6] = -1.0; kernel[7] = -1.0; kernel[8] = -1.0;
	} else if (u_key==6){
		kernel[0] =  0.0; kernel[1] = -1.0; kernel[2] =  0.0;
                kernel[3] = -1.0; kernel[4] =  5.0; kernel[5] = -1.0;
                kernel[6] =  0.0; kernel[7] = -1.0; kernel[8] =  0.0;
	} else if (u_key==7){
                kernel[0] = 1.0/9.0; kernel[1] = 1.0/9.0; kernel[2] = 1.0/9.0;
                kernel[3] = 1.0/9.0; kernel[4] = 0.1/9.0; kernel[5] = 1.0/9.0;
                kernel[6] = 1.0/9.0; kernel[7] = 1.0/9.0; kernel[8] = 1.0/9.0;
	} else if (u_key==8){
		kernel[0] = -1.0; kernel[1] =  0.0; kernel[2] =  1.0;
                kernel[3] = -2.0; kernel[4] =  0.0; kernel[5] =  2.0;
                kernel[6] = -1.0; kernel[7] =  0.0; kernel[8] =  1.0;
	} else if (u_key==9){
		kernel[0] = -3.0; kernel[1] = -3.0; kernel[2] =  5.0;
                kernel[3] = -3.0; kernel[4] =  0.0; kernel[5] =  5.0;
                kernel[6] = -3.0; kernel[7] = -3.0; kernel[8] =  5.0;
	} 
}

void main(){
	vec2 uv = vTexCoord;
  	// coltea la coredena y
	uv.y = 1.0 - uv.y;
	
	convolution();
  	
	// Se almacenan las posiciones en el offset
	offset[0] = vec2(-stepSize.x, -stepSize.y); // arriba izquierda
	offset[1] = vec2(0.0, -stepSize.y); // arriba centro
	offset[2] = vec2(stepSize.x, -stepSize.y); // arriba derecha
	offset[3] = vec2(-stepSize.x, 0.0); // centro izquierda
	offset[4] = vec2(0.0, 0.0); // centro derecha
	offset[5] = vec2(stepSize.x, 0.0); // centro izquierda
	offset[6] = vec2(-stepSize.x, stepSize.y); // abajo izquierda
	offset[7] = vec2(0.0, stepSize.y); // abajo centro
	offset[8] = vec2(stepSize.x, stepSize.y); // abajo derecha
	
	for(int i = 0; i<9; i++){
		// Nuevas cordenadas en las que se muestrara la textura. Una cuadricula de 3x3
		vec4 color = texture2D(u_img, uv + offset[i]);

    // Multiplique el color por el valor del kernel y hace la sumatoria en total conv
		conv += color * kernel[i];

    // Suma los valores del kernel
		//kernelWeight += kernel[i];
	}

  // Normalizar la convolucion con la suma de todos los valores del nucleo
  //conv.rgb /= kernelWeight;
		
	gl_FragColor = vec4(conv.rgb, 1.0);
}