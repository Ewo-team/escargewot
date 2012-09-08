jQuery(window).ready(function(){
	jQuery('#mock').click(function(){
		var type = jQuery('select[name="type"]').val();
		var url  = jQuery('#url').val();
		
		jQuery.ajax({
			url : url,
			type : type,
			success : function(data){
				jQuery('#result').html(data);
			}
		});
	});
});
