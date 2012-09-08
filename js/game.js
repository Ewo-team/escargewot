jQuery(window).ready(function(){
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
var ressources = {
	'road'	: 'imgs/road.png',
	'oil' 	: 'imgs/oil.png',
	'perso'	: 'imgs/escargot1.png',
	'life'	: 'imgs/life.png'
};

function _(res){
	return jQuery('#'+pref+res)[0];
}

var milestone_up = 2000;

//vitesse de base
var speed = 30; // px par seconde
var score = 0;
var life  = 3;
var distance = 0;

var cases = [];

var oil_prob = 20;

function generate_line(index){
	if(index == undefined){
		cases.push([]);
		index = cases.length - 1;
	}
	else{
		cases[index] =  [];
	}
	
	for(j = 0; j < h_g;++j){
		var oil = Math.floor(Math.random()*oil_prob);
		if(oil == 0)
			cases[index].push('oil');
		else
			cases[index].push('road');
	}
	//console.log(cases);
}

function init(){
	//"free_first" premières lignes libres
	for(i = 0; i < free_first;++i){
		cases[i] = [];
		for(j = 0; j < h_g;++j){
			cases[i].push('road');
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

function initEvents(){
	jQuery("#game").bind({
		keydown: function(e) {
			var key = e.keyCode;
			if(key  == 40){ //bas
				if(perso_pos < h_g - 1)
					perso_pos++;
			}
			if(key  == 38){//haut
				if(perso_pos > 0)
					perso_pos--;
			} 
			if(key  == 39); //gauche
			if(key  == 37); //droite

		},

		focusin: function(e) {
			jQuery(e.currentTarget).addClass("selected");
		},

		focusout: function(e) {
			jQuery(e.currentTarget).removeClass("selected");
		}
	});
	jQuery("#game").focus();
}

var speed_up = 10;
var speed_up_nb = 0;

var fpsInv = 1/fps;

function launchGame(){
	init();
	initEvents();
	update();
}

var last_milestone = 0;

var l_dec = 0;
function update(){
	distance += speed/fps;
	var x_dec = distance % w_i;
	if(x_dec < l_dec){
		cases = cases.slice(1,cases.lenght);
			generate_line();
	}
	l_dec = x_dec;
	//Draw background
	drawBackground(x_dec);
	//Draw perso
	drawPerso();
	//Draw infos
	drawInfos();
	
	if(distance - last_milestone > milestone_up*(1+speed_up/2)){
		speed += speed_up;
		speed_up_nb++;
		last_milestone  = distance;
		console.log('up');
	}
	mainTimeout = setTimeout(update, fpsInv);
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

var perso_pos = Math.ceil(h_g / 2) - 1;
function drawPerso(){
	jQuery('#game').drawImage({
		source: _('perso'),
		x: 0,
		y: y_dec + perso_pos*h_i,
		fromCenter: false
	});
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
	
	for(l = 0; l < life;++l){
		jQuery('#game').drawImage({
			source: _('life'),
			x: cst_dev-(l+1)*40-10,
			y: 10,
			fromCenter: false
		});
	}
}

