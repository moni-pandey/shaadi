var bm = {
	
	addTotalBudget : function() {
		
		if($('#budamt').val()==" ")
		{
			$('#circle').show()
		$('.total-budget-text').hide()
		$('.amounts').hide()
		$('.save-budget').hide()
		}
		else
		{
		 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		  var WeddingClass = Parse.Object.extend('Wedding');
			var WeddingQuery = new Parse.Query(WeddingClass);
			WeddingQuery.equalTo("weddingID",  weddingDetailsObject.weddingId);
			WeddingQuery.first( {
					  success: function(results) {
						  
					results.save(null, {
									success: function (results) {
                                      if (localStorage.taskusertype == 'host')
									  { 
								       if(localStorage.brideorgroomside=='Bride')
									       results.set("brideBudget",$('#budamt').val() );
									     else
											results.set("groomBudget", $('#budamt').val()); 
                                      }
									
										results.save();
										
										bm.nFormatter(parseInt($('#budamt').val()))
									}
									
								});
						
					  },
					  error: function(point, error) {
						 cm.showAlert(error)
						
					  }
			}); 
		}
	},
	getTotalbudget : function(){
	
			 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		  var WeddingClass = Parse.Object.extend('Wedding');
			var WeddingQuery = new Parse.Query(WeddingClass);
			WeddingQuery.equalTo("weddingID",  weddingDetailsObject.weddingId);
			WeddingQuery.find( { 
			success:function(results){ 
			var amt =''
			
			   if (localStorage.taskusertype == 'host')
									  { 
								       if(localStorage.brideorgroomside=='Bride')
									    amt =   results[0].get("brideBudget")
									
									   else
											amt =results[0].get("groomBudget") 
                                      }
								
									  bm.nfFormatter(parseInt(amt))
			} ,
			error : function(error){
				
			}
			});
		
	},
	nfFormatter : function(num) {
		var k 
     if (num >= 1000000000) {
        k= (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'Crore';
     }
     if (num >= 1000000) {
      k= (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'Lakhs';
     }
     if (num >= 1000) {
        k=  (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
     }
	
		$('#amtspnd').html('')
		$('#amtspnd').html('Actual Spend <br> &#8377 '+k+'')
	   
	   
},	
nFormatter : function(num) {
	
		var k 
     if (num >= 1000000000) {
        k= (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'Crore';
     }
     if (num >= 1000000) {
      k= (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'Lakhs';
     }
     if (num >= 1000) {
        k=  (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
     }
	 alert(k)
	
      	$('#circle').show()
		$('.total-budget-text').hide()
		$('.amounts').hide()
	    $('.save-budget').hide() 
	    $('#saveimg').hide() 
		$('#amtspnd').html(' ')
		$('#amtspnd').html('Actual Spend <br> &#8377 '+k+'')
	   
	   
},
	showHidetotalamt  : function() {
		
		$('#circle').hide()
		$('.total-budget-text').show()
		$('.amounts').show()
		$('.save-budget').show()
		$('#saveimg').show()
	},
	showAddcategory : function() {
		$('.addnewCategory').show()
	},
	addcategory : function()
	{
		
	
			    var ExpenseCategoryClass = Parse.Object.extend('ExpenseCategory');
				var ExpenseCategoryObj = new ExpenseCategoryClass();
				var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
				ExpenseCategoryObj.set("weddingID", weddingDetailsObject.weddingId);
				ExpenseCategoryObj.set("categoryName", $('#catTitle').val())
				ExpenseCategoryObj.set('budget',$('#estimatedamt').val());
				ExpenseCategoryObj.set('paidBy',localStorage.brideorgroomside);
				
				
				 ExpenseCategoryObj.save(null, {
					success: function(wishResults) {
						
						ExpenseCategoryObj.set("categoryID", wishResults.id);
					  ExpenseCategoryObj.save();
					 bm.updatesubcategory(wishResults.id)
			
				   
				   },
					error: function(gameScore, error) {
						 cm.showAlert(error);
					}
				})
		
	},
	addsubcategory : function()
	{
	
		//var subcategoriesList = new Array() 
		var subHTML=""
		subHTML  +='  <div class="ui-grid-a subcatdiv" style="margin-top:20px;">'
              subHTML +='   <div class="ui-block-a" style="padding-right:10px">'
				subHTML +=' <label class="label-subcategory">Subcategory </label>'
				subHTML +=' <input type="text" data-wrapper-class="enter-new-category" placeholder="Title" class="subtitle">'
				subHTML +=' </div>'
			  subHTML +='   <div class="ui-block-b" style="padding-left:10px">'
			subHTML +=' 	<label class="label-amount">Amount </label>'
			  subHTML +='   <input type="text" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount" class="subamt">'
			  subHTML +='   </div>'
		 subHTML +='    </div>'

	$('#subcategorybtn').before(subHTML).enhanceWithin()
		
	
	
		
	}
	,
	updatesubcategory : function(catid)
	{

		var subcategoriesList = new Array() 
		
		$('.subcatdiv').each(function(index) {
			console.log(index)
			   var title = $(this).find('.subtitle').val()
			   var amt = $(this).find('.subamt').val()
			   var obj = {'title': title , 'amount': amt}
			  subcategoriesList.push(obj)
			
		});
		
			console.log(subcategoriesList)
			
			$('.subcatdiv').each(function(index) {
				 var title = $(this).find('.subtitle').val()
			     var amt = $(this).find('.subamt').val()
			
			    var ExpenseCategoryClass = Parse.Object.extend('ExpenseSubCategory');
				var ExpenseCategoryObj = new ExpenseCategoryClass();
				ExpenseCategoryObj.set("subcategoryName",title)
				ExpenseCategoryObj.set("spent", amt)
				ExpenseCategoryObj.set('budget',$('#estimatedamt').val());
				ExpenseCategoryObj.set('paidBy',localStorage.brideorgroomside);
				ExpenseCategoryObj.set("categoryID", catid);
				
				 ExpenseCategoryObj.save(null, {
					success: function(wishResults) {
						
					  ExpenseCategoryObj.set("subcategoryID", wishResults.id);
					  ExpenseCategoryObj.save();
					
			
				   
				   },
					error: function(gameScore, error) {
						 cm.showAlert(error);
					}
				}) 	
				
			});
		
				$('.addnewCategory').hide()
				bm.getCategoryList() 
		
	},
	getCategoryList : function()
	{
		 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("ExpenseCategory");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
		   TaskManagementQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
		   TaskManagementQuery.equalTo("paidBy", localStorage.brideorgroomside);
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
                 $("body").removeClass("ui-loading");
				 
			 
				 
				 for(var i = 0 ;i <results.length ;i++)
				 {
					console.log(i)
					 var rowobj = results[i]
				//	 var categoryHTML =""
					 console.log(rowobj)
					 var catname = rowobj.get('categoryName')
					 var catid= rowobj.get('categoryID')
					 bm.getSubcatergory(catname , catid)
			 
		/*   categoryHTML+='<div data-role="collapsible" data-icon="none" and data-iconpos="none" class="custom-accordion">'
           categoryHTML+='<h1><div class="ui-grid-a" style="border-bottom:1px solid #e0e0e0; padding-bottom:4px;">'
           categoryHTML+='<div class="ui-block-a" id="'+rowobj.get('categoryID')+'">'
		   categoryHTML+='<p class="category-label">'+rowobj.get('categoryName')+'</p></div>'
		   categoryHTML+='<div class="ui-block-b edit-delete-category-info">'
		   categoryHTML+=' <img src="./img/edit-gray.png" height="16" width="20">'
		  categoryHTML+='<img src="./img/divider.png" height="17" width="3">'
		  categoryHTML+='<img src="./img/delete-budget.png" height="16" width="16" style="vertical-align:1px;">'
		  categoryHTML+='<img src="./img/down-arrow.png" height="8" width="14" class="down-icon">'
					categoryHTML+='</div>'
				categoryHTML+='</div>'
				
				categoryHTML+='<div class="ui-grid-b" style="margin-top:5px;">'
                 categoryHTML+='   <div class="ui-block-a" style="width:44%">'
					categoryHTML+='    <label class="label-actual">Actual </label>' 
					categoryHTML+='	<h6 class="actual-amount">&#8377 70,000</h6>'
					categoryHTML+='</div>'
					categoryHTML+='<div class="ui-block-b" style="width:16%">'
					categoryHTML+='    <button class="ui-btn split-active"><img src="./img/split-icon.png" height="16" width="20"></button>'
					categoryHTML+='</div>'
categoryHTML+='<div class="ui-block-c" style="width:40%">'
					  categoryHTML+='  <label class="label-estimated" style="text-align:right">Estimated </label>'
						categoryHTML+='<h6 class="estimated-amount">&#8377 100,000</h6>'
					categoryHTML+='</div>'
				categoryHTML+='</div>'
				
				categoryHTML+='<div style="margin-top:8px; margin-bottom:5px;">'
				categoryHTML+='    <div id="progressbar-1" class="progress-line"></div> '
				categoryHTML+='</div>'
		
			categoryHTML+='</h1>'
        
			categoryHTML+='<p>'
			 categoryHTML+='   <table class="budget-table" id="myTable">'
				categoryHTML+='<thead>'
					 categoryHTML+='   <tr>'
					 categoryHTML+='   </tr>'
                    categoryHTML+='</thead>'
					categoryHTML+='<tbody>'
					  categoryHTML+='<tr>'
                      categoryHTML+='  <td style="width:44%" class="subcategory-name">DJ</td>'
                      categoryHTML+='  <td style="width:16%"><button class="ui-btn split-subcategory-active"><img src="./img/split-icon.png" height="16" width="20"></button></td>'
                      categoryHTML+='  <td class="subcategory-amount" style="width:40%">&#8377 10,000</td>'
					 categoryHTML+=' </tr>'
					categoryHTML+='  <tr>'
                       categoryHTML+=' <td style="width:44%" class="subcategory-name">Invitations</td>'
                       categoryHTML+=' <td style="width:16%"><button class="ui-btn split-subcategory-deactive"><img src="./img/split-icon.png" height="16" width="20"></button></td>'
                      categoryHTML+='  <td class="subcategory-amount" style="width:40%">&#8377 10,000</td>'
					 categoryHTML+=' </tr>'
					 categoryHTML+=' <tr>'
                      categoryHTML+='  <td style="width:44%" class="subcategory-name">DJ</td>'
                      categoryHTML+='  <td style="width:16%"><button class="ui-btn split-subcategory-active"><img src="./img/split-icon.png" height="16" width="20"></button></td>'
                      categoryHTML+='  <td class="subcategory-amount" style="width:40%">&#8377 10,000</td>'
					 categoryHTML+=' </tr>'
					 categoryHTML+=' <tr>'
                      categoryHTML+='  <td style="width:44%" class="subcategory-name">Invitations</td>'
                      categoryHTML+='  <td style="width:16%"><button class="ui-btn split-subcategory-deactive"><img src="./img/split-icon.png" height="16" width="20"></button></td>'
                      categoryHTML+='  <td class="subcategory-amount" style="width:40%">&#8377 10,000</td>'
					categoryHTML+='  </tr>'
					categoryHTML+='</tbody>'
				categoryHTML+='</table>'
				
				categoryHTML+='<button class="ui-btn add-fields"><img src="./img/create-new.png" height="20" width="20"></button>'
				
				categoryHTML+='<div class="ui-grid-b" style="margin-top:15px;">'
                categoryHTML+='    <div class="ui-block-a" style="width:37%">'
					categoryHTML+='    <label class="label-bride">Bride </label>'
					categoryHTML+='	<h6 class="actual-amount">&#8377 70,000</h6>'
				categoryHTML+='	</div>'
				categoryHTML+='	<div class="ui-block-b" style="width:26%">'
					categoryHTML+='    <button class="ui-btn split-btn"><img src="./img/split-icon.png" height="16" width="20">Split</button>'
					categoryHTML+='</div>'
					categoryHTML+='<div class="ui-block-c" style="width:37%">'
					  categoryHTML+='  <label class="label-groom" style="text-align:right">Groom </label>'
					categoryHTML+='	<h6 class="estimated-amount">&#8377 70,000</h6>'
				categoryHTML+='	</div>'
			categoryHTML+='	</div>'
				
		categoryHTML+='	</p>'
        
		categoryHTML+='</div>'
		$('.appendcat').append(categoryHTML).enhanceWithin()		 
					 
					 */
				 }
				},
				error : function(error) {
					$("body").removeClass("ui-loading");
					cm.showAlert(error)
				}
			});
	},
	getSubcatergory : function(catname , catid)
	{
		$('.appendcat').html('')
		 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("ExpenseSubCategory");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
		   TaskManagementQuery.equalTo("categoryID",catid);
		  
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
                 $("body").removeClass("ui-loading");
				 var categoryHTML =""
			categoryHTML+='<div data-role="collapsible" data-icon="none" and data-iconpos="none" class="custom-accordion">'
           categoryHTML+='<h1><div class="ui-grid-a" style="border-bottom:1px solid #e0e0e0; padding-bottom:4px;">'
           categoryHTML+='<div class="ui-block-a" >'
		   categoryHTML+='<p class="category-label">' + catname + '</p></div>'
		   categoryHTML+='<div class="ui-block-b edit-delete-category-info">'
		   categoryHTML+=' <img src="./img/edit-gray.png" height="16" width="20">'
		  categoryHTML+='<img src="./img/divider.png" height="17" width="3">'
		  categoryHTML+='<img src="./img/delete-budget.png" height="16" width="16" style="vertical-align:1px;">'
		  categoryHTML+='<img src="./img/down-arrow.png" height="8" width="14" class="down-icon">'
					categoryHTML+='</div>'
				categoryHTML+='</div>'
				
				categoryHTML+='<div class="ui-grid-b" style="margin-top:5px;">'
                 categoryHTML+='   <div class="ui-block-a" style="width:44%">'
					categoryHTML+='    <label class="label-actual">Actual </label>' 
					categoryHTML+='	<h6 class="actual-amount">&#8377 70,000</h6>'
					categoryHTML+='</div>'
					categoryHTML+='<div class="ui-block-b" style="width:16%">'
					categoryHTML+='    <button class="ui-btn split-active"><img src="./img/split-icon.png" height="16" width="20"></button>'
					categoryHTML+='</div>'
categoryHTML+='<div class="ui-block-c" style="width:40%">'
					  categoryHTML+='  <label class="label-estimated" style="text-align:right">Estimated </label>'
						categoryHTML+='<h6 class="estimated-amount">&#8377 100,000</h6>'
					categoryHTML+='</div>'
				categoryHTML+='</div>'
				
				categoryHTML+='<div style="margin-top:8px; margin-bottom:5px;">'
				categoryHTML+='    <div id="progressbar-1" class="progress-line"></div> '
				categoryHTML+='</div>'
		
			categoryHTML+='</h1>'
        
			categoryHTML+='<p>'
			 categoryHTML+='   <table class="budget-table" id="myTable">'
				categoryHTML+='<thead>'
					 categoryHTML+='   <tr>'
					 categoryHTML+='   </tr>'
                    categoryHTML+='</thead>'
					categoryHTML+='<tbody>'
				 
			 for(var i = 0 ; i <results.length ; i++)
				 {
					 var rowobj = results[i]
				   
					 console.log(rowobj)
					 
					  categoryHTML+='<tr>'
                      categoryHTML+='  <td style="width:44%" class="subcategory-name">' + rowobj.get('subcategoryName') + '</td>'
                      categoryHTML+='  <td style="width:16%"><button class="ui-btn split-subcategory-active"><img src="./img/split-icon.png" height="16" width="20"></button></td>'
                      categoryHTML+='  <td class="subcategory-amount" style="width:40%">&#8377 ' + rowobj.get('spent') +'</td>'
					 categoryHTML+=' </tr>'
					 
					 
				 }
				 	categoryHTML+='</tbody>'
				categoryHTML+='</table>'
				
				categoryHTML+='<button class="ui-btn add-fields"><img src="./img/create-new.png" height="20" width="20"></button>'
				
				categoryHTML+='<div class="ui-grid-b" style="margin-top:15px;">'
                categoryHTML+='    <div class="ui-block-a" style="width:37%">'
					categoryHTML+='    <label class="label-bride">Bride </label>'
					categoryHTML+='	<h6 class="actual-amount">&#8377 70,000</h6>'
				categoryHTML+='	</div>'
				categoryHTML+='	<div class="ui-block-b" style="width:26%">'
					categoryHTML+='    <button class="ui-btn split-btn"><img src="./img/split-icon.png" height="16" width="20">Split</button>'
					categoryHTML+='</div>'
					categoryHTML+='<div class="ui-block-c" style="width:37%">'
					  categoryHTML+='  <label class="label-groom" style="text-align:right">Groom </label>'
					categoryHTML+='	<h6 class="estimated-amount">&#8377 70,000</h6>'
				categoryHTML+='	</div>'
			categoryHTML+='	</div>'
				
		categoryHTML+='	</p>'
        
		categoryHTML+='</div>'
		$('.appendcat').append(categoryHTML).enhanceWithin()		 
					 
				},
				error: function(error) {} 
			});
					 
	}
	
};