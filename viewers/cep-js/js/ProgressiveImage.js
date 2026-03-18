export function ProgressiveImage(folderId, alt='', cls='') {
  const low  = `/content/${folderId}/lowphoto.avif`;
  const full = `/content/${folderId}/photo.avif`;
  const img  = document.createElement('img');
  img.alt     = alt;
  img.loading = 'lazy';
  if (cls) img.className = cls;

  img.onload = () => {
    img.onload = null;
    const hi = new Image();
    hi.onload = () => { img.src = full; };
    hi.src = full;
  };
  img.onerror = () => {
    img.onerror = null;
    img.onload  = null;
    img.src = full;
  };

  img.src = low;
  return img;
}