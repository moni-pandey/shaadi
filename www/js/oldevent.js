if (weddingDetailsObject.usertype == "host") {
                                    for (var i = 0; i < eventResults.length; i++) {
                                        var rowObject = eventResults[i];
                                        var eventPic = rowObject.get("eventImg") || "./assets/img/engagement.png";
                                        var eventDateFormatted = cm.dateFormatter(rowObject.get("eventDateTime"));
                                        eventsHtml += "<div style='background-size: cover; background-color:white; border-left:4px solid #e45660;width:94.5%;margin-left:auto;margin-right:auto'>"; //Grouper Div for a event start margin-top:10px;
                                        eventsHtml += "<div style='background-size: cover; background-color:white;margin-top:10px;'>"; //Event Photo Div start
                                        eventsHtml += "<div class='image'>"; //Image Div Start
                                        eventsHtml += "<img src='" + eventPic + "'  class='img-responsive'>"; //Event Picture
                                        eventsHtml += "<div class='layer'></div>"; //Event Picture Layer
                                        eventsHtml += "</div>"; //Image Div End
                                        eventsHtml += "</div>"; //Event Photo Div End
                                        eventsHtml += "<div class='ui-grid-b'>"; //Event Grid for Event name and options start
                                        eventsHtml += "<div class='ui-block-a' style='width:60%;'>"; //Event name block A startmargin-top:-11px;
                                        eventsHtml += "<h3 style='font-size:19px; color:#4e4e4e;margin-left:15px'><b>" + rowObject.get("eventName") + "</b></h3>"; //Event Name
                                        eventsHtml += "</div>"; //Event name block A end
                                        eventsHtml += "<div class='ui-block-b' style='margin-top:-11px; padding-left:0; padding-right:0;width:20%' data-eventId='" + rowObject.get("eventID") + "' onclick='eventsMethods.editEvent(this)'>"; //Event edit block B start
                                        eventsHtml += "<img src='./assets/img/edit.png' style='margin:37px 0 0 25px'>"; //Edit Image
                                        eventsHtml += "<h6 style='color:#e45660; font-size:11px; margin-top:-16px; margin-left:40px'>Edit</h6>"; //Edit Text
                                        eventsHtml += "</div>"; //Event edit block B end
                                        eventsHtml += "<div class='ui-block-c' style='padding-left:0; padding-right:0;width:20%' data-eventId='" + rowObject.get("eventID") + "' onclick='eventsMethods.deleteEvent(this)'>"; //Event Delete block C start margin-top:-11px;
                                        eventsHtml += "<img src='./assets/img/delete.png'  style='margin:36px 0 0 4px'>"; //Delete Image
                                        eventsHtml += "<h6 style='color:#604047; font-size:11px; margin-top:-11px; margin-left:18px'>Delete</h6>"; //Delete Text
                                        eventsHtml += "</div>"; //Event Delete block C End
                                        eventsHtml += "</div>"; //Event Grid for Event name and options End
                                        eventsHtml += "<div class='ui-grid-c'>"; //Event info Grid start
                                        eventsHtml += "<div class='ui-block-a' style='margin-top:-19px; padding-right:0;width:40%;'>"; //Event Date block A start
                                        eventsHtml += "<img src='./assets/img/calender.png'  style='margin:3px 0 0 15px '>"; //Calender Image
                                        eventsHtml += "<h6 style='color:#2c2c2c; margin:-4px 0 0 29px; font-size:10px;'>" + eventDateFormatted + "</h6>"; //Event Date
                                        eventsHtml += "</div>"; //Event Date block A end
                                        eventsHtml += "<div class='ui-block-b' style='padding-left:0;padding-right:0;width:20%;'>"; //Event Time block B start
                                        eventsHtml += "<img src='./assets/img/clock.png' style='margin-left:-12px'>"; //Clock Image cm.timeFormatter(rowObject.get("eventDateTime"))
                                        eventsHtml += "<h6 style='color:#2c2c2c; margin:-15px 0 0 2px; font-size:10px;'>" + rowObject.get("eventTime") + "</h6>"; //Event Time
                                        eventsHtml += "</div>"; //Event Time block B end
                                        eventsHtml += "<div class='ui-block-c' style='padding-left:0; padding-right:0;width:30%;'>"; //Event Invited Guest block C start
                                        eventsHtml += "<img src='./assets/img/guest.png'  style='margin-left:-8px'>"; //Guest Image
                                        eventsHtml += "<h6 style='color:#2c2c2c; margin:-15px 0 0 2px; font-size:10px;'>All guests invited</h6>"; //Event Invited Text
                                        eventsHtml += "</div>"; //Event Invited Guest block C end
                                        eventsHtml += "<div class='ui-block-d' style='padding-left:0; padding-right:0;width:10%;'>"; //Event Map block D start
                                        eventsHtml += "<img src='./assets/img/map.png'  style='margin-left:-23px;'>"; //Map Image
                                        eventsHtml += "<h6 style='color:#2c2c2c; margin:-16px 0 0 -13px; font-size:10px;'>Map</h6>";
                                        eventsHtml += "</div>"; //Event Map block D end
                                        eventsHtml += "</div>"; //Event info Grid end
                                        eventsHtml += "<div style='padding-top:1px;padding-bottom:1px;'>"; //Event Description block start
                                        eventsHtml += "<h6 style='margin-left:15px;margin-top:14px;'>Description:" + rowObject.get("eventDesc") + "</h6><br/>"; //Event Description Text
                                        eventsHtml += "<h6 style='margin-top:-30px;margin-left:15px;'>Venue:" + rowObject.get("Venue") + "</h6><br/>"; //Event Venue
                                        eventsHtml += "<h6 style='margin-top:-30px;margin-left:15px;'>Menu:" + rowObject.get("Menu") + "</h6>"; //Event Dining Menu
                                        eventsHtml += "</div>"; //Event Description block end
                                        eventsHtml += "</div>"; //Grouper Div for a event end
                                    }

                                } else {
                                    console.log("I am a guest so hide edit and Delete");
                                    eventsHtml += "<div style='background-size: cover; background-color:white; border-left:4px solid #e45660; margin-top:10px;'>"; //Grouper Div for a event start
                                    eventsHtml += "<div style='background-size: cover; background-color:white; border-left:4px solid #e45660; margin-top:10px;'>"; //Event Photo Div start
                                    eventsHtml += "<div class='image'>"; //Image Div Start
                                    eventsHtml += "<img src='" + eventPic + "'  class='img-responsive'>"; //Event Picture
                                    eventsHtml += "<div class='layer'></div>"; //Event Picture Layer
                                    eventsHtml += "</div>"; //Image Div End
                                    eventsHtml += "</div>"; //Event Photo Div End
                                    eventsHtml += "<div class='ui-grid-c'>"; //Event Grid for Event name and options start
                                    eventsHtml += "<div class='ui-block-a' style='margin-top:-11px;width:50%'>"; //Event name block A start
                                    eventsHtml += "<h3 style='font-size:19px; color:#4e4e4e'><b>" + rowObject.get("eventName") + "</b></h3>"; //Event Name
                                    eventsHtml += "</div>"; //Event name block A end
                                    eventsHtml += "<div class='ui-block-b' style='margin-top:-11px; padding-left:0; padding-right:0;width:20%' data-eventId='" + rowObject.get("eventID") + "'data-addedby='" + rowObject.get("addedBy") + "' onclick='eventsMethods.joinEvent(this)' data-joinstatus='Yes'>"; //Event yes block B start
                                    eventsHtml += "<img src='./assets/img/join.png' style='margin:24px 0 0 25px'>"; //Join Picture
                                    eventsHtml += "<h6 style='color:#e45660; font-size:11px; margin-top:-11px; margin-left:42px'>Join</h6>"; //Join Text
                                    eventsHtml += "</div>"; //Event yes block B end
                                    eventsHtml += "<div class='ui-block-c' style='margin-top:-11px; padding-left:0; padding-right:0;width:20%' data-eventId='" + rowObject.get("eventID") + "'data-addedby='" + rowObject.get("addedBy") + "' onclick='eventsMethods.joinEvent(this)' data-joinstatus='Maybe'>"; //Event maybe block c start
                                    eventsHtml += "<img src='./assets/img/maybe.png'  style='margin:-56px 0 0 65px'>"; //Maybe picture
                                    eventsHtml += "<h6 style='color:#e45660; font-size:11px; margin-top:-42px; margin-left:77px'>Maybe</h6>"; //Maybe text
                                    eventsHtml += "</div>"; //Event maybe block C end
                                    eventsHtml += "<div class='ui-block-d' style='margin-top:-11px; padding-left:0; padding-right:0;width:10%' data-eventId='" + rowObject.get("eventID") + "'data-addedby='" + rowObject.get("addedBy") + "' onclick='eventsMethods.joinEvent(this)' data-joinstatus='No'>"; //Event No block D start
                                    eventsHtml += "<img src='./assets/img/no.png' style='margin:-56px 0 0 113px'>"; //No Picture
                                    eventsHtml += "<h6 style='color:#e45660; font-size:11px; margin-top:-42px; margin-left:129px'>No</h6>" //No text
                                    eventsHtml += "</div>"; //Event No block D end
                                    eventsHtml += "</div>"; //Event Grid for Event name and options end
                                    eventsHtml += "<div class='ui-grid-c'>"; //Event info Grid start
                                    eventsHtml += "<div class='ui-block-a' style='margin-top:-19px; padding-right:0;width:40%;'>"; //Event Date block A start
                                    eventsHtml += "<img src='./assets/img/calender.png'  style='margin:15px 0 0 0 '>"; //Calender Image
                                    eventsHtml += "<h6 style='color:#2c2c2c; margin:-12px 0 0 13px; font-size:10px;'>" + eventDateFormatted + "</h6>"; //Event Date
                                    eventsHtml += "</div>"; //Event Date block A end
                                    eventsHtml += "<div class='ui-block-b' style='padding-left:0;padding-right:0;width:20%;'>"; //Event Time block B start
                                    eventsHtml += "<img src='./assets/img/clock.png' style='margin-left:-12px'>"; //Clock Image cm.timeFormatter(rowObject.get("eventDateTime"))
                                    eventsHtml += "<h6 style='color:#2c2c2c; margin:-15px 0 0 2px; font-size:10px;'>" + rowObject.get("eventTime") + "</h6>"; //Event Time
                                    eventsHtml += "</div>"; //Event Time block B end
                                    eventsHtml += "<div class='ui-block-c' style='padding-left:0; padding-right:0;width:30%;'>"; //Event Invited Guest block C start
                                    eventsHtml += "<img src='./assets/img/guest.png'  style='margin-left:-8px'>"; //Guest Image
                                    eventsHtml += "<h6 style='color:#2c2c2c; margin:-15px 0 0 2px; font-size:10px;'>All guests invited</h6>"; //Event Invited Text
                                    eventsHtml += "</div>"; //Event Invited Guest block C end
                                    eventsHtml += "<div class='ui-block-d' style='padding-left:0; padding-right:0;width:10%;'>"; //Event Map block D start
                                    eventsHtml += "<img src='./assets/img/map.png'  style='margin-left:-13px;'>"; //Map Image
                                    eventsHtml += "<h6 style='color:#2c2c2c; margin:-15px 0 0 -4px; font-size:10px;'>Map</h6>";
                                    eventsHtml += "</div>"; //Event Map block D end
                                    eventsHtml += "</div>"; //Event info Grid end
                                    eventsHtml += "<div>"; //Event Description block start
                                    eventsHtml += "<h6 >Description:" + rowObject.get("eventDesc") + "</h6><br/>"; //Event Description Text
                                    eventsHtml += "<h6 style='margin-top:-25px;'>Venue:" + rowObject.get("Venue") + "</h6><br/>"; //Event Venue
                                    eventsHtml += "<h6 style='margin-top:-25px;'>Menu:" + rowObject.get("Menu") + "</h6>"; //Event Dining Menu
                                    eventsHtml += "</div>"; //Event Description block end
                                    eventsHtml += "</div>"; //Grouper Div for a event end
                                }