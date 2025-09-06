const LoginPage = ({ onLogin, onSetPage, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (isRegister) {
      if (!name || !email || !password || !phone) {
        setError('Semua field wajib diisi.');
        return;
      }
      onRegister({ name, email, phone, password });
    } else {
      const success = onLogin(email, password);
      if (!success) {
        setError('Email atau password salah.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-6 space-x-3">
          <LogoIcon />
          <h1 className="text-3xl font-bold text-gray-800">Celengan DWP Gayatri</h1>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            {isRegister ? 'Registrasi Akun Baru' : 'Login'}
          </h2>
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <>
                <Input
                  label="Nama Lengkap"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  required
                />
                <Input
                  label="No. Handphone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123..."
                  required
                />
              </>
            )}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anda@email.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              {isRegister ? 'Daftar' : 'Login'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="font-medium text-amber-600 hover:text-amber-500 ml-1"
            >
              {isRegister ? 'Login di sini' : 'Daftar di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
