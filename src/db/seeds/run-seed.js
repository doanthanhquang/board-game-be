/**
 * Helper script to run a specific seed file
 * Usage: node --env-file=.env src/db/seeds/run-seed.js <seed-file-name>
 * Example: node --env-file=.env src/db/seeds/run-seed.js 003_seed_achievements
 */

import knexfile from '../../../knexfile.js';
import knex from 'knex';

const seedFileName = process.argv[2];

if (!seedFileName) {
  console.error('❌ Error: Please provide a seed file name');
  console.log('Usage: node --env-file=.env src/db/seeds/run-seed.js <seed-file-name>');
  console.log('Example: node --env-file=.env src/db/seeds/run-seed.js 003_seed_achievements');
  process.exit(1);
}

const fullSeedFileName = seedFileName.endsWith('.js') ? seedFileName : `${seedFileName}.js`;
const seedPath = `./src/db/seeds/${fullSeedFileName}`;

try {
  // Import the seed file
  const seedModule = await import(`./${fullSeedFileName}`);
  
  if (!seedModule.seed) {
    console.error(`❌ Error: Seed file ${fullSeedFileName} does not export a seed function`);
    process.exit(1);
  }

  // Create Knex instance
  const config = knexfile.development;
  const db = knex(config);

  console.log(`🌱 Running seed: ${fullSeedFileName}...`);
  
  // Run the seed
  await seedModule.seed(db);
  
  console.log(`✅ Seed ${fullSeedFileName} completed successfully!`);
  
  // Close database connection
  await db.destroy();
  process.exit(0);
} catch (error) {
  console.error(`❌ Error running seed ${fullSeedFileName}:`, error.message);
  console.error(error);
  process.exit(1);
}
