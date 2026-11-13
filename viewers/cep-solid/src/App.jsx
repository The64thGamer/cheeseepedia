import { renderHeader, renderArticle, renderRandomCards, renderFooter, renderStatsPage, renderUserPage } from './Renderers';
import { renderSearchPage } from './SearchPage';

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
    {meta.type === 'search' ? renderSearchPage() : meta.type === 'stats' ? renderStatsPage() : meta.type === 'userpage' ? renderUserPage(meta.user) : renderArticle(meta)}
    {renderRandomCards()}
    {renderFooter()}
    </>
  );
}

export default App;