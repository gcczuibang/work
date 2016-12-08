var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext("2d"),
    eraseAllBtn = document.getElementById('eraseAllButton') ,
    strokeStyleSelect = document.getElementById('strokeStyleSelect'),
    shape = document.getElementById('shape'),
    imageData,
    mousedown = {},
    rubberbandRect = {},
    dragging = false,
    draw,drawend;


//获取鼠标在canvas中的位置
function windowToCanvas(x,y){
    var bbox = canvas.getBoundingClientRect();
    return {
        x:x - bbox.left * (canvas.width / bbox.width),
        y:y - bbox.top * (canvas.height / bbox.height)
    };
}

//获取当前canvas数据，保存
function saveSurface(){
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
}

//将存储的数据还原到页面中
function restoreSurface(){
    ctx.putImageData(imageData,0,0);
}

//绘制线段
function updateLine(loc){
    ctx.beginPath();
    ctx.moveTo(mousedown.x,mousedown.y);
    ctx.lineTo(loc.x,loc.y);
    ctx.stroke();
}

//绘制矩形
function updateRect(loc){
    ctx.beginPath();
    rubberbandRect.width = Math.abs(loc.x - mousedown.x);
    rubberbandRect.height = Math.abs(loc.y - mousedown.y);
    if(loc.x < mousedown.x) rubberbandRect.x = loc.x;
    else rubberbandRect.x = mousedown.x;

    if(loc.y < mousedown.y) rubberbandRect.y = loc.y;
    else rubberbandRect.y = mousedown.y;
    ctx.rect(rubberbandRect.x,rubberbandRect.y, rubberbandRect.width,rubberbandRect.height  );
    ctx.stroke();
}

//绘制圆形
function updateCircle(loc){
    ctx.beginPath();
    var r = Math.pow(Math.pow(loc.x-mousedown.x,2) + Math.pow(loc.y - mousedown.y,2),0.5);
    ctx.arc(mousedown.x,mousedown.y,r,0,Math.PI*2,false);
    ctx.stroke();
}

//绘制曲线
function updateBezir(loc){

}

//绘制圆角矩形
function updateRoundRect(loc){

}

//绘制橡皮擦
function updateErase(loc){

}

//绘制文本
function updateText(loc){

}




draw = function(loc){
    restoreSurface();
    updateLine(loc);
};
drawend = function(loc){
    restoreSurface();
    updateLine(loc)
};

canvas.onmousedown = function(e){
    var loc = windowToCanvas(e.clientX, e.clientY);
    e.preventDefault();
    saveSurface();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    dragging = true;

}

canvas.onmousemove = function (e) {
    var loc;
    if(dragging){
        e.preventDefault();
        loc = windowToCanvas(e.clientX, e.clientY);

        draw(loc);

        //mousedown = loc;

    }
}

canvas.onmouseup = function (e) {
    loc = windowToCanvas(e.clientX, e.clientY);

    drawend(loc);

    dragging = false;
}

eraseAllBtn.onclick = function(e){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

strokeStyleSelect.onchange = function(e){
    ctx.strokeStyle = strokeStyleSelect.value;
}

shape.onchange = function(){
    switch(shape.value){
        case "rect":
            draw = function(loc){
                restoreSurface();
                updateRect(loc);
            };
            drawend = function(loc){
                restoreSurface();
                updateRect(loc)
            };
            break;
        case "circle":
            draw = function(loc){
                restoreSurface();
                updateCircle(loc);
            };
            drawend = function(loc){
                restoreSurface();
                updateCircle(loc);
            };
            break;
        case "line":
            draw = function(loc){
                restoreSurface();
                updateLine(loc);
            };
            drawend = function(loc){
                restoreSurface();
                updateLine(loc)
            };
            break;
        case "text":break;
        case "custom":
            draw = function(loc){

                updateLine(loc);
                mousedown = loc;
            };
            drawend = function(loc){

            };
            break;
        case "bezirLine":break;
        case "roundRect":break;
        case "erase":break;
    }
}