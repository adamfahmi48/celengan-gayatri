create table if not exists users (
  id serial primary key,
  name text not null,
  email text unique not null,
  phone text,
  role text not null default 'user',
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists accounts (
  id serial primary key,
  code text unique not null,
  name text not null,
  type text not null,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id serial primary key,
  user_id integer references users(id) on delete set null,
  date timestamptz not null,
  amount integer not null,
  method text not null default 'Tunai Manual',
  note text,
  type text not null,
  created_at timestamptz not null default now()
);

create table if not exists ledger_entries (
  id serial primary key,
  transaction_id integer references transactions(id) on delete cascade,
  account_id integer references accounts(id) on delete set null,
  direction text not null,
  amount integer not null
);

-- seed user superadmin
insert into users (name,email,phone,role,password_hash,is_active,created_at)
select 'Bendahara Agung','superuser@gayatri.com','081234567890','superuser','admin123',true,'2023-01-01T10:00:00Z'
where not exists (select 1 from users where email='superuser@gayatri.com');

-- seed akun dasar
insert into accounts (code,name,type,created_at)
select 'KAS','Kas','asset','2023-01-01T00:00:00Z'
where not exists (select 1 from accounts where code='KAS');

insert into accounts (code,name,type,created_at)
select 'TABUNGAN_USER','Tabungan User','liability','2023-01-01T00:00:00Z'
where not exists (select 1 from accounts where code='TABUNGAN_USER');

