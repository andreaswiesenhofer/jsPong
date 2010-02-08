/*
** jsPong - JavaScipt Pong
** @author Andreas Wiesenhofer <awiesi@gmail.com>
*/

var jsPong = {

	stage: null,
	stageH: null,
	stageW: null,
	b: document.createElement("div"),

	bX: null,
	bY: null,
	bXS: null,
	bYS: null,
	vIsPause: false,
	kLeft: false,
	kRight: false,

	grid: 20,
	pW: 150,

	p1: null,
	p1X: null,
	p1Y: null,
	p1S: null,

	p2: null,
	p2X: null,
	p2Y: null,
	p2S: null,
	
	intMainLoop: 0,
	
	fmt00: function (XtoFormat){
 		/*
 		** fmt00 tags leading zero to numbers 0-9 (-> 00-09)
		** @param number to convert
		** @return {string} number with leading zero
		*/
 		if (parseInt(XtoFormat) < 0) var neg = true;
 		
		if (Math.abs(parseInt(XtoFormat)) < 10){
			XtoFormat = "0"+ Math.abs(XtoFormat);
		}
		if (neg) XtoFormat = "-"+XtoFormat;
		return XtoFormat;
	},
	
	fnInit: function (){
		//Stage
		jsPong.stage = document.getElementById('stage');
		jsPong.stageH = document.getElementById('stage').offsetHeight-jsPong.grid;
		jsPong.stageW = document.getElementById('stage').offsetWidth-jsPong.grid;
	
		jsPong.p1X = jsPong.stageW / 2;
		jsPong.p1Y = jsPong.stageH;
		jsPong.p1S = 0;
		jsPong.p2X = jsPong.stageW / 2;
		jsPong.p2Y = 0;
		jsPong.p2S = 0;
	
		//Ball
		jsPong.b = document.createElement("div");
		jsPong.b.style['position'] = 'absolute';
		jsPong.b.style['background'] = 'white';
		jsPong.b.style['left'] = jsPong.stageW / 2 + 'px';
		jsPong.b.style['top'] = jsPong.stageH / 2 + 'px';	
		jsPong.b.style['width'] = jsPong.grid + 'px';
		jsPong.b.style['height'] = jsPong.grid + 'px';
		jsPong.b.style['z-index'] = '15';
	
		//Player1 (Human)
		jsPong.p1 = document.createElement("div");
		jsPong.p1.style['position'] = 'absolute';
		jsPong.p1.style['background'] = 'white';
		jsPong.p1.style['left'] = jsPong.p1X + 'px';
		jsPong.p1.style['top'] = jsPong.p1Y + 'px';	
		jsPong.p1.style['width'] = jsPong.pW + 'px';
		jsPong.p1.style['height'] = jsPong.grid + 'px';
		jsPong.p1.style['z-index'] = '15';
	
		//Player1 ScoreBoard
		jsPong.p1s = document.createElement("div");
		jsPong.p1s.style['position'] = 'absolute'; 
		jsPong.p1s.style['right'] = '0px';
		jsPong.p1s.style['bottom'] = '23px';	
		jsPong.p1s.className = 'scoreboard';
		jsPong.p1s.id = 'p1s';
		
		//Player2 (Computer)
		jsPong.p2 = document.createElement("div");
		jsPong.p2.style['position'] = 'absolute';
		jsPong.p2.style['background'] = 'white';
		jsPong.p2.style['left'] = jsPong.p2X + 'px';
		jsPong.p2.style['top'] = jsPong.p2Y + 'px';	
		jsPong.p2.style['width'] = jsPong.pW + 'px';
		jsPong.p2.style['height'] = jsPong.grid + 'px';
		jsPong.p2.style['z-index'] = '15';
	
		//Player2 ScoreBoard
		jsPong.p2s = document.createElement("div");
		jsPong.p2s.style['position'] = 'absolute'; 
		jsPong.p2s.style['left'] = '0px';
		jsPong.p2s.style['top'] = '28px';	
		jsPong.p2s.className = 'scoreboard';
		jsPong.p2s.id = 'p2s';
		
		//Addchild
		jsPong.stage.appendChild(jsPong.b);
		jsPong.stage.appendChild(jsPong.p1);
		jsPong.stage.appendChild(jsPong.p2);
		jsPong.stage.appendChild(jsPong.p1s);
		jsPong.stage.appendChild(jsPong.p2s);
	
		//Event Listener
		window.document.onkeydown = jsPong.oKeyDown;
		window.document.onkeyup = jsPong.oKeyUp;
		jsPong.intMainLoop = setInterval(jsPong.fnLoop, 50);	
		jsPong.fnStart();
	}, /* fnInit() */


	oKeyDown: function (e){
		var ev = e ? e.keyCode : event.keyCode  
		if(ev == 37){ jsPong.kLeft = true;	}
			else if(ev == 39){ jsPong.kRight = true;	}
			else if(ev == 80 || ev == 27){ //letter p, spacebar=32
				if(jsPong.vIsPause === false) {
					jsPong.vIsPause = true;
					jsPong.p1.style['background'] = jsPong.p2.style['background'] = jsPong.b.style['background'] = 'gray';
					getElementById('game_menu').style.visibility='visible';
				}
				else {
					jsPong.vIsPause = false;
					jsPong.p1.style['background'] = jsPong.p2.style['background'] = jsPong.b.style['background'] = 'white';
					getElementById('game_menu').style.visibility='hidden';
				}
			}
	}, /* oKeyDown()*/

	oKeyUp: function (e){
		jsPong.kLeft = false;
		jsPong.kRight = false;
	},

	fnStart: function (){
		//document.getElementById('ui').innerHTML = 'JAVASCRIPT PONG | YOU:' + fmt00(p1S) + ' COMPUTER:' + fmt00(p2S);
		document.getElementById('p1s').innerHTML = jsPong.fmt00(jsPong.p1S);
		document.getElementById('p2s').innerHTML = jsPong.fmt00(jsPong.p2S);
		jsPong.bX = Math.random() *(jsPong.stageW - jsPong.grid);
		jsPong.bY = jsPong.stageH / 2;
		if(jsPong.p1S > jsPong.p2S) { 
			jsPong.bXS = 3;
			jsPong.bYS = 3;
		} else { 
			jsPong.bXS = -3;
			jsPong.bYS = -3;
		}
	},


	fnLoop: function (){
		if(!jsPong.vIsPause){

			//Someone scores
			if(jsPong.bY > jsPong.stageH){ jsPong.p2S++; jsPong.fnStart(); }
			if(jsPong.bY < 0){ jsPong.p1S++; jsPong.fnStart(); } 
	
			//Collision - Boundary 
			if(jsPong.bX > jsPong.stageW || jsPong.bX < 0){ jsPong.bXS *= -1; } 
	
			//Collision - Players
			if((jsPong.bY > jsPong.p1Y-jsPong.grid && jsPong.bX > jsPong.p1X && jsPong.bX < jsPong.p1X+jsPong.pW)||(jsPong.bY < jsPong.grid && jsPong.bX > jsPong.p2X && jsPong.bX < jsPong.p2X+jsPong.pW)){jsPong.bYS *= -1.1; jsPong.bXS *= 1.1;}
	
			//Move ball
			jsPong.bX+=jsPong.bXS; jsPong.bY+=jsPong.bYS;	
			jsPong.b.style['left'] = jsPong.bX + 'px';
			jsPong.b.style['top'] = jsPong.bY + 'px';
	
			//Move Player1
			if(jsPong.kLeft && jsPong.p1X > 0){ jsPong.p1X-=5; } else if (jsPong.kRight && jsPong.p1X+jsPong.pW-jsPong.grid < jsPong.stageW){ jsPong.p1X+=5;}
			jsPong.p1.style['left'] = jsPong.p1X + 'px';
	
			//Move Player2
			if(jsPong.bX > jsPong.p2X+jsPong.pW){ jsPong.p2X+=5; } else if(jsPong.bX < jsPong.p2X){ jsPong.p2X-=5; }
			jsPong.p2.style['left'] = jsPong.p2X + 'px';
		}
	}

} /* End jsPong */