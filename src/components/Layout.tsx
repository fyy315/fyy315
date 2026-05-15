import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  FileText,
  PlusCircle,
  List,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Briefcase,
  User,
  Ticket,
  Calculator,
  Eye,
  Upload,
  ClipboardList,
  Wallet,
  BarChart3,
  Globe,
  Gift
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, currentRole, setCurrentRole, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles = [
    { key: 'demander', label: '需求人', icon: User, color: '#00D2FF' },
    { key: 'rights_holder', label: '权利人', icon: Shield, color: '#6C5CE7' },
    { key: 'agent', label: '中介', icon: Briefcase, color: '#FF6B6B' }
  ];

  const getMenuItems = () => {
    const baseItems = [
      { path: '/search', label: '智能搜索', icon: Search, roles: ['demander'] },
      { path: '/ai-estimate', label: 'AI估价', icon: Calculator, roles: ['demander'] },
      { path: '/cart', label: '购物车', icon: ShoppingCart, roles: ['demander'] },
      { path: '/orders', label: '我的订单', icon: FileText, roles: ['demander'] },
      { path: '/monitor', label: '商标监控', icon: Eye, roles: ['demander'] },
      { path: '/wallet', label: '我的钱包', icon: Wallet, roles: ['demander', 'rights_holder', 'agent'] },
      { path: '/referral', label: '邀请返利', icon: Gift, roles: ['demander', 'rights_holder', 'agent'] },
      { path: '/create-listing', label: '商标上架', icon: PlusCircle, roles: ['rights_holder'] },
      { path: '/my-listings', label: '我的上架', icon: List, roles: ['rights_holder'] },
      { path: '/evidence', label: '证据留存', icon: Upload, roles: ['rights_holder'] },
      { path: '/application', label: '申请办理', icon: ClipboardList, roles: ['rights_holder'] },
      { path: '/agent/orders', label: '订单处理', icon: Users, roles: ['agent'] },
      { path: '/invitation', label: '邀请码', icon: Ticket, roles: ['agent'] },
      { path: '/analytics', label: '数据分析', icon: BarChart3, roles: ['agent'] },
      { path: '/sitemap', label: '站点地图', icon: Globe, roles: ['demander', 'rights_holder', 'agent'] },
      { path: '/settings', label: '个人设置', icon: Settings, roles: ['demander', 'rights_holder', 'agent'] },
    ];
    return baseItems.filter(item => item.roles.includes(currentRole || ''));
  };

  const handleRoleSwitch = (role: string) => {
    setCurrentRole(role);
    setRoleMenuOpen(false);
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRoleInfo = roles.find(r => r.key === currentRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63] text-white">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(108, 92, 231, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(108, 92, 231, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.header
        className="fixed top-0 left-0 right-0 h-16 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] bg-clip-text text-transparent">
              AI商标交易
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {currentRoleInfo && (
                    <span style={{ color: currentRoleInfo.color }}>
                      {currentRoleInfo.key === 'demander' && <User size={18} />}
                      {currentRoleInfo.key === 'rights_holder' && <Shield size={18} />}
                      {currentRoleInfo.key === 'agent' && <Briefcase size={18} />}
                    </span>
                  )}
                  <span>{currentRoleInfo?.label || '选择角色'}</span>
                </button>
                {roleMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-[#1A1A3E] border border-white/10 shadow-xl overflow-hidden"
                  >
                    {roles.map(role => (
                      <button
                        key={role.key}
                        onClick={() => handleRoleSwitch(role.key)}
                        className={`w-full flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors ${
                          currentRole === role.key ? 'bg-white/10' : ''
                        }`}
                      >
                        <span style={{ color: role.color }}>
                          {role.key === 'demander' && <User size={16} />}
                          {role.key === 'rights_holder' && <Shield size={16} />}
                          {role.key === 'agent' && <Briefcase size={16} />}
                        </span>
                        <span>{role.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#FF6B6B]"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      <motion.aside
        className="fixed left-0 top-16 bottom-0 w-64 z-40 backdrop-blur-xl bg-white/5 border-r border-white/10"
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
      >
        <nav className="p-4 space-y-2">
          {getMenuItems().map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-[#6C5CE7]/50 to-[#00D2FF]/50 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'pl-64' : 'pl-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      <footer className="fixed bottom-0 right-0 left-0 py-3 text-center text-white/40 text-sm backdrop-blur-sm bg-black/20">
        AI商标交易撮合平台 2024
      </footer>
    </div>
  );
};

export default Layout;
