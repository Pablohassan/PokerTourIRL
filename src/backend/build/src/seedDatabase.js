import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'poker_tournament',
    password: process.env.DB_PASSWORD || 'your_password',
    port: parseInt(process.env.DB_PORT || '5432'),
});
const seedDatabase = async () => {
    try {
        // Clear existing data
        await pool.query('DELETE FROM player_stats');
        await pool.query('DELETE FROM players');
        await pool.query('DELETE FROM tournaments');
        // Reset sequences
        await pool.query('ALTER SEQUENCE players_id_seq RESTART WITH 1');
        await pool.query('ALTER SEQUENCE tournaments_id_seq RESTART WITH 1');
        // Insert tournaments
        await pool.query(`
      INSERT INTO tournaments (year, created_at) VALUES 
      (2023, '2023-01-01'),
      (2024, '2024-01-01'),
      (2025, '2025-01-01')
    `);
        // Insert players
        await pool.query(`
      INSERT INTO players (name, created_at) VALUES 
      ('John Doe', '2023-01-01'),
      ('Jane Smith', '2023-01-01'),
      ('Mike Johnson', '2023-01-01'),
      ('Sarah Wilson', '2023-01-01'),
      ('Tom Brown', '2023-01-01'),
      ('Lisa Davis', '2023-01-01'),
      ('James Miller', '2023-01-01'),
      ('Emma Taylor', '2023-01-01'),
      ('David Anderson', '2023-01-01'),
      ('Rachel White', '2023-01-01')
    `);
        // Insert player stats
        await pool.query(`
      INSERT INTO player_stats (
        player_id,
        tournament_id,
        points,
        position,
        kills,
        rebuys,
        total_cost,
        created_at,
        out_at
      ) VALUES 
      (1, 1, 10, 1, 3, 2, 15, '2023-02-01', '2023-02-01 22:00:00'),
      (2, 1, 8, 2, 2, 1, 10, '2023-02-01', '2023-02-01 21:30:00'),
      (3, 1, 6, 3, 1, 1, 10, '2023-02-01', '2023-02-01 21:00:00'),
      (4, 1, 4, 4, 0, 2, 15, '2023-02-01', '2023-02-01 20:30:00'),
      (5, 2, 10, 1, 4, 1, 10, '2024-02-01', '2024-02-01 22:00:00'),
      (6, 2, 8, 2, 2, 2, 15, '2024-02-01', '2024-02-01 21:30:00'),
      (7, 2, 6, 3, 1, 1, 10, '2024-02-01', '2024-02-01 21:00:00'),
      (8, 2, 4, 4, 1, 3, 20, '2024-02-01', '2024-02-01 20:30:00'),
      (9, 3, 10, 1, 3, 1, 10, '2025-02-01', '2025-02-01 22:00:00'),
      (10, 3, 8, 2, 2, 2, 15, '2025-02-01', '2025-02-01 21:30:00')
    `);
        console.log('Database seeded successfully!');
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
    finally {
        await pool.end();
    }
};
seedDatabase();
