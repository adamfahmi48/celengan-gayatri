export const db = {
  users: [
    { id: 1, name: 'Bendahara Agung', email: 'superuser@gayatri.com', phone: '081234567890', role: 'superuser', password_hash: 'admin123', is_active: true, created_at: '2023-01-01T10:00:00Z' },
    { id: 2, name: 'Budi Santoso',     email: 'budi@example.com',     phone: '081111111111', role: 'user',      password_hash: 'user123',  is_active: true,  created_at: '2023-01-05T11:00:00Z' },
    { id: 3, name: 'Citra Lestari',    email: 'citra@example.com',    phone: '082222222222', role: 'user',      password_hash: 'user123',  is_active: true,  created_at: '2023-01-06T12:00:00Z' },
    { id: 4, name: 'Dedi Mulyadi',     email: 'dedi@example.com',     phone: '083333333333', role: 'user',      password_hash: 'user123',  is_active: true,  created_at: '2023-01-07T13:00:00Z' },
    { id: 5, name: 'Eka Putri',        email: 'eka@example.com',      phone: '084444444444', role: 'user',      password_hash: 'user123',  is_active: true,  created_at: '2023-01-08T14:00:00Z' },
    { id: 6, name: 'Fajar Nugroho',    email: 'fajar@example.com',    phone: '085555555555', role: 'user',      password_hash: 'user123',  is_active: false, created_at: '2023-01-09T15:00:00Z' }
  ],
  accounts: [
    { id: 101, code: 'KAS',           name: 'Kas',           type: 'asset',     created_at: '2023-01-01T00:00:00Z' },
    { id: 201, code: 'TABUNGAN_USER', name: 'Tabungan User', type: 'liability', created_at: '2023-01-01T00:00:00Z' }
  ],
  transactions: [],
  ledger_entries: []
};

let txnId = 1, ledgerId = 1;

export function calculateBalance(userId) {
  return db.transactions
    .filter(t => t.user_id === userId)
    .reduce((s, t) => s + (t.type === 'deposit' ? t.amount : -t.amount), 0);
}

export function nextUserId() {
  return Math.max(...db.users.map(u => u.id)) + 1;
}

function addTxn({ user_id, date, amount, note, type }) {
  const t = { id: txnId++, user_id, date, amount, method: 'Tunai Manual', note: note || '', type, created_at: new Date().toISOString() };
  db.transactions.push(t);

  const isDeposit = type === 'deposit';
  db.ledger_entries.push({ id: ledgerId++, transaction_id: t.id, account_id: 101, direction: isDeposit ? 'debit' : 'credit', amount });
  db.ledger_entries.push({ id: ledgerId++, transaction_id: t.id, account_id: 201, direction: isDeposit ? 'credit' : 'debit', amount });
}

export function seed() {
  addTxn({ user_id: 2, date: '2023-01-10T10:00:00Z', amount: 50000,  note: 'Setoran awal',        type: 'deposit' });
  addTxn({ user_id: 2, date: '2023-01-15T11:00:00Z', amount: 75000,  note: 'Tabungan mingguan',   type: 'deposit' });
  addTxn({ user_id: 2, date: '2023-02-01T09:00:00Z', amount: 100000, note: 'Gajian',              type: 'deposit' });
  addTxn({ user_id: 3, date: '2023-01-12T14:00:00Z', amount: 150000, note: 'Setoran pertama',     type: 'deposit' });
  addTxn({ user_id: 3, date: '2023-02-05T16:00:00Z', amount: 200000, note: 'Bonus',               type: 'deposit' });
  addTxn({ user_id: 4, date: '2023-01-18T08:00:00Z', amount: 200000, note: 'Tabungan rutin',      type: 'deposit' });
  addTxn({ user_id: 4, date: '2023-02-18T08:30:00Z', amount: 150000, note: 'Sisa belanja',        type: 'deposit' });
  addTxn({ user_id: 5, date: '2023-01-25T13:00:00Z', amount: 80000,  note: '',                    type: 'deposit' });
  addTxn({ user_id: 5, date: '2023-02-20T11:00:00Z', amount: 120000, note: 'Tabungan',            type: 'deposit' });
  addTxn({ user_id: 2, date: '2023-02-25T10:00:00Z', amount: 40000,  note: 'Keperluan mendadak',  type: 'withdrawal' });
}
