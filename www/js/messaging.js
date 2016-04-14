var messagingMethods = {
    // List of methods used for Messaging module
    cl: [], // Conversation List array
    conversationIDArray: [], // Array to hold list of conversation id's
    counter: 0, // counter to iterate over conversationIDArray
    participantlist: [],
    getConversationList: function() {
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
                // If conversation exist get other participants
                    messagingMethods.getOtherParticipants(messagingMethods.conversationIDArray[messagingMethods.counter]);
            },
            error: function(error) {
                cm.showAlert("Sorry!Couldn't load conversations");
            }
        });
    },
    getOtherParticipants: function(conversationID) {
        // To get the list of participants whose conversation id is the same as the currently logged in user id
        var coParticipantsArray = new Array(); // array to hold the list of participants
        var chatUserClass = Parse.Object.extend("ChatUsers");
        var chatUserQuery = new Parse.Query(chatUserClass);
        chatUserQuery.equalTo("conversationID", conversationID);
        chatUserQuery.notEqualTo("participantID", localStorage.userId); // leave the currently logged user
        var guestHtml = "";
        var participantname = ""
        var partId = ""
        var lastmessage = ""
        chatUserQuery.find({
            success: function(results) {
                // Do something with the returned Parse.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];

                    if (i != results.length - 1)
                        participantname += object.get('participantName') + ","
                    else
                        participantname += object.get('participantName');
                    coParticipantsArray[i] = { "participantID": object.get('participantID'), "conversationid": conversationID }
                }
                var chatMessageClass = Parse.Object.extend("ChatMessage");
                var chatMessageQuery = new Parse.Query(chatMessageClass);
                chatMessageQuery.equalTo("conversationId", conversationID);
                chatMessageQuery.descending("createdAt");
                $("body").addClass("ui-loading");
                chatMessageQuery.find({
                    success: function(results) {
                        var friendsHtml = "";
                        if (results[0])
                            lastmessage = results[0].get('message');
                        else
                            lastmessage = "Be The first one to start conversation";
                        friendsHtml += '<li class="contactli" data-guestid="' + conversationID + '" data-guestname="'+ participantname +'" data-guestorhost="guest" id="' + conversationID + '" ">'; // Contact Start
                        friendsHtml += '<a href="#"> <img src="img/no-pic.png">'; // Contact picture
                        friendsHtml += '<h2>' + participantname + '</h2>'; // Contact name start and end
                        friendsHtml += '<p class="">' + lastmessage + ' </p></a>'; // Contact status
                        friendsHtml += '</li>'; // Contact end
                        $("body").removeClass("ui-loading");
                        messagingMethods.printList(friendsHtml, "friendsList");
                    },
                    error: function() {
                        $("body").removeClass("ui-loading");
                    }
                });
                messagingMethods.cl.push(coParticipantsArray);
                localStorage["cllist"] = JSON.stringify(messagingMethods.cl);
                messagingMethods.counter++;
                var noOfConv = messagingMethods.conversationIDArray.length;
                if (messagingMethods.counter < noOfConv) {
                    messagingMethods.getOtherParticipants(messagingMethods.conversationIDArray[messagingMethods.counter]);
                }
            },
            error: function(error) {
                cm.showAlert("Sorry!Unable to list the conversations");
            }
        });
    },
    printList: function(htmlToPrint, listviewId) {
        // Method to print list of friends
        $("#" + listviewId).append(htmlToPrint).listview().listview("refresh");
        $("#" + listviewId).trigger("create");
    },
    showContactForMessaging: function(normalOrOutstation) {
        // To show the contacts list page to select contacts for chatting
        localStorage.normalOrOutstation = normalOrOutstation;
        $(":mobile-pagecontainer").pagecontainer("change", "contact-for-message.html", {
            showLoadMsg: false
        });
    },
    fetchContactsList: function() {
        // To List the Contacts from Parse.com (Guest)
        var guestClass = Parse.Object.extend("Guest");
        var guestObj = new guestClass();
        var queryGuest = new Parse.Query(guestObj);
        queryGuest.equalTo("weddingID", localStorage.joinedWedding);
        queryGuest.ascending("guestName");
        if (searchOptions.status)
            queryGuest.equalTo("status", localStorage.fstatus);
        $("body").addClass("ui-loading");
        queryGuest.find({
            success: function(foundGuests) {
                var guestHtml = "";
                for (var i = 0; i < foundGuests.length; i++) {
                    var rowObject = foundGuests[i];
                    var statusHtml = "";
                    var guestName = rowObject.get('guestName'); // .replace(" ", "")
                    guestHtml += '<li class="contactli" data-guestid="' + rowObject.get("guestID") + '" data-guestname="'+ rowObject.get('guestName') +'" data-guestorhost="guest" data-mobilenumber="' + rowObject.get("mobileNo") + '" data-emailid="' + rowObject.get("Email") + '">'; // Contact Start
                    guestHtml += '<a href="#"> <img src="img/no-pic.png">'; // Contact picture
                    guestHtml += '<h2>' + guestName + '</h2>'; // Contact name start and end
                    guestHtml += '<p class="' + contactsMethods.statusClassGenerator(rowObject.get('status')) + '">' + contactsMethods.statusChecker(rowObject.get('status')) + '</p></a>'; // Contact status
                    guestHtml += '</li>'; // Contact end
                }
                messagingMethods.printList(guestHtml, "mContactList");
                $("body").removeClass("ui-loading");
            },
            error: function(error) {
                cm.showAlert("Sorry!Unable to list contacts");
                $("body").removeClass("ui-loading");
            }
        });
    },
    fetchConversation: function() {
        // To fetch the conversation among the selected contacts
        var chatMessageClass = Parse.Object.extend("ChatMessage");
        var chatMessageQuery = new Parse.Query(chatMessageClass);
        var chatMessageHtml = "";
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        chatMessageQuery.equalTo("conversationId", localStorage.convid);
        $("body").addClass("ui-loading");
        chatMessageQuery.find({
            success: function(chatFound) {
                $("#noOfMessages").text(chatFound.length + " Messages");
                if (chatFound.length > 0) {
                    for (var i = 0; i < chatFound.length; i++) {
                        var rowObject = chatFound[i];
                        var visibilityOfDelete = "none";
                        var date1 = rowObject.get('addedDateTime');
                        var concatenatedDate = cm.dateFormatter(date1) + " " + date1.getHours() + ":" + date1.getMinutes();
                        var datetime = moment(moment(concatenatedDate)).fromNow(); // Using Moments to find the Time Ago
                        chatMessageHtml += '<div class="single-chat">'; // Chat start
                        chatMessageHtml += '<div class="pfile">'; // Profile pic block start
                        chatMessageHtml += '<img src="img/no-pic.png" width="50" height="50">'
                        chatMessageHtml += '</div>'; // Profile pic block end
                        chatMessageHtml += '<div class="pchat">'; // chat details block start
                        chatMessageHtml += '<div class="pname">' + rowObject.get('senderName') + '</div>'; // sender name start & End
                        chatMessageHtml += '<div class="pcomment">' + rowObject.get('message'); //  message block start
                        chatMessageHtml += '<div class="poststatus">' + datetime + '</div>'; // messaged Time start and end
                        chatMessageHtml += '<div class="arrowleft"></div>'; // message Left 
                        chatMessageHtml += '<div class="pclose" style="display:none" ></div>'; // message delete button
                        chatMessageHtml += '</div>'; //  message block end
                        chatMessageHtml += '</div>'; //  details block end
                        chatMessageHtml += '</div>'; // messageblock end
                    }
                    $("#conversationList").html(chatMessageHtml);
                    $("body").removeClass("ui-loading");
                } else {
                    $("#conversationList").html("");
                    $("body").removeClass("ui-loading");
                }
            },
            error: function(chatError) {
                cm.showAlert("Sorry!Unable to find chat messages");
            }
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
    goToConversationPage: function() {
        // Take user to the conversation page
		 
        $(":mobile-pagecontainer").pagecontainer("change", "conversation.html", {
            showLoadMsg: false
        });
    },
    checkParticipantExistance: function() {
        var cl
        var selectedContacts = $("#mContactList li");
        console.log(selectedContacts)
        messagingMethods.participantlist.length = 0;
        var loguser = { "participantID": localStorage.userId, "participantName": localStorage.userName, "participantPic": "nopic" }
        messagingMethods.participantlist.push(loguser)
        console.log(messagingMethods.participantlist.length)
        selectedContacts.each(function(index, item) {

            if ($(item).hasClass("single-selected")) {
                var contactObject = {};
                console.log(item);
                contactObject.participantID = $(item).data("guestid");
                contactObject.participantName = $(item).find('h2').text();
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
    }
};

$("#friendsList").on("click", "li.contactli", function(e) {
    // To store the selected contact for conversation    
    localStorage.convid = $(this).data('guestid');
    localStorage.guestname = $(this).data('guestname');

    $(":mobile-pagecontainer").pagecontainer("change", "conversation.html", {
        showLoadMsg: false
    });

});

$("#mContactList").on("click", "li.contactli", function(e) {
    // To store the selected contact for conversation    
    localStorage.convid = $(this).data('guestid');
	localStorage.guestname = $(this).data('guestname');
    $(this).toggleClass("single-selected");
    localStorage.receiverid = $(this).data("guestid");   

});
