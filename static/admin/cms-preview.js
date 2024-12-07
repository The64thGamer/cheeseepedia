const items = [
  "admin", "videos", "photos",
  "meta", "users", "transcriptions",
  "wiki"
];

// Register preview templates for all collections
items.forEach(collectionName => {
  CMS.registerPreviewTemplate(collectionName, ({ entry }) => {
    const data = entry.getIn(['data']);
    
    // Create HTML content without React
    const article = document.createElement('article');
    
    // Create title
    const h1 = document.createElement('h1');
    h1.innerHTML = data.get('title');
    article.appendChild(h1);
    
    // Create body
    const div = document.createElement('div');
    div.innerHTML = data.get('body');
    article.appendChild(div);
    
    return article;  // Return the constructed HTML element
  });
});
