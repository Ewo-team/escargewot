var game = {};

(function () {

jQuery(window).ready(function(){
	pauseMusic();
	jQuery('html').append('<div class="hide" id="'+pref+'wrapper"></div>');
	
	jQuery.each(ressources, function(id, value){
		jQuery('#'+pref+'wrapper').append('<img src="'+value+'" id="'+pref+id+'"/>');
	});
	
});

	
var y_dec 	= 75;
var w_g 	= 8;
var h_g 	= 5;

var free_first = 3;

//taille des images
var w_i = 100;
var h_i = 75;


var cst_dev = w_g*w_i;

var pref = 'res_';
//préchargement des images
var ressources = {
	'road'	: 'imgs/road.png',
	'oil' 	: 'imgs/oil.png',
	'perso'	: 'imgs/escargot1.png',
	'teddy'	: 'imgs/teddy.png',
	'water'	: 'imgs/water.png',
	'vodka'	: 'imgs/vodka.png',
	'beer'	: 'imgs/beer.png',
	'smoke'	: 'imgs/particle/smoke.png',
	'fire'	: 'imgs/particle/fire.png'
};

//utilisation des ressources chargées
function _(res){
	return jQuery('#'+pref+res)[0];
}

var milestone_up = 500;

//vitesse de base
var speed ; // px par seconde
var score ;
var distance;

var cases = [];
var objs = [];

var oil_prob = 20;
var vodka_prob = 2000;
var water_prob = 15;
var beer_prob = 500;

function generate_line(index){
	if(index == undefined){
		cases.push([]);
		objs.push([]);
		index = cases.length - 1;
	}
	else{
		cases[index] =  [];
		objs[index] =  [];
	}
	
	for(j = 0; j < h_g;++j){
		var oil = Math.floor(Math.random()*oil_prob);
		if(oil == 0)
			cases[index].push('oil');
		else
			cases[index].push('road');
			
		var vodka = Math.floor(Math.random()*vodka_prob);
		var water = Math.floor(Math.random()*water_prob);
		var beer  = Math.floor(Math.random()*beer_prob);
		
		if(beer == 0){
			objs[index].push('beer');
		}	
		else if(vodka == 0){
			objs[index].push('vodka');
		}	
		else if(water == 0){
			objs[index].push('water');
		}
		else{
			objs[index].push(null);
		}
	}
}

var time  = 0;

var alco;

function init(){
	//"free_first" premières lignes libres
	for(i = 0; i < free_first;++i){
		cases[i] = [];
		objs[i]  = [];
		for(j = 0; j < h_g;++j){
			cases[i].push('road');
			objs[i].push(null);
		}
	}
	
	//Génération de la route de début
	for(i = free_first; i <= w_g;++i){
		generate_line(i);
	}
}

var fps = 30;
var lastUpdate = 0;
var mainTimeout;
var evt_init = false;
var bonus = 0;
var fire = false;

function initEvents(){
	if(evt_init)
		return;
	evt_init = true;
	var down = [false, false, false, false];
	jQuery("#game").bind({
		keydown: function(e) {
			
			var key = e.keyCode;

			if(key == 27 && !down[4]){ // echap
				if(run)
					pause();
				else
					play();
					down[4] = true;
			}
			
			if(key  == 40 && perso_pos_objectif < h_g - 1 && !down[0] && !anim.type == GLISSE){ //bas
				perso_pos_objectif++;
				down[0] = true;
			}
			else if(key  == 38 && perso_pos_objectif > 0 && !down[1] && !anim.type == GLISSE){//haut
				perso_pos_objectif--;
				down[1] = true;
			} 
			else if(key  == 37 && perso_adv_objectif > 0 && !down[2]){ //gauche
				perso_adv_objectif--;
				down[2] = true;
			}
			else if(key  == 39 && perso_adv_objectif < w_g - 1 && !down[3]){ //droite
				perso_adv_objectif++;
				down[3] = true;
			}
			
			if(key  == 32 && !fire){ // espace
				fire = true;
				fire_time = 0;
			}
		},
		keyup: function(e) {
			var key = e.keyCode;
			if(key  == 40){ //bas
				down[0] = false;
			}
			if(key  == 38){//haut
				down[1] = false;
			} 
			if(key  == 37){ //gauche
				down[2] = false;
			};
			if(key  == 39){ //droite
				down[3] = false;
			}
			if(key  == 32){ // espace
				fire = false;
			}
			if(key == 27){ // escape
				down[4] = false;
			}
		},

		focusin: function(e) {
			jQuery(e.currentTarget).addClass("selected");
		},

		focusout: function(e) {
			jQuery(e.currentTarget).removeClass("selected");
		}
	});
}
var max_alco = 200;
var speed_up = 1.2;
var speed_up_nb = 0;
var fpsInv = 1/fps;

function launchGame(){
	speed = 600;
	speed_up_nb = 0;
	distance = 0;
	alco = 20;
	perso_pos_objectif = Math.ceil(h_g / 2) - 1;
	perso_pos = perso_pos_objectif*w_i;
	perso_adv_objectif = 0;
	time = 0;
	bonus = 0;
	fire = false;
	lastUpdate = 0;
	last_milestone = 0;
	run = true;
	particules = [];
	teddy_pv = -1;
	jQuery('#sound_eternal_war').get(0).play();
	
	init();
	initEvents();
	jQuery("#game").focus();
	add_anim_classic()
	update();
}

var last_milestone = 0;

var l_dec = 0;
function update(){
	if(!run)
		return;
	distance += speed/fps;
	time += 750*fpsInv;
	var x_dec = distance % w_i;
	if(x_dec < l_dec){
		cases = cases.slice(1,cases.lenght);
		objs = objs.slice(1,objs.lenght);
			generate_line();
	}
	
	
	popTeddy();
	handleColision();
	l_dec = x_dec;
	//Draw background
	drawBackground(x_dec);
	//Draw infos
	drawInfos();
	//Draw objs
	drawObjs(x_dec);
	//Draw Teddy
	drawTeddy();
	//Draw perso
	drawPerso();
	//Draw particles
	drawParticles();
	
	if(run)
		mainTimeout = setTimeout(update, fpsInv);
}

var run = false;

function handleColision(){
	var index_x = Math.round(perso_adv/w_i);
	var index_y = Math.round(perso_pos/h_i);
	var ground = cases[index_x][index_y];
	
	if(ground == 'oil'){
		cases[index_x][index_y] = 'road';
		add_anim(GLISSE, 2);
	}
	var obj = objs[index_x][index_y];
	if(obj == 'water' && speed > 30){
		alco -= 2;
	}
	else if(obj == 'beer'){
		if(alco < max_alco)
			++alco;
	}
	else if(obj == 'vodka'){
		alco += 10;
		if(alco > max_alco)
			alco = max_alco;
	}
	
	objs[index_x][index_y] = null;
	
	if(alco <= 0)
		end();
}
var bonus = 0;

function drawBackground(x_dec){
	var posX = 0;
	jQuery.each(cases, function(x, line){
		posX = x*w_i - x_dec;
		
		jQuery.each(line,function(y, img){
			jQuery('#game').drawImage({
				source: _(img),
				x: posX,
				y: y_dec + y*h_i,
				fromCenter: false
			});
			
		});
	});
}

function drawObjs(x_dec){
	var posX = 0;
	jQuery.each(objs, function(x, line){
		posX = x*w_i - x_dec;
		
		jQuery.each(line,function(y, img){
			if(img != null){
				jQuery('#game').drawImage({
					source: _(img),
					x: posX,
					y: y_dec + y*h_i - h_i/3 ,
					fromCenter: false
				});
			}
		});
	});
}

var fire_time = 0;

function launch_fire(pos, x_dec){
	if(fire_time++ == 0){
		alco--;
	}
	for(i_fire = 0; i_fire < 5; ++i_fire)
		addFire(3.5*(Math.random()+0.5), 0.2*(Math.random()-0.5), 1+Math.random()*1.3, pos.x+w_i-20, pos.y + 10, -0.2-Math.random()/2,
			-0.1-Math.random()/2,(Math.random()-0.5)*360, (Math.random()-0.5)/2,1, DEAD_TEDDY_OBJ);
	
	if(fire_time > fps/2){
		addSmoke(3.5*(Math.random()+0.5), 0.2*(Math.random()-0.5), 1+Math.random()*1.3, pos.x+w_i-20, pos.y + 8, -0.2-Math.random()/2,
			-0.1-Math.random()/2,(Math.random()-0.5)*360, (Math.random()-0.5)/2,1);
		fire_time = 0;
	}
}

var perso_d = 0;

function drawParticles(){
	particules_tmp = particules;
	jQuery.each(particules, function(index, particle){
		if(particle.life <= 0){
			particules = remove(particules,index);
			return;
		}
		
		particle.x 		+= (particle.v_x+(Math.random()-0.5)*particle.v_x_p)*fpsInv*100;
		particle.y 		+= (particle.v_y+(Math.random()-0.5)*particle.v_y_p)*fpsInv*100;
		particle.rot 	+= particle.v_rot*fpsInv*100;
		particle.life 	-= fpsInv;
		
		if(particle.dead != DEAD_NOT){
			
			var case_part_x = Math.round((particle.x-l_dec)/w_i);
			var case_part_y = Math.floor((particle.y-g_y_dec)/h_i);

			
			var tx = Math.round(perso_adv/w_i);
			var ty = Math.round((perso_pos-g_y_dec)/h_i);
			
			if((particle.dead == DEAD_ALL || particle.dead == DEAD_PLAYER || particle.dead == DEAD_OBJ_PLAYER) &&
				case_part_x == tx && case_part_y == ty && teddy_pv > 0){
				if(time > perso_d){
					--alco;
					if(alco <= 0)
						end();
					perso_d = time + 500;
				}
				particules = remove(particules,index);
				return;
			}

			
			if((particle.dead == DEAD_ALL || particle.dead == DEAD_OTHER ||
			   particle.dead == DEAD_OBJ || particle.dead == DEAD_TEDDY_OBJ ||  particle.dead == DEAD_OBJ_PLAYER) &&
				case_part_x >=0 && case_part_x < objs.length &&
				
				(objs[case_part_x][case_part_y] != null ||
				cases[case_part_x][case_part_y] != 'road')){
					objs[case_part_x][case_part_y] = null;
					cases[case_part_x][case_part_y] = 'road';
			
					particules = remove(particules,index);
					return;
			}
			tx = Math.floor(teddy_x/w_i);
			ty = Math.floor(teddy_y/h_i);
			
				
			if((particle.dead == DEAD_ALL || particle.dead == DEAD_OTHER ||
				particle.dead == DEAD_TEDDY || particle.dead == DEAD_TEDDY_OBJ) &&
				case_part_x == tx && case_part_y == ty && teddy_pv > 0){


				--teddy_pv;
				if(teddy_pv == 0){
					bonus += 5000;
					teddy_x_objectif = w_i*(w_g+2);
				}
				particules = remove(particules,index);
				return;
			}
		}
		
		
		
		jQuery('#game').drawImage({
			source		: _(particle.type),
			x			: particle.x,
			y			: particle.y,
			rotate		: particle.rot,
			opacity		: 1- (particle.life_b - particle.life)/particle.life_b,
			scale		: particle.scale,
			fromCenter	: false
		});
	});
}



var fire_t = 0;
var teddy_mv_proba = fps*2;;

function drawTeddy(){
	if(teddy_pv < 0)
		return;
	if(teddy_x > teddy_x_objectif){
		teddy_x -= 4*w_i*fpsInv;
		if(teddy_x < teddy_x_objectif)
			teddy_x = teddy_x_objectif;
	}
	
	if(teddy_x < teddy_x_objectif){
		teddy_x += 4*w_i*fpsInv;
		if(teddy_x > teddy_x_objectif){
			teddy_x = teddy_x_objectif;
			teddy_pv = -1;
		}
	}

	if(teddy_y > teddy_y_objectif){
		teddy_y -= 4*w_i*fpsInv;
		if(teddy_y < teddy_y_objectif)
			teddy_y = teddy_y_objectif;
	}
	
	if(teddy_y < teddy_y_objectif){
		teddy_y += 4*w_i*fpsInv;
		if(teddy_y > teddy_y_objectif){
			teddy_y = teddy_y_objectif;
		}
	}
	
	var mv_proba = Math.ceil(Math.random() * teddy_mv_proba);
	if(mv_proba == teddy_mv_proba){
		
		var y = Math.round(teddy_y/h_g);
		if(y == 0)
			teddy_y_objectif += h_i;
		else if(y == (h_g-1)*h_i)
			teddy_y_objectif -= h_i;
		else{
			var mv_dir = Math.round(Math.random());
			if(mv_dir == 0)
				teddy_y_objectif -= h_i;
			else 
				teddy_y_objectif += h_i;
		}
	}
		
	g_y_dec = -1*Math.sin(time/speed*1.5)*h_i/6;
	var px = teddy_x - 120,
		py = y_dec + teddy_y + g_y_dec - h_i/3;
	jQuery('#game').drawImage({
		source: _('teddy'),
		x: px,
		y: py,
		fromCenter: false
	});

	if(fire_t == 1)
		addFire(-0.75*Math.random(), -0.2*(Math.random()+0.2), 1+Math.random()/0.8, px, py + 33, Math.random()/2, Math.random()/2,(Math.random()-0.5)*360, (Math.random()-0.5),1);
	addSmoke(-1.5*Math.random(), -0.4*(Math.random()+0.2), 1+Math.random()*1.5, px, py + 33, Math.random()/2, Math.random()/2,(Math.random()-0.5)*360, (Math.random()-0.5),1);
	teddyLaunchFire(px, py + 33);

}

var perso_pos = Math.ceil(h_g / 2) - 1;
var perso_pos_objectif = perso_pos;
var perso_adv = 0;
var perso_adv_objectif = 0;

function drawPerso(){

	if(perso_adv > perso_adv_objectif*w_i){
		perso_adv -= 4*w_i*fpsInv;
		if(perso_adv < perso_adv_objectif*w_i)
			perso_adv = perso_adv_objectif*w_i;
	}
	
	if(perso_adv < perso_adv_objectif*w_i){
		perso_adv += 4*w_i*fpsInv;
		if(perso_adv > perso_adv_objectif*w_i){
			perso_adv = perso_adv_objectif*w_i;
		}
	}

	if(perso_pos > perso_pos_objectif*h_i){
		perso_pos -= 4*w_i*fpsInv;
		if(perso_pos < perso_pos_objectif*h_i)
			perso_pos = perso_pos_objectif*h_i;
	}
	
	if(perso_pos < perso_pos_objectif*h_i){
		perso_pos += 4*w_i*fpsInv;
		if(perso_pos > perso_pos_objectif*h_i){
			perso_pos = perso_pos_objectif*h_i;
		}
	}

	
	var pos;
	if(anim.type == GLISSE){
		pos = drawPersoGlisse();
	}
	else if(anim.type == CLASSIC){
		pos = drawPersoClassic();
	}
	jQuery('#game').drawImage({
		source: _('perso'),
		x: pos.x,
		y: pos.y,
		rotate: pos.rot,
		fromCenter: false
	});
	if(fire == true){
		launch_fire(pos);
	}
	
	fire_t ++;
	fire_t %= 3;
	if(fire_t == 2)
		addFire(-0.75*Math.random(), -0.2*(Math.random()+0.2), 1+Math.random()/0.8, pos.x-10, pos.y + h_i/3, Math.random()/2, Math.random()/2,(Math.random()-0.5)*360, (Math.random()-0.5),1);
	if(fire_t == 1){
		addFire(-0.2*Math.random(), -0.3*(Math.random()+0.2), 1+Math.random()/5, pos.x+w_i-20, pos.y + 8, Math.random()/2, Math.random()/2,(Math.random()-0.5)*360, (Math.random()-0.5)/2,0.3);
		addSmoke(-0.2*Math.random(), -0.3*(Math.random()+0.2), 1+Math.random()/0.8, pos.x+w_i-20, pos.y + 8, Math.random()/2, Math.random()/2,(Math.random()-0.5)*360, (Math.random()-0.5)/2,0.3);
	}
	//add smoke
	//for(p_index = 0;p_index < 2;++p_index )
		addSmoke(-1.5*Math.random(), -0.4*(Math.random()+0.2), 1+Math.random()*1.5, pos.x-10, pos.y + h_i/3, Math.random()/2, Math.random()/2,(Math.random()-0.5)*360, (Math.random()-0.5),1);
		//lance flame
	
		
	if(anim.duree != 'Infinity'){
		
		anim.duree -= fpsInv;
		if(anim.duree <= 0){
			g_y_dec = 0;
			add_anim_classic();
		}
	}
	
}
var g_y_dec = 0;
function drawPersoClassic(){
	
	 g_y_dec = Math.sin(time/speed*1.5)*h_i/6;

	return {
		x:perso_adv,
		y:y_dec + perso_pos + g_y_dec - h_i/3,
		rot : 0};
}

function drawPersoGlisse(){
	
	g_y_dec = Math.sin(anim.options.y)*h_i/4;
	var rot = 30*Math.sin(anim.options.y/1.5)
	
	anim.options.y += fpsInv*5;
	
	return {
		x:perso_adv,
		y:y_dec + perso_pos + g_y_dec - h_i/3,
		rot : rot};	
}

var teddy_fire = false;
var teddy_fire_proba = fps*0.4;

function teddyLaunchFire(x,y){
	var proba = Math.round(Math.random() * teddy_fire_proba);
	if(proba < teddy_fire_proba)
		return;
	for(i_fire = 0; i_fire < 5; ++i_fire)
		addFire(-5*(Math.random()+0.5), 0.2*(Math.random()-0.5), 2+Math.random()*1.3, x, y, 0.2+Math.random()/2,
			(Math.random()-0.5),(Math.random()-0.5)*360, (Math.random()-0.5)/2,1, DEAD_OBJ_PLAYER);
}

var anim = {
	type  : null,
	duree : 0,
	options : null
}

function end(){
	run = false;
	stopMusic();
	var score = Math.round(distance/10) + bonus;
	
	jQuery('#score').html(score);
	

	sendRest('scores/'+name_glob+'/'+score, PUT, function(data){
		json = jQuery.parseJSON(data);
		if(json.hasOwnProperty('error'))
			showError(json.error);
		
		selectScreen('end');
	});
	
}

var teddy_pv 			= 0;
var teddy_y_objectif 	= 0;
var teddy_y 			= 0;
var teddy_x     		= 0;
var teddy_x_objectif	= 0;

var teddy_proba 		= 2000;
//var teddy_proba 		= 1;

function popTeddy(){
	if(teddy_pv >= 0)
		return;
	var proba = Math.ceil(teddy_proba * Math.random());
	if(proba == teddy_proba){
		teddy_pv 	= 100;
		teddy_x 	= w_i*(w_g+2);
		teddy_x_objectif = w_i*w_g;
		teddy_fire = false;
	}
}

function stopMusic(){
	jQuery('#sound_eternal_war').get(0).pause();
	jQuery('#sound_eternal_war').get(0).currentTime=0;
}

function pauseMusic(){
	jQuery('#sound_eternal_war').get(0).pause();
}

function playMusic(){
	jQuery('#sound_eternal_war').get(0).play();
}

function drawInfos(){
	jQuery('#game').drawRect({
		fillStyle: "#fff",
		x: 0, y: 0,
		width: cst_dev,
		height: y_dec,
		fromCenter: false
	});
	
	jQuery('#game').drawText({
		fillStyle: "#000",
		strokeWidth: 0,
		x: 10, y: 10,
		font: "16pt Verdana, sans-serif",
		text: "Distance : "+(Math.round(distance/100)/10)+"m",
		fromCenter: false
	});
	jQuery('#game').drawText({
		fillStyle: "#000",
		strokeWidth: 0,
		x: 10, y: 40,
		font: "16pt Verdana, sans-serif",
		text: "Vitesse : "+(Math.round(speed/fps)/10)+"m/s",
		fromCenter: false
	});
	jQuery('#game').drawText({
		fillStyle: "#000",
		strokeWidth: 0,
		x: 300, y: 10,
		font: "16pt Verdana, sans-serif",
		text: "Alcoolémie : "+alco,
		fromCenter: false
	});
}

var CLASSIC = 1;
var GLISSE = 0;

function add_anim(type, duree){
	if(type == GLISSE)
		add_anim_glisse(duree);
	else{
		anim.type  = type;
		anim.duree = duree;	
	}
}

function add_anim_glisse(duree){
	anim.type  = GLISSE;
	anim.duree = duree;	
	anim.options = {y:0};
}

function add_anim_classic(){
	anim.type  = CLASSIC;
	anim.duree ='Infinity';
}



var particules = [];
var SMOKE = 'smoke';
var FIRE = 'fire';


var DEAD_NOT		= 0;
var DEAD_PLAYER 	= 1;
var DEAD_OTHER 		= 2;
var DEAD_TEDDY 		= 3;
var DEAD_TEDDY_OBJ 	= 4;
var DEAD_OBJ 		= 5;
var DEAD_ALL 		= 6;
var DEAD_OBJ_PLAYER = 7;

function addSmoke(v_x, v_y, life, x_orig, y_orig, v_x_p, v_y_p, rot, v_rot, scale, dead){
	if(dead == undefined)
		dead = DEAD_NOT;
	particules.push({
		type 	: SMOKE,
		life 	: life,
		life_b  : life,
		v_x  	: v_x,
		v_y  	: v_y,
		v_rot   : v_rot,
		v_x_p  	: v_x_p,
		v_y_p  	: v_y_p,
		x    	: x_orig,
		y    	: y_orig,
		rot		: rot,
		scale	: scale,
		dead	: dead
	});
}

function addFire(v_x, v_y, life, x_orig, y_orig, v_x_p, v_y_p, rot, v_rot, scale, dead){
	if(dead == undefined)
		dead = DEAD_NOT;
	particules.push({
		type 	: FIRE,
		life 	: life,
		life_b  : life,
		v_x  	: v_x,
		v_y  	: v_y,
		v_rot   : v_rot,
		v_x_p  	: v_x_p,
		v_y_p  	: v_y_p,
		x    	: x_orig,
		y    	: y_orig,
		rot		: rot,
		scale	: scale,
		dead	: dead
	});
}

function play(){
	playMusic();
	run = true;
	update();
}

function pause(){
	run = false;
	pauseMusic();
	jQuery('#game').drawRect({
		fillStyle: "#000",
		x: 0, y: 0,
		opacity : 0.55,
		width: w_i*w_g,
		height: h_i*h_g+y_dec,
		fromCenter: false
	})
	.drawText({
		fillStyle: '#fff',
		strokeWidth: 0,
		x: 300, y: h_i*h_g/2-22.5 + y_dec,
		font: '45pt Helvetica Neue, Helvetica, Arial, sans-serif',
		text: 'Pause',
		fromCenter: false
	});
}

//Attachement des API
game.launchGame = launchGame;
game.stop = function (){
	run = false;
	stopMusic();
};

game.pause = pause;

game.play = play;

})();


