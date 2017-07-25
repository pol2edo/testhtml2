/*
 * Promo v2 client connection
 * 
 * this script manages and connects html elements to promo subscription process
 */

$(document).ready(function(){
	
	/*
	 * set default input restrictions
	 * 
	 * mobile / pincode max-chars
	 * 
	 */
	$("#phone").attr("maxlength", Promo.Locale.phone.len);
	$("#pincode").attr("maxlength", Promo.Locale.pincode.len);
	
	//clear placeholder
	$("#pincode").removeAttr("placeholder");
	
	/*
	 * set placeholder orefix to text
	 */
	$("#phone").val(Promo.Locale.phone.prefix);
	$("#phone").removeAttr("placeholder");
	$("#phone").blur();
	
	/*
	 * set in operator change focus on mobile
	 * add mnc and navigate to end of text
	 */
	$("#operator").change(function(){
		
		autoFocusOnPhoneInput();
		//$("#phone").scrollLeft = $("#phone").scrollWidth;
	});
	
	/**
	 * check if auto focus not disabled, set auto focus on confirm stage pincode input 
	 */
	if(window.config.auto_phone_input_focus !== false && !!document.getElementById("confirm")){
		
		document.getElementById("confirm").onshow = function(){
			
			$("#pincode")[0].focus();
		};
	}
	
});

/**
 *	Set stage focus on mobile input
 * @method
 */
function autoFocusOnPhoneInput(){
	
	//check configuration
	if(window.config == undefined || (window.config != undefined && window.config.auto_phone_input_focus)){
		
		var elem = $('#phone');
	    var val = elem.val();
	    elem.focus().val('').val(val);
	    
	}
};
