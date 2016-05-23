var bm = {
	totalbudget : 0,
	balancebudget : 0,
	totalCATbudget : 0,
	totalsubCATbudget : 0,
	pieData : [],
	catid : 0,
	addTotalBudget : function() {
			$("body").addClass("ui-loading");
		if($('#budamt').val()==" ")
			
		{
	   $('#circle').show()
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
										console.log(results)
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
		                                $('#amtspnd').html('Total Budget &#8377 '+bm.totalbudget+'')
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
		$('#amtspnd').html('Total Budget  &#8377 '+num+'')
	  
	   
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
		var addHTML = ''
		 addHTML +='<div class="addsubcat" style="margin:0px" >'
		  addHTML+='<div class="ui-grid-a " style="margin-top:20px;">'
               addHTML+=' <div class="ui-block-a" style="padding-right:10px">'
				addHTML+='    <label class="label-subcategory">Category </label>'
				   addHTML+=' <input type="text" data-wrapper-class="enter-new-category" placeholder="Title"  id="catTitle" >'
				addHTML+='</div>'
		
			   addHTML+=' <div class="ui-block-b" style="padding-left:10px">'
				  addHTML+='  <label class="label-amount">Amount </label>'
			      addHTML+='  <input type="number" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount"  id="estimatedamt">'
			    addHTML+=' </div>'
		   addHTML+=' </div>'
			
		addHTML+='<hr style="color:#fff">'
		
		addHTML+=' <div class=" subcatdiv" style="margin:0px;">'
		  addHTML+='  <input type="text" data-wrapper-class="enter-new-category" placeholder="Title" class="subtitle" >'
		
			addHTML+='<div class="ui-grid-a " style="margin-top:20px;">'
                addHTML+='<div class="ui-block-a" style="padding-right:10px">'
				   addHTML+=' <label class="label-estimated">Estimated </label>'
				   addHTML+=' <input type="number" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount"   class="subamt">'
				addHTML+='</div>'
		 addHTML+='<div class="ui-block-b" style="padding-left:10px">'
				    addHTML+='<label class="label-actual">Actual </label>'
			      addHTML+='  <input type="number" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount" class="spentamt">'
			    addHTML+=' </div>'
		   addHTML+=' </div>'
		    addHTML+='</div>'
		    addHTML+='</div><button class="ui-btn add-fields" id="subcategorybtn" onclick="bm.addsub()"><img src="./img/create-New1.png" height="20" width="20" ></button>'
			
			addHTML+='<div class="ui-grid-a " style="margin-top:5px;">'
                addHTML+='<div class="ui-block-a" style="padding-right:10px">'
				  addHTML+='  <button class="ui-btn clear-category" onclick="bm.hideAddcategory()"><img src="./img/clear.png" height="15" width="15">Clear</button>'
			addHTML+='	</div>'
			
			    addHTML+='<div class="ui-block-b" style="padding-left:10px">'
				  addHTML+='  <button class="ui-btn save-category" onclick="bm.addcategory()"><img src="./img/save-white.png" height="18" width="18">Save</button>'
			  addHTML+='  </div>'
		 addHTML+=' </div>'
		
	$('.addnewCategory').append(addHTML).trigger('create')
		//$('').show()
	},hideAddcategory : function() {
		$('.addnewCategory').html('')
				$('.addnewCategory').hide()
	},
	addcategory : function()
	{   
	var flag = false ;
	var nflag = false ;
	if($('#catTitle').val()=="" || $('#estimatedamt').val()=="")
	{ 
       cm.showToast('all fields are mandatory')
		return;
	}
	else{
		flag=true
	}
	$('.subcatdiv').each(function(index) {
			console.log(index)
			   var title = $(this).find('.subtitle').val()
			   var amt = $(this).find('.subamt').val()
			   var spentamt = $(this).find('.spentamt').val()
			    
				 if(title=="" || amt =="" || spentamt=="")
				 {
					 cm.showToast('all fields are mandatory')
					 return;
				 }
				  else{
					  nflag=true
				  }
		
			 
		});
		if(flag&&nflag)
		{
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
		}	
	/*	}
		else
			cm.showAlert('subcategory budget should be less then category estimate') */
		
	
		
	},
	addsubcategory : function(id)
	{
	  var catid = $(id).data('catid')
		//var subcategoriesList = new Array() 
		var subHTML=""
         
		  subHTML  +='  <hr style="color:#fff">'
		  subHTML  +='  <div class="subcatdiv  abc" style="margin:0px;" >'
		     subHTML  +=' <input type="text" data-wrapper-class="enter-new-category" placeholder="Title" class="subtitle" >'
			
			  subHTML  +='<div class="ui-grid-a " style="margin-top:20px;">'
                subHTML  +='  <div class="ui-block-a" style="padding-right:10px">'
				   subHTML  +='   <label class="label-estimated">Estimated </label>'
				   subHTML  +='   <input type="number" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount"   class="subamt">'
			  subHTML  +='	</div>'
			
			    subHTML  +='  <div class="ui-block-b" style="padding-left:10px">'
				      subHTML  +='<label class="label-actual">Actual </label>'
			        subHTML  +='  <input type="number" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount" class="spentamt">'
			     subHTML  +='  </div>'
		     subHTML  +=' </div>'
		     subHTML  +=' </div>'
		 
		 
	//$('#subcategorybtn').prepend(subHTML)
	 
		
	$('.addsubcat').append(subHTML).trigger('create')

	
		
	},
	addsub : function()
	{
	 
		//var subcategoriesList = new Array() 
		var subHTML=""
         
		  subHTML  +='  <hr style="color:#fff">'
		  subHTML  +='  <div class="subcatdiv " style="margin:0px;">'
		     subHTML  +=' <input type="text" data-wrapper-class="enter-new-category" placeholder="Title" class="subtitle" >'
			
			  subHTML  +='<div class="ui-grid-a " style="margin-top:20px;">'
                subHTML  +='  <div class="ui-block-a" style="padding-right:10px">'
				   subHTML  +='   <label class="label-estimated">Estimated </label>'
				   subHTML  +='   <input type="number" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount"   class="subamt">'
			  subHTML  +='	</div>'
			
			    subHTML  +='  <div class="ui-block-b" style="padding-left:10px">'
				      subHTML  +='<label class="label-actual">Actual </label>'
			        subHTML  +='  <input type="number" data-wrapper-class="enter-new-category" placeholder="&#8377 Amount" class="spentamt">'
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
			var refresh = false
			$('.subcatdiv').each(function(index) {
				console.log('index')
				console.log(index)
				if(index== subcategoriesList.length -1 )
					refresh=true
				 var title = $(this).find('.subtitle').val()
			     var amt = $(this).find('.subamt').val()
			     var spentamt = $(this).find('.spentamt').val()
			   console.log(title)
			   console.log(spentamt)
			   console.log(amt)
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
		 if(refresh){
				$('.addnewCategory').html('')
				$('.addnewCategory').hide()
				bm.getCategoryList() 
		 }
	},
	getCategoryList : function()
	{   $('.appendcat').html('')
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
	{   //alert('yo edit ')
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
				console.log('editcat')
				console.log(catname)
				console.log(catid)
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
	  var sid=0
		 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("ExpenseSubCategory");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
		   TaskManagementQuery.equalTo("categoryID",catid);
		  
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
              $("body").removeClass("ui-loading");
              var editHTML =""
               editHTML +='<div class="white-bg  '+catid+'edited" >'
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
				
		 editHTML +=' <div class="oldsubcat" style="margin:0px;"  data-subid="'+rowOBJ.get('subcategoryID')+'">'
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
		 editHTML +='  <button class="ui-btn add-fields" id="subcategorybtn" data-catid="'+catid+'" onclick="bm.addsubcategory(this)"><img src="./img/create-New1.png" height="20" width="20" ></button>'
			
		 editHTML +='	<div class="ui-grid-a " style="margin-top:5px;">'
            editHTML +='     <div class="ui-block-a" style="padding-right:10px">'
			 editHTML +='	    <button class="ui-btn clear-category" onclick="bm.hideditcategory(this)"  data-id="'+catid+'"><img src="./img/clear.png" height="15" width="15">Clear</button>'
			 editHTML +='	</div>'
			 editHTML +='    <div class="ui-block-b" style="padding-left:10px">'
			editHTML +='	    <button class="ui-btn save-category" onclick="bm.updateCatDB(this)" data-cid="'+catid+'" data-sid="'+results[0].get('subcategoryID')+'"><img src="./img/save-white.png" height="18" width="18">Save</button>'
			editHTML +='   </div>'
		    editHTML +=' </div>'
		    editHTML +='</div>'
		 
			$('.editcategory').show();
		 $('.editcategory').append(editHTML).trigger('create')
		 
} , 
				error : function(error){
					cm.showAlert(error)
				}
			});
	},
	hideditcategory : function(id) {
		$('.editcategory').html('')
		$('.editcategory').hide();
		//var b = $(id).data('id')
		//var c ='.'+b+'edited'
		
		  // $(c).hide()
	},
	updateCatDB : function(id)
	{
	var flag= false
	var nflag= false
	var cflag= false
	var catid = $(id).data('cid')

	if($('#'+catid+'name').val()=="" ||$('#'+catid+'budget').val()==""  ) 
	{
	cm.showToast('all fields are mandatory')
	return;
}else{ cflag=true
}
		$(".oldsubcat").each(function(index) {
			     var title = $(this).find('.subtitle').val()
			     var amt = $(this).find('.subamt').val()
			     var spentamt = $(this).find('.spentamt').val()
				 
				 if(title=="" || amt =="" || spentamt=="")
				 {
					 cm.showToast('all fields are mandatory')
					 return;
				 }
				  else{
					  flag=true
				  }
				 
			});

			if($(".abc").length)
			{
			$(".abc").each(function(index) {
			     var title = $(this).find('.subtitle').val()
			     var amt = $(this).find('.subamt').val()
			     var spentamt = $(this).find('.spentamt').val()
				 if(title=="" || amt =="" || spentamt=="")
				 {
					 cm.showToast('all fields are mandatoryy')
					 return;
				 }
				 else{
					 nflag=true
				 }
				 
			});
	       }
		   else
		   {
			  nflag=true  
		   }
		
		
		
		if(flag&&nflag&&cflag)
		{
		
		var sid = $(id).data('sid')

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
                                       console.log('saving category')
										results.save();
										bm.updateSubCatDB(catid , sid)
										//$(id).attr('src' ,'img/completed.png' )
										
									}
								});
						
					  },
					  error: function(point, error) {
						 cm.showAlert(error)
						
					  }
			});
		}
	},
	updateSubCatDB :  function(catid , sid)
	{

var flag = false
var refreshList= false	  
	var total = $(".oldsubcat").length;

			$(".oldsubcat").each(function(index) {
				console.log('.subcatdiv')
			
				 if(index == total - 1) {
        flag = true
		console.log('last element ')
    }            var subid = $(this).data('subid')
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
										console.log(results)
									}
								});
						
						
						
					  },
					  error: function(point, error) {
						 cm.showAlert(error)
						
					  }
			});
		
			
			});
			
			console.log($(".abc"))
			console.log($(".abc").length)
			
			if($(".abc").length)
			{
			var newsubcat =$(".abc").length
			if(flag)
			{
				flag=false
			$(".abc").each(function(index) {
				console.log('.abc')
				
				
	if (index == newsubcat - 1) {
        refreshList = true
		console.log('last element ')
    }
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
	}
		
			}
			
			else{
				//refreshList=true
				console.log('dznt exist')
					$('.'+catid+'edited').html('')
		$('.'+catid+'edited').hide()
		bm.getCategoryList() 
			}
		if(refreshList)	
		{
			refreshList=false
		$('.'+catid+'edited').html('')
		$('.'+catid+'edited').hide()
		bm.getCategoryList() 
		}
	},
	getSubcatergory : function(catname , catid ,catBudget)
	{
		$('.appendcat').html('')
		var spent = 0 
		//var cbudgt = bm.nfFormatter(catBudget)
		bm.totalsubCATbudget=0
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
					categoryHTML+='	<h6 class="actual-amount" id="'+catid+'spend">&#8377 </h6>'
					categoryHTML+='</div>'
					categoryHTML+='<div class="ui-block-b" style="width:16%">'
					categoryHTML+='    <button class="ui-btn split-active"><img src="./img/split-icon.png" height="16" width="20"></button>'
					categoryHTML+='</div>'
                      categoryHTML+='<div class="ui-block-c" style="width:40%">'
					  categoryHTML+='  <label class="label-estimated" style="text-align:right">Estimated </label>'
						categoryHTML+='<h6 class="estimated-amount" id="'+catid+'estimated-amount">&#8377 '+catBudget+'</h6>'
					categoryHTML+='</div>'
				categoryHTML+='</div>'
				
				categoryHTML+='<div style="margin-top:8px; margin-bottom:5px;">'
				categoryHTML+='    <div id="'+catid+'progressbar" class="progress-line" ></div> '
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
		            	//	$( "#"+catid+'progressbar' ).progressbar()
		            $('.appendcat').append(categoryHTML).enhanceWithin()	
                  //  $('#'+catid+'estimated-amount').html('')
				  //  $('#'+catid+'spend').html('&#8377 '+spent+'')					
		            var balance = bm .totalbudget - bm.totalsubCATbudget	
					var k1 =  bm.nfFormatter(parseInt(bm.totalsubCATbudget))
					$('#amt').html('Actual Spend <br> &#8377 '+k1+'')
				$('#'+catid+'spend').html('')
				  $('#'+catid+'spend').html('&#8377 '+bm.totalsubCATbudget+'')	
                    var k =    bm.nfFormatter(parseInt(balance) )               
					 $('#amtleft').html('')
		            $('#amtleft').html('Balance Left <br> &#8377 '+k+'')	
                 
	              if(bm.totalsubCATbudget > bm .totalbudget)      
				  {
					  $('#circle').circleProgress({ value: 1.0, fill: { color: 'red' }});
			                      
					 $('#amtleft').html('')
		            $('#amtleft').html('Balance Left <br> &#8377 0.0')	
			      }
				  else
				  {
					$('#amtleft').html('')
		            $('#amtleft').html('Balance Left <br> &#8377 '+k+'')	
					 var value =  bm.totalsubCATbudget/bm .totalbudget
					$('#circle').circleProgress({ value: value, fill: { color: 'orange' }}); 
					


					
					
				  }
				
					var val  = parseInt(bm.totalsubCATbudget) / parseInt(catBudget) //*100
			          
					
					 
					  
			
				 /* $( "#"+catid+'progressbar' ).progressbar({
               value: val
            });*/
			$("#"+catid+'progressbar').gradientProgressBar({
					 value: val, // percentage
					 size : 294.0,
					fill: { // gradient fill
					color: 'red'
					 // gradient: ["#d1d1d1", "#d1d1d1", "#d1d1d1"]
					}

					});


				
				},
				error: function(error) {} 
			});
				
	}
	,
	deleteCategory :function(id){
var catid = $(id).data('catid')
cm.catid=catid
  navigator.notification.confirm(
	'Do you want to delete this category?', 
        deletecat, // <-- no brackets
        'Delete Category',
        ['Ok','Cancel']
    );
		
		
}};

function deletecat(buttonIndex)
{
	if(buttonIndex=='1')
	{
	$("body").addClass("ui-loading");
		var TaskManagementClass = Parse.Object.extend('ExpenseCategory');
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("categoryID", cm.catid);
		   TaskManagementQuery.find({
				success:function(foundWish){
				$("body").removeClass("ui-loading");
					foundWish[0].destroy({
						success:function(deletedWishSuccess){
						cm.showToast('deleted')
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
					$("body").removeClass("ui-loading");
					cm.showAlert(error);
				}
			})
	}
}