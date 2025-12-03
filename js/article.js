// js/article.js - Version corrigée

class ArticleManager {
    constructor() {
        this.articleId = this.getIdFromURL();
        this.article = null;
        this.relatedArticles = [];
        
        this.init();
    }
    
    getIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || '1'; // Par défaut ID 1
    }
    
    async init() {
        await this.loadArticle();
        this.setupEventListeners();
        this.updateSEO();
    }
    
    async loadArticle() {
        try {
            // Charger tous les articles
            const response = await fetch('/content/articles.json');
            let articles = [];
            
            if (response.ok) {
                articles = await response.json();
            } else {
                // Fallback aux articles de test
                articles = this.getSampleArticles();
            }
            
            // Trouver l'article par ID
            this.article = articles.find(article => article.id == this.articleId);
            
            // Si pas trouvé, prendre le premier
            if (!this.article) {
                this.article = articles[0] || this.getSampleArticle();
            }
            
            this.renderArticle();
            this.loadRelatedArticles(articles);
            
        } catch (error) {
            console.error('Erreur de chargement:', error);
            this.article = this.getSampleArticle();
            this.renderArticle();
        }
    }
    
    getSampleArticles() {
        return [
            {
                id: 1,
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
                        <li><strong>Inflammation des gencives (gingivite)</strong> : Le tartre irrite les gencives et provoque des saignements</li>
                        <li><strong>Maladies parodontales</strong> : L'inflammation peut atteindre l'os qui soutient les dents</li>
                        <li><strong>Carie dentaire</strong> : Les bactéries du tartre produisent des acides qui attaquent l'émail</li>
                        <li><strong>Halitose (mauvaise haleine)</strong> : Les bactéries produisent des composés sulfurés malodorants</li>
                    </ul>
                    
                    <h2>À quelle fréquence faut-il faire un détartrage ?</h2>
                    <p>Il est recommandé de faire un détartrage tous les 6 à 12 mois, selon votre situation individuelle. Votre dentiste évaluera la fréquence idéale lors de votre consultation.</p>
                    
                    <h3>Le processus de détartrage</h3>
                    <p>Le détartrage se fait en plusieurs étapes :</p>
                    <ol>
                        <li><strong>Examen initial</strong> : Vérification de l'état des dents et des gencives</li>
                        <li><strong>Détartrage ultrasonique</strong> : Élimination du tartre avec des vibrations à haute fréquence</li>
                        <li><strong>Polissage</strong> : Lissage des surfaces dentaires pour retarder la réapparition du tartre</li>
                        <li><strong>Fluoruration</strong> : Application de fluor pour renforcer l'émail (si nécessaire)</li>
                    </ol>
                    
                    <div class="info-box">
                        <h4>💡 Conseils pratiques</h4>
                        <ul>
                            <li>Brossez-vous les dents 2 fois par jour pendant 2 minutes</li>
                            <li>Utilisez du fil dentaire ou des brossettes interdentaires quotidiennement</li>
                            <li>Consultez votre dentiste dès l'apparition de saignements gingivaux</li>
                            <li>Évitez le tabac qui favorise l'accumulation de tartre</li>
                        </ul>
                    </div>
                `,
                image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop",
                excerpt: "Pourquoi ce soin préventif est essentiel pour votre santé bucco-dentaire",
                meta_description: "Découvrez pourquoi un détartrage régulier est essentiel pour prévenir les problèmes dentaires et maintenir une bonne santé bucco-dentaire."
            },
            {
                id: 2,
                title: "Les nouvelles technologies en implantologie",
                subtitle: "Comment les avancées technologiques révolutionnent les traitements d'implants",
                date: "2025-01-10",
                author: "Dr Leila EL AMRI",
                category: "Implantologie",
                content: `
                    <h2>L'évolution de l'implantologie dentaire</h2>
                    <p>L'implantologie dentaire a connu des avancées spectaculaires ces dernières années, rendant les traitements plus précis, plus rapides et plus confortables.</p>
                    
                    <h3>Nouvelles technologies disponibles</h3>
                    <div class="tech-grid">
                        <div class="tech-item">
                            <h4>📱 Scanner 3D intra-oral</h4>
                            <p>Prise d'empreinte numérique sans pâte, plus confortable pour le patient</p>
                        </div>
                        <div class="tech-item">
                            <h4>🎯 Chirurgie guidée</h4>
                            <p>Placement d'implants assisté par ordinateur pour une précision maximale</p>
                        </div>
                        <div class="tech-item">
                            <h4>🖨️ Impression 3D</h4>
                            <p>Fabrication de guides chirurgicaux et de prothèses sur mesure</p>
                        </div>
                        <div class="tech-item">
                            <h4>⚪ Implants en zircone</h4>
                            <p>Alternative au titane pour les patients allergiques, plus esthétique</p>
                        </div>
                    </div>
                    
                    <h2>Avantages pour les patients</h2>
                    <p>Ces innovations offrent de nombreux bénéfices :</p>
                    <ul>
                        <li><strong>Durée de traitement réduite</strong> : De quelques mois à quelques semaines</li>
                        <li><strong>Précision accrue</strong> : Placement optimal des implants</li>
                        <li><strong>Confort amélioré</strong> : Moins d'inconfort post-opératoire</li>
                        <li><strong>Résultats prévisibles</strong> : Simulation 3D du résultat final</li>
                        <li><strong>Cicatrisation plus rapide</strong> : Techniques mini-invasives</li>
                    </ul>
                    
                    <h3>Processus de traitement moderne</h3>
                    <ol>
                        <li>Scanner 3D et planification numérique</li>
                        <li>Fabrication du guide chirurgical sur mesure</li>
                        <li>Chirurgie guidée peu invasive</li>
                        <li>Pose immédiate de la prothèse temporaire (dans certains cas)</li>
                        <li>Suivi numérique de la cicatrisation</li>
                        <li>Pose de la prothèse définitive</li>
                    </ol>
                `,
                image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop",
                excerpt: "Comment les avancées technologiques révolutionnent les traitements d'implants",
                meta_description: "Découvrez comment les nouvelles technologies révolutionnent les traitements d'implants dentaires pour plus de précision, de confort et de rapidité."
            },
            // ... autres articles
        ];
    }
    
    getSampleArticle() {
        return {
            id: 1,
            title: "L'importance du détartrage régulier",
            subtitle: "Pourquoi ce soin préventif est essentiel pour votre santé bucco-dentaire",
            date: "2025-01-15",
            author: "Dr Leila EL AMRI",
            category: "Prévention",
            content: `
                <h2>Article en cours de chargement</h2>
                <p>Le contenu complet de cet article sera bientôt disponible.</p>
                <p>Pour plus d'informations, n'hésitez pas à nous contacter pour une consultation.</p>
            `,
            image: "",
            excerpt: "Article sur la santé dentaire",
            meta_description: "Article sur la santé dentaire - Centre Dentaire EL AMRI"
        };
    }
    
    renderArticle() {
        if (!this.article) return;
        
        // Mettre à jour le breadcrumb
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
        
        // Mettre à jour l'auteur
        const authorElement = document.getElementById('article-author');
        if (authorElement && this.article.author) {
            authorElement.textContent = this.article.author;
        }
    }
    
    loadRelatedArticles(allArticles) {
        if (!this.article || !allArticles) return;
        
        // Filtrer les articles de la même catégorie, exclure l'article actuel
        this.relatedArticles = allArticles
            .filter(article => 
                article.id != this.article.id && 
                article.category === this.article.category
            )
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
                <p style="grid-column: 1 / -1; text-align: center; color: var(--gray); padding: 2rem;">
                    Aucun article similaire pour le moment.
                </p>
            `;
            return;
        }
        
        relatedGrid.innerHTML = this.relatedArticles.map(article => `
            <div class="related-article">
                <div class="related-image">
                    ${article.image ? `
                        <img src="${article.image}" alt="${article.title}" loading="lazy">
                    ` : `
                        <div style="background: var(--primary-light); height: 100%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-tooth" style="font-size: 2rem; color: var(--primary);"></i>
                        </div>
                    `}
                </div>
                <div class="related-article-content">
                    <div class="related-category">${article.category}</div>
                    <h3 class="related-article-title">
                        <a href="article.html?id=${article.id}">${article.title}</a>
                    </h3>
                    <p class="related-excerpt">${article.excerpt || ''}</p>
                </div>
            </div>
        `).join('');
    }
    
    setupEventListeners() {
        // Fonctions de partage intégrées
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
        
        // Mettre à jour Open Graph
        this.updateMeta('og:title', this.article.title);
        this.updateMeta('og:description', this.article.meta_description || this.article.excerpt || '');
        this.updateMeta('og:image', this.article.image || '');
        this.updateMeta('og:url', window.location.href);
        this.updateMeta('og:type', 'article');
        
        // Mettre à jour Twitter Cards
        this.updateMeta('twitter:title', this.article.title);
        this.updateMeta('twitter:description', this.article.meta_description || this.article.excerpt || '');
        this.updateMeta('twitter:image', this.article.image || '');
        this.updateMeta('twitter:card', 'summary_large_image');
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
    
    // Initialiser le menu mobile
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
