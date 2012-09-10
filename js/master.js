
jQuery(window).ready(function(){
	jQuery('#modal').modal('hide');
	jQuery('#co_name').popover();
	
	jQuery('#co_btn').click(function(){
		log();
	});
	
});

function selectScreen(screen){
	jQuery('#co_form').hide();
	jQuery('#inscr_form').hide();
	jQuery('#game').hide();
	jQuery('#scores').hide();
	jQuery('#about').hide();
	jQuery('#credit').hide();
	jQuery('#end').hide();
	jQuery('*[rel="popover"]').popover('hide');
	
	switch(screen){
		case 'inscr': //inscription
			jQuery('#inscr_form').show();
			break;
		case 'end': //fin
			jQuery('#end').show();
			break;
		case 'about'://About
			jQuery('#about').show();
			break;
		case 'credit'://credit
			jQuery('#credit').show();
			break;
		case 'game': //jeu
			jQuery('#game').show();
			launchGame();
			break;
		case 'scores':
			jQuery('#scores').show();
			loadScores();
			break;
		default: // connexion
			if(name_glob == undefined)
				jQuery('#co_form').show();
			else{
				jQuery('#game').show();
				launchGame();
			}
	}
}

function showModal(msg){
	jQuery('#modal .modal-body').html(msg);
	jQuery('#modal').modal('show');
}

function showError(msg){
	jQuery('#error').append(
	'<div class="alert alert-error fade in" id="error">'+
	'<button type="button" class="close" data-dismiss="alert">&times;</button>'+
	'<p>'+msg+'</p>'+
	'</div>');
	jQuery('#error .alert').alert();
}

function showNotif(msg){
	jQuery('#error').append(
	'<div class="alert alert-success fade in" id="error">'+
	'<button type="button" class="close" data-dismiss="alert">&times;</button>'+
	'<p>'+msg+'</p>'+
	'</div>');
	jQuery('#error .alert').alert();
}

var PUT 	= 'PUT';
var GET 	= 'GET';
var POST 	= 'POST';
var DELETE	= 'DELETE';
var methods = [PUT, GET, POST, DELETE];

function sendRest(url, method, callBack){
	if(jQuery.inArray(method, methods) >= 0){
		jQuery.ajax({
			url 	: 'rest/index.php?'+url,
			type	: method,
			cache	: false,
			success	: function(data){
				callBack(data);
			}
		});
	}
}

var name_glob = undefined;
var pswd_glob = undefined;

function log(){
	
	var name = jQuery('#co_name').val();
	var pwd  = jQuery('#co_pwd').val();
	
	sendRest('user/'+name+'/'+pwd, GET, function(data){
		json = jQuery.parseJSON(data);
		if(json != null && json.exists){
			name_glob = name;
			pswd_glob = pwd;
			selectScreen('game');
		}
		else{
			showError('Erreur de connexion');
		}
	});
}

function inscription(){
	var name 		= jQuery('#inscr_name').val();
	var pwd  		= jQuery('#inscr_pwd').val();
	var pwd_conf	= jQuery('#inscr_pwd_conf').val();
	var mail		= jQuery('#inscr_mail').val();
	
	if(pwd != pwd_conf){
		showError('Vos deux mots de passe sont diff&eacute;rents');
		return;
	}
	
	sendRest('user/'+name+'/'+pwd+'/'+mail, PUT, function(data){
		json = jQuery.parseJSON(data);
		if(json != null && json.add){
			selectScreen('co');
			showNotif('Vous &ecirc;tes inscrit');
		}
		else{
			showError(json.error);
		}
	});
}

var scores_page = 0;

function loadScores(page){
	
	if(page == undefined || page < 0)
		page = 0;
	
		
	sendRest('scores/'+page, GET, function(data){
		json = jQuery.parseJSON(data);
		if(json != null && !json.hasOwnProperty('error')){
		jQuery('#scores tbody').html('');
			jQuery.each(json, function(index, value){
				jQuery('#scores tbody').append('<tr><td>'+value.score+'</td><td>'+value.name+'</td></tr>');
			});
			scores_page = page;
		}
		else{
			if(json.error == null)
				showError('Plus de r&eacute;sultat');
			else
				showError(json.error);
		}
	});
}

function scores_prev(){
	loadScores(scores_page - 1);
}

function scores_next(){
	loadScores(scores_page + 1);
}

function remove(tbl, index){
	return jQuery.grep(tbl, function(elem, i){
			return i != index;
		});
}
