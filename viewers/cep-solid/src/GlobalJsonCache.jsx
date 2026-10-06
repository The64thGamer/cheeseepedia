let titleToFolderIDMap = null;
let FolderIDToTitleMap = null;
let ViewsMap = null;
let TypeToIDList = null;
let DiscourseNews = null;
let DiscourseRecent = null;
let RecentFanVideos = null;
let RecentOfficialVideos = null;

export async function loadRecentFanVideos() {
  if (!RecentFanVideos) {
    const res = await fetch('/viewers/cep-solid/compiled-json/recentfanvideos.json');
    RecentFanVideos = await res.json();
  }
  return RecentFanVideos;
}

export async function loadRecentOfficialVideos() {
  if (!RecentOfficialVideos) {
    const res = await fetch('/viewers/cep-solid/compiled-json/recentofficialvideos.json');
    RecentOfficialVideos = await res.json();
  }
  return RecentOfficialVideos;
}

export async function loadTitleToFolderIDMap() {
  if (!titleToFolderIDMap) {
    const res = await fetch('/viewers/cep-solid/compiled-json/titleToFolderIDMap.json');
    titleToFolderIDMap = await res.json();
  }
  return titleToFolderIDMap;
}

export async function loadFolderIDToTitleMap() {
  if (!FolderIDToTitleMap) {
    const res = await fetch('/viewers/cep-solid/compiled-json/folderIDToTitleMap.json');
    FolderIDToTitleMap = await res.json();
  }
  return FolderIDToTitleMap;
}

export async function loadViewsMap() {
  if (!ViewsMap) {
    const res = await fetch('/viewers/cep-js/compiled-json/views.json');
    ViewsMap = await res.json();
  }
  return ViewsMap;
}

export async function loadTypeToIDList() {
  if (!TypeToIDList) {
    const res = await fetch('/viewers/cep-solid/compiled-json/typeToIDList.json');
    TypeToIDList = await res.json();
  }
  return TypeToIDList;
}

export async function loadDiscourseNews() {
  if (!DiscourseNews) {
    const res = await fetch('/viewers/cep-js/compiled-json/DiscourseNews.json');
    DiscourseNews = await res.json();
  }
  return DiscourseNews;
}

export async function loadDiscourseRecent() {
  if (!DiscourseRecent) {
    const res = await fetch('/viewers/cep-js/compiled-json/DiscourseRecent.json');
    DiscourseRecent = await res.json();
  }
  return DiscourseRecent;
}