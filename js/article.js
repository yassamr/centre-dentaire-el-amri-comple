// js/article.js - Version simplifiée sans npm

class ArticleManager {
    constructor() {
        this.articleId = this.getIdFromURL();
        this.article = null;
        this.relatedArticles = [];
        
        this.init();
    }
    
    getIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || '1';
    }
    
    async init() {
        await this.loadArticle();
        this.setupEventListeners();
        this.updateSEO();
    }
    
    async loadArticle() {
        try {
            // Charger les articles depuis le fichier JSON
            const response = await fetch('content/articles.json');
            
            if (!response.ok) {
                throw new Error('Fichier articles.json non trouvé');
            }
            
            const articles = await response.json();
            
            // Trouver l'article par ID
            this.article = articles.find(article => article.id == this.articleId);
            
            // Si pas trouvé, prendre le premier
            if (!this.article) {
                this.article = articles[0] || this.getSampleArticle();
            }
            
            this.renderArticle();
            this.loadRelatedArticles(articles);
            
        } catch (error) {
            console.error('Erreur:', error);
            // Utiliser les articles de démo intégrés
            this.article = this.getDemoArticle(this.articleId);
            this.renderArticle();
        }
    }
    
    getDemoArticle(id) {
        const demoArticles = {
            1: {
                id: 1,
                title: "L'importance du détartrage régulier",
                subtitle: "Pourquoi ce soin préventif est essentiel pour votre santé bucco-dentaire",
                date: "2025-01-15",
                author: "Dr Leila EL AMRI",
                category: "Prévention",
                content: `
                    <h2>Pourquoi le détartrage est-il si important ?</h2>
                    <p>Le détartrage régulier est l'un des soins préventifs les plus importants en dentisterie.</p>
                    
                    <h3>Les risques du tartre non traité</h3>
                    <ul>
                        <li>Inflammation des gencives (gingivite)</li>
                        <li>Maladies parodontales</li>
                        <li>Carie dentaire</li>
                        <li>Halitose (mauvaise haleine)</li>
                    </ul>
                `,
                image: "img/detartrage.jpg",
                excerpt: "Pourquoi ce soin préventif est essentiel",
                meta_description: "Découvrez l'importance du détartrage régulier"
            },
            2: {
                id: 2,
                title: "Les nouvelles technologies en implantologie",
                subtitle: "Comment les avancées technologiques révolutionnent les traitements",
                date: "2025-01-10",
                author: "Dr Leila EL AMRI",
                category: "Implantologie",
                content: `
                    <h2>L'évolution de l'implantologie dentaire</h2>
                    <p>Des avancées spectaculaires rendent les traitements plus précis et confortables.</p>
                    
                    <h3>Nouvelles technologies</h3>
                    <ul>
                        <li>Scanner 3D intra-oral</li>
                        <li>Chirurgie guidée par ordinateur</li>
                        <li>Impression 3D</li>
                        <li>Implants en zircone</li>
                    </ul>
                `,
                image: "img/implantologie.jpg",
                excerpt: "Les avancées technologiques en implantologie",
                meta_description: "Découvrez les nouvelles technologies en implantologie"
            },
            3: {
                id: 3,
                title: "Blanchiment dentaire : ce qu'il faut savoir",
                subtitle: "Tout sur les techniques de blanchiment sécuritaires",
                date: "2025-01-05",
                author: "Dr Leila EL AMRI",
                category: "Esthétique",
                content: `
                    <h2>Les méthodes de blanchiment</h2>
                    <p>Plusieurs techniques existent selon vos besoins.</p>
                    
                    <h3>Blanchiment au fauteuil</h3>
                    <p>Résultats immédiats en une séance au cabinet.</p>
                    
                    <h3>Blanchiment à domicile</h3>
                    <p>Traitement progressif avec des gouttières sur mesure.</p>
                `,
                image: "img/blanchiment.jpg",
                excerpt: "Techniques de blanchiment dentaire",
                meta_description: "Tout savoir sur le blanchiment dentaire"
            }
        };
        
        return demoArticles[id] || demoArticles[1];
    }
    
    renderArticle() {
        if (!this.article) return;
        
        // 1. Mettre à jour le breadcrumb
        const breadcrumb = document.getElementById('article-title-breadcrumb');
        if (breadcrumb) {
            breadcrumb.textContent = this.article.title;
        }
        
        // 2. Rendre l'en-tête
        const header = document.getElementById('article-header');
        if (header) {
            const date = new Date(this.article.date);
            const formattedDate = date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            header.innerHTML = `
                <h1>${this.article.title}</h1>
                ${this.article.subtitle ? `<p class="article-subtitle">${this.article.subtitle}</p>` : ''}
                <div class="article-meta-header">
                    <div class="article-date">
                        <i class="far fa-calendar"></i>
                        <time datetime="${this.article.date}">${formattedDate}</time>
                    </div>
                    <div class="article-author">
                        <i class="fas fa-user-md"></i>
                        <span>${this.article.author}</span>
                    </div>
                    <div class="article-category-header">
                        ${this.article.category}
                    </div>
                </div>
                <div class="article-featured-image">
                    <img src="${this.article.image}" alt="${this.article.title}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNFOEYwRkYiLz48cGF0aCBkPSJNNDAwIDMwMEM0NDguMiAzMDAgNDg4IDI2MC4yIDQ4OCAyMTJjMC00OC4yLTM5LjgtODgtODgtODhzLTg4IDM5LjgtODggODhjMCA0OC4yIDM5LjggODggODggODh6IiBmaWxsPSIjMmM1YWEwIi8+PC9zdmc+'; this.onerror=null;">
                </div>
            `;
        }
        
        // 3. Rendre le contenu
        const content = document.getElementById('article-content');
        if (content) {
            content.innerHTML = this.article.content || '<p>Contenu non disponible.</p>';
        }
        
        // 4. Mettre à jour l'auteur
        const authorElement = document.getElementById('article-author');
        if (authorElement) {
            authorElement.textContent = this.article.author;
        }
    }
    
    loadRelatedArticles(allArticles) {
        if (!this.article || !allArticles) return;
        
        // Prendre 3 articles aléatoires (sauf l'actuel)
        this.relatedArticles = allArticles
            .filter(article => article.id != this.article.id)
            .slice(0, 3);
        
        this.renderRelatedArticles();
    }
    
    renderRelatedArticles() {
        const container = document.getElementById('related-articles');
        if (!container) return;
        
        const relatedGrid = container.querySelector('.related-grid');
        if (!relatedGrid) return;
        
        if (this.relatedArticles.length === 0) {
            relatedGrid.innerHTML = `
                <p style="text-align: center; color: var(--gray); padding: 2rem;">
                    Aucun autre article pour le moment.
                </p>
            `;
            return;
        }
        
        relatedGrid.innerHTML = this.relatedArticles.map(article => `
            <div class="related-article">
                <div class="related-image">
                    <img src="${article.image}" alt="${article.title}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNFOEYwRkYiLz48cGF0aCBkPSJNNDAwIDMwMEM0NDguMiAzMDAgNDg4IDI2MC4yIDQ4OCAyMTJjMC00OC4yLTM5LjgtODgtODgtODhzLTg4IDM5LjgtODggODhjMCA0OC4yIDM5LjggODggODggODh6IiBmaWxsPSIjMmM1YWEwIi8+PC9zdmc+'; this.onerror=null;">
                </div>
                <div class="related-article-content">
                    <div class="related-category">${article.category}</div>
                    <h3 class="related-article-title">
                        <a href="article.html?id=${article.id}">${article.title}</a>
                    </h3>
                    <p class="related-excerpt">${article.excerpt}</p>
                </div>
            </div>
        `).join('');
    }
    
    setupEventListeners() {
        // Fonctions de partage
        window.shareFacebook = () => {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(this.article?.title || '');
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
        };
        
        window.shareTwitter = () => {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(this.article?.title || '');
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        };
        
        window.shareLinkedIn = () => {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        };
        
        window.shareWhatsApp = () => {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(`${this.article?.title || ''} ${url}`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        };
    }
    
    updateSEO() {
        if (!this.article) return;
        
        // Mettre à jour le titre
        document.title = `${this.article.title} | Centre Dentaire EL AMRI`;
        
        // Mettre à jour la description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = this.article.meta_description || this.article.excerpt;
        }
    }
}

// Initialiser
document.addEventListener('DOMContentLoaded', () => {
    new ArticleManager();
    
    // Menu mobile
    const mobileMenu = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileMenu && mainNav) {
        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }
});
