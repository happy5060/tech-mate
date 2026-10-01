import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lesson } from '../types/lesson';
import { lessonService } from '../services/api/lessonService';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AlignmentPanel } from '../components/lesson/AlignmentPanel';
import {
  ArrowLeft,
  Edit2,
  Printer,
  FileDown,
  BookOpen,
  Target,
  FileText,
  Lightbulb,
  Users,
  MessageSquare,
  FileCheck2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const LessonView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadLesson(id);
    }
  }, [id]);

  const loadLesson = async (lessonId: string) => {
    setIsLoading(true);
    try {
      const data = await lessonService.getLesson(lessonId);
      if (data) {
        setLesson(data);
      } else {
        navigate('/history');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!lesson) return;
    lessonService.exportLesson(lesson.id, 'print');
  };

  const handleExportJson = () => {
    if (!lesson) return;
    lessonService.exportLesson(lesson.id, 'json');
  };

  const scrollToSection = (sectionKey: string) => {
    const el = document.getElementById(`view-section-${sectionKey}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading lesson view...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-base font-bold text-slate-800">Lesson not found</h2>
        <Link to="/history">
          <Button variant="primary" size="sm">Back to Lesson History</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar (no-print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              to="/history"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to History</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-600">
              Read-Only Lesson Handout
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              leftIcon={<FileDown className="w-3.5 h-3.5" />}
              className="hidden sm:inline-flex"
            >
              Download JSON
            </Button>
            <Link to={`/workspace/${lesson.id}`}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
              >
                Edit Lesson
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Printable Lesson Package Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 print-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="md">
              {lesson.subject}
            </Badge>
            <Badge variant="neutral" size="md">
              {lesson.classLevel}
            </Badge>
            <Badge variant="neutral" size="md">
              {lesson.duration}
            </Badge>
            <Badge
              variant={
                lesson.difficulty === 'Easy'
                  ? 'success'
                  : lesson.difficulty === 'Medium'
                  ? 'brand'
                  : 'warning'
              }
              size="md"
            >
              {lesson.difficulty}
            </Badge>
          </div>
          <div className="text-xs text-slate-500">
            Language: <strong className="text-slate-700">{lesson.language}</strong> · Style: <strong className="text-slate-700">{lesson.teachingStyle}</strong>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {lesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Topic Focus: <span className="font-semibold text-slate-700">{lesson.topic}</span>
          </p>
        </div>

        {/* Primary Learning Objective Box */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-xs sm:text-sm text-indigo-950">
          <span className="font-bold text-indigo-900 block mb-1">
            Primary Learning Objective:
          </span>
          <p className="leading-relaxed">{lesson.learningObjective}</p>
        </div>
      </div>

      {/* Main Layout: Sections on Left, Alignment on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sections Stream */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Introduction */}
          <div
            id="view-section-introduction"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 print-card"
          >
            <div className="flex items-center gap-2.5 text-indigo-700 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-base font-bold text-slate-900">
                1. Introduction & Curiosity Hook
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {lesson.content.introduction}
            </p>
          </div>

          {/* Section 2: Learning Objectives */}
          <div
            id="view-section-learningObjectives"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 print-card"
          >
            <div className="flex items-center gap-2.5 text-indigo-700 border-b border-slate-100 pb-3">
              <Target className="w-5 h-5" />
              <h2 className="text-base font-bold text-slate-900">
                2. Learning Objectives
              </h2>
            </div>
            <ul className="space-y-2.5">
              {lesson.content.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Concept Explanation */}
          <div
            id="view-section-conceptExplanation"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 print-card"
          >
            <div className="flex items-center gap-2.5 text-indigo-700 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5" />
              <h2 className="text-base font-bold text-slate-900">
                3. Concept Explanation
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {lesson.content.conceptExplanation}
            </div>
          </div>

          {/* Section 4: Examples */}
          <div
            id="view-section-examples"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 print-card"
          >
            <div className="flex items-center gap-2.5 text-indigo-700 border-b border-slate-100 pb-3">
              <Lightbulb className="w-5 h-5" />
              <h2 className="text-base font-bold text-slate-900">
                4. Real-World Case Examples
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.content.examples.map((ex, i) => (
                <div
                  key={ex.id || i}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {i + 1}. {ex.title}
                  </h4>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-700">Scenario: </strong>
                    {ex.scenario}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-700">Explanation: </strong>
                    {ex.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Classroom Activity */}
          <div
            id="view-section-classroomActivity"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 print-card"
          >
            <div className="flex items-center gap-2.5 text-indigo-700 border-b border-slate-100 pb-3">
              <Users className="w-5 h-5" />
              <h2 className="text-base font-bold text-slate-900">
                5. Classroom Activity
              </h2>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
              <h4 className="text-sm font-bold text-indigo-950">
                {lesson.content.classroomActivity.title}
              </h4>
              <span className="text-xs font-semibold text-indigo-700">
                {lesson.content.classroomActivity.durationMinutes} Minutes
              </span>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Materials Needed
              </h5>
              <div className="flex flex-wrap gap-2">
                {lesson.content.classroomActivity.materialsNeeded.map((mat, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Step-by-Step Instructions
              </h5>
              <ol className="space-y-2">
                {lesson.content.classroomActivity.stepByStepInstructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <span className="font-semibold block mb-0.5">Expected Outcome:</span>
              {lesson.content.classroomActivity.expectedOutcome}
            </div>
          </div>

          {/* Section 6: Discussion Questions */}
          <div
            id="view-section-discussionQuestions"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 print-card"
          >
            <div className="flex items-center gap-2.5 text-indigo-700 border-b border-slate-100 pb-3">
              <MessageSquare className="w-5 h-5" />
              <h2 className="text-base font-bold text-slate-900">
                6. Discussion & Inquiry Questions
              </h2>
            </div>
            <div className="space-y-3">
              {lesson.content.discussionQuestions.map((dq, i) => (
                <div key={dq.id || i} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">
                    Q{i + 1}: {dq.question}
                  </p>
                  <p className="text-xs text-slate-500">
                    <strong>Guidance: </strong>
                    {dq.facilitatorGuidance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Assessment */}
          <div
            id="view-section-assessment"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5 print-card"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 text-indigo-700">
                <FileCheck2 className="w-5 h-5" />
                <h2 className="text-base font-bold text-slate-900">
                  7. Assessment Questions
                </h2>
              </div>
              <Badge variant="brand" size="sm">
                {lesson.content.assessment.questions.length} Items
              </Badge>
            </div>

            <div className="text-xs text-slate-500 italic">
              {lesson.content.assessment.instructions}
            </div>

            <div className="space-y-4">
              {lesson.content.assessment.questions.map((q, i) => (
                <div key={q.id || i} className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {q.type}
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900">
                    {q.question}
                  </p>

                  {/* Options if MCQ */}
                  {q.type === 'MCQ' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                            opt === q.correctAnswer
                              ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{opt}</span>
                          {opt === q.correctAnswer && (
                            <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1 rounded ml-auto">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Answer / Rubric */}
                  {q.type !== 'MCQ' && (
                    <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1">
                      <div>
                        <strong className="text-slate-700">Correct / Model Answer: </strong>
                        <span className="text-slate-800">{q.correctAnswer}</span>
                      </div>
                      {q.rubric && (
                        <div>
                          <strong className="text-slate-700">Grading Rubric: </strong>
                          <span className="text-slate-600">{q.rubric}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Conclusion */}
          <div
            id="view-section-conclusion"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 print-card"
          >
            <div className="flex items-center gap-2.5 text-indigo-700 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-5 h-5" />
              <h2 className="text-base font-bold text-slate-900">
                8. Conclusion & Synthesis
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {lesson.content.conclusion}
            </p>
          </div>
        </div>

        {/* Sidebar: Alignment Panel (no-print) */}
        <div className="lg:col-span-4 space-y-6 no-print">
          <div className="sticky top-20 space-y-6">
            <AlignmentPanel
              lessonId={lesson.id}
              initialAlignments={lesson.alignments}
              onScrollToSection={scrollToSection}
            />

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Teacher Actions
              </h4>
              <div className="space-y-2">
                <Link to={`/workspace/${lesson.id}`} className="block">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    leftIcon={<Edit2 className="w-4 h-4" />}
                  >
                    Open in Editor
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handlePrint}
                  className="w-full"
                  leftIcon={<Printer className="w-4 h-4" />}
                >
                  Print Handout (PDF)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
