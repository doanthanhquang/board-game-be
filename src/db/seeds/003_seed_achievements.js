/**
 * Seed: Achievements
 * Creates initial achievements: global and game-specific achievements
 */

export const seed = async (knex) => {
  // Get all games
  const games = await knex('games').select('id', 'slug', 'name');

  if (games.length === 0) {
    console.warn('⚠️  No games found. Please run games seed first.');
    return;
  }

  // Create a map of game slugs to IDs for easier reference
  const gameMap = {};
  games.forEach((game) => {
    gameMap[game.slug] = game.id;
  });

  // Delete existing achievements
  await knex('user_achievements').del();
  await knex('achievements').del();

  // Define achievements
  const achievements = [
    // ===== GLOBAL ACHIEVEMENTS =====
    {
      name: 'First Steps',
      description: 'Win your first game',
      icon_url: null,
      criteria: {
        type: 'win_count',
        win_count: 1,
      },
      game_id: null, // Global
      is_active: true,
    },
    {
      name: 'Rookie',
      description: 'Win 5 games',
      icon_url: null,
      criteria: {
        type: 'win_count',
        win_count: 5,
      },
      game_id: null, // Global
      is_active: true,
    },
    {
      name: 'Veteran',
      description: 'Win 25 games',
      icon_url: null,
      criteria: {
        type: 'win_count',
        win_count: 25,
      },
      game_id: null, // Global
      is_active: true,
    },
    {
      name: 'Champion',
      description: 'Win 100 games',
      icon_url: null,
      criteria: {
        type: 'win_count',
        win_count: 100,
      },
      game_id: null, // Global
      is_active: true,
    },
    {
      name: 'Legend',
      description: 'Win 500 games',
      icon_url: null,
      criteria: {
        type: 'win_count',
        win_count: 500,
      },
      game_id: null, // Global
      is_active: true,
    },

    // ===== CARO 5 HÀNG ACHIEVEMENTS =====
    {
      name: 'Caro 5 Master',
      description: 'Win 10 games of Caro 5 Hàng',
      icon_url: null,
      criteria: {
        type: 'win_count',
        game_id: gameMap['caro-5'],
        win_count: 10,
      },
      game_id: gameMap['caro-5'],
      is_active: true,
    },
    {
      name: 'Caro 5 High Score',
      description: 'Score 1000 points in Caro 5 Hàng',
      icon_url: null,
      criteria: {
        type: 'score_threshold',
        game_id: gameMap['caro-5'],
        threshold: 1000,
      },
      game_id: gameMap['caro-5'],
      is_active: true,
    },
    {
      name: 'Caro 5 Completed',
      description: 'Complete a game of Caro 5 Hàng',
      icon_url: null,
      criteria: {
        type: 'game_completion',
        game_id: gameMap['caro-5'],
      },
      game_id: gameMap['caro-5'],
      is_active: true,
    },

    // ===== CARO 4 HÀNG ACHIEVEMENTS =====
    {
      name: 'Caro 4 Master',
      description: 'Win 10 games of Caro 4 Hàng',
      icon_url: null,
      criteria: {
        type: 'win_count',
        game_id: gameMap['caro-4'],
        win_count: 10,
      },
      game_id: gameMap['caro-4'],
      is_active: true,
    },
    {
      name: 'Caro 4 High Score',
      description: 'Score 800 points in Caro 4 Hàng',
      icon_url: null,
      criteria: {
        type: 'score_threshold',
        game_id: gameMap['caro-4'],
        threshold: 800,
      },
      game_id: gameMap['caro-4'],
      is_active: true,
    },
    {
      name: 'Caro 4 Completed',
      description: 'Complete a game of Caro 4 Hàng',
      icon_url: null,
      criteria: {
        type: 'game_completion',
        game_id: gameMap['caro-4'],
      },
      game_id: gameMap['caro-4'],
      is_active: true,
    },

    // ===== TIC TAC TOE ACHIEVEMENTS =====
    {
      name: 'Tic Tac Toe Master',
      description: 'Win 20 games of Tic Tac Toe',
      icon_url: null,
      criteria: {
        type: 'win_count',
        game_id: gameMap['tic-tac-toe'],
        win_count: 20,
      },
      game_id: gameMap['tic-tac-toe'],
      is_active: true,
    },
    {
      name: 'Tic Tac Toe High Score',
      description: 'Score 500 points in Tic Tac Toe',
      icon_url: null,
      criteria: {
        type: 'score_threshold',
        game_id: gameMap['tic-tac-toe'],
        threshold: 500,
      },
      game_id: gameMap['tic-tac-toe'],
      is_active: true,
    },
    {
      name: 'Tic Tac Toe Completed',
      description: 'Complete a game of Tic Tac Toe',
      icon_url: null,
      criteria: {
        type: 'game_completion',
        game_id: gameMap['tic-tac-toe'],
      },
      game_id: gameMap['tic-tac-toe'],
      is_active: true,
    },

    // ===== RẮN SĂN MỒI (SNAKE) ACHIEVEMENTS =====
    {
      name: 'Snake Master',
      description: 'Win 15 games of Rắn Săn Mồi',
      icon_url: null,
      criteria: {
        type: 'win_count',
        game_id: gameMap['snake'],
        win_count: 15,
      },
      game_id: gameMap['snake'],
      is_active: true,
    },
    {
      name: 'Snake High Score',
      description: 'Score 2000 points in Rắn Săn Mồi',
      icon_url: null,
      criteria: {
        type: 'score_threshold',
        game_id: gameMap['snake'],
        threshold: 2000,
      },
      game_id: gameMap['snake'],
      is_active: true,
    },
    {
      name: 'Snake Survivor',
      description: 'Score 5000 points in Rắn Săn Mồi',
      icon_url: null,
      criteria: {
        type: 'score_threshold',
        game_id: gameMap['snake'],
        threshold: 5000,
      },
      game_id: gameMap['snake'],
      is_active: true,
    },
    {
      name: 'Snake Completed',
      description: 'Complete a game of Rắn Săn Mồi',
      icon_url: null,
      criteria: {
        type: 'game_completion',
        game_id: gameMap['snake'],
      },
      game_id: gameMap['snake'],
      is_active: true,
    },

    // ===== GHÉP HÀNG 3 (MATCH-3) ACHIEVEMENTS =====
    {
      name: 'Match-3 Master',
      description: 'Win 20 games of Ghép Hàng 3',
      icon_url: null,
      criteria: {
        type: 'win_count',
        game_id: gameMap['match-3'],
        win_count: 20,
      },
      game_id: gameMap['match-3'],
      is_active: true,
    },
    {
      name: 'Match-3 High Score',
      description: 'Score 3000 points in Ghép Hàng 3',
      icon_url: null,
      criteria: {
        type: 'score_threshold',
        game_id: gameMap['match-3'],
        threshold: 3000,
      },
      game_id: gameMap['match-3'],
      is_active: true,
    },
    {
      name: 'Match-3 Combo King',
      description: 'Score 10000 points in Ghép Hàng 3',
      icon_url: null,
      criteria: {
        type: 'score_threshold',
        game_id: gameMap['match-3'],
        threshold: 10000,
      },
      game_id: gameMap['match-3'],
      is_active: true,
    },
    {
      name: 'Match-3 Completed',
      description: 'Complete a game of Ghép Hàng 3',
      icon_url: null,
      criteria: {
        type: 'game_completion',
        game_id: gameMap['match-3'],
      },
      game_id: gameMap['match-3'],
      is_active: true,
    },

    // ===== CỜ TRÍ NHỚ (MEMORY GAME) ACHIEVEMENTS =====
    {
      name: 'Memory Master',
      description: 'Win 15 games of Cờ Trí Nhớ',
      icon_url: null,
      criteria: {
        type: 'win_count',
        game_id: gameMap['memory-game'],
        win_count: 15,
      },
      game_id: gameMap['memory-game'],
      is_active: true,
    },
    {
      name: 'Memory High Score',
      description: 'Score 1500 points in Cờ Trí Nhớ',
      icon_url: null,
      criteria: {
        type: 'score_threshold',
        game_id: gameMap['memory-game'],
        threshold: 1500,
      },
      game_id: gameMap['memory-game'],
      is_active: true,
    },
    {
      name: 'Memory Perfect',
      description: 'Score 3000 points in Cờ Trí Nhớ',
      icon_url: null,
      criteria: {
        type: 'score_threshold',
        game_id: gameMap['memory-game'],
        threshold: 3000,
      },
      game_id: gameMap['memory-game'],
      is_active: true,
    },
    {
      name: 'Memory Completed',
      description: 'Complete a game of Cờ Trí Nhớ',
      icon_url: null,
      criteria: {
        type: 'game_completion',
        game_id: gameMap['memory-game'],
      },
      game_id: gameMap['memory-game'],
      is_active: true,
    },

    // ===== BẢNG VẼ TỰ DO (FREE DRAW) ACHIEVEMENTS =====
    {
      name: 'Artist',
      description: 'Complete 5 drawings in Bảng Vẽ Tự Do',
      icon_url: null,
      criteria: {
        type: 'game_completion',
        game_id: gameMap['free-draw'],
      },
      game_id: gameMap['free-draw'],
      is_active: true,
    },
  ];

  // Insert achievements
  const insertedAchievements = await knex('achievements')
    .insert(achievements)
    .returning(['id', 'name', 'game_id']);

  const globalCount = insertedAchievements.filter((a) => !a.game_id).length;
  const gameSpecificCount = insertedAchievements.filter((a) => a.game_id).length;

  console.log(`✅ Seeded ${insertedAchievements.length} achievements:`);
  console.log(`   - ${globalCount} global achievements`);
  console.log(`   - ${gameSpecificCount} game-specific achievements`);
  insertedAchievements.forEach((achievement) => {
    const gameName = achievement.game_id
      ? games.find((g) => g.id === achievement.game_id)?.name || 'Unknown'
      : 'Global';
    console.log(`   - ${achievement.name} (${gameName})`);
  });
};
