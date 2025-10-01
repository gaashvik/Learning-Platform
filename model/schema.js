const createFlashCardSet = `
CREATE TABLE IF NOT EXISTS flash_card_set(
  set_id INT AUTO_INCREMENT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  set_name VARCHAR(255) NOT NULL,
  language_id INT,
  difficulty_level VARCHAR(100)
);
`;

const createCards = `
CREATE TABLE IF NOT EXISTS card (
  card_id INT AUTO_INCREMENT PRIMARY KEY,
  set_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (set_id) REFERENCES flash_card_set(set_id) ON DELETE CASCADE
);
`;

const createCardSides = `
CREATE TABLE IF NOT EXISTS card_side (
  side_id INT AUTO_INCREMENT PRIMARY KEY,
  card_id INT NOT NULL,
  type VARCHAR(100),
  content TEXT,
  FOREIGN KEY (card_id) REFERENCES card(card_id) ON DELETE CASCADE
);
`;

module.exports = { createFlashCardSet, createCards, createCardSides };
