// List exact model names (strings) to mark as "Coming Soon".
// When you add a model here (exact text match, e.g. "Qwen3-4B-Instruct-2507-GGUF"),
// the index page will:
//  - show a "Coming Soon" label in the Overview next to the bold model name,
//  - show "(Coming Soon)" in the Roadmap links for that model,
//  - disable (and visually muted) the HF repository link for that model.
//
// To re-enable a model, remove it from this array.
window.comingSoonModels = [
    "Qwen3-4B-Instruct-2507-GGUF", "LFM2-2.6B-GGUF"
];

document.addEventListener('DOMContentLoaded', function () {
    // Apply "Coming Soon" behavior based on window.comingSoonModels
    window.markComingSoon = function() {
        const models = (window.comingSoonModels || []).map(m => String(m).trim()).filter(Boolean);
        if (!models.length) return;

        // Helper to create label node
        const createLabel = (text = 'Coming Soon') => {
            const span = document.createElement('span');
            span.className = 'coming-soon';
            span.textContent = text;
            return span;
        };

        // 1) Overview: look for bold model names (<b>ModelName</b>) and append label after them
        document.querySelectorAll('.main-content b').forEach(b => {
            const name = b.textContent.trim();
            if (models.includes(name)) {
                // avoid duplicates
                if (!b.parentElement.querySelector('.coming-soon')) {
                    b.parentElement.insertBefore(createLabel('Coming Soon'), b.nextSibling);
                }
            }
        });

        // 2) Roadmap: add label to matching links but DO NOT disable them
        document.querySelectorAll('#roadmap a').forEach(a => {
            const text = a.textContent.trim();
            // strip any existing "Coming Soon" text for matching
            const cleanText = text.replace(/\(Coming Soon\)|Coming Soon/gi, '').trim();
            if (models.includes(cleanText)) {
                // append label if not present
                if (!a.querySelector('.coming-soon')) {
                    a.appendChild(createLabel(' (Coming Soon)'));
                }
                // Note: link left intact and clickable per request
            }
        });

        // 3) Headers: add label to h2 headers matching the model name
        document.querySelectorAll('h2[id]').forEach(h2 => {
            const text = h2.textContent.trim();
            const cleanText = text.replace(/\(Coming Soon\)|Coming Soon/gi, '').trim();
            if (models.includes(cleanText)) {
                if (!h2.querySelector('.coming-soon')) {
                    h2.appendChild(createLabel(' (Coming Soon)'));
                }
            }
        });

        // NEW: mark dropdown-toggle buttons that contain any coming-soon items
        document.querySelectorAll('#roadmap .dropdown-container').forEach(container => {
            const toggle = container.querySelector('.dropdown-toggle');
            const hasComing = !!container.querySelector('a .coming-soon');
            if (toggle) {
                const existingDot = toggle.querySelector('.coming-soon-dot');
                if (existingDot) existingDot.remove();

                if (hasComing) {
                    toggle.classList.add('has-coming-soon');
                    const dot = document.createElement('span');
                    dot.className = 'coming-soon-dot';
                    toggle.appendChild(dot);
                } else {
                    toggle.classList.remove('has-coming-soon');
                }
            }
        });

        // 4) Disable HF repository links that correspond to coming-soon models
        document.querySelectorAll('.main-content a').forEach(a => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            // Only consider huggingface links
            if (!href.includes('huggingface.co')) return;
            // check if href or link text mentions any coming-soon model
            const text = (a.textContent || '').toLowerCase().trim();
            const matched = models.some(m => {
                const low = m.toLowerCase();
                return href.includes(low) || text.includes(low);
            });
            if (matched) {
                if (!a.dataset.origHref) a.dataset.origHref = a.getAttribute('href') || '';
                a.setAttribute('href', '#');
                a.setAttribute('aria-disabled', 'true');
                a.classList.add('disabled-coming-soon');
                a.addEventListener('click', function (e) { e.preventDefault(); });
                // visual hint
                a.style.pointerEvents = 'none';
                a.style.color = '#6c757d';
                a.style.textDecoration = 'none';
            }
        });
    };
    window.markComingSoon();
});
