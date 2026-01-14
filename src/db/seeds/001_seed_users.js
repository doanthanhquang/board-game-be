/**
 * Seed: Users and Profiles
 * Creates initial users: 1 admin and 4 clients
 */

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const seed = async (knex) => {
  // Delete existing data
  await knex('profiles').del();
  await knex('users').del();

  // Hash passwords
  const adminPassword = await hashPassword('admin123');
  const clientPassword = await hashPassword('client123');

  // Insert users
  const users = [
    {
      email: 'admin@boardgame.com',
      username: 'admin',
      password_hash: adminPassword,
      role: 'admin',
      is_active: true,
    },
    {
      email: 'client1@boardgame.com',
      username: 'client1',
      password_hash: clientPassword,
      role: 'client',
      is_active: true,
    },
    {
      email: 'client2@boardgame.com',
      username: 'client2',
      password_hash: clientPassword,
      role: 'client',
      is_active: true,
    },
    {
      email: 'client3@boardgame.com',
      username: 'client3',
      password_hash: clientPassword,
      role: 'client',
      is_active: true,
    },
    {
      email: 'client4@boardgame.com',
      username: 'client4',
      password_hash: clientPassword,
      role: 'client',
      is_active: true,
    },
  ];

  const insertedUsers = await knex('users')
    .insert(users)
    .returning(['id', 'email', 'username', 'role']);

  // Create profiles for each user
  const profiles = insertedUsers.map((user, index) => {
    const isAdmin = user.role === 'admin';
    return {
      user_id: user.id,
      display_name: isAdmin ? 'Administrator' : `Player ${index}`,
      bio: isAdmin
        ? 'System Administrator'
        : `Board game enthusiast player ${index}`,
      preferences: {
        dark_mode: index % 2 === 0, // Alternate dark mode preference
        language: 'en',
      },
    };
  });

  await knex('profiles').insert(profiles);

  console.log('✅ Seeded 5 users (1 admin, 4 clients) with profiles');
};
