function initLazyPhotos(container) {
  const lazyImages = container ? container.querySelectorAll("img.lazy-photo") : document.querySelectorAll("img.lazy-photo");
  lazyImages.forEach(img => {
    // Skip if already processed
    if (img.dataset.lazyProcessed) return;
    img.dataset.lazyProcessed = "true";
    
    const highRes = img.dataset.src;
    if (!highRes) return;
    
    // Failsafe if low-res fails
    img.onerror = () => {
      img.src = highRes;
      img.classList.add("loaded");
    };
    
    // Preload high-res
    const preload = new Image();
    preload.src = highRes;
    preload.onload = () => {
      img.src = highRes;
      img.classList.add("loaded");
    };
  });
}

// Run on page load
document.addEventListener("DOMContentLoaded", function() {
  initLazyPhotos();
});