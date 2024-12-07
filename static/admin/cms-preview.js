const items = [
  "admin", "videos", "photos",
  "meta", "users", "transcriptions",
  "wiki"
];

// Register preview templates for all collections
items.forEach(collectionName => {
  CMS.registerPreviewTemplate(collectionName, ({ entry }) => {
    const data = entry.getIn(['data']);
    return React.createElement('article', {
      dangerouslySetInnerHTML: {
        __html: `
          <h1>${data.get('title')}</h1>
          <div>${data.get('body')}</div>
        `
      }
    });
  });
});
