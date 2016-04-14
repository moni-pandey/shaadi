//var iterator;
var contactsMethods = {
    contactsArray: [],
    createdPhoneContactId: [],
    //To store selected Contacts
    selectedContactsArray: [],
    iterator: 0,
    sourceToGetContacts: function(contactSource) {
        //To Select Contact source
        // cm.showToast("Coming Soon");
        $(":mobile-pagecontainer").pagecontainer("change", "selectcontact.html", {
            showLoadMsg: false
        });
        switch (contactSource) {
            //Switch Case to select the method to run
            //:ToDo:Need to find a way for Importing Contacts from Google
            case "phone":
                contactsMethods.readFromPhone();
                break;
            case "google":
                contactsMethods.authorizeGoogle();
                break;
            default:
                cm.showToast("Please choose the source to get contacts");
        }
    },
    manageSearch: function() {
        // To manage the textbox
        $('#contactSearchBox').toggle().focus();
    },
    authorizeGoogle: function() {
        // Method to authorize Google contact access
        var googleOptions = {
            "scopes": "https://www.googleapis.com/auth/contacts.readonly",
            "offline": true
        };
        window.plugins.googleplus.login(googleOptions, function(googleObj) {
            localStorage.googlePlusData = googleObj; // Store it in LS for furthur use
            contactsMethods.syncContactFromGoogle(googleObj); // Sync function invoked
        }, function(googleError) {
            cm.showAlert(JSON.stringify(googleError));
            cm.showAlert("Sorry!Couldn't authorize your google account");
        });
    },
    syncContactFromGoogle: function(googleObj) {
        // Method to sync Google contacts
        $.ajax({
            url: 'https://www.google.com/m8/feeds/contacts/' + encodeURIComponent(obj.email) + '/full',
            dataType: 'xml',
            data: { 'access_token': obj.oauthToken },
            error: function(jqXHR, textStatus, errorThrown) {
                console.warn("sync - 2 error textStatus:" + textStatus + " errorThrown:" + errorThrown);
            },
            success: function(data, textStatus, jqXHR) {
                console.warn("sync - 3 success");
                console.warn(data);
                var liText = "";
                $.each(data.feed.entry, function(index, value) {
                    var temp = $(this);

                    if (typeof temp[0].gd$email != "undefined") {

                        liText += "<li>" + temp[0].gd$email[0].address + "</li>";
                    }
                });
                $("#contactsList").html(liText).listview().listview("refresh");
                /*var googleContacts=$.parseXML( data );
                console.error(googleContacts.find("entry"));*/
            }
        });
        console.warn("sync - 4");
    },
    readFromPhone: function() {
        //To Read Contacts from phone
        localStorage.contactSource = "phone"; //Make phone as contact source
        var contactOptions = new ContactFindOptions();
        contactOptions.filter = ""; //To fetch all the contacts
        contactOptions.multiple = true; //To fetch multiple contacts
        // var neededFields = ["displayName", "name", "nickname", "phoneNumbers"]; // Picks up all fields
        var neededFields = ["*"]; // Picks up all fields
        $("body").addClass("ui-loading");
        cm.showToast("Loading Contacts from Phone");
        navigator.contacts.find(neededFields, contactsMethods.phoneContactSuccess, contactsMethods.onContactError, contactOptions);
    },
    phoneContactSuccess: function(foundContacts) {
        //To print Contacts
        var phoneContactHtml = "",
            lis;
        foundContacts.sort(); // sort the contacts
        for (var i = 0; i < foundContacts.length; i++) {
            if (foundContacts[i].phoneNumbers != null) {
                if (foundContacts[i].name != null) {
                    var phoneNumber = foundContacts[i].phoneNumbers[0].value.replace(/[^a-zA-Z0-9]/g, '');
                    if (phoneNumber.length == 10) {
                        phoneNumber = localStorage.userDialCode + phoneNumber;
                    }
                    var guestName = foundContacts[i].name.formatted || foundContacts[i].name.givenName || foundContacts[i].displayName || foundContacts[i].name.nickname || "";
                    phoneContactHtml += '<li class="foundContact" data-guestname="' + guestName + '" data-guestphone="' + phoneNumber + '" data-guestid="' + foundContacts[i].id + '">'; // start of list item
                    phoneContactHtml += '<a href="#"> <img src="img/no-pic.png">'; // profile pic start
                    phoneContactHtml += '<h2>' + guestName + '</h2>'; // contact name
                    phoneContactHtml += '<p class="att_no">' + phoneNumber + '</p>'; // contact number
                    phoneContactHtml += '</li>'; // end of list item
                }
            }
        }
        $("#genericContactList").html(phoneContactHtml).listview("refresh").trigger("create");
        contactsMethods.sortContacts("genericContactList");
    },
    onContactError: function(contactError) {
        //To show Contact Error
        cm.showAlert("Sorry!Unable to get contacts from your phone");
        $("body").removeClass("ui-loading");
    },
    sortContacts: function(conListName) {
        // To Sort the Contacts and print them
        // read all list items (without list-dividers) into an array
        var lis = $('#' + conListName + ' li').not('.ui-li-divider').get();
        // sort the list items in the array
        lis.sort(function(a, b) {
            var valA = $(a).text(),
                valB = $(b).text();
            if (valA < valB) {
                return -1;
            }
            if (valA > valB) {
                return 1;
            }
            return 0;
        });
        $("#" + conListName).empty();
        $.each(lis, function(i, li) {
            $("#" + conListName).append(li);
        });
        $("#" + conListName).listview('refresh');
        $("body").removeClass("ui-loading");
    },
    contactSelectionDone: function() {
        //To Save the contacts in Local Array
        var selectedContacts = $("#genericContactList li");
        contactsMethods.contactsArray.length = 0;
        selectedContacts.each(function(index, item) {
            if ($(item).hasClass("selectedContact")) {
                var contactObject = {};
                if (localStorage.contactSource == "phone") {
                    contactObject.guestid = $(item).data("guestid");
                    contactObject.guestname = $(item).data("guestname");
                    contactObject.guestphone = $(item).data("guestphone");
                    contactObject.duplicate = false;
                }
                if (contactsMethods.createdPhoneContactId.length > 0) {
                    for (var i = 0; i < contactsMethods.createdPhoneContactId.length; i++) {
                        console.log("contactObject.guestid:" + contactObject.guestid);
                        if (contactObject.guestid == contactsMethods.createdPhoneContactId[i])
                            console.log("Sorry!This is an duplicate entry");
                        else
                            contactsMethods.contactsArray.push(contactObject);
                    }
                    /*contactsMethods.createdPhoneContactId.each(function(value) {
                        if (contactObject.guestid == value) console.log("Sorry!This is an duplicate entry");
                        else contactsMethods.contactsArray.push(contactObject);
                    });*/
                } else
                    contactsMethods.contactsArray.push(contactObject);

            }
        });
        contactsMethods.checkForExistance();

        // console.log(contactsMethods.contactsArray);
    },
    checkForExistance: function() {
        //To check the existance of the contacts in parse db    :ToDo:Check for the existance in Parse DB    
        if (localStorage.contactSource == "phone") {
            console.log("contactsArray before for: " + JSON.stringify(contactsMethods.contactsArray));
            for (i = 0; i < contactsMethods.contactsArray.length; i++) {
                // var tempContact = contactsMethods.contactsArray[i];
                var guestClass = Parse.Object.extend("Guest");
                var guestObj = new guestClass();
                var queryGuest = new Parse.Query(guestObj);
                var queryWeddingId = queryGuest.equalTo("weddingID", localStorage.joinedWedding);
                var queryGuestPhone = queryGuest.equalTo("mobileNo", contactsMethods.contactsArray[i].guestphone);
                var compoundGuestQuery = Parse.Query.or(queryWeddingId, queryGuestPhone);
                compoundGuestQuery.find({
                    success: function(foundContactResult) {
                        if (foundContactResult.length == 0) {
                            console.log("Result not found in Parse we could add it");
                        } else {
                            /*debugger;
                            
                                contactsMethods.contactsArray[i].duplicate = true;
                                // contactsMethods.contactsArray.splice(i, 1);
                                // delete contactsMethods.contactsArray[i];
                                debugger;*/
                            console.log("i: " + i);
                            console.log("contactsArray inside else: " + JSON.stringify(contactsMethods.contactsArray[i]));
                        }
                    },
                    error: function(error) {
                        cm.showAlert("Sorry!Couldn't add Guest");
                    }
                });
                // cm.sleep(3000);
            }
            contactsMethods.saveSelectedContacts();
        }
    },
    checkContactExistOrNot: function(userNumber, successMethod) {
        // To Check whether contact exists in Host or Guest class
        var contactExistInGuest = false; //Flag for Guest class
        var contactExistInHost = false; //Flag for Host class
        var guestClass = Parse.Object.extend("Guest");
        var guestObj = new guestClass();
        var queryGuest = new Parse.Query(guestObj);
        queryGuest.equalTo("weddingID", localStorage.joinedWedding);
        queryGuest.equalTo("mobileNo", userNumber);
        $("body").addClass("ui-loading");
        queryGuest.find({
            success: function(guestSuccess) {
                if (guestSuccess.length > 0) {
                    contactExistInGuest = true;
                    //return contactExist;
                } else
                    contactExistInGuest = false;
            },
            error: function() {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't check whether the Contact exists or not");
            }
        });
        var hostClass = Parse.Object.extend("Host");
        var hostObj = new hostClass();
        var queryHost = new Parse.Query(hostObj);
        queryHost.equalTo("weddingID", localStorage.joinedWedding);
        queryHost.equalTo("mobileNo", userNumber);
        queryHost.find({
            success: function(hostSuccess) {
                if (hostSuccess.length > 0) {
                    contactExistInHost = true;
                    //return contactExist;
                } else
                    contactExistInHost = false;
                if (contactExistInHost || contactExistInGuest) {
                    cm.showAlert("You have already added this user");
                    $("body").removeClass("ui-loading");
                } else {
                    if (successMethod == "addNewGuest")
                        contactsMethods.addNewGuest();
                    else if (successMethod == "addNewHost")
                        contactsMethods.addNewHost();
                }
            },
            error: function() {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't check the Contact exists or not");
            }
        });

    },
    saveSelectedContacts: function() {
        //To Save the selected Contacts in Parse DB
        console.log("Involked saveSelectedContacts");
        for (var i = 0; i < contactsMethods.contactsArray.length; i++) {
            if (contactsMethods.contactsArray[i].duplicate == false) {
                var guestClass = Parse.Object.extend("Guest");
                var guestObj = new guestClass();
                contactsMethods.createdPhoneContactId.push(contactsMethods.contactsArray[i].guestid);
                guestObj.set("weddingID", localStorage.joinedWedding);
                guestObj.set("guestName", contactsMethods.contactsArray[i].guestname);
                guestObj.set("mobileNo", (contactsMethods.contactsArray[i].guestphone).toString());
                guestObj.set("addedBy", localStorage.userId);
                guestObj.set("status", "Not Invited");
                guestObj.save(null, {
                    success: function(addedGuest) {
                        console.log("Added Guest Id: " + addedGuest.id);
                        guestObj.set("guestID", addedGuest.id);
                        guestObj.save();
                        // console.log("tempContact after adding: " + JSON.stringify(tempContact));
                    },
                    error: function() {
                        cm.showAlert("Sorry!Couldn't add Guest");
                    }
                });
            }
        }
        localStorage.cachedContacts = ""; // clear the cache to refresh the contacts after importing
        $(":mobile-pagecontainer").pagecontainer("change", "contacts.html", {
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
                    guestHtml += '<li class="contactli" data-guestid="' + rowObject.get("guestID") + '" data-guestorhost="guest" data-mobilenumber="' + rowObject.get("mobileNo") + '" data-emailid="' + rowObject.get("Email") + '">'; // Contact Start
                    guestHtml += '<a href="#"> <img src="img/no-pic.png">'; // Contact picture
                    guestHtml += '<h2>' + guestName + '</h2>'; // Contact name start and end
                    guestHtml += '<p class="' + contactsMethods.statusClassGenerator(rowObject.get('status')) + '">' + contactsMethods.statusChecker(rowObject.get('status')) + '</p></a>'; // Contact status
                    guestHtml += '</li>'; // Contact end
                    /*guestHtml += "<li style='margin-top:-13px; padding-bottom:10px; !important' data-guestid='" + rowObject.get('guestID') + "' data-guestorhost='guest' data-mobilenumber='" + rowObject.get('mobileNo') + "' data-emailid='" + rowObject.get('Email') + "' class='contactli'>"; // Guest List start
                    guestHtml += "<div class='ui-grid-c'>"; // Grid C start
                    guestHtml += "<div class='ui-block-a' style='width:20%;'>"; // Block A start
                    guestHtml += "<img src='./assets/img/no-pic.png'>"; // User Profile Picture
                    guestHtml += "</div>"; // Block A end
                    guestHtml += "<div class='ui-block-b' style='width:70%;'>"; // Block B start
                    guestHtml += "<p style='color: #4e4e4e; font-size: 18px; font-weight: bold; float:left; margin:3px 0 0 -2px;'>"; // User name start
                    guestHtml += guestName + "</p>"; // User name end
                    guestHtml += "<h6 style='color: #179ed5; margin: 12% 0 0 -28%; float:left; font-size: 11px; font-weight: bold;'>"; // Attending Status start
                    guestHtml += contactsMethods.statusChecker(rowObject.get('status')) + "</h6>"; // Attending status end
                    guestHtml += "</div>"; //Block B end
                    guestHtml += "<div class='ui-block-c' style='width:10%;'>"; // Block C start
                    guestHtml += "<img src='./assets/img/arrow_black.png' style='margin-top:10px; float: right;'>"; // Arrow Image
                    guestHtml += "</div>"; // Block C end
                    guestHtml += "</div>"; // Grid C end
                    guestHtml += "</li>"; // Guest List End*/
                }
                if (localStorage.normalOrOutstation == "guestalone") {
                    contactsMethods.printContacts(guestHtml); //Just print it
                    /*$("#contactList").html(guestHtml).listview("refresh");
                    $("#contactList").trigger("create");*/
                } else
                    contactsMethods.fetchContactsListFromHost(guestHtml);

                $("body").removeClass("ui-loading");
            },
            error: function() {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't fetch Contacts");
            }
        });
    },
    fetchContactsListFromHost: function(guestHtml) {
        // To List the Contacts from Parse.com (Host) :ToDo:Fix the design issue
        var hostClass = Parse.Object.extend("Host");
        var hostObj = new hostClass();
        var queryHost = new Parse.Query(hostObj);
        var guestHtml = guestHtml == undefined ? "" : guestHtml;
        queryHost.equalTo("weddingID", localStorage.joinedWedding);
        queryHost.ascending("hostName");
        if (searchOptions.status)
            queryHost.equalTo("status", localStorage.fstatus);
        $("body").addClass("ui-loading");
        queryHost.find({
            success: function(foundHosts) {
                var hostHtml = "";
                for (var i = 0; i < foundHosts.length; i++) {
                    var rowObject = foundHosts[i];
                    var statusHtml = "";
                    var showLiOrNot = "block";
                    if (rowObject.get('hostID') == localStorage.userId)
                        showLiOrNot = "none";
                    var hostName = rowObject.get('hostName'); // .replace(" ", "")
                    hostHtml += '<li class="contactli" style="display:' + showLiOrNot + '" data-guestid="' + rowObject.get('hostID') + '" data-guestorhost="host" data-mobilenumber="' + rowObject.get("mobileNo") + '" data-emailid="' + rowObject.get("email") + '">'; // Host contact start
                    hostHtml += '<a href="#"> <img src="img/no-pic.png">'; // Contact picture
                    hostHtml += '<h2>' + hostName + '</h2>'; // Contact name start and end
                    hostHtml += '<p class="' + contactsMethods.statusClassGenerator(rowObject.get("status")) + '">' + contactsMethods.statusChecker(rowObject.get("status")) + '</p></a>'; // Contact status
                    hostHtml += '</li>'; // Host contact end
                    /*hostHtml += "<li style='margin-top:-13px; padding-bottom:10px; !important;display:" + showLiOrNot + "' data-guestid='" + rowObject.get('hostID') + "' data-guestorhost='host' data-mobilenumber='" + rowObject.get('mobileNo') + "' data-emailid='" + rowObject.get('Email') + "' class='contactli'>"; // Guest List start
                    hostHtml += "<div class='ui-grid-c'>"; // Grid C start
                    hostHtml += "<div class='ui-block-a' style='width:20%;'>"; // Block A start
                    hostHtml += "<img src='./assets/img/no-pic.png'>"; // User Profile Picture
                    hostHtml += "</div>"; // Block A end
                    hostHtml += "<div class='ui-block-b' style='width:70%;'>"; // Block B start
                    hostHtml += "<p style='color: #4e4e4e; font-size: 18px; font-weight: bold; float:left; margin:3px 0 0 -2px;'>"; // User name start
                    hostHtml += rowObject.get('hostName') + "</p>"; // User name end
                    hostHtml += "<h6 style='color: #179ed5; margin: 12% 0 0 -28%; float:left; font-size: 11px; font-weight: bold;'>"; // Attending Status start
                    hostHtml += contactsMethods.statusChecker(rowObject.get('status')) + "</h6>"; // Attending status end
                    hostHtml += "</div>"; //Block B end
                    hostHtml += "<div class='ui-block-c' style='width:10%;'>"; // Block C start
                    hostHtml += "<img src='./assets/img/arrow_black.png' style='margin-top:10px; float: right;'>"; // Arrow Image
                    hostHtml += "</div>"; // Block C end
                    hostHtml += "</div>"; // Grid C end
                    hostHtml += "</li>"; // Guest List End*/
                }
                var totalContacts = guestHtml + hostHtml;
                localStorage.cachedContacts = totalContacts; // cache the contacts for future use
                contactsMethods.printContacts(totalContacts); // Just print it
                /*$("#contactList").html(totalContacts).listview("refresh");
                $("#contactList").trigger("create");*/
                $("body").removeClass("ui-loading");
            },
            error: function() {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't fetch Contacts");
            }
        });
    },
    fetchOutStationContactsList: function() {
        // To Fetch the outstation Guests
        console.log("fetchOutStationContactsList called");
        var guestClass = Parse.Object.extend("Guest");
        var guestObj = new guestClass();
        var queryGuest = new Parse.Query(guestObj);
        queryGuest.equalTo("weddingID", localStorage.joinedWedding);
        queryGuest.equalTo("outStation", "true");
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
                    var guestName = rowObject.get('guestName').replace(" ", "");
                    guestHtml += '<li class="contactli" data-guestid="' + rowObject.get('guestID') + '" data-guestorhost="guest" data-mobilenumber="' + rowObject.get("mobileNo") + '" data-emailid="' + rowObject.get("Email") + '">'; // Contact Start
                    guestHtml += '<a href="#"> <img src="img/no-pic.png">'; // Contact picture
                    guestHtml += '<h2>' + guestName + '</h2>'; // Contact name start and end
                    guestHtml += '<p class="' + contactsMethods.statusClassGenerator(rowObject.get("status")) + '">' + contactsMethods.statusChecker(rowObject.get("status")) + '</p></a>'; // Contact status
                    guestHtml += '</li>'; // Contact end
                    /*guestHtml += "<li style='margin-top:-13px; padding-bottom:10px; !important' data-guestid='" + rowObject.get('guestID') + "' data-guestorhost='guest' data-mobilenumber='" + rowObject.get('mobileNo') + "' data-emailid='" + rowObject.get('Email') + "' class='contactli'>"; // Guest List start
                    guestHtml += "<div class='ui-grid-c'>"; // Grid C start
                    guestHtml += "<div class='ui-block-a' style='width:20%;'>"; // Block A start
                    guestHtml += "<img src='./assets/img/no-pic.png'>"; // User Profile Picture
                    guestHtml += "</div>"; // Block A end
                    guestHtml += "<div class='ui-block-b' style='width:70%;'>"; // Block B start
                    guestHtml += "<p style='color: #4e4e4e; font-size: 18px; font-weight: bold; float:left; margin:3px 0 0 -2px;'>"; // User name start
                    guestHtml += guestName + "</p>"; // User name end
                    guestHtml += "<h6 style='color: #179ed5; margin: 12% 0 0 -28%; float:left; font-size: 11px; font-weight: bold;'>"; // Attending Status start
                    guestHtml += contactsMethods.statusChecker(rowObject.get('status')) + "</h6>"; // Attending status end
                    guestHtml += "</div>"; //Block B end
                    guestHtml += "<div class='ui-block-c' style='width:10%;'>"; // Block C start
                    guestHtml += "<img src='./assets/img/arrow_black.png' style='margin-top:10px; float: right;'>"; // Arrow Image
                    guestHtml += "</div>"; // Block C end
                    guestHtml += "</div>"; // Grid C end
                    guestHtml += "</li>"; // Guest List End*/
                }
                contactsMethods.printContacts(guestHtml); //Just print it
                /*$("#contactList").html(guestHtml).listview("refresh");
                $("#contactList").trigger("create");*/
                $("body").removeClass("ui-loading");
            },
            error: function() {
                $("body").removeClass("ui-loading");
            }
        });

    },
    printContacts: function(printableContacts) {
        // To print the fetched/loaded contacts in the contact page
        $("#contactList").html(printableContacts).listview().listview("refresh");
        $("#contactList").trigger("create");
    },
    statusChecker: function(foundStatus) {
        // To Check the Status of the Guest/Host
        switch (foundStatus) {
            case 'Not Invited':
                return "Invited:No";
                break;
            case 'Invited':
                return "Invited:Yes";
                break;
            case 'Attending':
                return "Attending:Yes";
                break;
            case 'Not Attending':
                return "Attending:No";
                break;
            default:
                return "Invited:No";
        }

    },
    statusClassGenerator: function(foundStatus) {
        // To Check the Status of the Guest/Host and return class
        switch (foundStatus) {
            case 'Not Invited':
                return "invi_no";
                break;
            case 'Invited':
                return "att_yes";
                break;
            case 'Attending':
                return "att_yes";
                break;
            case 'Not Attending':
                return "att_no";
                break;
            default:
                return "invi_no";
        }

    },
    /*Guest Methods start*/
    selectGuestGender: function(ev, genderType) {
        if (genderType == "Female") {
            $("#gGenderMale").css("background-color", '#a1a1a1');
            $("#gMaleImg").prop("src", "./assets/img/Man_gray.png"); // Dim the Man Picture
            $("#gFemaleImg").prop("src", "./assets/img/female_red.png"); //Highlight the Female Picture
        } else {
            $("#gGenderFemale").css("background-color", '#a1a1a1');
            $("#gMaleImg").prop("src", "./assets/img/male.png"); // Highlight the Man Picture
            $("#gFemaleImg").prop("src", "./assets/img/female.png"); //Dim the Female Picture
        }
        // $('.square-radio1').css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
        //Save the Guest Gender Type
        localStorage.guestGender = genderType;
    },
    brideOrGroomSide: function(ev, brideOrGroom) {
        if (brideOrGroom == "Bride")
            $("#gGroomSide").css("background-color", '#a1a1a1');
        else
            $("#gBrideSide").css("background-color", '#a1a1a1');
        // $('.square-radio1').css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
        // Save the Side of Guest(Groom or Bride)
        localStorage.brideOrGroomSide = brideOrGroom;
    },
    outstationOrNot: function(ev, outstationOrNot) {
        /*$('.square-radio1').css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');*/
        // Save the Side of Guest(Groom or Bride)
        localStorage.outstationOrNot = outstationOrNot;
        if (outstationOrNot == "true") {
            $("#gOutNo").css("background-color", '#a1a1a1');
            $("#outstationGuestBlock").show();
        } else if (outstationOrNot == "false") {
            $("#gOutYes").css("background-color", '#a1a1a1');
            $("#outstationGuestBlock").hide();
        }
        $(ev).css("background-color", 'red');
    },
    pickupNeededOrNot: function(ev, pickupNeededOrNot) {
        // $('.square-radio1').css("background-color", '#a1a1a1');

        // Save the Side of Guest(Groom or Bride)
        localStorage.pickupNeededOrNot = pickupNeededOrNot;
        if (pickupNeededOrNot == "true")
            $("#gPickNo").css("background-color", '#a1a1a1');
        else if (pickupNeededOrNot == "false")
            $("#gPickYes").css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
    },
    dropNeededOrNot: function(ev, dropNeededOrNot) {
        /*$('.square-radio1').css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');*/
        // Save the Side of Guest(Groom or Bride)
        localStorage.dropNeededOrNot = dropNeededOrNot;
        if (dropNeededOrNot == "true")
            $("#gDropNo").css("background-color", '#a1a1a1');
        else if (dropNeededOrNot == "false")
            $("#gDropYes").css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');

    },
    accommodationOfferedOrNot: function(ev, accommodationOfferedOrNot) {
        // Save the Accommodation Offered or Not
        localStorage.accommodationOfferedOrNot = accommodationOfferedOrNot;
        if (accommodationOfferedOrNot == "true")
            $("#gAccommodationNo").css("background-color", '#a1a1a1');
        else if (accommodationOfferedOrNot == "false")
            $("#gAccommodationYes").css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
    },
    travelOfferedOrNot: function(ev, travelOfferedOrNot) {
        // Save the Accommodation Offered or Not
        localStorage.travelOfferedOrNot = travelOfferedOrNot;
        if (travelOfferedOrNot == "true")
            $("#gTravelNo").css("background-color", '#a1a1a1');
        else if (travelOfferedOrNot == "false")
            $("#gTravelYes").css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
    },
    validateGuestContactForm: function() {
        // To Validate Guest Add form
        if ($("#gFirstName").val() == "")
            cm.showAlert("Please enter Guest name");
        else if ($("#gPhoneNumber").val() == "")
            cm.showAlert("Please enter Guest Mobile Number");
        else if (!($("#gPhoneNumber").intlTelInput("isValidNumber")))
            cm.showAlert("Please enter a valid mobile number");
        else if ($("#gEmailid").val() == "")
            cm.showAlert("Please enter Guest Email-Id");
        else if (cm.isValidEmail($("#gEmailid").val()))
            cm.showAlert("Please enter a valid Email-Id");
        else if ($("#gAddress").val() == "")
            cm.showAlert("Please enter Guest Address");
        else if (localStorage.guestGender == null || localStorage.guestGender == "")
            cm.showAlert("Please choose Guest Gender");
        else if (localStorage.brideOrGroomSide == null || localStorage.brideOrGroomSide == "")
            cm.showAlert("Please choose Guest Relationship");
        else if (localStorage.outstationOrNot == null || localStorage.outstationOrNot == "")
            cm.showAlert("Please choose whether Guest is from Outstation or Not");
        /*else if (localStorage.outstationOrNot == "true" && $("#gArrivalDate").val() == "")
            cm.showAlert("Please choose Guest Arrival Date");
        else if (localStorage.outstationOrNot == "true" && cm.isAccStartDateValidate($("#gArrivalDate").val()))
            cm.showAlert("Please choose the Guest Arrival Date between today and wedding date");
        else if (localStorage.outstationOrNot == "true" && $("#gArrivalTime").val() == "")
            cm.showAlert("Please choose Guest Arrival Time");
        else if (localStorage.outstationOrNot == "true" && $("#gArrivingBy").val() == "moderesetter")
            cm.showAlert("Please choose Guest's Mode of Arrival ");
        else if (localStorage.outstationOrNot == "true" && localStorage.pickupNeededOrNot == null || localStorage.pickupNeededOrNot == "")
            cm.showAlert("Please choose whether Guest need Pickup");
        else if (localStorage.outstationOrNot == "true" && $("#gLocation").val() == "")
            cm.showAlert("Please choose Guest's Arrival Location");
        else if (localStorage.outstationOrNot == "true" && $("#gDepartureDate").val() == "")
            cm.showAlert("Please choose Guest Departure Date");
        else if (localStorage.outstationOrNot == "true" && cm.isAccEndDateValidate($("#gDepartureDate").val()))
            cm.showAlert("Please choose the Guest's Departure Date after wedding date");
        else if (localStorage.outstationOrNot == "true" && $("#gDepartureTime").val() == "")
            cm.showAlert("Please choose Guest Departure Time");
        else if (localStorage.outstationOrNot == "true" && $("#gDepartingBy").val() == "moderesetter")
            cm.showAlert("Please choose Guest's Mode of Departure");
        else if (localStorage.outstationOrNot == "true" && localStorage.dropNeededOrNot == null || localStorage.dropNeededOrNot == "")
            cm.showAlert("Please choose whether Guest need to be Dropped");
        else if (localStorage.outstationOrNot == "true" && localStorage.accommodationOfferedOrNot == null || localStorage.accommodationOfferedOrNot == "")
            cm.showAlert("Please choose whether Accommodation alloted or not");
        else if (localStorage.outstationOrNot == "true" && localStorage.travelOfferedOrNot == null || localStorage.travelOfferedOrNot == "")
            cm.showAlert("Please choose whether Transport alloted or not");*/

        /*else if(contactsMethods.checkContactExistOrNot($("#gPhoneNumber").val()))
            cm.showAlert("You have already added this user");
        else contactsMethods.addNewGuest()*/
        else contactsMethods.checkContactExistOrNot($("#gPhoneNumber").val(), "addNewGuest");
    },
    addNewGuest: function() {
        // To Save New Guest
        var guestClass = Parse.Object.extend("Guest");
        var guestObj = new guestClass();
        guestObj.set("guestName", $("#gFirstName").val() + " " + $("#gLastName").val() || "");
        guestObj.set("guestAddr", $("#gAddress").val());
        guestObj.set("weddingID", localStorage.joinedWedding);
        guestObj.set("mobileNo", parseInt($("#gPhoneNumber").intlTelInput("getNumber")).toString());
        guestObj.set("Email", $("#gEmailid").val());
        guestObj.set("brideOrGroomSide", localStorage.brideOrGroomSide);
        // var outstationOrNot = localStorage.outstationOrNot == "true" ? true : false;
        guestObj.set("outStation", localStorage.outstationOrNot);
        guestObj.set("status", "Not Invited");
        guestObj.set("guestGender", localStorage.guestGender);
        guestObj.set("headCount", $("#gHeadCount :selected").text());
        guestObj.set("addedBy", localStorage.userId);


        if (localStorage.outstationOrNot == "true") {
            if ($("#gArrivalDate").val() != "")
                guestObj.set("guestArrivalTime", new Date($("#gArrivalDate").val()) || "");
            guestObj.set("guestArrivalBy", $("#gArrivingBy :selected").text() || "");
            guestObj.set("guestArrivalLocation", $("#gLocation").val() || "");
            guestObj.set("pickupNeeded", localStorage.pickupNeededOrNot || "");
            if ($("#gDepartureDate").val() != "")
                guestObj.set("guestDepartureTime", new Date($("#gDepartureDate").val()) || "");
            guestObj.set("guestDepartureBy", $("#gDepartingBy :selected").text() || "");
            guestObj.set("dropNeeded", localStorage.dropNeededOrNot || "");
            guestObj.set("accomOffered", localStorage.accommodationOfferedOrNot || "");
            guestObj.set("transportOffered", localStorage.travelOfferedOrNot || "");
        }
        $("body").addClass("ui-loading");
        guestObj.save({
            success: function(addGuestSuccess) {
                guestObj.set("guestID", addGuestSuccess.id);
                guestObj.save();
                cm.showToast("Successfully added Guest");
                $("body").removeClass("ui-loading");
                var contactPageName = localStorage.fromOSGPage == "true" ? "outstationguest" : "contacts";
                localStorage.cachedContacts = ""; // clear the cached contacts
                $(":mobile-pagecontainer").pagecontainer("change", contactPageName + ".html", {
                    showLoadMsg: false
                });
            },
            error: function() {
                cm.showAlert("Sorry!Couldn't add Guest");
                $("body").removeClass("ui-loading");
            }
        })
    },
    /*Guest Methods end*/

    /*Host Methods start*/
    selectHostGender: function(ev, genderType) {
        if (genderType == "Female") {
            $("#hGenderMale").css("background-color", '#a1a1a1');
            $("#hMaleImg").prop("src", "./assets/img/Man_gray.png"); // Dim the Man Picture
            $("#hGenderFemale").prop("src", "./assets/img/female_red.png"); //Highlight the Female Picture
        } else {
            $("#hGenderFemale").css("background-color", '#a1a1a1');
            $("#hMaleImg").prop("src", "./assets/img/male.png"); // Highlight the Man Picture
            $("#hGenderFemale").prop("src", "./assets/img/female.png"); //Dim the Female Picture
        }
        $(ev).css("background-color", 'red');
        // Save the New Host Gender Type
        localStorage.newHostGender = genderType;
    },
    hostBrideOrGroomSide: function(ev, brideOrGroom) {
        if (brideOrGroom == "Bride")
            $("#hGroomSide").css("background-color", '#a1a1a1');
        else
            $("#hBrideSide").css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
        // Save the Side of Guest(Groom or Bride)
        localStorage.newHostBrideOrGroomSide = brideOrGroom;
    },
    validateHostContactForm: function() {
        // To Validate Host Add form
        if ($("#hFirstName").val() == "")
            cm.showAlert("Please enter First name");
        else if ($("#hPhoneNumber").val() == "")
            cm.showAlert("Please enter Host Mobile Number");
        else if (!($("#hPhoneNumber").intlTelInput("isValidNumber")))
            cm.showAlert("Please enter a valid mobile number");
        else if ($("#hEmail").val() == "")
            cm.showAlert("Please enter Email");
        else if (cm.isValidEmail($("#hEmail").val()))
            cm.showAlert("Please enter valid Email");
        else if (localStorage.newHostGender == null || localStorage.newHostGender == "")
            cm.showAlert("Please choose Host Gender");
        else if (localStorage.newHostBrideOrGroomSide == null || localStorage.newHostBrideOrGroomSide == "")
            cm.showAlert("Please choose Host Relationship");
        else if ($("#newHostRelation").val() == "resetter")
            cm.showAlert("Please choose Host Relationship");
        /*else
            contactsMethods.addNewHost();*/
        else contactsMethods.checkContactExistOrNot($("#hPhoneNumber").val(), "addNewHost");
    },
    addNewHost: function() {
        // To add New Host
        var nHostNumber = parseInt($("#hPhoneNumber").intlTelInput("getNumber")).toString();
        var hostClass = Parse.Object.extend("Host");
        var hostObj = new hostClass();
        hostObj.set("hostName", $("#hFirstName").val() + " " + $("#hLastName").val());
        hostObj.set("weddingID", localStorage.joinedWedding);
        hostObj.set("mobileNo", nHostNumber);
        hostObj.set("email", $("#hEmail").val());
        hostObj.set("brideOrGroomSide", localStorage.newHostBrideOrGroomSide);
        hostObj.set("relationToBrideGroom", $("#newHostRelation :selected").text());
        hostObj.set("hostGender", localStorage.newHostGender);
        $("body").addClass("ui-loading");
        hostObj.save({
            success: function(addHostSuccess) {
                hostObj.set("hostID", addHostSuccess.id);
                hostObj.save();
                cm.showToast("Successfully added Host");
                localStorage.cachedContacts=""; // clear the cached contacts
                $("body").removeClass("ui-loading");
                $(":mobile-pagecontainer").pagecontainer("change", "contacts.html", {
                    showLoadMsg: false
                });
            },
            error: function() {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't add Host");
            }
        });
    },
    /*Host Methods end*/
    openUserTypePicker: function() {
        //To Open the user type picker popup
        $("#userTypePopup").popup("open");
    },
    closeUserTypePicker: function() {
        // To Close the user type picker popup
        $("#userTypePopup").popup("close");
    },
    selectGuestTypeToAdd: function(userTypeToAdd) {
        // To show the pages based on the UserType
        if (userTypeToAdd == "host")
            $(":mobile-pagecontainer").pagecontainer("change", "new_host.html", {
                showLoadMsg: false
            });
        else if (userTypeToAdd == "guest") {
            localStorage.fromOSGPage = false;
            $(":mobile-pagecontainer").pagecontainer("change", "new_guest.html", {
                showLoadMsg: false
            });
        }


    },
    selectAllContacts: function() {
        // To Select all the Listed contacts
        if ($("#selectAllBtn").data("allselected") == "no") {
            $("#contactList").find("li").removeClass("single-selected").addClass("single-selected");
            $("#selectAllBtn").data("allselected", "yes");
            $("#selectAllBtn").text("Deselect all");
        } else if ($("#selectAllBtn").data("allselected") == "yes") {
            $("#contactList").find("li").removeClass("single-selected");
            $("#selectAllBtn").data("allselected", "no");
            $("#selectAllBtn").text("Select all");
        }

    },
    configureForDelete: function() {
        // Configure the array before delete
        contactsMethods.selectedContactsArray.length = 0; // Empty the array
        contactsMethods.iterator = 0; // reinitialize the iterator
        $("#contactList li.single-selected").each(function(index, item) {
            if (typeof $(item).data("guestid") != null) {
                // If the selected contacts is having a guestid just push it to array
                var contactObj = {};
                contactObj.userId = $(item).data("guestid");
                contactObj.guestOrHost = $(item).data("guestorhost");
                contactsMethods.selectedContactsArray.push(contactObj);
            }
        });
        if (contactsMethods.selectedContactsArray.length > 0)
            contactsMethods.deleteContact();
    },
    deleteContact: function() {
        // Delete the selected Contact
        var noOfContacts = contactsMethods.selectedContactsArray.length;
        var selectedContacts = contactsMethods.selectedContactsArray;
        if (selectedContacts[contactsMethods.iterator].guestOrHost == "guest") {
            var guestClass = Parse.Object.extend("Guest");
            var guestObj = new guestClass();
            var queryGuest = new Parse.Query(guestObj);
            queryGuest.equalTo("guestID", selectedContacts[contactsMethods.iterator].userId);
            $("body").addClass("ui-loading");
            queryGuest.find().then(function(foundGuests) {
                // Find the weddings
                var rowObject = foundGuests[0];
                rowObject.destroy({});
                contactsMethods.iterator++;
                console.log("contactsMethods.iterator:" + contactsMethods.iterator);
                if (contactsMethods.iterator < noOfContacts)
                    contactsMethods.deleteContact();
                else {
                    if (localStorage.cSPopupShown == "true")
                        $("#contactStatusPopup").popup("close");
                    // $("#contactOptionBlock").hide();
                    contactsMethods.fetchContactsList();
                    cm.showToast("Deleted Contacts Successfully");
                }

            });
        } else if (selectedContacts[contactsMethods.iterator].guestOrHost == "host") {
            var hostClass = Parse.Object.extend("Host");
            var hostObj = new hostClass();
            var queryHost = new Parse.Query(hostObj);
            queryHost.equalTo("guestID", selectedContacts[contactsMethods.iterator].userId);
            $("body").addClass("ui-loading");
            queryHost.find().then(function(foundHosts) {
                // Find the weddings
                var rowObject = foundHosts[0];
                rowObject.destroy({});
                contactsMethods.iterator++;
                console.log("contactsMethods.iterator:" + contactsMethods.iterator);
                if (contactsMethods.iterator < noOfContacts)
                    contactsMethods.deleteContact();
                else {
                    // cm.showToast("Invited Successfully");
                    if (localStorage.cSPopupShown == "true")
                        $("#contactStatusPopup").popup("close");
                    // $("#contactOptionBlock").hide();
                    contactsMethods.fetchContactsList();
                    cm.showToast("Deleted Contacts Successfully");
                }

            });
        }
        /*if ($("#contactList li.single-selected").data("guestorhost") == "guest") {
            // Updating the status of Guest user
            var guestClass = Parse.Object.extend("Guest");
            var guestObj = new guestClass();
            var queryGuest = new Parse.Query(guestObj);
            queryGuest.equalTo("guestID", $("#contactList li.single-selected").data("guestid"));
            $("body").addClass("ui-loading");
            queryGuest.find({
                success: function(foundGuest) {
                    foundGuest[0].destroy({});
                    cm.showToast("Deleted Contact Successfully");
                    contactsMethods.fetchContactsList();
                    $("body").removeClass("ui-loading");
                },
                error: function() {
                    $("body").removeClass("ui-loading");
                    cm.showAlert("Sorry! couldn't update the status");
                }
            });
        } else if ($("#contactList li.single-selected").data("guestorhost") == "host") {
            // Updating the status of Host user
            if ($("#contactList li.single-selected").data("guestid") != localStorage.userId) {
                var hostClass = Parse.Object.extend("Host");
                var hostObj = new hostClass();
                var queryHost = new Parse.Query(hostObj);
                queryHost.equalTo("hostID", $("#contactList li.single-selected").data("guestid"));
                $("body").addClass("ui-loading");
                queryHost.find({
                    success: function(foundHost) {
                        foundHost[0].destroy({});
                        cm.showAlert("Deleted Contact Successfully");
                        contactsMethods.fetchContactsList();
                        $("body").removeClass("ui-loading");
                    },
                    error: function() {
                        $("body").removeClass("ui-loading");
                        cm.showAlert("Sorry! couldn't update the status");
                    }
                });
            } else cm.showToast("Sorry!You cannot delete yourself");
        }
        $("#contactOptionBlock").hide(); // Hide options block*/
        /*$("body").addClass("ui-loading");
        var guestsToBeDeleted = [],
            hostsToBeDeleted = [];
        $.each($('#contactList li .selectedContact'), function() {
            if ($(this).data("guestorhost") == "guest")
                guestsToBeDeleted.push($(this).data("guestid"));
            else if ($(this).data("guestorhost") == "host")
                hostsToBeDeleted.push($(this).data("guestid"));
        });
        $("body").removeClass("ui-loading");
        contactsMethods.deleteGuest(guestsToBeDeleted, hostsToBeDeleted); //Initially delete the Guests*/
    },
    deleteGuest: function(guestsToBeDeleted, hostsToBeDeleted) {
        // To Delete the selected Guests
        var guestClass = Parse.Object.extend("Guest");
        var guestQuery = new Parse.Query(guestClass);
        /*for (var i = 0; i < guestsToBeDeleted.length; i++) {
            guestQuery.equalTo("guestID", guestsToBeDeleted[i]); // Guest Query to find the correct guest
            guestQuery.find({
                success: function(foundGuest) {
                    foundGuest.destroy({});
                    $("body").removeClass('ui-loading');
                },
                error: function(error) {
                    cm.showAlert('Sorry!Unable to delete the Guest');
                    $("body").removeClass('ui-loading');
                }
            });
            
        }
        if (hostsToBeDeleted.length == 0)
            cm.showAlert("Deleted the selected Contacts"); //No Hosts has been selected so stoping the deletion
        else if (hostsToBeDeleted.length > 0)
            contactsMethods.deleteHost(hostsToBeDeleted); //We have hosts to be deleted */

    },
    deleteHost: function(hostsToBeDeleted) {
        // To Delete the selected Hosts
        /* var hostClass = Parse.Object.extend("Host");
         var hostQuery = new Parse.Query(hostClass);
         for (var i = 0; i < hostsToBeDeleted.length; i++) {
             hostQuery.equalTo("hostID", hostsToBeDeleted[i]); //Host query to find the selected Host
             hostQuery.find({
                     success: function(foundHost) {
                         foundHost.destroy({});
                         $("body").removeClass('ui-loading');
                     },
                     error: function(error) {
                         cm.showAlert('Sorry!Unable to delete the Guest');
                         $("body").removeClass('ui-loading');
                     }
                 });
                 
         }
         cm.showAlert("Deleted the selected Contacts");*/
    },
    openStatusPopup: function() {
        // To Open the status changer popup
        $("#contactStatusPopup").popup("open");
    },
    changeStatus: function(userStatus) {
        // To Change the status of the selected contacts :ToDo:Need to update the status of the selected contacts
        var statusText = "";
        // To change the status text as Attending and Not Attending
        if (userStatus == "ayes")
            statusText = "Attending"
        else if (userStatus == "ano")
            statusText = "Not Attending";
        else if (userStatus == "iyes")
            statusText = "Invited";


        if ($("#contactList li.single-selected").data("guestorhost") == "guest") {
            // Updating the status of Guest user
            var guestClass = Parse.Object.extend("Guest");
            var guestObj = new guestClass();
            var queryGuest = new Parse.Query(guestObj);
            queryGuest.equalTo("guestID", $("#contactList li.single-selected").data("guestid"));
            $("body").addClass("ui-loading");
            queryGuest.find({
                success: function(foundGuest) {
                    $("#contactStatusPopup").popup("close");
                    foundGuest[0].set("status", statusText);
                    foundGuest[0].save();
                    cm.showToast("Updated status Successfully");
                    // $("#contactOptionBlock").hide();
                    contactsMethods.fetchContactsList();
                    $("body").removeClass("ui-loading");
                },
                error: function() {
                    $("body").removeClass("ui-loading");
                    cm.showAlert("Sorry! couldn't update the status");
                }
            });
        } else if ($("#contactList li.single-selected").data("guestorhost") == "host") {
            // Updating the status of Host user
            if ($("#contactList li.single-selected").data("guestid") != localStorage.userId) {
                var hostClass = Parse.Object.extend("Host");
                var hostObj = new hostClass();
                var queryHost = new Parse.Query(hostObj);
                queryHost.equalTo("hostID", $("#contactList li.single-selected").data("guestid"));
                $("body").addClass("ui-loading");
                queryHost.find({
                    success: function(foundHost) {
                        $("#contactStatusPopup").popup("close");
                        foundHost[0].set("status", statusText);
                        foundHost[0].save();
                        cm.showToast("Updated status Successfully");
                        // $("#contactOptionBlock").hide();
                        contactsMethods.fetchContactsList();
                        $("body").removeClass("ui-loading");
                    },
                    error: function() {
                        $("body").removeClass("ui-loading");
                        cm.showAlert("Sorry! couldn't update the status");
                    }
                });
            } else cm.showToast("Sorry!You are changing your own status");
        }
    },
    collectUserId: function(status) {
        // To collect the list of Mobile numbers in an array
        contactsMethods.selectedContactsArray.length = 0; // Empty the array
        contactsMethods.iterator = 0; // reinitialize the iterator
        $("#contactList li.single-selected").each(function(index, item) {
            if (typeof $(item).data("guestid") != null) {
                // If the selected contacts is having a guestid just push it to array
                var contactObj = {};
                contactObj.userId = $(item).data("guestid");
                contactObj.guestOrHost = $(item).data("guestorhost");
                contactsMethods.selectedContactsArray.push(contactObj);
            }
        });
        console.log(contactsMethods.selectedContactsArray);
        if (contactsMethods.selectedContactsArray.length > 0)
            contactsMethods.inviteUser(status); // if contacts array has value change their status
    },
    inviteUser: function(userStatus) {
        // To Invite the selected contact via whatsapp
        /*var receiver = $("#contactList li.single-selected").data("mobilenumber");
        console.log("receiver:" + receiver);
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var inviteMessage = "Welcome to " + weddingDetailsObject.brideAndGroomName + " wedding on " + weddingDetailsObject.dater + " for more info install Shaadi app";
        console.log("inviteMessage:" + inviteMessage);
        window.plugins.socialsharing.shareViaWhatsAppToReceiver(receiver, inviteMessage, null  , null  , function() {
            console.log('share ok')
        });*/
        if (userStatus == "ayes")
            statusText = "Attending"
        else if (userStatus == "ano")
            statusText = "Not Attending";
        else if (userStatus == "iyes")
            statusText = "Invited";

        var noOfContacts = contactsMethods.selectedContactsArray.length;
        var selectedContacts = contactsMethods.selectedContactsArray;
        if (selectedContacts[contactsMethods.iterator].guestOrHost == "guest") {
            var guestClass = Parse.Object.extend("Guest");
            var guestObj = new guestClass();
            var queryGuest = new Parse.Query(guestObj);
            queryGuest.equalTo("guestID", selectedContacts[contactsMethods.iterator].userId);
            $("body").addClass("ui-loading");
            queryGuest.find().then(function(foundGuests) {
                // Find the weddings
                var rowObject = foundGuests[0];
                rowObject.set("status", statusText);
                rowObject.save();
                contactsMethods.iterator++;
                console.log("contactsMethods.iterator:" + contactsMethods.iterator);
                if (contactsMethods.iterator < noOfContacts)
                    contactsMethods.inviteUser();
                else {
                    if (localStorage.cSPopupShown == "true")
                        $("#contactStatusPopup").popup("close");
                    // $("#contactOptionBlock").hide();
                    contactsMethods.fetchContactsList();
                }

            });
        } else if (selectedContacts[contactsMethods.iterator].guestOrHost == "host") {
            var hostClass = Parse.Object.extend("Host");
            var hostObj = new hostClass();
            var queryHost = new Parse.Query(hostObj);
            queryHost.equalTo("guestID", selectedContacts[contactsMethods.iterator].userId);
            $("body").addClass("ui-loading");
            queryHost.find().then(function(foundHosts) {
                // Find the weddings
                var rowObject = foundHosts[0];
                rowObject.set("status", statusText);
                rowObject.save();
                contactsMethods.iterator++;
                console.log("contactsMethods.iterator:" + contactsMethods.iterator);
                if (contactsMethods.iterator < noOfContacts)
                    contactsMethods.inviteUser();
                else {
                    // cm.showToast("Invited Successfully");
                    if (localStorage.cSPopupShown == "true")
                        $("#contactStatusPopup").popup("close");
                    // $("#contactOptionBlock").hide();
                    contactsMethods.fetchContactsList();
                }

            });
        }
    },
    shareOpener: function() {
        // To share the information
        var inviterClass = Parse.Object.extend("InviterMessages");
        var inviterObj = new inviterClass();
        var queryInviter = new Parse.Query(inviterObj);
        queryInviter.equalTo("InviteName", "GeneralInvite");
        $("body").addClass("ui-loading");
        queryInviter.find().then(function(foundInvites) {
            console.log("foundInvites[0].InviteContent" + foundInvites[0]);
            // window.plugins.socialsharing.shareViaWhatsApp(foundInvites[0].InviteContent, null, null, foundInvites[0].InviteUrl || null);
            window.plugins.socialsharing.shareViaWhatsApp(foundInvites[0].get("InviteContent"), null /* img */ , foundInvites[0].get("InviteUrl") || null /* url */ , function() { console.log('share ok') }, function(errormsg) { alert(errormsg) })
            $("body").removeClass("ui-loading");
        });

    },
    mailUser: function() {
        // To Invite the selected contact via email
        $("#contactList li.single-selected").each(function(index, item) {
            if ($(item).data("emailid") != "undefined") {
                // If the selected contacts is having a guestid just push it to array

                contactsMethods.selectedContactsArray.push($(item).data("emailid"));
            }
        });
        var receiver = contactsMethods.selectedContactsArray || null;
        console.log("receiver:" + receiver);
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var inviteMessage = "Welcome to " + weddingDetailsObject.brideAndGroomName + " wedding on " + weddingDetailsObject.dater + " for more info install Shaadi app";
        console.log("inviteMessage:" + inviteMessage);
        window.plugins.socialsharing.shareViaEmail(
            inviteMessage, // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
            inviteMessage, receiver, // TO: must be null or an array
            null, // CC: must be null or an array
            null, // BCC: must be null or an array
            null, // FILES: can be null, a string, or an array
            function() {
                console.log("Successfully Invited the guest");
                contactsMethods.changeStatus("iyes");
            }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
            function() {
                console.log("Unable to Invite the guest");
            } // called when sh*t hits the fan
        );
    },
    searchContacts: function() {
        // To Search the contacts based on the selected constrained :ToDo:Include Status based search
        localStorage.cachedContacts = ""; // clear the cached contacts
        searchOptions.all = $("#cSelectAll").prop("checked");
        searchOptions.host = $("#cHost").prop("checked");
        searchOptions.guest = $("#cGuest").prop("checked");
        searchOptions.status = $("#cStatus").prop("checked");
        searchOptions.notinvited = $("#cNotInvited").prop("checked");
        searchOptions.invited = $("#cInvited").prop("checked");
        searchOptions.registered = $("#cRegistered").prop("checked");
        searchOptions.attending = $("#cAttending").prop("checked");
        searchOptions.notattending = $("#cNotAttending").prop("checked");
        searchOptions.maybe = $("#cMaybe").prop("checked");
        searchOptions.outstation = $("#cOutstation").prop("checked");
        searchOptions.bride = $("#cBride").prop("checked");
        searchOptions.groom = $("#cGroom").prop("checked");
        //if(searchOptions.notinvited=="on"&&searchOptions.invited=="on"&&searchOptions.registered="on")
        if (searchOptions.status) {
            localStorage.fstatus = "all";
            searchOptions.status = false;
        } else if (searchOptions.notinvited) {
            searchOptions.status = true;
            localStorage.fstatus = "Not Invited";
        } else if (searchOptions.invited) {
            searchOptions.status = true;
            localStorage.fstatus = "Invited";
        } else if (searchOptions.registered) {
            searchOptions.status = true;
            localStorage.fstatus = "Registered";
        } else if (searchOptions.attending) {
            searchOptions.status = true;
            localStorage.fstatus = "Attending";
        } else if (searchOptions.notattending) {
            searchOptions.status = true;
            console.log("Filtering Not Attending");
            localStorage.fstatus = "Not Attending";
        } else if (searchOptions.maybe) {
            searchOptions.status = true;
            localStorage.fstatus = "Maybe";
        }

        if (searchOptions.all || (searchOptions.notinvited && searchOptions.invited && searchOptions.registered)) {
            localStorage.normalOrOutstation = "normal";
            $(":mobile-pagecontainer").pagecontainer("change", "contacts.html", {
                showLoadMsg: false
            });
        } else if (searchOptions.outstation) {
            localStorage.normalOrOutstation = "outstation";
            $(":mobile-pagecontainer").pagecontainer("change", "contacts.html", {
                showLoadMsg: false
            });
        } else if (searchOptions.host && !searchOptions.guest) {
            localStorage.normalOrOutstation = "hostalone";
            $(":mobile-pagecontainer").pagecontainer("change", "contacts.html", {
                showLoadMsg: false
            });
        } else if (!searchOptions.host && searchOptions.guest) {
            localStorage.normalOrOutstation = "guestalone";
            $(":mobile-pagecontainer").pagecontainer("change", "contacts.html", {
                showLoadMsg: false
            });
        } else {
            localStorage.normalOrOutstation = "normal";
            $(":mobile-pagecontainer").pagecontainer("change", "contacts.html", {
                showLoadMsg: false
            });
        }
    }



};

$("#cSelectAll").change(function() {
    // To make the needed change based on the select all option in Filter contacts page
    if ($("#cSelectAll").prop("checked")) {
        console.log("Selected all");
        $("#cHostAndGuest,#cBrideAndGroom,#cStatus,#cOutstation").prop("checked", true).flipswitch("refresh");
    } else if (!$("#cSelectAll").prop("checked")) {
        console.log("Deselected all");
        $("#cHostAndGuest,#cBrideAndGroom,#cStatus,#cOutstation").prop("checked", false).flipswitch("refresh");
    }
});
$("#cHostAndGuest").change(function() {
    // Both Host and Guest controller
    if ($(this).prop("checked")) {
        $("#cGuest,#cHost").prop("checked", true).flipswitch("refresh");
        $("#cOutstation").prop("checked", false).flipswitch("refresh");
    } else if (!$(this).prop("checked")) {
        $("#cGuest,#cHost,#cSelectAll").prop("checked", false).flipswitch("refresh");
    }
});
$("#cBrideAndGroom").change(function() {
    // Both Bride and Groom controller
    if ($(this).prop("checked")) {
        $("#cBride,#cGroom").prop("checked", true).flipswitch("refresh");
    } else if (!$(this).prop("checked")) {
        $("#cBride,#cGroom,#cSelectAll").prop("checked", false).flipswitch("refresh");
    }
});
$("#cHost").change(function() {
    // Host controller
    if ($(this).prop("checked") && $("#cGuest").prop("checked")) {
        $("#cHostAndGuest").prop("checked", true).flipswitch("refresh");
        $("#cOutstation").prop("checked", false).flipswitch("refresh");
    } else if (!$(this).prop("checked") || !$("#cGuest").prop("checked")) {
        $("#cHostAndGuest,#cSelectAll").prop("checked", false).flipswitch("refresh");
    }
});
$("#cGuest").change(function() {
    // Bride controller
    if ($(this).prop("checked") && $("#cHost").prop("checked")) {
        $("#cHostAndGuest").prop("checked", true).flipswitch("refresh");
    } else if (!$(this).prop("checked") || !$("#cHost").prop("checked")) {
        $("#cHostAndGuest,#cSelectAll").prop("checked", false).flipswitch("refresh");
    }
});
$("#cBride").change(function() {
    // Host controller
    if ($(this).prop("checked") && $("#cGroom").prop("checked")) {
        $("#cBrideAndGroom").prop("checked", true).flipswitch("refresh");
    } else if (!$(this).prop("checked") || !$("#cGroom").prop("checked")) {
        $("#cBrideAndGroom,#cSelectAll").prop("checked", false).flipswitch("refresh");
    }
});
$("#cGroom").change(function() {
    // Bride controller
    if ($(this).prop("checked") && $("#cBride").prop("checked")) {
        $("#cBrideAndGroom").prop("checked", true).flipswitch("refresh");
    } else if (!$(this).prop("checked") || !$("#cBride").prop("checked")) {
        $("#cBrideAndGroom,#cSelectAll").prop("checked", false).flipswitch("refresh");
    }
});
$("#cInvited").change(function() {
    // If Invited turned on turn off NotInvited
    if ($(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cNotInvited,#cRegistered,#cAttending,#cMaybe,#cNotAttending").prop("checked", false).flipswitch("disable").flipswitch("refresh");
    } else if (!$(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cNotInvited,#cRegistered,#cAttending,#cMaybe,#cNotAttending").prop("checked", false).flipswitch("enable").flipswitch("refresh");
    }
});
$("#cNotInvited").change(function() {
    // If NotInvited turned on turn off Invited
    if ($(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cInvited,#cRegistered,#cAttending,#cMaybe,#cNotAttending").prop("checked", false).flipswitch("disable").flipswitch("refresh");
    } else if (!$(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cInvited,#cRegistered,#cAttending,#cMaybe,#cNotAttending").prop("checked", false).flipswitch("enable").flipswitch("refresh");
    }
});
$("#cRegistered").change(function() {
    // If NotInvited turned on turn off Invited
    if ($(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cInvited,#cNotInvited,#cAttending,#cMaybe,#cNotAttending").prop("checked", false).flipswitch("disable").flipswitch("refresh");
    } else if (!$(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cInvited,#cNotInvited,#cAttending,#cMaybe,#cNotAttending").prop("checked", false).flipswitch("enable").flipswitch("refresh");
    }
});
$("#cAttending").change(function() {
    // If NotInvited turned on turn off Invited
    if ($(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cInvited,#cNotInvited,#cRegistered,#cMaybe,#cNotAttending").prop("checked", false).flipswitch("disable").flipswitch("refresh");
    } else if (!$(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cInvited,#cNotInvited,#cRegistered,#cMaybe,#cNotAttending").prop("checked", false).flipswitch("enable").flipswitch("refresh");
    }
});
$("#cMaybe").change(function() {
    // If NotInvited turned on turn off Invited
    if ($(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cInvited,#cNotInvited,#cRegistered,#cAttending,#cNotAttending").prop("checked", false).flipswitch("disable").flipswitch("refresh");
    } else if (!$(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cInvited,#cNotInvited,#cRegistered,#cAttending,#cNotAttending").prop("checked", false).flipswitch("enable").flipswitch("refresh");
    }
});
$("#cNotAttending").change(function() {
    // If NotInvited turned on turn off Invited
    if ($(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cInvited,#cNotInvited,#cRegistered,#cAttending,#cMaybe").prop("checked", false).flipswitch("disable").flipswitch("refresh");
    } else if (!$(this).prop("checked") && !$("#cStatus").prop("checked")) {
        $("#cInvited,#cNotInvited,#cRegistered,#cAttending,#cMaybe").prop("checked", false).flipswitch("enable").flipswitch("refresh");
    }
});
$("#cStatus").change(function() {
    // To turn and off/on all the status
    if ($(this).prop("checked")) {
        $("#cInvited,#cNotInvited,#cRegistered,#cAttending,#cMaybe,#cNotAttending").prop("checked", true).flipswitch("refresh");
    } else if (!$(this).prop("checked")) {
        $("#cInvited,#cNotInvited,#cRegistered,#cAttending,#cMaybe,#cNotAttending").prop("checked", false).flipswitch("enable").flipswitch("refresh");
    }
});
$("#cOutstation").change(function() {
    // To turn and off/on Host
    if ($(this).prop("checked")) {
        $("#cHost,#cHostAndGuest").prop("checked", false).flipswitch("refresh");
    }
});
/*$("#cStatus").change(function() {
    // To make the needed change based on the status option in Filter contacts page
    if ($("#cStatus").val() == "on") {
        $("#cNotInvited,#cInvited,#cRegistered,#cAttending").slider("enable").val("on").slider("refresh");
    } else if ($("#cStatus").val() == "off") {
        $("#cNotInvited,#cInvited,#cRegistered").val("off").slider("refresh");
    }
});
$("#cInvited,#cNotInvited,#cRegistered,#cAttending").change(function() {
    // If all the types of status has been turned on Status will be turned on
    if ($("#cInvited").val() == "on" && $("#cNotInvited").val() == "on" && $("#cRegistered").val() == "on" && $("#cAttending").val() == "on") {
        $("#cStatus").val("on").slider("refresh");
    } else {
        $("#cStatus").val("off").slider("refresh");
    }
});
$("#cNotInvited").change(function() {
    // If Not invited has been turned on Invited will be turned off
    if ($("#cNotInvited").val() == "on" && $("#cStatus").val() == "off")
        $("#cInvited,#cRegistered,#cAttending").val("off").slider("disable").slider("refresh");
    else if ($("#cNotInvited").val() == "off" && $("#cStatus").val() == "off")
        $("#cInvited,#cRegistered,#cAttending").slider("enable").slider("refresh");
});
$("#cInvited").change(function() {
    // If invited has been turned on Invited will be turned off
    if ($("#cInvited").val() == "on" && $("#cStatus").val() == "off")
        $("#cNotInvited,#cRegistered,#cAttending").val("off").slider("disable").slider("refresh");
    else if ($("#cInvited").val() == "off" && $("#cStatus").val() == "off")
        $("#cNotInvited,#cRegistered,#cAttending").slider("enable").slider("refresh");
});
$("#cRegistered").change(function() {
    // If Registered has been turned on Invited will be turned off
    if ($("#cRegistered").val() == "on" && $("#cStatus").val() == "off")
        $("#cNotInvited,#cInvited,#cAttending").val("off").slider("disable").slider("refresh");
    else if ($("#cRegistered").val() == "off" && $("#cStatus").val() == "off")
        $("#cNotInvited,#cInvited,#cAttending").slider("enable").slider("refresh");
});
$("#cAttending").change(function() {
    // If Registered has been turned on Invited will be turned off
    if ($("#cAttending").val() == "on" && $("#cStatus").val() == "off")
        $("#cNotInvited,#cInvited,#cRegistered").val("off").slider("disable").slider("refresh");
    else if ($("#cAttending").val() == "off" && $("#cStatus").val() == "off")
        $("#cNotInvited,#cInvited,#cRegistered").slider("enable").slider("refresh");
});
$("#cOutstation").change(function() {
    // If Outstation is turned on Host has to be disabled
    if ($("#cOutstation").val() == "on") {
        $("#cHost").val("off").slider("disable").slider("refresh");
    } else if ($("#cOutstation").val() == "off") {
        $("#cHost").slider("enable").slider("refresh");
    }
});
$("#cHost").change(function() {
    // If Host is turned on Outstation has to be turned off
    if ($("#cHost").val() == "on") {
        $("#cOutstation").val("off").slider("disable").slider("refresh");
    } else if ($("#cHost").val() == "off") {
        $("#cOutstation").slider("enable").slider("refresh");
    }
});*/

$("#genericContactList").on("click", "li.foundContact", function() {
    $(this).toggleClass("selectedContact");
});

$("#contactList").on("taphold", "li.contactli", function() {
    // To Change the color of the Selected Contacts
    console.log("Clicked contact");
    var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
    if (weddingDetailsObject.usertype == "host")
        $(this).toggleClass("single-selected");
    if ($("li.single-selected").length > 0) // To show or hide the Contacts options
        $("#contactOptionBlock").show();
    else $("#contactOptionBlock").hide();
});

$("input[name='nHGender']").on("click", function() {
    localStorage.newHostGender = $(this).val();
});

$("input[name='nGGender']").on("click", function() {
    localStorage.guestGender = $(this).val();
});

$("input[name='nHBrideOrGroomSide']").on("click", function() {
    localStorage.newHostBrideOrGroomSide = $(this).val();
});


$("input[name='nGBrideOrGroomSide']").on("click", function() {
    localStorage.brideOrGroomSide = $(this).val();
});

$("input[name='nGOutstationOrNot']").on("click", function() {
    localStorage.outstationOrNot = $(this).val();
    if ($(this).val() == "true")
        $("#outstationGuestBlock").show();
    else if ($(this).val() == "false")
        $("#outstationGuestBlock").hide();

});

$("input[name='nGPickupNeeded']").on("click", function() {
    localStorage.pickupNeededOrNot = $(this).val();
});

$("input[name='nGDropNeeded']").on("click", function() {
    localStorage.dropNeededOrNot = $(this).val();
});

$("input[name='nGAccOffered']").on("click", function() {
    localStorage.accommodationOfferedOrNot = $(this).val();
});

$("input[name='nGCabOffered']").on("click", function() {
    localStorage.travelOfferedOrNot = $(this).val();
});


$("#contactStatusPopup").on("popupafteropen", function(event, ui) {
    localStorage.cSPopupShown = "true";
});

$("#contactStatusPopup").on("popupafterclose", function(event, ui) {
    localStorage.cSPopupShown = "false";
});
