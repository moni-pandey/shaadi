var cm = {
    showAlert: function(alertMsg) {
        if (navigator.notification.alert)
            navigator.notification.alert(alertMsg, false, "Shaadi");
        else
            alert(alertMsg);
    },
    selectedDay: function(day) {
        var dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return dayArray[day];
    },
    selectedMonth: function(month) {
        var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthArray[month];
    },
    dateDiffCalc: function(foundDate) {
        console.warn("foundDate:" + foundDate);
        var date1 = moment(foundDate);
        var date2 = moment();
        /*var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        console.log("diffDays" + diffDays);*/
        var diffDays = date1.diff(date2, 'days');
        return diffDays;
    },
    dateFormatter: function(foundDate) {
        var day_date = foundDate.getDate();
        var year = foundDate.getFullYear();
        var month = foundDate.getMonth();
        return cm.selectedMonth(month) + " " + day_date + "," + year;
    },
    timeFormatter: function(foundDate) {
        var hours = foundDate.getHours();
        var minutes = foundDate.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    },
    dateValidator: function(selectedDate) {
        console.log("selectedDate" + selectedDate);
        var now = new Date(selectedDate);
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear() + "-" + (month) + "-" + (day);
        console.log("today" + today);
        return today;
    },
    isFuture: function(weddingDate) {
        // To Check whether the date is future or not
        var todayDate = moment();
        //var weddingDate = cm.dateFormatter(weddingDate);
        var weddingDate = moment(weddingDate);
        var noOfDaysDiff = weddingDate.diff(todayDate, "days");
        console.log("noOfDaysDiff:" + noOfDaysDiff);
        if (noOfDaysDiff >= 0)
            return false;
        else
            return true;
    },
    isCabStartDateValidate: function(cabStartDate, cabEndDate) {
        // To Check whether the start date is inbetween date and Wedding date
        /*var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var cabStartDateValidOrNot = moment(cabStartDate).isBetween(moment(), moment(weddingDetailsObject.dater));
        console.log("cabStartDateValidOrNot:" + cabStartDateValidOrNot);
        console.log("cabStartDate:" + cabStartDate + "moment():" + moment() + "dater:" + weddingDetailsObject.dater);
        if (cabStartDateValidOrNot)
            return false;
        else
            return true;*/
        /*var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var weddingDate = moment(weddingDetailsObject.formatedWeddingDate).startOf('day');
        var possibleCabStart = moment(weddingDate).subtract(10, 'days').startOf('day'); // Acc starts before 10 days of wedding date
        var possibleCabEnd = moment(weddingDate).add(10, 'days').endOf('day'); // Acc ends after 10 days of wedding date
        var cabStartDateValidity = moment(cabStartDate).isBetween(possibleCabStart, possibleCabEnd);*/
        var cabStartDateValidity = moment(cabStartDate).isSameOrBefore(moment(cabEndDate));
        return !cabStartDateValidity;
    },
    isCabEndDateValidate: function(cabEndDate, cabStartDate) {
        // To Check whether the start date is inbetween date and Wedding date
        /*var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var cabEndDateValidOrNot = moment(cabEndDate).isSameOrAfter(weddingDetailsObject.dater);

        if (cabEndDateValidOrNot)
            return false;
        else
            return true;*/
        /*var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var weddingDate = moment(weddingDetailsObject.formatedWeddingDate).startOf('day');
        var possibleCabEnd = moment(weddingDate).add(10, 'days').endOf('day'); // Event ends after 10 days of wedding date
        var accEndDateValidOrNot = moment(cabEndDate).isBetween(weddingDetailsObject.dater, possibleCabEnd);*/
        var accEndDateValidOrNot = moment(cabEndDate).isSameOrAfter(moment(cabStartDate));
        if (accEndDateValidOrNot)
            return false;
        else
            return true;
    },
    isAccStartDateValidate: function(accStartDate, accEndDate) {
        // To Check whether the start date is inbetween date and Wedding date
        /*var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var accStartDateValidOrNot = moment(accStartDate).isBetween(moment(), moment(weddingDetailsObject.dater));
        if (accStartDateValidOrNot)
            return false;
        else
            return true;*/

        /*var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var weddingDate = moment(weddingDetailsObject.formatedWeddingDate).startOf('day');
        var possibleAccStart = moment(weddingDate).subtract(10, 'days').startOf('day'); // Acc starts before 10 days of wedding date
        var possibleAccEnd = moment(weddingDate).add(10, 'days').endOf('day'); // Acc ends after 10 days of wedding date
        var accStartDateValidity = moment(accStartDate).isBetween(possibleAccStart, possibleAccEnd);*/
        var accStartDateValidity = moment(accStartDate).isSameOrBefore(moment(accEndDate));
        return !accStartDateValidity;
    },
    isAccEndDateValidate: function(accEndDate, accStartDate) {
        // To Check whether the start date is inbetween date and Wedding date
        /*var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var weddingDate = moment(weddingDetailsObject.formatedWeddingDate).startOf('day');
        var possibleAccEnd = moment(weddingDate).add(10, 'days').endOf('day'); // Event ends after 10 days of wedding date
        var accEndDateValidOrNot = moment(accEndDate).isBetween(weddingDetailsObject.dater, possibleAccEnd);*/
        var accEndDateValidOrNot = moment(accEndDate).isSameOrAfter(moment(accStartDate));
        if (accEndDateValidOrNot)
            return false;
        else
            return true;
    },
    isEventDateValid: function(eventDate) {
        // To check whether the event date is very close to Wedding date or not
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        var weddingDate = moment(weddingDetailsObject.formatedWeddingDate).startOf('day');
        var possibleEventStart = moment().startOf('day'); // Event can be  today 
        var possibleEventEnd = moment(weddingDate).add(30, 'days').endOf('day'); // Event can be held 30 days after  wedding date
        if (possibleEventStart.isSame(moment(eventDate)))
            return false;
        console.warn("possibleEventStart:" + possibleEventStart + "possibleEventEnd:" + possibleEventEnd);
        var dateEventValidity = moment(eventDate).isBetween(possibleEventStart, possibleEventEnd);
        return !dateEventValidity;
    },
    isWeddingOver: function(joinedWeddingDate) {
        // To check whether the joined wedding is over or not
        var todayDate = moment();
        var weddingDate = moment(joinedWeddingDate);
        var noOfDaysDiff = weddingDate.diff(todayDate, "days");
        console.log("noOfDaysDiff:" + noOfDaysDiff);
        if (noOfDaysDiff > 0)
            return false;
        else
            return true;
    },
    convertImgToBase64URL: function(imageUri) {
        /*var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            var canvas = document.createElement('imgCanvas'),
                ctx = canvas.getContext('2d'),
                dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null;
        };
        img.src = url;*/
        // alert("About to convert Image");
        var c = document.createElement('canvas');
        var ctx = c.getContext("2d");
        var img = new Image();
        img.onload = function() {
            c.width = this.width;
            c.height = this.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = imageUri;
        var dataURL = c.toDataURL("image/jpeg");
        return dataURL;
        /*window.plugins.Base64.encodeFile(imageUri, function(base64) {
            console.log('file base64 encoding: ' + base64);
            return base64;
        });*/
    },
    showToast: function(msg) {
        window.plugins.toast.show(msg, 'long', 'bottom', function(a) {
            console.log('toast success: ' + a)
        }, function(b) {
            alert('toast error: ' + b)
        });
    },
    parseInitializer: function() {
        console.log("Initializing parse");
        Parse.initialize("Nlv14hb32fwBopAVXMzF6LRq1kom5TVC2PGOGxVt", "apDFnCB6KyPxie54HxjRQQ4oCwRhFFM1D2TGylx7");
    },
    sleep: function(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    },
    isValidEmail: function(email) {
        // To check whether the mail is valid or not
        var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        var valid = emailReg.test(email);
        console.log("valid:" + valid);
        return !valid;

    },
    trimText: function(textToTrim, limit) {
        // To Trim characters of large length
        limit = limit || 25;
        if (textToTrim.length > limit) {
            var trimmedText = $.trim(textToTrim).substring(0, limit);
            return trimmedText + "...";
        } else return textToTrim;

    },
    handleBack: function() {
        // Disable Back button
        console.log("handleBack called");
        document.addEventListener("backbutton", function() {
            console.log("Disabled Back button");
            var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
            var activePageId = activePage[0].id;
            console.warn("activePageId:" + activePageId);
/*            switch (activePageId) {
                case 'first-page':
                    console.log("Enabled back");
                    break;
                case 'requestVerificationCode':
                    console.log("Disabled back");
                    break;
                case 'verifyCodePage':
                    history.back();
                    break;
                case 'dashboard':
                    history.back();
                    break;
                case 'weddingDetailsEdit':
                    console.log("Enabled back");
                    break;
                case 'eventsPage':
                    console.log("Enabled back");
                    break;
                case 'contactsPage':
                    console.log("Enabled back");
                    break;
                case 'galleryPage':
                    //cm.handleBack("true");
                    console.log("Enabled back");
                    break;
                case 'managePage':
                    //cm.handleBack("true");
                    console.log("Enabled back");
                    break;
                default:
            }*/
            /*   $(document).on("pagecontainershow", function() {
                   var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");

                   var activePageId = activePage[0].id;
                   switch (activePageId) {
                       case 'first-page':
                           //cm.handleBack("true");
                           console.log("Enabled back");
                           break;
                       case 'requestVerificationCode':
                           //cm.handleBack("true");
                           console.log("Enabled back");
                           break;
                       case 'verifyCodePage':
                           //cm.handleBack("true");
                           console.log("Enabled back");
                           break;
                       case 'dashboard':
                           //cm.handleBack("false");
                           backEvent.preventDefault();
                           break;
                       case 'weddingDetailsEdit':
                           //cm.handleBack("true");
                           console.log("Enabled back");
                           break;
                       case 'eventsPage':
                           //cm.handleBack("true");
                           console.log("Enabled back");
                           break;
                       case 'contactsPage':
                           //cm.handleBack("true");
                           console.log("Enabled back");
                           break;
                       case 'galleryPage':
                           //cm.handleBack("true");
                           console.log("Enabled back");
                           break;
                       case 'managePage':
                           //cm.handleBack("true");
                           console.log("Enabled back");
                           break;
                       default:
                   }
               });*/

        }, false);


        console.log("enableBack ended");

    },
    rateus() {
        // var customData = ""

        //  Apptentive.engage(cm.successCallback, cm.errorCallback, 'rateUS', customData);
        console.log('rate')
    },
    successCallback() {


    },
    errorCallback() {

        //Apptentive.showMessageCenter(cm.success, cm.errorCallback);
    },
    success() {


    }
};

cm.parseInitializer();
$(document).on("pageinit", "#loadTask, #AccommodationPage,#allotAccommodation,#allotCab,#cabPage,#cardfilter,#cardlistpage,#viewCard,#commentsPage,#friendsContactsPage,#contactsPage,#conversationPage,#eviewcard,#eventsPage,#eventsGuestPage,#faqPage,#favouritespages,#filterContactsPage,#filterlistpage,#galleryPage,#guest,#importContactPage,#managePage,#newGuestPage,#newHostPage,#newOSGuestPage,#newWeddingRegistration,#osguestRequestPage,#outstationGuestsPage,#pictureCommentsPage,#picturePage,#privacyPage,#pickContactPage,#sendToMe,#sendToself,#weddingDetailsEdit", function(event) {

    $("#shaadiMenu").on("panelopen", function(event, ui) {
        //setting overflow : hidden and binding "touchmove" with event which returns false
        //$('body').css("overflow", "hidden").on("touchmove", stopScroll);
    });

    $("#shaadiMenu").on("panelclose", function(event, ui) {
        //remove the overflow: hidden property. Also, remove the "touchmove" event. 
        $('body').css("overflow", "auto").off("touchmove");
    });

    function stopScroll() {
        $("#shaadiMenu").panel("close");
        //return false;
    }
    $(document).on("swiperight", "#budgetmod,#conversationPage,#groupconv, #friendsListPage,#breakup,#friendsListPage,#AccommodationPage,#allotAccommodation,#allotCab,#cabPage,#cardfilter,#cardlistpage,#viewCard,#commentsPage,#friendsContactsPage,#contactsPage,#conversationPage,#eviewcard,#eventsPage,#eventsGuestPage,#faqPage,#favouritespages,#filterContactsPage,#filterlistpage,#galleryPage,#guest,#importContactPage,#managePage,#newGuestPage,#newHostPage,#newOSGuestPage,#newWeddingRegistration,#osguestRequestPage,#outstationGuestsPage,#pictureCommentsPage,#picturePage,#privacyPage,#pickContactPage,#sendToMe,#sendToself,#weddingDetailsEdit", function(e) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ($.mobile.activePage.jqmData("panel") !== "open") {
            if (e.type === "swiperight") {
                console.log("swiperight detected");
                $("#shaadiMenu").panel("open");
            }
        }
    });
});
