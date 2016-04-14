var storyboardMethods = {
    manageWishButton: function() {
        // To Manage the Wish button based on user relation

        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        if (weddingDetailsObject.relation == "Bride" || weddingDetailsObject.relation == "Groom")
            $("#wishBtn").text("View Wishes");
        else console.warn("No Change Needed I am not a Bride/Groom");
    },
    changeWeddingImg: function() {
        // To Change the cover picture in storyboard
        navigator.camera.getPicture(function(dataImage) {

            changeCoverImg = dataImage;
            $('#savechangeImage').show();
            $('#changeImage').hide();
            localStorage.eventCoverPic = dataImage;
            $("#storyboard-img").attr("src", "data:image/jpeg;base64," + dataImage);
        }, function(error) {
            cm.showAlert("You have cancelled image selection");
        }, {
            quality: 100,
            targetWidth: 200,
            targetHeight: 200,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            //pictureSource.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.DATA_URL
        });
    },
    savechangeWeddingImg: function() {
        // To save the CoverPic in Wedding Class
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        $('#savechangeImage').hide();
        $('#changeImage').show();
        var weddingClass = Parse.Object.extend("Wedding");
        var weddingObj = new weddingClass();
        weddingObj.id = weddingDetailsObject.weddingId;
        weddingDetailsObject.img = $("#storyboard-img").attr("src");
        localStorage.weddingDetailsObject = JSON.stringify(weddingDetailsObject);
        weddingObj.set("coverPic", localStorage.eventCoverPic);
        weddingObj.save(null, {
            success: function(point) {
                // localStorage.editStoryboardClicked="true"; 
                cm.showToast('Uploaded Cover Picture Successfully');
            },
            error: function(point, error) {
                cm.showAlert("Sorry!Couldn't Upload Cover Picture");
            }
        });
    },
    fetchWeddingDetails: function() {
        $("body").addClass("ui-loading");
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        console.log("weddingDetailsObject" + weddingDetailsObject.usertype);
        if (weddingDetailsObject.usertype == "guest") {
            console.warn("Guest user so hide the edit buttons");
            $(".hidedit,#changeImage,#savechangeImage").hide();
        } else if (weddingDetailsObject.usertype == "host")
            $(".hidedit").show();
        var weddingClass = Parse.Object.extend("Wedding");
        var weddingQuery = new Parse.Query(weddingClass);

        weddingQuery.equalTo('weddingID', weddingDetailsObject.weddingId);
        weddingQuery.find({
            success: function(weddingDetails) {
                /*var date1=weddingDetails[0].get('dateOfWedding');
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));*/
                if (weddingDetailsObject.diffDays>=0) {
                    // Furure Wedding
                    console.warn("Furure");
                    $('#dtLeft').show().html(weddingDetailsObject.diffDays);
                    $("#dtStatus").html("Days " + weddingDetailsObject.status);
                }else{
                    // Past Wedding
                    console.warn("Past");
                    $('#dtLeft').hide();
                    $("#dtStatus").html(weddingDetailsObject.weddingDate);
                }

                $('#copName').html(cm.trimText(weddingDetailsObject.brideAndGroomName) || "");
                $("#storyboard-img").attr("src", weddingDetailsObject.img);
                $("#weddingDT").html(weddingDetailsObject.dater || "");
                $("#weddingLoc").html(weddingDetails[0].get('weddingCity') || "");
                $('#howTheyMetDiv').html(weddingDetails[0].get('howTheyMet') || "");
                $('#aboutBrideDiv').html(weddingDetails[0].get('aboutBride') || "");
                $('#aboutGroomDiv').html(weddingDetails[0].get('aboutGroom') || "");
                $('#aboutBrideFamilyDiv').html(weddingDetails[0].get('aboutBrideFamily') || "");
                $('#aboutGroomFamilyDiv').html(weddingDetails[0].get('aboutGroomFamily') || "");
                $("body").removeClass("ui-loading");
            },
            error: function(error) {
                cm.showAlert("Sorry!Couldn't get marriage details");
                $("body").removeClass("ui-loading");
            }
        });

    },
    editHowTheyMet: function() {
        /*$('#howTheymetCon').removeClass('col-xs-9');
        $('#howTheymetCon').addClass('col-xs-8');*/
        $('#howTheymetEdit').hide();
        $('#howTheyMetDiv').hide();
        $('#howTheymetSave,#howTheymetCancel').show();
        $('#howTheyMetTbox').show();
        $('#howTheyMetTbox').val($('#howTheyMetDiv').text());
        //$('#howTheyMetDiv').html(howTheyMetTbox);
    },
    editAll: function() {
        // To show all the edit boxes
        localStorage.editStoryboardClicked = "true"; // flag to check whether Edit button clicked or not

        $('#howTheyMetDiv').hide();
        $('#howTheyMetTbox').show();
        $('#howTheyMetTbox').val($('#howTheyMetDiv').text());

        //aboutbride
        $('#aboutBrideTbox').show();
        $('#aboutBrideDiv').hide();
        $('#aboutBrideTbox').val($('#aboutBrideDiv').text());

        //about groom
        $('#aboutGroomTbox').show();
        $('#aboutGroomDiv').hide();
        $('#aboutGroomTbox').val($('#aboutGroomDiv').text());

        //bridefamily
        $('#aboutBrideFamilyTbox').show();
        $('#aboutBrideFamilyDiv').hide();
        $('#aboutBrideFamilyTbox').val($('#aboutBrideFamilyDiv').text());

        //groomfamily
        $('#aboutGroomFamilyTbox').show();
        $('#aboutGroomFamilyDiv').hide();
        $('#aboutGroomFamilyTbox').val($('#aboutGroomFamilyDiv').text());



        //$('#howTheyMetTbox').val($('#howTheyMetDiv').text()); 
    },
    saveStory: function() {
        // To save the stories
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        if (localStorage.editStoryboardClicked == "false" || weddingDetailsObject.usertype == "guest") {
            // If Edit is not clicked or usertype is guest just return
            history.back();
            return;
        }

        var weddingClass = Parse.Object.extend("Wedding");
        var weddingObj = new weddingClass();
        weddingObj.id = weddingDetailsObject.weddingId;
        var howTheyMetText = $("#howTheyMetTbox").val() == "" ? $("#howTheyMetDiv").text() : $("#howTheyMetTbox").val();
        var aboutBrideText = $("#aboutBrideTbox").val() == "" ? $("#aboutBrideDiv").text() : $("#aboutBrideTbox").val();
        var aboutGroomText = $("#aboutGroomTbox").val() == "" ? $("#aboutGroomDiv").text() : $("#aboutGroomTbox").val();
        var aboutBrideFamilyText = $("#aboutBrideFamilyTbox").val() == "" ? $("#aboutBrideFamilyDiv").text() : $("#aboutBrideFamilyTbox").val();
        var aboutGroomFamilyText = $("#aboutGroomFamilyTbox").val() == "" ? $("#aboutGroomFamilyDiv").text() : $("#aboutGroomFamilyTbox").val();
        weddingObj.set("howTheyMet", howTheyMetText);
        weddingObj.set("aboutBride", aboutBrideText);
        weddingObj.set("aboutGroom", aboutGroomText);
        weddingObj.set("aboutBrideFamily", aboutBrideFamilyText);
        weddingObj.set("aboutGroomFamily", aboutGroomFamilyText);
        weddingObj.save(null, {
            success: function(storySaveSuccess) {
                console.log(storySaveSuccess);
            },
            error: function(point, error) {
                cm.showAlert("Sorry! Couldn't save storyboard details");
            }
        });
        cm.showToast('Updated details Successfully');
        history.back();
        /* for (var j = 0; j < 5; j++) {
            if (j == 0) {
                storyboardMethods.saveHowTheyMet()
            } else if (j == 1) {
                storyboardMethods.saveAboutBride()
            } else if (j == 2) {
                storyboardMethods.saveAboutGroom()
            } else if (j == 3) {
                storyboardMethods.saveAboutBrideFamily()

            } else {
                storyboardMethods.saveaboutGroomFamily()
            }

        }*/

    },

    saveHowTheyMet: function() {
        storyboardMethods.updateWeddingDetails('howTheyMet', $('#howTheyMetTbox').val(), function() {
            /*$('#howTheymetCon').removeClass('col-xs-8');
            $('#howTheymetCon').addClass('col-xs-9');*/
            $('#howTheymetEdit').show();
            $('#howTheymetSave,#howTheymetCancel').hide();
            $('#howTheyMetDiv').show();
            $('#howTheyMetTbox').hide();

            var howTheyMetTbox = $('#howTheyMetTbox').val();
            $('#howTheyMetDiv').html(howTheyMetTbox);
            //cm.showToast('Updated details Successfully');
        }, function() {
            cm.showAlert("Sorry!Couldn't save details");
        });

    },
    cancelHowTheyMet: function() {
        // While cancel in Howthey met button is clicked
        $('#howTheymetEdit').show();
        $('#howTheyMetDiv').show();
        $('#howTheymetSave,#howTheymetCancel').hide();
        $('#howTheyMetTbox').hide();
        //$('#howTheyMetTbox').val($('#howTheyMetDiv').text());
    },
    editAboutBride: function() {
        /*$('#aboutBrideHeader').removeClass('col-xs-9');
        $('#aboutBrideHeader').addClass('col-xs-8');*/
        $('#aboutBrideSave,#aboutBrideCancel').show();
        $('#aboutBrideEdit').hide();
        $('#aboutBrideTbox').show();
        $('#aboutBrideDiv').hide();
        $('#aboutBrideTbox').val($('#aboutBrideDiv').text());
    },

    saveAboutBride: function() {
        storyboardMethods.updateWeddingDetails('aboutBride', $('#aboutBrideTbox').val(), function() {
            /*$('#aboutBrideHeader').removeClass('col-xs-8');
            $('#aboutBrideHeader').addClass('col-xs-9');*/
            $('#aboutBrideEdit').show();
            $('#aboutBrideSave,#aboutBrideCancel').hide();
            $('#aboutBrideTbox').hide();
            $('#aboutBrideDiv').show();
            var aboutBrideTbox = $('#aboutBrideTbox').val();
            $('#aboutBrideDiv').html(aboutBrideTbox);
            //cm.showToast('Updated details Successfully');
        }, function() {
            cm.showAlert("Sorry!Couldn't save details");
        });
    },
    cancelAboutBride: function() {
        // Cancel About Groom
        $('#aboutBrideSave,#aboutBrideCancel').hide();
        $('#aboutBrideEdit').show();
        $('#aboutBrideTbox').hide();
        $('#aboutBrideDiv').show();
    },
    editAboutGroom: function() {
        /*$('#aboutGroomHeader').removeClass('col-xs-9');
        $('#aboutGroomHeader').addClass('col-xs-8');*/
        $('#aboutGroomSave,#aboutGroomCancel').show();
        $('#aboutGroomEdit').hide();
        $('#aboutGroomTbox').show();
        $('#aboutGroomDiv').hide();
        $('#aboutGroomTbox').val($('#aboutGroomDiv').text());
    },
    cancelAboutGroom: function() {
        // Cancel About Groom
        $('#aboutGroomSave,#aboutGroomCancel').hide();
        $('#aboutGroomEdit').show();
        $('#aboutGroomTbox').hide();
        $('#aboutGroomDiv').show();
        //$('#aboutGroomTbox').val($('#aboutGroomDiv').text());
    },
    saveAboutGroom: function() {
        storyboardMethods.updateWeddingDetails('aboutGroom', $('#aboutGroomTbox').val(), function() {
            /*$('#aboutGroomHeader').removeClass('col-xs-8');
            $('#aboutGroomHeader').addClass('col-xs-9');*/
            $('#aboutGroomEdit').show();
            $('#aboutGroomSave,#aboutGroomCancel').hide();
            $('#aboutGroomTbox').hide();
            $('#aboutGroomDiv').show();
            var aboutGroomTbox = $('#aboutGroomTbox').val();
            $('#aboutGroomDiv').html(aboutGroomTbox);
            //cm.showToast('Updated details Successfully');
        }, function() {
            cm.showAlert("Sorry!Couldn't save details");
        });
    },
    editAboutBrideFamily: function() {
        /*$('#aboutBrideFamilyHeader').removeClass('col-xs-9');
        $('#aboutBrideFamilyHeader').addClass('col-xs-8');*/
        $('#aboutBrideFamilySave,#aboutBrideFamilyCancel').show();
        $('#aboutBrideFamilyEdit').hide();
        $('#aboutBrideFamilyTbox').show();
        $('#aboutBrideFamilyDiv').hide();
        $('#aboutBrideFamilyTbox').val($('#aboutBrideFamilyDiv').text());
    },
    saveAboutBrideFamily: function() {
        storyboardMethods.updateWeddingDetails('aboutBrideFamily', $('#aboutBrideFamilyTbox').val(), function() {
            /*$('#aboutBrideFamilyHeader').removeClass('col-xs-8');
            $('#aboutBrideFamilyHeader').addClass('col-xs-9');*/
            $('#aboutBrideFamilyEdit').show();
            $('#aboutBrideFamilySave,#aboutBrideFamilyCancel').hide();
            $('#aboutBrideFamilyTbox').hide();
            $('#aboutBrideFamilyDiv').show();
            var aboutBrideFamilyTbox = $('#aboutBrideFamilyTbox').val();
            $('#aboutBrideFamilyDiv').html(aboutBrideFamilyTbox);
            cm.showToast('Updated details Successfully');
        }, function() {
            cm.showAlert("Sorry!Couldn't save details");
        });
    },
    editAboutGroomFamily: function() {
        $
        /*('#aboutGroomFamilyHeader').removeClass('col-xs-9');
                $('#aboutGroomFamilyHeader').addClass('col-xs-8');*/
        $('#aboutGroomFamilySave,#aboutGroomFamilyCancel').show();
        $('#aboutGroomFamilyEdit').hide();
        $('#aboutGroomFamilyTbox').show();
        $('#aboutGroomFamilyDiv').hide();
        $('#aboutGroomFamilyTbox').val($('#aboutGroomFamilyDiv').text());
    },
    saveaboutGroomFamily: function() {
        storyboardMethods.updateWeddingDetails('aboutGroomFamily', $('#aboutGroomFamilyTbox').val(), function() {
            /*$('#aboutGroomFamilyHeader').removeClass('col-xs-8');
            $('#aboutGroomFamilyHeader').addClass('col-xs-9');*/
            $('#aboutGroomFamilyEdit').show();
            $('#aboutGroomFamilySave,#aboutGroomFamilyCancel').hide();
            $('#aboutGroomFamilyTbox').hide();
            $('#aboutGroomFamilyDiv').show();
            var aboutGroomFamilyTbox = $('#aboutGroomFamilyTbox').val();
            $('#aboutGroomFamilyDiv').html(aboutGroomFamilyTbox);
            //cm.showToast('Updated details Successfully');
        }, function() {
            cm.showAlert("Sorry!Couldn't save details");
        });

    },
    cancelAboutGroomFamily: function() {
        // Cancel About Groom Family
        $('#aboutGroomFamilySave,#aboutGroomFamilyCancel').hide();
        $('#aboutGroomFamilyEdit').show();
        $('#aboutGroomFamilyTbox').hide();
        $('#aboutGroomFamilyDiv').show();
    },
    cancelAboutBrideFamily: function() {
        // Cancel About Bride Family changes
        $('#aboutBrideFamilySave,#aboutBrideFamilyCancel').hide();
        $('#aboutBrideFamilyEdit').show();
        $('#aboutBrideFamilyTbox').hide();
        $('#aboutBrideFamilyDiv').show();
    },
    updateWeddingDetails: function(colName, value, success, errors) {
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var weddingClass = Parse.Object.extend("Wedding");
        var weddingObj = new weddingClass();
        weddingObj.id = weddingDetailsObject.weddingId;
        weddingObj.set(colName, value);
        weddingObj.save(null, {
            success: function(point) {
                console.log(point);
                success();

            },
            error: function(point, error) {
                errors();
            }
        });
    },
    gotocommentPage: function() {
        $(":mobile-pagecontainer").pagecontainer("change", "comments.html", {
            showLoadMsg: false
        });
    }
};
