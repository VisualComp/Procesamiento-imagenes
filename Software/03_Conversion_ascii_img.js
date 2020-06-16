let img;
let img2;
 
// Resolucion: los colores se muestran cada n pixeles
let resolution = 6;
let repaint = 0; // Controla la cantidad de veces que se ejecuta asciify();
let intensity = 1; // Validacion del modo de pintado de los caracteres
 
// Contiene los caracteres que van a reemplazar cada pixel
let ascii=[];
let link='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Keel-billed_toucan.jpg/466px-Keel-billed_toucan.jpg';
 

function preload() {
    img = loadImage(link);
    img2 = loadImage(link);
}
function setup() {    
    var myCanvas = createCanvas(466, 600);
    myCanvas.parent('asciiImg');
    background(255);
    fill(0);
    noStroke();
 
    // Construye una matriz de caracteres que corresponda a los valores del brillo
    //ascii = new char[256];
    let letters = "@&$o%#*+=-':. ";
    for (let i = 0; i < 256; i++) {
        let index = int(map(i, 0, 256, 0, letters.length));
        ascii[i] = letters.charAt(index);
    }
    let mono = textFont("Georgia", resolution + 2);
    textFont(mono);
}

function draw(){
    if (repaint < 1){
        asciify();
        repaint += 1;
    }
    //image(img2,0,height/2+height/4,width/4,height/4);
}
 
function asciify() {
  // Se convierte la imagen a escala de grises para que sea mas preciso calcular el brillo
  img.filter(GRAY);
  img.loadPixels();
  img2.loadPixels();
 
  // Se recorre cada pixel de la imagen
  for (let y = 0; y < img.height; y += resolution) {
    for (let x = 0; x < img.width; x += resolution) {
      
        let index = (x+y*width)*4; // Posicion del pixel
        let r=img.pixels[index+0]; // Componente Red
        let g=img.pixels[index+1]; // Componente Green
        let b=img.pixels[index+2]; // Componente Blue
        let a=img.pixels[index+3]; // Componente Alpha
        // Componenetes sin modificaciones
        let R=img2.pixels[index+0]; // Componente Red
        let G=img2.pixels[index+1]; // Componente Green
        let B=img2.pixels[index+2]; // Componente Blue
        let A=img2.pixels[index+3]; // Componente Alpha
    
        asciiPaint(R,G,B,A,x,y); // Color de los caracteres
        // Toma el color del n-simo pixel y lo reemplza con el caracter de brillo similar
        text(ascii[int(brightness(color(r,g,b,a)))], x, y); // Dibuja los caracteres
    }
  }
  //img.updatePixels();
}

// Se ejecuta cuando se presiona cualquier tecla
function keyPressed() {
    if (key === '0') { // Imagen original
        resetCanvas(width,height);
        image(img2,0,0);
    } else if (key === '1') { // Caracteres en negro
        intensity=1;
        resetCanvas(width,height);
    } else if (key === '2') { // Caracteres a color
        intensity=2;
        resetCanvas(width,height);
    } else if (key === '3') { // Borde caracteres a color
        intensity=3;
        resetCanvas(width,height);
    } else if (key === '4') { // Repintar caracteres en el lienzo
        intensity=4;
        resetCanvas(width,height);
    } else if (key === '5') { // Repintado horizontal 
        intensity=5;
        resetCanvas(width,height);
        repaint=-1;
    } else if (key === '6') { // Repintado diagonal 
        intensity=6;
        resetCanvas(width,height);
        repaint=-1;
    } else if (key === 'a') { // Imagen #1
        resetCanvas(466, 600);
        repaint=-3;
        img = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Keel-billed_toucan.jpg/466px-Keel-billed_toucan.jpg");
        img2 = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Keel-billed_toucan.jpg/466px-Keel-billed_toucan.jpg");
    } else if (key === 'b') { // Imagen #2
        resetCanvas(700, 613);
        repaint=-3;
        img = loadImage("https://upload.wikimedia.org/wikipedia/commons/5/53/MalePeacockSpider.jpg");
        img2 = loadImage("https://upload.wikimedia.org/wikipedia/commons/5/53/MalePeacockSpider.jpg");
    } else if (key === 'c') { // Imagen #3
        resetCanvas(795, 600);
        repaint=-3;
        img = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/OdontodactylusScyllarus.jpg/795px-OdontodactylusScyllarus.jpg");
        img2 = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/OdontodactylusScyllarus.jpg/795px-OdontodactylusScyllarus.jpg");
    } else if (key === 'd') { // Imagen #4
        resetCanvas(800, 538);
        repaint=-3;
        img = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/2011_Rhinopithecus_roxellana.JPG/800px-2011_Rhinopithecus_roxellana.JPG");
        img2 = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/2011_Rhinopithecus_roxellana.JPG/800px-2011_Rhinopithecus_roxellana.JPG");
    } 
}
// Resetea el lienzo y el contador de pintado
function resetCanvas(w,h){
    resizeCanvas(0, 0);
    resizeCanvas(w, h);
    repaint=0;
}
// Define el color de los caracteres ASCII
function asciiPaint(R,G,B,A,x,y){
    if (intensity===1){
        fill(0);
        noStroke();
    } else if (intensity===2){
        fill(R,G,B,A);
        noStroke();
    } else if (intensity===3){
        fill(R,G,B,A);
        stroke(R,G,B,A);
    } else if (intensity===4){
        fill(R,G,B,A);
        stroke(R,G,B,A);
        repaint=-10;
    } else if (intensity===5){
        if (x>floor(width/3)){
            fill(R,G,B,A);
        } else {
            fill(0);
        }
        if(x>floor(width/3)*2){
            stroke(R,G,B,A);
        } else {
            noStroke();
        }
    } else if (intensity===6){
        if (x/2+y*2>floor((width+height)/3)){
            fill(R,G,B,A);
        } else {
            fill(0);
        }
        if(x*2+y/2>floor((width+height)/3)*2){
            stroke(R,G,B,A);
        } else {
            noStroke();
        }
    }
}