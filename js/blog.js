// blog.js - Gestion du blog
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
                excerpt: "Pourquoi ce soin préventif est essentiel pour votre santé bucco-dentaire.",
                date: "2025-01-15",
                category: "Prévention",
                image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop",
                slug: "importance-detartrage-regulier"
            },
            {
                id: 2,
                title: "Les nouvelles technologies en implantologie",
                excerpt: "Comment les avancées technologiques révolutionnent les traitements d'implants.",
                date: "2025-01-10",
                category: "Implantologie",
                image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop",
                slug: "nouvelles-technologies-implantologie"
            },
            {
                id: 3,
                title: "Blanchiment dentaire : ce qu'il faut savoir",
                excerpt: "Tout sur les techniques de blanchiment dentaire sécuritaires et efficaces.",
                date: "2025-01-05",
                category: "Esthétique",
                image: "https://images.unsplash.com/photo-1622902046586-2e57cc6e0b91?w=800&auto=format&fit=crop",
                slug: "blanchiment-dentaire-ce-quil-faut-savoir"
            },
            {
                id: 4,
                title: "Orthodontie invisible pour adultes",
                excerpt: "Des solutions discrètes pour corriger l'alignement dentaire à tout âge.",
                date: "2024-12-20",
                category: "Orthodontie",
                image: "https://images.unsplash.com/photo-1566321161035-57c8ae5cfd2c?w=800&auto=format&fit=crop",
                slug: "orthodontie-invisible-adultes"
            },
            {
                id: 5,
                title: "Soins dentaires pour enfants",
                excerpt: "Comment préserver la santé dentaire de vos enfants dès le plus jeune âge.",
                date: "2024-12-15",
                category: "Pédiatrie",
                image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop",
                slug: "soins-dentaires-enfants"
            },
            {
                id: 6,
                title: "Les facettes dentaires en céramique",
                excerpt: "Une solution esthétique durable pour des dents parfaites.",
                date: "2024-12-10",
                category: "Esthétique",
                image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop",
                slug: "facettes-dentaires-ceramique"
            },
            {
                id: 7,
                title: "Endodontie : sauver une dent naturelle",
                excerpt: "Les traitements de racines pour préserver vos dents plutôt que les extraire.",
                date: "2024-12-05",
                category: "Soins",
                image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop",
                slug: "endodontie-sauver-dent-naturelle"
            },
            {
                id: 8,
                title: "L'alimentation et la santé dentaire",
                excerpt: "Quels aliments privilégier et lesquels éviter pour des dents saines.",
                date: "2024-11-30",
                category: "Prévention",
                image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&auto=format&fit=crop",
                slug: "alimentation-sante-dentaire"
            },
            {
                id: 9,
                title: "Prothèses dentaires : les options modernes",
                excerpt: "Des solutions confortables et esthétiques pour remplacer les dents manquantes.",
                date: "2024-11-25",
                category: "Prothétique",
                image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop",
                slug: "protheses-dentaires-options-modernes"
            }
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
                    <button class="btn btn-primary" onclick="window.blogManager.filterByCategory('all')">
                        Voir tous les articles
                    </button>
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
        
        // URL simple avec ID et titre encodé
        const articleUrl = `article.html?id=${article.id}&title=${encodeURIComponent(article.title)}`;
        
        return `
            <article class="article-card">
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRThGMEZGIi8+CjxwYXRoIGQ9Ik00MDAgMzAwQzQ0OC4yIDMwMCA0ODggMjYwLjIgNDg4IDIxMkM0ODggMTYzLjggNDQ4LjIgMTI0IDQwMCAxMjRDMzUxLjggMTI0IDMxMiAxNjMuOCAzMTIgMjEyQzMxMiAyNjAuMiAzNTEuOCAzMDAgNDAwIDMwMFoiIGZpbGw9IiMyYzVhYTAiLz4KPC9zdmc+'">
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.showNewsletterMessage('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Simulation d'envoi
        this.showNewsletterMessage('Envoi en cours...', 'info');
        
        try {
            // En production, intégrer avec un service comme Mailchimp
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler délai
            
            // Simulation de succès
            this.showNewsletterMessage('Merci pour votre inscription à la newsletter !', 'success');
            form.reset();
            
            // Sauvegarder dans localStorage pour la démo
            const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
            subscribers.push({
                email: email,
                date: new Date().toISOString()
            });
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            
        } catch (error) {
            this.showNewsletterMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
        }
    }
    
    showNewsletterMessage(message, type = 'info') {
        const form = document.getElementById('newsletter-form');
        if (!form) return;
        
        // Supprimer les anciens messages
        const oldMessage = form.querySelector('.newsletter-message');
        if (oldMessage) {
            oldMessage.remove();
        }
        
        // Créer le nouveau message
        const messageDiv = document.createElement('div');
        messageDiv.className = `newsletter-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Ajouter après le bouton
        const button = form.querySelector('button');
        form.insertBefore(messageDiv, button.nextSibling);
        
        // Supprimer après 5 secondes (sauf succès)
        if (type !== 'success') {
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
    
    showError(message) {
        console.warn(message);
        
        // Afficher un message d'erreur à l'utilisateur
        const grid = document.getElementById('articles-grid');
        if (grid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-state';
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            `;
            
            // Ajouter au début de la grille
            if (grid.firstChild) {
                grid.insertBefore(errorDiv, grid.firstChild);
            } else {
                grid.appendChild(errorDiv);
            }
            
            // Supprimer après 5 secondes
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    }
}

// Initialiser le blog
document.addEventListener('DOMContentLoaded', () => {
    // Créer une instance globale pour y accéder depuis d'autres fichiers
    window.blogManager = new BlogManager();
    
    // Initialiser le menu mobile
    const mobileMenu = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileMenu && mainNav) {
        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }
    
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', (e) => {
        if (mobileMenu && mainNav && 
            !mobileMenu.contains(e.target) && 
            !mainNav.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });
    
    // Animation des articles au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les articles
    setTimeout(() => {
        document.querySelectorAll('.article-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 1000);
});

// Fonction utilitaire pour créer des articles (utilisée aussi dans index.html)
function createPreviewArticle(article) {
    const date = new Date(article.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // URL simple avec ID et titre encodé
    const articleUrl = `article.html?id=${article.id}&title=${encodeURIComponent(article.title)}`;

    return `
        <div class="preview-article">
            <div class="preview-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRThGMEZGIi8+CjxwYXRoIGQ9Ik00MDAgMzAwQzQ0OC4yIDMwMCA0ODggMjYwLjIgNDg4IDIxMkM0ODggMTYzLjggNDQ4LjIgMTI0IDQwMCAxMjRDMzUxLjggMTI0IDMxMiAxNjMuOCAzMTIgMjEyQzMxMiAyNjAuMiAzNTEuOCAzMDAgNDAwIDMwMFoiIGZpbGw9IiMyYzVhYTAiLz4KPC9zdmc+';">
            </div>
            <div class="preview-content">
                <div class="preview-category">${article.category}</div>
                <h3 class="preview-title">
                    <a href="${articleUrl}">${article.title}</a>
                </h3>
                <div class="preview-date">${formattedDate}</div>
                <p class="preview-excerpt">${article.excerpt}</p>
            </div>
        </div>
    `;
}

// Fonction pour charger les articles en preview (utilisée dans index.html)
async function loadPreviewArticles() {
    const container = document.getElementById('preview-articles');
    if (!container) return;

    try {
        // Simuler un délai de chargement
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Chargement des articles...</p>
            </div>
        `;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Utiliser les mêmes articles que le blog
        const blogManager = new BlogManager();
        await blogManager.loadArticles();
        
        // Prendre les 3 premiers articles
        const previewArticles = blogManager.articles.slice(0, 3);
        
        // Rendre les articles
        if (previewArticles.length > 0) {
            container.innerHTML = previewArticles.map(article => createPreviewArticle(article)).join('');
            
            // Animer les articles
            setTimeout(() => {
                document.querySelectorAll('.preview-article').forEach(article => {
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(20px)';
                    article.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }
                        });
                    }, { threshold: 0.1 });
                    
                    observer.observe(article);
                });
            }, 100);
        } else {
            container.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--gray);">
                    <i class="fas fa-newspaper" style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary);"></i>
                    <p>Aucun article disponible pour le moment.</p>
                </div>
            `;
        }

    } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        container.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--gray);">
                <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 1rem; color: #dc2626;"></i>
                <p>Impossible de charger les articles pour le moment.</p>
            </div>
        `;
    }
}
