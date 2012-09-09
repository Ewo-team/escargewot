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
	'life'	: 'imgs/life.png',
	'water'	: 'imgs/water.png',
	'vodka'	: 'imgs/vodka.png',
	'life'	: 'imgs/life.png'
};

//utilisation des ressources chargées
function _(res){
	return jQuery('#'+pref+res)[0];
}

var milestone_up = 1000;

//vitesse de base
var speed ; // px par seconde
var score ;
var life ;
var distance;

var cases = [];
var objs = [];

var oil_prob = 20;
var vodka_prob = 28;
var water_prob = 40;
var life_prob = 1000;

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
		var life  = Math.floor(Math.random()*life_prob);
		
		if(life == 0){
			objs[index].push('life');
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

var bonus_up = 10;

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
			if(key  == 40 && perso_pos < h_g - 1 && !down[0]){ //bas
				perso_pos++;
				down[0] = true;
			}
			if(key  == 38 && perso_pos > 0 && !down[1]){//haut
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
var max_life = 6;
var speed_up = 1.4;
var speed_down = 0.8;
var speed_up_nb = 0;

var fpsInv = 1/fps;

function launchGame(){
	speed = 50;
	distance = 0;
	life = 3;
	perso_pos = Math.ceil(h_g / 2) - 1;
	perso_adv = 0;
	
	run = true,
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
	//Draw perso
	drawPerso();
	
	if(distance - last_milestone > milestone_up*(1+speed_up_nb/2)){
		speed *= speed_up;
		
		speed_up_nb++;
		last_milestone  = distance;
		console.log('up');
	}
	if(run)
		mainTimeout = setTimeout(update, fpsInv);
}

var run = false;

function handleColision(){
	var ground = cases[perso_adv][perso_pos];
	
	if(ground == 'oil'){
		life--;
		cases[perso_adv][perso_pos] = 'road';
		add_anim(GLISSE, 5);
	}
	var obj = objs[perso_adv][perso_pos];
	if(obj == 'water' && speed > 30){
		speed *= speed_down;
		speed_up_nb--;
	}
	else if(obj == 'life'){
		if(life < max_life)
			++life;
		else
			bonus += bonus_up* 3;
	}
	else if(obj == 'vodka'){
		bonus += bonus_up;
	}
	
	objs[perso_adv][perso_pos] = null;
	
	if(life <= 0)
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

var perso_pos = Math.ceil(h_g / 2) - 1;
var perso_adv = 0;
function drawPerso(){
	if(anim.type == null){
		jQuery('#game').drawImage({
			source: _('perso'),
			x: perso_adv*w_i,
			y: y_dec + perso_pos*h_i - h_i/3,
			fromCenter: false
		});
	}
	else{
		if(anim.type == GLISSE){
			drawPersoGlisse();
		}
		else if(anim.type == CLASSIC){
			drawPersoClassic();
		}
		if(anim.duree != 'Infinity'){
			anim.duree -= fpsInv;
			if(anim.duree <= 0){
				add_anim_classic();
			}
		}
	}
}

function drawPersoClassic(){
	
	var g_y_dec = Math.sin(distance/speed*1.5)*h_i/6;
	
	jQuery('#game').drawImage({
		source: _('perso'),
		x: perso_adv*w_i,
		y: y_dec + perso_pos*h_i + g_y_dec - h_i/3,
		fromCenter: false
	});
}

function drawPersoGlisse(){
	
	var g_y_dec = Math.sin(anim.options.y)*h_i/4;
	var rot = 30*Math.sin(anim.options.y*1.5)
	
	jQuery('#game').drawImage({
		source: _('perso'),
		x: perso_adv*w_i,
		y: y_dec + perso_pos*h_i + g_y_dec - h_i/3,
		rotate: rot,
		fromCenter: false
	});
	
	anim.options.y += fpsInv*5;
}

var anim = {
	type  : null,
	duree : 0,
	options : null
}

function end(){
	run = false;
	stopMusic();
	var score = Math.round(distance/100)/10+bonus;
	
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
		text: "bonus : "+bonus,
		fromCenter: false
	});
	
	for(l = 0; l < life;++l){
		jQuery('#game').drawImage({
			source: _('life'),
			x: cst_dev-(l+1)*40-10,
			y: 10,
			fromCenter: false
		});
	}
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
