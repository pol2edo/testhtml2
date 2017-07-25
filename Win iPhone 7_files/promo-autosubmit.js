/**
 *	this code checked if the current step registered on promo has 
 * a vuiew in html, for example the subscribe step searched for the div#subscribe.
 * if it does not exist, this methos automatically calls the relevant action. 
 */
if(window.Promo != undefined){
	
	Promo.ready(function(){
						
		if(p3gs != undefined) p3gs();	
		else throw new Error('Promo p3gs function not defined');
	});
}