<?php
/**
 * Fonctions de gestion des utilisateurs
 * 
 * @author Benjamin Herbomez <benjamin.herbomez@gmail.com>
 */
 
function add_score($name, $score){
	$result = array();
	
	$sql = new LocalDao();
	try{
		$sql->add_score($name, $score);
		$result['add'] = true;
	}
	catch(DaoException $exception){
		$result['add'] = false;
		$errors = $exception->getErroArray();
		$result['error'] = $errors[2];

	}
	
	die(json_encode($result));
}

function get_score($page){

	$result = array();
	
	$sql = new LocalDao();
	try{
		$result = $sql->get_score($page);
	}
	catch(DaoException $exception){
		$errors = $exception->getErroArray();
		$result['error'] = $errors[2];
	}
	die(json_encode($result));
}

