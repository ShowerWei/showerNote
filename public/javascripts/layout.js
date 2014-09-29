
(function(){
// 插入 <ul> 之 <li> 樣板
var tmpEmp = '<li><input type="text" placeholder="New task..."><span></span></li>',
	  addButton = $('#add'),
    connected = $('.connected'),      // 三個 <ul>
    placeholder = $('#placeholder'),  // 三個 <ul> 的容器
    mainUl = $('.main'),              // main <ul>
    deleteUl = $('.delete'),          // delete <ul>
    doneUl = $('.done');              // done <ul>
    API =''; //'http:/54.64.186.0:3000';

// 點擊按鈕時，插入新項目
addButton.on('click', function(){
  $(tmpEmp).prependTo(mainUl).addClass('is-editing').find('input').focus();
});

// 按 Enter 鍵時完成編輯並存檔
mainUl.on('keyup', 'input', function(e){
  // 若目前的鍵是「enter」
  if(e.which === 13){
    var input = $(this), li = input.parents('li');

    // 把 <input> 的值複製到 <span> 裡
    li.find('span').text( input.val() );

    li.addClass('is-todo');
    // 取消 <li> 的編輯模式（is-editing class）
    li.removeClass('is-editing');

    // 把整個表存進 localStorage
    save();
    //using Ajax to add a new todo item 
    addItem(input.val());
  }
});

// Using Ajax to load todo list
//
fetchTodoList();

// 把 ul 初始化為 sortable
doneUl.sortable({
	tolerance: "pointer"
});

deleteUl.sortable({
	tolerance: "pointer"
});

mainUl.sortable({
      connectWith: ".connected",
      dropOnEmpty: true,
      tolerance: "pointer"
    });


doneUl.disableSelection();
deleteUl.disableSelection();
//mainUl.disableSelection();


mainUl.on('sortstart', function(){
  placeholder.addClass('is-dragging');
});

doneUl.on('sortreceive', function(e, ui){
  updateItem(ui.item.text())
  ui.item.removeClass('is-todo');
  ui.item.addClass('is-done');
  ui.item.appendTo(mainUl);
});


deleteUl.on('sortreceive', function(e, ui){
  deleteItem(ui.item.text());
  ui.item.remove();
});

// 當拖曳結束時要存檔
//
mainUl.on('sortstop', function(){
  save();
  placeholder.removeClass('is-dragging');
});



// 把整個項目表存進 localStorage
//
function save(){
  // 準備好要裝各個項目的空陣列
  var items = [];

  // 對於每個 li，
  // 把 <li> 裡的class:text放進陣列裡
  mainUl.find('li').each(function(){
    var input = $(this);
    var text = $(this).text();
    if(input.hasClass('is-done'))
      items.push({
        "stat": "is-done",
        "text": text
      })
    else
      items.push({
        "stat": "is-todo",
        "text": text
      })
  
  });

  // 把陣列轉成 JSON 物件後存進 localStorage
  localStorage.allItems = JSON.stringify(items); 


  // $.ajax({
  //   url: 'http://54.64.128.174:3000/post',
  //   data: JSON.stringify(items),
  //   type:"POST",
  //   dataType:'JSON',

  //   success: function(msg){
  //       alert('success' + msg);
  //   },

  //    error:function(xhr, ajaxOptions, thrownError){ 
  //       alert('error' + xhr.status); 
  //       alert('error' + thrownError); 
  //    }
  // });

}

// 從 localStorage 讀出整個表，放進 <ul>
//
function load(){
// 從 localStorage 裡讀出陣列 JSON 字串
// 把 JSON 字串轉回陣列
  var items = JSON.parse( localStorage.allItems ), i;
  // 對於陣列裡的每一個項目，插入回 ul 裡。
  for(i=0; i<items.length; i+=1){
    $(tmpEmp).addClass(items[i]["stat"]).appendTo(mainUl).find('span').text(items[i]["text"]);
  }
}



//GET /items ：取得所有TODO items
function fetchTodoList(){
$.ajax({
  url: API+'/items/', 
  type:"GET",
  dataType:'JSON',

  success: function(msg){
    var i;
  // 對於陣列裡的每一個項目，插入回 ul 裡。
    for(i=0; i<msg.todoList.length; i+=1){
      $(tmpEmp).addClass(msg.todoList[i].stat).appendTo(mainUl).find('span').text(msg.todoList[i].text);
    }
  },

  error:function(xhr, ajaxOptions, thrownError){ 
   alert('fetchTodoList xhr.status: '+xhr.status); 
   alert('fetchTodoList thrownError: '+thrownError); 
   }
 });
}

//POST /items ：新增一個TODO item
function addItem(todoText){

 var newTodo ={
      stat : "is-todo",
      text : todoText
    };
$.ajax({
  url: API+'/items/', 
  data: newTodo,
  type:"POST",
  dataType:'JSON',

  success: function(){
    console.log("success adding a todo item."); 
  },

  error:function(xhr, ajaxOptions, thrownError){ 
    alert('addItem xhr.status: '+xhr.status); 
    alert('addItem xhr.readyState: '+xhr.readyState); 
    alert('addItem thrownError: '+thrownError); 
   }
 });
}

//PUT /items/:id ：更新一個TODO item（如把item標示為完成狀態）
function updateItem(todoText){
$.ajax({
  url: API+'/items/'+todoText, 
  type:"PUT",
  dataType:'JSON',
  success: function(){
    console.log(todoText + " todo item is done."); 
  },

  error:function(xhr, ajaxOptions, thrownError){ 
    alert('updateItem xhr.status: '+xhr.status); 
    alert('updateItem xhr.readyState: '+xhr.readyState); 
    alert('updateItem thrownError: '+thrownError); 
   }
 });
}

//PUT /items/:id/reposition/:new_position ：把該TODO item的位置移動到new position代表的index位置
function reposition(){

}

//DELETE /items/:id ：刪除一個TODO item
function deleteItem(todoText){
$.ajax({
  url: API+'/items/'+todoText, 
  type:"DELETE",
  dataType:'JSON',
  success: function(){
    console.log(todoText + " todo item is deleted."); 
  },

  error:function(xhr, ajaxOptions, thrownError){ 
    alert('deleteItem xhr.status: '+xhr.status); 
    alert('deleteItem xhr.readyState: '+xhr.readyState); 
    alert('deleteItem thrownError: '+thrownError); 
   }
 });
}


}());
