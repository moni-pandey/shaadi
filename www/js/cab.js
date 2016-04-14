var cabMethods = {
    showAddCabPopup: function() {
        //To Show Add cab block
        $('#addCabBlock').toggle(); //Show or hide add cab blocl based on its visibility
        $.mobile.silentScroll($('#addCabBlock').offset().top);
    },
    hideAddCabPopup: function() {
        // To Hide Add Cab Popup
        // $("#addCabBlock").popup("close");
        $("#addCabBlock").hide();
        $("#cabStartDate,#cabEndDate,#carNumber,#carModel,#carDriverName").val(""); //Clear Input fields
        $("#carColor").val("reseted").selectmenu("refresh");
    },
    setAddCabMode: function() {
        // To set the Mode to add Cab
        localStorage.editCabMode = "false";
        this.showAddCabPopup();
    },
    validateCab: function() {
        // To Validate Cab Fields
        if ($("#cabStartDate").val() == "")
            cm.showAlert("Please choose a Start Date");
        else if ($("#cabEndDate").val() == "")
            cm.showAlert("Please choose a End Date");
        else if (cm.isCabStartDateValidate($("#cabStartDate").val(),$("#cabEndDate").val()))
            cm.showAlert("Please choose a valid Start Date");
        
        else if (cm.isCabEndDateValidate($("#cabEndDate").val(),$("#cabStartDate").val()))
            cm.showAlert("Please choose a End Date after Start date");
        else if ($("#carNumber").val() == "")
            cm.showAlert("Please enter Cab number");
        else if ($("#carDriverName").val() == '')
            cm.showAlert("Please enter Cab Driver Name");
        else if ($("#carDriverNum").val() != "" && !($("#carDriverNum").intlTelInput("isValidNumber")))
            cm.showAlert("Please enter a valid mobile number");
        else if (localStorage.editCabMode == "true")
            cabMethods.updateCab();
        else
            cabMethods.addCab();
    },
    addCab: function() {
        // To Add a Cab     
        var transportClass = Parse.Object.extend("Transport");
        var transportObj = new transportClass();
        $("body").addClass('ui-loading');
        transportObj.set("weddingID", localStorage.joinedWedding);
        transportObj.set("driverName", $("#carDriverName").val() || '');
        transportObj.set("vehicleNumber", $("#carNumber").val());
        transportObj.set("driverContactNo", $("#carDriverNum").val());
        transportObj.set("carModel", $("#carModel").val() || '');
        transportObj.set("carColor", $("#carColor :selected").text() || '');
        transportObj.set("allocated", "false");
        transportObj.set("reservationStartDate", new Date($("#cabStartDate").val()));
        transportObj.set("reservationEndDate", new Date($("#cabEndDate").val()));
        transportObj.save(null, {
            success: function(transportAddSuccess) {
                transportObj.set("transportID", transportAddSuccess.id);
                transportObj.save();
                $("body").removeClass("ui-loading");
                cm.showToast("Saved Cab detail successfully");
                cabMethods.hideAddCabPopup();
                cabMethods.fetchCabList();
            },
            error: function(error) {
                $("body").removeClass("ui-loading");
                cm.showAlert("Unable to save Cab detail");
            }
        });
    },
    updateCab: function() {
        // To Update Cab Details
        var transportClass = Parse.Object.extend("Transport");
        var transportObj = new transportClass();
        $("body").addClass("ui-loading");
        transportObj.id = localStorage.selectedCabId;
        transportObj.set("weddingID", localStorage.joinedWedding);
        transportObj.set("driverName", $("#carDriverName").val() || '');
        transportObj.set("vehicleNumber", $("#carNumber").val());
        transportObj.set("driverContactNo", $("#carDriverNum").intlTelInput("getNumber"));
        transportObj.set("carModel", $("#carModel").val() || '');
        transportObj.set("carColor", $("#carColor :selected").text() || '');
        transportObj.set("allocated", "false");
        transportObj.set("reservationStartDate", new Date($("#cabStartDate").val()));
        transportObj.set("reservationEndDate", new Date($("#cabEndDate").val()));
        transportObj.save(null, {
            success: function(transportUpdateSuccess) {
                localStorage.editCabMode == "false";
                cabMethods.hideAddCabPopup();
                cabMethods.fetchCabList();
                cm.showToast("Cab details updated successfully");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Unable to update Cab details");
                $("body").removeClass("ui-loading");
            }
        });
    },
    fetchCabList: function() {
        // To Fetch Cab List
        var transportClass = Parse.Object.extend("Transport");
        var transportQuery = new Parse.Query(transportClass);
        transportQuery.equalTo("weddingID", localStorage.joinedWedding);
        $("body").addClass('ui-loading');
        transportQuery.find({
            success: function(foundTransport) {
                if (foundTransport.length == 0)
                    cm.showToast("You haven't added any Cab!"); //Just to inform the user that there is no Cab
                var transportHtml = "";
                for (var i = 0; i < foundTransport.length; i++) {
                    var rowObject = foundTransport[i];
                    var resStartDate = rowObject.get("reservationStartDate");
                    var resEndDate = rowObject.get("reservationEndDate");
                    var shareDate = resStartDate.getDate() + '-' + cm.selectedMonth(resStartDate.getMonth()) +',' + resStartDate.getFullYear() + ' to ' + resEndDate.getDate() + '-' + cm.selectedMonth(resEndDate.getMonth()) + ',' + resEndDate.getFullYear();
                    var carColorLoc = rowObject.get('carColor') == "Color" ? "" : rowObject.get('carColor');
                    var starteDate = resStartDate.getDate() + '<sup>th</sup>' + cm.selectedMonth(resStartDate.getMonth()) + ',' + resStartDate.getFullYear();
                    var endeDate = resEndDate.getDate() + '<sup>th</sup>' + cm.selectedMonth(resEndDate.getMonth()) + ',' + resEndDate.getFullYear();
                    transportHtml += '<div class="acco-list" data-cabdate="' + shareDate + '" data-cabnum="' + rowObject.get("vehicleNumber") + '(' + rowObject.get('carModel') + ' ' + carColorLoc + ')' + '" data-drivername="' + rowObject.get("driverName") + '" data-drivernumber="' + rowObject.get("driverContactNo") + '">'; // Cab entry starts
                    transportHtml += '<div class="adate">' + starteDate + '-' + endeDate + '</div>'; // Cab date start and end
                    transportHtml += '<div class="acabnumber">' + rowObject.get("vehicleNumber") + '(' + rowObject.get('carModel') + ' ' + carColorLoc + ')' + '</div>'; // Cab number start and end
                    transportHtml += '<div class="adrivername">Driver Name:' + rowObject.get("driverName") + '</div>'; // Cab driver name start and end
                    transportHtml += '<div class="adrivernumber">Driver Phone:' + rowObject.get("driverContactNo") + '</div>'; // Cab driver phone start and end
                    transportHtml += '<div class="atools">'; // Cab edit and delete block start
                    transportHtml += '<div class="adelete-list" data-cabid=' + rowObject.get("transportID") + ' onclick="cabMethods.deleteCab(this)">Delete</div>'; // Cab delete start and end
                    transportHtml += '<div class="aedit-list" data-cabid=' + rowObject.get("transportID") + ' onclick="cabMethods.editCab(this)">Edit</div>'; // Cab edit start and end
                    transportHtml += '</div>'; // Cab edit and delete block end
                    transportHtml += '</div>'; // Cab entry ends
                }
                $("#cablist").html(transportHtml).trigger("create");
                $("body").removeClass('ui-loading');
            },
            error: function() {
                $("body").removeClass('ui-loading');
                cm.showAlert("Sorry!Couldn't fetch Cabs");
            }
        });
    },
    editCab: function(selectedCab) {
        // To Edit Cab details
        $("body").addClass("ui-loading");
        var transportClass = Parse.Object.extend("Transport");
        var transportQuery = new Parse.Query(transportClass);
        localStorage.selectedCabId = $(selectedCab).data('cabid');
        transportQuery.equalTo("transportID", $(selectedCab).data('cabid'));
        localStorage.editCabMode = "true";
        transportQuery.find({
            success: function(foundTransport) {
                var selectedTransport = foundTransport[0];
                var selPickupDate = cm.dateValidator(selectedTransport.get('reservationStartDate'));
                var selDropDate = cm.dateValidator(selectedTransport.get('reservationEndDate'));
                var selCabColor = selectedTransport.get("carColor") || " ";
                // $('#addCabBlock').popup("open");
                $('#addCabBlock').show();
                $("#cabStartDate").val(selPickupDate);
                $("#cabEndDate").val(selDropDate);
                $("#carNumber").val(selectedTransport.get("vehicleNumber"));
                $("#carModel").val(selectedTransport.get("carModel"));
                if (selCabColor != "") {
                    $("#carColor option").each(function(value) {
                        if ($(this).text() === "selCabColor")
                            $(this).prop("selected", "true");
                    });
                    $("#carColor").selectmenu("refresh").change();
                } else $("#carColor").val("reseted").selectmenu("refresh");
                $("#carDriverName").val(selectedTransport.get("driverName") || "");
                $("#carDriverNum").val(selectedTransport.get("driverContactNo") || "");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't edit cab");
            }
        });
    },
    deleteCab: function(selectedCab) {
        // To delete a cab
        var transportClass = Parse.Object.extend("Transport");
        var transportQuery = new Parse.Query(transportClass);
        localStorage.selectedCabId = $(selectedCab).data("cabid");
        $("body").addClass("ui-loading");
        transportQuery.get($(selectedCab).data("cabid"), {
            success: function(selectedCab) {
                selectedCab.destroy({});
                cm.showToast("Deleted Cab successfully");
                cabMethods.fetchCabList();
                $("body").removeClass("ui-loading");
            },
            error: function(error) {
                cm.showAlert("Sorry!Unable to delete the Cab");
                $("body").removeClass("ui-loading");
            }
        });
    },
    prepareCabForShare: function(selectedCab) {
        // To Prepare the cab contents for share
        var cabMessage ="Date: "+$(selectedCab).data("cabdate")+"\n";
        cabMessage+="Cab Number:"+$(selectedCab).data("cabnum")+"\n";
        cabMessage+="Driver Name: "+$(selectedCab).data("drivername")+"\n";
        cabMessage+="Driver Number: "+$(selectedCab).data("drivernumber")+"\n";
        localStorage.cabDataForShare=cabMessage;
    },
    shareCabData:function(){
        // To share the cab data with the users
        if(localStorage.cabDataForShare!="false")
            window.plugins.socialsharing.share(localStorage.cabDataForShare);
        else cm.showAlert("Please choose a cab for sharing");
    }
};


$("#cablist").on("click", "div.acco-list", function() {
    // To Change the color of the Selected Contacts
    console.log("Tapped Cab");
    $("div.acco-list").removeClass("selectedAccCab");
    $(this).toggleClass("selectedAccCab");
    cabMethods.prepareCabForShare(this);
    if ($("div.selectedAccCab").length ==0)
        localStorage.cabDataForShare="false";
});
