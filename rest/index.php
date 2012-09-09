<?php
/**
 * Controler REST
 * 
 * @author Benjamin Herbomez <benjamin.herbomez@gmail.com>
 */


include 'app.php.inc';
include 'user.php.inc';
include 'score.php.inc';


//Inclusion de l'outil de gestion des requêtes

$rest['user'] = array(
	PUT	=> 'inscr',
	GET => 'test_log'
);

$rest['scores'] = array(
	PUT	=> 'add_score',
	GET	=> 'get_score'
);

//call rest controller
process_rest($rest);

