import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Create a directory with specified permissions and ownership.
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

    // Set permissions to 766
    fs.chmodSync(absolutePath, '766');

    // Get the current user
    const currentUser = os.userInfo().username;

    // Set ownership to current user (this might require elevated permissions)
    try {
      fs.chownSync(absolutePath, os.userInfo().uid, os.userInfo().gid);
      console.log(`Permissions set to 766 and ownership set to ${currentUser}`);
    } catch (err) {
      console.warn('Setting ownership might require elevated permissions:', err);
    }
  } else {
    console.log('Directory already exists:', absolutePath);
  }
}

// Example usage
createDirectory('./example_directory');
