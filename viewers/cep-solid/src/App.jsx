import { renderHeader, renderArticle, renderRandomCards, renderFooter } from './Renderers';

function App(meta) {
  return (
    <>
      <link rel="icon" href="/viewers/cep-js/assets/Logos/favicon-cep.ico" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/themes.css" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/main.css" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/extra.css" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/fonts.css" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/mobile-modifiers.css" />
      <link rel="stylesheet" href="/viewers/cep-solid/css/theme-modifiers.css" />
      {renderHeader()}
      {renderArticle(meta)}
      {renderRandomCards()}
      {renderFooter()}
    </>
  );
}

export default App;