import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to news content directory
const newsDir = path.join(__dirname, '../src/content/news');

// Available categories
const categories = ['ai-nyheter', 'teknik', 'analys', 'trender', 'foretag'];

// Function to get all markdown files recursively
function getAllMarkdownFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Function to parse frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = match[1];
  const body = content.slice(match[0].length);
  
  return { frontmatter, body };
}

// Function to extract category from file path or frontmatter
function extractCategory(filePath, frontmatter) {
  // First try to get from file path
  for (const category of categories) {
    if (filePath.includes(`/${category}/`)) {
      return category;
    }
  }
  
  // Fallback to frontmatter
  const categoryMatch = frontmatter.match(/category:\s*["']?([^"'\n]+)["']?/);
  return categoryMatch ? categoryMatch[1].trim() : null;
}

// Function to update hero status per category
function updateHeroStatus() {
  console.log('🔄 Uppdaterar hero status för artiklar per kategori...');
  
  const files = getAllMarkdownFiles(newsDir);
  const articlesByCategory = {};
  
  // Initialize categories
  categories.forEach(cat => {
    articlesByCategory[cat] = [];
  });
  
  // Parse all articles and group by category
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseFrontmatter(content);
    
    if (!parsed) continue;
    
    // Extract category and pubDate
    const category = extractCategory(filePath, parsed.frontmatter);
    const pubDateMatch = parsed.frontmatter.match(/pubDate:\s*(.+)/);
    
    if (!category || !pubDateMatch || !categories.includes(category)) continue;
    
    const pubDate = new Date(pubDateMatch[1].trim());
    
    articlesByCategory[category].push({
      filePath,
      pubDate,
      content,
      frontmatter: parsed.frontmatter,
      body: parsed.body,
      category
    });
  }
  
  // Sort articles in each category by date (newest first)
  Object.keys(articlesByCategory).forEach(category => {
    articlesByCategory[category].sort((a, b) => b.pubDate - a.pubDate);
  });
  
  // Get today's date
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  let totalUpdatedCount = 0;
  
  // Process each category
  for (const category of categories) {
    const articles = articlesByCategory[category];
    
    if (articles.length === 0) {
      console.log(`📂 ${category}: Inga artiklar hittades`);
      continue;
    }
    
    // Find the most recent article in this category
    const mostRecentArticle = articles[0];
    let updatedCount = 0;
    
    for (const article of articles) {
      let shouldBeHero = false;
      
      // Make the most recent article in each category a hero if it's from today
      if (article === mostRecentArticle && article.pubDate >= todayStart) {
        shouldBeHero = true;
      }
      
      // Check current hero status
      const currentHero = article.frontmatter.includes('hero: true');
      
      if (shouldBeHero !== currentHero) {
        // Update the frontmatter
        let newFrontmatter = article.frontmatter;
        
        if (shouldBeHero) {
          // Add or update hero: true
          if (newFrontmatter.includes('hero:')) {
            newFrontmatter = newFrontmatter.replace(/hero:\s*(true|false)/, 'hero: true');
          } else {
            newFrontmatter += '\nhero: true';
          }
        } else {
          // Set hero: false or remove if not needed
          newFrontmatter = newFrontmatter.replace(/hero:\s*true/, 'hero: false');
        }
        
        // Write updated content
        const newContent = `---\n${newFrontmatter}\n---${article.body}`;
        fs.writeFileSync(article.filePath, newContent);
        
        updatedCount++;
        totalUpdatedCount++;
        console.log(`✅ ${category}: ${path.basename(article.filePath)} - hero: ${shouldBeHero}`);
      }
    }
    
    if (updatedCount === 0) {
      console.log(`📂 ${category}: Inga artiklar behövde uppdateras`);
    } else {
      console.log(`📂 ${category}: Uppdaterade ${updatedCount} artikel(ar)`);
    }
  }
  
  if (totalUpdatedCount === 0) {
    console.log('✨ Inga artiklar behövde uppdateras');
  } else {
    console.log(`🎉 Totalt uppdaterade ${totalUpdatedCount} artikel(ar)`);
  }
}

// Run the update
updateHeroStatus();