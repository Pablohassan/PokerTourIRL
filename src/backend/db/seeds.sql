-- Clear existing data
DELETE FROM player_stats;
DELETE FROM players;
DELETE FROM tournaments;

-- Reset auto-increment
ALTER SEQUENCE players_id_seq RESTART WITH 1;
ALTER SEQUENCE tournaments_id_seq RESTART WITH 1;

-- Insert test tournaments
INSERT INTO tournaments (year, created_at) VALUES 
(2023, '2023-01-01'),
(2024, '2024-01-01'),
(2025, '2025-01-01');

-- Insert test players
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
('Rachel White', '2023-01-01');

-- Insert some sample player stats
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
-- 2023 stats
(1, 1, 10, 1, 3, 2, 15, '2023-02-01', '2023-02-01 22:00:00'),
(2, 1, 8, 2, 2, 1, 10, '2023-02-01', '2023-02-01 21:30:00'),
(3, 1, 6, 3, 1, 1, 10, '2023-02-01', '2023-02-01 21:00:00'),
(4, 1, 4, 4, 0, 2, 15, '2023-02-01', '2023-02-01 20:30:00'),

-- 2024 stats
(5, 2, 10, 1, 4, 1, 10, '2024-02-01', '2024-02-01 22:00:00'),
(6, 2, 8, 2, 2, 2, 15, '2024-02-01', '2024-02-01 21:30:00'),
(7, 2, 6, 3, 1, 1, 10, '2024-02-01', '2024-02-01 21:00:00'),
(8, 2, 4, 4, 1, 3, 20, '2024-02-01', '2024-02-01 20:30:00'),

-- 2025 stats
(9, 3, 10, 1, 3, 1, 10, '2025-02-01', '2025-02-01 22:00:00'),
(10, 3, 8, 2, 2, 2, 15, '2025-02-01', '2025-02-01 21:30:00'); 