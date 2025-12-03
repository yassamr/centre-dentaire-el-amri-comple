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
    
    getTitleFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('title') || 'Titre de l\'article';
    }
    
    async init() {
        await this.loadArticle();
        this.setupEventListeners();
        this.updateSEO();
    }
    
    async loadArticle() {
        try {
            // Récupérer les paramètres de l'URL
            const articleId = this.getIdFromURL();
            const articleTitle = this.getTitleFromURL();
            
            // Données de démonstration basées sur l'ID
            this.article = this.getArticleById(articleId, articleTitle);
            
        } catch (error) {
            console.error('Error loading article:', error);
            this.article = this.getSampleArticle();
        }
        
        this.renderArticle();
    }
    
    getArticleById(id, title) {
        // Articles de démonstration
        const articles = {
            '1': {
                title: decodeURIComponent(title),
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
                    
                    <h3>Le processus de détartrage</h3>
                    <p>Le détartrage se fait en plusieurs étapes :</p>
                    <ol>
                        <li>Examen initial des dents et des gencives</li>
                        <li>Élimination du tartre avec des instruments ultrasoniques</li>
                        <li>Polissage des dents</li>
                        <li>Application de fluor si nécessaire</li>
                    </ol>
                `,
                image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format",
                meta_description: "Découvrez pourquoi un détartrage régulier est essentiel pour prévenir les problèmes dentaires et maintenir une bonne santé bucco-dentaire."
            },
            '2': {
                title: decodeURIComponent(title),
                subtitle: "Comment les avancées technologiques révolutionnent les traitements d'implants",
                date: "2025-01-10",
                author: "Dr Leila EL AMRI",
                category: "Implantologie",
                content: `
                    <h2>L'évolution de l'implantologie</h2>
                    <p>L'implantologie dentaire a connu des avancées spectaculaires ces dernières années, rendant les traitements plus précis, plus rapides et plus confortables.</p>
                    
                    <h3>Nouvelles technologies</h3>
                    <ul>
                        <li><strong>Scanner 3D intra-oral</strong> : Prise d'empreinte numérique sans pâte</li>
                        <li><strong>Chirurgie guidée</strong> : Placement d'implants assisté par ordinateur</li>
                        <li><strong>Impression 3D</strong> : Fabrication de guides chirurgicaux et de prothèses</li>
                        <li><strong>Implants en zircone</strong> : Alternative au titane pour les patients allergiques</li>
                    </ul>
                    
                    <h2>Avantages pour les patients</h2>
                    <p>Ces innovations offrent de nombreux bénéfices :</p>
                    <ul>
                        <li>Durée de traitement réduite</li>
                        <li>Précision accrue</li>
                        <li>Confort amélioré</li>
                        <li>Meilleurs résultats esthétiques</li>
                        <li>Cicatrisation plus rapide</li>
                    </ul>
                `,
                image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format",
                meta_description: "Découvrez comment les nouvelles technologies révolutionnent les traitements d'implants dentaires pour plus de précision, de confort et de rapidité."
            },
            '3': {
                title: decodeURIComponent(title),
                subtitle: "Tout sur les techniques de blanchiment dentaire sécuritaires et efficaces",
                date: "2025-01-05",
                author: "Dr Leila EL AMRI",
                category: "Esthétique",
                content: `
                    <h2>Les différentes méthodes de blanchiment</h2>
                    <p>Il existe plusieurs techniques de blanchiment dentaire, chacune avec ses avantages et indications spécifiques.</p>
                    
                    <h3>Blanchiment au fauteuil</h3>
                    <p>Réalisé au cabinet dentaire, cette méthode offre des résultats immédiats en une seule séance. Elle utilise des gels blanchissants à forte concentration activés par une lumière LED spéciale.</p>
                    
                    <h3>Blanchiment ambulatoire</h3>
                    <p>Cette méthode se fait à domicile avec des gouttières sur mesure et un gel blanchissant de concentration adaptée. Elle permet un traitement progressif sur 1 à 2 semaines.</p>
                    
                    <h2>Ce qu'il faut savoir</h2>
                    <ul>
                        <li>Le blanchiment n'est pas permanent</li>
                        <li>Les résultats varient selon les personnes</li>
                        <li>Il est important de faire un bilan dentaire préalable</li>
                        <li>Certaines sensibilités temporaires peuvent survenir</li>
                    </ul>
                    
                    <h3>Contre-indications</h3>
                    <p>Le blanchiment n'est pas recommandé pour :</p>
                    <ul>
                        <li>Les femmes enceintes ou allaitantes</li>
                        <li>Les personnes avec des dents sensibles non traitées</li>
                        <li>Les patients avec des restaurations importantes</li>
                        <li>Les dents dévitalisées très colorées</li>
                    </ul>
                `,
                image: "https://images.unsplash.com/photo-1622902046586-2e57cc6e0b91?w=800&auto=format",
                meta_description: "Tout ce que vous devez savoir sur le blanchiment dentaire : techniques, avantages, précautions et résultats attendus."
            }
        };
        
        return articles[id] || this.getSampleArticle(title);
    }
    
    getSampleArticle(title = 'Titre de l\'article') {
        return {
            title: decodeURIComponent(title),
            subtitle: "Pourquoi ce soin préventif est essentiel pour votre santé bucco-dentaire",
            date: new Date().toISOString().split('T')[0],
            author: "Dr Leila EL AMRI",
            category: "Prévention",
            content: `
                <h2>Article en cours de chargement</h2>
                <p>Le contenu de cet article sera bientôt disponible.</p>
                <p>En attendant, vous pouvez nous contacter pour plus d'informations.</p>
            `,
            image: "",
            meta_description: "Article sur la santé dentaire - Centre Dentaire EL AMRI"
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
                        <img src="${this.article.image}" alt="${this.article.title}" loading="lazy">
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
