//array to store tasks
var todo = [];


//swipe variables
var touchorigin;
var movement;
var threshold=150;

window.addEventListener("load",function(){
  addCordovaEvents();
  loadList(todo);
  showButton("remove",todo);
  //listener for touch on the list of tasks
  var tasklist = document.getElementById('task-list');
  tasklist.addEventListener("click",function(event){
    //get the parent of the target
    var id=event.target.parentNode.getAttribute("id");
    var elm=document.getElementById(id);
    if(elm.classList.contains("done")){
      changeStatus(id,0);
    }
    else{
      changeStatus(id,1);
    }
    showButton("remove",todo);
  });

  tasklist.addEventListener("touchstart",function(event){
    //record the touch origin -- this is a global
    touchorigin = event.touches[0].clientX;
    var divwidth = getComputedStyle(event.target).width+'px';
    //set the width of the div
    event.target.style.width = divwidth;
  });
  tasklist.addEventListener("touchmove",function(event){
    //get the x position of the touch
    var touchx = event.touches[0].clientX;
    //calculate how far the swipe has moved
    movement=touchx-touchorigin;
    // console.log(movement);
    var slide = "translate3D("+movement+"px,0px,0px)";
    //identify the touch target tag
    var touchtarget = event.target.tagName;
    var button = event.target.parentNode.getElementsByTagName('BUTTON')[0];

    //only move element if target is a div
    if(touchtarget.toLowerCase()=="div"){
      // event.target.style.transform = slide;
      if(movement>0){
        button.style.width = movement+"px";
      }
      else if(movement<0){
        width = button.style.width;
        button.style.width = width-movement;
      }
    }
  },{passive:true});
  tasklist.addEventListener("touchend",function(event){
    var touchtarget = event.target.tagName;
    var button = event.target.parentNode.getElementsByTagName('BUTTON')[0];
    if(touchtarget.toLowerCase()=="div"){
      if(movement<threshold){
        // event.target.style.transform = "translate3D(0,0,0)";
        button.style.width = '0px';
      }
      else if(movement>=threshold){
        // event.target.style.transform ="translate3D(100px,0,0)";
      }
      if(movement<=0){
        // event.target.style.transform ="translate3D(0,0,0)";
      }
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
        //before
        //animateRemoval('task-list');
        renderList("task-list",todo);
      }
    }
    showButton("remove",todo);
  });
});

var inputform = document.getElementById("input-form");
inputform.addEventListener("submit",function(event){
  console.log(event.target);
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
function createTask(task){
  id = new Date().getTime();
  name = task;
  taskitem ={id:id,name:name,status:0};
  todo.push(taskitem);
  renderList("task-list",todo);
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
        //console.log(todo);
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
    //create the task text using its name
    listtext = document.createTextNode(item.name);
    //create the remove button
    listbutton = document.createElement('BUTTON');
    //add the text into the div element
    listitemcontainer.appendChild(listtext);
    //add the div into the list item
    listitem.appendChild(listbutton);
    listitem.appendChild(listitemcontainer);
    listitem.setAttribute("id",item.id);
    listitem.setAttribute("data-status",item.status);
    if(item.status==1){
      listitem.setAttribute("class","done");
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

function addSwipe(elm,callback){
  elm.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
  }, false);

  elm.addEventListener('touchend', function(event) {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      callback;
  }, false);
}

function handleSwipe() {
    if (touchendX < touchstartX) {
        // swipe left
    }
    if (touchendX > touchstartX) {
        // swipe right
    }
    if (touchendY < touchstartY) {
        // swipe down
    }
    if (touchendY > touchstartY) {
        // swipe up
    }
    if (touchendY == touchstartY) {
        // alert('tap!');
    }
}
function changeStatus(id,status,arr){
  for(i=0;i<arr.length;i++){
    taskitem = arr[i];
    if(taskitem.id == id){
      taskitem.status = 1;
      saveList(todo);
    }
  }
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
