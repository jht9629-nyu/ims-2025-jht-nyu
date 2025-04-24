let loaderCount = 0;
function startLoader() {
  console.log('startLoader', loaderCount);
  id_loader.style.display = 'block';
  loaderCount++;
  // id_myDiv.classList.remove('animate-bottom');
}
function stopLoader() {
  console.log('stopLoader', loaderCount);
  loaderCount--;
  if (loaderCount == 0) {
    id_loader.style.display = 'none';
  }
  // id_myDiv.classList.add('animate-bottom');
}
startLoader(); // init startup
