import { AppProvider, useApp } from './context/AppContext';
import { Dashboard } from './components/Dashboard';
import { ProfileInputForm } from './components/ProfileInputForm';
import './App.css';

function AppContent() {
  const { profile, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <p>Loading your profile…</p>
      </div>
    );
  }

  if (!profile) {
    return <ProfileInputForm mode="create" />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
