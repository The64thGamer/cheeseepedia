function registerHTMLPreviewTemplate(collectionName) {
  CMS.registerPreviewTemplate(collectionName, ({ entry }) => {
    const data = entry.getIn(['data']);
    return `
      <article>
        <h1>${data.get('title')}</h1>
        <div>${data.get('body')}</div>
      </article>
    `;
  });
}
const items = [
  "Animatronic Shows", "Stage Variations", "Animatronics", "Retrofits", "Costumed Characters", 
  "Animatronic Repair & Preservation", "Showtapes", "Showtape Formats", "Live Shows", 
  "Showtape Puppets", "Family Vision", "ShowBiz Pizza Programs", "Merchandise", "Menu Items", 
  "Tokens", "Tickets", "Movies", "Video Games", "Locations", "Arcade Games", "Employee Wear", 
  "Remodels & Initiatives", "Store Fixtures", "Ad Vehicles", "Animatronic Control Systems", 
  "Other Systems", "Programming Systems", "Animatronic Control Systems", "Promotional Material", 
  "Documents", "Corporate Documents", "Training, Updates, & Company Media", "Photos", "Videos", 
  "News Footage", "Commercials", "History", "Events", "Characters"
];

items.forEach(item => {
  registerHTMLPreviewTemplate(item);
});
