var commentsMethods = {
    /*getCommenterNameFromHost: function(commenterId) {
        //To Find the Name of the commenter from Host class
        alert(commenterId);
        var hostClass = Parse.Object.extend("Host");
        var queryHost = new Parse.Query(hostClass);
        var hostCommenterName;
        queryHost.equalTo('hostID', commenterId);
        queryHost.find({
            success: function(foundHosts) {
                alert("foundHosts" + foundHosts);
                if (foundHosts.length > 0) {
                    for (var i = 0; i < foundHosts.length; i++) {
                        hostCommenterName = foundHosts[i].get("hostName");
                    }
                    return hostCommenterName;
                    console.log("hostCommenterName" + hostCommenterName);
                }
                alert("getCommenterNameFromHostSuccess");
            },
            error: function(hostErrors) {
                alert(hostErrors);
            }
        });
    },
    getCommenterNameFromGuest: function(commenterId) {
        //To Find the Name of the commenter from Guest class
        var guestClass = Parse.Object.extend("Guest");
        var queryGuest = new Parse.Query(guestClass);
        var guestCommenterName;
        queryGuest.equalTo('guestID', commenterId);
        queryGuest.find({
            success: function(foundGuests) {
                if (foundGuests.length > 0) {
                    for (var i = 0; i < foundGuests.length; i++) {
                        guestCommenterName = foundGuests[i].get("guestName");
                    }
                    return guestCommenterName;
                }
            },
            error: function(hostErrors) {

            }
        });
    },*/
    manageCommentsPage:function(){
        // To handle the Add comment option based on user relation type
         var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        if(weddingDetailsObject.relation=="Bride" || weddingDetailsObject.relation=="Groom")
            $("#addCommentBlock").hide(); // Hide the add Comment block if the logged user is a Bride or Groom
        else console.warn("No Change Needed I am not a Bride/Groom");

    },
    fetchComments: function() {
        //To List the comments from the wishCouple class
        var wishClass = Parse.Object.extend("WishCouple");
        var wishQuery = new Parse.Query(wishClass);
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        wishQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
        $("body").addClass("ui-loading");
        wishQuery.find({
            success: function(commentResults) {
                var commentsHtml = '';
                $("#noOfComments").text(commentResults.length);
                console.log("commentResults.length:" + commentResults.length);
                if (commentResults.length > 0) {
                    for (var i = 0; i < commentResults.length; i++) {
                        //var commenterName;
                        var rowObject = commentResults[i];
                        /*if (rowObject.get("addedByHost") != "" || rowObject.get("addedByHost") != undefined) {
                            commenterName = commentsMethods.getCommenterNameFromHost(rowObject.get("addedByHost"));
                        } else {
                            commenterName = commentsMethods.getCommenterNameFromGuest(rowObject.get("addedByGuest"));
                        }*/
                        var visibilityOfDelete = "none";

                        
                        if (weddingDetailsObject.usertype == "guest") {
                            if (localStorage.userId == rowObject.get("addedByGuest"))
                                visibilityOfDelete = "block";
                            else
                                visibilityOfDelete = "none";
                        } else if (weddingDetailsObject.usertype == "host")
                            visibilityOfDelete = "block";


                        var dateObj = weddingDetailsObject.formatedWeddingDate;
                        var date1 = rowObject.get('addedDateTime');
                        var date2 = new Date();
                        var timeStart = rowObject.get('addedDateTime').getTime();
                        var timeEnd = new Date().getTime();
                        var hourDiff = timeEnd - timeStart; //in ms
                        var secDiff = hourDiff / 1000; //in s
                        var minDiff = hourDiff / 60 / 1000; //in minutes
                        var hDiff = hourDiff / 3600 / 1000; //in hours
                        var humanReadable = {};
                        humanReadable.hours = Math.floor(hDiff);
                        humanReadable.minutes = minDiff - 60 * humanReadable.hours;
                        // var datetime = humanReadable.hours + ':' + Math.round(humanReadable.minutes);

                        var concatenatedDate = cm.dateFormatter(date1) + " " + date1.getHours() + ":" + date1.getMinutes();
                        console.log("concatenatedDate:" + concatenatedDate);
                        var datetime = moment(moment(concatenatedDate)).fromNow(); // Using Moments to find the Time Ago
                        commentsHtml += '<div class="single-chat">'; // Wishblock start
                        commentsHtml += '<div class="pfile">'; // Profile pic block start
                        commentsHtml += '<img src="img/no-pic.png" width="50" height="50">'
                        commentsHtml += '</div>'; // Profile pic block end
                        commentsHtml += '<div class="pchat">'; // Wish details block start
                        commentsHtml += '<div class="pname">' + rowObject.get('commenterName') + '</div>'; // Wisher name start & End
                        commentsHtml += '<div class="pcomment">' + rowObject.get('comment'); // Wish message block start
                        commentsHtml += '<div class="poststatus">' + datetime + '</div>'; // Wished Time start and end
                        commentsHtml += '<div class="arrowleft"></div>'; // Wished Left arrow
                        commentsHtml += '<div class="pclose" style="display:'+visibilityOfDelete+'" data-wishid='+ rowObject.get('wishID') +' onclick="commentsMethods.deleteWish(this)"></div>'; // Wish delete button
                        commentsHtml += '</div>'; // Wish message block end
                        commentsHtml += '</div>'; // Wish details block end
                        commentsHtml += '</div>'; // Wishblock end
                        /*commentsHtml += '<div class="wishbubble">'; //Wishbubble start
                        commentsHtml += '<div class="ui-grid-a">'; //Grid-a start
                        commentsHtml += '<div class="ui-block-a" style="width:15%">'; //Block-a start
                        commentsHtml += '<img src="./assets/img/no-pic.png" alt="">';
                        commentsHtml += '</div>'; //Block-a end
                        commentsHtml += '<div class="ui-block-b" style="width:85%;padding-left:12px;">'; //Block-b start
                        commentsHtml += '<div class="dialogbox">'; //Dialogbox start will be used further
                        commentsHtml += '<div class="box">'; //Box div start
                        commentsHtml += '<span class="tip tip-left"></span>'; //Tip span
                        commentsHtml += '<div class="message">'; //Message div start
                        commentsHtml += '<div class="commentor-name">' + rowObject.get('commenterName'); //Commenter name start
                        commentsHtml += '<span class="comment-time">' + datetime + '</span>'; //Commented time
                        commentsHtml += '</div>'; //Commenter-name div end
                        commentsHtml += '<div class="comments-section">' + rowObject.get('comment'); //Comment text start
                        commentsHtml += '</div>'; //Comment text end
                        commentsHtml += '</div>'; //Message div end
                        commentsHtml += '</div>'; //Box div end
                        
                        commentsHtml += '</div>'; //Dialogbox Div end
                        commentsHtml += '</div>'; //Block-b end
                        commentsHtml += '</div>'; //Grid-a end
                        commentsHtml += '</div>'; //Wishbubble end*/
                    }
                    $("#commentlistid").html(commentsHtml);
                    $("body").removeClass("ui-loading");
                } else {
                    $("#commentlistid").html("");
                    $("body").removeClass("ui-loading");
                    //cm.showAlert("Be the first to wish the couple");
                }

            },
            error: function(error) {
                cm.showAlert("Sorry!Couldn't get Comments");
                $("body").removeClass("ui-loading");
            }
        });
    },
    addComment: function() {
        //To Add Wish for the couple
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        if ($("#commentBox").val() == "") {
            cm.showAlert("Please Enter a lovable Wish for the couple");
        } else {
            $("body").addClass("ui-loading");
            var wishClass = Parse.Object.extend("WishCouple");
            var wishObj = new wishClass();
            wishObj.set("addedDateTime", new Date());
            wishObj.set("comment", $("#commentBox").val());
            wishObj.set("weddingID", weddingDetailsObject.weddingId);
            if (weddingDetailsObject.usertype == "guest")
                wishObj.set("addedByGuest", localStorage.userId);
            else if (weddingDetailsObject.usertype == "host")
                wishObj.set("addedByHost", localStorage.userId);
            wishObj.set("commenterName", localStorage.userName);
            wishObj.save(null, {
                success: function(wishResults) {
                    wishObj.set("wishID", wishResults.id);
                    wishObj.save();
                    $('#commentBox').val('');
                    cm.showToast('Comment added  Successfully');
                    commentsMethods.fetchComments();
                    $("body").removeClass("ui-loading");
                },
                error: function(gameScore, error) {
                    $("body").removeClass("ui-loading");
                    cm.showAlert("Sorry!Couldn't add your comment");
                }
            })

        }
    },
    deleteWish:function(selectedWish){
        // To Delete a Wish from the list
        var wishClass = Parse.Object.extend("WishCouple");
        var wishQuery = new Parse.Query(wishClass);
        wishQuery.equalTo("wishID", $(selectedWish).data("wishid"));
        $("body").addClass("ui-loading");
        wishQuery.find({
            success:function(foundWish){
                foundWish[0].destroy({
                    success:function(deletedWishSuccess){
                        $("body").removeClass("ui-loading");
                        commentsMethods.fetchComments(); // Recreate the Comments list again
                        cm.showToast("Wish removed Successfully");
                    },
                    error:function(deleteWishError){
                        $("body").removeClass("ui-loading");
                        cm.showAlert("Sorry!Couldn't remove the comment");
                    }
                })
            },
            error:function(wishError){
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't find the selected Wish");
            }
        })
    }
};
