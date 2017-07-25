/**
 *
 * this service is used by stage_service.js to preload next stage images to avoid delay in image display.
 * the service receives a stage, scand its items for image and bg-image sources, and preloads then in 1x1 image pixels.
 * on pixel load the element will be removed from DOM.
 * 
 */
ImagePreloaderService = {
	
	/*
	 * preloads all image and bg-images in received stage.
	 * 
	 * stage - dom element of next stage to be displayed.
	 * 
	 */
	preloadStageImages:function(stage_el){
		
		//var stage_el = document.getElementById(stage_id);
		//validate stage id
		if(stage_el == undefined) return;
		
		// find image sources
		var pixel_image_source_list = this.getAllElementPreloads(stage_el);
		
		// load all image pixels
		for(var i=0; i < pixel_image_source_list.length; i++){
			
			var img_pixel = document.createElement("img");
			img_pixel.src = pixel_image_source_list[i];
			
			// set 1x1 and put in space
			img_pixel.height = 1;
			img_pixel.width = 1;
			img_pixel.style.position = "absolute";
			img_pixel.style.top = "-1000px";
			
			// set onload remove
			img_pixel.onload = function(){
				
				this.parentNode.removeChild(this);
			};
			
			//add to DOM
			document.body.appendChild(img_pixel);
			
		}
	},
	
	/*
	 * check preload attr on element and all children 
	 * 
	 * return - preload array
	 */
	getAllElementPreloads:function(el){
		
		//validate element
		if(el == undefined || el.getAttribute == undefined) return [];
		
		var preloads = [];
		
		//cehck if attribute exists, split to array of source links
		//and add to total list
		var preload_attr = el.getAttribute("preload");
		if(preload_attr != undefined && preload_attr != "")
			preloads = preloads.concat(preload_attr.split(","));
			
		// find image sources
		for(var c = 0; c < el.childNodes.length; c++){
			
			//recursive
			preloads = preloads.concat(this.getAllElementPreloads(el.childNodes[c]));
			
		}
		
		//go over all image children
		var images = el;
		for(var j=0; j < images.length; j++){
			
			//check if is img type and has source value
			if(images[j].src != "" && images[j].src != undefined){
				
				// add image source
				preloads.push(images[j].src);
			}
		}
		
		return preloads;
			
	}
	
};
