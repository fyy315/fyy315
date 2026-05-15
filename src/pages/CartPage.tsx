import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  trademarkId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockItems: CartItem[] = [
      {
        id: '1',
        trademarkId: 'TM001',
        name: '智慧云',
        category: '第9类',
        price: 50000,
        quantity: 1,
      },
      {
        id: '2',
        trademarkId: 'TM002',
        name: '数据链',
        category: '第42类',
        price: 35000,
        quantity: 1,
      },
    ];
    setCartItems(mockItems);
    setLoading(false);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5CE7]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">购物车</h1>
          <p className="text-gray-400">管理您的商标选购清单</p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-2">购物车为空</h2>
            <p className="text-gray-400 mb-6">快去选购心仪的商标吧</p>
            <button
              onClick={() => navigate('/search')}
              className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            >
              去选购
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#6C5CE7]/20 to-[#00D2FF]/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#6C5CE7]">
                        {item.name[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.category}</p>
                      <p className="text-[#00D2FF] font-bold mt-1">
                        ¥{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 h-fit"
            >
              <h2 className="text-xl font-semibold text-white mb-6">订单摘要</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>商品数量</span>
                  <span className="text-white">{cartItems.length} 件</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>小计</span>
                  <span className="text-white">¥{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>服务费</span>
                  <span className="text-white">¥0</span>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">总计</span>
                    <span className="text-2xl font-bold text-[#00D2FF]">
                      ¥{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
              >
                立即结算
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
