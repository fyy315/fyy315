import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Bell, Shield, Code, Copy, Check, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase/client';

interface ApiKey {
  id: string;
  api_key: string;
  rate_limit: number;
  created_at: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('api');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    bid: true,
    order: true,
    marketing: false
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlert: true,
    deviceManage: true
  });
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    const { data } = await supabase.from('api_keys').select('*').order('created_at', { ascending: false });
    setApiKeys(data || []);
  };

  const generateApiKey = async () => {
    const newKey = 'sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await supabase.from('api_keys').insert({ api_key: newKey, rate_limit: 100 });
    fetchApiKeys();
  };

  const deleteApiKey = async (id: string) => {
    await supabase.from('api_keys').delete().eq('id', id);
    fetchApiKeys();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { id: 'api', label: 'API密钥', icon: Key },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'security', label: '安全设置', icon: Shield },
    { id: 'developer', label: '开发者', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">个人设置</h1>

        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'api' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">API密钥管理</h2>
                  <p className="text-white/60 text-sm mt-1">用于访问平台OpenAPI接口</p>
                </div>
                <button
                  onClick={generateApiKey}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6C5CE7] hover:bg-[#5a4dd0] text-white rounded-xl transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  生成新密钥
                </button>
              </div>

              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <code className="text-[#00D2FF] font-mono">
                          {showKey[key.id] ? key.api_key : key.api_key.substring(0, 8) + '...' + key.api_key.substring(-4)}
                        </code>
                        <button
                          onClick={() => setShowKey({ ...showKey, [key.id]: !showKey[key.id] })}
                          className="text-white/50 hover:text-white"
                        >
                          {showKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-white/40 text-sm mt-1">限流: {key.rate_limit}/分钟 · 创建于 {new Date(key.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(key.api_key, key.id)}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {copied === key.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteApiKey(key.id)}
                        className="p-2 text-white/60 hover:text-[#FF6B6B] hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {apiKeys.length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>暂无API密钥，点击上方按钮生成</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">API文档</h3>
              <div className="bg-black/30 rounded-xl p-4 font-mono text-sm text-white/80 overflow-x-auto">
                <p className="text-[#6C5CE7]"># 基础URL</p>
                <p className="mb-3">https://api.trademark.exchange/v1</p>
                <p className="text-[#6C5CE7]"># 认证方式</p>
                <p className="mb-3">Authorization: Bearer {'{your_api_key}'}</p>
                <p className="text-[#6C5CE7]"># 示例请求</p>
                <p>curl -H "Authorization: Bearer sk-xxx" \</p>
                <p>  https://api.trademark.exchange/v1/trademarks</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">通知设置</h2>
            <div className="space-y-4">
              {[
                { key: 'email', label: '邮件通知', desc: '接收重要交易和账户变动邮件' },
                { key: 'sms', label: '短信通知', desc: '接收验证码和紧急提醒' },
                { key: 'bid', label: '出价提醒', desc: '有人出价时通知我' },
                { key: 'order', label: '订单状态', desc: '订单状态变更时通知' },
                { key: 'marketing', label: '营销推送', desc: '接收优惠活动和新品推荐' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-[#6C5CE7]' : 'bg-white/20'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-6">安全设置</h2>
              <div className="space-y-4">
                {[
                  { key: 'twoFactor', label: '双重认证', desc: '开启后登录需验证手机验证码' },
                  { key: 'loginAlert', label: '登录提醒', desc: '新设备登录时发送通知' },
                  { key: 'deviceManage', label: '设备管理', desc: '查看和管理已登录设备' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setSecurity({ ...security, [item.key]: !security[item.key as keyof typeof security] })}
                      className={`w-12 h-6 rounded-full transition-colors ${security[item.key as keyof typeof security] ? 'bg-[#6C5CE7]' : 'bg-white/20'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${security[item.key as keyof typeof security] ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">修改密码</h3>
              <div className="space-y-4">
                <input type="password" placeholder="当前密码" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40" />
                <input type="password" placeholder="新密码" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40" />
                <input type="password" placeholder="确认新密码" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40" />
                <button className="w-full py-3 bg-[#6C5CE7] hover:bg-[#5a4dd0] text-white rounded-xl font-medium transition-colors">
                  更新密码
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'developer' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">开发者模式</h2>
                  <p className="text-white/60 text-sm mt-1">开启后显示调试信息和高级功能</p>
                </div>
                <button
                  onClick={() => setDevMode(!devMode)}
                  className={`w-14 h-7 rounded-full transition-colors ${devMode ? 'bg-[#6C5CE7]' : 'bg-white/20'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${devMode ? 'translate-x-7' : 'translate-x-0.5'} mt-0.5`} />
                </button>
              </div>

              {devMode && (
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-[#00D2FF] font-mono text-sm mb-2">// 调试信息</p>
                    <p className="text-white/60 text-sm font-mono">User Agent: {navigator.userAgent}</p>
                    <p className="text-white/60 text-sm font-mono">Platform: {navigator.platform}</p>
                    <p className="text-white/60 text-sm font-mono">Language: {navigator.language}</p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-[#00D2FF] font-mono text-sm mb-2">// CLI安装</p>
                    <code className="text-white/80 text-sm">npm install -g tm-cli</code>
                    <p className="text-white/40 text-sm mt-2">tm config set apiKey sk-xxx</p>
                    <p className="text-white/40 text-sm">tm search "第9类商标"</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Webhook配置</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Webhook URL</label>
                  <input type="text" placeholder="https://your-server.com/webhook" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40" />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Secret Key</label>
                  <input type="text" placeholder="whsec_xxx" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40" />
                </div>
                <button className="w-full py-3 bg-[#6C5CE7] hover:bg-[#5a4dd0] text-white rounded-xl font-medium transition-colors">
                  保存配置
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
