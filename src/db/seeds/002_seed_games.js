/**
 * Seed: Games
 * Creates 7 initial games: caro 5 hàng, caro 4 hàng, tic-tac-toe, rắn săn mồi,
 * ghép hàng 3, cờ trí nhớ, bảng vẽ tự do
 */

export const seed = async (knex) => {
  // Get admin user ID (created_by)
  const admin = await knex('users').where({ role: 'admin' }).first();

  if (!admin) {
    console.warn('⚠️  Admin user not found. Please run users seed first.');
    return;
  }

  // Delete existing game configurations and games
  await knex('game_configurations').del();
  await knex('games').del();

  // Define games
  const games = [
    {
      name: 'Caro 5 Hàng',
      slug: 'caro-5',
      description:
        'Cờ Caro truyền thống với mục tiêu tạo 5 quân cờ liên tiếp theo hàng ngang, dọc hoặc chéo.',
      instructions: `Mục tiêu: Tạo 5 quân cờ liên tiếp theo hàng ngang, dọc hoặc chéo để thắng.
- Người chơi lần lượt đặt quân cờ (X hoặc O) trên bàn cờ
- Người đầu tiên tạo được 5 quân liên tiếp sẽ thắng
- Chơi với máy tính (AI sẽ chọn nước đi hợp lệ ngẫu nhiên)`,
      game_type: 'caro',
      is_enabled: true,
      default_board_width: 15,
      default_board_height: 15,
      default_time_limit: null, // No time limit
      created_by: admin.id,
    },
    {
      name: 'Caro 4 Hàng',
      slug: 'caro-4',
      description:
        'Biến thể của Caro với mục tiêu tạo 4 quân cờ liên tiếp để thắng.',
      instructions: `Mục tiêu: Tạo 4 quân cờ liên tiếp theo hàng ngang, dọc hoặc chéo để thắng.
- Người chơi lần lượt đặt quân cờ (X hoặc O) trên bàn cờ
- Người đầu tiên tạo được 4 quân liên tiếp sẽ thắng
- Dễ hơn Caro 5 hàng, phù hợp cho người mới bắt đầu`,
      game_type: 'caro',
      is_enabled: true,
      default_board_width: 10,
      default_board_height: 10,
      default_time_limit: null,
      created_by: admin.id,
    },
    {
      name: 'Tic Tac Toe',
      slug: 'tic-tac-toe',
      description:
        'Trò chơi cổ điển 3x3, người chơi cố gắng tạo 3 quân cờ liên tiếp.',
      instructions: `Mục tiêu: Tạo 3 quân cờ liên tiếp theo hàng ngang, dọc hoặc chéo để thắng.
- Chơi trên bàn cờ 3x3
- Người chơi X đi trước, sau đó đến O
- Người đầu tiên tạo được 3 quân liên tiếp sẽ thắng
- Nếu bàn cờ đầy mà không ai thắng thì hòa`,
      game_type: 'tic-tac-toe',
      is_enabled: true,
      default_board_width: 3,
      default_board_height: 3,
      default_time_limit: null,
      created_by: admin.id,
    },
    {
      name: 'Rắn Săn Mồi',
      slug: 'snake',
      description:
        'Trò chơi rắn săn mồi cổ điển, điều khiển rắn ăn thức ăn và tránh va chạm.',
      instructions: `Mục tiêu: Điều khiển rắn ăn thức ăn để tăng điểm và độ dài.
- Sử dụng các phím mũi tên (Left, Right, Up, Down) để điều khiển rắn
- Ăn thức ăn (màu đỏ) để tăng điểm và độ dài rắn
- Tránh va chạm vào tường hoặc chính cơ thể rắn
- Mỗi thức ăn ăn được = 10 điểm`,
      game_type: 'snake',
      is_enabled: true,
      default_board_width: 20,
      default_board_height: 20,
      default_time_limit: null,
      created_by: admin.id,
    },
    {
      name: 'Ghép Hàng 3',
      slug: 'match-3',
      description:
        'Trò chơi ghép hàng 3 tương tự Candy Crush, ghép 3 hoặc nhiều hơn các ô cùng màu để ghi điểm.',
      instructions: `Mục tiêu: Ghép 3 hoặc nhiều hơn các ô cùng màu để ghi điểm và giải phóng không gian.
- Hoán đổi 2 ô kề nhau để tạo hàng hoặc cột có 3+ ô cùng màu
- Khi ghép được, các ô sẽ biến mất và các ô phía trên rơi xuống
- Tạo combo để ghi điểm cao hơn
- Mỗi level có mục tiêu điểm số cần đạt`,
      game_type: 'match-3',
      is_enabled: true,
      default_board_width: 8,
      default_board_height: 8,
      default_time_limit: 300, // 5 minutes
      created_by: admin.id,
    },
    {
      name: 'Cờ Trí Nhớ',
      slug: 'memory-game',
      description:
        'Trò chơi lật thẻ để tìm các cặp thẻ giống nhau, rèn luyện trí nhớ.',
      instructions: `Mục tiêu: Tìm tất cả các cặp thẻ giống nhau với số lần lật ít nhất.
- Lật 2 thẻ mỗi lượt
- Nếu 2 thẻ giống nhau, chúng sẽ biến mất và bạn ghi điểm
- Nếu khác nhau, chúng sẽ úp lại và bạn phải nhớ vị trí
- Hoàn thành với số lần lật càng ít càng tốt
- Mỗi cặp thẻ tìm được = 10 điểm`,
      game_type: 'memory',
      is_enabled: true,
      default_board_width: 4,
      default_board_height: 4,
      default_time_limit: 600, // 10 minutes
      created_by: admin.id,
    },
    {
      name: 'Bảng Vẽ Tự Do',
      slug: 'free-draw',
      description:
        'Bảng vẽ tự do cho phép người chơi vẽ và sáng tạo trên bàn game.',
      instructions: `Mục tiêu: Vẽ và sáng tạo trên bàn game.
- Sử dụng các nút điều khiển để chọn màu và công cụ vẽ
- Vẽ tự do trên bàn game
- Có thể xóa và vẽ lại
- Lưu tác phẩm của bạn
- Không có giới hạn thời gian, thỏa sức sáng tạo`,
      game_type: 'drawing',
      is_enabled: true,
      default_board_width: 20,
      default_board_height: 20,
      default_time_limit: null,
      created_by: admin.id,
    },
  ];

  // Insert games
  const insertedGames = await knex('games')
    .insert(games)
    .returning(['id', 'slug', 'name']);

  // Create default game configurations for each game
  const configurations = insertedGames.map((game) => {
    const gameData = games.find((g) => g.slug === game.slug);
    return {
      game_id: game.id,
      board_width: gameData.default_board_width,
      board_height: gameData.default_board_height,
      time_limit: gameData.default_time_limit,
      is_active: true,
    };
  });

  await knex('game_configurations').insert(configurations);

  console.log(
    `✅ Seeded ${insertedGames.length} games with configurations:`
  );
  insertedGames.forEach((game) => {
    console.log(`   - ${game.name} (${game.slug})`);
  });
};
