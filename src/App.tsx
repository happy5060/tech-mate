import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { CreateLesson } from './pages/CreateLesson';
import { LessonWorkspace } from './pages/LessonWorkspace';
import { LessonHistory } from './pages/LessonHistory';
import { LessonView } from './pages/LessonView';

export function App() {
  const [dataVersion, setDataVersion] = useState(0);

  const handleDataChanged = () => {
    setDataVersion((v) => v + 1);
  };

  return (
    <BrowserRouter>
      <AppLayout onDataReset={handleDataChanged}>
        <Routes>
          {/* 1. Dashboard */}
          <Route path="/" element={<Dashboard dataVersion={dataVersion} />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />

          {/* 2 & 3. Create Lesson & Generating State */}
          <Route
            path="/create"
            element={<CreateLesson onLessonCreated={handleDataChanged} />}
          />

          {/* 4. Lesson Workspace / Editor */}
          <Route
            path="/workspace/:id"
            element={<LessonWorkspace onLessonUpdated={handleDataChanged} />}
          />
          <Route
            path="/lesson/:id/edit"
            element={<LessonWorkspace onLessonUpdated={handleDataChanged} />}
          />

          {/* 5. Lesson History */}
          <Route
            path="/history"
            element={
              <LessonHistory
                dataVersion={dataVersion}
                onLessonDeleted={handleDataChanged}
              />
            }
          />

          {/* 6. Lesson View (Read-Only) */}
          <Route path="/lesson/:id" element={<LessonView />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
