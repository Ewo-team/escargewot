

function selectScreen(screen){
	jQuery('#co_form').hide();
	jQuery('#inscr_form').hide();
	
	switch(screen){
		case 'inscr': //inscription
			jQuery('#inscr_form').show();
			break;
		default: // connexion
			jQuery('#co_form').show();
	}
}
