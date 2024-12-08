CMS.registerPreviewStyle("/admin/styles.css");

var PostPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var image = entry.getIn(['data', 'image']);
    var bg = this.props.getAsset(image);
    return h('div', {},
      h('h1', {}, entry.getIn(['data', 'title'])),
      h('div', {"className": "article-section"}, this.props.widgetFor('body'))
    );
  }
});

CMS.registerPreviewTemplate("wiki", PostPreview);
