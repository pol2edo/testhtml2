/*
 * 
 * template pageBuilder.services
 * 
 * this js code will automatically animate all "timer" class objects on screen.
 * 
 * jQuery required
 */

window.GlobalTimer = {
	
	//sec count
	sec:0,
	
	// up count by one second
	count:function(){
		
		this.sec++;
	},
	
	/*
	 * get current count in time string format 00:00
	 */
	getTimeString:function(){
		
		var min = parseInt(this.sec / 60), min_text = (min >= 10) ? min : "0"+min;
		var sec = this.sec % 60, sec_text = (sec >= 10) ? sec : "0"+sec;
		return min_text+":"+sec_text;
	}
	
}; 

if ($ == null) console.log("timer script failed jQuery not existing");
else{
	
	$(document).ready(function(){
		
		var all_timers = $(".timer");
		
		//stop if no timers at all
		if(all_timers.length <= 0) return;
		
		// start Global timer count
		setInterval(function(){
			
			//count
			GlobalTimer.count();
			
			//set text for all 
			all_timers.each(function(){
				
				$(this).html(GlobalTimer.getTimeString());
			});
			
		}, 1000);
		
	});

}
