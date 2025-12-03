class BlogManager {
    constructor() {
        this.articlesPerPage = 9;
        this.currentPage = 1;
        this.totalPages = 1;
        this.currentCategory = 'all';
        this.articles = [];
        
        this.init();
    }
    
    async init() {
        await this.loadArticles();
        this.setupEventListeners();
        this.renderArticles();
        this.renderPagination();
    }
    
    async loadArticles() {
        try {
            // En production, cela pointera vers votre API Netlify CMS
            const response = await fetch('/content/blog/articles.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.articles = await response.json();
            
            // Si pas de fichier JSON, utiliser des données de test
            if (!this.articles || this.articles.length === 0) {
                this.articles = this.getSampleArticles();
            }
            
        } catch (error) {
            console.error('Error loading articles:', error);
            this.articles = this.getSampleArticles();
            this.showError('Impossible de charger les articles. Affichage des exemples.');
        }
    }
    
    getSampleArticles() {
        return [
            {
                id: 1,
                title: "L'importance du détartrage régulier",
                excerpt: "Découvrez pourquoi un détartrage tous les 6 mois est essentiel pour votre santé bucco-dentaire.",
                date: "2025-01-15",
                category: "Prévention",
                image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format",
                slug: "importance-detartrage-regulier"
            },
            {
                id: 2,
                title: "Les nouvelles technologies en implantologie",
                excerpt: "Comment les avancées technologiques révolutionnent les traitements d'implants dentaires.",
                date: "2025-01-10",
                category: "Implantologie",
                image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w-800&auto=format",
                slug: "nouvelles-technologies-implantologie"
            },
            // Ajouter plus d'articles de test...
        ];
    }
    
    setupEventListeners() {
        // Filtres par catégorie
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const category = btn.dataset.category;
                this.filterByCategory(category);
                
                // Mettre à jour les boutons actifs
                document.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
            });
        });
        
        // Newsletter
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.subscribeNewsletter(newsletterForm);
            });
        }
    }
    
    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        this.renderArticles();
        this.renderPagination();
    }
    
    getFilteredArticles() {
        if (this.currentCategory === 'all') {
            return this.articles;
        }
        
        return this.articles.filter(article => 
            article.category.toLowerCase() === this.currentCategory.toLowerCase()
        );
    }
    
    getPaginatedArticles() {
        const filteredArticles = this.getFilteredArticles();
        this.totalPages = Math.ceil(filteredArticles.length / this.articlesPerPage);
        
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        
        return filteredArticles.slice(startIndex, endIndex);
    }
    
    renderArticles() {
        const grid = document.getElementById('articles-grid');
        if (!grid) return;
        
        const articles = this.getPaginatedArticles();
        
        if (articles.length === 0) {
            grid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-newspaper"></i>
                    <h3>Aucun article trouvé</h3>
                    <p>Aucun article n'est disponible pour cette catégorie.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = articles.map(article => this.createArticleCard(article)).join('');
    }
    
    createArticleCard(article) {
    const date = new Date(article.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // URL simple pour la démo
    const articleUrl = `article.html?id=${article.id}&title=${encodeURIComponent(article.title)}`;
    
    return `
        <article class="article-card">
            <div class="article-image">
                <div style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); 
                          display: flex; align-items: center; justify-content: center; color: white;">
                    <i class="fas fa-tooth" style="font-size: 2rem;"></i>
                </div>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category">${article.category}</span>
                    <time datetime="${article.date}">${formattedDate}</time>
                </div>
                <h2 class="article-title">
                    <a href="${articleUrl}">${article.title}</a>
                </h2>
                <p class="article-excerpt">${article.excerpt}</p>
                <a href="${articleUrl}" class="article-read-more">
                    Lire l'article
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `;
}
    
    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        if (this.totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let buttons = '';
        
        // Bouton précédent
        buttons += `
            <button class="pagination-btn prev" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Numéros de page
        for (let i = 1; i <= this.totalPages; i++) {
            buttons += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        }
        
        // Bouton suivant
        buttons += `
            <button class="pagination-btn next" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        pagination.innerHTML = buttons;
        
        // Événements de pagination
        pagination.querySelectorAll('.pagination-btn').forEach((btn, index) => {
            if (index === 0) {
                // Bouton précédent
                btn.addEventListener('click', () => {
                    if (this.currentPage > 1) {
                        this.currentPage--;
                        this.renderArticles();
                        this.renderPagination();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            } else if (index === this.totalPages + 1) {
                // Bouton suivant
                btn.addEventListener('click', () => {
                    if (this.currentPage < this.totalPages) {
                        this.currentPage++;
                        this.renderArticles();
                        this.renderPagination();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            } else {
                // Numéros de page
                btn.addEventListener('click', () => {
                    this.currentPage = index;
                    this.renderArticles();
                    this.renderPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        });
    }
    
    async subscribeNewsletter(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        try {
            // En production, intégrer avec un service comme Mailchimp
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                alert('Merci pour votre inscription à la newsletter !');
                form.reset();
            } else {
                throw new Error('Échec de l\'inscription');
            }
        } catch (error) {
            alert('Merci pour votre intérêt ! L\'inscription à la newsletter sera bientôt disponible.');
        }
    }
    
    showError(message) {
        console.warn(message);
        // Vous pouvez afficher un message d'erreur à l'utilisateur si nécessaire
    }
}

// Initialiser le blog
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();

});
