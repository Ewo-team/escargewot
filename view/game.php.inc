<link rel="stylesheet"href="css/bootstrap/bootstrap.min.css" />
<link rel="stylesheet" href="css/game.css" />


<form class="form-horizontal" onsubmit="return false;" id="co_form">
	<fieldset class="fieldset">
		<legend>Connexion <img src="imgs/hr_escargot.png" class="pull-right"/></legend>
		
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Nom d'utilisateur</div>
			<div class="span4"><input type="text"  placeholder="ex : Escargewotik" id="co_name" /></div>
		</div>
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Mot de passe</div>
			<div class="span4"><input type="text"  placeholder="ex : bi&egrave;re" id="co_pwd" /></div>
		</div>
		
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">
				<a href="">Mot de passe oubli&eacute;</a> |
				<a href="#" onclick="selectScreen('inscr'); return false;">Inscription</a>
			</div>
			<div class="span2"><button class="btn">Connexion</button></div>
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
			<div class="span4"><input type="text"  placeholder="ex : bi&egrave;re" id="pinscr_wd" /></div>
		</div>
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Mot de passe</div>
			<div class="span4"><input type="text" id="inscr_pwd_conf" /></div>
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

<canvas id="game" width="800px" height="500"></canvas>

<script src="js/jquery/jquery-1.8.1.min.js"></script>
<script src="js/bootstrap/bootstrap.min.js"></script>
<script src="js/master.js"></script>
