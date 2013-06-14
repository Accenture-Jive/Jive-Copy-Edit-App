
var isChecked=new Boolean();
	var sourceCommentSelfURL = '';
	var targetCommentSelfURL = '';
	var sourceCommentParentUrl = '';
	var targetPostResponseObj;
	var commentsSelfURLMap = {};
	var commentsPostURLMap = {};
	var commentflag=false;
	var commentDataResponse;
	var commentDataIndex=0;
	var contentCreationResponse;
	var redirectHrefLocation;
	
var to_sel_place='';
var commentData='';
var messageData='';
var parentUrl='';
var docIndex='';
var disIndex='';
var pollIndex='';
var blogIndex='';
var hasAttachment=false;
var docID='';
var pollOptions='';
var timeStamp='';
var docUrl='';
var docContent='';
var docSubject='';

var browserName='';
var loggedUser='';
var loggedUserName='';

var space_url='';
var to_url='';
var redirection_url='';
var source_html_url='';

var files_row='';
var docs_row='';
var disc_row='';
var idea_row='';
var blog_row='';
var poll_row='';

var src_space_name='';
var dest_space_name='';

var to_place_blog_url='';
var Grp_file_json='';
var Grp_doc_json='';
var Grp_idea_json='';
var Grp_disc_json='';
var Grp_blog_json='';
var Grp_poll_json='';
var msg2='Please select a place.';

function showLoading() 
{
$("#maskLoad").mask("Please Wait...");
}

function hideLoading() 
{

$("#maskLoad").unmask();
}   

function handleResponse(data) 
{
alert("Error in Application..!!");
console.log(data);    		
}

function onPageLoad() 
{
var myPopup = document.getElementById('to_place');
//alert(myPopup.options[2].value);
if(myPopup.options[2].value=='my_place')
{
to_sel_place='my_place';
document.getElementById("start_copying_button").style.visibility="visible";	
$("#change_selection_div").show();
}
//alert(myPopup.options[2].selected);
osapi.people.get({
userId : '@me'
}).execute(function(response) {
//alert(JSON.stringify(response));
loggedUser =response.id; 
loggedUserName=response.name.formatted;
//alert("loggedUser: "+loggedUser);
//alert("loggedUserName: "+loggedUserName);
});

 var  valDate= new Date().toISOString();
 var  dateandTime=valDate.substring(0,10);
 var  hrsAndMins=valDate.substring(11,19);
 var secVal=hrsAndMins.replace(/:/g,'-');  
 timeStamp= dateandTime+'-'+secVal;
 //console.log(timeStamp);
 
//document.getElementById("to_place").disabled = true;

navigator.sayswho= (function(){    
	var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	M= M? [M[1]]: [N];

	browserName=M;
    //alert("Browser: "+browserName);   
})();

//console.log(document.referrer);
var path=document.referrer;
docIndex=path.indexOf('DOC-');
disIndex=path.indexOf('thread');
pollIndex=path.indexOf('polls');
blogIndex=path.indexOf('/blog/');
/*osapi.jive.core.getObject({
      type:'post', 
      findUrl:'/blog/', 
      jsonPath:'/'
    }).execute(function(response) { console.log(JSON.stringify(response)); });*/
if(disIndex!=-1)
{
var disID= path.substring(disIndex+7,path.length);
var request = osapi.jive.corev3.contents.get({
entityDescriptor:[1,disID]
});
// execute the request
request.execute(function(response) {
//console.log("DATA: "+JSON.stringify(response));
docContent=response.list[0].content;
docSubject=response.list[0].subject;
parentUrl=response.list[0].parent;
if(response.list[0].resources.hasOwnProperty('messages'))
{
 var messages = response.list[0].getReplies();
 messages.execute(function(data) {
 messageData=data;
 });
 }
});
}

if(pollIndex!=-1)
{
var pollID= path.substring(pollIndex+6,path.length);
var request = osapi.jive.corev3.contents.get({
entityDescriptor:[18,pollID]
});

// execute the request
request.execute(function(response) {
pollOptions=response.list[0].options;
docContent=response.list[0].content;
docSubject=response.list[0].subject;
parentUrl=response.list[0].parent;
	sourceCommentSelfURL = response.list[0].resources.self.ref;
//alert("subject : "+docSubject);
console.log(JSON.stringify(response));
//alert(response.list[0].resources.hasOwnProperty('comments'));
if(response.list[0].resources.hasOwnProperty('comments'))
{
 var comments = response.list[0].getComments();
 comments.execute(function(data) {
 commentData=data;
 console.log("commentData : 167 :"+JSON.stringify(commentData));
 });
 }
});
}

//console.log(docIndex);
if(docIndex!=-1)
{
docID= path.substring(docIndex+4,path.length);
var request = osapi.jive.corev3.contents.get({
entityDescriptor:[102,docID]
});
// execute the request
request.execute(function(response) {
//console.log("DATA: "+JSON.stringify(response));
hasAttachment=response.list[0].hasOwnProperty('binaryURL');
if(!hasAttachment)
{
docContent=response.list[0].content;
docSubject=response.list[0].subject;
parentUrl=response.list[0].parent;

if(response.list[0].resources.hasOwnProperty('comments'))
{
 var comments = response.list[0].getComments();
 comments.execute(function(data) {
 commentData=data;
 });
 }
}
else
{
docUrl=response.list[0].resources.self.ref;
docContent=response.list[0].content;
docSubject=response.list[0].subject;
parentUrl=response.list[0].parent;
}
});
}
if(blogIndex!=-1)
{
//processListByPage(request);

showLoading();
document.getElementById("start_copying_button").style.visibility="hidden";	
$("#change_selection_div").hide();
var searchStr= path.substring(path.lastIndexOf('/')+1,path.length);
//console.log(searchStr);
 //searchStr=searchStr.replace(/-/g,' ');
 //searchStr=searchStr.replace(/[0-9]/g, '');
  //searchStr=searchStr.replace(/ /g, '* ');
 //console.log(searchStr); 
 var i=3000;
 var countVal=0;

 while(countVal<=i)
 {
 //if(parentUrl!='')
 //break;
var request = osapi.jive.corev3.contents.get({
    fields: ['parent,permalink,subject,content'],
	type:'post',
	count:100,
	startIndex:[countVal]
	});
	
// execute the request
request.execute(function(response) {
//console.log("DATA: "+JSON.stringify(response));
//if (response.getNextPage) {
//console.log("getNextPage: "+JSON.stringify(response.getNextPage()));
//} 
var listCount=response.list.length;
for(var i=0;i<listCount;i++)
{
if(path==response.list[i].permalink)
{
hideLoading();
document.getElementById("start_copying_button").style.visibility="visible";	
$("#change_selection_div").show();
docSubject=response.list[i].subject;
docContent=response.list[i].content;
parentUrl=response.list[i].parent;
if(response.list[i].resources.hasOwnProperty('comments'))
{
 var comments = response.list[i].getComments();
 comments.execute(function(data) {
 commentData=data;
 });
 }
}
}
});
countVal=countVal+25;
}
}
/*
else
{
//console.log("Copying the selected content type is not yet available!");
$("#dialog").show();
$("#dialog").dialog();
document.getElementById("start_copying_button").disabled = true;
document.getElementById("to_place").disabled = true;
}
*/
}

function processListByPage(request)
{
}
function toPlace()
{

var to_place = document.getElementById("to_place");
to_sel_place = to_place.options[to_place.selectedIndex].value;
//alert("selected_value method_one: "+selected_value);

if(to_sel_place=="to_space"){
toSpaceRequest();
}
else if(to_sel_place=="to_group"){
toGroupRequest();
}
else if(to_sel_place=="to_project"){
toProjectRequest();
}
else if(to_sel_place=="select_to"){
document.getElementById("start_copying_button").style.visibility="hidden";	
$("#change_selection_div").hide();
//document.getElementById("copyTo").style.visibility="hidden";
}
else if(to_sel_place=="this_to"){
if(parentUrl!='')
{
document.getElementById("start_copying_button").style.visibility="visible";
$("#change_selection_div").show();
to_url=parentUrl;
to_place_blog_url=parentUrl;
}
else
{
alert('Please wait, Loading..');
}
}
else if(to_sel_place=="my_place"){
document.getElementById("start_copying_button").style.visibility="visible";	
$("#change_selection_div").show();
}
}


function toSpaceRequest() {
var to_place_name='';
document.getElementById("to_project").innerHTML=msg2;
document.getElementById("to_group").innerHTML=msg2;
document.getElementById("to_space").innerHTML=msg2;
var params = {
type : "space",
success : ( function(data){
//console.log("DATA: "+JSON.stringify(data));
to_place_name=data.name;
if(data.resources.hasOwnProperty('blog'))
{	
to_place_blog_url=data.resources.blog.ref;
}
//showing execute button		

if(to_place_name!='')
{
if(src_space_name==to_place_name)
{
//alert("The source place and destination place should be different..!!");
document.getElementById("start_copying_button").style.visibility="hidden";	
$("#change_selection_div").hide();
//document.getElementById("copyTo").style.visibility="hidden";
document.getElementById("to_space").innerHTML=msg2;
$("#dialog").show();
$("#dialog").dialog();
}
else
{	
//alert("inside else..!!");

var dialog_obj = $("#dialog");
dialog_obj.dialog("close");

//$("#copyTo").text("Copy this:").append('<br/>');

document.getElementById("start_copying_button").style.visibility="visible";
$("#change_selection_div").show();
//document.getElementById("copyTo").style.visibility="visible";
document.getElementById("to_space").innerHTML='<span id="myId" style="text-decoration:underline;">Space</span>'+': '+to_place_name;	
}
}
to_url=data.resources.self.ref;
redirection_url=data.resources.html.ref;
dest_space_name=to_place_name;

//changing the selection to 'Change Place'	   
$("#to_place option").each(function() {
if($(this).text() == 'Select Place') {
$(this).attr('selected', 'selected'); 
$('#to_place :selected').text('Change Place');	
}
else if($(this).text() == 'Change Place')
{  
$('#to_place option:[text="' + $(this).text() + '"]').attr('selected', true);  
}
});

$("#to_space").show();
$("#to_group").hide();
$("#to_project").hide();
} ),
error : handleResponse  };
//hiding execute button
if(to_place_name=='')
{
//document.getElementById("start_copying_button").style.visibility="hidden";	
//document.getElementById("copyTo").style.visibility="hidden";
$("#change_selection_div").hide();
document.getElementById("to_space").innerHTML=msg2;
//document.getElementById("to_space").innerHTML='<span id="myId" style="text-decoration:underline;">Space</span>'+': '+dest_space_name;
$("#to_place option").each(function() {
if($(this).text() == 'Select Place') {
$(this).attr('selected', 'selected'); 
$('#to_place :selected').text('Change Place');	
}
else if($(this).text() == 'Change Place')
{  
$('#to_place option:[text="' + $(this).text() + '"]').attr('selected', true);  
}
});	
}

osapi.jive.corev3.places.requestPicker(params);
}

function toGroupRequest() {
var to_place_name='';
document.getElementById("to_project").innerHTML=msg2;
document.getElementById("to_group").innerHTML=msg2;
document.getElementById("to_space").innerHTML=msg2;
var params = {
type : "group",
success : ( function(data){
//console.log("DATA: "+JSON.stringify(data));
to_place_name=data.name;
if(data.resources.hasOwnProperty('blog'))
{	
to_place_blog_url=data.resources.blog.ref;	
}
//showing execute button		
if(to_place_name!='')
{
if(src_space_name==to_place_name)
{
//alert("The source place and destination place should be different..!!");
document.getElementById("start_copying_button").style.visibility="hidden";	
$("#change_selection_div").hide();
//document.getElementById("copyTo").style.visibility="hidden";
document.getElementById("to_group").innerHTML=msg2;
$("#dialog").show();
$("#dialog").dialog();
}
else
{		
//alert("inside group else..!!");

var dialog_obj = $("#dialog");
dialog_obj.dialog("close");
//$("#copyTo").text("Copy this:").append('<br/>');

document.getElementById("to_place").disabled = false; 	
document.getElementById("start_copying_button").style.visibility="visible";
$("#change_selection_div").show();
//document.getElementById("copyTo").style.visibility="visible";
document.getElementById("to_group").innerHTML='<span id="myId" style="text-decoration:underline;">Group</span>'+': '+to_place_name;	
}
}

to_url=data.resources.self.ref;
redirection_url=data.resources.html.ref;
dest_space_name=to_place_name;


//changing the selection to 'Change Place'	   
$("#to_place option").each(function() {
if($(this).text() == 'Select Place') {
$(this).attr('selected', 'selected'); 
$('#to_place :selected').text('Change Place');	
}
else if($(this).text() == 'Change Place')
{  
$('#to_place option:[text="' + $(this).text() + '"]').attr('selected', true);  
}
});	

$("#to_space").hide();
$("#to_group").show();
$("#to_project").hide();
} ),
error : handleResponse  };

if(to_place_name=='')
{
//document.getElementById("start_copying_button").style.visibility="hidden";	
//document.getElementById("copyTo").style.visibility="hidden";
//document.getElementById("copyTo").style.visibility="hidden";
$("#change_selection_div").hide();
document.getElementById("to_group").innerHTML=msg2;
//document.getElementById("to_group").innerHTML='<span id="myId" style="text-decoration:underline;">Group</span>'+': '+dest_space_name;	
$("#to_place option").each(function() {
if($(this).text() == 'Select Place') {
$(this).attr('selected', 'selected'); 
$('#to_place :selected').text('Change Place');	
}
else if($(this).text() == 'Change Place')
{  
$('#to_place option:[text="' + $(this).text() + '"]').attr('selected', true);  
}
});	
}

osapi.jive.corev3.places.requestPicker(params);
}

function toProjectRequest() {
var to_place_name='';
document.getElementById("to_project").innerHTML=msg2;
document.getElementById("to_group").innerHTML=msg2;
document.getElementById("to_space").innerHTML=msg2;
var params = {
type : "project",
success : ( function(data){
//console.log("DATA: "+JSON.stringify(data));
to_place_name=data.name;
if(data.resources.hasOwnProperty('blog'))
{
to_place_blog_url=data.resources.blog.ref;	
}
//showing execute button		
if(to_place_name!='')
{
if(src_space_name==to_place_name)
{
//alert("The source place and destination place should be different..!!");
document.getElementById("start_copying_button").style.visibility="hidden";	
$("#change_selection_div").hide();
//document.getElementById("copyTo").style.visibility="hidden";
document.getElementById("to_project").innerHTML=msg2;
$("#dialog").show();
$("#dialog").dialog();
}
else
{
//alert("inside project else..!!");

var dialog_obj = $("#dialog");
dialog_obj.dialog("close");
//$("#copyTo").text("Copy this:").append('<br/>');
//document.getElementById("to_place").disabled = false;
document.getElementById("start_copying_button").style.visibility="visible";
$("#change_selection_div").show();
//document.getElementById("copyTo").style.visibility="visible";		
document.getElementById("to_project").innerHTML='<span id="myId" style="text-decoration:underline;">Project</span>'+': '+to_place_name;

}
}

to_url=data.resources.self.ref;
redirection_url=data.resources.html.ref;
dest_space_name=to_place_name;

//changing the selection to 'Change Place'	   
$("#to_place option").each(function() {
if($(this).text() == 'Select Place') {
$(this).attr('selected', 'selected'); 
$('#to_place :selected').text('Change Place');	
}
else if($(this).text() == 'Change Place')
{  
$('#to_place option:[text="' + $(this).text() + '"]').attr('selected', true);  
}
});		

$("#to_space").hide();
$("#to_group").hide();
$("#to_project").show();
} ),
error : handleResponse  };

if(to_place_name=='')
{
//document.getElementById("start_copying_button").style.visibility="hidden";	
//document.getElementById("copyTo").style.visibility="hidden";
$("#change_selection_div").hide();
//document.getElementById("copyTo").style.visibility="visible";
document.getElementById("to_project").innerHTML=msg2;
//document.getElementById("to_project").innerHTML='<span id="myId" style="text-decoration:underline;">Project</span>'+': '+dest_space_name;
$("#to_place option").each(function() {
if($(this).text() == 'Select Place') {
$(this).attr('selected', 'selected'); 
$('#to_place :selected').text('Change Place');	
}
else if($(this).text() == 'Change Place')
{  
$('#to_place option:[text="' + $(this).text() + '"]').attr('selected', true);  
}
});	
}

osapi.jive.corev3.places.requestPicker(params);
}

function startCopying(){
$("#start_copying_button").hide();
$("#to_place").hide();
document.getElementById("newUpSel").style.visibility="hidden";
if(browserName=="MSIE")
{
//alert("inside if msie");
var finalurl=redirection_url+'/content';
var ieSpan='<span id="ieSpan" style="font-family:Tahoma;font-size:12px;font-color:#3778C7;">Copying in Progress.<br>Please leave this window open until the copying process has been completed.</span>';
document.getElementById("selected_items").innerHTML=ieSpan; 

dest_space_name=dest_space_name.toLowerCase();
dest_space_name=dest_space_name.replace(/[^a-z0-9-\s]/gi, '').replace(/[_\s]/g, '-');

space_url='';
Grp_file_json='';
Grp_idea_json='';
Grp_disc_json='';
Grp_blog_json='';
Grp_poll_json='';
//loggedUser='';
//loggedUserName='';

Grp_doc_json=docUrl;

var	postDoc = {
	type : "document",
	subject : "",
	content : {
		text : "",
		type : ""
	},
	parent : ""
	}
	postDoc.subject = docSubject+' ('+timeStamp+')';
	postDoc.content = docContent;
	postDoc.parent = to_url;
    osapi.jive.corev3.documents.create(postDoc).execute(onContentCreated);
	
}
else
{
var iframe = '<iframe id="frame1" src = "javascript:"&nbsp;" style="width:250px;height:90px;margin-top:0px;font-family:Tahoma"></iframe>';
document.getElementById("selected_items").innerHTML=iframe;  
//$("#copyTo").text("Copying this:");

dest_space_name=dest_space_name.toLowerCase();
dest_space_name=dest_space_name.replace(/[^a-z0-9-\s]/gi, '').replace(/[_\s]/g, '-');

var initialMsg='Please wait, initialising copying..';
document.getElementById("frame1").contentDocument.body.style.fontFamily="Tahoma";	
document.getElementById("frame1").contentDocument.body.style.fontSize = "12px";
document.getElementById("frame1").contentDocument.body.style.color='Grey';
document.getElementById("frame1").contentDocument.body.innerHTML = "Copying in Progress.<br>Please leave this window open until the copying process has been completed.<br><br><span id='mySpan' style='font-weight:bold;'>"+initialMsg.fontcolor("#3778C7")+"</span>";

/*space_url='';
Grp_file_json='';
Grp_idea_json='';
Grp_disc_json='';
Grp_blog_json='';
Grp_poll_json='';
loggedUser='';
loggedUserName='';

Grp_doc_json=docUrl;
*/

var	postJson = {
	type : "",	
	subject : "",
	content : {
		text : "",
		type : ""
	},
	parent : ""
	}

	postJson.subject = docSubject+' ('+timeStamp+')';
	postJson.content = docContent;
	postJson.parent = to_url;
	if(docIndex!=-1)
	{
	postJson.type = 'document';
	if(!hasAttachment)
	{
	if(to_sel_place =='my_place')
	{
	postJson.visibility='hidden';
	delete postJson.parent;
	}
	osapi.jive.corev3.documents.create(postJson).execute(onContentCreated);
	}
	else
	{
	var iframe = '<iframe id="frame1" src = "" style="width:650px;height:90px;margin-top:0px;font-family:Tahoma"></iframe>';
    document.getElementById("selected_items").innerHTML=iframe;  
	
dest_space_name=dest_space_name.toLowerCase();
dest_space_name=dest_space_name.replace(/[^a-z0-9-\s]/gi, '').replace(/[_\s]/g, '-');

var initialMsg='Please wait, initialising copying..';
document.getElementById("frame1").contentDocument.body.style.fontFamily="Tahoma";	
document.getElementById("frame1").contentDocument.body.style.fontSize = "12px";
document.getElementById("frame1").contentDocument.body.style.color='Grey';
document.getElementById("frame1").contentDocument.body.innerHTML = "Copying in Progress.<br>Please leave this window open until the copying process has been completed.<br><br><span id='mySpan' style='font-weight:bold;'>"+initialMsg.fontcolor("#3778C7")+"</span>";

space_url='';
Grp_doc_json='';
Grp_idea_json='';
Grp_disc_json='';
Grp_blog_json='';
Grp_poll_json='';
//loggedUser='';
//loggedUserName='';

Grp_file_json=docUrl;
osapi.http.get({
'href' : 'http://54.247.84.129:8081/UAT/AIServlet?app-name=copy-edit&inc_comments='+isChecked+'&my_place='+to_sel_place+'&srcgroup_place_url='+space_url+'&target_groupurl='+to_url+'&src_group_file='+Grp_file_json+'&src_group_document='+Grp_doc_json+'&src_idea='+Grp_idea_json+'&src_discussion='+Grp_disc_json+'&src_blog='+Grp_blog_json+'&src_poll='+Grp_poll_json+'&logged-user='+loggedUser+'&logged-userName='+loggedUserName+'&group-name='+dest_space_name,
'format' : 'json',
'authz' : 'signed'
}).execute(refreshiframe);
	}
	}
	else if(disIndex!=-1)
	{
	postJson.type = 'discussion';
	if(to_sel_place =='my_place')
	{
	postJson.visibility='all';
	delete postJson.parent;
	}
    osapi.jive.corev3.discussions.create(postJson).execute(onContentCreated);	
	}	
	else if(pollIndex!=-1)
	{
	postJson.type = 'poll';
	postJson.options = pollOptions;	
	if(to_sel_place =='my_place')
	{
	postJson.visibility='all';
	delete postJson.parent;
	}
    osapi.jive.corev3.polls.create(postJson).execute(onContentCreated);	
	}
	else if(blogIndex!=-1)
	{        
            if(to_place_blog_url!='')
			{
			var jdoc = new osapi.jive.corev3.contents.Post();
            jdoc.subject =  docSubject+' ('+timeStamp+')';
            jdoc.content =  docContent;
			jdoc.parent =  to_place_blog_url;

            osapi.jive.corev3.posts.create(jdoc).execute(onContentCreated);
           }
           else if(to_sel_place =='my_place')
		   {
			var jdoc = new osapi.jive.corev3.contents.Post();
            jdoc.subject =  docSubject+' ('+timeStamp+')';
            jdoc.content =  docContent;
		   	postJson.visibility='hidden';
	        delete postJson.parent;	  
            osapi.jive.corev3.posts.create(jdoc).execute(onContentCreated);			
		   }
	}
}

};

function onContentCreated (response) {
//console.log("Response: "+JSON.stringify(response));
    if (response.error) {
	    var mini = new gadgets.MiniMessage();
        mini.createDismissibleMessage("Unable to create: " + response.error.message);
		//mini.createTimerMessage("<div style='text-align:center;'>Unable to create document: " + response.error.message+"</div>", 4);
        return;
    }
	else 
	{
	
		commentsSelfURLMap[sourceCommentSelfURL] = response.resources.self.ref;
		commentsPostURLMap[sourceCommentSelfURL] = response;
		contentCreationResponse = response;

	if(docIndex!=-1)
	{
		var redirectTo=response.resources.html.ref;
        redirectHrefLocation = redirectTo+'/edit?ID='+response.id; 
	if(isChecked==true)
	{
		commentDataResponse = commentData;
		//alert("commentData :"+commentData);
		commentDataIndex = 0;
		executeCommentCopy();
	/*for(var i=0;i<commentData.list.length;i++)
    {
    var comment=new osapi.jive.corev3.contents.Comment();
    comment.content=commentData.list[i].content;
    comment.parent=commentData.list[i].parent;
    response.createComment(comment).execute(); 
    }*/
	}
  	//var redirectTo=response.resources.html.ref;
    //window.location = redirectTo+'/edit?ID='+response.id; 
	 }
	 else if(disIndex!=-1)
	 {
	 var redirectTo=response.resources.html.ref;
	var startIndex=redirectTo.indexOf('thread');
    var docID= redirectTo.substring(startIndex+7,redirectTo.length);
var request = osapi.jive.core.discussions.get({id: docID});
request.execute(function(response) {
var htmlRef=response.data.messages.root.resources.html.ref;
htmlRef= htmlRef.substring(0,htmlRef.indexOf('#'));
//window.location = htmlRef+'/edit'; 	
redirectHrefLocation = htmlRef+'/edit';
});
	 if(isChecked==true)
	{	
		commentDataResponse = messageData;
		//alert("commentData :"+commentData);
		commentDataIndex = 0;
		executeCommentCopy();
	/*for(var i=0;i<messageData.list.length;i++)
    {
    var message=new osapi.jive.corev3.contents.Message();
    message.content=messageData.list[i].content;
    message.parent=messageData.list[i].parent;
    response.createReply(message).execute(); 
    }*/
	}
	/*var redirectTo=response.resources.html.ref;
	var startIndex=redirectTo.indexOf('thread');
    var docID= redirectTo.substring(startIndex+7,redirectTo.length);
var request = osapi.jive.core.discussions.get({id: docID});
request.execute(function(response) {
var htmlRef=response.data.messages.root.resources.html.ref;
htmlRef= htmlRef.substring(0,htmlRef.indexOf('#'));
//window.location = htmlRef+'/edit'; 	
});*/
}
else if(pollIndex!=-1)
	{
	var redirectTo=response.resources.html.ref;
	//alert("zsdfsfd "+response.resources.html.ref);
	redirectTo= redirectTo.substring(0,redirectTo.indexOf('polls')+5);
	redirectTo=redirectTo.replace('polls','poll');
	redirectHrefLocation = redirectTo+'/edit.jspa?ID='+response.id;
	if(isChecked==true)
	{
		commentDataResponse = commentData;
		//alert("commentData :"+commentData);
		commentDataIndex = 0;
		executeCommentCopy();
	}
	/*var redirectTo=response.resources.html.ref;
	redirectTo= redirectTo.substring(0,redirectTo.indexOf('polls')+5);
	redirectTo=redirectTo.replace('polls','poll');
   // window.location = redirectTo+'/edit.jspa?ID='+response.id;*/
	 }
	 else if(blogIndex!=-1)
	{
	var redirectTo=response.resources.html.ref;
	redirectTo= redirectTo.substring(0,redirectTo.indexOf('/',10));
    redirectHrefLocation = redirectTo+'/blog/update-post.jspa?ID='+response.id;
	if(isChecked==true)
	{	
		commentDataResponse = commentData;
		//alert("commentData :"+commentData);
		commentDataIndex = 0;
		executeCommentCopy();
	/*for(var i=0;i<commentData.list.length;i++)
    {
    var comment=new osapi.jive.corev3.contents.Comment();
    comment.content=commentData.list[i].content;
    comment.parent=commentData.list[i].parent;
	

    response.createComment(comment).execute(); 
    }*/
	}
	/*var redirectTo=response.resources.html.ref;
	redirectTo= redirectTo.substring(0,redirectTo.indexOf('/',10));
    window.location = redirectTo+'/blog/update-post.jspa?ID='+response.id;*/
	 }
}
}


function executeCommentCopy() 
{
		//alert("Into the execute comment copy :-");
			//	alert("redirectHrefLocation :"+redirectHrefLocation);
		//alert("commentDataIndex: "+commentDataIndex);
		//alert("commentData legth: "+commentData.list.length);
		if(disIndex!=-1)
		{
		//alert("is discussion");
		commentData=messageData;
		}
		if(commentDataIndex < commentData.list.length) 
		{
			console.log("commentData: "+commentData);
			if(commentDataIndex == 0) {
				response = contentCreationResponse
				
			}
		if(disIndex!=-1)
		{
		//alert("is message");
        var comment=new osapi.jive.corev3.contents.Message();
		}
		else
		{
		var comment=new osapi.jive.corev3.contents.Comment();
		}
			/*comment.content=commentData.list[commentDataIndex].content;
			comment.parent=commentData.list[commentDataIndex].parent;*/
			console.log(JSON.stringify(commentData.list[commentDataIndex].content));
			
			 var title;
			 console.log("as Text: "+commentData.list[commentDataIndex].content.hasOwnProperty("text"));
			 console.log("Text: "+commentData.list[commentDataIndex].content.text);
			 


        if(commentData.list[commentDataIndex].content.hasOwnProperty("text")){ //added missing closing parenthesis
            var text = commentData.list[commentDataIndex].content.text;
			alert("title: "+text);
            commentData.list[commentDataIndex].content.text = '<p><span class="red">' + '[Originally posted by: Daniel Kaplan on 01/31/2013 at 21:47]' + '</span></p><br/>';
			console.log("Text: "+commentData.list[commentDataIndex].content.text);
        }
   console.log(JSON.stringify(commentData.list[commentDataIndex].content));
			comment.content= commentData.list[commentDataIndex].content;
			comment.parent=response.resources.self.ref;
			
			sourceCommentParentUrl = commentData.list[commentDataIndex].parent;
			
			
			
			
			
			if(commentDataIndex > 0)
			{
				//	alert("inside if comment structure if");
					//alert ("sourceCommentParentUrl in commentsSelfURLMap ="+(sourceCommentParentUrl in commentsSelfURLMap))
					if(sourceCommentParentUrl in commentsSelfURLMap)
					{
						//alert("comment.parent "+commentsSelfURLMap[sourceCommentParentUrl]);
						//alert("response replce ="+JSON.stringify(commentsPostURLMap[sourceCommentParentUrl]));
					   comment.parent = commentsSelfURLMap[sourceCommentParentUrl];
					   response = commentsPostURLMap[sourceCommentParentUrl];
					}
				
			}
			

			/*alert("Init targetCommentSelfURL "+response.resources.self.ref);
			alert("Init targetPostResponseObj ="+JSON.stringify(response));
			alert("Init sourceCommentSelfURL "+commentData.list[commentDataIndex].resources.self.ref);
			alert("Init sourceCommentParentUrl = "+commentData.list[commentDataIndex].parent);
			alert("commentDataIndex ="+commentDataIndex);*/
			targetCommentSelfURL = response.resources.self.ref;
			targetPostResponseObj = response;
		
			
			//alert("starting to execute.....");
			//alert("comment created is "+JSON.stringify(comment));
			console.log("comment created is "+JSON.stringify(comment));
		if(disIndex!=-1)
		{	
		var request=response.createReply(comment);
		}
		else
		{
		var request=response.createComment(comment);
		}
			//alert("request to execute.....");
		
			request.execute(function(commentResponseObj){
				/*alert("comment Response: "+JSON.stringify(commentResponseObj));
				alert("comment Response: - targetCommentSelfURL "+commentResponseObj.resources.self.ref);
				alert("comment Response: - targetPostResponseObj ="+JSON.stringify(commentResponseObj));*/
				targetCommentSelfURL = commentResponseObj.resources.self.ref;
				targetPostResponseObj = commentResponseObj;
				//commentsSelfURLMap[sourceCommentSelfURL] = commentResponseObj.resources.self.ref;
				sourceCommentSelfURL = commentData.list[commentDataIndex].resources.self.ref;
				commentsSelfURLMap[sourceCommentSelfURL] = commentResponseObj.resources.self.ref;
				commentsPostURLMap[sourceCommentSelfURL] = commentResponseObj;
				commentflag = true;
				commentDataIndex =commentDataIndex + 1;
				executeCommentCopy();
			});
		}
		else {
	//	alert("Into else");
		//alert(redirectHrefLocation);
			window.location = redirectHrefLocation;
		
		}
		
	
}

function commentResponse(commentResponseObj) {
//alert("comment Response: "+JSON.stringify(commentResponseObj));

	//alert("comment Response: - targetCommentSelfURL "+commentResponseObj.resources.self.ref);
	//alert("comment Response: - targetPostResponseObj ="+JSON.stringify(commentResponseObj));
	
	
	targetCommentSelfURL = commentResponseObj.resources.self.ref;
	targetPostResponseObj = commentResponseObj;
	commentsSelfURLMap[sourceCommentSelfURL] = targetCommentSelfURL;
	commentsPostURLMap[sourceCommentSelfURL] = targetPostResponseObj;
	
	

}
//iframe start

var flag=false;
var htmlRef='';
function refreshiframe() 
{ 
flag=true;
osapi.http.get({
'href' : 'http://54.247.84.129:8081/UAT/LoggerServlet?logged-user='+loggedUser+'&logged-userName='+loggedUserName,
'format' : 'text',
'authz' : 'signed'
}).execute(refreshFrameResponse);
}
function refreshFrameResponse(response) 
{
if(!flag)
{
refreshiframe();
}
setTimeout("refreshiframe()",1000); 	
var str=response.content;
//console.log("str: "+str);
var res='{ error: "Connect to /54.246.36.246:8081 timed out" }';
var errorCode=str.indexOf(res);
//alert("errorCode: "+errorCode);
if(errorCode!=0)
{
//str='Copying file';
if(str.indexOf('files')!=-1)
 str='Copying selected file';

if(str.indexOf('CopyEditHtmlSelfRef:')!=-1)
{
htmlRef=str;
if(htmlRef.indexOf('http')!=-1)
{
str='';
htmlRef=htmlRef.substring(20,htmlRef.length);
}
}
document.getElementById("frame1").contentDocument.body.style.fontFamily="Tahoma";	
document.getElementById("frame1").contentDocument.body.style.fontSize = "12px";
document.getElementById("frame1").contentDocument.body.style.color='Grey';
document.getElementById("frame1").contentDocument.body.innerHTML = "Copying in Progress.<br>Please leave this window open until the copying process has been completed.<br><br><span id='mySpan' style='font-weight:bold;'>"+str.fontcolor("#3778C7")+"</span>";

var compare='You will be redirected to the "copy to" group.';

var pos=str.indexOf(compare);
//console.log("pos: "+pos+" "+str);
if (pos!=-1)
{
//alert("redirecting....");
document.getElementById("frame1").contentDocument.body.innerHTML = "Copying in Progress.<br>Please leave this window open until the copying process has been completed.<br><br><span id='mySpan' style='font-weight:bold;'>"+str.fontcolor("#3778C7")+"</span>";
//setTimeout("refreshiframe()",1000); 
$("#stylized").fadeOut(5000,function(){
window.location = htmlRef+'/upload';         

});
}
}	
}
function handleChange(cb)
{
isChecked= cb.checked;
}