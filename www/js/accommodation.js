var accommodationMethods = {
    showAddAccPopup: function() {
        //To Show Add Accommodation block
        $('#addAccomBlock').toggle(); //Show or hide add Accommodation popup based on its visibility
        $.mobile.silentScroll($('#addAccomBlock').offset().top); // Scroll to the add Accommodation block
    },
    hideAddAccPopup: function() {
        // To Hide Add Accommodation block
        // $('#addAccomBlock').popup("close");
        $('#addAccomBlock').hide();
        $("#accArrivalDate,#accDepartureDate,#checkInTime,#checkOutTime,#lodgemenu,#hotelPhoneno").val(""); //Clear Input fields
        $("#roomsCount").val("reseted").selectmenu("refresh");
    },
    validateAccommodation: function() {
        //To Validate an Accommodation     
        console.log($("#hotelPhoneno").intlTelInput("isValidNumber"));
        if ($("#accArrivalDate").val() == '')
            cm.showAlert('Please choose  Arrival Date');
        
        else if ($("#accDepartureDate").val() == '')
            cm.showAlert('Please choose  Departure Date');
        else if (cm.isAccStartDateValidate($("#accArrivalDate").val(),$("#accDepartureDate").val()))
            cm.showAlert('Please choose a valid Arrival Date');
        else if (cm.isAccEndDateValidate($("#accDepartureDate").val(),$("#accArrivalDate").val()))
            cm.showAlert('Please choose a Valid Departure Date');
        /*else if ($("#checkInTime").val() == '')
            cm.showAlert('Please choose your Arrival Time');
        else if ($("#checkOutTime").val() == '')
            cm.showAlert('Please choose your Departure Time');*/
        else if ($("#lodgemenu").val() == '')
            cm.showAlert('Please choose a Lodge');
        else if ($("#roomsCount :selected").text() == 'Number of Rooms')
            cm.showAlert('Please choose no. of rooms');
        else if ($("#hotelPhoneno").val() != "" && !($("#hotelPhoneno").intlTelInput("isValidNumber")))
            cm.showAlert("Please enter a valid phone number");
        else if (localStorage.editAccomodationMode == "true")
            accommodationMethods.updateAccommodation();

        else
            accommodationMethods.addAccommodation();
    },
    addAccommodation: function() {
        //To Add an Accommodation
        $("body").addClass("ui-loading");
        var accomodationInventoryClass = Parse.Object.extend("AccomodationInventory");
        var accomodationInventoryObj = new accomodationInventoryClass();
        accomodationInventoryObj.set("weddingID", localStorage.joinedWedding);
        accomodationInventoryObj.set("reservationStartDate", new Date($("#accArrivalDate").val()));
        accomodationInventoryObj.set("reservationEndDate", new Date($("#accDepartureDate").val()));
        accomodationInventoryObj.set("checkInTime", $("#checkInTime").val());
        accomodationInventoryObj.set("checkOutTime", $("#checkOutTime").val());
        accomodationInventoryObj.set("hotelName", $("#lodgemenu").val());
        accomodationInventoryObj.set("noOfRooms", $("#roomsCount :selected").text());
        accomodationInventoryObj.set("hotelContactNo", $("#hotelPhoneno").intlTelInput("getNumber") || '');
        accomodationInventoryObj.set("allocated","false"); // Included to check whether the Accommodation is available
        accomodationInventoryObj.save(null, {
            success: function(accomodationObj) {
                accomodationObj.set("accomInventoryID", accomodationObj.id);
                accomodationObj.save();
                $("body").removeClass("ui-loading");
                cm.showToast("Saved Accomodations successfully");
                accommodationMethods.hideAddAccPopup();
                accommodationMethods.fetchAccomodationList();
            },
            error: function(error) {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't add Accommodation");
            }
        });
    },
    updateAccommodation: function() {
        // To Save Accomodation after edit
        console.log("updateAccommodation");
        $("body").addClass("ui-loading");
        var accomodationInventoryClass = Parse.Object.extend("AccomodationInventory");
        var accomodationInventoryObj = new accomodationInventoryClass();
        accomodationInventoryObj.id = localStorage.selectedAccommodationId;
        accomodationInventoryObj.set("weddingID", localStorage.joinedWedding);
        accomodationInventoryObj.set("reservationStartDate", new Date($("#accArrivalDate").val()));
        accomodationInventoryObj.set("reservationEndDate", new Date($("#accDepartureDate").val()));
        accomodationInventoryObj.set("checkInTime", $("#checkInTime").val());
        accomodationInventoryObj.set("checkOutTime", $("#checkOutTime").val());
        accomodationInventoryObj.set("hotelName", $("#lodgemenu").val());
        accomodationInventoryObj.set("noOfRooms", $("#roomsCount :selected").text());
        accomodationInventoryObj.set("hotelContactNo", $("#hotelPhoneno").val() || '');
        accomodationInventoryObj.save(null, {
            success: function(accomodationUpdateSuccess) {
                /*accomodationInventoryObj.set("accomInventoryID", accomodationUpdateSuccess.id);
                accomodationInventoryObj.save();*/
                localStorage.editAccomodationMode = "false";
                accommodationMethods.hideAddAccPopup();
                accommodationMethods.fetchAccomodationList();
                cm.showToast("Accommodation details updated Successfully");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Unable to update Accommodation details");
                $("body").removeClass("ui-loading");
            }
        });

    },
    fetchAccomodationList: function() {
        // To Fetch Accommodations List
        $("body").addClass("ui-loading");
        var accomodationInventoryClass = Parse.Object.extend("AccomodationInventory");
        var accommodationInventoryQuery = new Parse.Query(accomodationInventoryClass);
        accommodationInventoryQuery.equalTo("weddingID", localStorage.joinedWedding);
        accommodationInventoryQuery.find({
            success: function(foundAccommodations) {
                var accommodationHtml = "";
                if (foundAccommodations.length == 0)
                    cm.showToast("You haven't added any Accommodation!");
                for (var i = 0; i < foundAccommodations.length; i++) {
                    var rowObject = foundAccommodations[i];
                    var resStartDate = rowObject.get('reservationStartDate');
                    var resEndDate = rowObject.get('reservationEndDate');
                    var shareDate = resStartDate.getDate() + '-' + cm.selectedMonth(resStartDate.getMonth()) +',' + resStartDate.getFullYear() + ' to ' + resEndDate.getDate() + '-' + cm.selectedMonth(resEndDate.getMonth()) + ',' + resEndDate.getFullYear();
                    var starteDate = resStartDate.getDate() + '<sup>th</sup>' + cm.selectedMonth(resStartDate.getMonth()) + ',' + resStartDate.getFullYear();
                    var endeDate = resEndDate.getDate() + '<sup>th</sup>' + cm.selectedMonth(resEndDate.getMonth()) + ',' + resEndDate.getFullYear();
                    accommodationHtml += '<div class="accommodations" data-accdate="'+shareDate+'" data-accname="'+rowObject.get("hotelName")+'" data-accroom="'+rowObject.get("noOfRooms")+'">'; // Accommodation block start
                    accommodationHtml += '<div class="acco-list">'; // Accommodation details start
                    accommodationHtml += '<div class="adate">Date:' + starteDate + '-' + endeDate + '</div>'; // Accommodation date start and end
                    accommodationHtml += '<div class="ahotalname">' + rowObject.get("hotelName") + '</div>'; // Hotel name start and end
                    accommodationHtml += '<div class="aroomsavaiable">Rooms Avaiable:' + rowObject.get("noOfRooms") + '</div>'; // No.Of Rooms available start and end
                    accommodationHtml += '<div class="atools">'; // Accommodation save and edit block start
                    accommodationHtml += '<div class="adelete-list" data-accid="' + rowObject.get("accomInventoryID") + '" onclick="accommodationMethods.deleteAccomodation(this)">Delete</div>'; // Accommodation Delete button
                    accommodationHtml += '<div class="aedit-list" data-accid="' + rowObject.get("accomInventoryID") + '" onclick="accommodationMethods.editAccomodation(this)">Edit</div>'; // Accommodation Edit button
                    accommodationHtml += '</div>'; // Accommodation save and edit block end
                    accommodationHtml += '</div>'; // Accommodation details end
                    accommodationHtml += '</div>'; // Accommodation block end

                    /*accommodationHtml += "<li style='margin-top:-10px;'>"; //Accommodation List start
                    accommodationHtml += "<div class='editDeleteAccommodation' position=relative align=right data-role='controlgroup' data-type='horizontal' style='margin-right:-15px'>"; // Edit&Delete block start
                    accommodationHtml += "<a href='#' data-role='button' style='padding:0; padding-right: 20px; background-color:transparent; border:none' data-accid='" + rowObject.get('accomInventoryID') + "' onclick='accommodationMethods.editAccomodation(this)'>"; // Edit button start
                    accommodationHtml += "<h6 class='edit_text'><img src='./assets/img/edit.png' class='edit-img'>Edit</h6>"; // Edit text and image
                    accommodationHtml += "</a>"; // Edit button end
                    accommodationHtml += "<a href='#' data-role='button' style='padding:0; background-color:transparent; border:none' data-accid='" + rowObject.get('accomInventoryID') + "' onclick='accommodationMethods.deleteAccomodation(this)'>"; // Delete button start
                    accommodationHtml += "<h6 class='delete_text'><img src='./assets/img/delete.png' class='bin-img'>Delete</h6>"; // Delete text and image
                    accommodationHtml += "</a>"; // Delete button end
                    accommodationHtml += "</div>"; // Edit&Delete block end
                    accommodationHtml += "<div class='accomodation-data'>"; // Accommodation data block start
                    accommodationHtml += "<h6 class='text-color'><img src='./assets/img/calender-icon.png' class='gap'> Date:" + starteDate + "-" + endeDate + " </h6>"; // Date text and image
                    accommodationHtml += "<h4 class='hotel_name'><img src='./assets/img/hotel_icon.png' class='gap'>" + rowObject.get('hotelName') + "</h4>"; // Hotel name text and image
                    accommodationHtml += "<h5 class='room-available'><img src='./assets/img/people_icon.png' class='room-available-icon'> Rooms Available :" + rowObject.get('noOfRooms') + "</h5>"; // Rooms available and Image
                    accommodationHtml += "</div>"; // Accommodation data block end
                    accommodationHtml += "</li>"; //Accommodation List end*/

                }
                $("#accomodationEntries").html(accommodationHtml).trigger("create");
                // $("#accomodationEntries").trigger("create");
                $("body").removeClass('ui-loading');
            },
            error: function() {
                cm.showAlert("Sorry!Couldn't fetch Accommodations");
                $("body").removeClass('ui-loading');
            }
        });
        // $("body").removeClass("ui-loading");
    },
    editAccomodation: function(selectedAccommodation) {
        //To Edit the selected Accommodation
        $("body").addClass("ui-loading");
        var accomodationInventoryClass = Parse.Object.extend("AccomodationInventory");
        var accQuery = new Parse.Query(accomodationInventoryClass);
        accQuery.equalTo("accomInventoryID", $(selectedAccommodation).data('accid'));
        localStorage.selectedAccommodationId = $(selectedAccommodation).data('accid');
        localStorage.editAccomodationMode = "true";
        accQuery.find({
            success: function(foundAccommodation) {
                var selectedAccInv = foundAccommodation[0];
                var selLodgeName = selectedAccInv.get('hotelName');
                var selRoomCount = selectedAccInv.get('noOfRooms');
                var selCheckInDate = cm.dateValidator(selectedAccInv.get('reservationStartDate'));
                var selCheckOutDate = cm.dateValidator(selectedAccInv.get('reservationEndDate'));
                // $('#addAccomBlock').popup("open");
                $('#addAccomBlock').show();
                $("#accArrivalDate").val(selCheckInDate);
                $("#accDepartureDate").val(selCheckOutDate);
                $("#checkInTime").val(selectedAccInv.get('checkInTime') || '');
                $("#checkOutTime").val(selectedAccInv.get('checkOutTime') || '');
                $("#lodgemenu").val(selectedAccInv.get('hotelName') || '');
                $("#roomsCount option").each(function(index, value) {
                    if ($(this).text() == selRoomCount)
                        $(this).prop('selected', true);
                });
                $("#roomsCount").selectmenu('refresh');
                $("#hotelPhoneno").val(selectedAccInv.get('hotelContactNo') || '');
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Couldn't edit Accommodation");
                $("body").removeClass("ui-loading");
            }
        });
    },
    deleteAccomodation: function(selectedAccommodation) {
        var accommodationInventoryClass = Parse.Object.extend("AccomodationInventory");
        var accQuery = new Parse.Query(accommodationInventoryClass);
        localStorage.selectedAccommodationId = $(selectedAccommodation).data('accid');
        $("body").addClass('ui-loading');
        accQuery.get($(selectedAccommodation).data('accid'), {
            success: function(selectedAccommodation) {
                selectedAccommodation.destroy({});
                cm.showToast("Deleted Accommodation successfully");
                accommodationMethods.fetchAccomodationList();
                $("body").removeClass('ui-loading');
            },
            error: function(error) {
                cm.showAlert('Sorry!Unable to delete the Accommodation');
                $("body").removeClass('ui-loading');
            }
        });
    },
    prepareAccForShare: function(selectedAcc) {
        // To Prepare the cab contents for share
        var accMessage ="Date: "+$(selectedAcc).data("accdate")+"\n";
        accMessage+="Hotel Name:"+$(selectedAcc).data("accname")+"\n";
        accMessage+="Rooms available: "+$(selectedAcc).data("accroom")+"\n";
        localStorage.accDataForShare=accMessage;
    },
    shareAccData:function(){
        // To share the cab data with the users
        if(localStorage.accDataForShare!="false")
            window.plugins.socialsharing.share(localStorage.accDataForShare);
        else cm.showAlert("Please choose an Accommodation for sharing details");
    }
};


$("#accomodationEntries").on("click", "div.accommodations", function() {
    // To Change the color of the Selected Contacts
    console.log("Tapped Acc");
    $("div.accommodations").removeClass("selectedAccCab");
    $(this).toggleClass("selectedAccCab");
    accommodationMethods.prepareAccForShare(this);
    if ($("div.selectedAccCab").length ==0)
        localStorage.accDataForShare="false";
});