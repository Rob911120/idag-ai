import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const uploadedDir = path.join(__dirname, '../uploaded');
const newsDir = path.join(__dirname, '../src/content/news');

// Category mapping
const categoryMapping = {
  'ai-nyheter': 'ai-nyheter',
  'teknik': 'teknik',
  'analys': 'analys',
  'trender': 'trender',
  'foretag': 'foretag'
};

// Function to parse frontmatter and extract category
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = match[1];
  const body = content.slice(match[0].length);
  
  // Extract category
  const categoryMatch = frontmatter.match(/category:\s*["']?([^"'\n]+)["']?/);
  const category = categoryMatch ? categoryMatch[1].trim() : null;
  
  return { frontmatter, body, category };
}

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/[ö]/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Function to extract title from frontmatter
function extractTitle(frontmatter) {
  const titleMatch = frontmatter.match(/title:\s*["']([^"']+)["']/);
  return titleMatch ? titleMatch[1] : 'untitled';
}

// Main processing function
function processUploadedFiles() {
  console.log('🔄 Bearbetar uppladdade filer...');
  
  // Check if uploaded directory exists
  if (!fs.existsSync(uploadedDir)) {
    console.log('📁 Skapar uploaded mapp...');
    fs.mkdirSync(uploadedDir, { recursive: true });
    return;
  }
  
  // Get all files in uploaded directory
  const files = fs.readdirSync(uploadedDir).filter(file => 
    file.endsWith('.md') || file.endsWith('.mdx')
  );
  
  if (files.length === 0) {
    console.log('✨ Inga filer att bearbeta i uploaded mappen');
    return;
  }
  
  let processedCount = 0;
  let errorCount = 0;
  
  for (const filename of files) {
    try {
      const filePath = path.join(uploadedDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Parse frontmatter
      const parsed = parseFrontmatter(content);
      if (!parsed) {
        console.log(`❌ Kunde inte parsa frontmatter för: ${filename}`);
        errorCount++;
        continue;
      }
      
      const { frontmatter, body, category } = parsed;
      
      // Validate category
      if (!category || !categoryMapping[category]) {
        console.log(`❌ Ogiltig kategori "${category}" för: ${filename}`);
        errorCount++;
        continue;
      }
      
      // Generate slug from title
      const title = extractTitle(frontmatter);
      const slug = generateSlug(title);
      
      // Create target directory
      const targetDir = path.join(newsDir, category);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Create target filename
      const targetFilename = `${slug}.md`;
      const targetPath = path.join(targetDir, targetFilename);
      
      // Check if file already exists
      if (fs.existsSync(targetPath)) {
        console.log(`⚠️  Fil existerar redan: ${category}/${targetFilename}`);
        // Add timestamp to make it unique
        const timestamp = new Date().toISOString().slice(0, 10);
        const uniqueFilename = `${slug}-${timestamp}.md`;
        const uniquePath = path.join(targetDir, uniqueFilename);
        
        // Write to unique path
        fs.writeFileSync(uniquePath, content);
        console.log(`✅ Flyttad med unikt namn: ${category}/${uniqueFilename}`);
      } else {
        // Write to target path
        fs.writeFileSync(targetPath, content);
        console.log(`✅ Flyttad: ${filename} → ${category}/${targetFilename}`);
      }
      
      // Remove original file
      fs.unlinkSync(filePath);
      processedCount++;
      
    } catch (error) {
      console.log(`❌ Fel vid bearbetning av ${filename}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n🎉 Bearbetning klar:`);
  console.log(`   ✅ ${processedCount} filer flyttade`);
  console.log(`   ❌ ${errorCount} fel`);
  
  if (processedCount > 0) {
    console.log('\n📝 Nästa steg: Kör update-featured.js för att uppdatera featured status');
  }
}

// Run the processing
processUploadedFiles();