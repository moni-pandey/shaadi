var weddingcard = {
	 likecount :0 ,
	sampleArray : [],
	sampleorderid :0 ,
	cardArray :[],
	base64 : "" ,
	filename: "" ,
	listform: "" ,
	guestListArray :[],
	gotofavlist :function() {
		 
		 localStorage.favcount=weddingcard.likecount;
		  $(":mobile-pagecontainer").pagecontainer("change", "favourites.html", {
            showLoadMsg: false
        });
	 },
	getfavcount : function() {
		 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		  console.log(JSON.parse(localStorage.weddingDetailsObject))
		var favCardClass = Parse.Object.extend("favCard");
        var favCardQuery = new Parse.Query(favCardClass);
        favCardQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
        //$("body").addClass("ui-loading");
        favCardQuery.find({
            success:function(results){
             $('.fav-count').html(results.length)
			 weddingcard.likecount=results.length
            },
            error:function(wishError){
                //$("body").removeClass("ui-loading");
                cm.showToast("no fav");
            }
        })
		
	},
	fetchcardlist : function() {
		var CardlistClass = Parse.Object.extend("card");
        var Cardlist = new Parse.Query(CardlistClass);
		
        $("body").addClass("ui-loading");
        Cardlist.find({
            success:function(results){
			 console.log(results)
			
             $("body").removeClass("ui-loading");
			 if(results.length)
			 {
				 
			   for (var i = 0; i < results.length; i++) {
				   console.log('results[i]')
				   console.log(results[i])
				  // consresults[i])
			     var rowObject =results[i];
				 var cardid = rowObject.get('cardID');
				 console.log(cardid)
				weddingcard.setcardlisthtml(rowObject);
				
				 }//end for 
              }//end if
			 else 
			 {
				 cm.showToast('no card available')
			 }//end else
            }//end success
		,
            error:function(wishError){
               $("body").removeClass("ui-loading");
                cm.showToast("no fav");
            }
        })
		
	},
	setcardlisthtml :function(rowObject)
   {   var cardlistHTML=''
		var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		 cardetailsobject = new Object()
		 cardetailsobject.img1=rowObject.get('imgurl1')
		 cardetailsobject.img2=rowObject.get('imgurl2')
		 cardetailsobject.img3=rowObject.get('imgurl3')
		 cardetailsobject.cardID=rowObject.get('cardID')
		 cardetailsobject.price=rowObject.get('price')
		 cardetailsobject.color=rowObject.get('color')
		 cardetailsobject.theme=rowObject.get('theme')
		 cardetailsobject.type=rowObject.get('type')
		 cardetailsobject.orientation=rowObject.get('orientation')
		 cardetailsobject.name=rowObject.get('cardName')
		 cardetailsobject.printing=rowObject.get('printing')
		 cardetailsobject.best=rowObject.get('bestSeller')
		 cardetailsobject.cardtype=rowObject.get('cardtype')
		 weddingcard.cardArray.push(cardetailsobject)
		 console.log(weddingcard.cardArray)
		 var favCardClass = Parse.Object.extend("favCard");
				 var favCardQuery = new Parse.Query(favCardClass);
				 favCardQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
				 favCardQuery.equalTo("cardID", rowObject.get('cardID'));
				 
					//$("body").addClass("ui-loading");
					favCardQuery.find({
						success:function(results){
							console.log(results.length)
							
						 if(results.length)
						 {
							 cardlistHTML +=' <div class="profile-detail">';
							 cardlistHTML +='<img class="wedding-card-img" data-cardtype="'+rowObject.get('cardtype')+'" data-cardid="'+rowObject.get('cardID')+'" src="'+rowObject.get('imgurl1')+'" data-like="liked"  onclick="weddingcard.getcarddetails(this)" data-i2="'+rowObject.get('imgurl2')+'" data-i3="'+rowObject.get('imgurl3')+'"  id="'+rowObject.get('cardID')+'"  data-cname="'+rowObject.get('cardName')+'" data-type="'+rowObject.get('type')+'" data-theme="'+rowObject.get('theme')+'" data-price="'+rowObject.get('price')+'" data-orientation="'+rowObject.get('orientation')+'" data-printing="'+rowObject.get('printing')+'" data-best="'+rowObject.get('bestSeller')+'" data-color="'+rowObject.get('color')+'">'
							 cardlistHTML +='<img src="img/fav-on.png" class="add-favorites-icon" data-cardid="'+rowObject.get('cardID')+'" id="'+rowObject.get('cardID')+'fav" onclick="weddingcard.likeproduct(this)" data-like="liked">';
							 cardlistHTML +='<p class="card-name-n-price">'+rowObject.get('cardName')+'<span>&#8377 '+rowObject.get('price')+'/-</span></p>';
							 cardlistHTML +=' </div>' 
							
						 }//end if 
						 else
						 {
							 cardlistHTML +=' <div class="profile-detail">';
							 cardlistHTML +='<img class="wedding-card-img" data-cardtype="'+rowObject.get('cardtype')+'" data-cardid="'+rowObject.get('cardID')+'"  onclick="weddingcard.getcarddetails(this)" data-like="unlike" data-cname="'+rowObject.get('cardName')+'" data-type="'+rowObject.get('type')+'" src="'+rowObject.get('imgurl1')+'"  data-i2="'+rowObject.get('imgurl2')+'" data-i3="'+rowObject.get('imgurl3')+'" id="'+rowObject.get('cardID')+'" data-theme="'+rowObject.get('theme')+'" data-price="'+rowObject.get('price')+'" data-orientation="'+rowObject.get('orientation')+'" data-printing="'+rowObject.get('printing')+'" data-best="'+rowObject.get('bestSeller')+'" data-color="'+rowObject.get('color')+'">'
							 cardlistHTML +='<img src="img/fav-off.png" class="add-favorites-icon" data-cardid="'+rowObject.get('cardID')+'" id="'+rowObject.get('cardID')+'fav" onclick="weddingcard.likeproduct(this)" data-like="unlike">';
							 cardlistHTML +='<p class="card-name-n-price">'+rowObject.get('cardName')+'<span>&#8377 '+rowObject.get('price')+'/-</span></p>';
							 cardlistHTML +=' </div>'
							
						 }//end else 
							 
							$('.cardlist').append(cardlistHTML); 
						 
						},
						error:function(wishError){
							//$("body").removeClass("ui-loading");
							cm.showToast("no fav");
						}
					})
		
		
	},
		likeprod : function(id)
	{  
		var cardid = localStorage.cardid
		//alert(cardid)
		var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		if($('.addtofav').data('like')=='liked')
		{
	    var addfavClass = Parse.Object.extend("favCard");
        var addfavQuery = new Parse.Query(addfavClass);
        addfavQuery.equalTo("cardID", cardid);
        addfavQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
        addfavQuery.find({
            success:function(foundWish){
                foundWish[0].destroy({
                    success:function(deletedWishSuccess){
                  $('.addtofav').data('like','unlike')
				  $('.add-favorites-icon').attr("src","img/fav-off.png");
				
			 localStorage.favcount--
			   $('.fav-count').html(localStorage.favcount)
                    },
                    error:function(deleteWishError){
                        
                        cm.showAlert("error");
                    }
                })
            },
            error:function(wishError){
                
                cm.showAlert("error");
            }
        })
		
		
		
		
		}//end if
		else 
		{
			//add to favcard table and 
			var addfavClass = Parse.Object.extend("favCard");
            var addfavObj = new addfavClass();
            addfavObj.set("cardID", cardid);
            addfavObj.set("weddingID", weddingDetailsObject.weddingId);
			 addfavObj.save(null, {
                success: function(wishResults) {
                  addfavObj.save();
                  console.log('liked')
				  $('.addtofav').data('like','liked')
				  $('.add-favorites-icon').attr("src","img/fav-on.png");
				   localStorage.favcount++
			   $('.fav-count').html(localStorage.favcount)
               },
                error: function(gameScore, error) {
                     cm.showAlert("error");
                }
            })
			
		}
		
		
	},
	likeproduct : function(id)
	{  
		var cardid = $(id).data('cardid')
		if(weddingcard.likecount==0)
		weddingcard.likecount=localStorage.favcount
		var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		if($(id).data('like')=='liked')
		{
	    var addfavClass = Parse.Object.extend("favCard");
        var addfavQuery = new Parse.Query(addfavClass);
        addfavQuery.equalTo("cardID", cardid);
        addfavQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
        addfavQuery.find({
            success:function(foundWish){
                foundWish[0].destroy({
                    success:function(deletedWishSuccess){
                  $(id).data('like','unlike')
				  $(id).attr("src","img/fav-off.png");
				
			 weddingcard.likecount--
			   $('.fav-count').html(weddingcard.likecount)
                    },
                    error:function(deleteWishError){
                        
                        cm.showAlert("error");
                    }
                })
            },
            error:function(wishError){
                
                cm.showAlert("error");
            }
        })
		
		
		
		
		}//end if
		else 
		{
			//add to favcard table and 
			var addfavClass = Parse.Object.extend("favCard");
            var addfavObj = new addfavClass();
            addfavObj.set("cardID", cardid);
            addfavObj.set("weddingID", weddingDetailsObject.weddingId);
			 addfavObj.save(null, {
                success: function(wishResults) {
                  addfavObj.save();
                  console.log('liked')
				  $(id).data('like','liked')
				  $(id).attr("src","img/fav-on.png");
				   weddingcard.likecount++
			   $('.fav-count').html(weddingcard.likecount)
               },
                error: function(gameScore, error) {
                     cm.showAlert("error");
                }
            })
			
		}
		
		
	},
	getfavlist : function()
	{
		
	   var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		var favCardClass = Parse.Object.extend("favCard");
        var favCardQuery = new Parse.Query(favCardClass);
        favCardQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
        
        favCardQuery.find({
            success:function(results){
				
             if(results.length)
			 {
				for(var j=0;j<results.length ;j++)
				{
					var rowObject = results[j]
					
					weddingcard.setfavlisthtml(rowObject);
					
				}					
			 }
			 else
			 {
				cm.showToast('no favorites') 
			 }
            },
            error:function(wishError){
                //$("body").removeClass("ui-loading");
                cm.showToast("no fav");
            }
        })
		
		
	},
	setfavlisthtml : function(rowbject)
	{   
	   
		var CardlistClass = Parse.Object.extend("card");
        var Cardlist = new Parse.Query(CardlistClass);
		 Cardlist.equalTo("cardID" ,rowbject.get('cardID'));
        Cardlist.find({
            success:function(results){
			 
				var rowObject= results[0]
				console.log(results)
				console.log(results[0])
		                     var cardlistHTML =''
		                     cardlistHTML +=' <div class="profile-detail">';
							 cardlistHTML +='<img class="wedding-card-img" data-cardtype="'+rowObject.get('cardtype')+'" src="'+rowObject.get('imgurl1')+'"  id="'+rowObject.get('cardID')+'" data-theme="'+rowObject.get('theme')+'" data-price="'+rowObject.get('price')+'" data-orientation="'+rowObject.get('orientation')+'" data-printing="'+rowObject.get('printing')+'" data-best="'+rowObject.get('bestSeller')+'" data-color="'+rowObject.get('color')+'">'
							 cardlistHTML +='<img src="img/fav-on.png" class="add-favorites-icon" data-cardid="'+rowObject.get('cardID')+'" id="'+rowObject.get('cardID')+'favlist" data-like="liked">';
							 cardlistHTML +='<img src="img/uncheck.png" class="check-uncheck-icon" data-check="uncheck" data-checkedid="'+rowObject.get('cardID')+'" onclick="weddingcard.getselecteditem(this)">';
							 cardlistHTML +='<p class="card-name-n-price">'+rowObject.get('cardName')+'<span>&#8377 '+rowObject.get('price')+'/-</span></p>';
							 cardlistHTML +=' </div>' 
							 
							 
		$('.cardlist').append(cardlistHTML);	 
             
            }//end success
		,
            error:function(wishError){
            
                cm.showToast("error");
            }
        })
	}
	,
	getselecteditem : function(id)
	{
	var cardid= $(id).data('checkedid')
	var price =$('#'+cardid).data('price')
    	
	if( $(id).data('check')== 'uncheck' )
	{  
		 $(id).data('check','checked')
		 $(id).attr("src","img/check.png");
		 var c ={"cardid": cardid ,"price":price }
		weddingcard.sampleArray.push(c)
		console.log(weddingcard.sampleArray)
		
		
	}
	else
	{
		 $(id).data('check','uncheck')
		 $(id).attr("src","img/uncheck.png");
		 for(var k=0 ;k <weddingcard.sampleArray.length ;k++) 
		 {
			 if(weddingcard.sampleArray[k].cardid==cardid)
				 weddingcard.sampleArray.splice(k,1)
		}	
	 
	}
	
		
	},
	updatesampleorder:function()
	{
		 
		localStorage["sampleorderlist"] = JSON.stringify(weddingcard.sampleArray);
		console.log('JSON.parse(localStorage["sampleorderlist"])')
		console.log(JSON.parse(localStorage["sampleorderlist"]))
		
		if(weddingcard.sampleArray.length==0)
		{
			cm.showToast('No item selected')
			return ;
			
		}else 
		{
		 if(weddingcard.sampleArray.length==1)	
		 {
			   var sampleorder = Parse.Object.extend("sampleOrderItem");
             var sampleorderObj = new sampleorder();
			 sampleorderObj.set("cardID", weddingcard.sampleArray[0].cardid);
			  sampleorderObj.save(null, {
                success: function(wishResults) {
				console.log(wishResults.id)
				
				 sampleorderObj.set("sampleOrderID", wishResults.id);
				 weddingcard.sampleorderid=wishResults.id;
				 //alert(weddingcard.sampleorderid)

				 sampleorderObj.save();
				 
				   $(":mobile-pagecontainer").pagecontainer("change", "sendtome.html", {
            showLoadMsg: false
        });
		
	
			  
               },
                error: function(gameScore, error) {
                     cm.showAlert("error 1");
                }
            })
		 }
		 
		 else
		 {
			   
		      
			   var sampleorder = Parse.Object.extend("sampleOrderItem");
               var sampleorderObj = new sampleorder();
			   sampleorderObj.set("cardID", weddingcard.sampleArray[0].cardid);
			   sampleorderObj.save(null, {
                success: function(wishResults) {
				console.log(wishResults.id)
				
				 sampleorderObj.set("sampleOrderID", wishResults.id);
				 weddingcard.sampleorderid=wishResults.id;
				// alert(weddingcard.sampleorderid)

				 sampleorderObj.save();
		          weddingcard.createsampleorderitem()
	
			  
               },
                error: function(gameScore, error) {
                     cm.showAlert("error 1");
                }
            })  
			
		
			 
		 }//inner else 
		 
		 
			
		}
		  	//for( var k =1 ;k < weddingcard.sampleArray.length ;k++) 
		 //{  
	 //alert(weddingcard.sampleorderid)
	       // weddingcard.createsampleorderitem(weddingcard.sampleArray[k])
		 
	//} 
		
		
	
   
	},
	ordersamples : function() {
		
		if($('#fname').val()=="")
			 cm.showAlert('Enter first name')
		else if($('#lname').val()=="")
			 cm.showAlert('Enter last name')
	    else if($('#email').val()=="")
			 cm.showAlert('Enter email')
		  else if($('#addr').val()==" ")
			 cm.showAlert('Enter address')
		 else if($('#number').val()=="")
			 cm.showAlert('Enter pincode')
		 else if($('.enter-address').val()=="")
			 cm.showAlert('Enter address')
		  else if (cm.isValidEmail($("#email").val()))
            cm.showAlert("Please enter valid Email");
		 else 
		 {
			 var ordercost =0
			 var pincode = $('#addr').val()
		     var fname = $('#fname').val()
			 var lname = $('#lname').val()
			 var email = $('#email').val()
			 var number = $('#number').val()
			 var address = $('.enter-address').val()
			 var name = fname +" "+ lname 
			 console.log(name)
			 console.log(number)
			 console.log(pincode)
			 console.log(email)
			 console.log(address)
			 
			 var sortprice = new Array()
			 sortprice = JSON.parse(localStorage["sampleorderlist"]) ;
			 console.log('sortprice')
			 console.log(sortprice)
			 sortprice.sort(function(a, b) {
              return (a.price) - (b.price);
              });
			 console.log(sortprice)
			

//firsttime
			
			 
			 
	if(localStorage.alreadyordered=='true')		
	{
		localStorage.alreadyordered=false
				for(var h = 0 ;h <sortprice.length ;h++)
                    ordercost= parseInt(sortprice[h].price) +parseInt(ordercost)
				alert(ordercoset)
				 
             ordercost = parseInt((sortprice.length * 10 )) + parseInt(ordercost)			 
                   console.log(sortprice[h].price)
		
	}
	else{
		
		if(sortprice.length<=5)
				  ordercost = 0
			  else
			 {
				  
				for(var h =sortprice.length-1 ;h >4 ;h--)
                    ordercost= parseInt(sortprice[h].price) +parseInt(ordercost)
                   console.log(sortprice[h].price)				
			 }
			ordercost = parseInt(((sortprice.length-5) * 10 )) + parseInt(ordercost) 
			 
	}
			 //have already ordered samples
			 //wedding.oldcustomer()
			 
			var sampleOrderClass = Parse.Object.extend("sampleOrder");
             var sampleOrderObj = new sampleOrderClass();
             sampleOrderObj.set("sampleorderID", localStorage.localsampleid);
             sampleOrderObj.set("userID", localStorage.userId);
             sampleOrderObj.set("receipientName", name);
             sampleOrderObj.set("shippingAddr", address);
             sampleOrderObj.set("conatctno", parseInt(number));
             sampleOrderObj.set("orderCost", parseInt(ordercost));
			 sampleOrderObj.save(null, {
             success: function(wishResults) {
             sampleOrderObj.save();
             console.log('sampleorderdetailsaved')
			 cm.showAlert('order successful')
			  $(":mobile-pagecontainer").pagecontainer("change", "card_List.html", {
            showLoadMsg: false
        });
				 
               },
                error: function(gameScore, error) {
                     cm.showAlert(error);
                }
            })
			 
			 
			 
			 
		 }//end else 
		 
		
		
	},
	createsampleorderitem : function()
	{
		//alert(weddingcard.sampleorderid)
		var count =1
		for( var k =1 ;k < weddingcard.sampleArray.length ;k++) 
		{	
	         var sampleorder = Parse.Object.extend("sampleOrderItem");
             var sampleorderObj = new sampleorder();
			  sampleorderObj.set("sampleOrderID",weddingcard.sampleorderid);
			 sampleorderObj.set("cardID", weddingcard.sampleArray[k].cardid);
			  sampleorderObj.save(null, {
                success: function(wishResults) {
				console.log(wishResults.id)
				

				 sampleorderObj.save();
			
		 
		
			  
               },
                error: function(gameScore, error) {
                     cm.showAlert("error 1");
                }
            })
			//alert(count)
			 if(count == weddingcard.sampleArray.length-1)
				 {
					 localStorage.localsampleid=weddingcard.sampleorderid;
	 $(":mobile-pagecontainer").pagecontainer("change", "sendtome.html", {
            showLoadMsg: false
        });
		 }	
		 count++
			
	}
		
	
	}
	,
	getcarddetails : function(id)
	{
		localStorage.i1= $(id).attr('src')
		localStorage.i2= $(id).data('i2')
		localStorage.i3= $(id).data('i3')
		localStorage.theme= $(id).data('theme')
		localStorage.color= $(id).data('color')
		localStorage.price= $(id).data('price')
		localStorage.orientation= $(id).data('orientation')
		localStorage.printing= $(id).data('printing')
		localStorage.best= $(id).data('best')
		localStorage.type= $(id).data('type')
		localStorage.cname = $(id).data('cname')
		localStorage.cardid = $(id).data('cardid')
		localStorage.cardtype = $(id).data('cardtype')
		localStorage.linkeunlike=$(id).data('like')
		localStorage.favcount=weddingcard.likecount;
		if(localStorage.cardtype=='e')
			 $(":mobile-pagecontainer").pagecontainer("change", "e_Card.html", {
            showLoadMsg: false
        });
		else
		 $(":mobile-pagecontainer").pagecontainer("change", "card_View.html", {
            showLoadMsg: false
        });
		
		
	},
	oldcustomer :function()
	{
		 var sampleOrderClass = Parse.Object.extend("sampleOrder");
            // var sampleOrderObj = new sampleOrderClass();
			  var sampleOrderObj = new Parse.Query(sampleOrderClass)
            sampleOrderObj.equalTo("userID", localStorage.userId);
             sampleOrderObj.equalTo("orderCost", parseInt(0));
        sampleOrderObj.find({
            success:function(results){
             if(results.length)
			 {
				 
				// cm.showAlert('have already ordered samples')
				localStorage.alreadyordered=true
				 weddingcard.updatesampleorder()
			 }
			 else 
			 {
				 weddingcard.updatesampleorder()
				 
			 }
			
            },
            error:function(wishError){
                //$("body").removeClass("ui-loading");
                cm.showToast("no fav");
            }
        })
		
		
	},
	cardfilter : function()
	{  
	   
		console.log(weddingcard.cardArray)
		localStorage.favcount=weddingcard.likecount;
        localStorage["card"]= JSON.stringify(weddingcard.cardArray)
		 $(":mobile-pagecontainer").pagecontainer("change", "card_Filter.html", {
            showLoadMsg: false
        });
	},cardfilteragn : function()
	{  
	   
		
		 $(":mobile-pagecontainer").pagecontainer("change", "card_Filter.html", {
            showLoadMsg: false
        });
	},
	calQuantity : function(id)
	{    var value=0
		var id = $(id).attr('id')
		if(id=='plus')
		{
			value = $('.input-card-quantity').val()
			value++
			$('.input-card-quantity').val(value)
			
		}
		else
		{
			value = $('.input-card-quantity').val()
			if(value==0)
				$('.input-card-quantity').val(value)
			else
			{value--
			$('.input-card-quantity').val(value)}
			
		}
		var total = parseInt(value) * parseInt(localStorage.price)
		$('.totalamtt').html('<span>&#8377</span>' + total)
	},
	yourorder:function()
	{  var value=0
	value = $('.input-card-quantity').val()
	  var total = parseInt(value) * parseInt(localStorage.price)
	  localStorage.totalamt=parseInt(value)* parseInt(localStorage.price)
	
	  localStorage.quantity=value
	  
		 $(":mobile-pagecontainer").pagecontainer("change", "your_Order-detail.html", {
            showLoadMsg: false
        });
		
	},
	
	sendtoguest : function()
	{
		$(":mobile-pagecontainer").pagecontainer("change", "guest.html", {
            showLoadMsg: false
        });
		
	}
	,
	uploadfile :function(evt)
	{ 
	
    var files = document.getElementById("profilePhotoFileUpload");
    var file = files.files[0];
    weddingcard.filename = files.files[0].name
    if (files && file) {
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
            var binaryString = readerEvt.target.result;
            weddingcard.base64= btoa(binaryString);
        };

        reader.readAsBinaryString(file);
		weddingcard.listform = "file"
		
		cm.showToast('uploaded')
    }else
	{
		cm.showAlert('choose file')
	}

		/***************************************************/
	
		  




	},
	send_self()
	{
		
		 $(":mobile-pagecontainer").pagecontainer("change", "sendtoself.html", {
            showLoadMsg: false
        });
		
	},
	ordercard()
	{
		
		if($('#fname').val()=="")
			 cm.showAlert('Enter first name')
		else if($('#lname').val()=="")
			 cm.showAlert('Enter last name')
	    else if($('#email').val()=="")
			 cm.showAlert('Enter email')
		  else if($('#addr').val()==" ")
			 cm.showAlert('Enter address')
		 else if($('#number').val()=="")
			 cm.showAlert('Enter pincode')
		 else if($('.enter-address').val()=="")
			 cm.showAlert('Enter address')
		  else if (cm.isValidEmail($("#email").val()))
            cm.showAlert("Please enter valid Email");
		 else 
		 {
			
			 var pincode = $('#addr').val()
		     var fname = $('#fname').val()
			 var lname = $('#lname').val()
			 var email = $('#email').val()
			 var number = $('#number').val()
			 var address = $('.enter-address').val()
			 var name = fname +" "+ lname 
			 console.log(name)
			 console.log(number)
			 console.log(pincode)
			 console.log(email)
			 console.log(address)
			 
			 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		     var sc =parseInt(localStorage.quantity)*10
			 var sampleorder = Parse.Object.extend("order");
             var sampleorderObj = new sampleorder();
			 // sampleorderObj.set("sampleOrderID",weddingcard.sampleorderid);
			 sampleorderObj.set("shipTo", "self")
			 //sampleorderObj.set("file", "");
			 sampleorderObj.set("noOfItems", parseInt(localStorage.quantity));
			 sampleorderObj.set("cardID", localStorage.cardid);
			 sampleorderObj.set("weddingID", weddingDetailsObject.weddingId);
			 sampleorderObj.set("shippingCost",parseInt(sc ));
			 sampleorderObj.set("totalAmt",parseInt(localStorage.totalamt) );
			 sampleorderObj.set("orderBy",localStorage.userId );
			  sampleorderObj.save(null, {
                success: function(wishResults) {
				console.log(wishResults.id)
				
            sampleorderObj.set("orderID",wishResults.id );
				 sampleorderObj.save();
			     weddingcard.saveRecipient(wishResults.id )
		        
			  
               },
                error: function(gameScore, error) {
                     cm.showAlert(error);
                }
            })
		
		
	}},
	saveRecipient(id)
	{
		 var pincode = $('#addr').val()
		     var fname = $('#fname').val()
			 var lname = $('#lname').val()
			 var email = $('#email').val()
			 var number = $('#number').val()
			 var address = $('.enter-address').val()
			 var name = fname +" "+ lname 
	
			 var sampleorder = Parse.Object.extend("recipient");
             var sampleorderObj = new sampleorder();
			 // sampleorderObj.set("sampleOrderID",weddingcard.sampleorderid);
			 sampleorderObj.set("guestID", localStorage.userId)
		      sampleorderObj.set("orderID", id);
			
			 sampleorderObj.set("recepientName",name);
			 sampleorderObj.set("shippingAddr",address);
			 sampleorderObj.set("contactNo",parseInt(number));
			  sampleorderObj.save(null, {
                success: function(wishResults) {
				console.log(wishResults.id)
				
          //  sampleorderObj.set("orderID",wishResults.id );
				 sampleorderObj.save();
			 cm.showToast('order successful')
				  $(":mobile-pagecontainer").pagecontainer("change", "card_List.html", {
            showLoadMsg: false
        });	
			    
		        
		        
			  
               },
                error: function(gameScore, error) {
                     cm.showAlert(error);
                }
            })
		
	}//send to selected contacts 
	,
	updateDB : function()
	{
		var typelist =''
		var contact= false
		if(weddingcard.listform =='file')
		      typelist= 'file'
		  else if(weddingcard.listform=='contacts')
		        typelist= 'contacts'
			else
			{typelist="email" }
			 var selectedContacts = $("#contactList li");
                weddingcard.guestListArray.length = 0;
				selectedContacts.each(function(index, item) {
            if($(item).hasClass("single-selected")) {
			   var contactObject = {}; 
			         contactObject.guestid = $(item).data("guestid");
                    contactObject.guestname = $(item).find('h2').html();
                    contactObject.guestphone = $(item).data("mobilenumber");
					 weddingcard.guestListArray.push(contactObject);
					 
			}});
	
	if(weddingcard.listform=='file')		
	{ 

         var parseFile = new Parse.File(weddingcard.filename, { base64: weddingcard.base64 });
		 parseFile.save().then(function() {
         /// alert("filesaved")
		  var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		     var sc =parseInt(localStorage.quantity)*10
			 var sampleorder = Parse.Object.extend("order");
             var sampleorderObj = new sampleorder();
			 // sampleorderObj.set("sampleOrderID",weddingcard.sampleorderid);
			 sampleorderObj.set("shipTo", typelist)
			 sampleorderObj.set("file", parseFile);
			 sampleorderObj.set("noOfItems", parseInt(localStorage.quantity));
			 sampleorderObj.set("cardID", localStorage.cardid);
			 sampleorderObj.set("weddingID", weddingDetailsObject.weddingId);
			 sampleorderObj.set("shippingCost",parseInt(sc ));
			 sampleorderObj.set("totalAmt",parseInt(localStorage.totalamt) );
			 sampleorderObj.set("orderedBy",localStorage.userId );
			  sampleorderObj.save(null, {
                success: function(wishResults) {
				console.log(wishResults.id)
				//alert('yooyooyoyo')
            sampleorderObj.set("orderID",wishResults.id );
				 sampleorderObj.save();
			     weddingcard.saveRecipient(wishResults.id )
		        
			  
               },
                error: function(gameScore, error) {
                     cm.showAlert(error);
                }
            })		
		 }, function(error) {
 cm.showAlert(error.message)
});
	}else if(typelist=='email'&& weddingcard.guestListArray.length !=0)
		 {
			   
			console.log(weddingcard.guestListArray)
			  var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		     var sc =parseInt(localStorage.quantity)*10
			 var sampleorder = Parse.Object.extend("order");
             var sampleorderObj = new sampleorder();
			 // sampleorderObj.set("sampleOrderID",weddingcard.sampleorderid);
			 sampleorderObj.set("shipTo", 'contacts')
			// sampleorderObj.set("file", parseFile);
			 sampleorderObj.set("noOfItems", parseInt(localStorage.quantity));
			 sampleorderObj.set("cardID", localStorage.cardid);
			 sampleorderObj.set("weddingID", weddingDetailsObject.weddingId);
			 sampleorderObj.set("shippingCost",parseInt(sc ));
			 sampleorderObj.set("totalAmt",parseInt(localStorage.totalamt) );
			 sampleorderObj.set("orderedBy",localStorage.userId );
			  sampleorderObj.save(null, {
                success: function(wishResults) {
				console.log(wishResults.id)
				//alert('yooyooyoyo')
                sampleorderObj.set("orderID",wishResults.id );
				 sampleorderObj.save();
				// for(var i=0 ;i<weddingcard.guestListArray.length ;i++)
					//alert(wishResults.id)
			     weddingcard.guestRecipient(wishResults.id )
		        
			  
               },
                error: function(gameScore, error) {
                     cm.showAlert(error);
                }
			 
				});
				}
		 else
		 {
			 cm.showAlert('you can email recepient list later')
			 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
		     var sc =parseInt(localStorage.quantity)*10
			 var sampleorder = Parse.Object.extend("order");
             var sampleorderObj = new sampleorder();
			 // sampleorderObj.set("sampleOrderID",weddingcard.sampleorderid);
			 sampleorderObj.set("shipTo", 'email')
			// sampleorderObj.set("file", parseFile);
			 sampleorderObj.set("noOfItems", parseInt(localStorage.quantity));
			 sampleorderObj.set("cardID", localStorage.cardid);
			 sampleorderObj.set("weddingID", weddingDetailsObject.weddingId);
			 sampleorderObj.set("shippingCost",parseInt(sc ));
			 sampleorderObj.set("totalAmt",parseInt(localStorage.totalamt) );
			 sampleorderObj.set("orderedBy",localStorage.userId );
			  sampleorderObj.save(null, {
                success: function(wishResults) {
				console.log(wishResults.id)
			
                sampleorderObj.set("orderID",wishResults.id );
				 sampleorderObj.save();
				// for(var i=0 ;i<weddingcard.guestListArray.length ;i++)
					cm.showToast('order successful')
				  $(":mobile-pagecontainer").pagecontainer("change", "card_List.html", {
            showLoadMsg: false
        });	
			    
		        
			  
               },
                error: function(gameScore, error) {
                     cm.showAlert(error);
                }
			 
				});
					 

			}
				
			 
			 
		 	 
		  
},
alertDismissed : function()
{
	
		
			
	
},
guestRecipient:function(id)
{
	for(var i=0 ;i<weddingcard.guestListArray.length ;i++)
	{
			
			 var sampleorder = Parse.Object.extend("recipient");
             var sampleorderObj = new sampleorder();
			 // sampleorderObj.set("sampleOrderID",weddingcard.sampleorderid);
			 sampleorderObj.set("guestID", weddingcard.guestListArray[i].guestid)
		      sampleorderObj.set("orderID", id);
			
			 sampleorderObj.set("recepientName",weddingcard.guestListArray[i].guestname);
			 sampleorderObj.set("shippingAddr",'');
			 sampleorderObj.set("contactNo",parseInt(weddingcard.guestListArray[i].guestphone));
			  sampleorderObj.save(null, {
                success: function(wishResults) {
				console.log(wishResults.id)
				
          //  sampleorderObj.set("orderID",wishResults.id );
				 sampleorderObj.save();
			     //saveRecipient(wishResults.id)
		        
			  
               },
                error: function(gameScore, error) {
                     cm.showAlert(error);
                }
            })
			
	}
	
	 var selectedContacts = $("#contactList li");
               // weddingcard.guestListArray.length = 0;
				selectedContacts.each(function(index, item) {
            if($(item).hasClass("single-selected")) {
			  
					$(item).removeClass("single-selected") 
			}});
			
			cm.showToast('order successful')
			  $(":mobile-pagecontainer").pagecontainer("change", "card_List.html", {
            showLoadMsg: false
        });
	
},
selectAll : function()
{
	 var selectedContacts = $("#contactList li");
               // weddingcard.guestListArray.length = 0;
				selectedContacts.each(function(index, item) {
            if($(item).hasClass("single-selected")) {
			  
				console.log('single-selected')
			}
			else
			{
				$(item).addClass("single-selected")
				
			}
			
			});
},
openwhatsapp : function(){
	
//window.plugins.socialsharing.shareViaWhatsApp('card Sample for wedding ', img /* img */,'https://www.google.co.in/?espv=2#tbm=isch&q=indian+wedding+card+images+background&imgrc=etPZqJE0vJiP1M%3A'/* url */, function() {console.log('share ok')}, function(errormsg){cm.showAlert(errormsg)})
//window.plugins.socialsharing.share('Card Sample for wedding', null, local, null);
  var inviterClass = Parse.Object.extend("InviterMessages");
        var inviterObj = new inviterClass();
        var queryInviter = new Parse.Query(inviterObj);
        queryInviter.equalTo("InviteName", "cardSample");
        $("body").addClass("ui-loading");
        queryInviter.find().then(function(foundInvites) {
            console.log("foundInvites[0].InviteContent" + foundInvites[0]);
            // window.plugins.socialsharing.shareViaWhatsApp(foundInvites[0].InviteContent, null, null, foundInvites[0].InviteUrl || null);
            window.plugins.socialsharing.shareViaWhatsApp(foundInvites[0].get("InviteContent"), null   , foundInvites[0].get("InviteUrl") || null  , function() { console.log('share ok') }, function(errormsg) { alert(errormsg) })
           $("body").removeClass("ui-loading");
        });

}
			
			
			
	
	
	
};

$(document).on('tap' ,"#contactList li",function(){
	
	if($(item).hasClass("single-selected")) {
			  
				$(item).removeClass("single-selected") 
			}
			
});


