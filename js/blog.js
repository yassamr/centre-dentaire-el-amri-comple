// js/blog.js - Version simplifiée

class BlogManager {
    constructor() {
        this.articlesPerPage = 6;
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
            // Charger depuis le fichier JSON
            const response = await fetch('content/articles.json');
            
            if (response.ok) {
                this.articles = await response.json();
                console.log(`${this.articles.length} articles chargés`);
            } else {
                // Fallback aux données intégrées
                this.articles = this.getDemoArticles();
            }
            
        } catch (error) {
            console.error('Erreur:', error);
            this.articles = this.getDemoArticles();
        }
    }
    
    getDemoArticles() {
        return [
            {
                id: 1,
                title: "L'importance du détartrage régulier",
                excerpt: "Pourquoi ce soin préventif est essentiel pour votre santé bucco-dentaire",
                date: "2025-01-15",
                category: "Prévention",
                image: "img/detartrage.jpg",
                slug: "detartrage"
            },
            {
                id: 2,
                title: "Les nouvelles technologies en implantologie",
                excerpt: "Comment les avancées technologiques révolutionnent les traitements d'implants",
                date: "2025-01-10",
                category: "Implantologie",
                image: "img/implantologie.jpg",
                slug: "implantologie"
            },
            {
                id: 3,
                title: "Blanchiment dentaire : ce qu'il faut savoir",
                excerpt: "Tout sur les techniques de blanchiment dentaire sécuritaires et efficaces",
                date: "2025-01-05",
                category: "Esthétique",
                image: "img/blanchiment.jpg",
                slug: "blanchiment"
            }
        ];
    }
    
    // ... le reste du code reste identique ...
    
    createArticleCard(article) {
        const date = new Date(article.date);
        const formattedDate = date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Lien simple avec ID
        const articleUrl = `article.html?id=${article.id}`;
        
        return `
            <article class="article-card">
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNFOEYwRkYiLz48cGF0aCBkPSJNNDAwIDMwMEM0NDguMiAzMDAgNDg4IDI2MC4yIDQ4OCAyMTJjMC00OC4yLTM5LjgtODgtODgtODhzLTg4IDM5LjgtODggODhjMCA0OC4yIDM5LjggODggODggODh6IiBmaWxsPSIjMmM1YWEwIi8+PC9zdmc+'; this.onerror=null;">
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
}

// Initialiser
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});
