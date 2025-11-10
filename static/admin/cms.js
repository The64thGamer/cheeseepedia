import CMS from "netlify-cms-app";
import ImageControl from "netlify-cms-widget-image/src/ImageControl";
import ImagePreview from "netlify-cms-widget-image/src/ImagePreview";

class AutoTitleImageControl extends ImageControl {
  async onAddAsset(file) {
    const filename = file.name;
    if (!filename.toLowerCase().endsWith(".avif")) {
      alert("Only .avif files allowed");
      return;
    }
    // call parent upload logic
    const asset = await super.onAddAsset(file);
    if (asset) {
      // then set title field value
      this.props.onChangeField("title", filename);
      // also set the image field value (via parent)
      this.props.onChange(asset);
    }
    return asset;
  }
}

CMS.registerWidget(
  "auto_title_image",
  AutoTitleImageControl,
  ImagePreview
);
