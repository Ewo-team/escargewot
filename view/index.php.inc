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
			<div class="well controls docs-input-sizes">
				<form class="form-horizontal" onsubmit="return false;">
					<div class="control-group">
						<select name="type" class="input-small">
							<option value="PUT">PUT</option>
							<option value="GET">GET</option>
							<option value="POST">POST</option>
							<option value="DELETE">DELETE</option>
						</select>
						<div class="input-prepend  input-append offset1">
							<span class="add-on">url</span>
							<input type="text" class="input-xlarge search-query" value="http://localhost/esca/rest/?" id="url">
							<button id="mock" class="btn" >Lancer</button>
						</div>
					</div>
				</form>
				<div class="well" style="height	: 250px;" id="result">
					
				</div>
			</div>
		</div>
	</body>
	<script src="js/mock.js"></script>
</html>
