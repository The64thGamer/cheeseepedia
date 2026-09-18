import { renderArticle, renderRandomCards } from './Renderers';

async function App(meta) {
  const final = await renderArticle(meta);
  const random = await renderRandomCards()
  return (
    <>
      <link rel="icon" href="/viewers/cep-js/assets/Logos/favicon-cep.ico" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/themes.css" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/main.css" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/extra.css" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/fonts.css" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/mobile-modifiers.css" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/theme-modifiers.css" />
      {final}
      {random}
    </>
  );
}


export default App;