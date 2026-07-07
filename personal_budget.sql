
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TABLE IF NOT EXISTS transactions (
  transaction_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type transaction_type NOT NULL,
  amount DECIMAL NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id INTEGER REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions_categories (
  transaction_id INTEGER REFERENCES transactions (transaction_id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories (category_id) ON DELETE CASCADE,
  PRIMARY KEY (transaction_id, category_id)
);