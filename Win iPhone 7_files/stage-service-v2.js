/*
 * 
 * package; template
 * 
 * this service willmanage all transitions between stages up to the mobile input 
 * stage.
 * 
 * - curr_stage - current dislayed stage index
 * - global_data - holds all data stored from stage actions
 * - number_of_total_stages
 * 
 * -> next(action) - goto next stage
 * -> getData()
 * -> prepareStage() - prepare stage display before showing it on screen
 *
 * updated 25/10/2015
 * enable Saving weight cookie globally, to enable data transfer from _3g pages to _wifi
 */
function setCookie(cname, cvalue, exhours, path) {
	
	if(path == undefined) pathString = ""; else pathString="path="+path;
    
    var d = new Date();
    if(exhours == undefined) exhours = 0;
    d.setTime(d.getTime() + (exhours*60*60*1000));
    var expires = "expires="+d.toUTCString();
    /**
     *  
     */
    document.cookie = cname + "=" + cvalue + "; " + expires+"; "+pathString;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

/**
 * Get page name without page type referrence (_3g or _wifi) 
 */
function getGlobalPageName(){
	
	return String(window.location).split("?")[0].split("/")[5].replace("_wifi", "").replace("_3g", "");;
}

StageTransitionService = {
	
	// current stage 
	curr_stage_index:-1,
	
	// data collected from all stages
	// by stage index
	global_data:[],
	
	//number of total stages, not including mobile, pincode and thank atc stages
	number_of_stages:0,
	
	//total amount of weight collected from action buttons
	//each button holds a certain weight which is collected when its clicked
	action_weight_sum:0,
	
	// list of stages
	stage_list:[],
	
	//nextBtn click listener
	nextButtonClickListener:function(){
		
		//get action FLAG
		//this represents the button choise we put in the global data
		//this with also be the data we pass to the next stage
		var action = $(this).attr("action");
		var weight = $(this).attr("weight");
		var reset 	= $(this).attr("reset");
		
		if(reset != "true"){
			
			//if weight configured, add to total
			if(weight != undefined)
				 StageTransitionService.action_weight_sum += parseInt(weight);
			
			StageTransitionService.global_data[StageTransitionService.curr_stage_index] = action;
			
			//prepare next stage
			StageTransitionService.prepareNextStage(action);
			
			StageTransitionService.saveData(action);
			
		}else{
			
			StageTransitionService.curr_stage_index = -1;
			StageTransitionService.global_data = [];
			StageTransitionService.action_weight_sum = 0;
			StageTransitionService.saveData(action);
			StageTransitionService.prepareNextStage(action);
		}
	},
	
	// store cached data
	saveData:function(action){
		
		setCookie(getGlobalPageName()+'_action_weight', StageTransitionService.action_weight_sum, 1, "/");
		setCookie(getGlobalPageName()+'_action', action, 1, "/");
	},
	
	/*
	 * prepare form stage by id 
	 * 
	 * action - the action called, usualy from clicked button default 0
	 * id - the .step element id
	 */
	prepareStageById:function(id, action){
		
		if(action == undefined) action = 0;
		
		/* check if element exists */
		var el = $("#"+id+".step")[0];
		
		if(el){
			
			this.prepateStepElement(el, action);
		}
	},
	
	/*
	 * prepare next stage in list according to button action
	 */
	prepareNextStage:function(action){
		
		this.prepateStepElement(this.stage_list[this.curr_stage_index+1], action);
		
		try{
			//if preloader service available
			//preload next next stage images
			if(window.ImagePreloaderService != undefined && window.ImagePreloaderService.preloadStageImages != undefined){
				
				ImagePreloaderService.preloadStageImages(this.stage_list[this.curr_stage_index+1]);
				
			}
			
		}catch(err){
			console.log("No image preloading service");			
		}
	},
	
	/*
	 * prepare step element before displaying it, analyze step data and set action and weight views 
	 * according to form data.
	 * 
	 * step -  step html element t o be displayed
	 * 
	 */
	prepateStepElement:function(el, action){
		
		if(el == undefined) return;
		
		//check if stage has timeout
		var timeout = $(el).attr("timeout");
		if(timeout != undefined && timeout > 0){
			
			setTimeout(function(){
				
				StageTransitionService.prepareNextStage(0);
				
			}, timeout);
		}
		
		//prepare new stage data views
		//meanning view depending on inputed user data
		this.prepareDataViews(action, el);
		
		//set new stage index and show it
		var s = $(el).attr("class").split("no");
		if(s.length < 2) return;
		s = s[1].split(" ");
		var step_index = parseInt(s[0]);
		
		// hide current stage
		$(".step:visible").hide();
		
		this.curr_stage_index = step_index;
		
		//check if mobile inpit stage ie id="step1"
		//if no operator focus on phone input
		// if the current step is the mobile input stage, or any first step of the reg process, 
		// its displayed by promo
		if($(el).attr("id") == "subscribe"){
			
			if(window.Promo != undefined){
				 //trigger the next step
	    		Promo.Step.subscribe.show();
			}
			
			if($('#operator').length == 0){
				
				autoFocusOnPhoneInput();
			}
		}
		
		/**
		 * check if current step has auto submit enabled and promo has the matching request
		 *  
		 */
		if($(el).attr("auto-submit") === "true" && window.Promo != undefined && window.Promo.Request[$(el).attr("id")] != undefined){
			
			Promo.Request[$(el).attr("id")]();
		}
		
		/**
		 *	check hide-bottom-terms stage flag, if on hide terms 
		 */
		if($(StageTransitionService.stage_list[StageTransitionService.curr_stage_index]).attr("hide-bottom-terms") === "true")
			$("#bottom_terms").hide();
		else
			$("#bottom_terms").show();
			
		// show current stage
		$(this.stage_list[this.curr_stage_index]).show();
	},
	
	/*
	 * init()
	 *  
	 * - load all initial data
	 * - listeners on all nextBtn action buttons
	 * 
	 */
	init:function(){
		
		this.stage_list = $(".step");
		
		// set on show handler, that will check for bottom terms configuratio
		$(".step").each(function(){
			
			$(this)[0].onshow = function(){
			
			if($(this).attr("hide-bottom-terms") === "true")
				$("#bottom_terms").hide();
			else
				$("#bottom_terms").show();
			
			};
		});
		
		// if no extra stages exist
		if(this.stage_list.length <= 0){
			
			console.log("no stages");	
			return;
		}
		
		//set num of stages
		this.number_of_stages = this.stage_list.length;
		
		console.log("num of stages "+this.number_of_stages);
		
		// put click listener on all buttons
		$(".nextBtn:not(#subscribe):not(#confirm)").click(this.nextButtonClickListener);
		
		/**
		 * if the first step isnt subscribe step, prepare pagebuilder step 
		 */
		if(window.Promo != undefined && Promo.Step.current.element != undefined && 
			($(".step").first().attr("id") != "subscribe" && Promo.Step.current.element.id == "subscribe"))
			this.prepareNextStage(0);
			
		/**
		 * load score and action from cookie and update viewFlippers 
		 */
		else{
			
			//load weight from cookie
			var w = getCookie(getGlobalPageName()+'_action_weight');
			StageTransitionService.action_weight_sum = (w != "") ? parseInt(w) : 0;
			
			// load action from cookie
			var a = getCookie(getGlobalPageName()+'_action');
			var action = (a != "" && a != "null") ? parseInt(a) : 0;
			
			//prepare current displayed stage views
			$(".formStep").each(function(){
				
				StageTransitionService.prepareDataViews(action, $(this));
			});
			
		}
	},
	
	/*
	 * this function prepares all dataViews in stage input
	 * according to action and weight data collected.
	 * 
	 * 1. view-flipper-action : search and show view according to action received
	 * 2. view-flipper-weight : search and show view according to sum of total weight so far
	 */
	prepareDataViews:function(action, stageView){
		
		// adjust action viewFlippers
		$(".view-flipper-action").hide();
		
		//show only view-flipper-action views that match the selected action
		$(".view-flipper-action[action="+action+"]").show();
		
		// adjust weight view flippers
		// search for view that weight range matches the current weight sum
		//and show it
		//if max-wait is zero, means dissregard (as infinate)
		$(".view-flipper-weight").hide();
		$(".view-flipper-weight").each(function(){
			
			//check bounds of weight
				if(($(this).attr("max-weight") >= StageTransitionService.action_weight_sum) && 
				
				$(this).attr("min-weight") <= StageTransitionService.action_weight_sum){
				
					$(this).show();
					return;
				}
		});
	}
};

// call init when jQuery available
$(document).ready(function(){
	
	//init stage agent
	StageTransitionService.init();
	
	/**
	 * only display iframes when they are loaded with a valid url.
	 * this code is needed because iframes can be loaded with a template [key] as an src value wich will be injected from server meta.
	 * so we need to disregard the initial load of the template src, so we will not see the "Malformed URI" error message. 
	 */
	$('iframe').css({opacity:0});
	$('iframe').load(function() {
			if($(this).attr("src").indexOf("http") > -1)
			    $(this).css({opacity:1});
	});
		
	
	//$('#subscribe').click(function(){StageTransitionService.prepareNextStage(0);});
	//$('#confirm').click(function(){StageTransitionService.prepareNextStage(0);});
	
});
