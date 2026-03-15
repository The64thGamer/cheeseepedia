export async function render(params, app) {
  const [baseRes, homeRes, cardRes] = await Promise.all([
    fetch('/viewers/cep-js/Base.html'),
    fetch('/viewers/cep-js/Home.html'),
    fetch('/viewers/cep-js/Card.html'),
  ]);

  app.innerHTML = await baseRes.text();
  app.querySelector('.Body').innerHTML = await homeRes.text();
  app.querySelector('.Card').innerHTML = await cardRes.text();
}