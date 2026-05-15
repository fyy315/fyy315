import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './supabase/client';
import { useAppStore } from './store';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RoleSelectPage from './pages/RoleSelectPage';
import SearchPage from './pages/SearchPage';
import TrademarkDetail from './pages/TrademarkDetail';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import CreateListing from './pages/CreateListing';
import MyListings from './pages/MyListings';
import AgentOrders from './pages/AgentOrders';
import InvitationCodePage from './pages/InvitationCodePage';
import AIEstimatePage from './pages/AIEstimatePage';
import MonitorPage from './pages/MonitorPage';
import EvidencePage from './pages/EvidencePage';
import ApplicationPage from './pages/ApplicationPage';
import WalletPage from './pages/WalletPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SitemapPage from './pages/SitemapPage';
import ReferralPage from './pages/ReferralPage';

function App() {
  const { user, setUser, currentRole } = useAppStore();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        setUser(profile);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/role-select" /> : <LoginPage />} />
        <Route path="/role-select" element={user ? <RoleSelectPage /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Navigate to={currentRole ? '/search' : '/role-select'} /> : <Navigate to="/login" />} />
        <Route path="/search" element={
          <Layout>
            <SearchPage />
          </Layout>
        } />
        <Route path="/trademark/:id" element={
          <Layout>
            <TrademarkDetail />
          </Layout>
        } />
        <Route path="/cart" element={
          <Layout>
            <CartPage />
          </Layout>
        } />
        <Route path="/orders" element={
          <Layout>
            <OrdersPage />
          </Layout>
        } />
        <Route path="/create-listing" element={
          <Layout>
            <CreateListing />
          </Layout>
        } />
        <Route path="/my-listings" element={
          <Layout>
            <MyListings />
          </Layout>
        } />
        <Route path="/agent/orders" element={
          <Layout>
            <AgentOrders />
          </Layout>
        } />
        <Route path="/invitation" element={
          <Layout>
            <InvitationCodePage />
          </Layout>
        } />
        <Route path="/ai-estimate" element={
          <Layout>
            <AIEstimatePage />
          </Layout>
        } />
        <Route path="/monitor" element={
          <Layout>
            <MonitorPage />
          </Layout>
        } />
        <Route path="/evidence" element={
          <Layout>
            <EvidencePage />
          </Layout>
        } />
        <Route path="/application" element={
          <Layout>
            <ApplicationPage />
          </Layout>
        } />
        <Route path="/wallet" element={
          <Layout>
            <WalletPage />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <SettingsPage />
          </Layout>
        } />
        <Route path="/analytics" element={
          <Layout>
            <AnalyticsPage />
          </Layout>
        } />
        <Route path="/sitemap" element={
          <Layout>
            <SitemapPage />
          </Layout>
        } />
        <Route path="/referral" element={
          <Layout>
            <ReferralPage />
          </Layout>
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;
