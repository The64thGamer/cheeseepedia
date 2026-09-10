let titleToFolderIDMap = null;
let FolderIDToTitleMap = null;

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
    titleToFolderIDMap = await res.json();
  }
  return FolderIDToTitleMap;
}