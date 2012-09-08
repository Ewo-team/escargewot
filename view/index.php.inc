<html>
	<head>
		<title>Escargewot</title>
		<link rel="stylesheet" href="css/index.css" />
	</head>
	<body>
		<div id="body" class="hero-unit">
			<h1>Escargewot</h1>
			<div id="game_box" class="well">
			<?php
				include 'game.php';
			?>
			</div>
			<?php
			if(DEBUG){
				include 'view/mock.php.inc';
			}
			?>
		</div>
	</body>
</html>
