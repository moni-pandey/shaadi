var searchOptions = {};
var loginMethods = {
    /*Cognalys methods*/
    getCognalysData: function() {
        //Informations needed for Cognalys Mobile verification is stored here
        var cognalysData = {
            appId: "3f0adca7d7ed4c46855888c",
            accessToken: "6f9aa136176d398ed1c01028c50bc306d6b027fd",
            otpData: {}
        };
        return cognalysData;
    },
    numberVerificatonExisting: function() {
        //To save the user as a existingUser(called while clicking Join Wedding button)
        localStorage.userType = "existingUser";
        $(":mobile-pagecontainer").pagecontainer("change", "verifyphone.html", {
            showLoadMsg: false
        });

    },
    numberVerificatonNew: function() {
        //To save the user as a existingUser(called while clicking New Wedding button)
        localStorage.userType = "newUser";
        $(":mobile-pagecontainer").pagecontainer("change", "verifyphone.html", {
            showLoadMsg: false
        });
    },
    requestNumberCode: function() {
        //To prompt user to enter his/her mobile number for verification
        mobileNumber = $('#mobileNumInput').intlTelInput("getNumber");
        var countryData = $("#mobileNumInput").intlTelInput("getSelectedCountryData");
        localStorage.userDialCode = countryData.dialCode;
        console.warn("countryData:" + countryData.dialCode)
        if (mobileNumber == '' || mobileNumber == null) {
            cm.showAlert("Enter Mobile Number");
        } else if (isNaN(mobileNumber)) {
            cm.showAlert("Enter a valid Number");
        } else if (!($("#mobileNumInput").intlTelInput("isValidNumber"))) {
            cm.showAlert("Enter a valid Number");
        } else {
            localStorage.autoGenOTP=Math.floor(Math.random()*90000) + 10000;
            var smsText = "Verification code for Shaadi app is "+localStorage.autoGenOTP; // sms text
            if (SMS && navigator.userAgent.match(/Android/i)) {
                // If SMS plugin is supported
                SMS.sendSMS(mobileNumber, smsText, function() {
                    /*$(":mobile-pagecontainer").pagecontainer("change", "verifycode.html", {
                        showLoadMsg: false
                    });
                    cm.showToast("Verifying your number..");*/
                    loginMethods.changeToVerifyCodePage(); // navigate to the verify code page
                    SMS.startWatch(function(success) {
                        // Wait for sms to arrive
                        document.addEventListener('onSMSArrive', function(e) { loginMethods.autoFillOtp(e) });
                        //cm.showToast("Verifying your number..");
                    }, function(error) {});
                }, function(str) {
                    cm.showAlert(str);
                });
            } else {
                // SMS plugin is not available so using social sharing plugin for sending sms
                if (device.isVirtual) {
                    // If the app is running in simulator
                    loginMethods.changeToVerifyCodePage(); // navigate to verify code page
                    $('#otpBox').val(localStorage.autoGenOTP);
                    // cm.showToast("Please enter your OTP");
                    return;
                }
                window.plugins.socialsharing.shareViaSMS(smsText, mobileNumber, function(msg) {
                    loginMethods.changeToVerifyCodePage(); // navigate to verify code page
                    cm.showToast("Please enter your OTP");
                }, function(msg) {
                    cm.showAlert("Sorry! Couldn't Verify your number");
                });
            }
            /*$("body").addClass("ui-loading");
            //Post the Mobile Number to get a missed call
            mobileNumber = mobileNumber.length == 10 ? "91" + mobileNumber : mobileNumber;
            var requestUrl = "https://www.cognalys.com/api/v1/otp/?app_id=" + loginMethods.getCognalysData().appId + "&access_token=" + loginMethods.getCognalysData().accessToken + "&mobile=" + mobileNumber;
            $.ajax({
                url: requestUrl,
                type: 'GET',
                dataType: "json",
                success: function(response) {
                    if (response.status == "success") {
                        //$.mobile.changePage("verifycode.html");
                        $(":mobile-pagecontainer").pagecontainer("change", "verifycode.html", {
                            showLoadMsg: false
                        });
                        localStorage.otpStart = response.otp_start;
                        localStorage.keymatch = response.keymatch;
                        $("body").removeClass("ui-loading");
                    }
                },
                error: function(error) {
                    cm.showAlert("Unable to verify your number");
                    $("body").removeClass("ui-loading");
                }
            });*/
        }
    },
    changeToVerifyCodePage: function() {
        // Method to change to Verify code page
        $(":mobile-pagecontainer").pagecontainer("change", "verifycode.html", {
            showLoadMsg: false
        });
        cm.showToast("Verifying your number..");
    },
    autoFillOtp: function(e) {
        //Fill the starting 5 digits of the Missed call which has been received
        var smsData = e.data;
        $("#otpBox").val((smsData.body).replace(/^\D+/g, ''));
        loginMethods.verifyNumber();
    },
    verifyNumber: function() {
        if ($('#otpBox').val() == localStorage.autoGenOTP) {
            cm.showToast("Verified your mobile number");
            if (SMS) SMS.stopWatch(function() {}, function() {});
            localStorage.userMobile = parseInt(mobileNumber);
            loginMethods.checkUserPriv();
        } else {
            cm.showAlert("Please enter a valid OTP");
        }
        /*        if ($('#otpBox').val().length >= 11) {
                    $("body").addClass("ui-loading");
                    //Post the completed number(Missed call number) to verify the mobile number
                    var requestUrl = "https://www.cognalys.com/api/v1/otp/confirm/?app_id=" + loginMethods.getCognalysData().appId + "&access_token=" + loginMethods.getCognalysData().accessToken + "&keymatch=" + localStorage.getItem('keymatch') + "&otp=" + $("#otpBox").val();
                    $.ajax({
                        url: requestUrl,
                        type: 'GET',
                        dataType: "json",
                        success: function(response) {
                            //cm.showAlert(JSON.stringify(response))
                            if (response.status == "success") {
                                cm.showToast("Verified your mobile number");
                                $("body").removeClass("ui-loading");
                                localStorage.userMobile = parseInt(mobileNumber);
                                //app.verifyCode();
                                loginMethods.checkUserPriv();
                               

                            } else {
                                cm.showAlert("Unable to verify your number");
                                $("body").removeClass("ui-loading");
                            }


                        },
                        error: function(error) {
                            cm.showAlert(error);
                            $("body").removeClass("ui-loading");
                        }
                    });
                } else {
                    cm.showAlert("Please enter the number from which you have got missed call from");
                    $("body").removeClass("ui-loading");
                }*/

    },
    checkUserPriv: function() {
        //Check the user type either Host/Guest
        if (localStorage.userType == "existingUser") {
            var hostClass = Parse.Object.extend("Host");
            var hostObj = new Parse.Query(hostClass);
            //If Existing User check in the Host class for his/her number and if it is make him a Host
            hostObj.equalTo('mobileNo', parseInt(localStorage.userMobile));
            hostObj.find({
                success: function(results) {
                    if (results.length >= 1) {
                        localStorage.userPriv = "host";
                        $(":mobile-pagecontainer").pagecontainer("change", "socialweddings.html", {
                            showLoadMsg: false
                        });
                    } else if (results.length == 0) {
                        //If his Number is not in Host class make him/her a guest
                        localStorage.userPriv = "guest"
                        $(":mobile-pagecontainer").pagecontainer("change", "socialweddings.html", {
                            showLoadMsg: false
                        });
                    }
                }
            });
        } else if (localStorage.userType == "newUser") {
            //Whenever a user clicks New Wedding Button he is going to be a New User and Host of a wedding
            localStorage.userPriv = "host";
            $(":mobile-pagecontainer").pagecontainer("change", "newweddingregister.html", {
                showLoadMsg: false
            });
        }
    }
};
