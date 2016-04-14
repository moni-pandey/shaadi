var galleryMethods = {
    //Array to save Base64
    imageArray: [],
    imageUrlArray: [],
    fetchAlbums: function() {
        //To Fetch the list of Albums available for a Wedding
        var albumHtml = "";
        var albumObject = Parse.Object.extend("Album");
        var albumQuery = new Parse.Query(albumObject);
        albumQuery.equalTo("eventID", localStorage.joinedWedding);
        $("body").addClass("ui-loading");
        albumQuery.find({
            success: function(foundAlbums) {
                for (var i = 0; i < foundAlbums.length; i++) {
                    var rowObject = foundAlbums[i];
                    var albumCover = rowObject.get('albumCover') || "img/create-new.png";
                    var addedByID = rowObject.get('addedByHost') || rowObject.get('addedByGuest');
                    var showAlbumOrNot = "block"; // Flag to show or hide Albums
                    var privateOrNot = ""; // Flag to make Album Private 
                    var albumselect = localStorage.userId == addedByID ? "albumselect" : ""; // Flag to allow selecting the Album added by you
                    if (addedByID != localStorage.userId && rowObject.get('privateAlbum'))
                        showAlbumOrNot = "none";
                    else if (addedByID == localStorage.userId && rowObject.get('privateAlbum'))
                        privateOrNot = "private"; // Added by the current user and its private

                    albumHtml += '<div onclick="galleryMethods.preparePictures(this)" class=" ' + albumselect + '" style="display:' + showAlbumOrNot + '" data-albumname="' + rowObject.get("albumName") + '" data-albumid="' + rowObject.get("albumID") + '">'; // Album entry start
                    albumHtml += '<div class="albums-list ' + privateOrNot + '">'; // Album Frame Container start
                    albumHtml += '<div class="line1"></div>'; // Album First Border start & End
                    albumHtml += '<div class="line1 line2"></div>'; // Album Second Border start & End
                    albumHtml += '<div class="ablums-list-container">'; // Album Pic&Details container start
                    albumHtml += '<div class="ablums-list-img">'; // Album Image Holder start
                    albumHtml += '<div class="innerimg"><img src="' + albumCover + '"></div>'; // Album Inner Holder
                    albumHtml += '</div>'; // Album Image Holder end
                    albumHtml += '<div class="ablums-list-content">'; // Album name Holder
                    albumHtml += '<div class="albumtitle"><a href="#">' + rowObject.get("albumName") + '</a></div>'; // Album name start and end
                    albumHtml += '</div>'; // Album name holder end
                    albumHtml += '</div>'; // Album Pic&Details container end
                    albumHtml += '</div>'; // Album Frame Container end
                    albumHtml += '</div>'; // Album entry stop
                }
                albumHtml += '<div class="create-album" onclick=galleryMethods.showGalleryPopup("createAlbumPopup");>'; // Starting of New Album list 
                albumHtml += '<div class="albums-list">'; // Album list block start
                albumHtml += '<div class="line1"></div>'; // Album first border start and end
                albumHtml += '<div class="line1 line2"></div>'; // Album second border start and end
                albumHtml += '<div class="ablums-list-container">'; // Album details container start
                albumHtml += '<div class="ablums-list-img">'; // Album picture holder start
                albumHtml += '<div class="innerimg">'; // Album picture inner holder start
                albumHtml += '<img src="img/create-new.png">'; // Create new image
                albumHtml += '</div>'; // Album picture inner holder end
                albumHtml += '</div>'; // Album picture holder end
                albumHtml += '<div class="ablums-list-content">'; // Album Text container start
                albumHtml += '<div class="albumtitle"><a href="#">Create</a></div>'; // Album Text start and end
                albumHtml += '</div>'; // Album text container end
                albumHtml += '</div>'; // Album details container end
                albumHtml += '</div>'; // Album list block end
                albumHtml += '</div>'; // Ending of New Album list
                //albumHtml+=''
                /*if (i % 2 == 0) {
                        albumHtml += "<div onclick='galleryMethods.preparePictures(this)' class='ui-block-a albumBlockTop  " + albumselect + " " + showAlbumOrNot + "' data-albumname='" + rowObject.get('albumName') + "' data-albumid='" + rowObject.get('albumID') + "'>"; //Block A start
                        albumHtml += "<div class='thumbnail'>"; //Block to make Gallery Thumbnail start
                        albumHtml += "<img src='" + albumCover + "' class='gallerypic'>"; //Album Cover Pic
                        albumHtml += "<div class='row red-bg_album'>"; //About Album block start
                        albumHtml += "<h6 class='reception-text_album'>" + rowObject.get('albumName'); //Album name heading start
                        albumHtml += "<p class='comments-text_album'><img src='./assets/img/comment-icon.png'  class='icon-margin'></p>"; //Album Comments Number
                        albumHtml += "</h6>"; //Album heading end
                        albumHtml += "<h6 class='photos-text_album'>"; //Album Like heading start
                        albumHtml += "<img src='./assets/img/image-icon.png'  class='icon-margin'>"; //Album Like button
                        albumHtml += "</h6>"; //Album Like heading end
                        albumHtml += "</div>"; //About Album block end
                        albumHtml += "</div>"; //Thumbnail end
                        albumHtml += "</div>"; //Block A End
                    } else {
                        // albumHtml += "<div class='ui-block-b'><div class='thumbnail'><img src='./assets/img/7.jpg' class='gallerypic'></div></div>";
                        albumHtml += "<div onclick='galleryMethods.preparePictures(this)' class='ui-block-b albumBlockTop  " + albumselect + " " + showAlbumOrNot + "' data-albumname='" + rowObject.get('albumName') + "' data-albumid='" + rowObject.get('albumID') + "'>"; //Block B start
                        albumHtml += "<div class='thumbnail'>"; //Block to make Gallery Thumbnail start
                        albumHtml += "<img src='" + albumCover + "' class='gallerypic'>"; //Album Cover Pic
                        albumHtml += "<div class='row red-bg_album'>"; //About Album block start
                        albumHtml += "<h6 class='reception-text_album'>" + rowObject.get('albumName'); //Album name heading start
                        albumHtml += "<p class='comments-text_album'><img src='./assets/img/comment-icon.png'  class='icon-margin'></p>"; //Album Comments Number
                        albumHtml += "</h6>"; //Album heading end
                        albumHtml += "<h6 class='photos-text_album'>"; //Album Like heading start
                        albumHtml += "<img src='./assets/img/image-icon.png'  class='icon-margin'>"; //Album Like button
                        albumHtml += "</h6>"; //Album Like heading end
                        albumHtml += "</div>"; //About Album block end
                        albumHtml += "</div>"; //Thumbnail end
                        albumHtml += "</div>"; //Block B End
                    }
                }
                if ((foundAlbums.length % 2) == 0) {
                    // albumHtml += "<div class='ui-block-a'><div class='thumbnail'><img src='./assets/img/create-new.jpg' class='gallerypic'></div></div>";
                    albumHtml += "<div class='ui-block-a albumBlockTop emptyalbum'>"; //Block A start
                    albumHtml += "<div class='thumbnail'>"; //Block to make Gallery Thumbnail start
                    // albumHtml += "<img src='./assets/img/create-new.jpg' class='gallerypic'>"; //Album Cover Pic
                    albumHtml += "<a href='#createAlbumPopup' data-rel='popup' data-position-to='window' ><img src='./assets/img/add-new.png'  style='margin-top:40px; margin-left:20px'></a>"; //Album Cover Pic
                    albumHtml += "</div>"; //Thumbnail end
                    albumHtml += "</div>"; //Block A End
                } else {
                    // albumHtml += "<div class='ui-block-b'><div class='thumbnail'><img src='./assets/img/create-new.jpg' class='gallerypic'></div></div>";
                    albumHtml += "<div class='ui-block-b albumBlockTop emptyalbum'>"; //Block B start
                    albumHtml += "<div class='thumbnail'>"; //Block to make Gallery Thumbnail start
                    // albumHtml += "<img src='./assets/img/create-new.jpg' class='gallerypic'>"; //Album Cover Pic
                    albumHtml += "<a href='#createAlbumPopup' data-rel='popup' data-position-to='window' ><img src='./assets/img/add-new.png' alt=' style='margin-top:40px; margin-left:20px'></a>"; //Album Cover Pic
                    albumHtml += "</div>"; //Thumbnail end
                    albumHtml += "</div>"; //Block B End
                }*/
                $("#galleryBlock").html(albumHtml).trigger("create");
                $("body").removeClass("ui-loading");
                /*setTimeout(function() {
                    
                    $("#galleryBlock").trigger("create");
                    $("body").removeClass("ui-loading");
                    console.log("Hide it after 10ms");
                }, 10);*/

            },
            error: function(albumErrors) {
                cm.showAlert("Sorry!Couldn't list Albums");
                $("body").removeClass("ui-loading");
            }
        })
    },
    /* createAlbum: function() {
         navigator.notification.prompt("Album Name", function(results) {
             if (results.buttonIndex == 2) {
                 if (results.input1 != '')
                     galleryMethods.registerAlbum(results.input1);
                 else {
                     cm.showToast("Please enter a Album name");
                     galleryMethods.createAlbum();
                 }
             }
         }, "Create Album", ["Cancel", "Create"]);
     },*/
    registerAlbum: function() {
        var albumClass = Parse.Object.extend("Album");
        var albumObj = new albumClass();
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        albumObj.set("albumName", $("#albumNameBox").val());
        albumObj.set("eventID", localStorage.joinedWedding);
        if (weddingDetailsObject.usertype == "host")
            albumObj.set("addedByHost", localStorage.userId);
        else
            albumObj.set("addedByGuest", localStorage.userId);
        albumObj.set("privateAlbum", false);
        albumObj.set("addedDateTime", new Date());
        $("#createAlbumPopup").popup("close"); // Close the popup to avoid duplicate name
        $("body").addClass('ui-loading');
        albumObj.save(null, {
            success: function(albumObj) {
                albumObj.set("albumID", albumObj.id);
                albumObj.save();
                localStorage.selectedAlbumId = albumObj.id;
                localStorage.selectedAlbum = $("#albumNameBox").val();
                $("body").removeClass('ui-loading');
                // cm.showAlert('Added Album successfully,now you could upload photos in it');
                galleryMethods.showPicturesPage();
            },
            error: function(error) {
                cm.showAlert("Sorry!Unable to register Album");
            }
        });
    },
    updateAlbumName: function() {
        // To Make the selected Albums Private :ToDo:Update the status of multiple Albums status
        var albumObject = Parse.Object.extend("Album");
        var albumQuery = new Parse.Query(albumObject);
        albumQuery.equalTo("albumID", localStorage.selectedAlbumId);
        $("body").addClass("ui-loading");
        albumQuery.find({
            success: function(foundAlbum) {
                $("#renameAlbumPopup").popup("close");
                foundAlbum[0].set("albumName", $("#editAlbumNameBox").val());
                localStorage.selectedAlbum = $("#editAlbumNameBox").val();
                foundAlbum[0].save();
                cm.showToast("Renamed Album Successfully");
                $("#galleryOptionBlock").hide();
                galleryMethods.fetchAlbums();
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Unable to rename the Album");
                $("body").removeClass("ui-loading");
            }
        });
    },
    updateAlbumCoverPic: function(coverPicUrl) {
        // To Update the latest uploaded picture as Album cover pic
        var albumObject = Parse.Object.extend("Album");
        var albumQuery = new Parse.Query(albumObject);
        albumQuery.equalTo("albumID", localStorage.selectedAlbumId);
        $("body").addClass("ui-loading");
        albumQuery.find({
            success: function(foundAlbum) {
                console.log("foundAlbum:" + JSON.stringify(foundAlbum));
                foundAlbum[0].set("albumCover", coverPicUrl);
                foundAlbum[0].save();
                console.log("Saved CoverPic");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Unable to update Album Cover");
                $("body").removeClass("ui-loading");
            }
        });
    },
    makeAlbumsPrivate: function() {
        // To Make the selected Albums Private :ToDo:Update the status of multiple Albums status
        var albumObject = Parse.Object.extend("Album");
        var albumQuery = new Parse.Query(albumObject);
        albumQuery.equalTo("albumID", localStorage.selectedAlbumId);
        $("body").addClass("ui-loading");
        albumQuery.find({
            success: function(foundAlbum) {
                foundAlbum[0].set("privateAlbum", true);
                foundAlbum[0].save();
                cm.showAlert("Made the Album Private");
                galleryMethods.fetchAlbums();
                $("#galleryOptionBlock").hide();
                $("body").removeClass("ui-loading");
                console.log("Made the Album Private");
            },
            error: function() {
                cm.showAlert("Sorry!Unable to mark Album Private");
                $("body").removeClass("ui-loading");
            }
        });
    },
    showGalleryPopup: function(popupName) {
        // To show the popup for Delete Album confirm
        console.log(popupName);
        if (popupName == "deleteAlbumPopup") {
            $("#deleteAlbumPopup").popup("open");
        }
        if (popupName == "renameAlbumPopup") {
            $("#renameAlbumPopup").popup("open");
            $("#editAlbumNameBox").val(localStorage.selectedAlbum);
        }
        if (popupName == "createAlbumPopup") {
            $("#createAlbumPopup").popup("open");
        }
    },
    deleteAlbum: function() {
        // To delete the selected Album
        var albumObject = Parse.Object.extend("Album");
        var albumQuery = new Parse.Query(albumObject);
        albumQuery.equalTo("albumID", localStorage.selectedAlbumId);
        $("body").addClass("ui-loading");
        albumQuery.get(localStorage.selectedAlbumId, {
            success: function(foundAlbum) {
                foundAlbum.destroy({});
                $("#deleteAlbumPopup").popup("close");
                cm.showToast("Deleted Album successfully");
                $("#galleryOptionBlock").hide();
                galleryMethods.fetchAlbums();
                $("body").removeClass('ui-loading');
            },
            error: function(error) {
                cm.showAlert('Sorry!Unable to delete the Album');
                $("body").removeClass('ui-loading');
            }
        });
    },
    pickImage: function() {
        //To open Image Picker
        $(":mobile-pagecontainer").pagecontainer("change", "pictures.html", {
            showLoadMsg: false
        });
        /*window.imagePicker.getPictures(
            function(results) {
                galleryMethods.imageArray.length = 0;
                for (var i = 0; i < results.length; i++) {
                    galleryMethods.convertImgToBase64URL(results[i]);
                }
                cm.showToast("Processing Pictures");
                setTimeout(function(){
                    galleryMethods.savePictures(galleryMethods.imageArray);
                },5000);                
            },
            function(error) {
                cm.showAlert("Sorry!Couldn't pick Images");
            }
        );*/
        /*navigator.camera.getPicture(function(picture) {
            var pictureClass = Parse.Object.extend("Picture");
            var pictureObj = new pictureClass();
            $("body").addClass("ui-loading");
            var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
            pictureObj.set("albumID", localStorage.selectedAlbumId);
            pictureObj.set("Picture", picture);
            console.log("imageArray[i]" + picture);
            if (weddingDetailsObject.usertype == "host")
                pictureObj.set("addedByHost", localStorage.userId);
            else
                pictureObj.set("addedByGuest", localStorage.userId);
            pictureObj.set("addedDateTime", new Date());
            pictureObj.save(null, {
                success: function(pictureObj) {
                    $("body").removeClass("ui-loading");
                    pictureObj.set("pictureID", pictureObj.id);
                    console.log("pictureObj" + JSON.stringify(pictureObj));
                    pictureObj.save();
                }
            });
        }, function(eventImageError) {
            $("body").removeClass("ui-loading");
            cm.showAlert("Sorry!Couldn't pick the Photo");
        }, {
            quality: 100,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            destinationType: Camera.DestinationType.DATA_URL
        });
        $("body").removeClass("ui-loading");
        cm.showAlert("Uploaded Pictures successfully!");*/
        //galleryMethods.fetchPictures();
    },
    convertImgToBase64URL: function(img) {
        // To convert the picked Images to Base64 format
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        console.log("img:" + img + "dataURL:" + dataURL);
        return dataURL; //.replace(/^data:image\/(png|jpg);base64,/, "")

    },
    savePictures: function(imageUrl) {
        var pictureClass = Parse.Object.extend("Picture");
        var pictureObj = new pictureClass();
        $("body").addClass("ui-loading");
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        // for (var i = 0; i < imageArray.length; i++) {
        pictureObj.set("albumID", localStorage.selectedAlbumId);
        pictureObj.set("Picture", imageUrl);
        if (weddingDetailsObject.usertype == "host")
            pictureObj.set("addedByHost", localStorage.userId);
        else
            pictureObj.set("addedByGuest", localStorage.userId);
        pictureObj.set("addedDateTime", new Date());
        pictureObj.save(null, {
            success: function(pictureObj) {
                pictureObj.set("pictureID", pictureObj.id);
                pictureObj.save();
            }
        });
        // }
        $("body").removeClass("ui-loading");
        cm.showToast("Uploaded Pictures successfully!");
        galleryMethods.updateAlbumCoverPic(imageUrl);
        galleryMethods.fetchPictures();

    },
    fetchPictures: function() {
        // To List the Pictures from the parse and Cloudinary
        var pictureObject = Parse.Object.extend("Picture");
        var pictureQuery = new Parse.Query(pictureObject);
        $("#albumTitle").text(localStorage.selectedAlbum);
        pictureQuery.equalTo("albumID", localStorage.selectedAlbumId);
        $("body").addClass("ui-loading");
        pictureQuery.find({
            success: function(foundPictures) {
                var pictureHtml = "";
                var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
                galleryMethods.imageArray.length = 0; // clear the array
                for (var i = 0; i < foundPictures.length; i++) {
                    var addedById = foundPictures[i].get('addedByHost') || foundPictures[i].get('addedByGuest');
                    var picAddedByHostClass = "";
                    if (addedById == localStorage.userId && weddingDetailsObject.usertype == "host")
                        picAddedByHostClass = "hostaddedpic"; // Just to make a note that this picture was added by Host(you)
                    pictureHtml += '<div id="' + i + '" onclick="galleryMethods.prepareForView(this)" class="' + picAddedByHostClass + ' recep-list" data-picurl="' + foundPictures[i].get("Picture") + '" data-picid="' + foundPictures[i].get("pictureID") + '">';
                    pictureHtml += '<a><img src=' + foundPictures[i].get("Picture") + '></a>'
                    pictureHtml += '</div>';

                    /*Push the image url and index to enable swipe based image view*/
                    var imgObj = {};
                    imgObj.imgIndex = i;
                    imgObj.imgURL = foundPictures[i].get("Picture");
                    imgObj.imgID = foundPictures[i].get("pictureID");
                    galleryMethods.imageArray.push(imgObj);
                    localStorage.imgObj = JSON.stringify(galleryMethods.imageArray);
                    console.warn(localStorage.imgObj);
                }
                /*if (i % 2 == 0) {
                        pictureHtml += "<div class='ui-block-a'>"; //Block A start
                        pictureHtml += "<div onclick='galleryMethods.prepareForView(this)' class='thumbnail viewPicture " + picAddedByHostClass + "' data-picurl='" + foundPictures[i].get('Picture') + "' data-picid='" + foundPictures[i].get('pictureID') + "'>"; //Thumbnail Div Start
                        pictureHtml += "<img src='" + foundPictures[i].get('Picture') + "' class='gallerypic'>"
                        pictureHtml += "</div>"; //Thumbnail Div End
                        pictureHtml += "</div>"; //Block A end
                    } else {
                        pictureHtml += "<div class='ui-block-b'>"; //Block A start
                        pictureHtml += "<div onclick='galleryMethods.prepareForView(this)' class='thumbnail viewPicture " + picAddedByHostClass + "' data-picurl='" + foundPictures[i].get('Picture') + "'  data-picid='" + foundPictures[i].get('pictureID') + "'>"; //Thumbnail Div Start
                        pictureHtml += "<img src='" + foundPictures[i].get('Picture') + "' class='gallerypic'>"
                        pictureHtml += "</div>"; //Thumbnail Div End
                        pictureHtml += "</div>"; //Block A end
                    }
                }
                if ((foundPictures.length % 2) == 0) {
                    pictureHtml += "<div class='ui-block-a cloudinaryDiv'>"; //Block A start
                    pictureHtml += "<div class='thumbnail-pic upload upload-content-btn'>"; //Thumbnail Div Start
                    pictureHtml += "<img src='./assets/img/create-new.jpg' class='gallerypic'>"; //Add Picture Image
                    pictureHtml += "<input class='uploader' type='file' name='file' />";
                    pictureHtml += "</div>"; //Thumbnail Div End
                    pictureHtml += "</div>"; //Block A end
                } else {
                    pictureHtml += "<div class='ui-block-b cloudinaryDiv'>"; //Block A start
                    pictureHtml += "<div class='thumbnail-pic upload upload-content-btn'>"; //Thumbnail Div Start
                    pictureHtml += "<img src='./assets/img/create-new.jpg' class='gallerypic'>"; //Add Picture Image
                    pictureHtml += "<input class='uploader' type='file' name='file' />";
                    pictureHtml += "</div>"; //Thumbnail Div End
                    pictureHtml += "</div>"; //Block A end
                }*/

                $("#picturesBlock").html(pictureHtml).trigger("create");

                $("body").removeClass("ui-loading");
            },
            error: function() {
                cm.showAlert("Sorry!Unable to fetch pictures");
                $("body").removeClass("ui-loading");
            }
        });
    },
    showPicturesPage: function(imageArray) {
        //To Change to the Pictures list page
        $(":mobile-pagecontainer").pagecontainer("change", "pictures.html", {
            showLoadMsg: false
        });
        $("#albumTitle").text(localStorage.selectedAlbum);
        /*var pictureHtml = "";
        for (var i = 0; i < imageArray.length; i++) {
            console.log(imageArray[i]);
            if (i % 2 == 0) {
                pictureHtml += "<div class='ui-block-a'>"; //Block A start
                pictureHtml += "<div class='thumbnail'>"; //Thumbnail Div Start
                pictureHtml += "<img src='" + imageArray[i] + "' class='gallerypic'>"
                pictureHtml += "</div>"; //Thumbnail Div End
                pictureHtml += "</div>"; //Block A end
            } else {
                pictureHtml += "<div class='ui-block-b'>"; //Block A start
                pictureHtml += "<div class='thumbnail'>"; //Thumbnail Div Start
                pictureHtml += "<img src='" + imageArray[i] + "' class='gallerypic'>"
                pictureHtml += "</div>"; //Thumbnail Div End
                pictureHtml += "</div>"; //Block A end
            }
        }
        $("#picturesBlock").html(pictureHtml);*/
    },
    preparePictures: function(selectedAlbum) {
        // To prepare the list of pictures of the selected Album
        localStorage.selectedAlbum = $(selectedAlbum).data("albumname");
        localStorage.selectedAlbumId = $(selectedAlbum).data("albumid");
        galleryMethods.showPicturesPage();
    },
    prepareForView: function(selectedPicture) {
        // To save the Picture details on clicking the picture
        localStorage.selectedPic = $(selectedPicture).data("picurl");
        localStorage.selectedPicId = $(selectedPicture).data("picid");
        localStorage.selectedImgDivId = $(selectedPicture).attr("id");
        console.log("View Picture clicked");
        $(":mobile-pagecontainer").pagecontainer("change", "view_picture.html", {
            showLoadMsg: false
        });
    },
    swipePrepareForView: function(swipeEvent) {
        // To change the selected pic details on swipe
        var imgObj = JSON.parse(localStorage.imgObj);
        console.log("imgObj type:"+typeof imgObj);
        console.log("imgObj[0]:"+imgObj[0].imgIndex);
        if (swipeEvent == "left") {
            // If image has been swiped left
            console.log("Swipe left");
            if (localStorage.selectedImgDivId != 0) {
                // The swiped image is not the first image
                console.log("selectedImgDivId:" + localStorage.selectedImgDivId);
                localStorage.selectedImgDivId = parseInt(localStorage.selectedImgDivId) - 1;
                $.each(imgObj,function(index, item) {
                    console.log("imgObj[item].imgIndex:" + imgObj[index].imgIndex);
                    if (imgObj[index].imgIndex == localStorage.selectedImgDivId) {
                        localStorage.selectedPic = imgObj[index].imgURL;
                        localStorage.selectedPicId = imgObj[index].imgID;
                        localStorage.selectedImgDivId = imgObj[index].imgIndex;
                        console.log("View Picture Swiped");
                        //$("#imageViewerBlock").attr("src", localStorage.selectedPic);
                        $(":mobile-pagecontainer").pagecontainer("change", "view_picture.html", {
                            showLoadMsg: false,
                            reloadPage:true
                        });
                        //galleryMethods.viewPicture();
                    }
                });
            }
        }

    },
    viewPicture: function() {
        // To Display the selected picture and Likes button :ToDo:Check how to fix the multiple Like issue
        console.warn("viewPicture:");
        galleryMethods.getNumberOfLikes(); // To print the number of likes of the Viewed Picture
        $("#selectedAlbumTitle").text(localStorage.selectedAlbum);
        $("#imageViewerBlock").removeAttr("src").attr("src", localStorage.selectedPic);
        //$("#imageViewerBlock").html("<center><img src='" + localStorage.selectedPic + "' style='width:85%;height:65%;'></center>");
        var pictureLikeClass = Parse.Object.extend("PictureLike");
        var pictureLikeQuery = new Parse.Query(pictureLikeClass);
        pictureLikeQuery.equalTo("pictureID", localStorage.selectedPicId);
        pictureLikeQuery.equalTo("guestID", localStorage.userId);
        /*var pictureIdQuery = new Parse.Query(pictureLikeClass);
        pictureIdQuery.equalTo("pictureID", localStorage.selectedAlbumId);
        var pictureGuestIdQuery = new Parse.Query(pictureLikeClass);
        pictureGuestIdQuery.equalTo("guestID", localStorage.userId);
        var pictureLikeQuery = Parse.Query.or(pictureIdQuery, pictureGuestIdQuery);*/
        pictureLikeQuery.find({
            success: function(foundPictureLikes) {
                console.log("foundPictureLikes:" + JSON.stringify(foundPictureLikes));
                if (foundPictureLikes.length == 0) {
                    console.log("You haven't Liked this picture");
                    $("#picLikeBtn").html("<img src='img/like.png'>Like");
                    $("#picLikeBtn").attr("data-liked", "false");
                } else {
                    console.warn("You have liked this picture");
                    $("#picLikeBtn").html("<img src='img/like.png'>Liked");
                    $("#picLikeBtn").attr("data-liked", "true");
                }
            },
            error: function() {
                cm.showAlert("Sorry!Couldn't find the Picture Likes");
            }
        });
    },
    getNumberOfLikes: function() {
        // To Get the Total Number of Likes of the Viewed Picture
        console.log("getNumberOfLikes called");
        var pictureLikeClass = Parse.Object.extend("PictureLike");
        var pictureLikeQuery = new Parse.Query(pictureLikeClass);
        pictureLikeQuery.equalTo("pictureID", localStorage.selectedPicId);
        $("body").addClass("ui-loading");
        pictureLikeQuery.find({
            success: function(foundPictureLikes) {
                console.log("foundPictureLikes.length:" + foundPictureLikes.length);
                $("#noOfLikes").text(foundPictureLikes.length);
                $("body").removeClass("ui-loading");
            },
            error: function() {
                $("body").removeClass("ui-loading");
                console.log("Sorry!Couldn't find the number of Picture Likes");
            }
        });
        galleryMethods.getNumberOfComments(); // To print the number of likes of the Viewed Picture
    },
    getNumberOfComments: function() {
        // To Get the Total Number of Comments of the Viewed Picture
        var pictureCommentClass = Parse.Object.extend("PictureComment");
        var pictureCommentQuery = new Parse.Query(pictureCommentClass);
        pictureCommentQuery.equalTo("pictureID", localStorage.selectedPicId);
        $("body").addClass("ui-loading");
        pictureCommentQuery.find({
            success: function(foundPictureComments) {
                console.log("foundPictureComments.length:" + foundPictureComments.length);
                $("#noOfComments").text(foundPictureComments.length);
                $("body").removeClass("ui-loading");
            },
            error: function() {
                $("body").removeClass("ui-loading");
                console.log("Sorry!Couldn't find the number of Picture Comments");
            }
        });
    },
    likePicture: function(likeBtn) {
        // To Like the Viewed Picture
        if ($("#picLikeBtn").attr("data-liked") == "true") {
            console.log("You have already Liked this picture");
        } else {
            var pictureLikeClass = Parse.Object.extend("PictureLike");
            var pictureLikeObj = new pictureLikeClass();
            pictureLikeObj.set("pictureID", localStorage.selectedPicId);
            pictureLikeObj.set("guestID", localStorage.userId);
            $("body").addClass("ui-loading");
            pictureLikeObj.save(null, {
                success: function(pictureLikeSuccess) {
                    pictureLikeObj.set("pictureLikeID", pictureLikeSuccess.id);
                    pictureLikeObj.save();
                    $("#picLikeBtn").data("liked") == "true";
                    galleryMethods.viewPicture(); // To Update the pictures details like data etc
                    /*$("#likePictureBtn .ui-btn-text").text("Liked");
                    $("#likePictureBtn").addClass("ui-disabled");*/

                    $("body").removeClass("ui-loading");
                },
                error: function() {
                    cm.showAlert("Sorry! Couldn't like the Picture");
                    $("body").removeClass("ui-loading");
                }
            });
        }
    },
    showPictureComments: function() {
        // Show Picture comments page
        $(":mobile-pagecontainer").pagecontainer("change", "picture_comments.html", {
            showLoadMsg: false
        });

    },
    sharePicture: function() {
        // To Share the Viewed Picture
        $("body").addClass("ui-loading");
        /*var imgBase64=galleryMethods.convertImgToBase64URL(document.getElementById("imageViewerBlock"));
        console.warn("imgBase64:"+imgBase64);*/
        window.plugins.socialsharing.share(null, null, localStorage.selectedPic);
        //window.plugins.socialsharing.share(null, 'Shared via Shaadi',imgBase64, null);
        $("body").removeClass("ui-loading");
    },
    bindCloudinary: function() {
        console.log("cloudinary method");
        /*$('document').append($.cloudinary.unsigned_upload_tag("bvnmnicy", {
            cloud_name: 'manage-my-shaadi'
        }));*/
        $('.uploader').unsigned_cloudinary_upload("bvnmnicy", {
            cloud_name: 'manage-my-shaadi'
        }, {
            multiple: true
        }).bind('cloudinarydone', function(e, data) {
                $("body").addClass("ui-loading");
                galleryMethods.savePictures(data.result.secure_url); // save the image url in parse
                // $('.thumbnails').append('<img src="' + data.result.secure_url + '" style="height:30px;width:30px;">');
                console.log("cloudinarydone");
                $("body").removeClass("ui-loading");
            }

        ).bind('cloudinaryprogress', function(e, data) {
            var progVal = Math.round((data.loaded * 100.0) / data.total);
            $("body").addClass("ui-loading");
            if (progVal == "100") {
                // cm.showAlert("Uploaded Successfully");
                $("body").removeClass("ui-loading");
            }

        });
    },
    addComment: function() {
        // To add Comment for the Viewed Picture
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        if ($("#pictureCommentBox").val() == "") {
            cm.showAlert("Please Enter a beautiful comment for the picture");
        } else {
            $("body").addClass("ui-loading");
            var pictureCommentClass = Parse.Object.extend("PictureComment");
            var pictureCommentObj = new pictureCommentClass();
            pictureCommentObj.set("addedDateTime", new Date());
            pictureCommentObj.set("comment", $("#pictureCommentBox").val());
            pictureCommentObj.set("pictureID", localStorage.selectedPicId);
            if (weddingDetailsObject.usertype == "guest")
                pictureCommentObj.set("addedByGuest", localStorage.userId);
            else if (weddingDetailsObject.usertype == "host")
                pictureCommentObj.set("addedByHost", localStorage.userId);
            pictureCommentObj.set("commenterName", localStorage.userName);
            pictureCommentObj.save(null, {
                success: function(pictureCommentResults) {
                    pictureCommentObj.set("commentID", pictureCommentResults.id);
                    pictureCommentObj.save();
                    $('#pictureCommentBox').val('');
                    cm.showToast('Comment added  Successfully');
                    galleryMethods.fetchComments();
                    $("body").removeClass("ui-loading");
                },
                error: function(gameScore, error) {
                    $("body").removeClass("ui-loading");
                    cm.showAlert("Sorry!Couldn't add your comment");
                }
            })

        }
    },
    fetchComments: function() {
        // To List the comments of the Viewed Picture
        var pictureCommentClass = Parse.Object.extend("PictureComment");
        var pictureCommentQuery = new Parse.Query(pictureCommentClass);
        var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
        pictureCommentQuery.equalTo("pictureID", localStorage.selectedPicId);
        $("body").addClass("ui-loading");
        pictureCommentQuery.find({
            success: function(commentResults) {
                var commentsHtml = '';
                $("#noOfPictureComments").html(commentResults.length + "Comments");
                console.log("commentResults.length:" + commentResults.length);
                var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
                if (commentResults.length > 0) {
                    for (var i = 0; i < commentResults.length; i++) {
                        //var commenterName;
                        var rowObject = commentResults[i];
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
                        var datetime = moment(moment(concatenatedDate)).fromNow(); // Using Moments to find the Time Ago
                        var visibilityOfDelete = "none";

                        if (weddingDetailsObject.usertype == "guest") {
                            if (localStorage.userId == rowObject.get("addedByGuest"))
                                visibilityOfDelete = "block";
                            else
                                visibilityOfDelete = "none";
                        } else if (weddingDetailsObject.usertype == "host")
                            visibilityOfDelete = "block";
                        commentsHtml += '<div class="single-chat">'; // Wishblock start
                        commentsHtml += '<div class="pfile">'; // Profile pic block start
                        commentsHtml += '<img src="img/no-pic.png" width="50" height="50">'
                        commentsHtml += '</div>'; // Profile pic block end
                        commentsHtml += '<div class="pchat">'; // Wish details block start
                        commentsHtml += '<div class="pname">' + rowObject.get('commenterName') + '</div>'; // Wisher name start & End
                        commentsHtml += '<div class="pcomment">' + rowObject.get('comment'); // Wish message block start
                        commentsHtml += '<div class="poststatus">' + datetime + '</div>'; // Wished Time start and end
                        commentsHtml += '<div class="arrowleft"></div>'; // Wished Left arrow
                        commentsHtml += '<div class="pclose" style="display:' + visibilityOfDelete + '" data-commentid=' + rowObject.get('commentID') + ' onclick="galleryMethods.deleteComment(this)"></div>'; // Wish delete button
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
                    $("#pictureCommentList").html(commentsHtml);
                    $("body").removeClass("ui-loading");
                } else {
                    $("#pictureCommentList").html("");
                    // cm.showAlert("Be the first to comment on this picture");
                    $("body").removeClass("ui-loading");
                }

            },
            error: function(error) {
                cm.showAlert("Sorry!Couldn't get Comments");
                $("body").removeClass("ui-loading");
            }
        });
    },
    deleteComment: function(selectedComment) {
        // To Delete a Wish from the list
        var pictureCommentClass = Parse.Object.extend("PictureComment");
        var pictureCommentQuery = new Parse.Query(pictureCommentClass);
        pictureCommentQuery.equalTo("commentID", $(selectedComment).data("commentid"));
        $("body").addClass("ui-loading");
        pictureCommentQuery.find({
            success: function(foundComment) {
                foundComment[0].destroy({
                    success: function(deletedCommentSuccess) {
                        $("body").removeClass("ui-loading");
                        galleryMethods.fetchComments(); // Recreate the Comments list again
                        cm.showToast("Comment removed Successfully");
                    },
                    error: function(deleteCommentError) {
                        $("body").removeClass("ui-loading");
                        cm.showAlert("Sorry!Couldn't remove the comment");
                    }
                })
            },
            error: function(commentError) {
                $("body").removeClass("ui-loading");
                cm.showAlert("Sorry!Couldn't find the selected Wish");
            }
        })
    }
};

$("#galleryBlock").on("taphold", "div.albumselect", function() {
    console.log("taphold");
    localStorage.selectedAlbum = $(this).data("albumname");
    localStorage.selectedAlbumId = $(this).data("albumid");
    $(this).toggleClass("selectedAlbum");
    if ($(this).hasClass("album-chceked")) {
        console.log("Has class");
        $(this).removeClass("album-chceked").addClass("albums-con");
    } else $(this).removeClass("albums-con").addClass("album-chceked");
    $(this).removeClass("albums-con").addClass("album-chceked");
    // $(this).closest("div").find(".red-bg_album").toggleClass("selectedAlbum");
    if ($("div.selectedAlbum").length > 0) {
        // To show or hide the Contacts options
        // $("#albumPageHeading").hide();
        $("#galleryOptionBlock").show();
    } else {
        $("#galleryOptionBlock").hide();
        // $("#albumPageHeading").show();
    }
});
$("#imageViewerBlock").on("swiperight", function() {
    galleryMethods.swipePrepareForView("right");
});
$("#imageViewerBlock").on("swipeleft", function() {
    galleryMethods.swipePrepareForView("left");
});
//ToDo:Need to include Taphold feature for Images
/*$(document).on("taphold", ".hostaddedpic", function() {
    console.log("Tap holded host added picture");
    localStorage.tappedPicId = $(this).data("picid");
    console.log($(this));
    $("#pictureOptionBlock").toggle(); //Show or Hide picture options
    //$(this).toggleClass("selectedPicture"); // :ToDo:Create a class for highlighting the selected picture
    if ($(".selectedPicture").length > 0) // To show or hide the Pictures options
        $("#pictureOptionBlock").show();
    else
        $("#pictureOptionBlock").hide();
});*/
/*$(document).on("click", ".albumselect", function() {
    localStorage.selectedAlbum = $(this).data("albumname");
    localStorage.selectedAlbumId = $(this).data("albumid");
    galleryMethods.showPicturesPage();
});*/

/*$(document).on("click", ".viewPicture", function() {
    $(":mobile-pagecontainer").pagecontainer("change", "view_picture.html", {
        showLoadMsg: false
    });
    localStorage.selectedPic = $(this).data("picurl");
    localStorage.selectedPicId = $(this).data("picid");
});*/
