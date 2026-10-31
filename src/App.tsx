import React from 'react';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { Navbar } from './components/Navigation/Navbar';
import { Sidebar } from './components/Navigation/Sidebar';
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { ProfileView } from './views/ProfileView';
import { AssessmentView } from './views/AssessmentView';
import { ProjectsView } from './views/ProjectsView';
import { EvidenceMapView } from './views/EvidenceMapView';
import { PassportView } from './views/PassportView';
import { RecruiterView } from './views/RecruiterView';
import { SettingsView } from './views/SettingsView';

const AppContent: React.FC = () => {
  const { activeView } = useProfile();

  // Landing page has dedicated full-screen layout
  if (activeView === 'landing') {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <LandingView />
        </main>
      </div>
    );
  }

  // Dashboard & Workspaces layout with Sidebar
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans antialiased">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'profile' && <ProfileView />}
          {activeView === 'assessments' && <AssessmentView />}
          {activeView === 'projects' && <ProjectsView />}
          {activeView === 'evidence-map' && <EvidenceMapView />}
          {activeView === 'passport' && <PassportView />}
          {activeView === 'recruiter-view' && <RecruiterView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  );
}
