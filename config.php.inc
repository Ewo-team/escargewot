<?php
/**
 * Configuration du jeu
 * 
 * @author Benjamin Herbomez <benjamin.herbomez@gmail.com>
 */

define('DEBUG', false);

$config['root'] = './';


$config['bdd']['loc']['host'] = 'localhost';
$config['bdd']['loc']['user'] = '';
$config['bdd']['loc']['pwd']  = '';
$config['bdd']['loc']['tbl']  = 'escargewo';

if(DEBUG){
	error_reporting(-1);
}

$parts = Explode('/', $_SERVER["PHP_SELF"]);
define('VERSION', filemtime($parts[count($parts) - 1]));


function addJs($link){
	echo '<script src="js/'.$link.'.js?v='.VERSION.'"></script>';
}

function addCss($link){
	echo '<link rel="stylesheet" href="css/'.$link.'.css?v='.VERSION.'" />';
}
