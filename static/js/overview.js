async function loadOverviewData() {
    try {
        const response = await fetch('../static/data/new.json');
        const models = await response.json();
        
        const overviewList = document.getElementById('overview-list');
        overviewList.innerHTML = '';
        
        models.forEach(modelName => {
            const modelId = modelName.toLowerCase().replace(/\s+/g, '-');
            const li = document.createElement('li');
            li.innerHTML = `<b><a>${modelName}</a></b>`;
            overviewList.appendChild(li);
        });
        
        // Call markNew after populating overview
        if (window.markNew) {
            window.markNew();
        }
    } catch (error) {
        console.error('Error loading overview data:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadOverviewData);
