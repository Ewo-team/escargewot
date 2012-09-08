<link rel="stylesheet"href="css/bootstrap/bootstrap.min.css" />
<link rel="stylesheet" href="css/game.css" />

<div id="error">
</div>

<form class="form-horizontal" onsubmit="return false;" id="co_form">
	<fieldset class="fieldset">
		<legend>Connexion <img src="imgs/hr_escargot.png" class="pull-right"/></legend>
		
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Nom d'utilisateur</div>
			<div class="span4"><input type="text"  placeholder="ex : Escargewotik" id="co_name" 
			rel="popover" data-content="Vous pouvez utiliser votre compte ewo (ou pas)" data-original-title="Information"/></div>
			<div class="span3"></div>
		</div>
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Mot de passe</div>
			<div class="span4"><input type="password"  placeholder="ex : bi&egrave;re" id="co_pwd" /></div>
		</div>
		<br />
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">
				<a href="">Mot de passe oubli&eacute;</a> |
				<a href="#" onclick="selectScreen('inscr'); return false;">Inscription</a>
			</div>
			<div class="span2"><button class="btn" id="co_btn">Connexion</button></div>
		</div>
		
	</fieldset>
</form>

<form class="form-horizontal" onsubmit="return false;" id="inscr_form">
	<fieldset class="fieldset">
		<legend>Inscription <img src="imgs/hr_escargot.png" class="pull-right"/></legend>
		
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Nom d'utilisateur</div>
			<div class="span4"><input type="text"  placeholder="ex : Escargewotik" id="inscr_name" /></div>
		</div>
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Mot de passe</div>
			<div class="span4"><input type="password"  placeholder="ex : bi&egrave;re" id="inscr_pwd" /></div>
		</div>
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Mot de passe</div>
			<div class="span4"><input type="password" id="inscr_pwd_conf" /></div>
		</div>
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">mail</div>
			<div class="span4"><input type="text"  placeholder="ex : bi&egrave;re" id="inscr_mail" /></div>
		</div>
		
		<div class="row-fluid">
			<div class="span5">&nbsp;</div>
			<div class="span2"><button class="btn">Inscription</button></div>
		</div>
		<div class="row-fluid">
			<div class="span3">
				<a href="#" onclick="selectScreen('co'); return false;">&lt;&lt; retour</a>
			</div>
		</div>
		
	</fieldset>
</form>

<div id="end" class="well hide">
	<p>Vous &ecirc;tes en rade d'alcool</p>
	<p>Votre score : <span id='score'></span></p>
	<a href="" onclick="selectScreen('game');return false;">Recommencer</a>
</div>

<canvas id="game" width="800px" height="450px"  tabindex="1"></canvas>



<div class="modal hide fade" id="modal">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	</div>
	<div class="modal-body">
	</div>
		<div class="modal-footer">
		<button class="btn" data-dismiss="modal" >Close</button>
	</div>
</div>

<audio controls="controls" id="sound_eternal_war" class="hide" loop="true" preload="true" autoplay="false">
  <source src="sound/eternal_war.mp3" type="audio/mp3" />
  Your browser does not support the audio tag.
</audio>

<script src="js/jquery/jquery-1.8.1.min.js"></script>
<script src="js/jquery/jcanvas.min.js"></script>
<script src="js/bootstrap/bootstrap.min.js"></script>
<script src="js/master.js"></script>
<script src="js/game.js"></script>
