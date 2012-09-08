<?php
/**
 * Fonctions de gestion des utilisateurs
 * 
 * @author Benjamin Herbomez <benjamin.herbomez@gmail.com>
 */
 
function inscr($name, $mail, $password){
	$result = array();
	
	$sql = new LocalDao();
	try{
		$sql->addUser($name, $mail, $password);
		$result['add'] = true;
		die('{"add":"true"}');
	}
	catch(DaoException $exception){
		$result['add'] = false;
		$errors = $exception->getErroArray();
		
		if($errors[0] == 23000){ //Erreur insert ou update
			$result['error'] = $name.' ou '.$mail.' sont déjà pris';	
		}
		else{ // on affiche le message par defaut
			$result['error'] = $errors[2];
		}
	}
	
	die(json_encode($result));
}

function test_log($user, $mdp){
	$result = array();
	$result['exists'] = false;
	
	$sql = new LocalDao();
	if($sql->test_log($user, $mdp))
		$result['exists'] = true;
	else{
		$sql = new EwoDao();
		if($sql->test_log($user, $mdp))
			$result['exists'] = true;
	}
	
	die(json_encode($result));
}
