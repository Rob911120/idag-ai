import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const uploadedDir = path.join(__dirname, '../uploaded');
const newsDir = path.join(__dirname, '../src/content/news');

// Valid hashtags
const validHashtags = [
  'modeller', 'verktyg', 'guider', 'nyheter',
  'analys', 'trender', 'företag'
];

// Function to parse frontmatter and extract hashtags
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = match[1];
  const body = content.slice(match[0].length);
  
  // Extract hashtags
  const hashtagsMatch = frontmatter.match(/hashtags:\s*\[(.*?)\]/s);
  let hashtags = [];
  if (hashtagsMatch) {
    hashtags = hashtagsMatch[1]
      .split(',')
      .map(tag => tag.trim().replace(/["']/g, ''))
      .filter(tag => tag.length > 0);
  }
  
  return { frontmatter, body, hashtags };
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
      
      const { frontmatter, body, hashtags } = parsed;
      
      // Validate hashtags
      if (!hashtags || hashtags.length === 0) {
        console.log(`❌ Inga hashtags hittades för: ${filename}`);
        errorCount++;
        continue;
      }
      
      // Check if hashtags are valid
      const invalidHashtags = hashtags.filter(tag => !validHashtags.includes(tag));
      if (invalidHashtags.length > 0) {
        console.log(`❌ Ogiltiga hashtags "${invalidHashtags.join(', ')}" för: ${filename}`);
        console.log(`   Giltiga hashtags: ${validHashtags.join(', ')}`);
        errorCount++;
        continue;
      }
      
      // Generate slug from title
      const title = extractTitle(frontmatter);
      const slug = generateSlug(title);
      
      // Use the first hashtag as primary category for directory structure
      const primaryHashtag = hashtags[0];
      const targetDir = path.join(newsDir, primaryHashtag);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Create target filename
      const targetFilename = `${slug}.md`;
      const targetPath = path.join(targetDir, targetFilename);
      
      // Check if file already exists
      if (fs.existsSync(targetPath)) {
        console.log(`⚠️  Fil existerar redan: ${primaryHashtag}/${targetFilename}`);
        // Add timestamp to make it unique
        const timestamp = new Date().toISOString().slice(0, 10);
        const uniqueFilename = `${slug}-${timestamp}.md`;
        const uniquePath = path.join(targetDir, uniqueFilename);
        
        // Write to unique path
        fs.writeFileSync(uniquePath, content);
        console.log(`✅ Flyttad med unikt namn: ${primaryHashtag}/${uniqueFilename}`);
      } else {
        // Write to target path
        fs.writeFileSync(targetPath, content);
        console.log(`✅ Flyttad: ${filename} → ${primaryHashtag}/${targetFilename}`);
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