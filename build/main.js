//array to store tasks
var todo = [];
//swipe variables
var touchorigin;
var movement;
var threshold=150;
//global settings
var app = {
  touch:0,
  movement:0,
  threshold:150
}

window.addEventListener("load",function(){
  addCordovaEvents();//initialise cordova events
  loadList(todo);//populate list with data from localStorage
  showButton("remove",todo);//check if any task has status of 1 ie done
  //create a reference to the task list
  var tasklist = document.getElementById('task-list');
  //listener for touch on the list of tasks
  tasklist.addEventListener("touchstart",function(event){
    //record touch x position when it starts
    app.touch = event.touches[0].clientX;
  });
  tasklist.addEventListener("touchmove",function(event){
    //get the x position of the touch
    var touchx = event.touches[0].clientX;
    //calculate how far the swipe has moved by subtracting
    //app.touch(the origin point) from current touch position
    app.movement=touchx-app.touch;
    //identify the touch target tag
    var touchtarget = event.target.tagName;
    //since the target is the text-container we need to get the parent of its parent
    //=the li element, then get to the button
    var button = event.target.parentNode.parentNode.getElementsByTagName('BUTTON')[0];
    //only move element if target is a div
    if(touchtarget.toLowerCase()=="div"){
      // event.target.style.transform = slide;
      if(app.movement>0 && app.movement<=app.threshold+50){
        //if movement is less than the threshold
        button.style.width = app.movement+"px";
      }
      else if(app.movement<0){
        width = parseFloat(button.style.width,10);
        button.style.width = app.threshold+app.movement+"px";
      }
    }
  },{passive:true});
  //add a listener for when the touch ends
  tasklist.addEventListener("touchend",function(event){
    var touchtarget = event.target.tagName;
    //since the target is the text-container we need to get the parent of its parent
    //=the li element, then get to the button
    var button = event.target.parentNode.parentNode.getElementsByTagName('BUTTON')[0];
    if(touchtarget.toLowerCase()=="div"){
      //if swipe right goes beyond the threshold
      if(app.movement>=app.threshold){
        button.style.width = app.threshold;
        buttonid = button.getAttribute("data-id");
        changeStatus(buttonid,1);
      }
      //if swipe right does not go beyond threshold, change button back to 0 width
      if(app.movement<app.threshold && app.movement>0){
        button.style.width = '0px';
      }
      //if swipe left (movement<0) and it is smaller than threshold
      //snap button back to 0
      else if(app.movement<0 && app.movement<app.threshold){
        button.style.width = '0px';
        buttonid = button.getAttribute("data-id");
        changeStatus(buttonid,0);
      }
    }
    if(touchtarget.toLowerCase()=="button"){
      var taskid = event.target.parentNode.getAttribute('id');
      removeTask(taskid);
      // document.getElementById(taskid).style.maxHeight = '0px';
    }
    //if touchtarget is a button
    if(touchtarget.toLowerCase()=='button'){
      //identify the button, which is the same as list item id
      var buttonid = event.target.getAttribute('data-id');
      //get the list item with the same id
      //toggleStatus(buttonid);
    }
  },{passive:true});
  document.getElementById("remove").addEventListener("touchend",function(){
    //when removing items remove from the end of list"
    var len = todo.length-1;
    for(i=len;i>=0;i--){
      var item = todo[i];
      if(item.status==1){
        todo.splice(i,1);
        saveList(todo);
        renderList("task-list",todo);
      }
    }
    showButton("remove",todo);
  });
});

var inputform = document.getElementById("input-form");
inputform.addEventListener("submit",function(event){
  event.preventDefault();
  //get task input value
  task = document.getElementById("task-input").value;
  //add check for empty value
  //eg do not add task if the input is empty
  if(task!="" && task!=undefined){
    createTask(task);
    inputform.reset();
  }
});

function createTask(task){
  id = new Date().getTime();
  name = task;
  taskitem ={id:id,name:name,status:0};
  todo.push(taskitem);
  renderList("task-list",todo);
}
function removeTask(id){
  //remove from array
  var len = todo.length-1;
  console.log(len);
  var i=0;
  for(i=len;i>=0;i--){
    if(todo[i].id == id){
      todo.splice(i,1);
      saveList(todo);
      renderList("task-list",todo);
    }
  }
  //animate removal
  //remove from list
}
function saveList(list_array){
  if(window.localStorage){
    localStorage.setItem("tasks",JSON.stringify(list_array));
  }
}

function loadList(list_array){
  if(window.localStorage){
    try{
      if(JSON.parse(localStorage.getItem("tasks"))){
        todo = JSON.parse(localStorage.getItem("tasks"));
      }
    }
    catch(error){
      console.log("error"+error);
    }
  }
  renderList("task-list",todo);
}

function renderList(elm,list_array){
  var container = document.getElementById(elm);
  saveList(list_array);
  container.innerHTML="";
  itemstotal = list_array.length;
  for(i=0;i<itemstotal;i++){
    item = list_array[i];
    //create the list item
    listitem = document.createElement('LI');
    //create the div for the text of task
    listitemcontainer = document.createElement('DIV');
    //text container to prevent text from shrinking on swipe
    txtcontainer = document.createElement('DIV');
    txtcontainer.setAttribute("class","text-container")
    //give the text container a class
    //create the task text using its name
    listtext = document.createTextNode(item.name);
    //create the remove button
    listbutton = document.createElement('BUTTON');
    listbutton.setAttribute('data-id',item.id);
    //add the text into the div element
    txtcontainer.appendChild(listtext);
    listitemcontainer.appendChild(txtcontainer);
    //add the div into the list item
    listitem.appendChild(listbutton);
    listitem.appendChild(listitemcontainer);
    listitem.setAttribute("id",item.id);
    listitem.setAttribute("data-status",item.status);
    if(item.status==1){
      listitem.setAttribute("class","done");
      listbutton.style.width="150px";
    }
    container.appendChild(listitem);
  }
}

//function used to show or hide the button to remove "done" tasks
//this function checks whether to show the "clear" button
function showButton(element,arr){
  var show=false;
  var len=arr.length;
  for(i=0;i<len;i++){
    var item = arr[i];
    if(item.status == 1){
      show = true;
    }
  }
  if(show==true){
    document.getElementById(element).setAttribute("class","show");
  }
  else{
    document.getElementById(element).removeAttribute("class");
  }
}

function changeStatus(id,status){
  switch(status){
    case 1:
      document.getElementById(id).setAttribute("class","done");
      document.getElementById(id).setAttribute("data-status","1");
      for(i=0;i<todo.length;i++){
        taskitem = todo[i];
        if(taskitem.id == id){
          taskitem.status = 1;
          saveList(todo);
        }
      }
      break;
    case 0:
      document.getElementById(id).removeAttribute("class");
      for(i=0;i<todo.length;i++){
        taskitem = todo[i];
        if(taskitem.id == id){
          taskitem.status = 0;
          saveList(todo);
        }
      }
      break;
    default:
      break;
  }
}

function addCordovaEvents(){
  document.addEventListener("deviceready",onDeviceReady,false);
}
function onDeviceReady(){
  document.addEventListener("pause",function(){
    //when app is paused (eg home button pressed) save list
    saveList(todo);
  },false);
  document.addEventListener("resume",function(){
    //when app is resumed (brought back from sleep) load list
    loadList(todo);
  },false);
  document.addEventListener("backbutton",function(){
    //when backbutton is pressed, exit app
    saveList(todo);
    navigator.app.exitApp();
  },false);
}

function addCordovaEvents(){
  document.addEventListener("deviceready",onDeviceReady,false);
}
function onDeviceReady(){
  document.addEventListener("pause",function(){
    saveList(todo);
  },false);
  document.addEventListener("resume",function(){
    loadList(todo);
  },false);
  document.addEventListener("backbutton",function(){
    saveList(todo);
    navigator.app.exitApp();
  },false);
}
