// cms.js — global CMS / no imports
(function () {
  // get built-in image widget control/preview
  const imageWidget = window.CMS.getWidget && window.CMS.getWidget('image');
  if (!imageWidget) {
    console.error('Image widget not available - ensure decap-cms script is loaded first.');
    return;
  }
  const ImageControl = imageWidget.control;
  const ImagePreview = imageWidget.preview || (props => null);

  class AutoTitleImageControl extends ImageControl {
    // override onAddAsset to enforce .avif and then call parent logic
    async onAddAsset(file) {
      const filename = file && file.name ? file.name : '';
      if (!filename.toLowerCase().endsWith('.avif')) {
        alert('Only .avif files allowed');
        return;
      }

      // call parent upload logic (uploads to your media_folder)
      const asset = await super.onAddAsset(file);
      if (asset) {
        // set the image field value (this is the value for this widget)
        try { this.props.onChange(asset); } catch (e) { /* ignore */ }

        // Try best-effort: set the page's title field to the filename.
        // NOTE: different Decap versions expose different editor APIs; this is best-effort.
        try {
          // 1) Preferred if available (some widget wrappers expose onChangeField)
          if (typeof this.props.onChangeField === 'function') {
            this.props.onChangeField('title', filename);
          } else if (window.CMS && window.CMS.store) {
            // 2) Fallback: attempt to dispatch a redux-form change (may work in many installs)
            window.CMS.store.dispatch({
              type: '@@redux-form/CHANGE',
              meta: { form: 'editor', field: 'title' },
              payload: filename
            });
          } else {
            console.warn('Could not auto-set title: no supported API found.');
          }
        } catch (e) {
          console.warn('Auto-set title failed:', e);
        }
      }

      return asset;
    }
  }

  // Register widget (control + preview)
  window.CMS.registerWidget('auto_title_image', AutoTitleImageControl, ImagePreview);
})();
