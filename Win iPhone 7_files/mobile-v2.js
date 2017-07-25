/*
 * 
 * this service helper runs on mobile clients
 * 
 * 
 */

/* 
 * set no auto focus on mobile
 */
window.config.auto_phone_input_focus = false;

$(document).ready(function(){
	
	//check setting on page
	//if setting dont specificly require that regulation wont stivk to screen bottom
	//make it stick
	var p = $("#page-template"); 
	if(p && p.attr("regulation-stick") !== "false"){
	
		try{
			//set terms all the way down
			var b_terms = document.getElementById("bottom_terms");
			b_terms.style.top = window.innerHeight+"px";
			b_terms.style.position = 'absolute';
			
		}catch(err){
			
		}
	}
	
	//change phone input to number for mobile number keyboard
	//document.getElementById("phone").type = "number";
	/*var mobile_input = document.getElementById("phone");
	if(mobile_input != undefined){
		var mobile_clone = mobile_input.cloneNode(false);
		mobile_clone.type = "tel";
		
		mobile_input.parentNode.replaceChild(mobile_clone, mobile_input);
	}
	
	//change pincode input type to number
	var pincode_input = document.getElementById("pincode");
	//check pincode input exists
	if(pincode_input){
		var pincode_clone = pincode_input.cloneNode(false);
		pincode_clone.type = "tel";
		
		pincode_input.parentNode.replaceChild(pincode_clone, pincode_input);
	}*/
	
	/*
	 * detect keyboard close
	 * scroll to top 
	 */
	try{
		window.addEventListener('resize', function() { window.scrollTo(0, 1); });
	}catch(err){}
	
	/*
	 * check platform type
	 * if iPhone, mo button href link should be replaced
	 * 
	 * Android: sms:number?body=text
	 * 
	 * iPhone:  sms:number&body=text
	 */
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
	
		/*
		 * iphone keyboard closed compatibillity
		 */
		$('input, textarea').bind('blur', function(e) {
	
	       // Keyboard disappeared
	       window.scrollTo(0, 1);
		
		});
	
		//iphone detected
		//replace all mo links
		$("a").each(function(){
			
			if(String($(this).attr("href")).indexOf("?body=") > -1){
				
				$(this).attr("href", $(this).attr("href").replace("?body=", "&body=") );
			}
		});
	}

});
