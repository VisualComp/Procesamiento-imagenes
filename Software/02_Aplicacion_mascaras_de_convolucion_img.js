var w = 60;
var K= 2;

var lienzo_01;
var lienzo_02;
var img_01;
var img_02;

// It's possible to convolve the image with many different 
// matrices to produce different effects. This is a high-pass 
// filter; it accentuates the edges. 
let matrixsize = 3;
var matrix = [ [  0,  0,  0 ],
               [  0,  1,  0 ],
               [  0,  0,  0 ] ];
var title = 'IDENTIDAD';


function setup() { 
	var myCanvas = createCanvas(1100, 450);
	 myCanvas.parent('masksImg');
	background(210);
	pixelDensity();

	img_01 = loadImage('https://upload.wikimedia.org/wikipedia/commons/b/b8/Panther_Chameleon_%28Furcifer_pardalis%29.jpg');
	img_02 = loadImage('https://upload.wikimedia.org/wikipedia/commons/b/b8/Panther_Chameleon_%28Furcifer_pardalis%29.jpg');

	lienzo_01 = createGraphics(500, 450);
	lienzo_02 = createGraphics(600, 450);

	lienzo_01.textSize(18);
	lienzo_01.stroke(255,255,128);
	lienzo_01.textStyle(BOLDITALIC);
	lienzo_01.textAlign(CENTER);
} 

function draw() {
    drawImage_01();
    drawImage_02();

    image(lienzo_01, 0, 0);
	image(lienzo_02, 550, 0);	
}
// Dibuja la imagen de la Izquierda
function drawImage_01() {
	lienzo_01.image(img_01, 0, 0); 
	lienzo_01.text(title, 0, 20,lienzo_01.width); 
}
// Dibuja la imagen de la Derecha
function drawImage_02() {
	// We're only going to process a portion of the image
	// so let's set the whole image as the background first
	image(img_02, 0, 0);

	let xstart = constrain(mouseX - w/2, 0, img_02.width);
	let ystart = constrain(mouseY - w/2, 0, img_02.height);
	let xend = constrain(mouseX + w/2, 0, img_02.width);
	let yend = constrain(mouseY + w/2, 0, img_02.height);

	loadPixels();
	img_02.loadPixels();
	let img = createImage(600, 450);
	img.loadPixels();

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++ ) { 
			let c = convolution(x, y, matrix, matrixsize, img_02);
			let loc = (x + y*img_02.width)*4;

			img.pixels[loc] = red(c);
			img.pixels[loc+1] = green(c);
			img.pixels[loc+2] = blue(c);
			img.pixels[loc+3] = alpha(c);
		}
	}
	
	img.updatePixels();
	image(img, 550, 0); 
}

function convolution(x, y, matrix, matrixsize, img){
	//img.loadPixels();
	var rtotal = 0;
	var gtotal = 0;
	var btotal = 0;
	var atotal = 0;
	var offset = matrixsize / 2;
	for (let i = 0; i < matrixsize; i++){
		for (let j= 0; j < matrixsize; j++){
			// What pixel are we testing
			var xloc = x+i;
			var yloc = y+j;
			var loc = (xloc + img.width*yloc)*4;

			// Make sure we haven't walked off our image, we could do better here
			loc = constrain(loc,0,img.pixels.length-1);
			// Calculate the convolution
			rtotal += ((img.pixels[loc]) * matrix[i][j]);
			gtotal += ((img.pixels[loc+1]) * matrix[i][j]);
			btotal += ((img.pixels[loc+2]) * matrix[i][j]);
			atotal += ((img.pixels[loc+3]) * matrix[i][j]);
		}
	}

	// Make sure RGB is within range
	rtotal = constrain(rtotal, 0, 255);
	gtotal = constrain(gtotal, 0, 255);
	btotal = constrain(btotal, 0, 255);
	atotal = constrain(atotal, 0, 255);
	// Return the resulting color
	return color(rtotal, gtotal, btotal);
}
// Se ejecuta cuando se presiona cualquier tecla
function keyPressed() {
	matrixsize = 3;
	if (key === '0') { // Identidad
    matrix = [ [  0,  0,  0 ],
               [  0,  1,  0 ],
			   [  0,  0,  0 ] ]; 
			   title = 'IDENTIDAD';
  } else if (key === '1') { // Enfocar. Acentúa los bordes
    matrix = [ [ -1, -1, -1 ],
               [ -1,  9, -1 ],
			   [ -1, -1, -1 ] ]; 
			   title = 'ACENTUAR BORDES';
  } else if (key === '2') { // Repujado
    matrix = [ [ -2, -1,  0 ],
               [ -1,  1,  1 ],
			   [  0,  1,  2 ] ]; 
			   title = 'REPUJADO';
  } else if (key === '3') { // Detección de bordes
    matrix = [ [  1,  0, -1 ],
               [  0,  0,  0 ],
			   [ -1,  0,  1 ] ]; 
			   title = 'DETECCIÓN DE BORDES';
  } else if (key === '4') {
    matrix = [ [  0,  1,  0 ],
               [  1, -4,  1 ],
			   [  0,  1,  0 ] ]; 
			   title = 'DETECCIÓN DE BORDES';
  } else if (key === '5') {
    matrix = [ [ -1, -1, -1 ],
               [ -1,  8, -1 ],
			   [ -1, -1, -1 ] ]; 
			   title = 'DETECCIÓN DE BORDES';
  } else if (key === '6') { // Enfocar
    matrix = [ [  0, -1,  0 ],
               [ -1,  5, -1 ],
			   [  0, -1,  0 ] ];
			   title = 'ENFOCAR';
  } else if (key === '7') { // Desenfoque de cuadro (normalizado)
    matrix = [ [ 1/9, 1/9, 1/9 ],
               [ 1/9, 1/9, 1/9 ],
			   [ 1/9, 1/9, 1/9 ] ]; 
			   title = 'DESENFOQUE DE CUADRO';
  } else if (key === '8') { // Desenfoque gaussiano 5 × 5 (aproximación)
    matrixsize = 5;
    matrix = [ [ 1/256,  4/256,  6/256,  4/256, 1/256 ],
			   [ 4/256, 16/256, 24/256, 16/256, 4/256 ],
			   [ 6/256, 24/256, 36/256, 24/256, 6/256 ],
               [ 4/256, 16/256, 24/256, 16/256, 4/256 ],
			   [ 1/256,  4/256,  6/256,  4/256, 1/256 ] ];
			   title = 'DESENFOQUE GAUSSIANO';
  } else if (key === '9') { // Máscara de desenfoque 5 × 5 (sin máscara de imagen)
	matrixsize = 5;
    matrix = [ [ -1/256,  -4/256,  -6/256,  -4/256, -1/256 ],
			   [ -4/256, -16/256, -24/256, -16/256, -4/256 ],
			   [ -6/256, -24/256, 476/256, -24/256, -6/256 ],
               [ -4/256, -16/256, -24/256, -16/256, -4/256 ],
			   [ -1/256,  -4/256,  -6/256,  -4/256, -1/256 ] ];
			   title = 'MÁSCARA DE DESENFOQUE';
  } else if (key === 's') { // Operador de Sobel
    let x = [ [  1/4,  0/4, -1/4 ],
              [  2/4,  0/4, -2/4 ],
			  [  1/4,  0/4, -1/4 ] ];
			   
	let y = [ [ -1/4, -2/4, -1/4 ],
			  [  0/4,  1/4,  0/4 ],
			  [  1/4,  2/4,  1/4 ] ];
	matrix = x;
			   for (let i = 0; i < matrixsize; i++){
				for (let j= 0; j < matrixsize; j++){
					matrix[i][j]=atan(x[i][j]/y[i][j]);
					}
				}				
				title = 'OPERADOR DE SOBEL';
  } else if (key === 'p') { // Operador de Prewitt
    let x = [ [ -1,  0,  1 ],
              [ -1,  0,  1 ],
			  [ -1,  0,  1 ] ];
			   
	let y = [ [  1,  1,  1 ],
			  [  0,  0,  0 ],
			  [ -1, -1, -1 ] ];
	matrix=x;
			   for (let i = 0; i < matrixsize; i++){
				for (let j= 0; j < matrixsize; j++){
					matrix[i][j]=x[i][j]+y[i][j];
					}
				}
				title = 'OPERADOR DE PREWITT';
  } else if (key === 'f') { // Operador de Frei-Chen
    let x = [ [  1,        0,       -1 ],
              [  sqrt(2),  0, -sqrt(2) ],
			  [  1,        0,       -1 ] ];
			   
	let y = [ [  1,  sqrt(2),  1 ],
			  [  0,        0,  0 ],
			  [ -1, -sqrt(2), -1 ] ];
	
	let z = [ [ -1,  0,  1 ],
			  [  0,  0,  0 ],
			  [  1,  0, -1 ] ];
	matrix=x;
			   for (let i = 0; i < matrixsize; i++){
				for (let j= 0; j < matrixsize; j++){
					matrix[i][j]=x[i][j]+y[i][j]+z[i][j];
					}
				}
				title = 'OPERADOR DE FREI-CHEN';
  } else if (key === 'r') { // Operador de Robinson
    matrix = [ [ -1,  0, 1 ],
			   [ -2,  0, 2 ],
			   [ -1,  0, 1 ] ];
			   title = 'OPERADOR DE ROBINSON';
  } else if (key === 'k') { // Operador de Kirsch
    matrix = [ [ -3, -3,  5 ],
			   [ -3,  0,  5 ],
			   [ -3, -3,  5 ] ];
			   title = 'OPERADOR DE KIRSCH';
  } else if (key === 'b') { // Reducción de ruido
	matrixsize = 5;
    matrix = [ [  2/159,  4/159,    5/159,   4/159,  2/159 ],
			   [  4/159,  9/159,   12/159,   9/159,  4/159 ],
			   [  5/256,  12/256,  15/256,  12/256,  5/256 ],
               [  4/159,  9/159,   12/159,   9/159,  4/159 ],
			   [  2/159,  4/159,    5/159,   4/159,  2/159 ] ];
			   title = 'REDUCCIÓN DE RUIDO';
  } 
}
