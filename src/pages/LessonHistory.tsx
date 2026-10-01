import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lesson,
  LessonFilterOptions
} from '../types/lesson';
import { lessonService } from '../services/api/lessonService';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  GraduationCap,
  Clock,
  Calendar,
  PlusCircle,
  FolderOpen,
  Trash2,
  Eye,
  Edit2,
  Printer,
  LayoutGrid,
  List
} from 'lucide-react';

interface LessonHistoryProps {
  dataVersion?: number;
  onLessonDeleted?: () => void;
}

export const LessonHistory: React.FC<LessonHistoryProps> = ({
  dataVersion,
  onLessonDeleted
}) => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'duration'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    fetchLessons();
  }, [searchQuery, selectedSubject, selectedClass, sortBy, dataVersion]);

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const data = await lessonService.getLessons({
        searchQuery,
        selectedSubject,
        selectedClass,
        sortBy
      });
      setLessons(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this lesson from your workspace?')) {
      const all = await lessonService.getLessons();
      const filtered = all.filter((l) => l.id !== id);
      localStorage.setItem('ai_classroom_lessons_v1', JSON.stringify(filtered));
      fetchLessons();
      if (onLessonDeleted) onLessonDeleted();
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

  // Distinct subjects & classes for filter menus
  const subjectsList = ['Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'History', 'English Literature', 'Computer Science'];
  const classesList = ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Lesson History & Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse, filter, edit, and export all generated classroom packages
          </p>
        </div>

        <Link to="/create">
          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            + New Lesson
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Subject Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {subjectsList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Classes</option>
              {classesList.map((cl) => (
                <option key={cl} value={cl}>
                  {cl}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="recent">Sort: Most Recent</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="duration">Sort: Duration</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="lg:col-span-1 flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid view"
              className={`p-2 rounded-lg border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'text-slate-400 hover:text-slate-600 border-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table view"
              className={`p-2 rounded-lg border transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'text-slate-400 hover:text-slate-600 border-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Badges Bar */}
        {(searchQuery || selectedSubject !== 'all' || selectedClass !== 'all') && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Active filters:</span>
            {searchQuery && (
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                "{searchQuery}"
              </span>
            )}
            {selectedSubject !== 'all' && (
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                {selectedSubject}
              </span>
            )}
            {selectedClass !== 'all' && (
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                {selectedClass}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setSelectedClass('all');
              }}
              className="text-xs text-indigo-600 hover:underline font-semibold ml-auto"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Filtering lessons...</p>
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
              No matching lessons found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No lesson packages matched your active search query or filter selection.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setSelectedClass('all');
              }}
            >
              Reset Filters
            </Button>
            <Link to="/create">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Create New Lesson
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Grid View */}
      {!isLoading && viewMode === 'grid' && lessons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lessons.map((lesson) => (
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

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
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
                    {formatDate(lesson.updatedAt)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/workspace/${lesson.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded"
                      title="Edit in Workspace"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(lesson.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      title="Delete Lesson"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      to={`/lesson/${lesson.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors"
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

      {/* Table View */}
      {!isLoading && viewMode === 'table' && lessons.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Title & Subject</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Difficulty</th>
                  <th className="py-3 px-3">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 leading-snug">
                        {lesson.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {lesson.subject} · {lesson.topic}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {lesson.classLevel}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {lesson.duration}
                    </td>
                    <td className="py-3 px-3">
                      {getDifficultyBadge(lesson.difficulty)}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {formatDate(lesson.updatedAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          to={`/workspace/${lesson.id}`}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded"
                          title="Edit Lesson"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(lesson.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          to={`/lesson/${lesson.id}`}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100"
                        >
                          Open
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
