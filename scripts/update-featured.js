import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to news content directory
const newsDir = path.join(__dirname, '../src/content/news');

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

// Function to update featured status
function updateFeaturedStatus() {
  console.log('🔄 Uppdaterar featured status för artiklar...');
  
  const files = getAllMarkdownFiles(newsDir);
  const articles = [];
  
  // Parse all articles
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseFrontmatter(content);
    
    if (!parsed) continue;
    
    // Extract pubDate from frontmatter
    const pubDateMatch = parsed.frontmatter.match(/pubDate:\s*(.+)/);
    if (!pubDateMatch) continue;
    
    const pubDate = new Date(pubDateMatch[1].trim());
    
    articles.push({
      filePath,
      pubDate,
      content,
      frontmatter: parsed.frontmatter,
      body: parsed.body
    });
  }
  
  // Sort by date (newest first)
  articles.sort((a, b) => b.pubDate - a.pubDate);
  
  // Get today's date
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Find the most recent article
  const mostRecentArticle = articles[0];
  
  // Update featured status
  let updatedCount = 0;
  
  for (const article of articles) {
    let shouldBeFeatured = false;
    
    // Feature the most recent article if it's from today
    if (article === mostRecentArticle && article.pubDate >= todayStart) {
      shouldBeFeatured = true;
    }
    
    // Check current featured status
    const currentFeatured = article.frontmatter.includes('featured: true');
    
    if (shouldBeFeatured !== currentFeatured) {
      // Update the frontmatter
      let newFrontmatter = article.frontmatter;
      
      if (shouldBeFeatured) {
        // Add or update featured: true
        if (newFrontmatter.includes('featured:')) {
          newFrontmatter = newFrontmatter.replace(/featured:\s*(true|false)/, 'featured: true');
        } else {
          newFrontmatter += '\nfeatured: true';
        }
      } else {
        // Set featured: false or remove if not needed
        newFrontmatter = newFrontmatter.replace(/featured:\s*true/, 'featured: false');
      }
      
      // Write updated content
      const newContent = `---\n${newFrontmatter}\n---${article.body}`;
      fs.writeFileSync(article.filePath, newContent);
      
      updatedCount++;
      console.log(`✅ Uppdaterade: ${path.basename(article.filePath)} - featured: ${shouldBeFeatured}`);
    }
  }
  
  if (updatedCount === 0) {
    console.log('✨ Inga artiklar behövde uppdateras');
  } else {
    console.log(`🎉 Uppdaterade ${updatedCount} artikel(ar)`);
  }
}

// Run the update
updateFeaturedStatus();