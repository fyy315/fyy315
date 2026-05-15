import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../hooks/useAuth';

interface Application {
  id: string;
  application_type: string;
  application_status: string;
  trademark_name: string;
  category: string;
  created_at: string;
}

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: '待审核', color: 'text-yellow-400', icon: Clock },
  processing: { label: '处理中', color: 'text-blue-400', icon: FileText },
  completed: { label: '已完成', color: 'text-green-400', icon: CheckCircle },
  rejected: { label: '已驳回', color: 'text-red-400', icon: AlertCircle }
};

const steps = ['提交申请', '资料审核', '官方受理', '完成'];

export default function ApplicationPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'registration' | 'protection'>('registration');
  const [applications, setApplications] = useState<Application[]>([]);
  const [formData, setFormData] = useState({
    trademark_name: '',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user, activeTab]);

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('user_applications')
      .select('*')
      .eq('user_id', user?.id)
      .eq('application_type', activeTab)
      .order('created_at', { ascending: false });
    setApplications(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    
    await supabase.from('user_applications').insert({
      user_id: user.id,
      application_type: activeTab,
      trademark_name: formData.trademark_name,
      category: formData.category,
      application_status: 'pending'
    });
    
    setFormData({ trademark_name: '', category: '', description: '' });
    fetchApplications();
    setLoading(false);
  };

  const getStepProgress = (status: string) => {
    const statusIndex = ['pending', 'processing', 'completed'].indexOf(status);
    return statusIndex + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1A1A3E] to-[#302B63] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">申请服务</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('registration')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'registration'
                ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <FileText className="w-5 h-5" />
            商标注册
          </button>
          <button
            onClick={() => setActiveTab('protection')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'protection'
                ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Shield className="w-5 h-5" />
            维权申请
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              {activeTab === 'registration' ? '提交商标注册申请' : '提交维权申请'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">商标名称</label>
                <input
                  type="text"
                  value={formData.trademark_name}
                  onChange={(e) => setFormData({ ...formData, trademark_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40"
                  placeholder="请输入商标名称"
                  required
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-2 block">国际分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
                  required
                >
                  <option value="" className="bg-slate-800">请选择分类</option>
                  <option value="第9类" className="bg-slate-800">第9类 - 科学仪器</option>
                  <option value="第25类" className="bg-slate-800">第25类 - 服装鞋帽</option>
                  <option value="第35类" className="bg-slate-800">第35类 - 广告销售</option>
                  <option value="第42类" className="bg-slate-800">第42类 - 科技服务</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-2 block">补充说明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 h-24 resize-none"
                  placeholder="请描述您的需求..."
                />
              </div>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-white/60 text-sm">点击上传相关证明材料</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-medium disabled:opacity-50"
              >
                {loading ? '提交中...' : '提交申请'}
              </button>
            </form>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">申请进度</h2>
            {applications.map((app) => {
              const status = statusMap[app.application_status];
              const progress = getStepProgress(app.application_status);
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold">{app.trademark_name}</h3>
                      <p className="text-white/50 text-sm">{app.category}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${status.color} bg-white/5`}>
                      <status.icon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {steps.map((step, index) => (
                      <div key={step} className="flex items-center flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            index < progress
                              ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] text-white'
                              : 'bg-white/10 text-white/40'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className={`text-xs ml-2 ${index < progress ? 'text-white' : 'text-white/40'}`}>
                          {step}
                        </span>
                        {index < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 ${index < progress - 1 ? 'bg-[#00D2FF]' : 'bg-white/20'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
            {applications.length === 0 && (
              <div className="text-center py-12 text-white/40">
                <Clock className="w-12 h-12 mx-auto mb-4" />
                <p>暂无申请记录</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
