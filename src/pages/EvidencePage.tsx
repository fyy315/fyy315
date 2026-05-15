import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, Clock, XCircle, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../hooks/useAuth';

interface Evidence {
  id: string;
  evidence_type: 'usage' | 'infringement';
  status: 'pending' | 'verified' | 'rejected';
  file_url: string | null;
  description: string | null;
  created_at: string;
}

export default function EvidencePage() {
  const { user } = useAuth();
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [activeTab, setActiveTab] = useState<'usage' | 'infringement'>('usage');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) fetchEvidences();
  }, [user]);

  const fetchEvidences = async () => {
    const { data } = await supabase
      .from('user_evidences')
      .select('*')
      .order('created_at', { ascending: false });
    setEvidences(data || []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('evidences')
      .upload(fileName, file);

    if (uploadError) {
      alert('上传失败');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('evidences').getPublicUrl(fileName);

    await supabase.from('user_evidences').insert({
      user_id: user.id,
      evidence_type: activeTab,
      file_url: urlData.publicUrl,
      description: description || null,
    });

    setDescription('');
    setUploading(false);
    fetchEvidences();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return '已审核';
      case 'rejected': return '已驳回';
      default: return '审核中';
    }
  };

  const filteredEvidences = evidences.filter(e => e.evidence_type === activeTab);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">证据留存</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('usage')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === 'usage'
                ? 'bg-[#6C5CE7] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Shield className="w-5 h-5" />
            使用证据
          </button>
          <button
            onClick={() => setActiveTab('infringement')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === 'infringement'
                ? 'bg-[#FF6B6B] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            侵权证据
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            上传{activeTab === 'usage' ? '使用' : '侵权'}证据
          </h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请输入证据描述..."
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 mb-4 resize-none"
            rows={3}
          />
          <label className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
            <Upload className="w-5 h-5 text-white/70" />
            <span className="text-white/70">{uploading ? '上传中...' : '点击上传文件'}</span>
            <input type="file" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </motion.div>

        <div className="space-y-4">
          {filteredEvidences.map((evidence, index) => (
            <motion.div
              key={evidence.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#00D2FF]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {evidence.file_url?.split('/').pop() || '未命名文件'}
                    </p>
                    <p className="text-white/50 text-sm">{evidence.description || '无描述'}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(evidence.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                  {getStatusIcon(evidence.status)}
                  <span className="text-white text-sm">{getStatusText(evidence.status)}</span>
                </div>
              </div>
              {evidence.file_url && (
                <a
                  href={evidence.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-[#00D2FF] hover:underline text-sm"
                >
                  查看文件
                </a>
              )}
            </motion.div>
          ))}
          {filteredEvidences.length === 0 && (
            <div className="text-center py-12 text-white/50">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>暂无{activeTab === 'usage' ? '使用' : '侵权'}证据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
