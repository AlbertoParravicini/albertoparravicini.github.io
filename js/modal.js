// Get the modal;
var modal = document.getElementById("modal-img-container");

// Current image in the modal;
curr_image = 0;

// Get the image and insert it inside the modal;
var images = document.getElementsByClassName("image-zoomable");
var modalImg = document.getElementById("modal-img");
for (let i = 0; i < images.length; i++) {
  images[i].onclick = function(){
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modalImg.src = this.src;
    curr_image = i;
  }
}

// Get the <span> element that closes the modal;
var span = document.getElementsByClassName("close-modal")[0];

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

// Move across images by clicking on the ">" & "<";
$('#right-arrow').click(function(e) {
  curr_image = (curr_image + 1) % images.length;
  modalImg.src = images[curr_image].src;
  e.stopPropagation();
});
$('#left-arrow').click(function(e) {
  curr_image--;
  if (curr_image < 0) {
    curr_image = images.length - 1;
  }
  modalImg.src = images[curr_image].src;
  e.stopPropagation();
});