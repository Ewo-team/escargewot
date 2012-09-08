<div class="well controls docs-input-sizes">
	<form class="form-horizontal" onsubmit="return false;">
		<div class="control-group">
			<select name="type" class="input-small">
				<option value="PUT">PUT</option>
				<option value="GET">GET</option>
				<option value="POST">POST</option>
				<option value="DELETE">DELETE</option>
			</select>
			
			<div class="input-prepend  input-append">
				<span class="add-on">url</span>
				<input type="text" class="input-xxlarge search-query" value="http://localhost/esca/rest/?" id="url">
				<button id="mock" class="btn" >Lancer</button>
			</div>
		</div>
	</form>
	<div class="well" style="height	: 250px;overflow:auto;" id="result">
		
	</div>
</div>

<script src="js/mock.js"></script>
