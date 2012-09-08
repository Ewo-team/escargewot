
jQuery(window).ready(function(){
	jQuery('#modal').modal('hide');
	jQuery('#co_name').popover();
	
	jQuery('#co_btn').click(function(){log();});
});

function selectScreen(screen){
	jQuery('#co_form').hide();
	jQuery('#inscr_form').hide();
	jQuery('#game').hide();
	jQuery('*[rel="popover"]').popover('hide');
	
	switch(screen){
		case 'inscr': //inscription
			jQuery('#inscr_form').show();
			break;
		case 'game': //jeu
			jQuery('#game').show();
			launchGame();
			break;
		default: // connexion
			jQuery('#co_form').show();
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

var PUT 	= 'PUT';
var GET 	= 'GET';
var POST 	= 'POST';
var DELETE	= 'DELETE';
var methods = [PUT, GET, POST, DELETE];

function sendRest(url, method, callBack){
	if(jQuery.inArray(method, methods)){
		jQuery.ajax({
			url 	: 'rest/?'+url,
			method	: method,
			success	: function(data){
				callBack(data);
			}
		});
	}
}

var user_glob = undefined;
var pswd_glob = undefined;

function log(){
	
	/*var name = jQuery('#co_name').val();
	var pwd  = jQuery('#co_pwd').val();
	
	sendRest('user/'+name+'/'+pwd, GET, function(data){
		json = jQuery.parseJSON(data);
		if(json != null && json.exists){
			name_glob = name;
			pswd_glob = pwd;*/
			selectScreen('game');
		/*}
		else{
			showError('Erreur de connexion');
		}
	});*/
}

function inscription(){
	var name 		= jQuery('#inscr_name').val();
	var pwd  		= jQuery('#inscr_pwd').val();
	var pwd_conf	= jQuery('#inscr_pwd_conf').val();
	var mail		= jQuery('#inscr_mail').val();
	
	if(pwd != pwd_conf){
		showModal('Vos deux mots de passe sont différents');
		return;
	}
	
	sendRest('user/'+name+'/'+pwd, GET, function(data){
		json = jQuery.parseJSON(data);
		if(json != null && json.exists){
			//TODO : launch game
			console.log(json);
		}
		else{
			showModal('Erreur de connexion');
		}
	});
}
