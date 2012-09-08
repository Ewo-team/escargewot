<?php
/**
 * Exception qui transporte un array
 * 
 * @author Benjamin Herbomez <benjamin.herbomez@gmail.com>
 */
 
class DaoException extends Exception{
	private $_errorArray = array();
	
	public function __construct($param){
		if(is_array($param)){
			parent::__construct();
			$this->_errorArray = $param;
		}
		else{
			parent::__construct($param);
		}
	}
	
	
	public function getErroArray(){
		return $this->_errorArray;
	}
}
