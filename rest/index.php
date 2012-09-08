<?php
/**
 * Controler REST
 * 
 * @author Benjamin Herbomez <benjamin.herbomez@gmail.com>
 */


include 'app.php.inc';

function inscr($name, $mail, $password){
	
}

function add_score($name, $password){
	
}

function get_score(){
	
}

//Inclusion de l'outil de gestion des requêtes

$rest['user'] = array(
	PUT	=> 'inscr'
);

$rest['score'] = array(
	PUT	=> 'add_score',
	GET	=> 'get_score'
);

//call rest controller
process_rest($rest);

