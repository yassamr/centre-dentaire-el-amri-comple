class ArticleManager {
    constructor() {
        this.articleSlug = this.getSlugFromURL();
        this.article = null;
        this.relatedArticles = [];
        
        this.init();
    }
    
    getSlugFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug') || 'sample-article';
    }
    
    async init() {
        await this.loadArticle();
        this.loadRelatedArticles();
        this.setupEventListeners();
        this.updateSEO();
    }
    
    async loadArticle() {
        try {
            // En production, charger depuis l'API Netlify CMS
            const response = await fetch(`/content/blog/${this.articleSlug}.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.article = await response.json();
            
        } catch (error) {
            console.error('Error loading article:', error);
            this.article = this.getSampleArticle();
        }
        
        this.renderArticle();
    }
    
    getSampleArticle() {
        return {
            title: "L'importance du détartrage régulier",
            subtitle: "Pourquoi ce soin préventif est essentiel pour votre santé bucco-dentaire",
            date: "2025-01-15",
            author: "Dr Leila EL AMRI",
            category: "Prévention",
            content: `
                <h2>Pourquoi le détartrage est-il si important ?</h2>
                <p>Le détartrage régulier est l'un des soins préventifs les plus importants en dentisterie. Malgré une bonne hygiène bucco-dentaire, le tartre finit par s'accumuler sur les dents.</p>
                
                <h3>Les risques du tartre non traité</h3>
                <ul>
                    <li>Inflammation des gencives (gingivite)</li>
                    <li>Maladies parodontales</li>
                    <li>Carie dentaire</li>
                    <li>Halitose (mauvaise haleine)</li>
                </ul>
                
                <h2>À quelle fréquence faut-il faire un détartrage ?</h2>
                <p>Il est recommandé de faire un détartrage tous les 6 à 12 mois, selon votre situation individuelle. Votre dentiste évaluera la fréquence idéale lors de votre consultation.</p>
            `,
            image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format",
            meta_description: "Découvrez pourquoi un détartrage régulier est essentiel pour prévenir les problèmes dentaires et maintenir une bonne santé bucco-dentaire."
        };
    }
    
    renderArticle() {
        if (!this.article) return;
        
        // Mettre à jour le titre du breadcrumb
        const breadcrumb = document.getElementById('article-title-breadcrumb');
        if (breadcrumb) {
            breadcrumb.textContent = this.article.title;
        }
        
        // Rendre l'en-tête
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
                    ${this.article.category ? `
                        <div class="article-category-header">
                            ${this.article.category}
                        </div>
                    ` : ''}
                </div>
                ${this.article.image ? `
                    <div class="article-featured-image">
                        <img src="${this.article.image}" alt="${this.article.title}" loading="eager">
                    </div>
                ` : ''}
            `;
        }
        
        // Rendre le contenu
        const content = document.getElementById('article-content');
        if (content) {
            content.innerHTML = this.article.content || '<p>Article en cours de chargement...</p>';
        }
        
        // Mettre à jour l'auteur si spécifique
        const authorElement = document.getElementById('article-author');
        if (authorElement && this.article.author) {
            authorElement.textContent = this.article.author;
        }
    }
    
    async loadRelatedArticles() {
        try {
            const response = await fetch('/content/blog/articles.json');
            const articles = await response.json();
            
            // Filtrer les articles de la même catégorie, exclure l'article actuel
            this.relatedArticles = articles
                .filter(article => 
                    article.slug !== this.articleSlug && 
                    article.category === this.article?.category
                )
                .slice(0, 3);
            
            this.renderRelatedArticles();
            
        } catch (error) {
            console.error('Error loading related articles:', error);
        }
    }
    
    renderRelatedArticles() {
        const container = document.getElementById('related-articles');
        if (!container) return;
        
        const relatedGrid = container.querySelector('.related-grid');
        if (!relatedGrid) return;
        
        if (this.relatedArticles.length === 0) {
            relatedGrid.innerHTML = `
                <p style="grid-column: 1 / -1; text-align: center; color: var(--gray);">
                    Aucun article similaire pour le moment.
                </p>
            `;
            return;
        }
        
        relatedGrid.innerHTML = this.relatedArticles.map(article => `
            <div class="related-article">
                ${article.image ? `
                    <img src="${article.image}" alt="${article.title}">
                ` : ''}
                <div class="related-article-content">
                    <h3 class="related-article-title">
                        <a href="article.html?slug=${article.slug}">${article.title}</a>
                    </h3>
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
        
        // Mettre à jour le titre de la page
        document.title = `${this.article.title} | Blog Centre Dentaire EL AMRI`;
        
        // Mettre à jour la meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = this.article.meta_description || this.article.excerpt || '';
        
        // Mettre à jour les meta Open Graph
        this.updateMeta('og:title', this.article.title);
        this.updateMeta('og:description', this.article.meta_description || this.article.excerpt || '');
        this.updateMeta('og:image', this.article.image || '');
        this.updateMeta('og:url', window.location.href);
        
        // Mettre à jour Twitter Cards
        this.updateMeta('twitter:title', this.article.title);
        this.updateMeta('twitter:description', this.article.meta_description || this.article.excerpt || '');
        this.updateMeta('twitter:image', this.article.image || '');
    }
    
    updateMeta(property, content) {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.content = content;
    }
}

// Initialiser l'article
document.addEventListener('DOMContentLoaded', () => {
    new ArticleManager();
});