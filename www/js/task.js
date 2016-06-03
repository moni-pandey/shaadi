	var taskmthds= {
		 taskid : 0,
		loadhosttask : function() {
			
			$('#all').bind('click',getAll); 
			 $('.cardlist').html(' ')
		    $('#all').addClass('selected-task-tab')
			if($('#pending').hasClass('selected-task-tab'))
				$('#pending').removeClass('selected-task-tab')
			if($('#completed').hasClass('selected-task-tab'))
				$('#completed').removeClass('selected-task-tab')
			var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("TaskManagement");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
		   TaskManagementQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
		   TaskManagementQuery.equalTo("createdBy", localStorage.userId);
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
					
			$("body").removeClass("ui-loading");
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
							 "July", "Aug", "Sept", "Oct", "Nov", "Dec"
							 ];
						
				
				 for(var i=0 ;i<results.length ; i++)
				 {    var taskhtml=""
					  var rowObj = results[i]
					  console.log(results.length)
					  console.log(rowObj.get('deadline'))
					  var day_date = rowObj.get('deadline').getDate();
					  var year = rowObj.get('deadline').getFullYear();
					  var month = rowObj.get('deadline').getMonth();
					  
					  if(rowObj.get('status')!='complete')
					  {
						taskhtml+=' <div class="profile-detail fbbox" style="padding-bottom:1px" id="'+rowObj.get('taskID')+'profile">'
						taskhtml+=' <h6 class="deadline-day-text"><img src="img/task-date.png">Deadline '+day_date+' '+monthNames[month]+' '+year+' '
						taskhtml+='    <span style="float:right;">'
						taskhtml+='    <h6 class="mark-complete-text">Mark Complete <img data-id="'+rowObj.get('taskID')+'" data-mark="incomplete" onclick="taskmthds.changestatus(this)" src="img/mark-complete.png"></h6>'
						taskhtml+='</span>'
						taskhtml+='	</h6>'
						taskhtml+='	<h3 class="name-of-task taskname">'+rowObj.get('taskTitle') +'<img data-id="'+rowObj.get('taskID')+'" onclick="taskmthds.getdetails(this)"  src="img/edit-task.png"></h3>'
						taskhtml+='	<h5 class="task-details">w'+rowObj.get('description')+'</h5>'
						taskhtml+='	<h6 class="assign-to-text">'
						taskhtml+='    Assign to: '
						taskhtml+='	<span>'+rowObj.get('assignedToName')+'</span>'
						taskhtml+='	<span class="delete-assigned"><img src="img/delete-red.png" id="'+rowObj.get('taskID')+'" onclick="taskmthds.deletetask(this)"></span>'
						taskhtml+=' </h6>'
						taskhtml+='</div>'
					  }
					  else
					  {
						  
						  console.log('complete')
						  
						  
						 taskhtml+=' <div class="profile-detail fbbox" style="padding-bottom:1px" id="'+rowObj.get('taskID')+'profile">'
						 taskhtml+=' <h6 class="deadline-day-done"><img src="img/calendar-gray.png">Deadline '+day_date+' '+monthNames[month]+' '+year+' '
							  taskhtml+='  <span style="float:right;">'
								   taskhtml+=' <h6 class="completed-text">Completed <img data-mark="complete" src="img/completed.png"></h6>'
								taskhtml+='</span>'
							taskhtml+='</h6>'
							taskhtml+='<h3 class="name-of-task-completed taskname">'+rowObj.get('taskTitle') +'<img data-id="'+rowObj.get('taskID')+'" style="display:none" src="img/edit-task.png"></h3>'
							taskhtml+='<h5 class="task-details-completed">'+rowObj.get('description')+'</h5>'
							taskhtml+='<h6 class="assign-to-text-completed">'
							  taskhtml+='  Assign to:' 
								taskhtml+='<span>'+rowObj.get('assignedToName')+'</span>'
								taskhtml+='<span class="delete-assigned"><img src="img/delete-gray.png" id="'+rowObj.get('taskID')+'" onclick="taskmthds.deletetask(this)"></span>'
						   taskhtml+=' </h6>'
						taskhtml+='</div>'
					  }
					 
						$('.cardlist').append(taskhtml);
						 console.log(rowObj.get('taskID'));
					  console.log(rowObj.get('deadline'));
					  console.log(rowObj.get('status'));
					  console.log(rowObj.get('assignedTo'));
					  console.log(rowObj.get('assignedToName'));
					  console.log(rowObj.get('taskTitle'));
					  console.log(rowObj.get('description'));
				 }
				  
		
				 
				 
				 
				},
				error:function(error){
					$("body").removeClass("ui-loading");
					cm.showToast(error);
				}
			})
			
		},loadguesttask : function() {
			//alert('calling guest')
			$('#all').bind('click',getAll); 
			 $('.cardlist').html(' ')
		    $('#all').addClass('selected-task-tab')
			if($('#pending').hasClass('selected-task-tab'))
				$('#pending').removeClass('selected-task-tab')
			if($('#completed').hasClass('selected-task-tab'))
				$('#completed').removeClass('selected-task-tab')
			var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("TaskManagement");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
		   TaskManagementQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
		   TaskManagementQuery.equalTo("assignedTo", localStorage.userId);
		   
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
					
			$("body").removeClass("ui-loading");
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
							 "July", "Aug", "Sept", "Oct", "Nov", "Dec"
							 ];
						
				
				 for(var i=0 ;i<results.length ; i++)
				 {    var taskhtml=""
					  var rowObj = results[i]
					  console.log(results.length)
					  console.log(rowObj.get('deadline'))
					  var day_date = rowObj.get('deadline').getDate();
					  var year = rowObj.get('deadline').getFullYear();
					  var month = rowObj.get('deadline').getMonth();
					  
					  if(rowObj.get('status')!='complete')
					  {
						taskhtml+=' <div class="profile-detail fbbox" style="padding-bottom:1px" id="'+rowObj.get('taskID')+'profile">'
						taskhtml+=' <h6 class="deadline-day-text"><img src="img/task-date.png">Deadline '+day_date+' '+monthNames[month]+' '+year+' '
						taskhtml+='    <span style="float:right;">'
						taskhtml+='    <h6 class="mark-complete-text">Mark Complete <img data-id="'+rowObj.get('taskID')+'" data-mark="incomplete" onclick="taskmthds.changestatusguest(this)" src="img/mark-complete.png"></h6>'
						taskhtml+='</span>'
						taskhtml+='	</h6>'
						
						if(rowObj.get('assignedTo') === rowObj.get('createdBy') )
						taskhtml+='	<h3 class="name-of-task taskname">'+rowObj.get('taskTitle') +'<img data-id="'+rowObj.get('taskID')+'" onclick="taskmthds.getdetails(this)"  src="img/edit-task.png"></h3>'
					    else
						taskhtml+='	<h3 class="name-of-task taskname">'+rowObj.get('taskTitle') +'<img  disabled="true" data-id="'+rowObj.get('taskID')+'"   src="img/edit-task.png"></h3>'
					
					
						taskhtml+='	<h5 class="task-details ">w'+rowObj.get('description')+'</h5>'
						taskhtml+='	<h6 class="assign-to-text">'
						taskhtml+='    Assign to: '
						taskhtml+='	<span>'+rowObj.get('assignedToName')+'</span>'
						if(rowObj.get('assignedTo') === rowObj.get('createdBy') )
						taskhtml+='	<span class="delete-assigned"><img src="img/delete-red.png" id="'+rowObj.get('taskID')+'" onclick="taskmthds.deletetask(this)"></span>'
					    else
						taskhtml+='	<span class="delete-assigned "><img src="img/delete-gray.png" id="'+rowObj.get('taskID')+'"></span>'	
						
						taskhtml+=' </h6>'
						taskhtml+='</div>'
					  }
					  else
					  {
						  
						  console.log('complete')
						 taskhtml+=' <div class="profile-detail fbbox" style="padding-bottom:1px" id="'+rowObj.get('taskID')+'profile">'
						 taskhtml+=' <h6 class="deadline-day-done"><img src="img/calendar-gray.png">Deadline '+day_date+' '+monthNames[month]+' '+year+' '
						  taskhtml+='  <span style="float:right;">'
						 taskhtml+=' <h6 class="completed-text">Completed <img data-mark="complete" src="img/completed.png"></h6>'
						   taskhtml+='</span>'
							taskhtml+='</h6>'
							taskhtml+='<h3 class="name-of-task-completed taskname">'+rowObj.get('taskTitle') +'</h3>'
							taskhtml+='<h5 class="task-details-completed">'+rowObj.get('description')+'</h5>'
							taskhtml+='<h6 class="assign-to-text-completed">'
							  taskhtml+='  Assign to:' 
								taskhtml+='<span>'+rowObj.get('assignedToName')+'</span>'
								taskhtml+='<span class="delete-assigned"><img src="img/delete-gray.png" id="'+rowObj.get('taskID')+'" onclick="taskmthds.deletetask(this)"></span>'
						   taskhtml+=' </h6>'
						taskhtml+='</div>'
					  }
					 
						$('.cardlist').append(taskhtml);
						 console.log(rowObj.get('taskID'));
					  console.log(rowObj.get('deadline'));
					  console.log(rowObj.get('status'));
					  console.log(rowObj.get('assignedTo'));
					  console.log(rowObj.get('assignedToName'));
					  console.log(rowObj.get('taskTitle'));
					  console.log(rowObj.get('description'));
				 }
				  
		
				 
				 
				 
				},
				error:function(error){
					$("body").removeClass("ui-loading");
					cm.showToast(error);
				}
			})
			
		},
		pendingList : function()
		{ 
		  if(localStorage.taskusertype == 'host') 
		  {
			$('.cardlist').html('')
			$('#pending').addClass('selected-task-tab')
			if($('#all').hasClass('selected-task-tab'))
				$('#all').removeClass('selected-task-tab')
			if($('#completed').hasClass('selected-task-tab'))
				$('#completed').removeClass('selected-task-tab')
			var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("TaskManagement");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
			TaskManagementQuery.equalTo("createdBy", localStorage.userId);
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
					
			$("body").removeClass("ui-loading");
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
							 "July", "Aug", "Sept", "Oct", "Nov", "Dec"
							 ];
						
				
				 for(var i=0 ;i<results.length ; i++)
				 {    var taskhtml=""
					  var rowObj = results[i]
					  console.log(i)
					  var day_date = rowObj.get('deadline').getDate();
					  var year = rowObj.get('deadline').getFullYear();
					  var month = rowObj.get('deadline').getMonth();
					  
					  if(rowObj.get('status')!='complete')
					  {
						taskhtml+=' <div class="profile-detail fbbox" style="padding-bottom:1px" id="'+rowObj.get('taskID')+'profile">'
						taskhtml+=' <h6 class="deadline-day-text"><img src="img/task-date.png">Deadline '+day_date+' '+monthNames[month]+' '+year+' '
						taskhtml+='    <span style="float:right;">'
						taskhtml+='    <h6 class="mark-complete-text">Mark Complete <img data-id="'+rowObj.get('taskID')+'" data-mark="incomplete" onclick="taskmthds.changependingstatus(this)" data-mark="incomplete"  src="img/mark-complete.png"></h6>'
						taskhtml+='</span>'
						taskhtml+='	</h6>'
						taskhtml+='	<h3 class="name-of-task taskname">'+rowObj.get('taskTitle') +'<img src="img/edit-task.png"></h3>'
						taskhtml+='	<h5 class="task-details">w'+rowObj.get('description')+'</h5>'
						taskhtml+='	<h6 class="assign-to-text">'
						taskhtml+='    Assign to: '
						taskhtml+='	<span>'+rowObj.get('assignedToName')+'</span>'
						taskhtml+='	<span class="delete-assigned"><img id="'+rowObj.get('taskID')+'" onclick="taskmthds.deleteptask(this)" src="img/delete-red.png"></span>'
						taskhtml+=' </h6>'
						taskhtml+='</div>'
					  }
					  else
					  {
						  
						  console.log('complete')
						  
						  
						
					  }
					 
						$('.cardlist').append(taskhtml);
						 console.log(rowObj.get('taskID'));
					  console.log(rowObj.get('deadline'));
					  console.log(rowObj.get('status'));
					  console.log(rowObj.get('assignedTo'));
					  console.log(rowObj.get('assignedToName'));
					  console.log(rowObj.get('taskTitle'));
					  console.log(rowObj.get('description'));
				 }
				  
		
				 
				 
				 
				},
				error:function(error){
					$("body").removeClass("ui-loading");
					cm.showToast(error);
				}
			})
			
		  }
		  else
		  {
			  	$('.cardlist').html('')
			$('#pending').addClass('selected-task-tab')
			if($('#all').hasClass('selected-task-tab'))
				$('#all').removeClass('selected-task-tab')
			if($('#completed').hasClass('selected-task-tab'))
				$('#completed').removeClass('selected-task-tab')
			var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("TaskManagement");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
			TaskManagementQuery.equalTo("assignedTo", localStorage.userId);
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
					
			$("body").removeClass("ui-loading");
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
							 "July", "Aug", "Sept", "Oct", "Nov", "Dec"
							 ];
						
				
				 for(var i=0 ;i<results.length ; i++)
				 {    var taskhtml=""
					  var rowObj = results[i]
					  console.log(i)
					  var day_date = rowObj.get('deadline').getDate();
					  var year = rowObj.get('deadline').getFullYear();
					  var month = rowObj.get('deadline').getMonth();
					  
					  if(rowObj.get('status')!='complete')
					  {
						taskhtml+=' <div class="profile-detail fbbox" style="padding-bottom:1px" id="'+rowObj.get('taskID')+'profile">'
						taskhtml+=' <h6 class="deadline-day-text"><img src="img/task-date.png">Deadline '+day_date+' '+monthNames[month]+' '+year+' '
						taskhtml+='    <span style="float:right;">'
						taskhtml+='    <h6 class="mark-complete-text">Mark Complete <img data-mark="incomplete"  src="img/mark-complete.png"></h6>'
						taskhtml+='</span>'
						taskhtml+='	</h6>'
						
						if(rowObj.get('assignedTo') === rowObj.get('createdBy') )
						taskhtml+='	<h3 class="name-of-task taskname">'+rowObj.get('taskTitle') +'<img data-id="'+rowObj.get('taskID')+'" onclick="taskmthds.getdetails(this)"  src="img/edit-task.png"></h3>'
					    else
						taskhtml+='	<h3 class="name-of-task taskname">'+rowObj.get('taskTitle') +'<img  disabled="true" data-id="'+rowObj.get('taskID')+'"   src="img/edit-task.png"></h3>'
					
						taskhtml+='	<h5 class="task-details">w'+rowObj.get('description')+'</h5>'
						taskhtml+='	<h6 class="assign-to-text">'
						taskhtml+='    Assign to: '
						taskhtml+='	<span>'+rowObj.get('assignedToName')+'</span>'
						if(rowObj.get('assignedTo') === rowObj.get('createdBy') )
						taskhtml+='	<span class="delete-assigned"><img src="img/delete-red.png" id="'+rowObj.get('taskID')+'" onclick="taskmthds.deletetask(this)"></span>'
					    else
						taskhtml+='	<span class="delete-assigned "><img src="img/delete-gray.png" id="'+rowObj.get('taskID')+'"></span>'
						taskhtml+=' </h6>'
						taskhtml+='</div>'
					  }
					  else
					  {
						  
						  console.log('complete')
						  
						  
						
					  }
					 
						$('.cardlist').append(taskhtml);
						 console.log(rowObj.get('taskID'));
					  console.log(rowObj.get('deadline'));
					  console.log(rowObj.get('status'));
					  console.log(rowObj.get('assignedTo'));
					  console.log(rowObj.get('assignedToName'));
					  console.log(rowObj.get('taskTitle'));
					  console.log(rowObj.get('description'));
				 }
				  
		
				 
				 
				 
				},
				error:function(error){
					$("body").removeClass("ui-loading");
					cm.showToast(error);
				}
			})
			  
		  }
			
		},
		getdetails : function(id) {
			var taskid = $(id).data('id') ; 
			localStorage.taskid=$(id).data('id')
			var TaskManagementClass = Parse.Object.extend("TaskManagement");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("taskID", $(id).data('id'));
		  
			TaskManagementQuery.find({
				success:function(results){ 
				var rowObj = results[0]
				 console.log(rowObj.get('taskID'));
					 // console.log(rowObj.get('deadline'));
					 // console.log(rowObj.get('status'));
					 // console.log(rowObj.get('assignedTo'));
					 // console.log(rowObj.get('assignedToName'));
					 // console.log(rowObj.get('taskTitle'));
					 // console.log(rowObj.get('description'));
				
				localStorage.tasktitle = rowObj.get('taskTitle')
				localStorage.desc = rowObj.get('description')
				localStorage.deadline = rowObj.get('deadline')
				localStorage.assinedto = rowObj.get('assignedTo')
				
				//assignedto
				//time
			
		   $(":mobile-pagecontainer").pagecontainer("change", "edit_task.html", {
				showLoadMsg: false
			});

				} ,
				error  : function(error) {
					
					cm.showAlert(error)
				} 
			});
			
		},
		completedList : function() {
			
			  if(localStorage.taskusertype == 'host') 
		  {
			$('.cardlist').html('')
				$('#completed').addClass('selected-task-tab')
			if($('#all').hasClass('selected-task-tab'))
				$('#all').removeClass('selected-task-tab')
			if($('#pending').hasClass('selected-task-tab'))
				$('#pending').removeClass('selected-task-tab')
			var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("TaskManagement");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
			TaskManagementQuery.equalTo("createdBy", localStorage.userId);
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
					
			$("body").removeClass("ui-loading");
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
							 "July", "Aug", "Sept", "Oct", "Nov", "Dec"
							 ];
						
				
				 for(var i=0 ;i<results.length ; i++)
				 {    var taskhtml=""
					  var rowObj = results[i]
					  console.log(i)
					  var day_date = rowObj.get('deadline').getDate();
					  var year = rowObj.get('deadline').getFullYear();
					  var month = rowObj.get('deadline').getMonth();
					  
					  if(rowObj.get('status')=='complete')
					  {
						taskhtml+=' <div class="profile-detail fbbox" style="padding-bottom:1px" id="'+rowObj.get('taskID')+'profile">'
						 taskhtml+=' <h6 class="deadline-day-done"><img src="img/calendar-gray.png">Deadline '+day_date+' '+monthNames[month]+' '+year+' '
							  taskhtml+='  <span style="float:right;">'
								   taskhtml+=' <h6 class="completed-text">Completed <img data-mark="complete" src="img/completed.png"></h6>'
								taskhtml+='</span>'
							taskhtml+='</h6>'
							taskhtml+='<h3 class="name-of-task-completed taskname">'+rowObj.get('taskTitle') +'</h3>'
							taskhtml+='<h5 class="task-details-completed">'+rowObj.get('description')+'</h5>'
							taskhtml+='<h6 class="assign-to-text-completed">'
							  taskhtml+='  Assign to:' 
								taskhtml+='<span>'+rowObj.get('assignedToName')+'</span>'
								taskhtml+='<span class="delete-assigned"><img src="img/delete-gray.png"  id="'+rowObj.get('taskID')+'" onclick="taskmthds.deletetask(this)" ></span>'
						   taskhtml+=' </h6>'
						taskhtml+='</div>'
					  }
					  else
					  {
						  
						  console.log('complete')
						  
						  
						 
					  }
					 
						$('.cardlist').append(taskhtml);
					  console.log(rowObj.get('taskID'));
					  console.log(rowObj.get('deadline'));
					  console.log(rowObj.get('status'));
					  console.log(rowObj.get('assignedTo'));
					  console.log(rowObj.get('assignedToName'));
					  console.log(rowObj.get('taskTitle'));
					  console.log(rowObj.get('description'));
				 }
				  
		
				 
				 
				 
				},
				error:function(error ){
					$("body").removeClass("ui-loading");
					cm.showToast(error);
				}
			})
				}
			else 
			{
				
				$('.cardlist').html('')
				$('#completed').addClass('selected-task-tab')
			if($('#all').hasClass('selected-task-tab'))
				$('#all').removeClass('selected-task-tab')
			if($('#pending').hasClass('selected-task-tab'))
				$('#pending').removeClass('selected-task-tab')
			var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
			var TaskManagementClass = Parse.Object.extend("TaskManagement");
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("weddingID", weddingDetailsObject.weddingId);
			TaskManagementQuery.equalTo("assignedTo", localStorage.userId);
		   $("body").addClass("ui-loading");
			TaskManagementQuery.find({
				success:function(results){
					
			$("body").removeClass("ui-loading");
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
							 "July", "Aug", "Sept", "Oct", "Nov", "Dec"
							 ];
						
				
				 for(var i=0 ;i<results.length ; i++)
				 {    var taskhtml=""
					  var rowObj = results[i]
					  console.log(i)
					  var day_date = rowObj.get('deadline').getDate();
					  var year = rowObj.get('deadline').getFullYear();
					  var month = rowObj.get('deadline').getMonth();
					  
					  if(rowObj.get('status')=='complete')
					  {
						taskhtml+=' <div class="profile-detail fbbox" style="padding-bottom:1px" id="'+rowObj.get('taskID')+'profile">'
						 taskhtml+=' <h6 class="deadline-day-done"><img src="img/calendar-gray.png">Deadline '+day_date+' '+monthNames[month]+' '+year+' '
							  taskhtml+='  <span style="float:right;">'
								   taskhtml+=' <h6 class="completed-text">Completed <img data-mark="complete" src="img/completed.png"></h6>'
								taskhtml+='</span>'
							taskhtml+='</h6>'
							taskhtml+='<h3 class="name-of-task-completed taskname">'+rowObj.get('taskTitle') +'</h3>'
							taskhtml+='<h5 class="task-details-completed">'+rowObj.get('description')+'</h5>'
							taskhtml+='<h6 class="assign-to-text-completed">'
							  taskhtml+='  Assign to:' 
								taskhtml+='<span>'+rowObj.get('assignedToName')+'</span>'
								taskhtml+='<span class="delete-assigned"><img src="img/delete-gray.png"  id="'+rowObj.get('taskID')+'" onclick="taskmthds.deletetask(this)" ></span>'
						   taskhtml+=' </h6>'
						taskhtml+='</div>'
					  }
					  else
					  {
						  
						  console.log('complete')
						  
						  
						 
					  }
					 
						$('.cardlist').append(taskhtml);
					  console.log(rowObj.get('taskID'));
					  console.log(rowObj.get('deadline'));
					  console.log(rowObj.get('status'));
					  console.log(rowObj.get('assignedTo'));
					  console.log(rowObj.get('assignedToName'));
					  console.log(rowObj.get('taskTitle'));
					  console.log(rowObj.get('description'));
				 }
				  
		
				 
				 
				 
				},
				error:function(error ){
					$("body").removeClass("ui-loading");
					cm.showToast(error);
				}
			})
				
				
			}
			
		},
		deletetask : function(id) {
			//delete task n update list 
			//pass tak id
			
					//pass tak id
			var taskid = $(id).attr('id')
			taskmthds.taskid=0
	taskmthds.taskid=taskid
  navigator.notification.confirm(
        'Do you want to delete this task ?', 
        deletecat, // <-- no brackets
        'Delete Task',
        ['Ok','Cancel']
    );
		/*		var TaskManagementClass = Parse.Object.extend('TaskManagement');
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("taskID", taskid);
		   TaskManagementQuery.find({
				success:function(foundWish){
				
					foundWish[0].destroy({
						success:function(deletedWishSuccess){
							$('#'+taskid+"profile").hide()
						cm.showAlert('deleted')
						//taskmthds.loadtask()
						},
						error:function(deleteWishError){
							
							cm.showAlert(deleteWishError);
						}
					})
				},
				error:function(wishError){
					
					cm.showAlert("error");
				}
			})*/
	
			
		},
		edittask : function() {
			
			
		},
		deleteptask : function(id) {
			//delete task n update list 
			//pass tak id
			var taskid = $(id).attr('id')
	taskmthds.taskid=taskid
  navigator.notification.confirm(
        'Do you want to delete Task ?', 
        deletecat, // <-- no brackets
        'Delete Task',
        ['Ok','Cancel']
    );
			
		},
		
		gettaskdetails : function() {
			//same as loadTask
			
		},
		changestatus : function(id) {
			var taskid = $(id).data('id')
			var TaskManagementClass = Parse.Object.extend('TaskManagement');
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("taskID", taskid);
			TaskManagementQuery.first( {
					  success: function(results) {
						  
					results.save(null, {
									success: function (results) {

									   results.set("status", 'complete');

										results.save();
										taskmthds.loadhosttask()
										//$(id).attr('src' ,'img/completed.png' )
										
									}
								});
						
					  },
					  error: function(point, error) {
						 cm.showAlert(error)
						
					  }
			});
		},changependingstatus : function(id) {
			var taskid = $(id).data('id')
			var TaskManagementClass = Parse.Object.extend('TaskManagement');
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("taskID", taskid);
			TaskManagementQuery.first( {
					  success: function(results) {
						  
					results.save(null, {
									success: function (results) {

									   results.set("status", 'complete');

										results.save();
										$('#'+taskid+'profile').hide();
										//taskmthds.loadhosttask()
										//$(id).attr('src' ,'img/completed.png' )
										
									}
								});
						
					  },
					  error: function(point, error) {
						 cm.showAlert(error)
						
					  }
			});
		},
		changestatusguest : function(id) {
			var taskid = $(id).data('id')
			var TaskManagementClass = Parse.Object.extend('TaskManagement');
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("taskID", taskid);
			TaskManagementQuery.first( {
					  success: function(results) {
						  
					results.save(null, {
									success: function (results) {

									   results.set("status", 'complete');

										results.save();
										taskmthds.loadguesttask()
										//$(id).attr('src' ,'img/completed.png' )
										
									}
								});
						
					  },
					  error: function(point, error) {
						 cm.showAlert(error)
						
					  }
			});
		},
		addTask :function()
		{
			//add to favcard table and
			var tasktitle =""
			var taskdesc =""
			var deadline =""
			tasktitle= $('#tasktitle').val() 
			
			//new Date($('#html5dateinput').val());
			deadline = new Date($("#wedDateinput").val());
			taskdesc= $('#taskdesc').val()
			var name = $('#day :selected').text();
			var id =  $('#day :selected').attr('value');
		/*	if($('#tasktitle').val()=="")
			{
				cm.showAlert('title required')
			}
			else
			{
				tasktitle= $('#tasktitle').val() 
			}
		if($('#taskdesc').val()=="")
		{
		cm.showAlert('title required') }
			else
			{taskdesc= $('#taskdesc').val() }
		
		if ($("#wedDateinput").val() == "")
				cm.showAlert("Please choose deadline");
			else if (cm.isFuture($("#wedDateinput").val())) {
				cm.showAlert("Deadline must be greater then today's date");
		else
		{
			deadline = $("#wedDateinput").val();
		}		
		*/
				var addfavClass = Parse.Object.extend('TaskManagement');
				var addfavObj = new addfavClass();
				var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
				addfavObj.set("weddingID", weddingDetailsObject.weddingId);
				addfavObj.set("taskTitle", tasktitle);
				addfavObj.set('status','incomplete');
				addfavObj.set('description',taskdesc);
				addfavObj.set('deadline',deadline);
				addfavObj.set('assignedTo',id);
				addfavObj.set('assignedToName',name);
				addfavObj.set('createdBy',localStorage.userId);
				 addfavObj.save(null, {
					success: function(wishResults) {
						addfavObj.set("taskID", wishResults.id);
					  addfavObj.save();
					 $(":mobile-pagecontainer").pagecontainer("change", "all_task.html", {
				showLoadMsg: false
			});
				   
				   },
					error: function(gameScore, error) {
						 cm.showAlert(error);
					}
				})
			
		},
		createtask : function()
		{
			
			 $(":mobile-pagecontainer").pagecontainer("change", "create_Task.html", {
				showLoadMsg: false
			});
		},
		updateTask :function() {
			   var tasktitle =""
			var taskdesc =""
			var deadline =""
			tasktitle= $('#tasktitle').val() 
			var name = $('#day :selected').text();
			var id =  $('#day :selected').attr('value');
			//new Date($('#html5dateinput').val());
			//console.log(rowObj.get('assignedTo'));
					 // console.log(rowObj.get('assignedToName'));
			deadline = new Date($("#wedDateinput").val());
			//alert(deadline);
			taskdesc= $('#taskdesc').val()
			var TaskManagementClass = Parse.Object.extend('TaskManagement');
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("taskID", localStorage.taskid);
			TaskManagementQuery.first( {
					  success: function(results) {
						
					results.save(null, {
									success: function (results) {

									  
			 var weddingDetailsObject = JSON.parse(localStorage.weddingDetailsObject);
				results.set("weddingID", weddingDetailsObject.weddingId);
				results.set("taskTitle", tasktitle);
				results.set('status','incomplete');
				results.set('description',taskdesc);
				results.set('deadline',deadline);
				
				results.set('assignedTo',id);
				results.set('assignedToName',name);

										results.save();
										cm.showToast('task updated')
		 $(":mobile-pagecontainer").pagecontainer("change", "all_task.html", {
				showLoadMsg: false
			});
				
										
									}
								});
						
					  },
					  error: function(point, error) {
						 cm.showAlert(error)
						
					  }
			});
			
			
		},
		showSeach : function()
		{
			
			 $('.search-task').show();
		}
		
		
		
	};
	
	
	
$(document).on("keyup", "#entertask",function() {
    var g = $(this).val().toLowerCase();
    $(".fbbox .taskname").each(function(index) {
		  console.log(index)
		 var s = $(this).clone().children().remove().end().text().toLowerCase();
		console.log(s)
        $(this).closest('.fbbox')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
    });
});


	$(document).on('click' , '#hidebtn', function () {
          $('#entertask').val(' ');
           $('.search-task').hide();
         
		   
		   $(".fbbox").each(function() {
        if($(this).hide())
		     $(this).show();
           
		   //$('.search').slideUp();
        
    });
	
	
	  });
	  
	  	$(document).on('click' , '#clearbtn', function () {
          $('#entertask').val(' ');
		        $(".fbbox").each(function() {
        if($(this).hide())
		     $(this).show();
            $('#entertask').focus();
		   //$('.search').slideUp();
        
    });
      
	  }); 
	  
	/* $(document).on('click', '#all', function() {
            $('.cardlist').html(' ')
			alert('allclicked')
			$(this).on("click",function(){return false;});
			//$('#all').addClass('disabled')
            if (localStorage.taskusertype == 'host') {
                taskmthds.loadhosttask();
            } else {
                taskmthds.loadguesttask();
            }
		
        });
	/*	$('#all').bind('click', function() {
            $('.cardlist').html(' ')
			alert('allclicked')
			$('#all').unbind("click");
			//$('#all').addClass('disabled')
            if (localStorage.taskusertype == 'host') {
                taskmthds.loadhosttask();
            } else {
                taskmthds.loadguesttask();
            }
		
        });  */

			$('#all').bind('click',getAll); 
	  
function deletecat(buttonIndex)
{
	if(buttonIndex=='1')
	{
	$("body").addClass("ui-loading");
				
		var TaskManagementClass = Parse.Object.extend('TaskManagement');
			var TaskManagementQuery = new Parse.Query(TaskManagementClass);
			TaskManagementQuery.equalTo("taskID", taskmthds.taskid);
		   TaskManagementQuery.find({
				success:function(foundWish){
				
					foundWish[0].destroy({
						success:function(deletedWishSuccess){
							$("body").removeClass("ui-loading");
						cm.showToast('deleted')
						$('#'+taskmthds.taskid+"profile").hide()
						//taskmthds.pendingList()
						},
						error:function(deleteWishError){
							
							cm.showAlert(deleteWishError);
						}
					})
				},
				error:function(wishError){
					$("body").removeClass("ui-loading");
					cm.showAlert("error");
				}
			})
	}
}

function  getAll() {
  //alert('train is clicked');
  //do some stuff
  $('#all').unbind('click',getAll); 
   if (localStorage.taskusertype == 'host') {
                taskmthds.loadhosttask();
            } else {
                taskmthds.loadguesttask();
            }
}