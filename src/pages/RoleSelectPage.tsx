import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Shield, Users } from 'lucide-react';
import { useAppStore } from '../store';

const roles = [
  {
    id: 'demander',
    title: '需求人',
    icon: Search,
    desc: '寻找心仪的商标，发起购买或竞价',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    id: 'rights_holder',
    title: '权利人',
    icon: Shield,
    desc: '上架商标，管理出售与拍卖',
    color: 'from-purple-500 to-pink-400'
  },
  {
    id: 'agent',
    title: '中介',
    icon: Users,
    desc: '撮合交易，协助过户流程',
    color: 'from-amber-500 to-orange-400'
  }
];

export default function RoleSelectPage() {
  const navigate = useNavigate();
  const { setCurrentRole, user } = useAppStore();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const handleSelectRole = (roleId: string) => {
    setCurrentRole(roleId as any);
    if (roleId === 'demander') {
      navigate('/search');
    } else if (roleId === 'rights_holder') {
      navigate('/my-listings');
    } else if (roleId === 'agent') {
      navigate('/agent/orders');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            欢迎回来，{user?.username || '用户'}
          </h1>
          <p className="text-slate-300 text-lg">请选择您当前的操作角色</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleSelectRole(role.id)}
              className="relative cursor-pointer group"
            >
              <div
                className={`
                  relative overflow-hidden rounded-2xl p-8
                  bg-white/5 backdrop-blur-lg border border-white/10
                  transition-all duration-300
                  ${hoveredRole === role.id ? 'shadow-2xl shadow-purple-500/30 border-purple-400/50' : ''}
                `}
              >
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-br ${role.color} opacity-0
                    transition-opacity duration-300
                    ${hoveredRole === role.id ? 'opacity-10' : ''}
                  `}
                />

                <div className="relative z-10">
                  <div
                    className={`
                      w-16 h-16 rounded-xl bg-gradient-to-br ${role.color}
                      flex items-center justify-center mb-6
                      transition-transform duration-300
                      ${hoveredRole === role.id ? 'scale-110' : ''}
                    `}
                  >
                    <role.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{role.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{role.desc}</p>

                  <div
                    className={`
                      mt-6 flex items-center text-sm font-medium
                      bg-gradient-to-r ${role.color} bg-clip-text text-transparent
                      transition-all duration-300
                      ${hoveredRole === role.id ? 'translate-x-2' : ''}
                    `}
                  >
                    进入工作台
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
