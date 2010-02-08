// Javascript Pong
var stage;
var stageH;
var stageW;
var b;

var bX;
var bY;
var bXS;
var bYS;
var vIsPause = false;
var kLeft = false;
var kRight = false;

var grid = 20;
var pW = 150;

var p1;
var p1X;
var p1Y;
var p1S;

var p2;
var p2X;
var p2Y;
var p2S;

function fmt00(XtoFormat){
 // fmt00: Tags leading zero onto numbers 0 - 9.
 // Particularly useful for displaying results from Date methods.
 //
 if (parseInt(XtoFormat) < 0) var neg = true;
 if (Math.abs(parseInt(XtoFormat)) < 10){
  XtoFormat = "0"+ Math.abs(XtoFormat);
 }
 if (neg) XtoFormat = "-"+XtoFormat;
 return XtoFormat;
}

function fnInit(){
	//Stage
	stage = document.getElementById('stage');
	stageH = document.getElementById('stage').offsetHeight-grid;
	stageW = document.getElementById('stage').offsetWidth-grid;
	
	p1X = stageW / 2;
	p1Y = stageH;
	p1S = 0;
	p2X = stageW / 2;
	p2Y = 0;
	p2S = 0;
	
	//Ball
	b = document.createElement("div");
	b.style['position'] = 'absolute';
	b.style['background'] = 'white'; //'url(bola.gif)';
	b.style['left'] = stageW / 2 + 'px';
	b.style['top'] = stageH / 2 + 'px';	
	b.style['width'] = grid + 'px';
	b.style['height'] = grid + 'px';
	b.style['z-index'] = '15';
	
	//Player1 (Human)
	p1 = document.createElement("div");
	p1.style['position'] = 'absolute';
	p1.style['background'] = 'white'; //'url(p1.gif)';
	p1.style['left'] = p1X + 'px';
	p1.style['top'] = p1Y + 'px';	
	p1.style['width'] = pW + 'px';
	p1.style['height'] = grid + 'px';
	p1.style['z-index'] = '15';
	
	//Player1 ScoreBoard
	p1s = document.createElement("div");
	p1s.style['position'] = 'absolute'; 
	p1s.style['right'] = '0px';
	p1s.style['bottom'] = '23px';	
	p1s.className = 'scoreboard';
	p1s.id = 'p1s';
	
	
	//Player2 (Computer)
	p2 = document.createElement("div");
	p2.style['position'] = 'absolute';
	p2.style['background'] = 'white'; //'url(p1.gif)';
	p2.style['left'] = p2X + 'px';
	p2.style['top'] = p2Y + 'px';	
	p2.style['width'] = pW + 'px';
	p2.style['height'] = grid + 'px';
	p2.style['z-index'] = '15';
	
	//Player2 ScoreBoard
	p2s = document.createElement("div");
	p2s.style['position'] = 'absolute'; 
	p2s.style['left'] = '0px';
	p2s.style['top'] = '28px';	
	p2s.className = 'scoreboard';
	p2s.id = 'p2s';
		
	//Addchild
	stage.appendChild(b);
	stage.appendChild(p1);
	stage.appendChild(p2);
	stage.appendChild(p1s);
	stage.appendChild(p2s);
	
	//Event Listener
	window.document.onkeydown = oKeyDown;
	window.document.onkeyup = oKeyUp;
	var intMainLoop = 0;
	intMainLoop = setInterval(fnLoop, 50);	
	fnStart();
}


function oKeyDown(e){
	var ev = e ? e.keyCode : event.keyCode  
	if(ev == 37){ kLeft = true;	}
		else if(ev == 39){ kRight = true;	}
		else if(ev == 80 || ev == 27){ //letter p, spacebar=32
							if(vIsPause === false) {
								vIsPause = true;p1.style['background'] = p2.style['background'] = b.style['background'] = 'gray';
								getElementById('game_menu').style.visibility='visible';
							}
							else {
								vIsPause = false;p1.style['background'] = p2.style['background'] = b.style['background'] = 'white';
								getElementById('game_menu').style.visibility='hidden';
							}
						}
}

function oKeyUp(e){
	kLeft = false;	kRight = false;
}

function fnStart(){
	//document.getElementById('ui').innerHTML = 'JAVASCRIPT PONG | YOU:' + fmt00(p1S) + ' COMPUTER:' + fmt00(p2S);
	document.getElementById('p1s').innerHTML = fmt00(p1S);
	document.getElementById('p2s').innerHTML = fmt00(p2S);
	bX = Math.random() *(stageW - grid);
	bY = stageH / 2;
	if(p1S > p2S) { bXS = 3; bYS = 3 } else { bXS = -3; bYS = -3;}
}


function fnLoop(){
if(!vIsPause){

	//Someone scores
	if(bY > stageH){ p2S++; fnStart(); }
	if(bY < 0){ p1S++; fnStart(); } 
	
	//Collision - Boundary 
	if(bX > stageW || bX < 0){ bXS *= -1; } 
	
	//Collision - Players
	if((bY > p1Y-grid && bX > p1X && bX < p1X+pW)||(bY < grid && bX > p2X && bX < p2X+pW)){bYS *= -1.1; bXS *= 1.1;}
	
	//Move ball
	bX+=bXS; bY+=bYS;	
	b.style['left'] = bX + 'px';
	b.style['top'] = bY + 'px';
	
	//Move Player1
	if(kLeft && p1X > 0){ p1X-=5; } else if (kRight && p1X+pW-grid < stageW){ p1X+=5;}
	p1.style['left'] = p1X + 'px';
	
	//Move Player2
	if(bX > p2X+pW){ p2X+=5; } else if(bX < p2X){ p2X-=5; }
	p2.style['left'] = p2X + 'px';
}
}