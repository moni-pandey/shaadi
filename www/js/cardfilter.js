var cardfilter ={
	colorArray : [],
	colorselected : 0,
	cardArray : [],
	typeArray : [],
	themeArray : [],
    filteredObjects :[],
	filobj :[],
	cardtypearray:[],
	filtercount : 0,
	min : 0,
	max : 0 ,
	pricechk:false ,
	getcolor:function(id) {
		var color = $(id).attr('id');
		var selected = $(id).data('check')
		if(selected == 'uncheck')
		{
			$(id).attr("src" ,"img/check.png")
			$(id).data('check','checked')
			//$('.alternate-selected').removeClass('alternate-colors')
			//$('.alternate-colors').addClass('alternate-selected')
			$("#colordropicon").before('<div id="'+color+'id" class="right-padding">\
                                    <div class="choose-'+color.toLowerCase()+'"></div><span class="color-name">'+color+'</span>\
						        </div>')
			cardfilter.colorArray.push(color)
		}
		else
		{
			$(id).attr("src" ,"img/unselected.png")
			$(id).data('check','uncheck')
			//$(id).removeClass('alternate-selected')
			//$(id).addClass('alternate-colors')
			$('#'+color+'id').remove()
			 for(var k=0 ;k <cardfilter.colorArray.length ;k++) 
		       {
			 if(cardfilter.colorArray[k]==color)
				 cardfilter.colorArray.splice(k,1)
		       }
		}
		if(cardfilter.colorArray.length)
			 cardfilter.filtercount++
		console.log(cardfilter.colorArray)
		
		/*if(cardfilter.colorArray.length<3)
		{
		$("#colordropicon").before('<div class="right-padding">\
                                    <div class="choose-'+color.toLowerCase()+'"></div><span class="color-name">'+color+'</span>\
						        </div>')
		}*/
	},
	
	gettheme:function(id) {
		var color = $(id).attr('id');
		var selected = $(id).data('check')
		if(selected == 'uncheck')
		{
			$(id).attr("src" ,"img/check.png")
			$(id).data('check','checked')
			cardfilter.themeArray.push(color)
			$('#themedropdownicon').before('<span id="'+color+'id" style="padding-right:12px;">'+color+'</span>\
			')
			//$(id).removeClass('alternate-colors')
			//$(id).addClass('alternate-selected')
		}
		else
		{
			$(id).attr("src" ,"img/unselected.png")
			$(id).data('check','uncheck')
			//$(id).removeClass('alternate-selected')
			//$(id).addClass('alternate-colors')
			$('#'+color+'id').remove()
			 for(var k=0 ;k <cardfilter.themeArray.length ;k++) 
		       {
			 if(cardfilter.themeArray[k]==color)
				 cardfilter.themeArray.splice(k,1)
		       }
		}
		if(cardfilter.themeArray.length)
			 cardfilter.filtercount++
		console.log(cardfilter.themeArray)
	/*	if(cardfilter.themeArray.length <3)
		{
			$('#themedropdownicon').before('<span style="padding-right:12px;">'+color+'</span>\
			')
			
		} */
	},
	cardtype:function(id) {
		var color = $(id).attr('id');
		var val=""
	//	alert(color)
		if(color === 'p')
			val= "Physical Card"
		else
			val= "E Card"
		
		var selected = $(id).data('check')
		if(selected == 'uncheck')
		{
			$(id).attr("src" ,"img/check.png")
			$(id).data('check','checked')
			$('#cardtypedropdownicon').before('<span id="'+color+'id"style="padding-right:12px;">'+val+'</span>') 
			cardfilter.cardtypearray.push(color)
			//$(id).removeClass('alternate-options')
			//$(id).addClass('options-selected')
		}
		else
		{
			$(id).attr("src" ,"img/unselected.png")
			$(id).data('check','uncheck')
			$('#'+color+'id').remove()
			//$(id).removeClass('options-selected')
			//$(id).addClass('alternate-options')
			 for(var k=0 ;k <cardfilter.cardtypearray.length ;k++) 
		       {
			 if(cardfilter.cardtypearray[k]==color)
				 cardfilter.cardtypearray.splice(k,1)
		       }
		}
		if(cardfilter.cardtypearray.length)
			 cardfilter.filtercount++
		console.log(cardfilter.cardtypearray)
		
	/*	if(color=='p')
		{
		$('#cardtypedropdownicon').before('<span style="padding-right:12px;">'Phisical Card'</span>') 
		
		}
		else
		{$('#cardtypedropdownicon').before('<span style="padding-right:12px;">'E Card'</span>')}
*/
	},
	gettype:function(id) {
		console.log(id)
		var type = $(id).attr('id');
		var selected = $(id).data('check')
		if(selected == 'uncheck')
		{
			$(id).attr("src" ,"img/check.png")
			$(id).data('check','checked')
			$('#cardtypedropdpwnicon').before('<span id="'+type+'id"style="padding-right:12px;">'+type+'</span>')
			cardfilter.typeArray.push(type)
			//$(id).removeClass('alternate-options')
			//$(id).addClass('alternate-selected')
		}
		else
		{
			$(id).attr("src" ,"img/unselected.png")
			$(id).data('check','uncheck')
			$('#'+type+'id').remove();
			//$(id).removeClass('alternate-selected')
			//$(id).addClass('alternate-colors')
			 for(var k=0 ;k <cardfilter.typeArray.length ;k++) 
		       {
			 if(cardfilter.typeArray[k]==type)
				 cardfilter.typeArray.splice(k,1)
		       }
		}
		if(cardfilter.typeArray.length)
			 cardfilter.filtercount++
		console.log(cardfilter.typeArray)
		/*if(cardfilter.typeArray.length<3)
		{
			$('#cardtypedropdpwnicon').before('<span style="padding-right:12px;">'+type+'</span>')
			
		}*/
	},
	getrange: function(id)
	{
		cardfilter.min = parseInt($(id).data('min'))
		cardfilter.max = parseInt($(id).data('max'))
		//alert(cardfilter.min)
		//alert(cardfilter.max)
		cardfilter.pricechk=true
	},
    searchcard:function()
	{
		//alert('mkmkmkmk')
	cardfilter.cardArray = JSON.parse( localStorage["card"] )	;
	console.log(cardfilter.cardArray)

	if(cardfilter.filtercount>1)
		
	
	{       cardfilter.filtercount=0
       var types ={
		   "color" : false ,
		   "theme" :false ,
		   "cardtype":false,
		   "type":false,
		   "price":false
		}
if(cardfilter.typeArray.length)
	types.type=true
if(cardfilter.colorArray.length)
	types.color=true
if(cardfilter.themeArray.length)
	types.theme=true
if(cardfilter.cardtypearray.length)
	types.cardtype=true

//alert(cardfilter.max)

if(cardfilter.max)
{//alert('mn')
types.price=true

}
//all filters 

if(types.color)
{
	console.log('type color')
	for(var i = 0;i <cardfilter.colorArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.cardArray.length;m++)  
			   console.log(m)
			   console.log(cardfilter.cardArray[m].color)
			if(cardfilter.cardArray[m].color.toLowerCase() == cardfilter.colorArray[i].toLowerCase() )
			{
				cardfilter.filteredObjects.push(cardfilter.cardArray[m])
				
			}
			
		}
		
		console.log(cardfilter.filteredObjects)
		if(cardfilter.typeArray.length)
	{  
         
		for(var i = 0;i <cardfilter.typeArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.filteredObjects.length;m++)   
			if(cardfilter.filteredObjects[m].type.toLowerCase() != cardfilter.typeArray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.splice(m,1)
			
				
			}
			
		}
		
	}
	console.log(cardfilter.filteredObjects)
	
	if(cardfilter.themeArray.length)
	{  
        
		for(var i = 0;i <cardfilter.themeArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.filteredObjects.length;m++)   
			if(cardfilter.filteredObjects[m].theme.toLowerCase() != cardfilter.themeArray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.splice(m,1)
			
				
			}
			
		}
		
	if(types.price) 
	{
		//alert(price)
		 for(var m=0 ;m < cardfilter.filteredObjects.length;m++)   
			if(!cardfilter.filteredObjects[m].price<=cardfilter.max  && !cardfilter.filteredObjects[m].price>=cardfilter.min )
			{
			
					cardfilter.filteredObjects.splice(m,1)
			
				
			}
		//alert(cardfilter.filteredObjects)
		
	}		
		
	}//end if 
	console.log(cardfilter.filteredObjects)
	
	if(cardfilter.cardtypearray.length)
	{  
        
		for(var i = 0;i <cardfilter.cardtypearray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.filteredObjects.length;m++)   
			if(cardfilter.filteredObjects[m].cardtype.toLowerCase() != cardfilter.cardtypearray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.splice(m,1)
			
				
			}
			
		}
		
	}//end if 
	console.log(cardfilter.filteredObjects)
	
}else if(types.theme)
{
	
	for(var i = 0;i <cardfilter.themeArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.cardArray.length;m++)   
			if(cardfilter.cardArray[m].theme.toLowerCase() == cardfilter.themeArray[i].toLowerCase() )
			{
				cardfilter.filteredObjects.push(cardfilter.cardArray[m])
				
			}
			
		}
		console.log(cardfilter.filteredObjects)
			if(cardfilter.cardtypearray.length)
	{  
        
		for(var i = 0;i <cardfilter.cardtypearray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.filteredObjects.length;m++)   
			if(cardfilter.filteredObjects[m].cardtype.toLowerCase() != cardfilter.cardtypearray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.splice(m,1)
			
				
			}
			
	}}
	
	console.log(cardfilter.filteredObjects)
			if(cardfilter.typeArray.length)
	{  
        
		for(var i = 0;i <cardfilter.typeArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.filteredObjects.length;m++)   
			if(cardfilter.filteredObjects[m].type.toLowerCase() != cardfilter.typeArray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.splice(m,1)
			
				
			}
			
		}
		
	}
	console.log(cardfilter.filteredObjects)
	
	
}
else
	
	{
		
		
		for(var i = 0;i <cardfilter.cardtypearray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.cardArray.length;m++)   
			if(cardfilter.cardArray[m].cardtype.toLowerCase() == cardfilter.cardtypearray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.push(cardfilter.cardArray[m])
			
				
			}
			
		}
		console.log(cardfilter.filteredObjects)
			if(cardfilter.typeArray.length)
	{  
        
		for(var i = 0;i <cardfilter.typeArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.filteredObjects.length;m++)   
			if(cardfilter.filteredObjects[m].type.toLowerCase() != cardfilter.typeArray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.splice(m,1)
			
				
			}
			
		}
		
	}console.log(cardfilter.filteredObjects)
	}
		/*for(var i = 0;i <cardfilter.colorArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.cardArray.length;m++)   
			if(cardfilter.cardArray[m].color.toLowerCase() == cardfilter.colorArray[i].toLowerCase() )
			{
				cardfilter.filteredObjects.push(cardfilter.cardArray[m])
				
			}
			
		}
		
		if(cardfilter.typeArray.length)
	{  
        
		for(var i = 0;i <cardfilter.typeArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.filteredObjects.length;m++)   
			if(cardfilter.filteredObjects[m].type.toLowerCase() != cardfilter.typeArray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.splice(m,1)
			
				
			}
			
		}
		
	}
		//alert(JSON.stringify(cardfilter.filteredObjects))
		
	
	  localStorage["filtered"] = JSON.stringify(cardfilter.filteredObjects)
	
	
	
	*/
	
	//alert(JSON.stringify(cardfilter.filteredObjects))
		
	
	  localStorage["filtered"] = JSON.stringify(cardfilter.filteredObjects)
		$(":mobile-pagecontainer").pagecontainer("change", "filtered_List.html", {
            showLoadMsg: false
        });
		
	}//end if
	
		else if(cardfilter.typeArray.length &&(!cardfilter.colorArray.length) && (!cardfilter.cardtypearray.length) && (!cardfilter.themeArray.length))
	{  
        
		for(var i = 0;i <cardfilter.typeArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.cardArray.length;m++)   
			if(cardfilter.cardArray[m].type.toLowerCase() == cardfilter.typeArray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.push(cardfilter.cardArray[m])
			
				
			}
			
		}
		//alert(JSON.stringify(cardfilter.filteredObjects))
		localStorage["filtered"] = JSON.stringify(cardfilter.filteredObjects)
		$(":mobile-pagecontainer").pagecontainer("change", "filtered_List.html", {
            showLoadMsg: false
        });
	
		
	}	else if(!cardfilter.typeArray.length &&(!cardfilter.colorArray.length) && (cardfilter.cardtypearray.length) && (!cardfilter.themeArray.length))
	{  
        
		for(var i = 0;i <cardfilter.cardtypearray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.cardArray.length;m++)   
			if(cardfilter.cardArray[m].cardtype.toLowerCase() == cardfilter.cardtypearray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.push(cardfilter.cardArray[m])
			
				
			}
			
		}
		//alert(JSON.stringify(cardfilter.filteredObjects))
		localStorage["filtered"] = JSON.stringify(cardfilter.filteredObjects)
		$(":mobile-pagecontainer").pagecontainer("change", "filtered_List.html", {
            showLoadMsg: false
        });
	
		
	}
		else if(!cardfilter.typeArray.length &&(!cardfilter.colorArray.length) && (!cardfilter.cardtypearray.length) && (cardfilter.themeArray.length))
	{  
        
		for(var i = 0;i <cardfilter.themeArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.cardArray.length;m++)   
			if(cardfilter.cardArray[m].theme.toLowerCase() == cardfilter.themeArray[i].toLowerCase() )
			{
			
					cardfilter.filteredObjects.push(cardfilter.cardArray[m])
			
				
			}
			
		}
		//alert(JSON.stringify(cardfilter.filteredObjects))
		localStorage["filtered"] = JSON.stringify(cardfilter.filteredObjects)
		$(":mobile-pagecontainer").pagecontainer("change", "filtered_List.html", {
            showLoadMsg: false
        });
	
		
	}else if(cardfilter.pricechk)
{
	////alert(cardfilter.filteredObjects)
	for(var m=0 ;m < cardfilter.cardArray.length; m++)   
			if(parseInt(cardfilter.cardArray[m].price)<= parseInt(cardfilter.max)  && parseInt(cardfilter.cardArray[m].price)>= parseInt(cardfilter.min) )
			{{
			
					cardfilter.filteredObjects.push(cardfilter.cardArray[m])
			
				
			}
			}
			
			
		//alert(JSON.stringify(cardfilter.filteredObjects))
		localStorage["filtered"] = JSON.stringify(cardfilter.filteredObjects)
		$(":mobile-pagecontainer").pagecontainer("change", "filtered_List.html", {
            showLoadMsg: false
        });
}
	else
	{ 
     for(var i = 0;i <cardfilter.colorArray.length ;i++ )
		{ 
	        console.log(i)
	      for(var m=0 ;m < cardfilter.cardArray.length;m++)   
			if(cardfilter.cardArray[m].color.toLowerCase() == cardfilter.colorArray[i].toLowerCase() )
			{
				cardfilter.filteredObjects.push(cardfilter.cardArray[m])
				
			}
			
		}
		localStorage["filtered"] = JSON.stringify(cardfilter.filteredObjects)
		$(":mobile-pagecontainer").pagecontainer("change", "filtered_List.html", {
            showLoadMsg: false
        });
    }
	
	
	},
	setfilteredobj : function()
	{    
		 filobj = JSON.parse(localStorage["filtered"])
		 
		 for(var k = 0 ;k < filobj.length ; k++)
		 {
			 
			 cardfilter.setcardlisthtml(filobj[k])
		 }
		
		
	},
	setcardlisthtml :function(rowObject)
   {   var cardlistHTML=''
		
		 var favCardClass = Parse.Object.extend("favCard");
				 var favCardQuery = new Parse.Query(favCardClass);
				 favCardQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
				 favCardQuery.equalTo("cardID", rowObject.cardID);
				 
					//$("body").addClass("ui-loading");
					favCardQuery.find({
						success:function(results){
							console.log(results.length)
							
						 if(results.length)
						 {
							 cardlistHTML +=' <div class="profile-detail">';
							 cardlistHTML +='<img class="wedding-card-img" data-cardid="'+rowObject.cardID+'" src="'+rowObject.img1+'"  onclick="weddingcard.getcarddetails(this)" data-i2="'+rowObject.img2+'" data-i3="'+rowObject.img3+'"  id="'+rowObject.cardID+'"  data-cname="'+rowObject.name+'" data-type="'+rowObject.type+'" data-theme="'+rowObject.theme +'" data-price="'+rowObject.price+'" data-orientation="'+rowObject.orientation+'" data-printing="'+rowObject.printing+'" data-best="'+rowObject.best+'" data-color="'+rowObject.color+'">'
							 cardlistHTML +='<img src="img/fav-on.png" class="add-favorites-icon" data-cardid="'+rowObject.cardID+'" id="'+rowObject.cardID +'fav" onclick="weddingcard.likeproduct(this)" data-like="liked">';
							 cardlistHTML +='<p class="card-name-n-price">'+rowObject.name+'<span>&#8377 '+rowObject.price+'/-</span></p>';
							 cardlistHTML +=' </div>' 
							
						 }//end if 
						 else
						 {
							  cardlistHTML +=' <div class="profile-detail">';
							 cardlistHTML +='<img class="wedding-card-img" data-cardid="'+rowObject.cardID+'" src="'+rowObject.img1+'"  onclick="weddingcard.getcarddetails(this)" data-i2="'+rowObject.img2+'" data-i3="'+rowObject.img3+'"  id="'+rowObject.cardID+'"  data-cname="'+rowObject.name+'" data-type="'+rowObject.type+'" data-theme="'+rowObject.theme +'" data-price="'+rowObject.price+'" data-orientation="'+rowObject.orientation+'" data-printing="'+rowObject.printing+'" data-best="'+rowObject.best+'" data-color="'+rowObject.color+'">'
							 cardlistHTML +='<img src="img/fav-off.png" class="add-favorites-icon" data-cardid="'+rowObject.cardID+'" id="'+rowObject.cardID +'fav" onclick="weddingcard.likeproduct(this)" data-like="unlike">';
							 cardlistHTML +='<p class="card-name-n-price">'+rowObject.name+'<span>&#8377 '+rowObject.price+'/-</span></p>';
							 cardlistHTML +=' </div>'
							
						 }//end else 
							 
							$('.cardlist').append(cardlistHTML); 
						 
						},
						error:function(wishError){
							//$("body").removeClass("ui-loading");
							cm.showToast("no fav");
						}
					})
		
		
	}
	
	

};



	
	$("#flip-checkbox-1").change(function() {
		//alert('yo')
    // To make the needed change based on the select all option in Filter contacts page

var selectedContacts = $(".filter-search img");
               // weddingcard.guestListArray.length = 0;
				selectedContacts.each(function(index, item) {
					if($(item).attr("src")!="img/dropdown-icon.png")
            $(item).attr("src","img/unselected.png")
			
			});
			cardfilter.colorArray.length=0 
	cardfilter.colorselected =0
	cardfilter.cardArray.length=0
	cardfilter.typeArray.length=0
	cardfilter.themeArray.length=0
    cardfilter.filteredObjects.length=0
	cardfilter.filobj.length=0
	cardfilter.cardtypearray.length=0
	cardfilter.filtercount =0
	cardfilter.min =0
	cardfilter.max =0 
	cardfilter.pricechk=false 
   
});