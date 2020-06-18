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


float character(float n, vec2 p)
{
	p = floor(p*vec2(4.0, -4.0) + 2.5);
	if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)
	{
      float a = (floor(p.x+0.5) + 5.0 * floor(p.y+0.5));
		if (int(mod(n/exp2(a), 2.0)) == 1) return 1.0;
	}
	return 0.0;
}

void main(){

	vec2 uv = vTexCoord;
    // flip the y uvs
    uv.y = 1.0 - uv.y;
   
	vec2 pix = gl_FragCoord.xy;
	//vec3 col = texture2D(u_img, floor(pix/8.0)*8.0/uv).rgb;  
    vec3 col = texture2D(u_img, uv).rgb;  	

	float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;

  float n =  4096.0;             // .
	if (gray > 0.2) n = 65600.0;    // :
	if (gray > 0.3) n = 332772.0;   // *
	if (gray > 0.4) n = 15255086.0; // o
	if (gray > 0.5) n = 23385164.0; // &
	if (gray > 0.6) n = 15252014.0; // 8
	if (gray > 0.7) n = 13199452.0; // @
	if (gray > 0.8) n = 11512810.0; // #

	vec2 p = mod(pix/4.0, 2.0) - vec2(1.0);
  
  if(u_key==1){
    col = col*character(n, p);
  } else if(u_key==2){
    col = gray*vec3(character(n, p));
  } else if(u_key==3){
    col = col*character(n, p);
    col.g= 0.0;
    col.b= 0.0;
  } else if(u_key==4){
    col = col*character(n, p);
    col.r= 0.0;
    col.b= 0.0;
  } else if(u_key==5){
    col = col*character(n, p);
    col.r= 0.0;
    col.g= 0.0;
  } else if(u_key==6){
    col = gray*vec3(character(n, p));
    col.r= 1.0-col.r;
    col.g= 1.0-col.g;
    col.b= 1.0-col.b;
  } else if(u_key==7){
    col = col*character(n, p);
    col.r= col.r+0.5;
    col.r= clamp(col.r,0.0,1.0);
  } else if(u_key==8){
    col = col*character(n, p);
    col.g= col.g+0.5;
    col.g= clamp(col.g,0.0,1.0);
  } else if(u_key==9){
    col = col*character(n, p);
    col.b= col.b+0.5;
    col.b= clamp(col.b,0.0,1.0);
  }
			
	gl_FragColor = vec4(col, 1.0);
}