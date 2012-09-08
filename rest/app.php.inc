<?php
/**
 * Gestion des appels REST
 * 
 * @author Benjamin Herbomez <benjamin.herbomez@gmail.com>
 */
 
include 'bdd.php.inc';


 define('PUT'		, 'PUT');
 define('POST'		, 'POST');
 define('DELETE'	, 'DELETE');
 define('GET'		, 'GET');
 
 
 
 function process_rest($rest){
	 
	$params = array();
	foreach($_GET as $key => $value){
		$params = explode('/',$key);
		break;
	}
	$method = $_SERVER['REQUEST_METHOD'];

	//Si il y a les params
	if(count($params) == 0)
		die();

	//Detect controler
	$controller = $params[0];
	if(!array_key_exists($controller, $rest) || !array_key_exists($method, $rest[$controller]))
		die();

	$params = array_slice($params, 1, count($params));
	call_user_func_array($rest[$controller][$method], $params);
 }
