let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let uploadedImage = null;

// Elements
let elements = {
    text: { x: 250, y: 800 },
    image: { x: 250, y: 350 }
};

let activeElement = null;

// Upload Image
document.getElementById("upload").addEventListener("change", function(e){
    let reader = new FileReader();
    reader.onload = function(event){
        uploadedImage = new Image();
        uploadedImage.src = event.target.result;
        uploadedImage.onload = generatePoster;
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Auto update
["name","font","fontSize","circleSize","zoom"].forEach(id=>{
    document.getElementById(id).addEventListener("input", generatePoster);
});

function drawCircle(img, x, y, size, zoom){
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, size/2, 0, Math.PI*2);
    ctx.clip();
    ctx.drawImage(img, x-size/2, y-size/2, size*zoom, size*zoom);
    ctx.restore();
}

function generatePoster(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Header
    ctx.fillStyle = "#198754";
    ctx.font = "bold 40px Arial";
    ctx.fillText("EACOSH 2026", 250, 100);
    ctx.font = "20px Arial";
    ctx.fillText("Proud Attendee", 300, 140);

    // Image
    if(uploadedImage){
        let size = document.getElementById("circleSize").value;
        let zoom = document.getElementById("zoom").value / 100;
        drawCircle(uploadedImage, elements.image.x, elements.image.y, size, zoom);
    }

    // Name Text
    let name = document.getElementById("name").value;
    let font = document.getElementById("font").value;
    let size = document.getElementById("fontSize").value;

    ctx.fillStyle = "#000";
    ctx.font = `${size}px ${font}`;
    ctx.fillText(name, elements.text.x, elements.text.y);

    // Footer
    ctx.font = "18px Arial";
    ctx.fillText("Participant | Safety Advocate | Change Maker", 150, 900);
}

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Detect click
canvas.addEventListener("mousedown", function(e){
    let pos = getMousePos(e);

    // Check TEXT click
    if(
        pos.x > elements.text.x - 100 &&
        pos.x < elements.text.x + 200 &&
        pos.y > elements.text.y - 50 &&
        pos.y < elements.text.y + 20
    ){
        activeElement = "text";
    }
    // Check IMAGE click
    else if(
        pos.x > elements.image.x - 150 &&
        pos.x < elements.image.x + 150 &&
        pos.y > elements.image.y - 150 &&
        pos.y < elements.image.y + 150
    ){
        activeElement = "image";
    }
});

canvas.addEventListener("mouseup", ()=>{
    activeElement = null;
});

canvas.addEventListener("mousemove", function(e){
    if(!activeElement) return;

    let pos = getMousePos(e);

    if(activeElement === "text"){
        elements.text.x = pos.x;
        elements.text.y = pos.y;
    }

    if(activeElement === "image"){
        elements.image.x = pos.x;
        elements.image.y = pos.y;
    }

    generatePoster();
});

// Download
function downloadPoster(){
    let link = document.createElement("a");
    link.download = "poster.png";
    link.href = canvas.toDataURL();
    link.click();
}