


const createFlashCardSet = `
CREATE TABLE IF NOT EXISTS flash_card_set (
  set_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  number_of_cards INT DEFAULT 0,
  set_name VARCHAR(255) NOT NULL,
  proficiency_level VARCHAR(255) NOT NULL,
  language VARCHAR(255) NOT NULL
);
`;

const createCards = `
CREATE TABLE IF NOT EXISTS card (
  card_id SERIAL PRIMARY KEY,
  set_id INT NOT NULL,
  front_content TEXT NOT NULL,
  back_content TEXT NOT NULL,
  hint TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (set_id) REFERENCES flash_card_set(set_id) ON DELETE CASCADE
);
`;

const createUser = `
CREATE TABLE IF NOT EXISTS app_user (
  user_id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  number VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  current_profeciency_level VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createUserFlashSubmission = `
CREATE TABLE IF NOT EXISTS user_chapter_submissions (
  user_id VARCHAR(50),
  set_id INT NOT NULL,
  last_reviewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress INT DEFAULT 0,
  test_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, set_id),
  FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (set_id) REFERENCES flash_card_set(set_id) ON DELETE CASCADE
);
`;

// const createUserCardSubmission = `
// CREATE TABLE IF NOT EXISTS user_card_submission (
//   user_id VARCHAR(50),
//   card_id INT NOT NULL,
//   set_id INT NOT NULL,
//   status VARCHAR(255) DEFAULT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   UNIQUE (user_id, card_id),
//   FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE,
//   FOREIGN KEY (card_id) REFERENCES card(card_id) ON DELETE CASCADE,
//   FOREIGN KEY (set_id) REFERENCES flash_card_set(set_id) ON DELETE CASCADE
// );
// `;

module.exports = {
  createFlashCardSet,
  createCards,
  createUser,
  createUserFlashSubmission
};
