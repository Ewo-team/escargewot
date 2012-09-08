<?php
/**
 * Petit surcharge de PDO
 * 
 * @author Benjamin Herbomez <benjamin.herbomez@gmail.com>
 */
 

include_once 'exception.php.inc';
 
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
	abstract function test_log($name, $pwd);
}

/**
 * Implémentation locale
 */
class LocalDao extends Dao{
	public function __construct(){
		parent::__construct(BASE_LOCAL);
	}
	

	public function test_log($name, $pwd){
		$pwd = hash('sha256', $pwd);
		
		$query = 'SELECT `pwd` FROM `users` WHERE `name`=:name;';
		$stmt = $this->prepare($query);
		$stmt->execute(array(':name' => $name));
		
		$result = $stmt->fetch(PDO::FETCH_OBJ);
		
		if(isset($result) && $result){
			return $result->pwd == $pwd;
		}
		return false;
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
		$result = $stmt->execute(array(
			':name' => $name,
			':pwd'	=> $pwd	,
			':mail'	=> $mail
		));
		
		if(!$result){
			throw new DaoException($stmt->errorInfo());
		}
	}
}

/**
 * Implémentation sur la base ewo
 */
class EwoDao extends Dao{
	public function __construct(){
		parent::__construct(BASE_EWO);
	}
	
	public function test_log($name, $pwd){
		$query = 'SELECT `passwd` FROM `utilisateurs` WHERE `nom`=:name;';
		
	}
}

