	var messagingMethods = {
			cl: [], // Conversation List array
		conversationIDArray: [], // Array to hold list of conversation id's
		counter: 0, // counter to iterate over conversationIDArray
		participantlist: [],
		getConversationList: function() {
			
			localStorage.addMember='false'
			 $('.chat-contact-list').html('')
			 $("body").addClass("ui-loading");
			// To load the previous conversations from parse
			var chatUserClass = Parse.Object.extend("ChatUsers");
			var chatUserQuery = new Parse.Query(chatUserClass);
			chatUserQuery.equalTo("participantID", localStorage.userId); // find the chat where logged in user is a participant
			chatUserQuery.find({
				success: function(results) {
					messagingMethods.conversationIDArray.length = 0, messagingMethods.counter = 0;
					for (var i = 0; i < results.length; i++) {
						var rowObject = results[i];
						messagingMethods.conversationIDArray.push(rowObject.get('conversationID')); // push the conversation id to array
						// messagingMethods.getOtherParticipants(rowObject.get('conversationID'))
					}
					
					if (messagingMethods.conversationIDArray.length > 0)
					{// If conversation exist get other participants
						messagingMethods.getOtherParticipants(messagingMethods.conversationIDArray[messagingMethods.counter]);
						$("body").removeClass("ui-loading");	
					}
					else{
						
						//cm.showToast('no conversation found')
						messagingMethods.loadContacts()
						$("body").removeClass("ui-loading");
						
					}
				},
				error: function(error) {
					$("body").removeClass("ui-loading");
					cm.showAlert("Sorry!Couldn't load conversations");
				}
			});
		},
		getOtherParticipants: function(conversationID) {
			// To get the list of participants whose conversation id is the same as the currently logged in user id
			$("body").addClass("ui-loading");
			var coParticipantsArray = new Array(); // array to hold the list of participants
			var chatUserClass = Parse.Object.extend("ChatUsers");
			var chatUserQuery = new Parse.Query(chatUserClass);
			chatUserQuery.equalTo("conversationID", conversationID);
			chatUserQuery.notEqualTo("participantID", localStorage.userId); // leave the currently logged user
			var guestHtml = "";
			var participantname = ""
			var pname=""
			var partId = ""
			var lastmessage = ""
			var chatType = ""
			chatUserQuery.find({
				success: function(results) {
					// Do something with the returned Parse.Object values
				
					for (var i = 0; i < results.length; i++) {
						var object = results[i];

						if (i != results.length - 1)
						{
							participantname += object.get('participantName') + ","
							pname += object.get('participantID') + ","
						}
						else
						{
							participantname += object.get('participantName');
							pname += object.get('participantID');
						}	
						chatType="single"
						coParticipantsArray[i] = { "participantID": object.get('participantID'), "conversationid": conversationID }
						
						console.log(coParticipantsArray[i])
						
						
						if(results.length > 1)
					{  
			       	var chatMessageClass = Parse.Object.extend("Conversation");
					var chatMessageQuery = new Parse.Query(chatMessageClass);
					chatMessageQuery.equalTo("conversationID", conversationID);
					chatMessageQuery.find({
						success: function(results) {
							
                          participantname =""
						  participantname  = results[0].get('conversationName')
						  chatType='group'
						 
						},
					error: function(error)   { 
					cm.showAlert(error)
					} });
					}
					
					
					}
					
					// if groupchat  Conversation
					
					console.log(coParticipantsArray)
					
					
					
					
					var chatMessageClass = Parse.Object.extend("ChatMessage");
					var chatMessageQuery = new Parse.Query(chatMessageClass);
					chatMessageQuery.equalTo("conversationId", conversationID);
					chatMessageQuery.descending("createdAt");
					
					chatMessageQuery.find({
						success: function(results) {
							var friendsHtml = "";
							var datetime = ""
							
							if (results[0])
							{
						    lastmessage = results[0].get('message');
						    var date1 = results[0].get('addedDateTime');
							var concatenatedDate = cm.dateFormatter(date1) + " " + date1.getHours() + ":" + date1.getMinutes();
							 datetime = moment(moment(concatenatedDate)).fromNow(); // Using Moments to find the Time Ago
							}
							else
							{
							lastmessage = "Be The first one to start conversation";
							 
						    var date1 = new Date();
							var concatenatedDate = cm.dateFormatter(date1) + " " + date1.getHours() + ":" + date1.getMinutes();
							 datetime = moment(moment(concatenatedDate)).fromNow();
							}
						
							friendsHtml +='<li data-icon="none" and data-iconpos="none" class="fbbox" onclick="messagingMethods.getconv(this)" data-pname="'+pname+'" data-ctype="'+chatType+'" data-pid="' + object.get('participantID')+ '" data-id="' + conversationID + '" data-gname="'+ participantname +'"   data-guestorhost="guest"   id="' + conversationID + ' ">'
						  friendsHtml +='  <a href="#"><img src="./img/chat-person.png" width="43" height="43" class="chat-contact-img">' + participantname +''
							 friendsHtml +='   <span class="last-comment-time"><img src="./img/time.png" class="last-comment-time-icon"> '+datetime+'</span>'
							friendsHtml +='	<br>'
								friendsHtml +='<span class="last-comment">'+lastmessage+'.</span>'
							friendsHtml +='</a>'
						friendsHtml +='</li>'
							
						   // messagingMethods.printList(friendsHtml, "friendsList");
							$('.chat-contact-list').append(friendsHtml)
							 $('.chat-contact-list').listview().listview("refresh");
						},
						error: function() {
						  
						}
					});
					messagingMethods.cl.push(coParticipantsArray);
					localStorage["cllist"] = JSON.stringify(messagingMethods.cl);
					messagingMethods.counter++;
					var noOfConv = messagingMethods.conversationIDArray.length;
					if (messagingMethods.counter < noOfConv) {
						messagingMethods.getOtherParticipants(messagingMethods.conversationIDArray[messagingMethods.counter]);
					}
					
					$("body").removeClass("ui-loading");
				},
				error: function(error) {
					$("body").removeClass("ui-loading");
					cm.showAlert("Sorry!Unable to list the conversations");
				}
			});
		},
		getconv :function(id) {
			localStorage.convid= $(id).data('id')
			localStorage.pid= $(id).data('pid')
			localStorage.pname= $(id).data('pname')
			
			localStorage.chatType= $(id).data('ctype')
		
			localStorage.guestname = $(id).data('gname')
			
			messagingMethods.goToConversationPage()
			
		},
		printList: function(htmlToPrint, listviewId) {
			// Method to print list of friends
			$("#" + listviewId).append(htmlToPrint).listview().listview("refresh");
			$("#" + listviewId).trigger("create");
		},
	loadContacts : function() 
	{    $('.chat-contact-list').html('');
		var guestClass = Parse.Object.extend("Guest");
				var guestObj = new guestClass();
				var queryGuest = new Parse.Query(guestObj);
				queryGuest.equalTo("weddingID", localStorage.joinedWedding);
				queryGuest.find({
					success: function(foundGuests) {
						for (var k = 0; k < foundGuests.length; k++) {
								console.log( foundGuests[k].get('guestName'))
							//$('.chat-contact-list').append('<option value="' + foundGuests[k].get('guestID') + '">' + foundGuests[k].get('guestName') + '</option>');
							$('.chat-contact-list').append(' <li data-icon="none" and data-iconpos="none" class="fbbox" onclick="messagingMethods.checkParticipantExistance(this)" data-gid="' + foundGuests[k].get('guestID') + '" data-gname=" ' + foundGuests[k].get('guestName') + '" id="' + foundGuests[k].get('guestID') + '"><a href="#"><img src="./img/chat-person.png" width="43" height="43" class="chat-contact-img"> ' + foundGuests[k].get('guestName') + '</a></li>');
						  
						}
						 $('.chat-contact-list').listview().listview("refresh");
					},
					error: function(error) {
						cm.showAlert(error)
					}
				})

	},
	 checkParticipantExistance: function(item) {
			var cl
			var selectedContacts = $("#mContactList li");
			console.log(selectedContacts)
			localStorage.guestname=$(item).data("gname");
			localStorage.pid = $(item).data("gid");
			messagingMethods.participantlist.length = 0;
			var loguser = { "participantID": localStorage.userId, "participantName": localStorage.userName, "participantPic": "nopic" }
			messagingMethods.participantlist.push(loguser)
			console.log(messagingMethods.participantlist.length)
			//selectedContacts.each(function(index, item) {

			//	if ($(item).hasClass("single-selected")) {
					var contactObject = {};
					console.log(item);
					contactObject.participantID = $(item).data("gid");
					contactObject.participantName = $(item).data("gname");
					//ontactObject.participantName = $(item).find('h2').text();
					contactObject.participantPic = "no pic";
					messagingMethods.participantlist.push(contactObject);
					console.log(messagingMethods.participantlist);
				//}
			//});


			//chk if all partcipant exist


			if (localStorage.cllist) {
				cl = JSON.parse(localStorage["cllist"]);

				var c = 0
				var flag = false
				console.log(cl)
				for (var m = 0; m < cl.length; m++) {
					console.log(cl[m])
					for (var k = 0; k < cl[m].length; k++)
						console.log(cl[m][k].participantID);
				}

				for (var m = 0; m < cl.length; m++) {
					if (cl[m].length == messagingMethods.participantlist.length - 1) {
						for (var k = 0; k < cl[m].length; k++) {
							for (var r = 1; r < messagingMethods.participantlist.length; r++) {
								if (messagingMethods.participantlist[r].participantID == cl[m][k].participantID) {
									console.log('match')
									c++
									localStorage.convid = cl[m][k].conversationid
								}

							}

						}
						if (c == messagingMethods.participantlist.length - 1) { //alert('c')
							flag = true
							break;
						}
					} else {
						console.log('no mtch')
					}
				}
			}
			if (flag) {
				console.log('exists');
				messagingMethods.goToConversationPage();
			} else {
				console.log('lets create new user ');
				var ConversationClass = Parse.Object.extend("Conversation");
				var converObj = new ConversationClass();
				converObj.set("lastMessageTime", new Date());
				converObj.set("conversationName", 'yet to decide');
				converObj.set("chatType", 'single');
				converObj.save(null, {
					success: function(convResults) {
						converObj.set("conversationID", convResults.id);
						converObj.save();
						localStorage.convid = convResults.id
						messagingMethods.createChatUser(convResults.id)
						messagingMethods.goToConversationPage();
					},
					error: function(error) {
						cm.showAlert("Error: " + error.code + " " + error.message);
					}
				});

			}
		},	
 	    	checkgroupParticipant: function(item) {
			var cl
			
			var selectedContacts = $(".grplist a");
			console.log(selectedContacts)
			localStorage.guestname=$(item).data("gname");
			localStorage.pid = $(item).data("gid");
			messagingMethods.participantlist.length = 0;
			var loguser = { "participantID": localStorage.userId, "participantName": localStorage.userName, "participantPic": "nopic" }
			messagingMethods.participantlist.push(loguser)
			console.log(messagingMethods.participantlist.length)
			selectedContacts.each(function(index, item) {

		if ($(item).hasClass("donegrp")) {
			
					var contactObject = {};
					console.log(item);
					contactObject.participantID = $(item).data("gid");
					contactObject.participantName = $(item).data("gname");
					//ontactObject.participantName = $(item).find('h2').text();
					contactObject.participantPic = "no pic";
					messagingMethods.participantlist.push(contactObject);
					console.log(messagingMethods.participantlist);
				}
			});


			//chk if all partcipant exist


			if (localStorage.cllist) {
				cl = JSON.parse(localStorage["cllist"]);

				var c = 0
				var flag = false
				console.log(cl)
				for (var m = 0; m < cl.length; m++) {
					
					for (var k = 0; k < cl[m].length; k++)
						console.log(cl[m][k].participantID);
				}

				for (var m = 0; m < cl.length; m++) {
					if (cl[m].length == messagingMethods.participantlist.length - 1) {
						for (var k = 0; k < cl[m].length; k++) {
							for (var r = 1; r < messagingMethods.participantlist.length; r++) {
								if (messagingMethods.participantlist[r].participantID == cl[m][k].participantID) {
									console.log('match')
									c++
									localStorage.convid = cl[m][k].conversationid
								}

							}

						}
						if (c == messagingMethods.participantlist.length - 1) { //alert('c')
							flag = true
							break;
						}
					} else {
						console.log('no mtch')
					}
				}
			}
			if (flag) {
				console.log('exists');
				messagingMethods.goToConversationPage();
			} else {
				
				
				console.log('lets create new user ');
				var cname = $('#grpname').val()
				
				if(cname == "")
				{
					cm.showAlert('enter groupname')
				}
					else{
				localStorage.guestname =cname
				var ConversationClass = Parse.Object.extend("Conversation");
				var converObj = new ConversationClass();
				converObj.set("lastMessageTime", new Date());
				
				converObj.set("conversationName", cname);
				converObj.set("chatType", 'group');
				converObj.save(null, {
					success: function(convResults) {
						converObj.set("conversationID", convResults.id);
						converObj.save();
						localStorage.convid = convResults.id
						messagingMethods.createChatUser(convResults.id)
						messagingMethods.goToConversationPage();
					},
					error: function(error) {
						cm.showAlert("Error: " + error.code + " " + error.message);
					}
				});
			}
			}
		},
		createChatUser: function(convid) {
			
			for (i = 0; i < messagingMethods.participantlist.length; i++) {
				messagingMethods.participantlist[i].conversationID = convid
			}
			console.log(messagingMethods.participantlist.length)
			console.log(messagingMethods.participantlist)
			for (var i = 0; i < messagingMethods.participantlist.length; i++) {
				console.log('contactsMethods.participantlist[i]')
				var ConversationClass = Parse.Object.extend("ChatUsers");
				var converObj = new ConversationClass();
				converObj.set("participantID", messagingMethods.participantlist[i].participantID);
				// wishObj.set("conversationName", 'yet to decide');
				converObj.set("participantName", messagingMethods.participantlist[i].participantName);
				converObj.set("conversationID", convid);
				converObj.save(null, {
					success: function(wishResults) {
						converObj.save();
					},
					error: function(error) {
						cm.showAlert("Error: " + error.code + " " + error.message);
					}
				});
				localStorage.convid = convid
				messagingMethods.goToConversationPage();
			}
		},
		  goToConversationPage: function() {
			// Take user to the conversation page
			 
			$(":mobile-pagecontainer").pagecontainer("change", "chat_page.html", {
				showLoadMsg: false
			});
		},
		addMessage: function() {
			// To add message 
			var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			if ($("#messageBox").val() == "") {
				cm.showAlert("Please Enter Message");
			} else {
				$("body").addClass("ui-loading");
				var chatMessageClass = Parse.Object.extend("ChatMessage");
				var chatMessageObj = new chatMessageClass();
				chatMessageObj.set("message", $("#messageBox").val());
				chatMessageObj.set("conversationId", localStorage.convid);
				chatMessageObj.set("senderID", localStorage.userId);
				chatMessageObj.set("senderName", localStorage.userName);
				chatMessageObj.set("addedDateTime", new Date());
				chatMessageObj.save(null, {
					success: function(chatResults) {
						// wishObj.set("conversationId", wishResults.id);
						chatMessageObj.save();
						$('#messageBox').val('');
						cm.showToast('Message sent  Successfully');
						//commentsMethods.fetchComments();
						messagingMethods.fetchConversation();
						$("body").removeClass("ui-loading");
					},
					error: function(gameScore, error) {
						$("body").removeClass("ui-loading");
						cm.showAlert("Sorry!Couldn't send your message");
					}
				});
			}
		},
		clearChatMessage : function()
		{
			var ctClass = Parse.Object.extend('ChatMessage');
			var cQuery = new Parse.Query(ctClass);
			cQuery.equalTo("conversationId", localStorage.convid);
			cQuery.equalTo("senderID", localStorage.userId);
		    cQuery.find({
				success:function(foundWish){
				
					foundWish[0].destroy({
						success:function(deletedWishSuccess){
							messagingMethods.clearChatMessage()
						cm.showToast('left Group')
						$(":mobile-pagecontainer").pagecontainer("change", "msgcontact.html", {
				showLoadMsg: false
			});
						},
						error:function(deleteWishError){
							
							cm.showAlert(deleteWishError);
						}
					})
				},
				error:function(wishError){
					
					cm.showAlert("error");
					cm.showAlert(wishError);
				}
			})
			
		},
		leaveGroup : function()
		{
			if(localStorage.chatType=='group')
			{
			var ctClass = Parse.Object.extend('ChatUsers');
			var cQuery = new Parse.Query(ctClass);
			cQuery.equalTo("conversationID", localStorage.convid);
			cQuery.equalTo("participantID", localStorage.userId);
		    cQuery.find({
				success:function(foundWish){
				
					foundWish[0].destroy({
						success:function(deletedWishSuccess){
							//messagingMethods.clearChatMessage()
						cm.showToast('left Group')
					$(":mobile-pagecontainer").pagecontainer("change", "msgcontact.html", {
				showLoadMsg: false
		});
						},
						error:function(deleteWishError){
							
							cm.showAlert('deleteWishError');
							cm.showAlert(deleteWishError);
						}
					})
				},
				error:function(wishError){
					
					cm.showAlert("error");
				}
			})
			
			
			
			}
			else{
				
			
		    var ctClass = Parse.Object.extend('ChatUsers');
			var cQuery = new Parse.Query(ctClass);
			cQuery.equalTo("conversationID", localStorage.convid);
			cQuery.equalTo("participantID", localStorage.userId);
		    cQuery.find({
				success:function(foundWish){
				
					foundWish[0].destroy({
						success:function(deletedWishSuccess){
						cm.showToast('left Group')
						$(":mobile-pagecontainer").pagecontainer("change", "msgcontact.html", {
				showLoadMsg: false
			});
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
			
			}
		},
		 fetchConversation: function() {
		
			// To fetch the conversation among the selected contacts
			var chatMessageClass = Parse.Object.extend("ChatMessage");
			var chatMessageQuery = new Parse.Query(chatMessageClass);
			var chatMessageHtml = "";
			var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			chatMessageQuery.equalTo("conversationId", localStorage.convid);
			chatMessageQuery.addAscending("createdAt");
		   
			chatMessageQuery.find({
				success: function(chatFound) {
			        
					if (chatFound.length > 0) {
						for (var i = 0; i < chatFound.length; i++) {
							var rowObject = chatFound[i];
							var visibilityOfDelete = "none";
							var date1 = rowObject.get('addedDateTime');
							var concatenatedDate = cm.dateFormatter(date1) + " " + date1.getHours() + ":" + date1.getMinutes();
							var datetime = moment(moment(concatenatedDate)).fromNow(); // Using Moments to find the Time Ago
							
							if(rowObject.get('senderID')==localStorage.userId)
							{
								//alert('if')
							
				chatMessageHtml += '  <div class="chat-block-margin">'
				 chatMessageHtml += '   <div class="chat-block">'
					chatMessageHtml +=' <div class="comments">'   + rowObject.get('message') + '<span class="comment-time"><img src="./img/time.png"> ' + datetime + '</span>'
					 chatMessageHtml += ' <div class="arrowleft"></div>'
					 chatMessageHtml += ' </div>'
				  chatMessageHtml += '</div>'
			  chatMessageHtml += '</div>' 
				
							}
							
							else
							{
								//alert('else')
				chatMessageHtml += '<div class="chat-block-margin">'
				chatMessageHtml += '  <div class="pink-chat-block">'
				 chatMessageHtml +=' <div class="comments-pink-block">'   + rowObject.get('message') + '<span class="comment-time"><img src="./img/time.png"> ' + datetime + '</span>'
					
				chatMessageHtml += '  <div class="arrow-right"></div>'
			   chatMessageHtml += '  </div>'
			   chatMessageHtml += ' </div>'
			  chatMessageHtml += '  </div>' 
							}
							$("#conversationList").html(chatMessageHtml); 
						}
					
					   
					}


					else {
						
						$("#conversationList").html("");
					  
					}
				},
				error: function(chatError) {
					cm.showAlert("Sorry!Unable to find chat messages");
				}
			});
		},
		loadContactsGroup : function() {
			  $('.grplist').html('');
			  $('.chat-contact-list').html('');
			  if(localStorage.addMember=='true')
			  {   
		       
				  	 var temp = new Array();
			       var k = localStorage.pname
			          var temp = k.split(',')
			          console.log(temp)
				  
			    var guestClass = Parse.Object.extend("Guest");
				var guestObj = new guestClass();
				var queryGuest = new Parse.Query(guestObj);
				queryGuest.equalTo("weddingID", localStorage.joinedWedding);
				queryGuest.find({
					success: function(foundGuests) {
						for (var k = 0; k < foundGuests.length; k++) {
								console.log( foundGuests[k].get('guestName'))
								var flag=false
								for(var t = 0;t<temp.length ;t++ )
								{  console.log(temp[t])
								  console.log(foundGuests[k].get('guestID'))
								if(temp[t]==foundGuests[k].get('guestID'))
									flag=true
							   
								}
								
								
						
						
						      if(flag)
								{
									console.log('alreaady a chat member')
								}
							   else{
								   
								    $('.grplist').append(' <li data-icon="none" and data-iconpos="none" data-sel="no" class="fbbox"  onclick="messagingMethods.selectforgroupchat(this)" data-gid="' + foundGuests[k].get('guestID') + '" data-gname=" ' + foundGuests[k].get('guestName') + '" ><a href="#"  id="' + foundGuests[k].get('guestID') + '" class="notselected" data-gid="' + foundGuests[k].get('guestID') + '" data-gname=" ' + foundGuests[k].get('guestName') + '"><img src="./img/chat-person.png" width="43" height="43" class="chat-contact-img"> ' + foundGuests[k].get('guestName') + '</a></li>');
								
							   }
					}
						 $('.grplist').listview().listview("refresh");
					},
					error: function(error) {
						cm.showAlert(error)
					}
				})
			  }
			  else
				  
				  {
		var guestClass = Parse.Object.extend("Guest");
				var guestObj = new guestClass();
				var queryGuest = new Parse.Query(guestObj);
				queryGuest.equalTo("weddingID", localStorage.joinedWedding);
				queryGuest.find({
					success: function(foundGuests) {
						for (var k = 0; k < foundGuests.length; k++) {
								console.log( foundGuests[k].get('guestName'))
							//$('.chat-contact-list').append('<option value="' + foundGuests[k].get('guestID') + '">' + foundGuests[k].get('guestName') + '</option>');
							$('.grplist').append(' <li data-icon="none" and data-iconpos="none" data-sel="no" class="fbbox"  onclick="messagingMethods.selectforgroupchat(this)" data-gid="' + foundGuests[k].get('guestID') + '" data-gname=" ' + foundGuests[k].get('guestName') + '" ><a href="#"  id="' + foundGuests[k].get('guestID') + '" class="notselected" data-gid="' + foundGuests[k].get('guestID') + '" data-gname=" ' + foundGuests[k].get('guestName') + '"><img src="./img/chat-person.png" width="43" height="43" class="chat-contact-img"> ' + foundGuests[k].get('guestName') + '</a></li>');
						  
						}
						 $('.grplist').listview().listview("refresh");
					},
					error: function(error) {
						cm.showAlert(error)
					}
				})
				  }
			
		},
		goback : function()
		{
			history.back()
			
		},
		gobackmsg : function()
		{
			history.back()
			
		},
		gotogrouplist : function()
		{
					$(":mobile-pagecontainer").pagecontainer("change", "groupcontact.html", {
				showLoadMsg: false
			});
				
			
		},	gotoconversationlist : function()
		{
					$(":mobile-pagecontainer").pagecontainer("change", "msgcontact.html", {
				showLoadMsg: false
			});
				
			
		},
		selectforgroupchat : function(id)
		{
			var aid=$(id).data('gid')
		
			//$('#'+aid).addClass('selectedli')
		if($('#'+aid).hasClass('notselected'))
			{
				$('#'+aid).css({'background' :'red'})
				$('#'+aid).removeClass('notselected')
				$('#'+aid).addClass('donegrp')
				
			}
		else 
		{
			
			
				$('#'+aid).css({'background' :'transparent'})
				$('#'+aid).addClass('notselected')
				$('#'+aid).removeClass('donegrp')
		}
			
		}
		,addNewMember : function()
		{
			/*(if(localStorage.chatType=='group')
			{
				
			}	
			else{
				localStorage.typesingle='true'
				messagingMethods.gotogrouplist()
			}*/
		
			localStorage.addMember='true'
			messagingMethods.gotogrouplist()
			
		},
		hideSearchbox : function()
		{
			$('.top-search-panel').hide();
			$('.place-icon').show();
			$('#enterartist').val(' ');
			
			   $(".fbbox").each(function() {
        if($(this).hide())
		     $(this).show();
			   });
			
		},
		showSearchbox : function()
		{
			$('.top-search-panel').show();
			$('.place-icon').hide();
			
			
		},
		creategroupchat : function()
		{
			if(localStorage.addMember=='true')
			{
			//update conversation table and chatUserTable 
			localStorage.addMember=='false'
			var cname = $('#grpname').val()
			if(cname == "")
			{
				cm.showAlert('enterGroupname')
			}
			else
			{
			var ConversationClass = Parse.Object.extend('Conversation');
			var ConversatiotQuery = new Parse.Query(ConversationClass);
			ConversatiotQuery.equalTo("conversationID", localStorage.convid);
			ConversatiotQuery.first( {
					  success: function(results) {
						
					results.save(null, {
									success: function (results) {
                results.set('conversationName',cname);
					results.save();
			
				messagingMethods.updateChatUserGroup();
										
										
						}
								});
					  },
					  error: function(point, error) {
						 cm.showAlert(error)
						
					  }
			});
            }  			
			}
			else
			{
				messagingMethods.checkgroupParticipant();
				
			}
			
		},
		updateChatUserGroup :function()
		{
			messagingMethods.participantlist.length=0;
			var selectedContacts = $(".grplist a");
			console.log(selectedContacts)
			selectedContacts.each(function(index, item) {
				if ($(item).hasClass("donegrp")) {
			       var contactObject = {};
					console.log(item);
					contactObject.participantID = $(item).data("gid");
					contactObject.participantName = $(item).data("gname");
					//ontactObject.participantName = $(item).find('h2').text();
					contactObject.participantPic = "no pic";
					messagingMethods.participantlist.push(contactObject);
					console.log(messagingMethods.participantlist);
				}
			});
			
			messagingMethods.updateChatUser(localStorage.convid)
		},updateChatUser: function(convid) {
			
			for (i = 0; i < messagingMethods.participantlist.length; i++) {
				messagingMethods.participantlist[i].conversationID = convid
			}
			console.log(messagingMethods.participantlist.length)
			console.log(messagingMethods.participantlist)
			for (var i = 0; i < messagingMethods.participantlist.length; i++) {
				console.log('contactsMethods.participantlist[i]')
				var ConversationClass = Parse.Object.extend("ChatUsers");
				var converObj = new ConversationClass();
				converObj.set("participantID", messagingMethods.participantlist[i].participantID);
				// wishObj.set("conversationName", 'yet to decide');
				converObj.set("participantName", messagingMethods.participantlist[i].participantName);
				converObj.set("conversationID", convid);
				converObj.save(null, {
					success: function(wishResults) {
						converObj.save();
					},
					error: function(error) {
						cm.showAlert("Error: " + error.code + " " + error.message);
					}
				});
				localStorage.convid = convid
				messagingMethods.gotoconversationlist();
			}
		}
	

	};
	
$(document).on("keyup", "#enterartist",function() {
    var g = $(this).val().toLowerCase();
    $(".fbbox ").each(function(index) {
		  console.log(index)
		 var s = $(this).data('gname').toLowerCase()
		console.log(s)
        $(this).closest('.fbbox')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
    });
});



