// Duplicate File Finder
// This program finds duplicate files by comparing file contents (using hash)
// and provides a UI for selecting which duplicates to delete

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');
const { promisify } = require('util');
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user for directory to scan
async function promptDirectory() {
  return new Promise((resolve) => {
    rl.question('Enter directory path to scan for duplicates: ', (answer) => {
      resolve(answer);
    });
  });
}

// Calculate file hash (MD5) for comparing file contents
async function calculateFileHash(filePath) {
  try {
    const data = await readFileAsync(filePath);
    return crypto.createHash('md5').update(data).digest('hex');
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
    return null;
  }
}

// Recursively scan directory and subdirectories for files
async function scanDirectory(dirPath) {
  let fileList = [];
  
  try {
    const entries = await readdirAsync(dirPath);
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      const stats = await statAsync(fullPath);
      
      if (stats.isDirectory()) {
        // Recursively scan subdirectories
        const subDirFiles = await scanDirectory(fullPath);
        fileList = fileList.concat(subDirFiles);
      } else if (stats.isFile()) {
        // Add file to list with its size
        fileList.push({
          path: fullPath,
          size: stats.size
        });
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}: ${error.message}`);
  }
  
  return fileList;
}

// Find duplicate files based on size and content
async function findDuplicates(fileList) {
  // Group files by size (first-level filtering)
  const filesBySize = {};
  
  for (const file of fileList) {
    if (!filesBySize[file.size]) {
      filesBySize[file.size] = [];
    }
    filesBySize[file.size].push(file);
  }
  
  // Only keep groups with multiple files of the same size
  const potentialDuplicates = Object.values(filesBySize).filter(group => group.length > 1);
  
  // Further filter by comparing file hashes
  const duplicateGroups = [];
  
  for (const group of potentialDuplicates) {
    const hashGroups = {};
    
    for (const file of group) {
      const hash = await calculateFileHash(file.path);
      
      if (hash) {
        if (!hashGroups[hash]) {
          hashGroups[hash] = [];
        }
        hashGroups[hash].push(file.path);
      }
    }
    
    // Only keep groups with multiple files with the same hash
    for (const [hash, files] of Object.entries(hashGroups)) {
      if (files.length > 1) {
        duplicateGroups.push(files);
      }
    }
  }
  
  return duplicateGroups;
}

// Display duplicate groups and get user selection for deletion
async function selectFilesToDelete(duplicateGroups) {
  if (duplicateGroups.length === 0) {
    console.log('No duplicate files found.');
    rl.close();
    return;
  }
  
  console.log(`Found ${duplicateGroups.length} groups of duplicate files:\n`);
  
  for (let i = 0; i < duplicateGroups.length; i++) {
    console.log(`Group ${i + 1}:`);
    duplicateGroups[i].forEach((file, j) => {
      console.log(`  [${j + 1}] ${file}`);
    });
    console.log('');
  }
  
  const filesToDelete = [];
  
  for (let i = 0; i < duplicateGroups.length; i++) {
    const group = duplicateGroups[i];
    
    await new Promise((resolve) => {
      rl.question(`For group ${i + 1}, enter numbers of files to delete (comma-separated), or 'k' to keep all: `, (answer) => {
        if (answer.toLowerCase() !== 'k') {
          const selections = answer.split(',').map(s => s.trim());
          
          for (const selection of selections) {
            const index = parseInt(selection, 10) - 1;
            
            if (!isNaN(index) && index >= 0 && index < group.length) {
              filesToDelete.push(group[index]);
            }
          }
        }
        resolve();
      });
    });
  }
  
  return filesToDelete;
}

// Delete selected files
async function deleteFiles(filesToDelete) {
  if (!filesToDelete || filesToDelete.length === 0) {
    console.log('No files selected for deletion.');
    return;
  }
  
  await new Promise((resolve) => {
    rl.question(`You've selected ${filesToDelete.length} files for deletion. Proceed? (y/n): `, async (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('Deleting files...');
        
        for (const file of filesToDelete) {
          try {
            await unlinkAsync(file);
            console.log(`Deleted: ${file}`);
          } catch (error) {
            console.error(`Error deleting ${file}: ${error.message}`);
          }
        }
        
        console.log('Deletion complete.');
      } else {
        console.log('Deletion cancelled.');
      }
      
      resolve();
    });
  });
}

// Main function
async function main() {
  try {
    const directory = await promptDirectory();
    
    console.log(`Scanning directory: ${directory}`);
    const fileList = await scanDirectory(directory);
    console.log(`Found ${fileList.length} files. Looking for duplicates...`);
    
    const duplicateGroups = await findDuplicates(fileList);
    const filesToDelete = await selectFilesToDelete(duplicateGroups);
    
    await deleteFiles(filesToDelete);
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  } finally {
    rl.close();
  }
}

// Start the application
main();