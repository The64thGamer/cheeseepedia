let titleToFolderIDMap = null;
let FolderIDToTitleMap = null;
let ViewsMap = null;

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