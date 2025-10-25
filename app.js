const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const watermarkInput = document.getElementById('watermarkText');
const downloadBtn = document.getElementById('download');

let image = new Image();
let watermarkX = 100;
let watermarkY = 100;
let isDragging = false;

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

image.onload = function() {
  canvas.width = image.width;
  canvas.height = image.height;
  redrawCanvas();
};

watermarkInput.addEventListener('input', redrawCanvas);

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const text = watermarkInput.value;
  ctx.font = '48px sans-serif';
  const textWidth = ctx.measureText(text).width;
  const textHeight = 48;

  if (
    x >= watermarkX - textWidth &&
    x <= watermarkX &&
    y >= watermarkY - textHeight &&
    y <= watermarkY
  ) {
    isDragging = true;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  watermarkX = e.clientX - rect.left;
  watermarkY = e.clientY - rect.top;
  redrawCanvas();
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'watermarked-image.png';
  link.href = canvas.toDataURL();
  link.click();
});

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  const text = watermarkInput.value;
  ctx.font = '48px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.textAlign = 'right';
  ctx.fillText(text, watermarkX, watermarkY);
}
