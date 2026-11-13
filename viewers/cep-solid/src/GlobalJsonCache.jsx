const cache = new Map();

function loadJson(url) {
  if (!cache.has(url)) {
    const promise = fetch(url)
      .then((res) => res.json())
      .catch((err) => {
        cache.delete(url);
        throw err;
      });
    cache.set(url, promise);
  }
  return cache.get(url);
}

const SOLID = '/viewers/cep-solid/compiled-json/';
const SOLIDPERM = '/viewers/cep-solid/permanent-json/';
const JS = '/viewers/cep-js/compiled-json/';

export const loadFolderIDToTags = () => loadJson(`${SOLID}folderIDToTags.json`);
export const loadTaggedByIDs = () => loadJson(`${SOLID}taggedByIDs.json`);
export const loadSortKeys = () => loadJson(`${SOLID}sortKeys.json`);
export const loadRecentFanVideos = () => loadJson(`${SOLID}recentfanvideos.json`);
export const loadRecentOfficialVideos = () => loadJson(`${SOLID}recentofficialvideos.json`);
export const loadTitleToFolderIDMap = () => loadJson(`${SOLID}titleToFolderIDMap.json`);
export const loadFolderIDToTitleMap = () => loadJson(`${SOLID}folderIDToTitleMap.json`);
export const loadTypeToIDList = () => loadJson(`${SOLID}typeToIDList.json`);
export const loadExtraStatistics = () => loadJson(`${SOLID}ExtraStatistics.json`);
export const loadContributors = () => loadJson(`${SOLID}contributors.json`);
export const loadUserProfiles = () => loadJson(`${SOLID}userProfiles.json`);
export const loadViewsMap = () => loadJson(`${JS}views.json`);
export const loadDiscourseNews = () => loadJson(`${SOLID}DiscourseNews.json`);
export const loadDiscourseRecent = () => loadJson(`${SOLID}DiscourseRecent.json`);
export const loadUserSubmissions = () => loadJson(`${SOLIDPERM}user-submissions.json`);