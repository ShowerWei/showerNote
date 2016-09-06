(function(){

// 插入 <ul> 之 <li> 樣板
var tmpEmp = '<li><input type="text" placeholder="New task..."><span></span></li>',
	addButton = $('#add'),
    connected = $('.connected'),      // 三個 <ul>
    placeholder = $('#placeholder'),  // 三個 <ul> 的容器
    mainUl = $('.main'),              // main <ul>
    deleteUl = $('.delete'),          // delete <ul>
    doneUl = $('.done');              // done <ul>


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
  }
});

// 從 localStorage 讀出整個表，放進 ul
load();

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
	ui.item.removeClass('is-todo');
	ui.item.addClass('is-done');
	ui.item.appendTo(mainUl);
});


deleteUl.on('sortreceive', function(e, ui){
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
        'status': 'is-done',
        'text': text
      })
    else
      items.push({
        'status': 'is-todo',
        'text': text
      })
  
  });

  // 把陣列轉成 JSON 物件後存進 localStorage
  localStorage.allItems = JSON.stringify(items); 

}

// 從 localStorage 讀出整個表，放進 <ul>
//
function load(){
// 從 localStorage 裡讀出陣列 JSON 字串
// 把 JSON 字串轉回陣列
  var items = JSON.parse( localStorage.allItems ), i;
  // 對於陣列裡的每一個項目，插入回 ul 裡。
  for(i=0; i<items.length; i+=1){
    $(tmpEmp).addClass(items[i]['status']).appendTo(mainUl).find('span').text(items[i]['text']);
  }
}

}());
