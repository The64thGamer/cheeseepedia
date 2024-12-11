CMS.registerPreviewStyle("/admin/styles.css");

var PostPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var image = entry.getIn(['data', 'image']);
    var bg = this.props.getAsset(image);
    var bodyHTML = this.props.widgetFor('body').props.value; // Access raw HTML

    return h('div', {},
      h('h1', {}, entry.getIn(['data', 'title'])),
      h('div', {
        "className": "article-section",
        "dangerouslySetInnerHTML": { __html: bodyHTML } // Render raw HTML
      })
    );
  }
});

CMS.registerPreviewTemplate("wiki", PostPreview);
CMS.registerPreviewTemplate("news", PostPreview);
