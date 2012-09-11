<?php
	echo addCss('bootstrap/bootstrap.min').addCss('game');
?>

<div id="error">
</div>

<form class="form-horizontal" onsubmit="return false;" id="co_form">
	<fieldset class="fieldset">
		<legend>Connexion <img src="imgs/hr_escargot.png" class="pull-right"/></legend>
		
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Nom d'utilisateur</div>
			<div class="span4"><input type="text"  placeholder="ex : Escargotik" id="co_name" 
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
			<div class="span4"><input type="text"  placeholder="ex : Escargotik" id="inscr_name" /></div>
		</div>
		<br />
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Mot de passe</div>
			<div class="span4"><input type="password"  placeholder="ex : bi&egrave;re" id="inscr_pwd" /></div>
		</div>
		<br />
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">Confirmation mot de passe</div>
			<div class="span4"><input type="password" id="inscr_pwd_conf" /></div>
		</div>
		<br />
		<div class="row-fluid">
			<div class="span1">&nbsp;</div>
			<div class="span4">mail</div>
			<div class="span4"><input type="text"  placeholder="ex : sexy_angelle@ewo.bouzou" id="inscr_mail" /></div>
		</div>
		<br />
		<div class="row-fluid">
			<div class="span5">&nbsp;</div>
			<div class="span2"><button class="btn" onclick="inscription();">Inscription</button></div>
		</div>
		<br />
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

<div id="scores" class="hide">
	
	<table class="table table-striped table-bordered">
		<thead>
			<tr>
				<td colspan="2">
					<ul class="pager">
						<li class="previous">
							<a href="" onclick="scores_prev();return false;">&larr;</a>
						</li>
						<li class="next">
							<a href="" onclick="scores_next();return false;">&rarr;</a>
						</li>
					</ul>
				</td>
			</tr>
			<tr>
				<th>Score</th>
				<th>Nom</th>
			</tr>
		</thead>
		<tbody></tbody>
	</table>
</div>

<div id="about" class="well hide">
	<h3>Foire aux questions</h3>
	<dl>
		<dt>01. WTF, c'est quoi ça ?</dt>
			<dd>Simple, un jeu de course d'escargot alcoolique</dd>
		<dt>02. Comment ça marche ?</dt>
			<dd>Le but est de maintenir son escargot en vie le plus longtemps en vie/conscience/course</dd>
		<dt>03. Comment je fais pour qu'il crève pas ?</dt>
			<dd>Il faut simplement lui donner assez d'alcool, en attrapant des bouteilles</dd>
		<dt>04. Et les bouteilles d'eau ?</dt>
			<dd>L'eau est toxique pour ces braves bestiolles. Ca les rend sobre.</dd>
		<dt>05. Les tâches d'huile au sol c'est quoi ?</dt>
			<dd>Rien de sexuel, juste de l'huile de moteur. En roulant/bavant dessus vous perdez le contrôle</dd>
		<dt>06. Mais c'est n'importe quoi !</dt>
			<dd>Oui, on sait ...</dd>
		<dt>07. Pas de suprise ?</dt>
			<dd>Non, on oserait pas ]:D</dd>
		<dt>08. On en a as encore parlé, mais les contrôles c'est quoi ?</dt>
			<dd>Simple : les flèches clavier pour bouger, la barre d'espace pour le lance-flammes</dd>
		<dt>09. Lance-flammes ?</dt>
			<dd>Ouais, c'est assez fun, ça crâme tout devant soit. Par contre le carburant c'est le sang de votre escargot, alors attention à votre taux d'alcoolémie.</dd>
	</dl>
</div>

<div id="credit" class="well hide">
	<h3>Liste des responsables</h3>
	<dl	>
		<dt>Idée de base (RP)</dt>
		<dd>les ptis gas de la <abbr title="Daemon War Elit" class="initialism">DWE</abbr></dd>
		
		<dt>Idée de base (Jeu d'arcade)</dt>
		<dd>Elestel (Benjamin Herbomez)</dd>
		
		<dt>Images</dt>
		<dd>Francis-</dd>
		
		<dt>Musique</dt>
		<dd>"Eternal War" de Mind Out</dd>
		
		<dt>Code</dt>
		<dd>Elestel</dd>
	</dl>
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

<div style="text-align: center">
<a href="" onclick="selectScreen('co');return false;">Jouer</a> |
<a href="" onclick="selectScreen('scores');return false;">Voir les scores</a> | 
<a href="" onclick="selectScreen('about');return false;"><abbr title="Foire Aux Questions" class="initialism">FAQ</abbr></a> |
<a href="" onclick="selectScreen('credit');return false;">Crédits</a>
</div>

<audio controls="controls" id="sound_eternal_war" class="hide" loop preload preload="auto">
  <source src="sound/eternal_war.mp3" />
  <source src="sound/eternal_war.ogg" />
  Your browser does not support the audio tag.
</audio>

<?php
	echo addJs('jquery/jquery-1.8.1.min')
		.addJs('jquery/jcanvas.min')
		.addJs('bootstrap/bootstrap.min')
		.addJs('master')
		.addJs('game');
?>
