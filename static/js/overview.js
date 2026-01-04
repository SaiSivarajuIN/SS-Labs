async function loadOverviewData() {
    try {
        const [newResponse, modelsResponse] = await Promise.all([
            fetch('../static/data/new.json'),
            fetch('../static/data/models.json')
        ]);
        
        const models = await newResponse.json();
        const allModelsData = await modelsResponse.json();
        
        // Create a lookup for model name -> id
        const modelIdMap = {};
        allModelsData.forEach(m => {
            modelIdMap[m.name] = m.id;
        });
        
        const overviewList = document.getElementById('overview-list');
        overviewList.innerHTML = '';
        
        models.forEach(modelName => {
            const modelId = modelIdMap[modelName];
            const li = document.createElement('li');
            if (modelId) {
                li.innerHTML = `<b><a href="#${modelId}">${modelName}</a></b>`;
            } else {
                li.innerHTML = `<b><a>${modelName}</a></b>`;
            }
            overviewList.appendChild(li);
        });
        
        // Call markNew after populating overview
        if (window.markNew) {
            window.markNew();
        }
        
        // Call markComingSoon if available
        if (window.markComingSoon) {
            window.markComingSoon();
        }
    } catch (error) {
        console.error('Error loading overview data:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadOverviewData);
