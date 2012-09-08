<?php
/**
 * Petit surcharge de PDO
 * 
 * @author Benjamin Herbomez <benjamin.herbomez@gmail.com>
 */
 
 
 //Quelques constantes pour definir sur quelle base on se connecte
 define('BASE_EWO'	, 'ewo');
 define('BASE_LOCAL', 'loc');


/**
 * Classe d'accès aux données
 */
abstract class Dao extends PDO{
	
	public function __construct($base){
		global $config;
		parent::__construct('mysql:host='.$config['bdd'][$base]['host'].';port=3306;dbname='.$config['bdd'][$base]['tbl'], $config['bdd'][$base]['user'], $config['bdd'][$base]['pwd']);
	}
	
	/**
	 * Tester les user / mdp de quelqu'un
	 */
	abstract function test_log($user, $pwd);
}

/**
 * Implémentation locale
 */
class LocalDao extends Dao{
	public function __construct(){
		parent::__construct(BASE_LOCAL);
	}
	

	public function test_log($user, $pwd){
		$query = 'SELECT `pwd` FROM `users` WHERE `name`=:name;';
	}
	
	/**
	 * Ajout d'un utilisateur
	 */
	public function addUser($name, $pwd, $mail){
		$pwd = hash('sha256', $pwd);
		$query = '
		INSERT INTO `users`
		(`name`, `pwd`, `mail`)
		VALUES (:name, :pwd, :mail)';
		
		$stmt = $this->prepare($query);
		$stmt->execute(array(
			':name' => $name,
			':pwd'	=> $pwd	,
			':mail'	=> $mail
		));
	}
}

/**
 * Implémentation sur la base ewo
 */
class EwoDao extends Dao{
	public function __construct(){
		parent::__construct(BASE_EWO);
	}
	
	public function test_log($user, $pwd){
		$query = 'SELECT `passwd` FROM `utilisateurs` WHERE `nom`=:name;';
		
	}
}

