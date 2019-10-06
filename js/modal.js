// Get the modal;
var modal = document.getElementById("modal-img-container");

// Get the image and insert it inside the modal;
var img = document.getElementsByClassName("image-zoomable");
var modalImg = document.getElementById("modal-img");
for (let i = 0; i < img.length; i++) {
  img[i].onclick = function(){
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modalImg.src = this.src;
  }
}

// Get the <span> element that closes the modal;
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal;
span.onclick = function() {
  modal.style.display = "none";
  modal.style.justifyContent = "";
  modal.style.alignItems = "";
}

// Close zoomed images by clicking on background;
$('#modal-img-container').click(function() {
  modal.style.display = "none";
  modal.style.justifyContent = "";
  modal.style.alignItems = "";
});

$('#modal-img').click(function(e) {
  e.stopPropagation();
});