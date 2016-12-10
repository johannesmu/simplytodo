//array to store tasks
var todo = [];

window.addEventListener("load",function(){
  addCordovaEvents();
  loadList(todo);
  showButton("remove",todo);
  //listener for touch on the list of tasks
  var tasklist = document.getElementById('task-list');
  document.getElementById("task-list").addEventListener("click",function(event){
    //before changing status
    var id=event.target.getAttribute("id");
    var elm=document.getElementById(id);
    if(elm.classList.contains("done")){
      changeStatus(id,0);
    }
    else{
      changeStatus(id,1);
    }
    showButton("remove",todo);
  });

  document.getElementById("remove").addEventListener("touchend",function(){
    //when removing items remove from the end of list
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
//cordova events are for interactions with phone
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
  timestamp = new Date().getTime();
  taskitem ={id:id,name:task,status:0};
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
    listitem = document.createElement('LI');
    listtext = document.createTextNode(item.name);
    listitem.appendChild(listtext);
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
      //get the element by its id and add a class "done" to it
      document.getElementById(id).setAttribute("class","done");
      //find item in array and change its status
      for(i=0;i<todo.length;i++){
        taskitem = todo[i];
        if(taskitem.id == id){
          taskitem.status = 1;
          saveList(todo);
        }
      }
      break;
    case 0:
      //get the element by its id and remove class "done" from it
      document.getElementById(id).removeAttribute("class");
      //find item in array and change its status
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
