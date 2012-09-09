<html>
	<head>
		<title>Escargewot</title>
		<link rel="stylesheet" href="css/index.css" />
		<link rel="shortcut icon" type="image/png" href="favicon.png" />
	</head>
	<body>
		<div id="body" class="well">
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
