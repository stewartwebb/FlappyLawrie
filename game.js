function player(x, y, image){
	this.vx = 0;
	this.vy = 0;
	this.sprite = new jaws.Sprite({x: x, y: y, image: image, anchor: "center"});
	
	this.move = function(){
		this.vy += 0.4
		this.sprite.x += 4
		this.sprite.y += this.vy
		if(this.sprite.y < 50){
			this.sprite.y = 50
			this.vy = 0
		}
	}
	this.collide = function(tube){
		if(this.sprite.y > 550){
			return true
		}
		for(var i = 0; i < tube.length; i++){
			if(jaws.collide(tube[i], this.sprite)){
				return true
			}
		}
	}
}

function show(id) {
    document.getElementById(id).style.display = 'block'
}
function hide(id) {
	document.getElementById(id).style.display = 'none'
}

var gameOver = true
var go = false
var highscore = localStorage.getItem("highscore");
var mouseDown = false

document.body.onmousedown = function() { 
	mouseDown = true
}
document.body.onmouseup = function() {
	mouseDown = false
}

function restart(){
	gameOver = false
	show("end-score")
	show("score")
	hide("box")
	document.getElementById("box").style.backgroundColor = "transparent"
}
function end(){ 
	show("box")
	hide("score")
	localStorage.setItem("highscore", highscore);
}

function game(){
	var gamer
	var viewport
	var parallax
	var tubes = []
	var score = 0
	var click = false
	
	this.setup = function(){
		gamer = new player(100, 300, "img/player.png")
		viewport = new jaws.Viewport({max_x: 10000, max_y: 600})
		
		parallax = new jaws.Parallax({repeat_x: true})
        parallax.addLayer({image: "img/bg.png", damping: 100})
        parallax.addLayer({image: "img/bg1.png", damping: 8})
        parallax.addLayer({image: "img/bg2.png", damping: 4})
		
		for(var i=0; i<30; i++){
			var random = Math.round(Math.random()*201)
			tubes.push(new jaws.Sprite({x: 800+(i*300), y: 25+random, image: "img/tube.png", anchor: "center_bottom"}))
			tubes.push(new jaws.Sprite({x: 800+(i*300), y: 285+random, image: "img/tube.png", anchor: "center_top"}))
		}
		
	}
	this.update = function(){
		if(!gameOver){
			if(Math.round((gamer.sprite.x - 750) / 300) > 0){ score = Math.round((gamer.sprite.x - 750) / 300) } else{ score = 0 }
			if(highscore < score){ highscore = score }
			document.getElementById("score").innerHTML = "Score " + score
			if(jaws.pressedWithoutRepeat("space") || ((mouseDown) && !click)){ gamer.vy = -10; click = true }
			if(!mouseDown && click){
				click = false
			}
			if(gamer.collide(tubes)){
				gameOver = true; 
				end();  
				gamer.sprite.x = 100
				gamer.sprite.y = 300
				gamer.vx = 0
				gamer.vy = 0
			}
			gamer.move()
			viewport.centerAround(gamer.sprite)
			parallax.camera_x += 2
		}
		else{
			if(jaws.pressedWithoutRepeat("space")){ restart() }
			document.getElementById("end-score").innerHTML = "Score " + score
			document.getElementById("highscore").innerHTML = "Highscore " + highscore
		}
	}
	this.draw = function(){
			jaws.clear()
			parallax.draw()
			viewport.apply( function() {
				gamer.sprite.draw()
				for(var i=0; i<tubes.length; i++){
					tubes[i].draw()
				}
			});
	}
}

jaws.onload = function() {
      jaws.assets.add("img/player.png", "img/bg.png", "img/bg1.png", "img/bg2.png", "img/tube.png")
      jaws.start(game)
}