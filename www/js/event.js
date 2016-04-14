var eventsMethods = {
    eventGuestsArray: [],
    createdGuestContactId: [],
    showPopup: function(popupName) {
        // To open popups
        $("#" + popupName).popup("open");
    },
    inviteGuests: function(guestType) {
        // To invite guests for Events
        localStorage.invitedGuests = guestType; // store the Guests invited for events
        $("#eventInviterPopup").popup("close"); // close the popup
        /*Only for edit event guests*/
        if (localStorage.editEventGuestFlag == "true" && localStorage.editEventGuestFlag != null) {
            // Edit event guests has been enabled
            var eventClass = Parse.Object.extend("Event");
            var eventObj = new eventClass();
            eventObj.id = localStorage.editableEventId;
            eventObj.set("eventGuests", localStorage.invitedGuests);
            $("body").addClass("ui-loading");
            eventObj.save(null, {
                success: function() {
                    localStorage.editEventGuestFlag = "false"; // disable editing
                    localStorage.editableEventId = ""; // clear the selected event id
                    cm.showToast("Event guests updated successfully");
                    $("body").removeClass("ui-loading");
                    eventsMethods.listEvents();
                },
                error: function() {
                    cm.showAlert("Sorry!Unable to update event guests");
                    $("body").removeClass("ui-loading");
                }
            });
        }
    },
    editEventGuests: function(selectedEvent) {
        // To edit the event guests
        localStorage.editEventGuestFlag = "true"; // set edit event guest flag true
        localStorage.editableEventId = $(selectedEvent).data("eventid"); // set the editable event id
        eventsMethods.showPopup("eventInviterPopup"); // show the event inviter popup
    },
    fetchWeddingInfo: function() {
        // To Show the selected Wedding Info
        var weddingClass = Parse.Object.extend("Wedding");
        var weddingQuery = new Parse.Query(weddingClass);
        $("body").addClass("ui-loading");
        weddingQuery.equalTo('weddingID', localStorage.joinedWedding);
        weddingQuery.find({
            success: function(weddingResults) {
                var rowObject = weddingResults[0];
                var dateOfWedding = rowObject.get('dateOfWedding');
                var timeDiff = cm.dateDiffCalc(dateOfWedding);
                $("#daysLeft").html(timeDiff);
                var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
                $("#dayType").html("Days " + weddingDetailsObject.status);
                $("#cName").html(weddingDetailsObject.brideAndGroomName);
                $("#nofdaysdiv").show();
                $("#weddateDetails").html("Join us on " + weddingDetailsObject.dater + " for our Wedding");
                if (weddingDetailsObject.usertype == "guest"){
                    // $(".addeventcls").hide();
                    $("#eventAdderBtn").hide();
                }
                
                else if(weddingDetailsObject.usertype == "host"){
                    $("#eventAdderBtn").show(); // Add event button will be visible only for Host
                    // $(".addeventcls").show();
                }
                
                $("body").removeClass("ui-loading");
                eventsMethods.listEvents();
            },
            error: function(weddingError) {
                $("body").removeClass("ui-loading");

            }
        });
    },
    listEvents: function() {
        // To List the Events and fill Event details
        var eventClass = Parse.Object.extend("Event");
        var eventQuery = new Parse.Query(eventClass);
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        eventQuery.equalTo("weddingID", localStorage.joinedWedding);

        $("body").addClass("ui-loading");
        eventQuery.find({
            success: function(eventResults) {
                if (weddingDetailsObject.usertype == "host") {
                    eventsMethods.listHostEvents(eventResults);
                } else {
                    eventsMethods.listGuestEvents(eventResults);
                }
            },
            error: function(eventError) {
                cm.showAlert("Sorry!Couldn't get Events");
                $("body").removeClass("ui-loading");
            }
        });

    },
    listHostEvents: function(eventResults) {
        var eventsHtml = "";
        console.log("I am a host");
        for (var i = 0; i < eventResults.length; i++) {
            var rowObject = eventResults[i];
            var eventPic = rowObject.get("eventImg") || "./img/add-photo.png";
            var eventDateFormatted = cm.dateFormatter(rowObject.get("eventDateTime"));
            eventsHtml += '<div class="event-inner">'; // event data start
            eventsHtml += '<span class="event-list-toolbar customent">'; // event toolbar start
            eventsHtml += '<span class="toolbar-icon event-edit" data-eventId="' + rowObject.get("eventID") + '" onclick="eventsMethods.editEvent(this)">Edit</span>'; // edit start & end
            eventsHtml += '<span class="toolbar-icon event-delete" data-eventId="' + rowObject.get("eventID") + '" onclick="eventsMethods.deleteEvent(this)">Delete</span>'; // delete start & end
            eventsHtml += '</span>'; // event toolbar end
            eventsHtml += '<div data-role="collapsible" class="event-list edit-event-list">'; // collapsible start
            eventsHtml += '<h4>'; // event banner container start
            eventsHtml += '<span class="event-banner"><img src="' + eventPic + '"></span>'; // event banner start
            eventsHtml += '<span class="event-list-content"> <span class="event-title">' + rowObject.get("eventName") + '</span></span>'; // event title
            eventsHtml += '</h4>'; // event banner container end
            eventsHtml += '<p>'; // event description start
            eventsHtml += '<span>Description:</span>' + rowObject.get("eventDesc"); // Event Description start & end
            eventsHtml += '<br><span>Date:</span>' + eventDateFormatted; // Event Date start & end
            eventsHtml += '<br><span>Time:</span>' + rowObject.get("eventTime"); // Event Time start & end
            eventsHtml += '<br><span>Venue:</span>' + rowObject.get("Venue"); // Event Venue start & end
            eventsHtml += '<br><span>Menu:</span>' + rowObject.get("Menu"); // Event Menu start & end
            eventsHtml += '</p>'; // event description end
            eventsHtml += '</div>'; // collapsible end
            eventsHtml += '<div class="event-status"><span class="toolbar-icon event-invited">' + eventsMethods.getGuestType(rowObject.get("eventGuests")) + '</span>';
            eventsHtml += '<span class="toolbar-icon event-edit" data-eventid="' + rowObject.get("eventID") + '" onclick="eventsMethods.editEventGuests(this)">Edit Guests</span> </div>';
            eventsHtml += '</div>'; // event data end
        }
        $("#eventList").html(eventsHtml).trigger('create');
        $("body").removeClass("ui-loading");
    },
    listGuestEvents: function(eventResults) {
        var eventsHtml = "";
        console.log("I am a guest");
        for (var i = 0; i < eventResults.length; i++) {
            var rowObject = eventResults[i];
            var eventPic = rowObject.get("eventImg") || "./img/create-new.png";
            var eventDateFormatted = cm.dateFormatter(rowObject.get("eventDateTime"));
            eventsHtml += '<div class="event-inner">'; // event data start
            eventsHtml += '<span class="event-list-toolbar customent">'; // event toolbar start
            eventsHtml += '<span class="toolbar-icon event-join" data-eventId="' + rowObject.get("eventID") + '" data-addedby="' + rowObject.get("addedBy") + '" data-joinstatus="Yes" onclick="eventsMethods.joinEvent(this)">Join</span>'; // join start & end
            eventsHtml += '<span class="toolbar-icon event-maybe" data-eventId="' + rowObject.get("eventID") + '" data-addedby="' + rowObject.get("addedBy") + '" data-joinstatus="Maybe" onclick="eventsMethods.joinEvent(this)">Maybe</span>'; // maybe start & end
            eventsHtml += '<span class="toolbar-icon event-no" data-eventId="' + rowObject.get("eventID") + '" data-addedby="' + rowObject.get("addedBy") + '" data-joinstatus="No" onclick="eventsMethods.joinEvent(this)">No</span>'; // No start & end
            eventsHtml += '</span>'; // event toolbar end
            eventsHtml += '<div data-role="collapsible" class="event-list customevtlist">'; // collapsible start
            eventsHtml += '<h4>'; // event banner container start
            eventsHtml += '<span class="event-banner"><img src="' + eventPic + '"></span>'; // event banner start
            eventsHtml += '<span class="event-list-content"><span class="event-title">' + rowObject.get("eventName") + '</span></span>'; // event title
            eventsHtml += '</h4>'; // event banner container end
            eventsHtml += '<p>'; // event description start
            eventsHtml += '<span>Description:</span>' + rowObject.get("eventDesc"); // Event Description start & end
            eventsHtml += '<br><span>Date:</span>' + eventDateFormatted; // Event Date start & end
            eventsHtml += '<br><span>Time:</span>' + rowObject.get("eventTime"); // Event Time start & end
            eventsHtml += '<br><span>Venue:</span>' + rowObject.get("Venue"); // Event Venue start & end
            eventsHtml += '<br><span>Menu:</span>' + rowObject.get("Menu"); // Event Menu start & end
            eventsHtml += '</p>'; // event description end
            eventsHtml += '</div>'; // collapsible end
            eventsHtml += '<div class="event-status">'; // Event status start
            eventsHtml += '<span class="toolbar-icon event-date">' + eventDateFormatted + '</span>'; // Event date start & end
            eventsHtml += '<span class="toolbar-icon event-time">' + rowObject.get("eventTime") + '</span>'; // Event time start & end
            eventsHtml += '<span class="toolbar-icon event-invited">' + eventsMethods.getGuestType("getGuestType") + '</span>'; // No.Guests invited ToDo:Add dynamic data
            eventsHtml += '<span class="toolbar-icon event-map" data-elat="' + rowObject.get("venueLocationLatitude") + '" data-elong="' + rowObject.get("venueLocationLongitude") + '" onclick="eventsMethods.showEventLoc(this)">Map</span>'; // Map button
            eventsHtml += '</div>'; // Event status end
            eventsHtml += '</div>'; // event data end
        }
        $("#eventList").html(eventsHtml).trigger('create');
        $("body").removeClass("ui-loading");
    },
    addEventPhoto: function() {
        navigator.camera.getPicture(function(eventImage) {
            $("#eventPic,#eventPic_edit").hide();
            if (localStorage.eventAction == "add") {
                $("#eventImg").attr("src", "data:image/jpeg;base64," + eventImage);
                $("#eventPic").show();
            } else if (localStorage.eventAction == "edit") {
                $("#eventImg_edit").attr("src", "data:image/jpeg;base64," + eventImage);
                $("#eventPic_edit").show();
            }
            // $(".addphoto-bg").hide();
            $("#eventPicTemplate").hide();
        }, function(eventImageError) {
            cm.showAlert("Sorry!Couldn't pick the selected Event Photo");
        }, {
            quality: 100,
            targetWidth: 200,
            targetHeight: 200,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            destinationType: Camera.DestinationType.DATA_URL
        });
    },
    validateEvent: function(pickContact) {
        eventAction = localStorage.eventAction;
        if (localStorage.editEventGuestFlag == "true") {
            eventsMethods.changeToInviteGuestPage(localStorage.editableEventId);
            return;
        }
        if ($("#addEventName").val() == "")
            cm.showAlert("Please enter Event name");

        /*else if (eventAction == "add" && $("#eventImg").attr('src') == "")
            cm.showAlert("Please add a Cover Photo");
        else if (eventAction == "update" && $("#eventImg_edit").attr('src') == "")
            cm.showAlert("Please add a Cover Photo");
        else if ($("#addEventDes").val() == "")
            cm.showAlert("Please enter Event description");*/
        else if ($("#addEventDate").val() == "")
            cm.showAlert("Please enter Event date");
        else if (cm.isEventDateValid($("#addEventDate").val()))
            cm.showAlert("Event date shouldn't be after 30 days of wedding");
        else if ($("#addEventTime").val() == "")
            cm.showAlert("Please enter Event time");
        else if (localStorage.invitedGuests == "" || localStorage.invitedGuests == null)
            cm.showAlert("Please Invite guests for the Event");
        /*else if ($("#addEventVenu").val() == "")
            cm.showAlert("Please enter Event venue");*/
        else {
            if (eventAction == "add")
                eventsMethods.addEvent("pickContact");
            else if (eventAction == "edit")
                eventsMethods.updateEvent("pickContact");

        }
    },
    getGuestType: function(guestType) {
        // To get the Guest type name
        switch (guestType) {
            case "groom":
                return "Groom Side";
                break;
            case "bride":
                return "Bride Side";
                break;
            case "all":
                return "All Guests";
                break;
            case "custom":
                return "Special Guests";
                break;
            default:
                return "All Guests";
        }

    },
    addEvent: function(pickContact) {
        // To add an event 
        $("body").addClass("ui-loading");
        var eventClass = Parse.Object.extend("Event");
        var eventObj = new eventClass();
        eventObj.set("eventName", $("#addEventName").val());
        eventObj.set("weddingID", localStorage.joinedWedding);
        eventObj.set("addedBy", localStorage.userId);
        eventObj.set("eventDesc", $("#addEventDes").val());
        eventObj.set("eventDateTime", new Date($("#addEventDate").val() + " " + $("#addEventTime").val()));
        eventObj.set("eventTime", $("#addEventTime").val());
        eventObj.set("Venue", localStorage.venueName || "India"); // Venue name
        eventObj.set("venueLocationLatitude", localStorage.venueLat || "23.719108"); // Venue Latitude
        eventObj.set("venueLocationLongitude", localStorage.venueLon || "79.033377"); // Venue Longitude
        eventObj.set("Menu", $("#addEventMenu").val().toString());
        eventObj.set("eventImg", $("#eventImg").attr("src"));
        eventObj.set("eventGuests", localStorage.invitedGuests);
        eventObj.save(null, {
            success: function(eventSuccess) {
                eventObj.set("eventID", eventSuccess.id);
                eventObj.save();
                if (pickContact == "pickContact") {
                    // If pick contact is choosed change to contacts list page
                    eventsMethods.changeToInviteGuestPage(eventSuccess.id);
                }
                /*$('#addEventName').val('');
                $('#addEventDate').val('');
                $('#addEventTime').val('');
                //$('#addEventVenu').val('');
                $('#addEventMenu').val('');
                $('#addEventDes').val('');
                $("#eventImg,#eventImg_edit").prop("src", "");
                $("#eventPic,#eventPic_edit").hide();
                $("#eventPicTemplate").show();*/
                eventsMethods.toggleEventAdd(); // Hide the add/edit block after adding
                cm.showToast('Event Added Successfully');
                $("body").removeClass("ui-loading");
                eventsMethods.fetchWeddingInfo();
            },
            error: function() {
                $("body").removeClass("ui-loading");
            }
        });
    },
    editEvent: function(selectedEvent) {
        //To Edit a event
        /*$('html, body').animate({
            scrollTop: $(document).height()
        }, 'slow');*/
        /*$('#addEVent').hide();
        $('#updateEvent').show();*/
        $(".addeventcls").show();
        $.mobile.silentScroll($('.addeventcls').offset().top);
        $('#eventPic,#eventAdderBtn').hide();
        localStorage.eventAction = "edit";
        var eventClass = Parse.Object.extend("Event");
        var eventQuery = new Parse.Query(eventClass);
        eventQuery.equalTo("eventID", $(selectedEvent).data("eventid"));
        $("body").addClass("ui-loading");
        eventQuery.find({
            success: function(foundEvent) {
                $("#eventPicTemplate,#eventPic").hide();
                var rowObject = foundEvent[0];
                localStorage.selectedEventId = rowObject.id;
                $('#eventPic_edit').show();

                var img = rowObject.get('eventImg');
                if (img == '' || img == undefined || img == 'undefined') {
                    $('#eventPic_edit').hide();
                    editEventImg = ''
                } else {
                    editEventImg = img;
                    img = "data:image/jpeg;base64," + img;
                    //imageHtml = '<img height="60px" width="60px" class="roundrect" src="'+imageFile+'" alt="">';
                }
                $("#eventImg_edit").attr("src", rowObject.get('eventImg'));
                $('#addEventName').val(rowObject.get('eventName'));
                //$('#addEventName').val(rowObject.get('eventName'));
                $('#addEventDate').val(cm.dateValidator(rowObject.get('eventDateTime')));
                $('#addEventTime').val(rowObject.get('eventTime'));
                // $('#addEventVenu').val(rowObject.get('Venue'));
                if (rowObject.get('Menu') != null) {
                    var menuItems = rowObject.get('Menu');
                    console.log("menuItems:" + menuItems);
                    $.each(menuItems.split(","), function(i, e) {
                        $("#addEventMenu option[value='" + e + "']").prop("selected", true).change();
                    });
                }
                // $('#addEventMenu').val(rowObject.get('Menu')).change();
                $('#addEventDes').val(rowObject.get('eventDesc'));
                localStorage.userLatLng = rowObject.get('venueLocationLatitude')+","+rowObject.get('venueLocationLongitude');
                localStorage.userLat = rowObject.get('venueLocationLatitude');
                localStorage.userLng = rowObject.get('venueLocationLongitude');
                //localStorage.eventAction="add";
                localStorage.invitedGuests = rowObject.get('eventGuests') || "";

                $("body").removeClass("ui-loading");
            },
            error: function(eventError) {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't fetch Wedding details");
            }
        });
    },
    updateEvent: function(pickContact) {
        $("body").addClass("ui-loading");
        var eventClass = Parse.Object.extend("Event");
        var eventObj = new eventClass();
        eventObj.id = localStorage.selectedEventId;
        eventObj.set("eventName", $("#addEventName").val());
        eventObj.set("weddingID", localStorage.joinedWedding);
        eventObj.set("addedBy", localStorage.userId);
        eventObj.set("eventDesc", $("#addEventDes").val());
        eventObj.set("eventDateTime", new Date($("#addEventDate").val() + " " + $("#addEventTime").val()));
        eventObj.set("eventTime", $("#addEventTime").val());
        // eventObj.set("Venue", $("#addEventVenu").val());
        eventObj.set("Menu", $("#addEventMenu").val().toString());
        eventObj.set("eventImg", $("#eventImg_edit").attr("src"));
        eventObj.set("eventGuests", localStorage.invitedGuests);
        eventObj.save(null, {
            success: function(eventSuccess) {
                eventObj.set("eventID", eventSuccess.id);

                eventObj.save();
                if (pickContact == "pickContact") {
                    // If pick contact is choosed change to contacts list page
                    eventsMethods.changeToInviteGuestPage(eventSuccess.id);
                }
                /*$('#addEventName').val('');
                $('#addEventDate').val('');
                $('#addEventTime').val('');
                // $('#addEventVenu').val('');
                $('#addEventMenu').val('');
                $('#addEventDes').val('');
                $("#eventImg,#eventImg_edit").prop("src", "");
                $("#eventPic,#eventPic_edit").hide();
                $("#eventPicTemplate").show();*/
                eventsMethods.toggleEventAdd(); // Hide the add/edit block after updating
                cm.showToast('Event Updated Successfully');
                $("body").removeClass("ui-loading");
                //$('#addEVent').show();
                //$('#updateEvent').hide();
                $('#eventPic_edit,.addeventcls').hide();
                localStorage.eventAction = "add";
                eventsMethods.fetchWeddingInfo();
            },
            error: function() {
                $("body").removeClass("ui-loading");
            }
        });
    },
    changeToInviteGuestPage: function(eventID) {
        // Save the event id locally and transform to event_guest page
        localStorage.inviterEventID = eventID; // save event id to update in eventguest table
        $(":mobile-pagecontainer").pagecontainer("change", "event_guest.html", {
            showLoadMsg: false
        });
    },
    deleteEvent: function(selectedEvent) {
        var eventClass = Parse.Object.extend("Event");
        var eventQuery = new Parse.Query(eventClass);
        eventQuery.equalTo("eventID", $(selectedEvent).data("eventid"));
        $("body").addClass("ui-loading");
        eventQuery.find({
            success: function(foundEvent) {
                foundEvent[0].destroy({
                    success: function(deletedEvent) {
                        $("body").removeClass("ui-loading");
                        eventsMethods.fetchWeddingInfo();
                        cm.showAlert("Deleted event Successfully");
                    },
                    error: function(errorEvent) {
                        $("body").removeClass("ui-loading");
                        cm.showAlert("Sorry!Couldn't delete the event");
                    }
                });
            },
            error: function(eventError) {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't fetch Wedding details");
            }
        });
    },
    joinEvent: function(selectedEvent) {
        var eventGuestClass = Parse.Object.extend("EventGuest");
        var eventGuestObj = new eventGuestClass();
        var eventGuestQuery = new Parse.Query(eventGuestObj);
        eventGuestQuery.equalTo("eventID", $(selectedEvent).data("eventid"));
        eventGuestQuery.equalTo("guestID", localStorage.userId);
        eventGuestQuery.find({
            success: function(eventGuestResults) {
                if (eventGuestResults.length > 0) {
                    cm.showAlert('Already selected ' + result[0].get('status'));
                } else {
                    eventGuestQuery.set("eventID", $(selectedEvent).data("eventid"));
                    eventGuestQuery.set("guestID", localStorage.userId);
                    eventGuestQuery.set("status", $(selectedEvent).data("joinstatus"));
                    eventGuestQuery.set("addedBy", $(selectedEvent).data("addedby"));
                    eventGuestQuery.save(null, {
                        success: function(eventGuestSaveResults) {
                            cm.showAlert("Your choice for Event saved Successfully ");
                        },
                        error: function(eventGuestSaveError) {
                            cm.showAlert("Sorry!Couldn't save your Event Choice");
                        }
                    });

                }
            },
            error: function(eventGuestErrors) {
                cm.showAlert("Sorry!Couldn't save your Event Choice");
            }
        });
    },
    toggleEventAdd: function() {
        // Method to show/hide add event block
        $(".addeventcls,#eventAdderBtn").toggle();
        if ($(".addeventcls").is(":visible"))
            $.mobile.silentScroll($('.addeventcls').offset().top);
        $('#addEventName').val('');
        $('#addEventDate').val(moment().format('YYYY-MM-DD')); // show current date
        $('#addEventTime').val(moment().format('hh:mm')); // show current time
        //$('#addEventVenu').val('');
        //$('#addEventMenu').val('');
        $('#addEventDes').val('');
        $("#eventImg,#eventImg_edit").prop("src", "");
        $("#eventPic,#eventPic_edit").hide();
        $("#eventPicTemplate").show();
    },
    showEventLoc: function(selectedEvent) {
        // To mark the location of the event on the map
        localStorage.userLatLng = $(selectedEvent).data("elat") + "," + $(selectedEvent).data("elong");
        localStorage.userLat = $(selectedEvent).data("elat");
        localStorage.userLng = $(selectedEvent).data("elong");
        eventsMethods.configureMap(); // Configure map to plot the location
    },
    configureMap: function() {
        // Method to configure map
        if (localStorage.eventAction != "edit")
            eventsMethods.getUserLocation();
        var map;
        var userLocation = new plugin.google.maps.LatLng(Number(localStorage.userLat), Number(localStorage.userLng));
        var div = $("#map_canvas");
        var mapOptions = {
            'backgroundColor': 'white',
            'mapType': plugin.google.maps.MapTypeId.HYBRID,
            'controls': {
                'compass': true,
                'myLocationButton': true,
                'indoorPicker': true,
                'zoom': true
            },
            'gestures': {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true
            },
            'camera': {
                'latLng': userLocation,
                'tilt': 30,
                'zoom': 15,
                'bearing': 50
            }
        };
        map = plugin.google.maps.Map.getMap(mapOptions);
        map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
        map.addEventListener(plugin.google.maps.event.MAP_CLICK, function(latLng){
            localStorage.userLat=latLng.lat;
            localStorage.userLng=latLng.lng;
            localStorage.userLatLng=latLng;
            onMapReady();
        });

        function onMapReady() {

            //map.setCenter(userLocation);
            var userLocation = new plugin.google.maps.LatLng(Number(localStorage.userLat), Number(localStorage.userLng));
            console.warn(userLocation);

            map.clear(); // clear the old markers
            map.addMarker({
                'position': userLocation,
                'draggable': true
            }, function(marker) {

                marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
                    marker.getPosition(function(latLng) {
                        var request = {
                            position: latLng
                        };
                        plugin.google.maps.Geocoder.geocode(request, function(results) {

                            if (results.length) {
                                var result = results[0];
                                var position = result.position;
                                var address = [
                                    // result.subThoroughfare || "",
                                    // result.thoroughfare || "",
                                    result.locality || "",
                                    result.adminArea || "",
                                    result.postalCode || "",
                                    result.country || ""
                                ].join(", ");
                                localStorage.venueName = address; // save the reverse geocoded name
                                localStorage.venueLat = latLng.lat; // save  the latitude of venue
                                localStorage.venueLon = latLng.lng; // save  the longitude of venue
                                marker.setTitle(address);
                                marker.showInfoWindow();
                                setTimeout(function() {
                                    map.closeDialog(); // close the map
                                    cm.showToast("Choosed your event location");
                                }, 2000);

                            } else {
                                cm.showAlert("Sorry!Location Not found");
                            }
                        });
                    });
                });
            });
            map.showDialog(); // show  map
        }
    },
    getUserLocation: function() {
        // Method to get the user location
        var geoLocOptions = {
            maximumAge: 30000,
            timeout: 15000,
            enableHighAccuracy: true
        };
        navigator.geolocation.getCurrentPosition(function(geoLocSuccess) {
                localStorage.userLat = geoLocSuccess.coords.latitude;
                localStorage.userLng = geoLocSuccess.coords.longitude;
                localStorage.userLatLng = geoLocSuccess.coords.latitude + "," + geoLocSuccess.coords.longitude;
            },
            function(geoLocError) {
                if (geoLocError.code == 3) {
                    //cm.showAlert("Sorry!Please turn on Location");
                    localStorage.userLat = "21.0000";
                    localStorage.userLng = "78.0000"
                    localStorage.userLatLng = "21.0000,78.0000";
                }
            }, geoLocOptions);
    },
    printContacts: function(htmlToPrint, elementId) {
        // To print contacts in the given list id
        $("#" + elementId).html(htmlToPrint).listview().listview("refresh").trigger("create");
    },
    fetchGroomGuests: function() {
        // To list the Groom side contacts for selecting to invite
        var guestClass = Parse.Object.extend("Guest");
        var guestObj = new guestClass();
        var queryGuest = new Parse.Query(guestObj);
        queryGuest.equalTo("weddingID", localStorage.joinedWedding);
        queryGuest.equalTo("brideOrGroomSide", "Groom");
        queryGuest.ascending("guestName");
        $("body").addClass("ui-loading");
        queryGuest.find({
            success: function(foundGroomGuests) {
                var groomHtml = '<li data-role="list-divider">Groom Side</li>';
                for (var i = 0; i < foundGroomGuests.length; i++) {
                    var rowObject = foundGroomGuests[i];
                    var guestName = rowObject.get('guestName');
                    groomHtml += '<li class="contactli" data-guestname="' + guestName + '" data-guestid="' + rowObject.get("guestID") + '" data-guestorhost="guest" data-mobilenumber="' + rowObject.get("mobileNo") + '" data-emailid="' + rowObject.get("Email") + '">'; // Contact Start
                    groomHtml += '<a href="#"> <img src="img/no-pic.png">'; // Contact picture
                    groomHtml += '<h2>' + guestName + '</h2>'; // Contact name start and end
                    // groomHtml += '<p class="' + contactsMethods.statusClassGenerator(rowObject.get('status')) + '">' + contactsMethods.statusChecker(rowObject.get('status')) + '</p></a>'; // Contact status
                    groomHtml += '</li>'; // Contact end
                }
                eventsMethods.fetchBrideGuests(groomHtml); // call to print the list of contacts
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Unable to fetch contacts");
                $("body").removeClass("ui-loading");
            }
        });
    },
    fetchBrideGuests: function(groomHtml) {
        // To list the Bride side contacts for selecting to invite
        var guestClass = Parse.Object.extend("Guest");
        var guestObj = new guestClass();
        var queryGuest = new Parse.Query(guestObj);
        queryGuest.equalTo("weddingID", localStorage.joinedWedding);
        queryGuest.equalTo("brideOrGroomSide", "Bride");
        queryGuest.ascending("guestName");
        $("body").addClass("ui-loading");
        queryGuest.find({
            success: function(foundGroomGuests) {
                var brideHtml = groomHtml + '<li data-role="list-divider">Bride Side</li>';
                for (var i = 0; i < foundGroomGuests.length; i++) {
                    var rowObject = foundGroomGuests[i];
                    var guestName = rowObject.get('guestName');
                    brideHtml += '<li class="contactli" data-guestname="' + guestName + '" data-guestid="' + rowObject.get("guestID") + '" data-guestorhost="guest" data-mobilenumber="' + rowObject.get("mobileNo") + '" data-emailid="' + rowObject.get("Email") + '">'; // Contact Start
                    brideHtml += '<a href="#"> <img src="img/no-pic.png">'; // Contact picture
                    brideHtml += '<h2>' + guestName + '</h2>'; // Contact name start and end
                    // groomHtml += '<p class="' + contactsMethods.statusClassGenerator(rowObject.get('status')) + '">' + contactsMethods.statusChecker(rowObject.get('status')) + '</p></a>'; // Contact status
                    brideHtml += '</li>'; // Contact end
                }
                eventsMethods.printContacts(brideHtml, "eventGuestList"); // call to print the list of contacts
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Unable to fetch contacts");
                $("body").removeClass("ui-loading");
            }
        });
    },
    selectedGuests: function() {
        // After selecting the contacts to invite for event
        //To Save the contacts in Local Array
        var selectedContacts = $("#eventGuestList li");
        eventsMethods.eventGuestsArray.length = 0;
        selectedContacts.each(function(index, item) {
            if ($(item).hasClass("selectedContact")) {
                var contactObject = {};
                contactObject.guestid = $(item).data("guestid");
                contactObject.guestname = $(item).data("guestname");
                contactObject.guestphone = $(item).data("mobilenumber");
                contactObject.duplicate = false;
                if (eventsMethods.createdGuestContactId.length > 0) {
                    for (var i = 0; i < eventsMethods.createdGuestContactId.length; i++) {
                        console.log("contactObject.guestid:" + contactObject.guestid);
                        if (contactObject.guestid == eventsMethods.createdGuestContactId[i])
                            console.log("Sorry!This is an duplicate entry");
                        else
                            eventsMethods.eventGuestsArray.push(contactObject);
                    }
                    /*contactsMethods.createdPhoneContactId.each(function(value) {
                        if (contactObject.guestid == value) console.log("Sorry!This is an duplicate entry");
                        else contactsMethods.contactsArray.push(contactObject);
                    });*/
                } else
                    eventsMethods.eventGuestsArray.push(contactObject);

            }
        });
        eventsMethods.checkForExistance();
    },
    checkForExistance: function() {
        //To check the existance of the contacts in parse db    :ToDo:Check for the existance in Parse DB    
        for (i = 0; i < eventsMethods.eventGuestsArray.length; i++) {
            // var tempContact = contactsMethods.contactsArray[i];
            var eventGuestClass = Parse.Object.extend("EventGuest");
            var eventGuestObj = new eventGuestClass();
            var queryEventGuest = new Parse.Query(eventGuestObj);
            var queryEventId = queryEventGuest.equalTo("eventID", localStorage.inviterEventID);
            var queryEventGuestPhone = queryEventGuest.equalTo("mobileNo", eventsMethods.eventGuestsArray[i].guestphone);
            var compoundGuestQuery = Parse.Query.or(queryEventId, queryEventGuestPhone);
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
                        console.log("contactsArray inside else: " + JSON.stringify(eventsMethods.eventGuestsArray[i]));
                    }
                },
                error: function(error) {
                    cm.showAlert("Sorry!Couldn't add Guest");
                }
            });
            // cm.sleep(3000);
        }
        eventsMethods.saveSelectedContacts();
    },
    saveSelectedContacts: function() {
        //To Save the selected Contacts in Parse DB
        console.log("Involked saveSelectedContacts");
        for (var i = 0; i < eventsMethods.eventGuestsArray.length; i++) {
            if (eventsMethods.eventGuestsArray[i].duplicate == false) {
                var eventGuestClass = Parse.Object.extend("EventGuest");
                var eventGuestObj = new eventGuestClass();
                eventsMethods.createdGuestContactId.push(eventsMethods.eventGuestsArray[i].guestid);
                eventGuestObj.set("eventID", localStorage.inviterEventID);
                eventGuestObj.set("guestName", eventsMethods.eventGuestsArray[i].guestname);
                eventGuestObj.set("guestPhone", (eventsMethods.eventGuestsArray[i].guestphone).toString());
                eventGuestObj.set("addedBy", localStorage.userId);
                eventGuestObj.set("guestID", eventsMethods.eventGuestsArray[i].guestid);
                eventGuestObj.set("status", "Invited");
                eventGuestObj.save(null, {
                    success: function(addedGuest) {
                        console.log("Added Guest Id: " + addedGuest.id);

                        eventGuestObj.save();
                        // console.log("tempContact after adding: " + JSON.stringify(tempContact));
                    },
                    error: function() {
                        cm.showAlert("Sorry!Couldn't add Guest");
                    }
                });
            }
        }
        localStorage.editableEventId = localStorage.inviterEventID;
        localStorage.inviterEventID = ""; // clear the cached event id
        eventsMethods.inviteGuests("custom");

    }
};
$("#eventGuestList").on("click", "li.contactli", function() {
    // Highlight the selected contact
    $(this).toggleClass("selectedContact");
});
