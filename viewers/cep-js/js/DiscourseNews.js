export async function loadNewsCards(app) {
    const container = app.querySelector('#NewsCards');
    const [newsRes, templateRes] = await Promise.all([
        fetch('/viewers/cep-js/compiled-json/DiscourseNews.json'),
        fetch('/viewers/cep-js/Card.html')
    ]);
    const topics = await newsRes.json();
    const template = await templateRes.text();

    topics.forEach(t => {
        const date = new Date(t.created_at);
        const formatted = date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        }).replace(',', '.');

        const wrapper = document.createElement('div');
        wrapper.innerHTML = template;

        wrapper.querySelector('.CardImage').innerHTML = `<a href="${t.url}"><img src="${t.image_url}" alt="${t.title}"></img></a>`;
        wrapper.querySelector('.CardLink').innerHTML = `<a href="${t.url}"><span>${t.title}</span></a>`;
        wrapper.querySelector('.CardText').innerHTML = `<strong>${formatted}</strong> - ${t.views} views`;
        
        container.appendChild(wrapper.firstElementChild);
    });
}