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
$config['bdd']['loc']['tbl']  = '';

if(DEBUG){
	error_reporting(-1);
}
