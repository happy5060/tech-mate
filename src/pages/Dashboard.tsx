import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PlusCircle,
  BookOpen,
  Clock,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight,
  Lightbulb,
  Edit3,
  Sliders,
  FolderOpen
} from 'lucide-react';
import { Lesson } from '../types/lesson';
import { lessonService } from '../services/api/lessonService';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface DashboardProps {
  dataVersion?: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ dataVersion }) => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, [dataVersion]);

  const loadLessons = async () => {
    setIsLoading(true);
    try {
      const data = await lessonService.getLessons({ sortBy: 'recent' });
      setLessons(data);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return <Badge variant="success" size="sm">Easy</Badge>;
      case 'Medium':
        return <Badge variant="brand" size="sm">Medium</Badge>;
      case 'Hard':
        return <Badge variant="warning" size="sm">Hard</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{difficulty}</Badge>;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Area */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-10 shadow-card">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/15 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Classroom Creator · Pedagogical Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Create a complete lesson in minutes.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Empower your teaching with Generative AI. Specify subject, topic, and learning outcomes to produce structured, 8-section classroom packages that you can review, adapt, and export for your students.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/create">
              <Button
                variant="primary"
                size="lg"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-md"
                leftIcon={<PlusCircle className="w-5 h-5" />}
              >
                + Create New Lesson
              </Button>
            </Link>

            <Link to="/history">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur"
              >
                Browse All Lessons ({lessons.length})
              </Button>
            </Link>
          </div>
        </div>

        {/* Subtle decorative background circles */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-64 h-64 rounded-full bg-purple-500/15 blur-2xl pointer-events-none" />
      </section>

      {/* How It Works Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            How it works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A three-step pedagogical workflow designed specifically for classroom educators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-subtle">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Define your lesson
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your subject, topic, grade level, time duration, and core learning objectives with tailored pedagogical style.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shadow-subtle">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Generate with AI
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generative AI constructs an 8-section pedagogical package complete with hands-on activities, discussion prompts, and diagnostics.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-subtle">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Review and adapt
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Refine content directly in the workspace, regenerate individual sections on demand, check objective alignment, and export printable handouts.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Lessons Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Recent Lessons
            </h2>
            <p className="text-xs text-slate-500">
              Your recently created and edited classroom packages
            </p>
          </div>

          {lessons.length > 0 && (
            <Link
              to="/history"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading your classroom lessons...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && lessons.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">
                No lessons created yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to prepare your first class? Use our Generative AI wizard to draft your first structured lesson in minutes.
              </p>
            </div>
            <Link to="/create">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                + Create Your First Lesson
              </Button>
            </Link>
          </div>
        )}

        {/* Lessons Grid */}
        {!isLoading && lessons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lessons.slice(0, 6).map((lesson) => (
              <Card
                key={lesson.id}
                hoverEffect
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                className="p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="brand" size="sm">
                      {lesson.subject}
                    </Badge>
                    {getDifficultyBadge(lesson.difficulty)}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {lesson.learningObjective}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lesson.classLevel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Updated {formatDate(lesson.updatedAt)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/workspace/${lesson.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/lesson/${lesson.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
