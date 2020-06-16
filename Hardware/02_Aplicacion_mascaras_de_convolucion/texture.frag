// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision mediump float;
#endif


// our texcoords from the vertex shader
varying vec2 vTexCoord;

// the texture that we want to manipulate
uniform sampler2D u_img;
uniform int u_key;

// how big of a step to take. 1.0 / width = 1 texel
// doing this math in p5 saves a little processing power
uniform vec2 stepSize;

// an array with 9 vec2's
// each index in the array will be a step in a different direction around a pixel
// upper left, upper middle, upper right
// middle left, middle, middle right
// lower left, lower middle, lower right
vec2 offset[9];

// the convolution kernel we will use
// different kernels produce different effects
// we can do things like, emboss, sharpen, blur, etc.
float kernel[9];

// the sum total of all the values in the kernel
//float kernelWeight = 0.0;

// our final convolution value that will be rendered to the screen
vec4 conv = vec4(0.0);

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
  // flip the y uvs
  uv.y = 1.0 - uv.y;
  
  convolution();

  // different values in the kernels produce different effects
  // take a look here for some more examples https://en.wikipedia.org/wiki/Kernel_(image_processing) or https://docs.gimp.org/en/plug-in-convmatrix.html

  // here are a few examples, try uncommenting them to see how they affect the image
 
	
	offset[0] = vec2(-stepSize.x, -stepSize.y); // top left
	offset[1] = vec2(0.0, -stepSize.y); // top middle
	offset[2] = vec2(stepSize.x, -stepSize.y); // top right
	offset[3] = vec2(-stepSize.x, 0.0); // middle left
	offset[4] = vec2(0.0, 0.0); //middle
	offset[5] = vec2(stepSize.x, 0.0); //middle right
	offset[6] = vec2(-stepSize.x, stepSize.y); //bottom left
	offset[7] = vec2(0.0, stepSize.y); //bottom middle
	offset[8] = vec2(stepSize.x, stepSize.y); //bottom right

	for(int i = 0; i<9; i++){
		//sample a 3x3 grid of pixels
		vec4 color = texture2D(u_img, uv + offset[i]);

    // multiply the color by the kernel value and add it to our conv total
		conv += color * kernel[i];

    // keep a running tally of the kernel weights
		//kernelWeight += kernel[i];
	}

  // normalize the convolution by dividing by the kernel weight
  //conv.rgb /= kernelWeight;
		
	gl_FragColor = vec4(conv.rgb, 1.0);
}