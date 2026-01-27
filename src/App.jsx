import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Wallet, 
  Plus, 
  Trash2, 
  X, 
  CheckCircle2,
  Circle,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Search,
  Edit2,
  Filter,
  FileText,
  Phone,
  Target,
  Settings,
  ChevronRight,
  LogOut,
  Lock,
  User,
  Download,
  Upload,
  Printer,
  Flag,
  Briefcase,
  StickyNote,
  Menu
} from 'lucide-react';

// --- SABİT AYARLAR (Varsayılan) ---
const DEFAULT_CREDS = {
  username: 'admin',
  password: '123' 
};
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 Dakika

// --- YARDIMCI FONKSİYONLAR ---

// CSV Dışa Aktarma Fonksiyonu
const exportToCSV = (data, filename) => {
  if (!data.length) {
    alert("Dışa aktarılacak veri yok.");
    return;
  }
  // Data temizleme ve formatlama
  const cleanData = data.map(item => {
    const newItem = { ...item };
    // ID gibi teknik alanları çıkarabiliriz veya formatlayabiliriz
    return newItem;
  });

  const headers = Object.keys(cleanData[0]).join(",");
  const rows = cleanData.map(row => Object.values(row).map(val => `"${val}"`).join(",")).join("\n");
  const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Tarih Formatlayıcı
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
};

// Modal Bileşeni
const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div 
        className={`bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full ${maxWidth} md:${maxWidth} w-[95%] overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[85vh] flex flex-col text-gray-100`}
        onClick={e => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800/50">
          <h3 className="font-bold text-gray-100 flex items-center gap-2">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full text-gray-400 transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// Platform Rozeti
const PlatformBadge = ({ platform }) => {
  const colors = {
    Instagram: 'bg-pink-900/30 text-pink-300 border-pink-700/50',
    TikTok: 'bg-gray-700 text-gray-200 border-gray-600',
    Youtube: 'bg-red-900/30 text-red-300 border-red-700/50',
    LinkedIn: 'bg-blue-900/30 text-blue-300 border-blue-700/50',
    Twitter: 'bg-sky-900/30 text-sky-300 border-sky-700/50',
    Diğer: 'bg-purple-900/30 text-purple-300 border-purple-700/50'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border ${colors[platform] || colors['Diğer']}`}>
      {platform}
    </span>
  );
};

// Öncelik Rozeti
const PriorityBadge = ({ priority }) => {
  const configs = {
    Yüksek: { color: 'text-red-400 bg-red-900/20 border-red-900/50', icon: AlertCircle },
    Orta: { color: 'text-yellow-400 bg-yellow-900/20 border-yellow-900/50', icon: TrendingUp },
    Düşük: { color: 'text-blue-400 bg-blue-900/20 border-blue-900/50', icon: Circle }
  };
  const config = configs[priority] || configs['Orta'];
  const Icon = config.icon;

  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${config.color}`}>
      <Icon size={10} /> {priority}
    </span>
  );
};

// Login Bileşeni
const LoginScreen = ({ onLogin, error, businessName }) => {
  const [inputUser, setInputUser] = useState('');
  const [inputPass, setInputPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(inputUser, inputPass);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arkaplan Dekoru */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px]"></div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300 z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/50 mx-auto mb-4">
            <Briefcase size={32}/>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{businessName}</h1>
          <p className="text-gray-400 text-sm">Panel yönetimi için giriş yapın.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Kullanıcı Adı</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="text" 
                required
                className="w-full pl-10 p-2.5 rounded-lg border border-gray-600 bg-gray-700/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Kullanıcı adınız"
                value={inputUser}
                onChange={e => setInputUser(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="password" 
                required
                className="w-full pl-10 p-2.5 rounded-lg border border-gray-600 bg-gray-700/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="••••••••"
                value={inputPass}
                onChange={e => setInputPass(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transform active:scale-[0.98]"
          >
            Giriş Yap <ChevronRight size={18} />
          </button>
        </form>
        <p className="text-center text-gray-600 text-xs mt-6">
          Güvenli Yönetim Paneli v2.1
        </p>
      </div>
    </div>
  );
};

export default function App() {
  // --- Auth & Settings State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [creds, setCreds] = useState(() => {
    const stored = localStorage.getItem('smm_auth_creds');
    return stored ? JSON.parse(stored) : DEFAULT_CREDS;
  });

  // İşletme Ayarları State'i
  const [businessConfig, setBusinessConfig] = useState(() => {
    const stored = localStorage.getItem('smm_biz_config');
    return stored ? JSON.parse(stored) : { name: 'by.dijitalmedya', currency: 'TRY', currencySymbol: '₺' };
  });

  // Para birimi formatlayıcı (Dinamik)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: businessConfig.currency || 'TRY',
    }).format(amount).replace('TRY', businessConfig.currencySymbol || '₺');
  };

  // --- Oturum Kontrolü ---
  useEffect(() => {
    const lastActive = localStorage.getItem('smm_last_active');
    if (lastActive) {
      const diff = Date.now() - parseInt(lastActive);
      if (diff < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('smm_last_active');
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const updateActivity = () => localStorage.setItem('smm_last_active', Date.now().toString());
    updateActivity();
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    return () => {
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('smm_biz_config', JSON.stringify(businessConfig));
  }, [businessConfig]);

  // --- Auth Actions ---
  const handleLogin = (user, pass) => {
    if (user === creds.username && pass === creds.password) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  const handleLogout = () => {
    if(window.confirm('Çıkış yapmak istediğine emin misin?')) {
      setIsAuthenticated(false);
      localStorage.removeItem('smm_last_active');
    }
  };

  const handleUpdateCreds = (newCreds) => {
    setCreds(newCreds);
    localStorage.setItem('smm_auth_creds', JSON.stringify(newCreds));
  };

  // --- Dashboard Data ---
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [firms, setFirms] = useState(() => JSON.parse(localStorage.getItem('smm_firms')) || []);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('smm_tasks')) || []);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('smm_expenses')) || []);
  const [monthlyGoal, setMonthlyGoal] = useState(() => JSON.parse(localStorage.getItem('smm_monthly_goal')) || 20000);
  
  // Hızlı Not Widget State (YENİ)
  const [quickNote, setQuickNote] = useState(() => localStorage.getItem('smm_quick_note') || '');

  // Settings & Edit States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('account'); 

  useEffect(() => localStorage.setItem('smm_firms', JSON.stringify(firms)), [firms]);
  useEffect(() => localStorage.setItem('smm_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('smm_expenses', JSON.stringify(expenses)), [expenses]);
  useEffect(() => localStorage.setItem('smm_monthly_goal', JSON.stringify(monthlyGoal)), [monthlyGoal]);
  
  // Quick Note Auto-Save
  useEffect(() => {
    localStorage.setItem('smm_quick_note', quickNote);
  }, [quickNote]);

  // --- CRUD ---
  const saveFirm = (firm) => {
    if (firm.id) {
      setFirms(firms.map(f => f.id === firm.id ? firm : f));
    } else {
      setFirms([...firms, { ...firm, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    }
  };

  const deleteFirm = (id) => {
    if (window.confirm('Bu firmayı ve ilişkili tüm işleri silmek istediğine emin misin?')) {
      setFirms(firms.filter(f => f.id !== id));
      setTasks(tasks.filter(t => t.firmId !== id));
    }
  };

  const saveTask = (task) => {
    if (task.id) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks([...tasks, { ...task, id: Date.now().toString(), isCompleted: false, isPaid: false }]);
    }
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  
  const toggleTaskField = (id, field) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: !t[field] } : t));
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now().toString() }]);
  };

  const deleteExpense = (id) => setExpenses(expenses.filter(e => e.id !== id));

  // --- Backup / Restore ---
  const handleExportData = () => {
    const data = {
      version: "2.0",
      date: new Date().toISOString(),
      firms,
      tasks,
      expenses,
      businessConfig,
      monthlyGoal,
      quickNote
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Panel_Yedek_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const fileInputRef = useRef(null);
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (window.confirm('Mevcut verilerin üzerine yazılacak. Emin misiniz?')) {
          if (data.firms) setFirms(data.firms);
          if (data.tasks) setTasks(data.tasks);
          if (data.expenses) setExpenses(data.expenses);
          if (data.businessConfig) setBusinessConfig(data.businessConfig);
          if (data.monthlyGoal) setMonthlyGoal(data.monthlyGoal);
          if (data.quickNote) setQuickNote(data.quickNote);
          alert('Yedek başarıyla yüklendi!');
          window.location.reload(); 
        }
      } catch (err) {
        alert('Dosya formatı hatalı!');
      }
    };
    reader.readAsText(file);
  };

  // --- İstatistikler ---
  const stats = useMemo(() => {
    const totalIncome = tasks.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const receivedIncome = tasks.filter(t => t.isPaid).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const pendingIncome = totalIncome - receivedIncome;
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const netProfit = receivedIncome - totalExpenses; 
    const activeTasks = tasks.filter(t => !t.isCompleted).length;
    const goalPercentage = Math.min(100, Math.round((receivedIncome / monthlyGoal) * 100));

    return { totalIncome, receivedIncome, pendingIncome, totalExpenses, netProfit, activeTasks, goalPercentage };
  }, [tasks, expenses, monthlyGoal]);

  const inputStyle = "w-full p-2.5 rounded-lg border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelStyle = "block text-sm font-medium text-gray-300 mb-1.5";

  // --- Ayarlar Modalı ---
  const SettingsModal = () => {
    const [formData, setFormData] = useState({ 
      username: creds.username, 
      password: creds.password 
    });
    const [bizData, setBizData] = useState(businessConfig);

    const handleSettingsSave = (e) => {
      e.preventDefault();
      if (settingsTab === 'account') {
        handleUpdateCreds(formData);
        alert('Giriş bilgileri güncellendi.');
      } else if (settingsTab === 'business') {
        setBusinessConfig(bizData);
        alert('İşletme ayarları güncellendi.');
      }
      setIsSettingsOpen(false);
    };

    return (
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Ayarlar">
        <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
          <button onClick={() => setSettingsTab('account')} className={`px-4 py-2 text-sm font-medium transition whitespace-nowrap ${settingsTab === 'account' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}>Hesap</button>
          <button onClick={() => setSettingsTab('business')} className={`px-4 py-2 text-sm font-medium transition whitespace-nowrap ${settingsTab === 'business' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}>İşletme</button>
          <button onClick={() => setSettingsTab('data')} className={`px-4 py-2 text-sm font-medium transition whitespace-nowrap ${settingsTab === 'data' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}>Veri Yönetimi</button>
        </div>

        <form onSubmit={handleSettingsSave} className="space-y-4">
          {settingsTab === 'account' && (
            <>
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/30">
                 <p className="text-sm text-blue-200">Panel giriş bilgilerini buradan yönetebilirsiniz.</p>
              </div>
              <div>
                <label className={labelStyle}>Kullanıcı Adı</label>
                <input required type="text" className={inputStyle} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Yeni Şifre</label>
                <input required type="text" className={inputStyle} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-medium">Kaydet</button>
            </>
          )}

          {settingsTab === 'business' && (
            <>
              <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-900/30">
                 <p className="text-sm text-purple-200">Panelin işletme adını ve para birimini buradan özelleştirebilirsiniz.</p>
              </div>
              <div>
                <label className={labelStyle}>İşletme / Panel Adı</label>
                <input required type="text" className={inputStyle} value={bizData.name} onChange={e => setBizData({...bizData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className={labelStyle}>Para Birimi Kodu</label>
                    <input required type="text" className={inputStyle} placeholder="TRY, USD, EUR" value={bizData.currency} onChange={e => setBizData({...bizData, currency: e.target.value})} />
                 </div>
                 <div>
                    <label className={labelStyle}>Sembol</label>
                    <input required type="text" className={inputStyle} placeholder="₺, $, €" value={bizData.currencySymbol} onChange={e => setBizData({...bizData, currencySymbol: e.target.value})} />
                 </div>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg transition font-medium">Ayarları Uygula</button>
            </>
          )}

          {settingsTab === 'data' && (
            <div className="space-y-4">
              <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-900/30">
                 <p className="text-sm text-yellow-200">Verilerinizi yedekleyebilir veya başka bir cihazdan taşıyabilirsiniz.</p>
              </div>
              <button type="button" onClick={handleExportData} className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg border border-gray-600 transition">
                <Download size={18}/> Verileri Yedekle (JSON)
              </button>
              <div className="relative">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImportData} 
                  accept=".json" 
                  className="hidden" 
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg border border-gray-600 transition">
                  <Upload size={18}/> Yedekten Geri Yükle
                </button>
              </div>
            </div>
          )}
        </form>
      </Modal>
    );
  };

  // --- Alt Sayfalar ---

  // 1. Dashboard
  const Dashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-white">Genel Bakış</h2>
          <p className="text-gray-400">Panel yönetimi ve özet istatistikler.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button onClick={() => window.print()} className="bg-gray-800 p-2.5 rounded-lg hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white transition hidden md:block">
             <Printer size={20} />
           </button>
           <div className="flex-1 md:flex-none text-right bg-gray-800 p-2 px-4 rounded-xl border border-gray-700">
             <p className="text-xs text-gray-400">Net Kâr</p>
             <p className={`text-xl font-bold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
               {formatCurrency(stats.netProfit)}
             </p>
           </div>
        </div>
      </div>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Aktif Müşteriler', val: firms.length, icon: Users, color: 'blue' },
          { label: 'Süren İşler', val: stats.activeTasks, icon: CheckSquare, color: 'orange' },
          { label: 'Bekleyen Ödeme', val: formatCurrency(stats.pendingIncome), icon: AlertCircle, color: 'red' },
          { label: 'Kasa (Tahsilat)', val: formatCurrency(stats.receivedIncome), icon: Wallet, color: 'green' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-${stat.color}-500/30 transition shadow-lg relative overflow-hidden group`}>
            <div className={`absolute right-0 top-0 w-20 h-20 bg-${stat.color}-500/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-${stat.color}-500/20 transition duration-500`}></div>
            <div className="relative z-10 w-full">
              <p className="text-gray-400 text-[10px] md:text-sm font-medium uppercase tracking-wider truncate">{stat.label}</p>
              <p className={`text-lg md:text-2xl font-bold text-${stat.color}-400 mt-1 truncate`}>{stat.val}</p>
            </div>
            <div className={`mt-2 md:mt-0 p-2 md:p-3 rounded-lg bg-${stat.color}-900/20 text-${stat.color}-400 relative z-10 self-end md:self-center`}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Finansal Grafik */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-200 flex items-center gap-2"><TrendingUp size={18}/> Finansal Denge</h3>
          <div className="relative h-6 bg-gray-700/50 rounded-full overflow-hidden flex mb-2">
            <div 
              className="bg-gradient-to-r from-green-600 to-green-400 h-full transition-all duration-1000 relative group"
              style={{ width: `${stats.totalIncome > 0 ? (stats.receivedIncome / (stats.totalIncome + stats.totalExpenses)) * 100 : 0}%` }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition"></div>
            </div>
            <div 
              className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-1000 relative group"
              style={{ width: `${stats.totalExpenses > 0 ? (stats.totalExpenses / (stats.totalIncome + stats.totalExpenses)) * 100 : 0}%` }}
            >
               <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition"></div>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm font-medium text-gray-400 mt-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <div>
                <span className="block text-xs text-gray-500">Gelir</span>
                <span className="text-gray-200">{formatCurrency(stats.receivedIncome)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
               <div>
                <span className="block text-xs text-gray-500">Gider</span>
                <span className="text-gray-200">{formatCurrency(stats.totalExpenses)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hızlı Kısayollar */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm flex flex-col justify-center gap-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Hızlı İşlemler</h3>
          <button onClick={() => { setActiveTab('firms'); }} className="w-full flex items-center justify-between bg-purple-900/20 hover:bg-purple-900/30 text-purple-300 p-3 rounded-lg border border-purple-900/50 transition group">
             <span className="flex items-center gap-2"><Users size={18}/> Müşteri Ekle</span>
             <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
          </button>
          <button onClick={() => { setActiveTab('tasks'); }} className="w-full flex items-center justify-between bg-blue-900/20 hover:bg-blue-900/30 text-blue-300 p-3 rounded-lg border border-blue-900/50 transition group">
             <span className="flex items-center gap-2"><Plus size={18}/> İş Ekle</span>
             <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
          </button>
          <button onClick={() => { setActiveTab('accounting'); }} className="w-full flex items-center justify-between bg-red-900/20 hover:bg-red-900/30 text-red-300 p-3 rounded-lg border border-red-900/50 transition group">
             <span className="flex items-center gap-2"><Wallet size={18}/> Gider Gir</span>
             <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
          </button>
        </div>
      </div>

      {/* Son İşler Tablosu */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
        <div className="p-5 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-200">Son Hareketler</h3>
          <button onClick={() => setActiveTab('tasks')} className="text-xs text-blue-400 hover:text-blue-300">Tümünü Gör</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] md:min-w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider bg-gray-900/30">
                <th className="p-4 pl-6">İş Tanımı</th>
                <th className="p-4">Firma</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Öncelik</th>
                <th className="p-4">Tutar</th>
                <th className="p-4 pr-6">Durum</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {tasks.slice(-5).reverse().map(task => {
                const firm = firms.find(f => f.id === task.firmId);
                return (
                  <tr key={task.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="p-4 pl-6 font-medium text-gray-200">{task.title}</td>
                    <td className="p-4 text-gray-400">{firm?.name || 'Bilinmiyor'}</td>
                    <td className="p-4"><PlatformBadge platform={task.platform} /></td>
                    <td className="p-4"><PriorityBadge priority={task.priority} /></td>
                    <td className="p-4 font-mono text-gray-300">{formatCurrency(task.amount)}</td>
                    <td className="p-4 pr-6">
                      {task.isCompleted ? 
                        <span className="text-green-400 flex items-center gap-1 text-xs bg-green-900/20 px-2 py-1 rounded-full w-fit border border-green-900/30"><CheckCircle2 size={12}/> Hazır</span> : 
                        <span className="text-orange-400 flex items-center gap-1 text-xs bg-orange-900/20 px-2 py-1 rounded-full w-fit border border-orange-900/30"><Circle size={12}/> Sürüyor</span>
                      }
                    </td>
                  </tr>
                )
              })}
              {tasks.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500 italic">Henüz veri girişi yapılmadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 2. Firmalar
  const Firms = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [editingFirm, setEditingFirm] = useState(null);
    const [selectedFirm, setSelectedFirm] = useState(null);

    const filteredFirms = firms.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      f.sector?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (firm = null, e = null) => {
      if(e) e.stopPropagation();
      setEditingFirm(firm || { name: '', contact: '', phone: '', sector: '', notes: '' });
      setModalOpen(true);
    };

    const handleDelete = (id, e) => {
      e.stopPropagation();
      deleteFirm(id);
    };

    const handleFirmClick = (firm) => {
      setSelectedFirm(firm);
      setDetailModalOpen(true);
    };

    const handleSave = (e) => {
      e.preventDefault();
      saveFirm(editingFirm);
      setModalOpen(false);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Firma veya sektör ara..." 
              className={inputStyle + " pl-10"}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => exportToCSV(firms, 'musteri_listesi')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 border border-gray-600 transition"
              title="Listeyi İndir"
            >
              <Download size={18}/>
            </button>
            <button 
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/20 transition font-medium border border-blue-500/50 whitespace-nowrap"
            >
              <Plus size={18}/> Yeni Müşteri
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFirms.map(firm => (
            <div 
              key={firm.id} 
              onClick={() => handleFirmClick(firm)}
              className="bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/80 transition group relative overflow-hidden cursor-pointer shadow-md"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-100 group-hover:text-blue-400 transition-colors">{firm.name}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => openModal(firm, e)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded"><Edit2 size={16} /></button>
                    <button onClick={(e) => handleDelete(firm.id, e)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-20 font-medium text-gray-500">Sektör:</span>
                    <span>{firm.sector || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 font-medium text-gray-500">Yetkili:</span>
                    <span>{firm.contact || '-'}</span>
                  </div>
                  {firm.phone && (
                    <div className="flex items-center gap-2">
                       <span className="w-20 font-medium text-gray-500">Tel:</span>
                       <span className="font-mono text-gray-300">{firm.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2 items-center justify-between border-t border-gray-700/50 pt-4">
                  <div className="flex gap-2">
                    <span className="text-xs font-semibold bg-gray-700/50 text-gray-300 px-2 py-1 rounded border border-gray-600/50">
                      {tasks.filter(t => t.firmId === firm.id).length} İş
                    </span>
                    <span className="text-xs font-semibold bg-green-900/20 text-green-400 px-2 py-1 rounded border border-green-900/30">
                      {formatCurrency(tasks.filter(t => t.firmId === firm.id && t.isPaid).reduce((a, b) => a + Number(b.amount), 0))}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors"/>
                </div>
              </div>
            </div>
          ))}
          
          {filteredFirms.length === 0 && (
            <div className="col-span-full py-16 text-center bg-gray-800 rounded-xl border border-dashed border-gray-700">
              <Users size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-500">Aramanızla eşleşen müşteri bulunamadı.</p>
            </div>
          )}
        </div>

        {/* Firma Ekle/Düzenle Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingFirm?.id ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={labelStyle}>Firma Adı</label>
              <input required type="text" className={inputStyle} value={editingFirm?.name || ''} onChange={e => setEditingFirm({...editingFirm, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Yetkili Kişi</label>
                <input type="text" className={inputStyle} value={editingFirm?.contact || ''} onChange={e => setEditingFirm({...editingFirm, contact: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Telefon</label>
                <input 
                  type="text" 
                  className={inputStyle} 
                  placeholder="05XX XXX XX XX"
                  value={editingFirm?.phone || ''} 
                  onChange={e => setEditingFirm({...editingFirm, phone: e.target.value})} 
                />
              </div>
            </div>
            <div>
               <label className={labelStyle}>Sektör</label>
               <input type="text" className={inputStyle} value={editingFirm?.sector || ''} onChange={e => setEditingFirm({...editingFirm, sector: e.target.value})} />
            </div>
            <div>
              <label className={labelStyle}>Müşteri Notları</label>
              <textarea rows="3" className={inputStyle} placeholder="Özel notlar..." value={editingFirm?.notes || ''} onChange={e => setEditingFirm({...editingFirm, notes: e.target.value})}></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium border border-blue-500/50 shadow-lg shadow-blue-900/20">Kaydet</button>
          </form>
        </Modal>

        {/* Müşteri Detay Modal */}
        <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Müşteri Detayı" maxWidth="max-w-3xl">
           {selectedFirm && (
             <div className="space-y-6">
               <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-800/30 flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedFirm.name}</h2>
                    <div className="text-sm text-gray-300 mt-2 space-y-1">
                      <p><span className="text-blue-400 font-medium">Yetkili:</span> {selectedFirm.contact || '-'}</p>
                      <p><span className="text-blue-400 font-medium">Sektör:</span> {selectedFirm.sector || '-'}</p>
                      <p className="flex items-center gap-2"><Phone size={14} className="text-blue-400"/> {selectedFirm.phone || '-'}</p>
                    </div>
                  </div>
                  <div className="text-right bg-gray-900/40 p-3 rounded-lg border border-gray-700/50 w-full md:w-auto mt-4 md:mt-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Toplam Ciro</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatCurrency(tasks.filter(t => t.firmId === selectedFirm.id).reduce((acc, curr) => acc + Number(curr.amount || 0), 0))}
                    </p>
                  </div>
               </div>

               {selectedFirm.notes && (
                 <div className="bg-yellow-900/10 p-4 rounded-lg border border-yellow-800/30 text-sm text-yellow-100/90 italic">
                   <p className="font-semibold flex items-center gap-1 mb-1 text-yellow-500 not-italic"><FileText size={14}/> Özel Notlar:</p>
                   {selectedFirm.notes}
                 </div>
               )}

               <div>
                 <h4 className="font-bold text-gray-300 mb-3 flex items-center gap-2"><CheckSquare size={18}/> İş Geçmişi</h4>
                 <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800 shadow-sm overflow-x-auto">
                   <table className="w-full text-left text-sm min-w-[600px]">
                     <thead className="bg-gray-900/50 text-gray-400 border-b border-gray-700">
                       <tr>
                         <th className="p-3 pl-4">Tarih</th>
                         <th className="p-3">İş</th>
                         <th className="p-3">Tutar</th>
                         <th className="p-3 pr-4 text-right">Durum</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-700">
                       {tasks.filter(t => t.firmId === selectedFirm.id).map(task => (
                         <tr key={task.id} className="hover:bg-gray-700/50">
                           <td className="p-3 pl-4 text-gray-400">{formatDate(task.date)}</td>
                           <td className="p-3">
                             <div className="flex flex-col">
                               <span className="text-gray-200 font-medium">{task.title}</span>
                               <span className="text-[10px] text-gray-500">{task.platform}</span>
                             </div>
                           </td>
                           <td className="p-3 font-mono text-gray-300">{formatCurrency(task.amount)}</td>
                           <td className="p-3 pr-4 text-right">
                             {task.isCompleted ? 
                               <span className="text-green-400 text-xs font-semibold">Tamamlandı</span> : 
                               <span className="text-orange-400 text-xs font-semibold">Sürüyor</span>
                             }
                           </td>
                         </tr>
                       ))}
                       {tasks.filter(t => t.firmId === selectedFirm.id).length === 0 && (
                         <tr><td colSpan="4" className="p-6 text-center text-gray-500">Bu müşteriye ait iş kaydı yok.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           )}
        </Modal>
      </div>
    );
  };

  // 3. İşler
  const Tasks = () => {
    const [filter, setFilter] = useState('all'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const filteredTasks = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'active' ? !task.isCompleted :
        filter === 'completed' ? task.isCompleted :
        filter === 'unpaid' ? !task.isPaid : true;
      return matchesSearch && matchesFilter;
    });

    const openModal = (task = null) => {
      if (firms.length === 0) {
        alert("Önce müşteri eklemelisiniz!");
        return;
      }
      setEditingTask(task || { 
        firmId: firms[0]?.id, 
        title: '', 
        platform: 'Instagram', 
        priority: 'Orta',
        amount: '', 
        date: new Date().toISOString().split('T')[0] 
      });
      setModalOpen(true);
    };

    const handleSave = (e) => {
      e.preventDefault();
      saveTask(editingTask);
      setModalOpen(false);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="İşlerde ara..." 
                className={inputStyle + " pl-10"}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-700/50 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="active">Sürenler</option>
              <option value="completed">Tamamlanan</option>
              <option value="unpaid">Ödeme Bekleyen</option>
            </select>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
                onClick={() => exportToCSV(tasks, 'is_listesi')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 border border-gray-600 transition flex-1 md:flex-none"
              >
              <Download size={18}/>
            </button>
            <button 
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition font-medium whitespace-nowrap border border-blue-500/50 flex-1 md:flex-none"
            >
              <Plus size={18}/> Yeni İş
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-900/50 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Tarih</th>
                  <th className="p-4">Müşteri</th>
                  <th className="p-4">İş Detayı</th>
                  <th className="p-4">Öncelik</th>
                  <th className="p-4">Tutar</th>
                  <th className="p-4 text-center">Durum</th>
                  <th className="p-4 text-center">Ödeme</th>
                  <th className="p-4 pr-6 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {filteredTasks.map(task => {
                  const firm = firms.find(f => f.id === task.firmId);
                  return (
                    <tr key={task.id} className="hover:bg-gray-700/40 transition-colors">
                      <td className="p-4 pl-6 text-gray-400 whitespace-nowrap">{formatDate(task.date)}</td>
                      <td className="p-4 font-medium text-gray-200">{firm?.name || <span className="text-red-400 text-xs">Silinmiş Firma</span>}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className={`font-medium ${task.isCompleted ? "line-through text-gray-500" : "text-gray-200"}`}>{task.title}</span>
                          <div className="flex"><PlatformBadge platform={task.platform} /></div>
                        </div>
                      </td>
                      <td className="p-4"><PriorityBadge priority={task.priority} /></td>
                      <td className="p-4 font-mono font-semibold text-gray-300">{formatCurrency(task.amount)}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => toggleTaskField(task.id, 'isCompleted')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${task.isCompleted ? 'bg-green-900/20 text-green-400 border border-green-900/30' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 border border-gray-600'}`}
                        >
                          {task.isCompleted ? 'Tamamlandı' : 'Sürüyor'}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                           onClick={() => toggleTaskField(task.id, 'isPaid')}
                           title={task.isPaid ? "Ödenmedi olarak işaretle" : "Ödendi olarak işaretle"}
                        >
                           {task.isPaid ? <CheckCircle2 className="text-green-500 drop-shadow-sm" size={20}/> : <AlertCircle className="text-red-400 hover:text-red-500" size={20}/>}
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openModal(task)} className="p-1.5 text-blue-400 bg-blue-900/20 rounded hover:bg-blue-900/40 border border-blue-900/30"><Edit2 size={16}/></button>
                          <button onClick={() => deleteTask(task.id)} className="p-1.5 text-red-400 bg-red-900/20 rounded hover:bg-red-900/40 border border-red-900/30"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredTasks.length === 0 && (
              <div className="p-10 text-center text-gray-500">
                <Filter size={32} className="mx-auto mb-2 text-gray-600"/>
                Kriterlere uygun iş bulunamadı.
              </div>
            )}
          </div>
        </div>

         {/* İş Ekle/Düzenle Modal */}
         <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTask?.id ? 'İşi Düzenle' : 'Yeni İş Ekle'}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={labelStyle}>Müşteri Seçin</label>
              <select required className={inputStyle} value={editingTask?.firmId || ''} onChange={e => setEditingTask({...editingTask, firmId: e.target.value})}>
                {firms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className={labelStyle}>Platform</label>
                <select className={inputStyle} value={editingTask?.platform || 'Instagram'} onChange={e => setEditingTask({...editingTask, platform: e.target.value})}>
                  {['Instagram', 'TikTok', 'Youtube', 'LinkedIn', 'Twitter', 'Diğer'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
               </div>
               <div>
                <label className={labelStyle}>Öncelik</label>
                <select className={inputStyle} value={editingTask?.priority || 'Orta'} onChange={e => setEditingTask({...editingTask, priority: e.target.value})}>
                  <option value="Yüksek">Yüksek</option>
                  <option value="Orta">Orta</option>
                  <option value="Düşük">Düşük</option>
                </select>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className={labelStyle}>Tarih</label>
                   <input type="date" className={inputStyle} value={editingTask?.date || ''} onChange={e => setEditingTask({...editingTask, date: e.target.value})} />
                </div>
                <div>
                  <label className={labelStyle}>Tutar ({businessConfig.currencySymbol})</label>
                  <input required type="number" className={inputStyle} value={editingTask?.amount || ''} onChange={e => setEditingTask({...editingTask, amount: e.target.value})} />
                </div>
            </div>
            <div>
              <label className={labelStyle}>İş Tanımı</label>
              <input required type="text" placeholder="Örn: 3 adet Reels kurgusu" className={inputStyle} value={editingTask?.title || ''} onChange={e => setEditingTask({...editingTask, title: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium border border-blue-500/50 shadow-lg shadow-blue-900/20">Kaydet</button>
          </form>
        </Modal>
      </div>
    );
  };

  // 4. Muhasebe
  const Accounting = () => {
    const [subTab, setSubTab] = useState('income'); 
    const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Genel', date: new Date().toISOString().split('T')[0] });

    const handleExpenseSave = (e) => {
      e.preventDefault();
      if (!newExpense.title || !newExpense.amount) return;
      addExpense(newExpense);
      setNewExpense({ title: '', amount: '', category: 'Genel', date: new Date().toISOString().split('T')[0] });
    };

    return (
      <div className="space-y-6">
        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden border border-gray-700">
             <div className="relative z-10">
               <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Net Kâr</p>
               <p className="text-3xl font-bold">{formatCurrency(stats.netProfit)}</p>
               <p className="text-xs text-gray-500 mt-2">Kasa - Giderler</p>
             </div>
             <Wallet className="absolute right-4 bottom-4 text-gray-700 opacity-30 w-24 h-24" />
          </div>
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-green-900/20 text-green-400 rounded-lg"><TrendingUp size={20}/></div>
               <p className="text-gray-400 text-sm font-medium">Gelir</p>
             </div>
             <p className="text-2xl font-bold text-gray-200">{formatCurrency(stats.receivedIncome)}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-red-900/20 text-red-400 rounded-lg"><TrendingDown size={20}/></div>
               <p className="text-gray-400 text-sm font-medium">Gider</p>
             </div>
             <p className="text-2xl font-bold text-gray-200">{formatCurrency(stats.totalExpenses)}</p>
          </div>
        </div>

        {/* Başlık & İndirme */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700">
           <div className="flex items-center bg-gray-900/50 p-1 rounded-lg border border-gray-700 w-full md:w-auto">
             <button 
               onClick={() => setSubTab('income')} 
               className={`flex-1 px-6 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'income' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
             >
               Gelirler
             </button>
             <button 
                onClick={() => setSubTab('expense')} 
                className={`flex-1 px-6 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'expense' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
             >
               Giderler
             </button>
           </div>
           
           <button 
             onClick={() => exportToCSV(subTab === 'income' ? tasks : expenses, subTab === 'income' ? 'gelir_listesi' : 'gider_listesi')}
             className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 border border-gray-600 transition text-sm"
           >
             <Download size={16}/> Tabloyu İndir (CSV)
           </button>
        </div>

        {subTab === 'income' ? (
           <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm min-w-[600px]">
                 <thead className="bg-gray-900/50 text-gray-400 border-b border-gray-700">
                   <tr>
                     <th className="p-3">Firma</th>
                     <th className="p-3">Açıklama</th>
                     <th className="p-3">Tarih</th>
                     <th className="p-3">Tutar</th>
                     <th className="p-3 text-right">Durum</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-700">
                   {tasks.map(t => (
                     <tr key={t.id} className="hover:bg-gray-700/50">
                       <td className="p-3 text-gray-200 font-medium">{firms.find(f => f.id === t.firmId)?.name}</td>
                       <td className="p-3 text-gray-400">{t.title}</td>
                       <td className="p-3 text-gray-500 text-xs">{formatDate(t.date)}</td>
                       <td className="p-3 font-mono text-gray-300">{formatCurrency(t.amount)}</td>
                       <td className="p-3 text-right">
                         {t.isPaid ? <span className="text-green-400 font-medium text-xs">Tahsil Edildi</span> : <span className="text-red-400 font-medium text-xs">Bekliyor</span>}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 sticky top-4">
                <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2"><Plus size={16}/> Hızlı Gider Ekle</h4>
                <form onSubmit={handleExpenseSave} className="space-y-3">
                  <input required type="text" placeholder="Gider Adı" className={inputStyle} value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} />
                  <input required type="number" placeholder="Tutar" className={inputStyle} value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
                  <select className={inputStyle} value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                    <option>Genel</option>
                    <option>Yazılım/Lisans</option>
                    <option>Donanım</option>
                    <option>Reklam</option>
                    <option>Vergi</option>
                    <option>Ofis/Kira</option>
                    <option>Ulaşım</option>
                  </select>
                  <input type="date" className={inputStyle} value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
                  <button type="submit" className="w-full bg-red-600 text-white py-2.5 rounded hover:bg-red-700 text-sm font-medium border border-red-500/50 shadow-lg shadow-red-900/20">Gider Ekle</button>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm min-w-[600px]">
                   <thead className="bg-red-900/20 text-red-300 border-b border-gray-700">
                     <tr>
                       <th className="p-3">Tarih</th>
                       <th className="p-3">Açıklama</th>
                       <th className="p-3">Kategori</th>
                       <th className="p-3">Tutar</th>
                       <th className="p-3 text-right">Sil</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-700">
                     {expenses.map(exp => (
                       <tr key={exp.id} className="hover:bg-gray-700/50">
                         <td className="p-3 text-gray-400">{formatDate(exp.date)}</td>
                         <td className="p-3 font-medium text-gray-200">{exp.title}</td>
                         <td className="p-3"><span className="text-xs bg-gray-700 border border-gray-600 px-2 py-1 rounded text-gray-300">{exp.category}</span></td>
                         <td className="p-3 font-mono text-red-400">-{formatCurrency(exp.amount)}</td>
                         <td className="p-3 text-right">
                           <button onClick={() => deleteExpense(exp.id)} className="text-gray-500 hover:text-red-400 transition"><Trash2 size={16}/></button>
                         </td>
                       </tr>
                     ))}
                     {expenses.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">Henüz gider eklenmedi.</td></tr>}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Ana Render ---
  
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={authError} businessName={businessConfig.name} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 font-sans text-gray-100 print:bg-white print:text-black overflow-x-hidden">
      <SettingsModal />
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 fixed h-full hidden md:flex flex-col z-20 print:hidden">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
               <Briefcase size={18}/>
            </div>
            {businessConfig.name}
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Genel Bakış' },
            { id: 'firms', icon: Users, label: 'Müşteriler' },
            { id: 'tasks', icon: CheckSquare, label: 'İş Yönetimi' },
            { id: 'accounting', icon: Wallet, label: 'Muhasebe' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                activeTab === item.id 
                ? 'bg-blue-900/20 text-blue-400 shadow-sm ring-1 ring-blue-800' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
              }`}
            >
              <item.icon size={20} className={`transition-transform duration-200 ${activeTab === item.id ? 'text-blue-400' : 'text-gray-500 group-hover:scale-110'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
           <button 
             onClick={() => setIsSettingsOpen(true)}
             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 transition"
           >
             <Settings size={18} /> Ayarlar
           </button>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition"
           >
             <LogOut size={18} /> Çıkış Yap
           </button>
        </div>

        {/* Hızlı Not Widget (YENİ) */}
        <div className="p-4 m-4 mt-0 bg-yellow-900/10 rounded-xl border border-yellow-700/30 shadow-inner group hover:bg-yellow-900/20 transition">
          <div className="flex justify-between items-center mb-2">
             <p className="text-xs font-bold text-yellow-500 flex items-center gap-1"><StickyNote size={14}/> Hızlı Not</p>
          </div>
          <textarea
             className="w-full bg-transparent text-yellow-100/90 text-xs focus:outline-none resize-none placeholder-yellow-500/30"
             rows="4"
             placeholder="Buraya hatırlatıcı notlar alabilirsin..."
             value={quickNote}
             onChange={e => setQuickNote(e.target.value)}
          ></textarea>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Gelişmiş) */}
      <div className="md:hidden fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 z-50 px-4 py-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] safe-area-pb print:hidden">
         <div className="flex items-center justify-between">
           
           {/* Sol Taraf: Navigasyon */}
           <div className="flex items-center justify-around flex-1 mr-4">
             {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Özet' },
                { id: 'firms', icon: Users, label: 'Müşteri' },
                { id: 'tasks', icon: CheckSquare, label: 'İşler' },
                { id: 'accounting', icon: Wallet, label: 'Kasa' },
              ].map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative group ${
                      isActive ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-blue-500/10 rounded-xl scale-0 transition-transform duration-300 ${isActive ? 'scale-100' : ''}`}></div>
                    <item.icon size={20} className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[9px] font-medium relative z-10">{item.label}</span>
                    {isActive && <span className="absolute -bottom-1 w-1 h-1 bg-blue-400 rounded-full"></span>}
                  </button>
                );
              })}
           </div>

           {/* Sağ Taraf: Sistem */}
           <div className="flex items-center gap-2 pl-4 border-l border-gray-700/50">
             <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
               <Settings size={20}/>
             </button>
             <button onClick={handleLogout} className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
               <LogOut size={20}/>
             </button>
           </div>
         </div>
      </div>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto custom-scrollbar print:ml-0 print:p-0 print:mt-0 min-w-0">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'firms' && <Firms />}
          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'accounting' && <Accounting />}
        </div>
      </main>

      <style>{`
        @media print {
          @page { margin: 1cm; size: landscape; }
          body { background: white; color: black; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:ml-0 { margin-left: 0 !important; }
          .bg-gray-900, .bg-gray-800 { background-color: white !important; border: 1px solid #ddd !important; }
          .text-white, .text-gray-100, .text-gray-200, .text-gray-300, .text-gray-400 { color: black !important; }
        }
        /* Mobile Safe Area Adjustment */
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}