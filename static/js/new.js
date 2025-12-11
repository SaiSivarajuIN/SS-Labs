// List of "New" models is fetched from ../static/data/new.json
window.newModels = [];

document.addEventListener('DOMContentLoaded', function () {
    // Apply "New" behavior based on window.newModels
    window.markNew = function() {
        const models = (window.newModels || []).map(m => String(m).trim()).filter(Boolean);
        if (!models.length) return;

        // Helper to create label node
        const createLabel = (text = 'New') => {
            const span = document.createElement('span');
            span.className = 'new-tag';
            span.textContent = text;
            return span;
        };

        // 1) Overview: look for bold model names (<b>ModelName</b>) and append label after them
        document.querySelectorAll('.main-content b').forEach(b => {
            const name = b.textContent.trim();
            if (models.includes(name)) {
                // avoid duplicates
                if (!b.parentElement.querySelector('.new-tag')) {
                    b.parentElement.insertBefore(createLabel('New'), b.nextSibling);
                }
            }
        });

        // 2) Roadmap: add label to matching links
        document.querySelectorAll('#roadmap a').forEach(a => {
            const text = a.textContent.trim();
            // strip any existing "New" text for matching
            const cleanText = text.replace(/\(New\)/gi, '').trim();
            if (models.includes(cleanText)) {
                // append label if not present
                if (!a.querySelector('.new-tag')) {
                    a.appendChild(createLabel(' (New)'));
                }
            }
        });

        // 3) Headers: add label to h2 headers matching the model name
        document.querySelectorAll('h2[id]').forEach(h2 => {
            const text = h2.textContent.trim();
            const cleanText = text.replace(/\(New\)/gi, '').trim();
            if (models.includes(cleanText)) {
                if (!h2.querySelector('.new-tag')) {
                    h2.appendChild(createLabel(' (New)'));
                }
            }
        });

        // 4) Mark dropdown-toggle buttons that contain any new items
        document.querySelectorAll('#roadmap .dropdown-container').forEach(container => {
            const toggle = container.querySelector('.dropdown-toggle');
            const hasNew = !!container.querySelector('a .new-tag');
            if (toggle) {
                const existingDot = toggle.querySelector('.new-tag-dot');
                if (existingDot) existingDot.remove();

                if (hasNew) {
                    toggle.classList.add('has-new-tag');
                    const dot = document.createElement('span');
                    dot.className = 'new-tag-dot';
                    toggle.appendChild(dot);
                } else {
                    toggle.classList.remove('has-new-tag');
                }
            }
        });
    };

    fetch('../static/data/new.json')
        .then(response => response.json())
        .then(data => {
            window.newModels = data;
            window.markNew();
        })
        .catch(error => console.error('Error loading new models:', error));
});