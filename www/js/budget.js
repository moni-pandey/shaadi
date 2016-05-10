var bm = {
	totalbudget : 0,
	balancebudget : 0,
	totalCATbudget : 0,
	totalsubCATbudget : 0,
	pieData : [],
	addTotalBudget : function() {
		
		if($('#budamt').val()==" ")
		{$('#circle').show()
		$('.total-budget-text').hide()
		$('.amounts').hide()
		$('.save-budget').hide()
		}
		else
		{
			 $("body").addClass("ui-loading");
		 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		  var WeddingClass = Parse.Object.extend('Wedding');
			var WeddingQuery = new Parse.Query(WeddingClass);
			WeddingQuery.equalTo("weddingID",  weddingDetailsObject.weddingId);
			WeddingQuery.first( {
					  success: function(results) {
						   $("body").removeClass("ui-loading");
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
						    $("body").removeClass("ui-loading");
						
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
								bm.totalbudget=amt
									var k =  bm.nfFormatter(parseInt(amt))
										$('#amtspnd').html('')
		                                $('#amtspnd').html('Actual Spend <br> &#8377 '+k+'')
			} ,
			error : function(error){
				
			}
			});
		
	},
	nfFormatter : function(num) {

   /* if (num >= 10000000) {
        k=  (num/10000000).toFixed(1).replace(/\.0$/, '')+ ' Cr';;
     }
    else if (num >= 100000) {
      k=  (num/100000).toFixed(1).replace(/\.0$/, '')+ ' Lac';;
     }
    else  {
        k=  (num/1000).toFixed(1).replace(/\.0$/, '') + ' K';
     }*/
	   if (num >= 10000000) {
        return ( (num/10000000).toFixed(2).replace(/\.0$/, '') + ' Cr');
     }
   else  if (num >= 100000) {
      return ((num/100000).toFixed(2).replace(/\.0$/, '') + ' Lakhs');
     }
     else   {
        return ((num/1000).toFixed(2).replace(/\.0$/, '') + ' K');
     }
	
	   
	   
},	
seebreakup : function()
{ 
         localStorage["pieData"] = JSON.stringify(bm.pieData)
		 $(":mobile-pagecontainer").pagecontainer("change", "see-breakup.html", {
				showLoadMsg: false
			});
},
nFormatter : function(num) {

		var k 
      if (num >= 10000000) {
        k=  (num/10000000).toFixed(2).replace(/\.0$/, '') + ' Cr';;
     }
   else  if (num >= 100000) {
      k=  (num/100000).toFixed(2).replace(/\.0$/, '') + ' Lakhs';;
     }
     else   {
        k=  (num/1000).toFixed(2).replace(/\.0$/, '') + ' K';
     }
	  
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
	},hideAddcategory : function() {
		$('.addnewCategory').hide()
	},
	addcategory : function()
	{   
	var flag = false ;
	
	//$('.subcatdiv').each(function(index) {
            // var amt = $(this).find('.subamt').val()			
		/*	if(amt >  $('#estimatedamt').val() )
			{
				flag=false 
				
				
			}
			 else
			 {
				 flag =true
			 }				 
			     var spentamt = $(this).find('.spentamt').val() 
				 
	});
	    if(flag)
		{*/
		 $("body").addClass("ui-loading");
						
		       var ExpenseCategoryClass = Parse.Object.extend('ExpenseCategory');
				var ExpenseCategoryObj = new ExpenseCategoryClass();
				var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
				ExpenseCategoryObj.set("weddingID", weddingDetailsObject.weddingId);
				ExpenseCategoryObj.set("categoryName", $('#catTitle').val())
				ExpenseCategoryObj.set('budget',$('#estimatedamt').val());
				ExpenseCategoryObj.set('paidBy',localStorage.brideorgroomside);
				 ExpenseCategoryObj.save(null, {
					success: function(wishResults) {
						 $("body").removeClass("ui-loading");
						
						ExpenseCategoryObj.set("categoryID", wishResults.id);
					  ExpenseCategoryObj.save();
					 bm.updatesubcategory(wishResults.id)
			},
					error: function(gameScore, error) {
						 cm.showAlert(error);
						  $("body").removeClass("ui-loading");
						
					}
				})
				
	/*	}
		else
			cm.showAlert('subcategory budget should be less then category estimate') */
		
	
		
	},
	addsubcategory : function()
	{
	
		//var subcategoriesList = new Array() 
		var subHTML=""
         
		  subHTML  +='  <hr style="color:#fff">'
		  subHTML  +='  <div class="ui-grid-a subcatdiv" style="margin:0px;">'
		     subHTML  +=' <input type="text" data-wrapper-class="enter-new-category" placeholder="Title" class="subtitle" >'
			
			  subHTML  +='<div class="ui-grid-a " style="margin-top:20px;">'
                subHTML  +='  <div class="ui-block-a" style="padding-right:10px">'
				   subHTML  +='   <label class="label-estimated">Estimated </label>'
				   subHTML  +='   <input type="text" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount"   class="subamt">'
			  subHTML  +='	</div>'
			
			    subHTML  +='  <div class="ui-block-b" style="padding-left:10px">'
				      subHTML  +='<label class="label-actual">Actual </label>'
			        subHTML  +='  <input type="text" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount" class="spentamt">'
			     subHTML  +='  </div>'
		     subHTML  +=' </div>'
		     subHTML  +=' </div>'
		 
		 
	//$('#subcategorybtn').prepend(subHTML)
	 
		
	$('.addsubcat').append(subHTML).trigger('create')

	
		
	}
	,
	
	updatesubcategory : function(catid)
	{
      $("body").addClass("ui-loading");
						
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
			     var spentamt = $(this).find('.spentamt').val()
			
			    var ExpenseCategoryClass = Parse.Object.extend('ExpenseSubCategory');
				var ExpenseCategoryObj = new ExpenseCategoryClass();
				ExpenseCategoryObj.set("subcategoryName",title)
				ExpenseCategoryObj.set("spent", spentamt)
				ExpenseCategoryObj.set("budget", amt)
				ExpenseCategoryObj.set('paidBy',localStorage.brideorgroomside);
				ExpenseCategoryObj.set("categoryID", catid);
				
				 ExpenseCategoryObj.save(null, {
					success: function(wishResults) {
						 $("body").removeClass("ui-loading");
					  ExpenseCategoryObj.set("subcategoryID", wishResults.id);
					  ExpenseCategoryObj.save();
					
			
				   
				   },
					error: function(gameScore, error) {
						 $("body").removeClass("ui-loading");
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
				 
		       bm.pieData.length=0
			 
				 
				 for(var i = 0 ;i <results.length ;i++)
				 {
					console.log(i)
					 var rowobj = results[i]
				//	 var categoryHTML =""
					 console.log(rowobj)
					 var catname = rowobj.get('categoryName')
					 var catid= rowobj.get('categoryID')
					 bm.totalCATbudget =  parseInt(bm.totalCATbudget) + parseInt(rowobj.get('budget'))
					 var b ={"label" : catname ,"data" : parseInt(rowobj.get('budget'))  }
					 bm.pieData.push(b)
					 bm.getSubcatergory(catname , catid, rowobj.get('budget'))
	
				 }
				 console.log(bm.pieData)
				},
				error : function(error) {
					$("body").removeClass("ui-loading");
					cm.showAlert(error)
				}
			});
	},
	editCategory: function(id)
	{
		var catid =$(id).data('catid')
		 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		var TaskManagementClass = Parse.Object.extend("ExpenseCategory");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
		   TaskManagementQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
		   TaskManagementQuery.equalTo("categoryID",catid);
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
                 $("body").removeClass("ui-loading");
				 var catname = results[0].get('categoryName')
				 var catid = results[0].get('categoryID')
				
				 var budget = results[0].get('budget')
				 bm.subCategorydetails(catname , catid , budget)
				},
				error : function(error){
				 $("body").removeClass("ui-loading");	
				 cm.showAlert(error)
				}
			});
		
	},
	subCategorydetails : function(catname , catid , budget)
	{
	
		 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("ExpenseSubCategory");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
		   TaskManagementQuery.equalTo("categoryID",catid);
		  
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
              $("body").removeClass("ui-loading");
              var editHTML =""
               editHTML +='<div class="white-bg addnewCategory" >'
               editHTML +='<div class="addsubcat" style="margin:0px"  >'
		    
			   editHTML +='<div class="ui-grid-a " style="margin-top:20px;">'
               editHTML +='  <div class="ui-block-a" style="padding-right:10px">'
			   editHTML +='   <label class="label-subcategory">Category </label>'
			   editHTML +='    <input type="text" data-wrapper-class="enter-new-category" id="'+catid+'name" placeholder="Title"   value="'+catname+'" >'
			   editHTML +='	</div>'
			
			   editHTML +='   <div class="ui-block-b" style="padding-left:10px">'
			   editHTML +='	    <label class="label-amount">Amount </label>'
			   editHTML +='      <input type="number" data-wrapper-class="enter-new-category" id="'+catid+'budget" placeholder="&#8377 Amount"  value="'+budget+'">'
			   editHTML +='   </div>'
		       editHTML +='   </div>'
			
		 editHTML +='<hr style="color:#fff">'
			
			for(var k =0 ;k< results.length ;k++)
			{
				var rowOBJ = results[k]
				console.log(rowOBJ)
		 editHTML +=' <div class=" subcatdiv" style="margin:0px;"  data-subid="'+rowOBJ.get('subcategoryID')+'">'
		 editHTML +='    <input type="text" data-wrapper-class="enter-new-category" class="subtitle" id="'+rowOBJ.get('subcategoryID')+'name"  value="'+rowOBJ.get('subcategoryName')+'">'
	     editHTML +='<div class="ui-grid-a " style="margin-top:20px;">'
               editHTML +='  <div class="ui-block-a" style="padding-right:10px">'
				 editHTML +='    <label class="label-estimated">Estimated </label>'
				 editHTML +='    <input type="number" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount" id="'+rowOBJ.get('subcategoryID')+'budget"   class="subamt" value="'+rowOBJ.get('budget')+'">'
			 editHTML +='	</div>'
			
			  editHTML +='   <div class="ui-block-b" style="padding-left:10px">'
				 editHTML +='    <label class="label-actual">Actual </label>'
			    editHTML +='     <input type="number" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount" class="spentamt"  id="'+rowOBJ.get('subcategoryID')+'spent" value="'+rowOBJ.get('spent')+'">'
			   editHTML +='   </div>'
		  editHTML +='   </div>'
		  editHTML +='   </div>'
		  
		}
		  editHTML +='   </div>'
		 editHTML +='  <button class="ui-btn add-fields" id="subcategorybtn" onclick="bm.addsubcategory()"><img src="./img/create-New1.png" height="20" width="20" ></button>'
			
		 editHTML +='	<div class="ui-grid-a " style="margin-top:5px;">'
            editHTML +='     <div class="ui-block-a" style="padding-right:10px">'
			 editHTML +='	    <button class="ui-btn clear-category" onclick="bm.hideAddcategory()"><img src="./img/clear.png" height="15" width="15">Clear</button>'
			 editHTML +='	</div>'
			 editHTML +='    <div class="ui-block-b" style="padding-left:10px">'
			editHTML +='	    <button class="ui-btn save-category" onclick="bm.updateCatDB(this)" data-cid="'+catid+'" ><img src="./img/save-white.png" height="18" width="18">Save</button>'
			editHTML +='   </div>'
		    editHTML +=' </div>'
		    editHTML +='</div>'
		 
		
		 $('.appendcat').before(editHTML).trigger('create')
} , 
				error : function(error){
					cm.showAlert(error)
				}
			});
	},
	updateCatDB : function(id)
	{
		
		var catid = $(id).data('cid')
	
		var catname = $('#'+catid+'name').val()
		var budget = $('#'+catid+'budget').val()
		
			var TaskManagementClass = Parse.Object.extend('ExpenseCategory');
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("categoryID", catid);
			TaskManagementQuery.first( {
					  success: function(results) {
						  
					results.save(null, {
									success: function (results) {

									   results.set("categoryName", catname);
									   results.set("budget", budget);

										results.save();
										bm.updateSubCatDB()
										//$(id).attr('src' ,'img/completed.png' )
										
									}
								});
						
					  },
					  error: function(point, error) {
						 cm.showAlert(error)
						
					  }
			});
		
	},
	updateSubCatDB :  function()
	{
		
			$('.subcatdiv').each(function(index) {
				var subid = $(this).data('subid')
				 var title = $(this).find('.subtitle').val()
			     var amt = $(this).find('.subamt').val()
			     var spentamt = $(this).find('.spentamt').val()
				var TaskManagementClass = Parse.Object.extend('ExpenseSubCategory');
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("subcategoryID", subid);
			TaskManagementQuery.first( {
					  success: function(results) {
						  
					results.save(null, {
									success: function (results) {

									   results.set("subcategoryName", title);
									   results.set("budget", amt);
									   results.set("spent", spentamt);

										results.save();
										
									}
								});
						
						
						
					  },
					  error: function(point, error) {
						 cm.showAlert(error)
						
					  }
			});
		
			
			});
		
		$('.addnewCategory').hide()
		bm.getCategoryList() 
		
	},
	getSubcatergory : function(catname , catid ,catBudget)
	{
		$('.appendcat').html('')
		var spent = 0 
		 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("ExpenseSubCategory");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
		   TaskManagementQuery.equalTo("categoryID",catid);
		  
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
                 $("body").removeClass("ui-loading");
				 var categoryHTML =""
			categoryHTML+='<div data-role="collapsible" data-icon="none" and data-iconpos="none" class="custom-accordion" id="'+catid+'profile">'
           categoryHTML+='<h1><div class="ui-grid-a" style="border-bottom:1px solid #e0e0e0; padding-bottom:4px;">'
           categoryHTML+='<div class="ui-block-a" >'
		   categoryHTML+='<p class="category-label">' + catname + '</p></div>'
		   categoryHTML+='<div class="ui-block-b edit-delete-category-info">'
		   categoryHTML+=' <img src="./img/edit-gray.png" height="16" width="20" onclick="bm.editCategory(this)"  data-catid="'+catid+'" >'
		  categoryHTML+='<img src="./img/divider.png" height="17" width="3">'
		       categoryHTML+='<img src="./img/delete-budget.png" height="16" width="16" style="vertical-align:1px;" onclick="bm.deleteCategory(this)" data-catid="'+catid+'">'
		        categoryHTML+='<img src="./img/down-arrow.png" height="8" width="14" class="down-icon">'
					categoryHTML+='</div>'
				categoryHTML+='</div>'
				
				categoryHTML+='<div class="ui-grid-b" style="margin-top:5px;">'
                 categoryHTML+='   <div class="ui-block-a" style="width:44%">'
					categoryHTML+='    <label class="label-actual">Actual </label>' 
					categoryHTML+='	<h6 class="actual-amount" id="'+catid+'spend">&#8377 70,000</h6>'
					categoryHTML+='</div>'
					categoryHTML+='<div class="ui-block-b" style="width:16%">'
					categoryHTML+='    <button class="ui-btn split-active"><img src="./img/split-icon.png" height="16" width="20"></button>'
					categoryHTML+='</div>'
categoryHTML+='<div class="ui-block-c" style="width:40%">'
					  categoryHTML+='  <label class="label-estimated" style="text-align:right">Estimated </label>'
						categoryHTML+='<h6 class="estimated-amount">&#8377 '+catBudget+'</h6>'
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
				     spent+=parseInt(rowobj.get('spent'))
					 console.log(spent)
					 bm.totalsubCATbudget=  parseInt( bm.totalsubCATbudget) + parseInt(rowobj.get('spent'))
					 
					  categoryHTML+='<tr>'
                      categoryHTML+='  <td style="width:44%" class="subcategory-name" >' + rowobj.get('subcategoryName') + '</td>'
                      categoryHTML+='  <td style="width:16%"><button class="ui-btn split-subcategory-active"><img src="./img/split-icon.png" height="16" width="20"></button></td>'
                      categoryHTML+='  <td class="subcategory-amount" style="width:40%">&#8377 ' + rowobj.get('spent') +'</td>'
					 categoryHTML+=' </tr>'
					 
					 
				 }
				 $('#'+catid+'spend').html('')
				 $('#'+catid+'spend').html('&#8377 '+spent+'')
				categoryHTML+='</tbody>'
				categoryHTML+='</table>'
				
				categoryHTML+='<button class="ui-btn add-fields"><img src="./img/create-New1.png" height="20" width="20"></button>'
				
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
		            var balance = bm .totalbudget - bm.totalsubCATbudget	
                    var k =    bm.nfFormatter(parseInt(balance) )               
					 $('#amtleft').html('')
		            $('#amtleft').html('Balance Left <br> &#8377 '+k+'')	
                 
	              if(bm.totalsubCATbudget > bm .totalbudget)      
				  {
					  $('#circle').circleProgress({ value: 1.0, fill: { color: 'red' }});
			                      
					 $('#amtleft').html('')
		            $('#amtleft').html('Balance Left <br> &#8377 0')	
			      }
				  else
				  {
					$('#amtleft').html('')
		            $('#amtleft').html('Balance Left <br> &#8377 '+k+'')	
					 var value =  (parseInt(bm.totalsubCATbudget))/parseInt(bm .totalbudget)
					$('#circle').circleProgress({ value: value, fill: { color: 'orange' }}); 
				  }
					
					
				},
				error: function(error) {} 
			});
				
	}
	,
	deleteCategory :function(id){
		var catid = $(id).data('catid')
		var TaskManagementClass = Parse.Object.extend('ExpenseCategory');
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("categoryID", catid);
		   TaskManagementQuery.find({
				success:function(foundWish){
				
					foundWish[0].destroy({
						success:function(deletedWishSuccess){
						cm.showAlert('deleted')
						//$('#'+catid+"profile").hide()
						bm.getCategoryList()
						//taskmthds.pendingList()
						},
						error:function(deleteWishError){
							
							cm.showAlert(deleteWishError);
						}
					})
				},
				error:function(wishError){
					
					cm.showAlert("error");
				}
			})
		
}};