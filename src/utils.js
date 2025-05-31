// Enhanced utility functions inspired by Apple blog
export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day} ${getMonthName(month)} ${year}`;
}

export function formatDateSwedish(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getMonthName(month) {
  const months = [
    'januari', 'februari', 'mars', 'april', 'maj', 'juni',
    'juli', 'augusti', 'september', 'oktober', 'november', 'december'
  ];
  return months[month - 1];
}

// Debounce function for search and scroll events
export function debounce(fn, delay) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

// Theme management utilities
export function getThemePreference() {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme');
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(theme) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
  document.documentElement.setAttribute('data-theme', theme);
}

// Scroll animation utilities
export function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with scroll animation class
  document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
  });
}

// Progressive image loading
export function initProgressiveImages() {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.classList.add('image-loaded');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Reading time calculator
export function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time;
}

// Hashtag aggregation across subdomains
export function aggregateHashtags(collections) {
  const hashtagCounts = new Map();
  
  Object.values(collections).forEach(collection => {
    if (Array.isArray(collection)) {
      collection.forEach(item => {
        if (item.data?.hashtags) {
          item.data.hashtags.forEach(hashtag => {
            const current = hashtagCounts.get(hashtag) || { count: 0, subdomains: new Set() };
            current.count += 1;
            if (item.data.subdomain) {
              current.subdomains.add(item.data.subdomain);
            }
            hashtagCounts.set(hashtag, current);
          });
        }
      });
    }
  });
  
  return Array.from(hashtagCounts.entries()).map(([hashtag, data]) => ({
    hashtag,
    count: data.count,
    subdomains: Array.from(data.subdomains)
  })).sort((a, b) => b.count - a.count);
}

// Content filtering by subdomain
export function filterContentBySubdomain(collections, subdomain) {
  const filtered = [];
  
  Object.entries(collections).forEach(([collectionName, collection]) => {
    if (Array.isArray(collection)) {
      collection.forEach(item => {
        if (item.data?.subdomain === subdomain ||
            (subdomain === 'nyheter' && collectionName === 'news')) {
          filtered.push({
            ...item,
            collection: collectionName
          });
        }
      });
    }
  });
  
  return filtered.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));
}

// Content filtering by hashtag across all subdomains
export function filterContentByHashtag(collections, hashtag) {
  const filtered = [];
  
  Object.entries(collections).forEach(([collectionName, collection]) => {
    if (Array.isArray(collection)) {
      collection.forEach(item => {
        if (item.data?.hashtags?.includes(hashtag)) {
          filtered.push({
            ...item,
            collection: collectionName
          });
        }
      });
    }
  });
  
  return filtered.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));
}

// Related content recommendations
export function getRelatedContent(currentArticle, collections, limit = 3) {
  const related = [];
  const currentHashtags = currentArticle.data?.hashtags || [];
  const currentSubdomain = currentArticle.data?.subdomain;
  
  Object.entries(collections).forEach(([collectionName, collection]) => {
    if (Array.isArray(collection)) {
      collection.forEach(item => {
        // Skip the current article
        if (item.slug === currentArticle.slug) return;
        
        const itemHashtags = item.data?.hashtags || [];
        const commonHashtags = currentHashtags.filter(tag => itemHashtags.includes(tag));
        
        // Calculate relevance score
        let score = 0;
        
        // Same subdomain gets bonus points
        if (item.data?.subdomain === currentSubdomain) {
          score += 2;
        }
        
        // Common hashtags
        score += commonHashtags.length * 3;
        
        // Recent articles get slight bonus
        const daysDiff = Math.abs(new Date() - new Date(item.data.pubDate)) / (1000 * 60 * 60 * 24);
        if (daysDiff < 30) {
          score += 1;
        }
        
        if (score > 0) {
          related.push({
            ...item,
            collection: collectionName,
            relevanceScore: score,
            commonHashtags
          });
        }
      });
    }
  });
  
  return related
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}

// Get featured content across subdomains
export function getFeaturedContent(collections, limit = 6) {
  const featured = [];
  
  Object.entries(collections).forEach(([collectionName, collection]) => {
    if (Array.isArray(collection)) {
      collection.forEach(item => {
        if (item.data?.featured) {
          featured.push({
            ...item,
            collection: collectionName
          });
        }
      });
    }
  });
  
  return featured
    .sort((a, b) => {
      // Sort by priority first, then by date
      const priorityDiff = (b.data.priority || 5) - (a.data.priority || 5);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.data.pubDate) - new Date(a.data.pubDate);
    })
    .slice(0, limit);
}

// Get latest content across all subdomains
export function getLatestContent(collections, limit = 10) {
  const allContent = [];
  
  Object.entries(collections).forEach(([collectionName, collection]) => {
    if (Array.isArray(collection) && collectionName !== 'blog') {
      collection.forEach(item => {
        allContent.push({
          ...item,
          collection: collectionName
        });
      });
    }
  });
  
  return allContent
    .sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate))
    .slice(0, limit);
}

// URL helpers for different content types
export function getContentUrl(item, collection) {
  const subdomain = item.data?.subdomain;
  
  if (subdomain && subdomain !== 'nyheter') {
    return `/${subdomain}/${item.slug}`;
  }
  
  if (collection === 'news' || subdomain === 'nyheter') {
    return `/artikel/${item.slug}`;
  }
  
  return `/artikel/${item.slug}`;
}

// SEO helpers
export function generateSEOTitle(title, subdomain) {
  const subdomainTitles = {
    nyheter: 'AI Nyheter',
    modeller: 'AI Modeller',
    verktyg: 'AI Verktyg',
    akademi: 'AI Akademi'
  };
  
  const subdomainTitle = subdomainTitles[subdomain];
  return subdomainTitle ? `${title} | ${subdomainTitle} | idag.ai` : `${title} | idag.ai`;
}

export function generateSEODescription(description, subdomain) {
  const subdomainDescriptions = {
    nyheter: 'Senaste nyheterna inom AI och artificiell intelligens',
    modeller: 'Omfattande guide till AI-modeller och språkmodeller',
    verktyg: 'Bästa AI-verktygen för produktivitet och kreativitet',
    akademi: 'Lär dig AI genom guider, tutorials och kurser'
  };
  
  const fallback = subdomainDescriptions[subdomain] || 'Sveriges största informationskälla inom AI';
  return description || fallback;
}