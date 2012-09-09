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
var water_prob = 20;
var beer_prob = 250;

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


function initEvents(){
	if(evt_init)
		return;
	evt_init = true;
	var down = [false, false, false, false];
	jQuery("#game").bind({
		keydown: function(e) {
			var key = e.keyCode;
			if(key  == 40 && perso_pos < h_g - 1 && !down[0] && !anim.type == GLISSE){ //bas
				perso_pos++;
				down[0] = true;
			}
			if(key  == 38 && perso_pos > 0 && !down[1] && !anim.type == GLISSE){//haut
				perso_pos--;
				down[1] = true;
			} 
			if(key  == 37 && perso_adv > 0 && !down[2]){ //gauche
				perso_adv--;
				down[2] = true;
			};
			if(key  == 39 && perso_adv < w_g - 1 && !down[3]){ //droite
				perso_adv++;
				down[3] = true;
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
	speed = 125;
	speed_up_nb = 0;
	distance = 0;
	alco = 20;
	perso_pos = Math.ceil(h_g / 2) - 1;
	perso_adv = 0;
	
	run = true;
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
	distance += speed/fps;
	var x_dec = distance % w_i;
	if(x_dec < l_dec){
		cases = cases.slice(1,cases.lenght);
		objs = objs.slice(1,objs.lenght);
			generate_line();
	}
	
	handleColision();
	l_dec = x_dec;
	//Draw background
	drawBackground(x_dec);
	//Draw infos
	drawInfos();
	//Draw objs
	drawObjs(x_dec);
	//Draw particles
	drawParticles();
	//Draw perso
	drawPerso();
	
	if(distance - last_milestone > milestone_up*(1+speed_up_nb)){
		speed *= speed_up;
		
		speed_up_nb++;
		last_milestone  = distance;
	}
	if(run)
		mainTimeout = setTimeout(update, fpsInv);
}

var run = false;

function handleColision(){
	var ground = cases[perso_adv][perso_pos];
	
	if(ground == 'oil'){
		cases[perso_adv][perso_pos] = 'road';
		add_anim(GLISSE, 5);
	}
	var obj = objs[perso_adv][perso_pos];
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
	
	objs[perso_adv][perso_pos] = null;
	
	if(alco <= 0)
		end();
}


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
			if(img != null)
				jQuery('#game').drawImage({
					source: _(img),
					x: posX,
					y: y_dec + y*h_i - h_i/3 ,
					fromCenter: false
				});
		});
	});
}

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
		
		jQuery('#game').drawImage({
			source		: _(particle.type),
			x			: particle.x,
			y			: particle.y,
			rotate		: particle.rot,
			opacity		: 1- (particle.life_b - particle.life)/particle.life_b,
			fromCenter	: false
		});
	});
}

var perso_pos = Math.ceil(h_g / 2) - 1;
var perso_adv = 0;

var fire_t = 0;

function drawPerso(){
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
	fire_t ++;
	fire_t %= 3;
	if(fire_t == 2)
		addFire(-0.75*Math.random(), -0.2*(Math.random()+0.2), 1+Math.random()/0.8, pos.x, pos.y + h_i/2, Math.random()/2, Math.random()/2,(Math.random()-0.5)*360, (Math.random()-0.5));
	//add smoke
	for(p_index = 0;p_index < 2;++p_index )
		addSmoke(-1.5*Math.random(), -0.4*(Math.random()+0.2), 1+Math.random()*1.5, pos.x, pos.y + h_i/2, Math.random()/2, Math.random()/2,(Math.random()-0.5)*360, (Math.random()-0.5));
	
		
	if(anim.duree != 'Infinity'){
		anim.duree -= fpsInv;
		if(anim.duree <= 0){
			add_anim_classic();
		}
	}
	
}

function drawPersoClassic(){
	
	var g_y_dec = Math.sin(distance/speed*1.5)*h_i/6;
	return {
		x:perso_adv*w_i,
		y:y_dec + perso_pos*h_i + g_y_dec - h_i/3,
		rot : 0};
}

function drawPersoGlisse(){
	
	var g_y_dec = Math.sin(anim.options.y)*h_i/4;
	var rot = 30*Math.sin(anim.options.y/1.5)
	
	anim.options.y += fpsInv*5;
	
	return {
		x:perso_adv*w_i,
		y:y_dec + perso_pos*h_i + g_y_dec - h_i/3,
		rot : rot};
	
	
}

var anim = {
	type  : null,
	duree : 0,
	options : null
}

function end(){
	run = false;
	stopMusic();
	var score = Math.round(distance/100)*10+alco;
	
	jQuery('#score').html(score);
	

	sendRest('scores/'+name_glob+'/'+score, PUT, function(data){
		json = jQuery.parseJSON(data);
		if(json.hasOwnProperty('error'))
			showError(json.error);
		
		selectScreen('end');
	});
	
}

function stopMusic(){
	jQuery('#sound_eternal_war').get(0).pause();
	jQuery('#sound_eternal_war').get(0).currentTime=0;
}

function pauseMusic(){
	jQuery('#sound_eternal_war').get(0).pause();
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


function addSmoke(v_x, v_y, life, x_orig, y_orig, v_x_p, v_y_p, rot, v_rot){
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
		rot		: rot
	});
}

function addFire(v_x, v_y, life, x_orig, y_orig, v_x_p, v_y_p, rot, v_rot){
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
		rot		: rot
	});
}
