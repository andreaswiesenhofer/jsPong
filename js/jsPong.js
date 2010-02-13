/*
** jsPong - JavaScipt Pong
** @author Andreas Wiesenhofer <awiesi@gmail.com>
*/

var jsPong = {

	stage: {
		object: {},
		height: null,
		width: null
	},
	
	ball: {
		sprite: {},
		x: null,
		y: null,
		speed: {
			x: null,
			y: null
		}
	},

	vIsPause: false,
	kLeft: false,
	kRight: false,

	grid: 20,
	pW: 150,
	
	human: {
		sprite: {},
		x: null,
		y: null,
		score: null,
		scoreboard: {}
	},
	
	computer: {
		sprite: null,
		x: null,
		y: null,
		score: null,
		scoreboard: {}
	},
	
	intMainLoop: 0,
	
	/*
	** fmt00 tags leading zero to numbers 0-9 (-> 00-09)
	** @see #start
	** @param number to convert
	** @return {string} number with leading zero
	*/
	fmt00: function (XtoFormat){
		
		var neg = false;
		
		if (parseInt(XtoFormat, 10) < 0) { neg = true; }
		
		if (Math.abs(parseInt(XtoFormat,10)) < 10)
			{ XtoFormat = "0"+ Math.abs(XtoFormat); }
			
		if (neg) { XtoFormat = "-"+XtoFormat; }
		
		return XtoFormat;
	},
	
	init: function (){
		//Stage
		jsPong.stage.object = document.getElementById('stage');
		jsPong.stage.height = jsPong.stage.object.offsetHeight-jsPong.grid;
		jsPong.stage.width = jsPong.stage.object.offsetWidth-jsPong.grid;
	
		jsPong.human.x = jsPong.stage.width / 2;
		jsPong.human.y = jsPong.stage.height;
		jsPong.human.score = 0;
		jsPong.computer.x = jsPong.stage.width / 2;
		jsPong.computer.y = 0;
		jsPong.computer.score = 0;
	
		/* Create and Style Ball-Sprite */
		jsPong.ball.sprite = document.createElement("div");
		jsPong.ball.sprite.style.position = 'absolute';
		jsPong.ball.sprite.style.background = 'white';
		jsPong.ball.sprite.style.left = jsPong.stage.width / 2 + 'px';
		jsPong.ball.sprite.style.top = jsPong.stage.height / 2 + 'px';	
		jsPong.ball.sprite.style.width = jsPong.grid + 'px';
		jsPong.ball.sprite.style.height = jsPong.grid + 'px';
		jsPong.ball.sprite.style.zindex = '15';
	
		/* Create and Style Racket of Human Player */
		jsPong.human.sprite = document.createElement("div");
		jsPong.human.sprite.style.position = 'absolute';
		jsPong.human.sprite.style.background = 'white';
		jsPong.human.sprite.style.left = jsPong.human.x + 'px';
		jsPong.human.sprite.style.top = jsPong.human.y + 'px';	
		jsPong.human.sprite.style.width = jsPong.pW + 'px';
		jsPong.human.sprite.style.height = jsPong.grid + 'px';
		jsPong.human.sprite.style.zindex = '15';
	
		/* Create and Style Scoreboard of Human Player */
		jsPong.human.scoreboard = document.createElement("div");
		jsPong.human.scoreboard.style.position = 'absolute'; 
		jsPong.human.scoreboard.style.right = '0px';
		jsPong.human.scoreboard.style.bottom = '23px';	
		jsPong.human.scoreboard.className = 'scoreboard';
		jsPong.human.scoreboard.id = 'human_scoreboard';
		
		/* Create and Style Racket of Computer Player */
		jsPong.computer.sprite = document.createElement("div");
		jsPong.computer.sprite.style.position = 'absolute';
		jsPong.computer.sprite.style.background = 'white';
		jsPong.computer.sprite.style.left = jsPong.computer.x + 'px';
		jsPong.computer.sprite.style.top = jsPong.computer.y + 'px';	
		jsPong.computer.sprite.style.width = jsPong.pW + 'px';
		jsPong.computer.sprite.style.height = jsPong.grid + 'px';
		jsPong.computer.sprite.style.zindex = '15';
	
		/* Create and Style Scoreboard of Computer Player */
		jsPong.computer.scoreboard = document.createElement("div");
		jsPong.computer.scoreboard.style.position = 'absolute'; 
		jsPong.computer.scoreboard.style.left = '0px';
		jsPong.computer.scoreboard.style.top = '28px';	
		jsPong.computer.scoreboard.className = 'scoreboard';
		jsPong.computer.scoreboard.id = 'computer_scoreboard';
		
		/* Add all sprites to stage */
		jsPong.stage.object.appendChild(jsPong.ball.sprite);
		jsPong.stage.object.appendChild(jsPong.human.sprite);
		jsPong.stage.object.appendChild(jsPong.computer.sprite);
		jsPong.stage.object.appendChild(jsPong.human.scoreboard);
		jsPong.stage.object.appendChild(jsPong.computer.scoreboard);
	
		//Event Listener
		window.document.onkeydown = jsPong.oKeyDown;
		window.document.onkeyup = jsPong.oKeyUp;
		jsPong.intMainLoop = setInterval(jsPong.loop, 50);	
		jsPong.start();
	}, /* init() */

	oKeyDown: function (e){
		var ev;
		
		if(e) { ev = e.keyCode; } else { ev = event.keyCode; }  
		
		if(ev == 37){ jsPong.kLeft = true;	}
			else if(ev == 39){ jsPong.kRight = true;	}
			else if(ev == 80 || ev == 27){ //letter p, spacebar=32
				if(jsPong.vIsPause === false) {
					jsPong.vIsPause = true;
					jsPong.human.sprite.style.background = jsPong.computer.sprite.style.background = jsPong.ball.sprite.style.background = 'gray';
					getElementById('game_menu').style.visibility='visible';
				}
				else {
					jsPong.vIsPause = false;
					jsPong.human.sprite.style.background = jsPong.computer.sprite.style.background = jsPong.ball.sprite.style.background = 'white';
					getElementById('game_menu').style.visibility='hidden';
				}
			}
	}, /* oKeyDown()*/

	oKeyUp: function (e){
		jsPong.kLeft = false;
		jsPong.kRight = false;
	},

	start: function (){
		jsPong.human.scoreboard.innerHTML = jsPong.fmt00(jsPong.human.score);
		jsPong.computer.scoreboard.innerHTML = jsPong.fmt00(jsPong.computer.score);
		jsPong.ball.x = Math.random() *(jsPong.stage.width - jsPong.grid);
		jsPong.ball.y = jsPong.stage.height / 2;
		if(jsPong.human.score > jsPong.computer.score) { 
			jsPong.ball.speed.x = 3;
			jsPong.ball.speed.y = 3;
		} else { 
			jsPong.ball.speed.x = -3;
			jsPong.ball.speed.y = -3;
		}
	},

	loop: function (){
		if(!jsPong.vIsPause){

			//Someone scores
			if(jsPong.ball.y > jsPong.stage.height){ jsPong.computer.score++; jsPong.start(); }
			if(jsPong.ball.y < 0){ jsPong.human.score++; jsPong.start(); } 
	
			//Collision - Boundary 
			if(jsPong.ball.x > jsPong.stage.width || jsPong.ball.x < 0){ jsPong.ball.speed.x *= -1; } 
	
			//Collision - Players
			if((jsPong.ball.y > jsPong.human.y-jsPong.grid && jsPong.ball.x > jsPong.human.x && jsPong.ball.x < jsPong.human.x+jsPong.pW)||(jsPong.ball.y < jsPong.grid && jsPong.ball.x > jsPong.computer.x && jsPong.ball.x < jsPong.computer.x+jsPong.pW)){jsPong.ball.speed.y *= -1.1; jsPong.ball.speed.x *= 1.1;}
	
			//Move ball
			jsPong.ball.x+=jsPong.ball.speed.x; jsPong.ball.y+=jsPong.ball.speed.y;	
			jsPong.ball.sprite.style.left = jsPong.ball.x + 'px';
			jsPong.ball.sprite.style.top = jsPong.ball.y + 'px';
	
			//Move Player1
			if(jsPong.kLeft && jsPong.human.x > 0){ jsPong.human.x-=5; } else if (jsPong.kRight && jsPong.human.x+jsPong.pW-jsPong.grid < jsPong.stage.width){ jsPong.human.x+=5;}
			jsPong.human.sprite.style.left = jsPong.human.x + 'px';
	
			//Move Player2
			if(jsPong.ball.x > jsPong.computer.x+jsPong.pW){ jsPong.computer.x+=5; } else if(jsPong.ball.x < jsPong.computer.x){ jsPong.computer.x-=5; }
			jsPong.computer.sprite.style.left = jsPong.computer.x + 'px';
		}
	} /* fnLoop() */

}; /* End jsPong */