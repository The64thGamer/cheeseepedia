CMS.registerPreviewTemplate('posts', ({ entry }) => {
  const data = entry.getIn(['data']);
  const body = data.get('body');

  return `
    <div>
      <h1>${data.get('title')}</h1>
      <div>${body}</div>
    </div>
  `;
});
