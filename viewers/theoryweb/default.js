export async function render(params, app) {
  const [baseRes, homeRes] = await Promise.all([
    fetch('/viewers/theoryweb/Base.html'),
    fetch('/viewers/theoryweb/Home.html'),
  ]);

  app.innerHTML = await baseRes.text();
  app.querySelector('.Body').innerHTML = await homeRes.text();
}