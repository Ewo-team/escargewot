<?php
/**
 * Fonctions de gestion des utilisateurs
 * 
 * @author Benjamin Herbomez <benjamin.herbomez@gmail.com>
 */
 
function inscr($name, $mail, $password){
	$sql = new LocalDao();
	$sql->addUser($name, $mail, $password);
	die('{add:true}');
}

function test_log($user, $mdp){
	$sql = new LocalDao();
	if($sql->test_log($user, $mdp))
		die('{"exists":"true"}');
	$sql->close();
	
	$sql = new EwoDao();
	if($sql->test_log($user, $mdp))
		die('{"exists":"true"}');	
	$sql->close();
	die('{"exists":"false"}');
}
