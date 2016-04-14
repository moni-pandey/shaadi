var osGuestHtml = ""; // html string holder
var outstationMethods = {
    osgArray: [], // array to hold osg details
    counter: 0, // counter to iterate over array
    showAddGuestPage: function() {
        localStorage.fromOSGPage = true;
        $(":mobile-pagecontainer").pagecontainer("change", "new_guest.html", {
            showLoadMsg: false
        });
    },
    fetchOutstationGuestList: function() {
        // To List the Outstation guests of the selected Wedding
        var guestClass = Parse.Object.extend("Guest");
        var guestObj = new guestClass();
        var queryGuest = new Parse.Query(guestObj);
        $("body").addClass("ui-loading");
        queryGuest.equalTo("weddingID", localStorage.joinedWedding);
        queryGuest.equalTo("outStation", "true");
        queryGuest.find({
            success: function(foundOSGuest) {
                for (var i = 0; i < foundOSGuest.length; i++) {
                    var rowObject = foundOSGuest[i];
                    var osgObj = {};
                    osgObj.osArrivalDate = moment(rowObject.get("guestArrivalTime")).format("Do MMMM YYYY");
                    osgObj.osDepartureDate = moment(rowObject.get("guestDepartureTime")).format("Do MMMM YYYY");
                    osgObj.guestArrivalTime = rowObject.get("guestArrivalTime");
                    osgObj.guestDepartureTime = rowObject.get("guestDepartureTime");
                    osgObj.guestName = rowObject.get("guestName");
                    osgObj.guestID = rowObject.get("guestID");
                    osgObj.accId = rowObject.get("accomOffered") == "true" && rowObject.get("accomOffered") != "" ? rowObject.get("accomodationID") : "false";
                    osgObj.cabId = rowObject.get("transportOffered") == "true" && rowObject.get("transportOffered") != "" ? rowObject.get("transportID") : "false";
                    osgObj.cabNeededOrNot = rowObject.get("pickupNeeded") == "true" || rowObject.get("pickupNeeded") == "true" ? "" : "ui-disabled"; // If pickup or drop needed enable 
                    if (osgObj.accId != "false")
                        osgObj.accHtml = outstationMethods.getAllotedAccommodation(osgObj.accId);
                    if (osgObj.cabId != "false")
                        osgObj.cabHtml = outstationMethods.getAllotedCab(osgObj.cabId);
                    outstationMethods.osgArray.push(osgObj);
                }
                if (outstationMethods.osgArray.length > 0)
                    outstationMethods.makeOSGLHtml();
                /*var osGuestHtml = "";
                for (var i = 0; i < foundOSGuest.length; i++) {
                    var rowObject = foundOSGuest[i];
                    var cabNeededOrNot = rowObject.get("pickupNeeded") == "true" || rowObject.get("pickupNeeded") == "true" ? "" : "ui-disabled"; // If pickup or drop needed enable 
                    var osArrivalDate = moment(rowObject.get("guestArrivalTime")).format("Do MMMM YYYY");
                    var osDepartureDate = moment(rowObject.get("guestDepartureTime")).format("Do MMMM YYYY");
                    osGuestHtml += '<div data-role="collapsibleset" data-theme="a" data-content-theme="a" class="single-list">'; // Collapsible set start
                    osGuestHtml += '<div class="guestlist">'; // Guest details container start
                    osGuestHtml += '<div class="guest-list-left checked-list">'; // Guest details subcontainer start
                    osGuestHtml += '<div class="social-profile-img"> <img src="img/no-pic.png"> </div>'; // Guest Picture start and end
                    osGuestHtml += '<div class="social-profile-details">'; // Profile holder start
                    osGuestHtml += '<div class="profile-name">' + rowObject.get("guestName") + '</div>'; // Profile name start & end
                    osGuestHtml += '<div class="social-subtitle">Arrival:' + osArrivalDate + '</div>'; // Guest Arrival date start & end
                    osGuestHtml += '<div class="profile-dateofbirth">Departure:' + osDepartureDate + '</div>'; // Guest Departure start & end
                    osGuestHtml += '</div>'; // Profile holder end
                    osGuestHtml += '</div>'; // Guest details subcontainer end
                    osGuestHtml += '</div>'; // Guest details container end
                    if (rowObject.get("accomOffered") != "true" && rowObject.get("accomOffered") == "false" || rowObject.get("accomOffered") == "") {
                        // Accommodation not offered
                        osGuestHtml += '<div data-role="collapsible">'; // Accommodation Collapsible start
                        osGuestHtml += '<h3 class="hotel-status createnew"></h3>'; // Not Alloted
                        osGuestHtml += '<div class="status-inner">'; // Status container start
                        osGuestHtml += '<p>Accommodation not alloted</p>'; // Status text start and end
                        osGuestHtml += '<div class="sendform" data-osguestid=' + rowObject.get("guestID") + ' data-checkin="' + osArrivalDate + '" data-checkout="' + osDepartureDate + '" data-ufcheckin="' + rowObject.get("guestArrivalTime") + '" data-ufcheckout="' + rowObject.get("guestDepartureTime") + '" onclick="outstationMethods.changeAllocateAccPage(this)"> <a href="#">Allot Room</a> </div>'; // Allocate Button
                        osGuestHtml += '</div>'; // Status container end
                        osGuestHtml += '</div>'; // Accommodation Collapsible end
                    } else if (rowObject.get("accomOffered") == "true" && rowObject.get("accomOffered") != "false") {
                        // Accommodation offered

                        osGuestHtml += '<div data-role="collapsible">'; // Accommodation Collapsible start
                        osGuestHtml += '<h3 class="hotel-status booked"></h3>'; // Alloted
                        osGuestHtml += '<div class="status-inner">'; // Status container start
                        osGuestHtml += '<p>' + outstationMethods.getAllotedAccommodation(rowObject.get("accomodationID")) + '</p>'; // Status text start and end
                        osGuestHtml += '<div class="sendform" data-osguestid=' + rowObject.get("guestID") + ' data-checkin="' + osArrivalDate + '" data-checkout="' + osDepartureDate + '"> <a href="#">Send</a> </div>'; // Allocate Button
                        osGuestHtml += '</div>'; // Status container end
                        osGuestHtml += '</div>'; // Accommodation Collapsible end   
                    }
                    if (rowObject.get("transportOffered") != "true" && rowObject.get("transportOffered") == "false" || rowObject.get("transportOffered") == "") {
                        // Transport not offered
                        osGuestHtml += '<div data-role="collapsible">'; // Transport Collapsible start
                        osGuestHtml += '<h3 class="cab-status createnew"></h3>'; // Not Alloted
                        osGuestHtml += '<div class="status-inner">'; // Status container start
                        osGuestHtml += '<p>Transport not alloted</p>'; // Status text start and end
                        osGuestHtml += '<div class="sendform" data-osguestid=' + rowObject.get("guestID") + ' data-arrival="' + osArrivalDate + '" data-departure="' + osDepartureDate + '" data-ufarrival="' + rowObject.get("guestArrivalTime") + '" data-ufdeparture="' + rowObject.get("guestDepartureTime") + '" onclick="outstationMethods.changeAllocateCabPage(this)"> <a href="#">Book Cab</a> </div>'
                        osGuestHtml += '</div>'; // Status container end
                        osGuestHtml += '</div>'; // Transport Collapsible end
                    } else if (rowObject.get("transportOffered") == "true" && rowObject.get("transportOffered") != "false") {
                        // Transport offered
                        osGuestHtml += '<div data-role="collapsible" class=' + cabNeededOrNot + '>'; // Accommodation Collapsible start
                        osGuestHtml += '<h3 class="cab-status booked"></h3>'; // Alloted
                        osGuestHtml += '<div class="status-inner">'; // Status container start
                        osGuestHtml += '<p>' + outstationMethods.getAllotedCab(rowObject.get("transportID")) + '</p>'; // Status text start and end
                        osGuestHtml += '<div class="sendform" data-osguestid=' + rowObject.get("guestID") + ' data-arrival="' + osArrivalDate + '" data-departure="' + osDepartureDate + '"> <a href="#">Send</a> </div>'; // Allocate Button
                        osGuestHtml += '</div>'; // Status container end
                        osGuestHtml += '</div>'; // Accommodation Collapsible end 
                    }
                    osGuestHtml += '</div>'; // Collapsible set end
                }
                $("#outstationGuestList").html(osGuestHtml).trigger("create");*/
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Couldn't get outstation guests list");
                $("body").removeClass("ui-loading");
            }
        })
    },
    makeOSGLHtml: function() {
        // To build the html text for showing the list of outstation guests
        var rowObject = outstationMethods.osgArray[outstationMethods.counter];
        osGuestHtml += '<div data-role="collapsibleset" data-theme="a" data-content-theme="a" class="single-list">'; // Collapsible set start
        osGuestHtml += '<div class="guestlist">'; // Guest details container start
        osGuestHtml += '<div class="guest-list-left checked-list">'; // Guest details subcontainer start
        osGuestHtml += '<div class="social-profile-img"> <img src="img/no-pic.png"> </div>'; // Guest Picture start and end
        osGuestHtml += '<div class="social-profile-details">'; // Profile holder start
        osGuestHtml += '<div class="profile-name">' + rowObject.guestName + '</div>'; // Profile name start & end
        osGuestHtml += '<div class="social-subtitle">Arrival:' + rowObject.osArrivalDate + '</div>'; // Guest Arrival date start & end
        osGuestHtml += '<div class="profile-dateofbirth">Departure:' + rowObject.osDepartureDate + '</div>'; // Guest Departure start & end
        osGuestHtml += '</div>'; // Profile holder end
        osGuestHtml += '</div>'; // Guest details subcontainer end
        osGuestHtml += '</div>'; // Guest details container end
        if (rowObject.accId == "false" || rowObject.accId == "") {
            // Accommodation not offered
            osGuestHtml += '<div data-role="collapsible">'; // Accommodation Collapsible start
            osGuestHtml += '<h3 class="hotel-status createnew"></h3>'; // Not Alloted
            osGuestHtml += '<div class="status-inner">'; // Status container start
            osGuestHtml += '<p>Accommodation not alloted</p>'; // Status text start and end
            osGuestHtml += '<div class="sendform" data-osguestid=' + rowObject.guestID + ' data-checkin="' + rowObject.osArrivalDate + '" data-checkout="' + rowObject.osDepartureDate + '" data-ufcheckin="' + rowObject.guestArrivalTime + '" data-ufcheckout="' + rowObject.guestDepartureTime + '" onclick="outstationMethods.changeAllocateAccPage(this)"> <a href="#">Allot Room</a> </div>'; // Allocate Button
            osGuestHtml += '</div>'; // Status container end
            osGuestHtml += '</div>'; // Accommodation Collapsible end
        } else { // if (rowObject.get("accomOffered") == "true" && rowObject.get("accomOffered") != "false") {
            // Accommodation offered

            osGuestHtml += '<div data-role="collapsible">'; // Accommodation Collapsible start
            osGuestHtml += '<h3 class="hotel-status booked"></h3>'; // Alloted
            osGuestHtml += '<div class="status-inner">'; // Status container start
            osGuestHtml += '<p>' + rowObject.accHtml + '</p>'; // Status text start and end
            osGuestHtml += '<div class="sendform" data-osguestid=' + rowObject.guestID + ' data-checkin="' + rowObject.osArrivalDate + '" data-checkout="' + rowObject.osDepartureDate + '"> <a href="#">Send</a> </div>'; // Allocate Button
            osGuestHtml += '</div>'; // Status container end
            osGuestHtml += '</div>'; // Accommodation Collapsible end   
        }
        if (rowObject.cabId == "false" || rowObject.cabId == "") {
            // Transport not offered
            osGuestHtml += '<div data-role="collapsible">'; // Transport Collapsible start
            osGuestHtml += '<h3 class="cab-status createnew"></h3>'; // Not Alloted
            osGuestHtml += '<div class="status-inner">'; // Status container start
            osGuestHtml += '<p>Transport not alloted</p>'; // Status text start and end
            osGuestHtml += '<div class="sendform" data-osguestid=' + rowObject.guestID + ' data-arrival="' + rowObject.osArrivalDate + '" data-departure="' + rowObject.osDepartureDate + '" data-ufarrival="' + rowObject.guestArrivalTime + '" data-ufdeparture="' + rowObject.guestDepartureTime + '" onclick="outstationMethods.changeAllocateCabPage(this)"> <a href="#">Book Cab</a> </div>'
            osGuestHtml += '</div>'; // Status container end
            osGuestHtml += '</div>'; // Transport Collapsible end
        } else { //if (rowObject.get("transportOffered") == "true" && rowObject.get("transportOffered") != "false") {
            // Transport offered
            osGuestHtml += '<div data-role="collapsible" class=' + rowObject.cabNeededOrNot + '>'; // Accommodation Collapsible start
            osGuestHtml += '<h3 class="cab-status booked"></h3>'; // Alloted
            osGuestHtml += '<div class="status-inner">'; // Status container start
            osGuestHtml += '<p>' + rowObject.cabHtml + '</p>'; // Status text start and end
            osGuestHtml += '<div class="sendform" data-osguestid=' + rowObject.guestID + ' data-arrival="' + rowObject.osArrivalDate + '" data-departure="' + rowObject.osDepartureDate + '"> <a href="#">Send</a> </div>'; // Allocate Button
            osGuestHtml += '</div>'; // Status container end
            osGuestHtml += '</div>'; // Accommodation Collapsible end 
        }
        osGuestHtml += '</div>'; // Collapsible set end
        outstationMethods.counter++;
        if (outstationMethods.counter < outstationMethods.osgArray.length)
            outstationMethods.makeOSGLHtml();
        else
            $("#outstationGuestList").html(osGuestHtml).trigger("create");
    },
    getAllotedAccommodation: function(allocatedAccID) {
        // To get the Allocated Accommodation details
        var formattedAccommodation = "";
        var accomodationInventoryClass = Parse.Object.extend("AccomodationInventory");
        var accQuery = new Parse.Query(accomodationInventoryClass);
        accQuery.equalTo("accomInventoryID", allocatedAccID);
        accQuery.find({
            success: function(foundAccommodation) {
                var allocatedAccommodation = foundAccommodation[0];
                formattedAccommodation += "Hotel Name: " + allocatedAccommodation.get("hotelName");
                formattedAccommodation += "<br/>No.Of Rooms:" + allocatedAccommodation.get("noOfRooms");
                formattedAccommodation += "<br/>Occupancy:4"; //ToDo:Include Occupancy field
                console.warn("formattedAccommodation:"+formattedAccommodation);
                return formattedAccommodation;

            },
            error: function() {
                cm.showAlert("Sorry!Couldn't fetch Allocated Accommodation");
            }
        });

    },
    getAllotedCab: function(allocatedCabID) {
        // To get the Allocated Cab details
        var formattedCab = "";
        var transportClass = Parse.Object.extend("Transport");
        var transportQuery = new Parse.Query(transportClass);
        transportQuery.equalTo("transportID", allocatedCabID);
        transportQuery.find({
            success: function(foundTransport) {
                var allocatedCab = foundTransport[0];
                formattedCab += "Driver Name: " + allocatedCab.get("driverName");
                formattedCab += "<br/>Driver No: " + allocatedCab.get("driverContactNo");
                formattedCab += "<br/>Car No: " + allocatedCab.get("vehicleNumber");
                console.warn("formattedCab:"+formattedCab);
                return formattedCab;
            },
            error: function() {
                cm.showAlert("Sorry!Couldn't fetch Allocated Cab");
            }
        });
    },
    getCabColor: function(colorName) {
        // To get the cab color code to show in the list
        var colorCode = "";
        switch (colorName) {
            case "Red":
                colorCode = "#ff0000";
                break;
            case "White":
                colorCode = "#ffffff";
                break;
            case "Black":
                colorCode = "#000000";
                break;
            case "Yellow":
                colorCode = "#ffff00";
                break;
            case "Blue":
                colorCode = "#0000ff";
                break;
            case "Green":
                colorCode = "#008000";
                break;
            case "Silver":
                colorCode = "#c0c0c0";
                break;
            case "Grey":
                colorCode = "#808080";
                break;
        }
        return colorCode;

    },
    changeAllocateAccPage: function(selectedOSGuest) {
        // To change to Allocate Accommodation Page
        $(":mobile-pagecontainer").pagecontainer("change", "allot-accommodation.html", {
            showLoadMsg: false
        });

        localStorage.allotOSGCheckIn = $(selectedOSGuest).data("checkin");
        localStorage.allotOSGUfCheckIn = $(selectedOSGuest).data("ufcheckin");
        localStorage.allotOSGCheckOut = $(selectedOSGuest).data("checkout");
        localStorage.allotOSGUfCheckOut = $(selectedOSGuest).data("ufcheckout");
        localStorage.allotOSGuestID = $(selectedOSGuest).data("osguestid");
        var accomodationInventoryClass = Parse.Object.extend("AccomodationInventory");
        var accommodationInventoryQuery = new Parse.Query(accomodationInventoryClass);
        accommodationInventoryQuery.equalTo("weddingID", localStorage.joinedWedding);
        accommodationInventoryQuery.equalTo("allocated", "false");
        $("body").addClass("ui-loading");
        accommodationInventoryQuery.find({
            success: function(foundAccommodation) {
                var accHtml = "";
                for (var i = 0; i < foundAccommodation.length; i++) {
                    var rowObject = foundAccommodation[i];
                    accHtml += '<div class="acco-list">'; // Accommodation entry start
                    accHtml += '<div class="ahotalname">' + rowObject.get("hotelName"); // Hotel name start
                    accHtml += '</div>'; // Hotel name end
                    accHtml += '<div class="aroomsavaiable">Rooms Avaiable:' + rowObject.get("noOfRooms"); // Rooms available start
                    accHtml += '</div>'; // Rooms available end
                    accHtml += '<div class="acheckintime">Check In Time:' + rowObject.get("checkInTime"); // Checkin start
                    accHtml += '</div>'; // Checkin end
                    accHtml += '<div class="acheckintime">Check Out Time:' + rowObject.get("checkOutTime"); // Checkout start
                    accHtml += '</div>'; // Checkout end
                    /*accHtml+='<div class="aplace">'; // Hotel location start
                    accHtml+='</div>'; // Hotel location end*/
                    accHtml += '<div class="abooknow"><a href="#" data-accomid="' + rowObject.get("accomInventoryID") + '" onclick="outstationMethods.allotRoom(this)">Book Now</a></div>'; // Book now button start & end
                    accHtml += '</div>'; // Accommodation entry end
                }
                $("#availableAccList").html(accHtml).trigger("create");
                $("#osgCheckinDate").text(localStorage.allotOSGCheckIn);
                $("#osgCheckoutDate").text(localStorage.allotOSGCheckOut);
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry! Couldn't get the Accommodation list");
                $("body").removeClass("ui-loading");
            }
        });

    },
    allotRoom: function(selectedAccommodation) {
        // To Allot the Accommodation to the guest
        var accomodationClass = Parse.Object.extend("Accomodation");
        var accomodationObj = new accomodationClass();
        $("body").addClass('ui-loading');
        accomodationObj.set("accomInventoryID", $(selectedAccommodation).data("accomid"));
        accomodationObj.set("guestID", localStorage.allotOSGuestID);
        accomodationObj.set("reservationStartDate", new Date(localStorage.allotOSGUfCheckIn));
        accomodationObj.set("reservationEndDate", new Date(localStorage.allotOSGUfCheckOut));
        accomodationObj.save(null, {
            success: function(accomodationSuccess) {
                var accomodationInventoryClass = Parse.Object.extend("AccomodationInventory");
                var accomodationInventoryObj = new accomodationInventoryClass();
                accomodationInventoryObj.id = $(selectedAccommodation).data("accomid");
                accomodationInventoryObj.set("allocated", "true");
                accomodationInventoryObj.save();
                var guestClass = Parse.Object.extend("Guest");
                var guestObj = new guestClass();
                guestObj.id = localStorage.allotOSGuestID;
                guestObj.set("accomOffered", "true");
                guestObj.set("accomodationID", $(selectedAccommodation).data("accomid"));
                guestObj.save();
                $("body").removeClass("ui-loading");
                cm.showToast("Alloted Room successfully");
                // outstationMethods.changeAllocateAccPage();
                $(":mobile-pagecontainer").pagecontainer("change", "outstationguest.html", {
                    showLoadMsg: false
                });
            },
            error: function(error) {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Unable to save Cab detail");
            }
        });
    },
    changeAllocateCabPage: function(selectedOSGuest) {
        // To change to Allocate Accommodation Page
        $(":mobile-pagecontainer").pagecontainer("change", "allot-cab.html", {
            showLoadMsg: false
        });

        localStorage.allotOSGCheckIn = $(selectedOSGuest).data("arrival");
        localStorage.allotOSGUfCheckIn = $(selectedOSGuest).data("ufarrival");
        localStorage.allotOSGCheckOut = $(selectedOSGuest).data("departure");
        localStorage.allotOSGUfCheckOut = $(selectedOSGuest).data("ufdeparture");
        localStorage.allotOSGuestID = $(selectedOSGuest).data("osguestid");
        var transportClass = Parse.Object.extend("Transport");
        var transportQuery = new Parse.Query(transportClass);
        transportQuery.equalTo("weddingID", localStorage.joinedWedding);
        transportQuery.equalTo("allocated", "false");
        $("body").addClass("ui-loading");
        transportQuery.find({
            success: function(foundCab) {
                var cabHtml = "";
                for (var i = 0; i < foundCab.length; i++) {
                    var rowObject = foundCab[i];
                    cabHtml += '<div class="acco-list">'; // Cab entry start
                    cabHtml += '<div class="acolortype"><div class="cabcolor" style="background:' + outstationMethods.getCabColor(rowObject.get("carColor")) + ';"></div>'; // Cab color & name  start
                    cabHtml += rowObject.get("carModel") + '</div>'; // Cab color & name  end
                    cabHtml += '<div class="acabnumber">' + rowObject.get("vehicleNumber") + '</div>'; // Cab number start and end
                    cabHtml += '<div class="adrivernumber">Driver No. : ' + rowObject.get("driverContactNo") + '</div>'; // Driver number start and end
                    /*cabHtml+='<div class="aplace">'; // Hotel location start
                    cabHtml+='</div>'; // Hotel location end*/
                    cabHtml += '<div class="abooknow"><a href="#" data-cabid="' + rowObject.get("transportID") + '" onclick="outstationMethods.allotCab(this)">Book Now</a></div>'; // Book now button start & end
                    cabHtml += '</div>'; // Cab entry end
                }
                $("#availableCabList").html(cabHtml).trigger("create");
                $("#osgCheckinDate").text(localStorage.allotOSGCheckIn);
                $("#osgCheckoutDate").text(localStorage.allotOSGCheckOut);
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry! Couldn't get the Accommodation list");
                $("body").removeClass("ui-loading");
            }
        });

    },
    allotCab: function(selectedCab) {
        // To Allot the Accommodation to the guest
        var transportClass = Parse.Object.extend("Transport");
        var transportObj = new transportClass();
        $("body").addClass('ui-loading');
        transportObj.id = $(selectedCab).data("cabid");
        transportObj.set("guestID", localStorage.allotOSGuestID);
        transportObj.set("reservationStartDate", new Date(localStorage.allotOSGUfCheckIn));
        transportObj.set("reservationEndDate", new Date(localStorage.allotOSGUfCheckOut));
        transportObj.set("allocated", "true");
        transportObj.save(null, {
            success: function(transportSuccess) {
                var guestClass = Parse.Object.extend("Guest");
                var guestObj = new guestClass();
                guestObj.id = localStorage.allotOSGuestID;
                guestObj.set("transportOffered", "true");
                guestObj.set("transportID", $(selectedCab).data("cabid"));
                guestObj.save();
                $("body").removeClass("ui-loading");
                cm.showToast("Alloted Cab successfully");
                // outstationMethods.changeAllocateCabPage();
                $(":mobile-pagecontainer").pagecontainer("change", "outstationguest.html", {
                    showLoadMsg: false
                });
            },
            error: function(error) {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Unable to save Cab detail");
            }
        });
    },
    pickupNeededOrNot: function(ev, pickupNeededOrNot) {
        // $('.square-radio1').css("background-color", '#a1a1a1');

        // Save the Side of Guest(Groom or Bride)
        localStorage.osgPickupNeededOrNot = pickupNeededOrNot;
        if (pickupNeededOrNot == "true")
            $("#osgPickNo").css("background-color", '#a1a1a1');
        else if (pickupNeededOrNot == "false")
            $("#osgPickYes").css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
    },
    dropNeededOrNot: function(ev, dropNeededOrNot) {
        /*$('.square-radio1').css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');*/
        // Save the Side of Guest(Groom or Bride)
        localStorage.osgDropNeededOrNot = dropNeededOrNot;
        if (dropNeededOrNot == "true")
            $("#osgDropNo").css("background-color", '#a1a1a1');
        else if (dropNeededOrNot == "false")
            $("#osgDropYes").css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');

    },
    accommodationOfferedOrNot: function(ev, accommodationOfferedOrNot) {
        // Save the Accommodation Offered or Not
        localStorage.osgAccommodationOfferedOrNot = accommodationOfferedOrNot;
        if (accommodationOfferedOrNot == "true")
            $("#osgAccommodationNo").css("background-color", '#a1a1a1');
        else if (accommodationOfferedOrNot == "false")
            $("#osgAccommodationYes").css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
    },
    travelOfferedOrNot: function(ev, travelOfferedOrNot) {
        // Save the Accommodation Offered or Not
        localStorage.osgTravelOfferedOrNot = travelOfferedOrNot;
        if (travelOfferedOrNot == "true")
            $("#osgTravelNo").css("background-color", '#a1a1a1');
        else if (travelOfferedOrNot == "false")
            $("#osgTravelYes").css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
    },
    validateOSGRequestForm: function() {
        // To Validate the Guest form before submitting
        if ($("#osgArrivalDate").val() == "")
            cm.showAlert("Please choose your Arrival Date");
        else if (cm.isAccStartDateValidate($("#osgArrivalDate").val()))
            cm.showAlert("Please choose the your Arrival Date between today and wedding date");
        else if ($("#osgArrivalTime").val() == "")
            cm.showAlert("Please choose your Arrival Time");
        else if ($("#osgArrivingBy").val() == "moderesetter")
            cm.showAlert("Please choose your Mode of Arrival");
        else if (localStorage.osgPickupNeededOrNot == null || localStorage.osgPickupNeededOrNot == "")
            cm.showAlert("Please choose whether you need Pickup");
        else if ($("#osgLocation").val() == "")
            cm.showAlert("Please choose your Arrival Location");
        else if ($("#osgDepartureDate").val() == "")
            cm.showAlert("Please choose your Departure Date");
        else if (cm.isAccEndDateValidate($("#osgDepartureDate").val()))
            cm.showAlert("Please choose your Departure Date after wedding date");
        else if ($("#osgDepartureTime").val() == "")
            cm.showAlert("Please choose your Departure Time");
        else if ($("#osgDepartingBy").val() == "moderesetter")
            cm.showAlert("Please choose your Mode of Departure");
        else if (localStorage.osgDropNeededOrNot == null || localStorage.osgDropNeededOrNot == "")
            cm.showAlert("Please choose whether you need to be Dropped");
        else if (localStorage.osgAccommodationOfferedOrNot == null || localStorage.osgAccommodationOfferedOrNot == "")
            cm.showAlert("Please choose whether Accommodation alloted or not");
        else if (localStorage.osgTravelOfferedOrNot == null || localStorage.osgTravelOfferedOrNot == "")
            cm.showAlert("Please choose whether Transport alloted or not");
        else outstationMethods.submitOSGTARequest();
    },
    submitOSGTARequest: function() {
        // To Submit the Outstation Guest Accommodation request
        var guestClass = Parse.Object.extend("Guest");
        var guestObj = new guestClass();
        guestObj.set("outStation", "true");
        guestObj.set("headCount", $("#osgHeadCount :selected").text());
        guestObj.set("guestArrivalTime", new Date($("#osgArrivalDate").val()));
        guestObj.set("guestArrivalBy", $("#osgArrivingBy :selected").text());
        guestObj.set("guestArrivalLocation", $("#osgLocation").val());
        guestObj.set("pickupNeeded", localStorage.osgPickupNeededOrNot);
        guestObj.set("guestDepartureTime", new Date($("#osgDepartureDate").val()));
        guestObj.set("guestDepartureBy", $("#osgDepartingBy :selected").text());
        guestObj.set("dropNeeded", localStorage.osgDropNeededOrNot);
        guestObj.set("accomOffered", localStorage.osgAccommodationOfferedOrNot);
        guestObj.set("transportOffered", localStorage.osgTravelOfferedOrNot);
        $("body").addClass("ui-loading");
        guestObj.save({
            success: function(outStationSuccess) {
                cm.showToast("Successfully Submitted your request");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Couldn't save your request");
            }
        })
    },
    fetchAvailableGuestInfo: function() {
        // List the info available in the Guest class :ToDo:Need to include this 
        var guestClass = Parse.Object.extend("Guest");
        var guestObj = new guestClass();
        var queryGuest = new Parse.Query(guestObj);
        $("body").addClass("ui-loading");
        queryGuest.equalTo("weddingID", localStorage.joinedWedding);
        queryGuest.equalTo("guestID", localStorage.userId);
        queryGuest.find({
            success: function(foundGuest) {
                $("body").removeClass("ui-loading");
            },
            error: function() {
                $("body").removeClass("ui-loading");
            }
        });
    },
    validateOSGForm: function() {
        // To validate the request form of Accommodation/Cab
        if ($("#osgArrivalDate").val() == "")
            cm.showAlert("Please choose your Arrival Date");
        else if (cm.isAccStartDateValidate($("#osgArrivalDate").val()))
            cm.showAlert("Please choose your Arrival Date between today and wedding date");
        else if ($("#osgArrivalTime").val() == "")
            cm.showAlert("Please choose your Arrival Time");
        else if ($("#osgArrivingBy").val() == "moderesetter")
            cm.showAlert("Please choose your Mode of Arrival");
        else if (localStorage.pickupNeededOrNot == null || localStorage.pickupNeededOrNot == "")
            cm.showAlert("Please choose whether you need Pickup");
        else if ($("#osgLocation").val() == "")
            cm.showAlert("Please choose your Arrival Location");
        else if ($("#osgDepartureDate").val() == "")
            cm.showAlert("Please choose your Departure Date");
        else if (cm.isAccEndDateValidate($("#osgDepartureDate").val()))
            cm.showAlert("Please choose your Departure Date after wedding date");
        else if ($("#osgDepartureTime").val() == "")
            cm.showAlert("Please choose your Departure Time");
        else if ($("#osgDepartingBy").val() == "moderesetter")
            cm.showAlert("Please choose your Mode of Departure");
        else if (localStorage.dropNeededOrNot == null || localStorage.dropNeededOrNot == "")
            cm.showAlert("Please choose whether you need to be Dropped");
        else if (localStorage.accommodationOfferedOrNot == null || localStorage.accommodationOfferedOrNot == "")
            cm.showAlert("Please choose whether Accommodation alloted or not");
        else if (localStorage.travelOfferedOrNot == null || localStorage.travelOfferedOrNot == "")
            cm.showAlert("Please choose whether Transport alloted or not");
        else
            outstationMethods.sendRequest();
    },
    sendRequest: function() {
        // To send request for outstation guests
        var guestClass = Parse.Object.extend("Guest");
        var guestObj = new guestClass();
        guestObj.id = localStorage.userId;
        guestObj.set("outStation", "true");
        guestObj.set("headCount", $("#osgHeadCount :selected").text());
        guestObj.set("guestArrivalTime", new Date($("#osgArrivalDate").val()));
        guestObj.set("guestArrivalBy", $("#osgArrivingBy :selected").text());
        guestObj.set("guestArrivalLocation", $("#osgLocation").val());
        guestObj.set("pickupNeeded", localStorage.pickupNeededOrNot);
        guestObj.set("guestDepartureTime", new Date($("#osgDepartureDate").val()));
        guestObj.set("guestDepartureBy", $("#osgDepartingBy :selected").text());
        guestObj.set("dropNeeded", localStorage.dropNeededOrNot);
        guestObj.set("accomOffered", localStorage.accommodationOfferedOrNot);
        guestObj.set("transportOffered", localStorage.travelOfferedOrNot);
        ("body").addClass("ui-loading");
        guestObj.save(null, {
            success: function(requestSuccess) {
                cm.showToast("Your request submitted Successfully");
                ("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Couldn't send your request");
                $("body").removeClass("ui-loading");
            }
        });
    }

};

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
