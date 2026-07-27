import 'dotenv/config';
import { getPackage } from '../src/services/admin/package.service';

async function main() {
  try {
    console.log('Fetching package...');
    const pkg = await getPackage('cmrnbo4yb000ykjzg958bhshg');
    console.log('Package fetched successfully:', pkg ? { title: pkg.title, type: pkg.type } : 'Not Found');
  } catch (error) {
    console.error('Error fetching package:', error);
  }
}

main();
