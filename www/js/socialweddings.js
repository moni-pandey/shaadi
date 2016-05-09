var noWeddings = 0;
var socialWeddingMethods = {
    //Array to store the WeddingId's available for the user
    weddingDetailsArray: [], // array to hold wedding details
    weddingIdArray: [],
    counter: 0,
    gatherHostWeddingIds: function() {
        //To Gather the wedding id's for the logged in user from Host or Guest Class
        socialWeddingMethods.weddingIdArray.length = 0;
        // if (localStorage.userPriv == "host") {
        var hostClass = Parse.Object.extend("Host");
        var queryHost = new Parse.Query(hostClass);
        queryHost.equalTo('mobileNo', localStorage.userMobile);
        $("body").addClass("ui-loading");
        queryHost.find({
            success: function(foundHosts) {
                if (foundHosts.length > 0) {
                    for (var i = 0; i < foundHosts.length; i++) {
                        var rowObject = foundHosts[i];

                        socialWeddingMethods.weddingIdArray.push(rowObject.get('weddingID'));
                    }
                    //$("body").removeClass("ui-loading");

                    socialWeddingMethods.gatherGuestWeddingIds();
                    // socialWeddingMethods.fetchWeddingsForHostorGuest(socialWeddingMethods.weddingIdArray);
                } else socialWeddingMethods.gatherGuestWeddingIds();
            },
            error: function(hostError) {

            }
        });

    },
    gatherGuestWeddingIds: function() {
        var guestClass = Parse.Object.extend("Guest");
        //var guestObj = new guestClass();
        var queryGuest = new Parse.Query(guestClass);
        queryGuest.equalTo('mobileNo', localStorage.userMobile);
        queryGuest.find({
            success: function(foundGuests) {
                if (foundGuests.length > 0) {
                    for (var i = 0; i < foundGuests.length; i++) {
                        var rowObject = foundGuests[i];

                        socialWeddingMethods.weddingIdArray.push(rowObject.get('weddingID'));
                    }
                    socialWeddingMethods.getWeddingDetails(socialWeddingMethods.weddingIdArray);
                } else socialWeddingMethods.getWeddingDetails(socialWeddingMethods.weddingIdArray);
            },
            error: function(guestError) {

            }
        });
    },
    getWeddingDetails: function(weddingIdArray) {
        // To get the wedding details
        noWeddings = weddingIdArray.length;
        var weddingClass = Parse.Object.extend("Wedding");
        var queryWedding = new Parse.Query(weddingClass);
        queryWedding.equalTo('weddingID', socialWeddingMethods.weddingIdArray[socialWeddingMethods.counter]);
        queryWedding.find().then(function(foundWeddings) {
            if (foundWeddings.length > 0) {
                var rowObject = foundWeddings[0];
                var dateOfWedding = rowObject.get('dateOfWedding');
                var weddingObj = {};
                weddingObj.wedId = rowObject.get('weddingID'); // wedding id
                weddingObj.dateOfWedding = rowObject.get('dateOfWedding'); // Unformatted wedding date
                weddingObj.diffDays = cm.dateDiffCalc(weddingObj.dateOfWedding); // No. of days differences
                console.warn("weddingObj.diffdays:" + weddingObj.diffDays);
                weddingObj.dayAndTime = moment(dateOfWedding).format('ddd,MMM Do,YYYY'); // formatted wedding date
                weddingObj.coupleName = rowObject.get('groomName') + ' & ' + rowObject.get('brideName'); // couple name
                weddingObj.weddingDate = moment(dateOfWedding).format('MMM,Do'); // Formatted wedding date and Month
                weddingObj.imageFile = rowObject.get('coverPic'); // coverpic 
                socialWeddingMethods.weddingDetailsArray.push(weddingObj); // push the wedding object to array
                socialWeddingMethods.counter++;
                if (socialWeddingMethods.counter < noWeddings)
                    socialWeddingMethods.getWeddingDetails(weddingIdArray);
                else socialWeddingMethods.sortWeddings();
            } else {
                socialWeddingMethods.counter++;
                if (socialWeddingMethods.counter < noWeddings)
                    socialWeddingMethods.getWeddingDetails(weddingIdArray);
                else socialWeddingMethods.sortWeddings();

            }
        });
    },checkWeddingCount:function(){
        // To check whether only one wedding exist or having multiple
        if(socialWeddingMethods.weddingDetailsArray.length==1){
            console.warn("only one wedding found:"+socialWeddingMethods.weddingDetailsArray[0].wedId);
            localStorage.joinedWedding=socialWeddingMethods.weddingDetailsArray[0].wedId;
            socialWeddingMethods.selectWedding();
        }else socialWeddingMethods.sortWeddings();
    },
    sortWeddings: function() {
        // To sort the array of weddings based on date of wedding

        socialWeddingMethods.weddingDetailsArray.sort(function(a, b) {
            a = new Date(a.dateOfWedding);
            b = new Date(b.dateOfWedding);
            return a > b ? -1 : a < b ? 1 : 0;
        });

        socialWeddingMethods.printWeddings();
    },
    printWeddings: function() {
        // To print the list of weddings in sorted order
        var weddingArrayLength = socialWeddingMethods.weddingDetailsArray.length;
        if (weddingArrayLength > 0) {
            var weddingHtml = '';
            for (var i = 0; i < weddingArrayLength; i++) {
                var weddingDetObj = socialWeddingMethods.weddingDetailsArray[i];
                var vDate = weddingDetObj.dateOfWedding.getTime();
                var today = new Date().getTime();
                var imageFile = weddingDetObj.imageFile;
                var imageHtml = '';
                if (imageFile == '' || imageFile == undefined || imageFile == 'undefined') {
                    imageFile = './img/create-new.png';
                    imageHtml = '<img height="60px" width="60px" class="roundrect" src="' + imageFile + '" alt="">';
                } else {
                    imageFile = "data:image/jpeg;base64," + imageFile;
                    imageHtml = '<img height="60px" width="60px" class="roundrect" src="' + imageFile + '">';
                }
                if (vDate < today) {
                    // This is an old wedding
                    weddingHtml += '<div class="social-wedding-list" data-wid="' + weddingDetObj.wedId + '" \
                                                                    data-diffDays="' + weddingDetObj.diffDays + '"  data-dater="' + weddingDetObj.dayAndTime + '" data-name="' + weddingDetObj.coupleName + '" data-weddingdate="' + weddingDetObj.dateOfWedding + '" data-wdt="' + weddingDetObj.weddingDate + '"data-status="before" data-img="' + imageFile + '"onclick="socialWeddingMethods.selectWedding(this)">'; // Wedding Listitem container start
                    weddingHtml += '<div class="wedding-list-left past-checked-list">'; // Wedding details div start
                    weddingHtml += '<div class="social-profile-img">'; // Wedding Cover picture div start
                    weddingHtml += imageHtml;
                    weddingHtml += '<div class="seen-status">'; // Wedding Status div start
                    weddingHtml += '<span class="seen-past">' + weddingDetObj.weddingDate + '</span>'; // Status span for past
                    weddingHtml += '</div>'; // Wedding Status div end
                    weddingHtml += '</div>'; // Wedding Cover picture div end
                    weddingHtml += '<div class="social-profile-details">'; // Wedding info div start
                    weddingHtml += '<div class="social-subtitle" style="display:none"></div>'; // Wedding sub title
                    weddingHtml += '<div class="profile-name">' + cm.trimText(weddingDetObj.coupleName, 14) + '</div>'; // Couples name
                    weddingHtml += '<div class="profile-dateofbirth">' + weddingDetObj.dayAndTime + '</div>'; // Wedding Date
                    weddingHtml += '</div>'; // Wedding info div end
                    weddingHtml += '</div>'; // Wedding details div end
                    var checkOrNot = localStorage.joinedWedding == weddingDetObj.wedId ? "checked" : "";
                    weddingHtml += '<div class="wedding-list-right">'; // Wedding Checkbox div start
                    weddingHtml += '<label><input ' + checkOrNot + ' name="checkbox-0 " type="radio" data-wid="' + weddingDetObj.wedId + '" \
                                                                    data-diffDays="' + weddingDetObj.diffDays + '"  data-dater="' + weddingDetObj.dayAndTime + '" data-name="' + weddingDetObj.coupleName + '" data-weddingdate="' + weddingDetObj.dateOfWedding + '" data-wdt="' + weddingDetObj.weddingDate + '"data-status="before" data-img="' + imageFile + '"onclick="socialWeddingMethods.selectWedding(this)"></label>'; // Checkbox
                    weddingHtml += '</div>'; // Wedding Checkbox div end 
                    weddingHtml += '</div>'; // Wedding Listitem container end
                } else {
                    //This marriage yet to happen
                    var dayOrDays = weddingDetObj.diffdays == 1 ? "Day" : "Days";
                    weddingHtml += '<div class="social-wedding-list" data-wid="' + weddingDetObj.wedId + '" \
                                                                    data-diffDays="' + weddingDetObj.diffDays + '"  data-dater="' + weddingDetObj.dayAndTime + '" data-name="' + weddingDetObj.coupleName + '" data-weddingdate="' + weddingDetObj.dateOfWedding + '" data-wdt="' + weddingDetObj.weddingDate + '" data-status="left" data-img="' + imageFile + '"onclick="socialWeddingMethods.selectWedding(this)">'; // Wedding Listitem container start
                    weddingHtml += '<div class="wedding-list-left checked-list">'; // // Wedding details div start
                    weddingHtml += '<div class="social-profile-img">'; // Wedding Cover picture div start
                    weddingHtml += imageHtml;
                    weddingHtml += '<div class="seen-status">'; // Wedding Status div start
                    weddingHtml += '<span class="seen-date">' + weddingDetObj.diffDays + '</span>'; // No. of days left span
                    weddingHtml += '<span class="seen-day">' + dayOrDays + ' Left</span>'; // Days Left span
                    weddingHtml += '</div>'; // Wedding Status div end
                    weddingHtml += '</div>'; // Wedding Cover picture div end
                    weddingHtml += '<div class="social-profile-details">'; // Wedding info div start
                    weddingHtml += '<div class="social-subtitle"></div>'; // Wedding sub title
                    weddingHtml += '<div class="profile-name">' + cm.trimText(weddingDetObj.coupleName, 14) + '</div>'; // Couples name
                    weddingHtml += '<div class="profile-dateofbirth">' + weddingDetObj.dayAndTime + '</div>'; // Wedding Date
                    weddingHtml += '</div>'; // Wedding info div end
                    weddingHtml += '</div>'; //  Wedding details div end
                    weddingHtml += '<div class="wedding-list-right">'; // Wedding Checkbox div start
                    var checkOrNot = localStorage.joinedWedding == weddingDetObj.wedId ? "checked" : "";
                    weddingHtml += '<label><input ' + checkOrNot + ' name="checkbox-0 " type="radio" data-wid="' + weddingDetObj.wedId + '" \
                                                                    data-diffDays="' + weddingDetObj.diffDays + '"  data-dater="' + weddingDetObj.dayAndTime + '" data-name="' + weddingDetObj.coupleName + '" data-weddingdate="' + weddingDetObj.dateOfWedding + '" data-wdt="' + weddingDetObj.weddingDate + '" data-status="left" data-img="' + imageFile + '"onclick="socialWeddingMethods.selectWedding(this)"></label>'; // Checkbox
                    weddingHtml += '</div>'; // Wedding Checkbox div end
                    weddingHtml += '</div>'; // Wedding Listitem container end

                }
            }
            $("#weddingList").html(weddingHtml).trigger("create"); //.listview("refresh").trigger("create")
            if($(".social-wedding-list").length==1)
                $(".social-wedding-list").trigger("click");
            navigator.splashscreen.hide();
            $("body").removeClass("ui-loading");
        } else {
            navigator.splashscreen.hide();
            cm.showToast("You are not having any active Wedding Invites");
            $("body").removeClass("ui-loading");
        }
    },
    fetchWeddingsForHostorGuest: function(weddingIdArray) {
        //To Print the Wedding List in the page for both Host and Guest
        socialWeddingMethods.weddingDetailsArray.length = 0; // Empty the wedding detail array
        noWeddings = weddingIdArray.length;
        if (weddingIdArray.length > 0) {
            var weddingHtml = '';
            var weddingClass = Parse.Object.extend("Wedding");
            var queryWedding = new Parse.Query(weddingClass);
            for (var i = 0; i < weddingIdArray.length; i++) {
                //For all the WeddingId's in the Array check with the Wedding Table
                console.warn(i + ":" + weddingIdArray[i]);
                queryWedding.equalTo('weddingID', weddingIdArray[i]);
                queryWedding.descending("dateOfWedding");
                $("body").addClass("ui-loading");
                queryWedding.find({
                    success: function(foundWeddings) {
                        //For the matching WeddingId's print them in the page
                        if (foundWeddings.length > 0) {
                            //If We have atleast one Marriage
                            for (var i = 0; i < foundWeddings.length; i++) {
                                var rowObject = foundWeddings[i];
                                var dateOfWedding = rowObject.get('dateOfWedding');
                                var weddingObj = {};
                                weddingObj.wedId = rowObject.get('weddingID'); // wedding id
                                weddingObj.dateOfWedding = rowObject.get('dateOfWedding'); // Unformatted wedding date
                                weddingObj.diffdays = cm.dateDiffCalc(dateOfWedding); // No. of days differences
                                weddingObj.dayAndTime = moment(dateOfWedding).format('ddd,MMM Do,YYYY'); // formatted wedding date
                                weddingObj.coupleName = rowObject.get('groomName') + ' & ' + rowObject.get('brideName'); // couple name
                                weddingObj.weddingDate = moment(dateOfWedding).format('MMM,Do'); // Formatted wedding date and Month
                                weddingObj.imageFile = rowObject.get('coverPic'); // coverpic 
                                socialWeddingMethods.weddingDetailsArray.push(weddingObj); // push the wedding object to array

                                var wedId = rowObject.get('weddingID');
                                // var userType=socialWeddingMethods.checkHostOrGuest(wedId);                                

                                var diffDays = cm.dateDiffCalc(dateOfWedding);
                                var day = cm.selectedDay(dateOfWedding.getDay());
                                var day_date = dateOfWedding.getDate();
                                var year = dateOfWedding.getFullYear();
                                var month = cm.selectedMonth(dateOfWedding.getMonth());
                                var vDate = dateOfWedding.getTime();
                                var today = new Date().getTime();
                                //var dayAndTime = day + "," + month + " " + day_date + "," + year;
                                var dayAndTime = moment(dateOfWedding).format('ddd,MMM Do,YYYY');
                                var coupleName = rowObject.get('groomName') + ' & ' + rowObject.get('brideName');
                                //var weddingDate = month + ',' + day_date;
                                var weddingDate = moment(dateOfWedding).format('MMM,Do');
                                var imageFile = rowObject.get('coverPic');
                                var imageHtml = '';
                                if (imageFile == '' || imageFile == undefined || imageFile == 'undefined') {
                                    imageFile = './img/create-new.png';
                                    imageHtml = '<img height="60px" width="60px" class="roundrect" src="' + imageFile + '" alt="">';
                                } else {
                                    imageFile = "data:image/jpeg;base64," + imageFile;
                                    imageHtml = '<img height="60px" width="60px" class="roundrect" src="' + imageFile + '">';
                                }
                                if (vDate < today) {
                                    //This Marriage got over
                                    weddingHtml += '<div class="social-wedding-list" data-wid="' + wedId + '" \
                                                                    data-diffDays="' + diffDays + '"  data-dater="' + dayAndTime + '" data-name="' + coupleName + '" data-weddingdate="' + dateOfWedding + '" data-wdt="' + weddingDate + '"data-status="before" data-img="' + imageFile + '"onclick="socialWeddingMethods.selectWedding(this)">'; // Wedding Listitem container start
                                    weddingHtml += '<div class="wedding-list-left past-checked-list">'; // Wedding details div start
                                    weddingHtml += '<div class="social-profile-img">'; // Wedding Cover picture div start
                                    weddingHtml += imageHtml;
                                    weddingHtml += '<div class="seen-status">'; // Wedding Status div start
                                    weddingHtml += '<span class="seen-past">Past</span>'; // Status span for past
                                    weddingHtml += '</div>'; // Wedding Status div end
                                    weddingHtml += '</div>'; // Wedding Cover picture div end
                                    weddingHtml += '<div class="social-profile-details">'; // Wedding info div start
                                    weddingHtml += '<div class="social-subtitle" style="display:none"></div>'; // Wedding sub title
                                    weddingHtml += '<div class="profile-name">' + cm.trimText(coupleName) + '</div>'; // Couples name
                                    weddingHtml += '<div class="profile-dateofbirth">' + day + ',' + month + day_date + ',' + year + '</div>'; // Wedding Date
                                    weddingHtml += '</div>'; // Wedding info div end
                                    weddingHtml += '</div>'; // Wedding details div end
                                    weddingHtml += '<div class="wedding-list-right">'; // Wedding Checkbox div start
                                    weddingHtml += '<label><input name="checkbox-0 " type="radio" data-wid="' + wedId + '" \
                                                                    data-diffDays="' + diffDays + '"  data-dater="' + dayAndTime + '" data-name="' + coupleName + '" data-weddingdate="' + dateOfWedding + '" data-wdt="' + weddingDate + '"data-status="before" data-img="' + imageFile + '"onclick="socialWeddingMethods.selectWedding(this)"></label>'; // Checkbox
                                    weddingHtml += '</div>'; // Wedding Checkbox div end 
                                    weddingHtml += '</div>'; // Wedding Listitem container end
                                } else {
                                    //This marriage yet to happen
                                    weddingHtml += '<div class="social-wedding-list" data-wid="' + wedId + '" \
                                                                    data-diffDays="' + diffDays + '"  data-dater="' + dayAndTime + '" data-name="' + coupleName + '" data-weddingdate="' + dateOfWedding + '" data-wdt="' + weddingDate + '" data-status="left" data-img="' + imageFile + '"onclick="socialWeddingMethods.selectWedding(this)">'; // Wedding Listitem container start
                                    weddingHtml += '<div class="wedding-list-left checked-list">'; // // Wedding details div start
                                    weddingHtml += '<div class="social-profile-img">'; // Wedding Cover picture div start
                                    weddingHtml += imageHtml;
                                    weddingHtml += '<div class="seen-status">'; // Wedding Status div start
                                    weddingHtml += '<span class="seen-date">' + diffDays + '</span>'; // No. of days left span
                                    weddingHtml += '<span class="seen-day">Days Left</span>'; // Days Left span
                                    weddingHtml += '</div>'; // Wedding Status div end
                                    weddingHtml += '</div>'; // Wedding Cover picture div end
                                    weddingHtml += '<div class="social-profile-details">'; // Wedding info div start
                                    weddingHtml += '<div class="social-subtitle"></div>'; // Wedding sub title
                                    weddingHtml += '<div class="profile-name">' + coupleName + '</div>'; // Couples name
                                    weddingHtml += '<div class="profile-dateofbirth">' + day + ',' + month + day_date + ',' + year + '</div>'; // Wedding Date
                                    weddingHtml += '</div>'; // Wedding info div end
                                    weddingHtml += '</div>'; //  Wedding details div end
                                    weddingHtml += '<div class="wedding-list-right">'; // Wedding Checkbox div start
                                    var checkOrNot = localStorage.joinedWedding == wedId ? "checked" : "";
                                    weddingHtml += '<label><input ' + checkOrNot + ' name="checkbox-0 " type="radio" data-wid="' + wedId + '" \
                                                                    data-diffDays="' + diffDays + '"  data-dater="' + dayAndTime + '" data-name="' + coupleName + '" data-weddingdate="' + dateOfWedding + '" data-wdt="' + weddingDate + '" data-status="left" data-img="' + imageFile + '"onclick="socialWeddingMethods.selectWedding(this)"></label>'; // Checkbox
                                    weddingHtml += '</div>'; // Wedding Checkbox div end
                                    weddingHtml += '</div>'; // Wedding Listitem container end

                                }
                            }
                            $("#weddingList").html(weddingHtml).trigger("create"); //.listview("refresh").trigger("create")
                            console.warn("weddingDetailsArray:" + socialWeddingMethods.weddingDetailsArray);
                            $("body").removeClass("ui-loading");
                        } else {
                            cm.showToast("Sorry!No Weddings available for you");
                            $("body").removeClass("ui-loading");
                        }
                        console.log("Got a final call");
                    },
                    error: function(weddingError) {
                        cm.showAlert("Sorry!Couldn't List the Weddings");
                        $("body").removeClass("ui-loading");
                    }
                });

            }
        } else {
            cm.showToast("Sorry!No Weddings available for you");
            $("body").removeClass("ui-loading");
        }

    },
    selectWedding: function(selectedWedding) {
        // To Select a Wedding Directly from the wedding List
    /*    console.warn("selectedWedding:"+selectedWedding+"Type:"+typeof selectedWedding);
        if(typeof selectedWedding=="undefined"){
            $("body").removeClass("ui-loading");
            return;
        }*/
        localStorage.joinedWedding = $(selectedWedding).data('wid');
        console.log(localStorage.joinedWedding);
        if ($(selectedWedding).data('status') == "before")
        // cm.showAlert("Sorry!This wedding is over you cannot Join now");
            socialWeddingMethods.showWeddingDetails(selectedWedding, "storyboard");
        else {
            /* navigator.notification.confirm(
                 'Are you sure do you want to join this wedding?', // message
                 function(buttonIndex) {
                     if (buttonIndex == 1) {
                         $('.square-radio').css("background-color", '#a1a1a1');
                         $(selectedWedding).css("background-color", 'red');
                         socialWeddingMethods.showWeddingDetails(selectedWedding, "dashboard");
                     } else console.log("You are not joining this wedding");
                 }, // callback to invoke with index of button pressed
                 'Join Wedding', // title
                 ['Yes', 'No'] // buttonLabels
             );*/
            socialWeddingMethods.showWeddingDetails(selectedWedding, "storyboard");
        }

    },
    showWeddingDetails: function(selectedWedding, pageName) {
        /*var img = $(selectedWedding).data('img');
var weddingId = $(selectedWedding).data('wid');
var weddingDate = $(selectedWedding).data('wdt');
var userPhoneno = $(selectedWedding).data('phno');
var numberOfDaysLeft = $(selectedWedding).data('diffdays');
var brideAndGroomName = $(selectedWedding).data('name');*/

        weddingDetailsObject = new Object();
        weddingDetailsObject.img = $(selectedWedding).data('img');
        weddingDetailsObject.weddingDate = $(selectedWedding).data('wdt');
        weddingDetailsObject.numberOfDaysLeft = $(selectedWedding).data('diffDays');
        weddingDetailsObject.brideAndGroomName = $(selectedWedding).data('name');
        weddingDetailsObject.weddingId = $(selectedWedding).data('wid');
        weddingDetailsObject.status = $(selectedWedding).data('status');
        weddingDetailsObject.diffDays = $(selectedWedding).data('diffdays');
        weddingDetailsObject.dater = $(selectedWedding).data('dater');
        weddingDetailsObject.formatedWeddingDate = $(selectedWedding).data('weddingdate');
        socialWeddingMethods.checkHostOrGuest(weddingDetailsObject.weddingId);
        pageName = pageName == undefined ? "socialweddingdetail" : pageName;
        localStorage.weddingDetailsObject = JSON.stringify(weddingDetailsObject);
        $(":mobile-pagecontainer").pagecontainer("change", pageName + ".html", {
            showLoadMsg: false
        });
    },
    takeToAddWeddingPage: function() {
        // To Take the user to Add Wedding page
        $(":mobile-pagecontainer").pagecontainer("change", "newweddingregister.html", {
            showLoadMsg: false
        });
    },
    checkHostOrGuest: function(weddingId) {
        console.warn("Inside Host Checker");
        var hostClass = Parse.Object.extend("Host");
        var queryHost = new Parse.Query(hostClass);
        queryHost.equalTo('mobileNo', localStorage.userMobile);
        queryHost.equalTo('weddingID', weddingId);
        queryHost.find({
            success: function(foundHosts) {
                if (foundHosts.length > 0) {
                    for (var i = 0; i < foundHosts.length; i++) {
                        var rowObject = foundHosts[i];
                        console.log("rowObject.get('weddingID') " + rowObject.get('weddingID'));
                        if (rowObject.get("weddingID") == weddingId) {
                            console.log("Host man");
                            weddingDetailsObject.usertype = "host";
                            localStorage.taskusertype = "host";
                            weddingDetailsObject.relation = rowObject.get("relationToBrideGroom");
                            localStorage.weddingDetailsObject = JSON.stringify(weddingDetailsObject);
                            localStorage.userId = rowObject.get("hostID");
                            localStorage.userName = rowObject.get("hostName");
							
                            localStorage.brideorgroomside = rowObject.get("brideOrGroomSide");
                            rowObject.set("status", "Attending");
                            rowObject.save();
                            //break;
                        }
                    }

                } else {
                    console.warn("Inside Guest Checker");
                    weddingDetailsObject.usertype = "guest";
                    var guestClass = Parse.Object.extend("Guest");
                    var queryGuest = new Parse.Query(guestClass);
                    queryGuest.equalTo('mobileNo', localStorage.userMobile);
                    queryGuest.equalTo('weddingID', weddingId);
                    queryGuest.find({
                        success: function(foundGuests) {
                            if (foundGuests.length > 0) {
                                for (var i = 0; i < foundGuests.length; i++) {
                                    var rowObject = foundGuests[i];
                                    console.warn("foundGuests[i]:" + foundGuests[i]);
                                    if (rowObject.get("weddingID") == weddingId) {
                                        console.log("Guest man");
                                        weddingDetailsObject.usertype = "guest";
                                        localStorage.taskusertype = "guest";
                                        localStorage.weddingDetailsObject = JSON.stringify(weddingDetailsObject);
                                        localStorage.userId = rowObject.get("guestID");
                                        localStorage.userName = rowObject.get("guestName");
                                        rowObject.set("status", "Attending");
                                        rowObject.save();
                                        //break;
                                    }
                                }
                            }
                        },
                        error: function(guestError) {

                        }
                    })
                }
                console.log("weddingDetailsObject.usertype" + weddingDetailsObject.usertype);

            },
            error: function(hostError) {

            }
        });
        console.log("weddingDetailsObject.usertype" + weddingDetailsObject.usertype);
    },
    changeToStoryBoard: function() {
        localStorage.joinedWedding = weddingDetailsObject.weddingId;
        console.log(localStorage.joinedWedding);
        $(":mobile-pagecontainer").pagecontainer("change", "storyboard.html", {
            showLoadMsg: false
        });
    }
};
