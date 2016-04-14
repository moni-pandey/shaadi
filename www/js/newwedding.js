var newWeddingMethods = {
    //To Change the color of the Checkbox to indicate the selected Gender
    selectGuestGender: function(ev, genderType) {
        $('.square-radio1').css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
        //Save the Gender Type
        localStorage.hostGender = genderType;
    },
    selectYourGender: function(ev, genderType) {
        if (genderType == "Female") {
            $("#yGenderMale").css("background-color", '#a1a1a1');
            $("#yMaleImg").prop("src", "./assets/img/Man_gray.png"); // Dim the Man Picture
            $("#yFemaleImg").prop("src", "./assets/img/female_red.png"); //Highlight the Female Picture
        } else {
            $("#yGenderFemale").css("background-color", '#a1a1a1');
            $("#yMaleImg").prop("src", "./assets/img/male.png"); // Highlight the Man Picture
            $("#yFemaleImg").prop("src", "./assets/img/female.png"); //Dim the Female Picture
        }
        // $('.square-radio1').css("background-color", '#a1a1a1');
        $(ev).css("background-color", 'red');
        //Save your Gender Type
        localStorage.hostGender = genderType;
    },
    validateNewWeddingFields: function() {
        //Validate all the Mandatory Fields in New Wedding Page
        if ($("#coverPic").attr('src') == "")
            cm.showAlert("Please add a Cover Photo");
        else if ($("#brideName").val() == "")
            cm.showAlert("Please enter Bride name");
        else if ($("#groomName").val() == "")
            cm.showAlert("Please enter Groom name");
        else if ($("#relation :selected").text() == "--- Choose your Relation ---")
            cm.showAlert("Please choose your relationship");
        else if (localStorage.hostGender == null || localStorage.hostGender == "")
            cm.showAlert("Please choose your gender");
        else if ($("#city").val() == "")
            cm.showAlert("Please enter event location");
        else if ($("#hostname").val() == "")
            cm.showAlert("Please enter your name");
        else if ($("#email").val() == "")
            cm.showAlert("Please enter your e-mail id");
        else if (cm.isValidEmail($("#email").val()))
            cm.showAlert("Please enter a valid e-mail id");
        else if ($("#wedDateinput").val() == "")
            cm.showAlert("Please choose event date");
        else if (cm.isFuture($("#wedDateinput").val())) {
            cm.showAlert("The event must be registered  on or before the event");
        } else {
            var registerHostDetails = {};
            registerHostDetails.brideName = $("#brideName").val();
            registerHostDetails.groomName = $("#groomName").val();
            registerHostDetails.hostName = $("#hostname").val();
            registerHostDetails.hostEmail = $("#email").val();
            registerHostDetails.weddingDate = $("#wedDateinput").val();
            registerHostDetails.weddingCity = $("#city").val();
            registerHostDetails.hostRelation = $("#relation :selected").text();
            localStorage.registerHostDetails = JSON.stringify(registerHostDetails);
            //Make the default plan standard to Highlight it as Selected
            localStorage.userPlan = "standard";
            newWeddingMethods.registerWedding();
            //Disabled for Beta version need to work on it
            /*$(":mobile-pagecontainer").pagecontainer("change", "plans.html", {
                showLoadMsg: false
            });*/

        }
    },
    pickPlan: function(planType) {
        //To choose the UserPlan either Standard or Premium
        localStorage.userPlan = planType;
    },
    registerHost: function(hostsweddingId) {
        //Register the New User(Host) details in Host class
        var hostClass = Parse.Object.extend("Host");
        var hostObj = new hostClass();
        var registerHostDetails = JSON.parse(localStorage.registerHostDetails);
        hostObj.set("hostName", registerHostDetails.hostName);
        hostObj.set("weddingID", hostsweddingId);
        hostObj.set("mobileNo", localStorage.userMobile);
        hostObj.set("email", registerHostDetails.hostEmail);
        hostObj.set("relationToBrideGroom", registerHostDetails.hostRelation);
        hostObj.set("hostGender", localStorage.hostGender);
        hostObj.save(null, {
            success: function(hostResults) {
                hostObj.set("hostID", hostResults.id);
                hostObj.save();
                $("body").removeClass("ui-loading");
                cm.showAlert('Registration Successful');
                localStorage.userType = 'existingUser';
                localStorage.userPriv = "host";
                localStorage.userId = hostResults.id;
                $(":mobile-pagecontainer").pagecontainer("change", "socialweddings.html", {
                    showLoadMsg: false
                });

                //newWeddingMethods.registerHost(hostResults.id);
            },
            error: function(error) {
                $("body").removeClass("ui-loading");
                cm.showAlert('Sorry!Registration Failed');
            }
        });
    },
    registerWedding: function() {
        //Register the New Wedding in Wedding class
        var planObj = {
            plan: localStorage.userPlan
        };
        var registerHostDetails = JSON.parse(localStorage.registerHostDetails);
        var weddingClass = Parse.Object.extend("Wedding");
        var weddingObj = new weddingClass();
        weddingObj.set("groomName", registerHostDetails.groomName);
        weddingObj.set("brideName", registerHostDetails.brideName);
        weddingObj.set("dateOfWedding", new Date(registerHostDetails.weddingDate));
        weddingObj.set("weddingCity", registerHostDetails.weddingCity);
        weddingObj.set("plan", planObj);
        weddingObj.set("coverPic", localStorage.eventCoverPic || "");
        $("body").addClass("ui-loading");
        weddingObj.save(null, {
            success: function(weddingResults) {
                weddingObj.set("weddingID", weddingResults.id);
                weddingObj.save();
                //Save the Host details who is organizing this Wedding
                newWeddingMethods.registerHost(weddingResults.id);
            },
            error: function(error) {
                cm.showAlert("Sorry!Couldn't save wedding details");
            }
        });
    },
    addEventCoverPhoto: function() {
        //Add a cover photo to the wedding opens Gallery to pick a photo
        navigator.camera.getPicture(function(dataImage) {
            $("#coverPic").show();
            localStorage.eventCoverPic = dataImage;
            $("#weddingPicTemplate").hide();
            $("#smallImage").prop("src", "data:image/jpeg;base64," + dataImage);
            $("#blankAddiv").css({
                "display": "none"
            });
        }, function(error) {
            cm.showAlert('Image capture failed');
        }, {
            quality: 100,
            targetWidth: 200,
            targetHeight: 200,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            //pictureSource.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.DATA_URL
        });
    }
};

$("input[name='yourGender']").on("click", function() {
    localStorage.hostGender = $(this).val();
});

$("#choosePlan").ready(function() {
    //Just to highlight the plan which has been selected at the moment
    if (localStorage.userPlan == "standard") {
        $(".standard-btn").addClass("ui-btn-active");
    } else if (localStorage.userPlan == "premium") {
        $(".premium_pink-btn").addClass("ui-btn-active");
    }
});


$("#groomName ,#brideName , #hostname  #city").keyup(function(e) {
    var str = $.trim($(this).val());
    if (str != "") {
        var regx = /^[A-Za-z]+$/;
        if (!regx.test(str)) {
            cm.showAlert(" only alphabets allowed !");
        }
    } else {
        //empty value -- do something here
    }
});
