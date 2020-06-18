let theShader;
let shaderTexture;
let img;
let cam;

let theShaderVideo;
let shaderVideo;
let video;

let angle=0;
let colorAscii = 1;

function preload(){
  img = loadImage('https://upload.wikimedia.org/wikipedia/commons/3/34/Haliaeetus_leucocephalus-whale-USFWS.jpg');
  video = createVideo('https://dm0qx8t0i9gc9.cloudfront.net/previews/video/hHeEEOX/videoblocks-european-honey-buzzard-pernis-apivorus-also-known-as-the-pern-or-common-pernis-a-bird-of-prey-in-the-family-accipitridae_rzzwhan8i__d5095639625470987e80edb6392f9673__P360.mp4');
  video.hide();
  // Cargar los shaders
  theShader = loadShader('texture.vert','texture.frag');
  theShaderVideo = loadShader('texture.vert','texture.frag');  
}

function setup() {
  pixelDensity(1);
  //cam = createCapture(VIDEO); //crea una captura de video
  //cam.size(windowWidth, windowHeight); //definde el tamaño de la captura
  
  // Se requiere trabajar con WEBGL
  createCanvas(windowWidth, 400, WEBGL);
  noStroke();

  // inicializar la capa del createGraphics
  shaderTexture = createGraphics(512, 512, WEBGL);
  shaderVideo = createGraphics(windowWidth, windowHeight, WEBGL);
  
  // Quitar bordes en el createGraphics
  shaderTexture.noStroke();
  shaderVideo.noStroke();  
  
  //cam.hide();
  video.loop();
}

function draw() {
  // Se pasa el shader a la capa del createGraphics
  shaderTexture.shader(theShader);
  shaderVideo.shader(theShaderVideo);

  // Valores uniform para el fragment shader
  theShader.setUniform("u_img", img);
  theShader.setUniform("u_key", colorAscii);
  theShader.setUniform("stepSize", [1.0/width,1.0/height]);
  theShaderVideo.setUniform('u_img', video);
  theShaderVideo.setUniform('u_key', colorAscii);
  theShaderVideo.setUniform("stepSize", [1.0/width,1.0/height]);
  
  // Renderizar el shader
  shaderTexture.rect(0,0,width,height);
  shaderVideo.rect(0,0,width,height);

  background(255);

  // Puntos de luz 
  pointLight(255, 255, 255, 0, 0, 500);
  // Efecto linterna
  let dx= mouseX-width/2;
  let dy= mouseY-height/2;
  pointLight(255,70,70,dx,dy,100);

  translate(0, 0, 0);
  push();
  // Se pasa el shader como textura
  texture(shaderTexture);
  translate(200, 0, 0);
  rotateZ(angle);
  rotateX(angle);
  rotateY(angle*2); 
  box(200);
  pop();
  
  // Rotacion de la caja
  angle += 0.002;
  
  push();
  // Se pasa la imagen original como textura
  texture(img);
  // Numero de puntas de la figura
  let ellipseFidelity = int(map(mouseX, 25, width, 8, 100));
  ellipse(-250, 0, 350, 350, ellipseFidelity);
  //plane(500,500);
  pop();
  
  push();
  //Se pasa el shader del video como textura
  texture(shaderVideo);
  translate(0, 0, -100);
  plane(900,500);
  pop();  
}

// Se ejecuta cuando se presiona cualquier tecla
function keyPressed() {
	if (key === '0') {
	colorAscii = 0;
	} else if (key === '1') { 
	colorAscii = 1;
	} else if (key === '2') {
	colorAscii = 2;
	} else if (key === '3') {
	colorAscii = 3;
	} else if (key === '4') {
	colorAscii = 4;
	} else if (key === '5') {
	colorAscii = 5;
	} else if (key === '6') {
	colorAscii = 6;
	} else if (key === '7') {
	colorAscii = 7;
	} else if (key === '8') {
	colorAscii = 8;
	} else if (key === '9') {
	colorAscii = 9;
	}
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}