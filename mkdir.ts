import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Create a directory with specified path.
 * If the directory exists, do nothing.
 * 
 * @param dirPath - The path for the directory to create.
 */
function createDirectory(dirPath: string): void {
  const absolutePath = path.resolve(dirPath);

  if (!fs.existsSync(absolutePath)) {
    // Create the directory
    fs.mkdirSync(absolutePath, { recursive: true });
    console.log(`Directory created at ${absolutePath}`);

    if (os.platform() !== 'win32') {
      // Set permissions to 766 (Unix/Linux only)
      fs.chmodSync(absolutePath, '766');

      // Set ownership to the current user (may require elevated permissions)
      try {
        fs.chownSync(absolutePath, os.userInfo().uid, os.userInfo().gid);
        console.log('Permissions set to 766 and ownership set to current user');
      } catch (err) {
        console.warn('Could not set ownership:', err);
      }
    }
  } else {
    console.log('Directory already exists:', absolutePath);
  }
}

// Example usage
createDirectory('./example_directory');
