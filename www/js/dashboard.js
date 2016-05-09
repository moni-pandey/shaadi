var dashboardMethods = {
    showStoryBoard: function() {
        //To Show the Storyboard to the user
        $(":mobile-pagecontainer").pagecontainer("change", "storyboard.html", {
            showLoadMsg: false
        });
    },
    showEvents: function() {
        //To Show the Storyboard to the user
        $(":mobile-pagecontainer").pagecontainer("change", "event.html", {
            showLoadMsg: false
        });
        /*cm.showToast("Coming soon");*/
    },
    showGallery: function() {
        //To Show the Storyboard to the user
        $(":mobile-pagecontainer").pagecontainer("change", "gallery.html", {
            showLoadMsg: false
        });
    },
    showManager: function() {
        //To Show Manage Page to the Host
        $(":mobile-pagecontainer").pagecontainer("change", "manage.html", {
            showLoadMsg: false
        });
    },	
    showWeddingCard: function() {
        //To Show Manage Page to the Host
        $(":mobile-pagecontainer").pagecontainer("change", "card_List.html", {
            showLoadMsg: false
        });
    },    budgetCard: function() {
        //To Show Manage Page to the Host
        $(":mobile-pagecontainer").pagecontainer("change", "budget_wedding.html", {
            showLoadMsg: false
        });
    },
    showContact: function(normalOrOutstation) {
        //To Show Contacts page
        console.warn("normalOrOutstation:"+normalOrOutstation);
        localStorage.normalOrOutstation = normalOrOutstation;
        localStorage.fromOSGPage=false; // set a flag so after adding contacts it will be taken to contacts page
        $(":mobile-pagecontainer").pagecontainer("change", "contacts.html", {
            showLoadMsg: false
        });
    },
    showContactForChat:function(){
        // To show list of friends contacts
        $(":mobile-pagecontainer").pagecontainer("change", "msgcontact.html", {
            showLoadMsg: false
        });
    },
	
	showTask:function(){
        // To show list of friends contacts
        $(":mobile-pagecontainer").pagecontainer("change", "all_task.html", {
            showLoadMsg: false
        });
    }


};

var manageMethods = {
    showAccomodationPage: function() {
        //To Show the Accomodation page
        $(":mobile-pagecontainer").pagecontainer("change", "accomodation.html", {
            showLoadMsg: false
        });
    },
    showCabPage: function() {
        // To Show the Cab page
        $(":mobile-pagecontainer").pagecontainer("change", "cab.html", {
            showLoadMsg: false
        });
    },
    showOSGListPage:function(){
        // To Show the Outstation guest page
        $(":mobile-pagecontainer").pagecontainer("change", "outstationguest.html", {
            showLoadMsg: false
        });
    },
    prepareManagePage: function() {
        // To Show and hide the necessary options based on the user type
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        if (weddingDetailsObject.usertype == "host") {
            $("#guestTravelAccommodationOptions").hide();
            $("#hostTravelAccommodationOptions").show();
            $("#managePageText").text("Manage");
        } else if (weddingDetailsObject.usertype == "guest") {
            $("#hostTravelAccommodationOptions").hide();
            $("#guestTravelAccommodationOptions").show();
            $("#managePageText").text("Travel & Accommodations");
        }
    }
};
