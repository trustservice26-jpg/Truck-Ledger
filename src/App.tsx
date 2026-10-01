import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Profile } from './types';
import { AuthView } from './components/AuthView';
import { UserView } from './components/UserView';
import { AdminView } from './components/AdminView';
import { Header, AppTab } from './components/Header';
import { PdfGenerateView } from './components/PdfGenerateView';
import { MonthlyOverview } from './components/MonthlyOverview';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AppTab>('ledger');

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data);
        if (data.role === 'admin') {
          setActiveTab('admin');
        } else {
          setActiveTab('ledger');
        }
        // Log in login_history
        await supabase.from('login_history').insert({ user_id: userId });
      } else {
        console.warn('Profile not found:', error);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => {
      const currentSession = data?.session;
      setSession(currentSession);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: string, newSession: any) => {
        setSession(newSession);
        if (newSession?.user) {
          fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium">Loading FleetLedger...</span>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session || !profile) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Header with Menu Bar */}
      <Header
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onPrint={() => window.print()}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {profile.role === 'admin' && activeTab === 'admin' ? (
          <AdminView currentAdmin={profile} onLogout={handleLogout} />
        ) : activeTab === 'pdf' ? (
          <PdfGenerateView profile={profile} />
        ) : activeTab === 'overview' ? (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
            <MonthlyOverview userId={profile.id} vehicleNumber={profile.vehicle_number} />
          </div>
        ) : (
          <UserView
            profile={profile}
            activeTab="ledger"
            onNavigateToPdf={() => setActiveTab('pdf')}
            onNavigateToOverview={() => setActiveTab('overview')}
          />
        )}
      </main>
    </div>
  );
}
