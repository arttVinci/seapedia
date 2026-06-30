CREATE TABLE `system_states` (
  `id` INT PRIMARY KEY,
  `current_simulated_day` INT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `system_states` (`id`, `current_simulated_day`) VALUES (1, 1);
