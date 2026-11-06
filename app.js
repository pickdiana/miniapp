document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('config.json');
        const data = await response.json();

        // Configurar marca y soporte
        document.getElementById('brand-title').textContent = data.brandName;
        document.getElementById('support-link').href = data.telegramSupport;

        const grid = document.getElementById('products');
        const categoryNav = document.getElementById('category-nav');
        const productCount = document.getElementById('product-count');

        // Renderizar categorías
        categoryNav.innerHTML = data.categories.map((cat, index) => `
            <a href="#collection" data-category="${cat.toLowerCase()}" class="${index === 0 ? 'active' : ''}">${cat}</a>
        `).join('');

        // Renderizar productos
        function renderProducts(filter = 'all') {
            const filtered = filter === 'all' 
                ? data.products 
                : data.products.filter(p => p.category.toLowerCase() === filter);

            productCount.textContent = `${filtered.length} pieces`;

            grid.innerHTML = filtered.map(p => `
                <article class="product-card surface-card" data-category="${p.category.toLowerCase()}">
                    <div class="product-link" style="cursor: pointer;">
                        <div class="product-image">
                            <img class="product-photo" src="${p.image}" alt="${p.title}" loading="lazy">
                        </div>
                        <div class="product-copy">
                            <p class="product-category">
                                ${p.category}
                                <span class="availability ${p.inStock ? 'availability-in-stock' : 'availability-out'}">
                                    ${p.inStock ? 'In stock' : 'Out'}
                                </span>
                            </p>
                            <h2>${p.title}</h2>
                            <div class="product-meta">
                                <p class="product-price">
                                    <span class="price-tier">
                                        <span class="price-amount">${p.price}</span>
                                        <span class="price-weight"> ${p.weight}</span>
                                    </span>
                                </p>
                                ${p.video ? `<a href="${p.video}" target="_blank" class="product-open action-circle" title="Ver Vídeo"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 3l14 9-14 9V3z"/></svg></a>` : ''}
                            </div>
                        </div>
                    </div>
                </article>
            `).join('');
        }

        renderProducts('all');

        // Eventos de filtrado por categoría
        categoryNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                categoryNav.querySelectorAll('a').forEach(a => a.removeAttribute('aria-current'));
                e.target.setAttribute('aria-current', 'page');
                const cat = e.target.getAttribute('data-category');
                renderProducts(cat);
            }
        });

    } catch (error) {
        console.error('Error cargando la configuración de la tienda:', error);
    }
});
