import {
  Lesson,
  CreateLessonFormData,
  LessonSectionKey,
  SectionAlignment,
  LessonFilterOptions,
  GenerationStage,
  AssessmentQuestion
} from '../../types/lesson';
import { INITIAL_MOCK_LESSONS } from '../../data/mockLessons';

const STORAGE_KEY = 'ai_classroom_lessons_v1';

export const GENERATION_STAGES: GenerationStage[] = [
  {
    id: 'understanding',
    label: 'Understanding lesson requirements',
    description: 'Analyzing curriculum parameters, student level, and learning style...'
  },
  {
    id: 'objectives',
    label: 'Structuring learning objectives',
    description: 'Formulating measurable cognitive and skill-based outcomes using Bloom’s taxonomy...'
  },
  {
    id: 'content',
    label: 'Creating lesson content',
    description: 'Synthesizing core conceptual explanations, key definitions, and real-world examples...'
  },
  {
    id: 'activity',
    label: 'Designing classroom activity',
    description: 'Framing step-by-step collaborative tasks and probing discussion prompts...'
  },
  {
    id: 'assessment',
    label: 'Preparing assessment',
    description: 'Generating multi-format diagnostic items (MCQs, short answer, application checks)...'
  }
];

function getStoredLessons(): Lesson[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LESSONS));
      return INITIAL_MOCK_LESSONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_LESSONS;
  }
}

function saveStoredLessons(lessons: Lesson[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Service API abstraction layer.
 * Ready to be swapped with Supabase Edge Functions / Gemini API endpoints.
 */
export const lessonService = {
  /**
   * Fetch all lessons with optional filtering and sorting
   */
  async getLessons(filter?: Partial<LessonFilterOptions>): Promise<Lesson[]> {
    // Artificial small latency to simulate network call cleanly
    await new Promise((r) => setTimeout(r, 120));
    let lessons = getStoredLessons();

    if (filter?.searchQuery?.trim()) {
      const q = filter.searchQuery.toLowerCase();
      lessons = lessons.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.subject.toLowerCase().includes(q) ||
          l.topic.toLowerCase().includes(q)
      );
    }

    if (filter?.selectedSubject && filter.selectedSubject !== 'all') {
      lessons = lessons.filter(
        (l) => l.subject.toLowerCase() === filter.selectedSubject?.toLowerCase()
      );
    }

    if (filter?.selectedClass && filter.selectedClass !== 'all') {
      lessons = lessons.filter(
        (l) => l.classLevel.toLowerCase() === filter.selectedClass?.toLowerCase()
      );
    }

    if (filter?.sortBy) {
      if (filter.sortBy === 'recent') {
        lessons.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      } else if (filter.sortBy === 'title') {
        lessons.sort((a, b) => a.title.localeCompare(b.title));
      } else if (filter.sortBy === 'duration') {
        lessons.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
      }
    }

    return lessons;
  },

  /**
   * Fetch a single lesson by ID
   */
  async getLesson(id: string): Promise<Lesson | null> {
    await new Promise((r) => setTimeout(r, 100));
    const lessons = getStoredLessons();
    const found = lessons.find((l) => l.id === id);
    return found || null;
  },

  /**
   * Create an initial blank lesson envelope
   */
  async createLesson(formData: CreateLessonFormData): Promise<Lesson> {
    await new Promise((r) => setTimeout(r, 150));
    const id = `lesson-${Date.now()}`;
    const now = new Date().toISOString();

    const newLesson: Lesson = {
      id,
      title: `${formData.subject}: ${formData.topic}`,
      subject: formData.subject,
      topic: formData.topic,
      classLevel: formData.classLevel,
      duration: formData.duration,
      learningObjective: formData.learningObjective,
      teachingStyle: formData.teachingStyle,
      difficulty: formData.difficulty,
      language: formData.language,
      createdAt: now,
      updatedAt: now,
      alignments: [
        { sectionKey: 'introduction', sectionTitle: 'Introduction', status: 'aligned', note: 'Contextualizes target topic with student interest hook.' },
        { sectionKey: 'learningObjectives', sectionTitle: 'Learning Objectives', status: 'aligned', note: 'Explicitly aligned with input parameters.' },
        { sectionKey: 'conceptExplanation', sectionTitle: 'Concept Explanation', status: 'aligned', note: 'Core principles broken down step-by-step.' },
        { sectionKey: 'examples', sectionTitle: 'Examples', status: 'aligned', note: 'Realistic contextual situations.' },
        { sectionKey: 'classroomActivity', sectionTitle: 'Classroom Activity', status: 'aligned', note: 'Active engagement matching duration and style.' },
        { sectionKey: 'discussionQuestions', sectionTitle: 'Discussion Questions', status: 'aligned', note: 'Facilitates critical thinking.' },
        { sectionKey: 'assessment', sectionTitle: 'Assessment', status: 'aligned', note: 'Diagnostic evaluation covering recall and application.' },
        { sectionKey: 'conclusion', sectionTitle: 'Conclusion', status: 'aligned', note: 'Synthesizes key takeaways.' }
      ],
      content: {
        introduction: `Welcome to our session on ${formData.topic}. Today we will explore this foundational topic in ${formData.subject}, tailored specifically for ${formData.classLevel} students using a ${formData.teachingStyle.toLowerCase()} approach.`,
        learningObjectives: [
          `Articulate the core principles and definitions of ${formData.topic}.`,
          `Analyze practical scenarios illustrating ${formData.topic} in daily applications.`,
          `Demonstrate mastery through guided problem solving and peer discussion.`
        ],
        conceptExplanation: `Core Overview of ${formData.topic}:\n\n1. Foundational Concept: In ${formData.subject}, ${formData.topic} represents a crucial building block. Key definitions, underlying mechanisms, and standard scientific/academic notations provide the baseline understanding.\n\n2. Deeper Mechanics: When examining ${formData.topic}, we observe patterns and interactions that allow us to predict outcomes and model real phenomena systematically.`,
        examples: [
          {
            id: `ex-${Date.now()}-1`,
            title: `Practical Demonstration: ${formData.topic} in Action`,
            scenario: `Observing how ${formData.topic} behaves under standard test conditions.`,
            explanation: `Notice how the core principles predict the outcome directly, confirming theoretical assumptions.`
          },
          {
            id: `ex-${Date.now()}-2`,
            title: `Real-World Application`,
            scenario: `Everyday relevance in industry or daily human experience.`,
            explanation: `Understanding this allows us to engineer better solutions and solve complex challenges.`
          }
        ],
        classroomActivity: {
          title: `Collaborative Exploration: ${formData.topic}`,
          durationMinutes: Math.min(20, parseInt(formData.duration) / 2),
          materialsNeeded: [
            'Student notebooks or digital worksheets',
            'Colored markers / sticky notes',
            'Reference handout cards'
          ],
          stepByStepInstructions: [
            'Form small collaborative teams of 3 to 4 students.',
            `Review the primary case problem involving ${formData.topic}.`,
            'Formulate a team hypothesis and document key reasoning on paper or whiteboard.',
            'Share findings with the wider classroom in a 3-minute synthesis lightning round.'
          ],
          expectedOutcome:
            'Students gain direct, participatory confidence applying concepts collaboratively.'
        },
        discussionQuestions: [
          {
            id: `dq-${Date.now()}-1`,
            question: `How does our understanding of ${formData.topic} challenge common misconceptions?`,
            facilitatorGuidance:
              'Guide students to identify intuitive cognitive biases versus systematic evidence.'
          },
          {
            id: `dq-${Date.now()}-2`,
            question: `In what ways might advances in technology change how we approach ${formData.topic} over the next decade?`,
            facilitatorGuidance:
              'Encourage forward-looking critical synthesis connecting theory to modern innovation.'
          }
        ],
        assessment: {
          instructions:
            'Answer the following multi-format questions to evaluate conceptual and applied mastery.',
          questions: [
            {
              id: `q-${Date.now()}-1`,
              type: 'MCQ',
              question: `Which of the following is the most accurate definition of the core phenomenon in ${formData.topic}?`,
              options: [
                'The primary governing mechanism that drives the system equilibrium',
                'An accidental secondary effect with negligible consequence',
                'A static variable that never interacts with external forces',
                'A temporary anomaly only observed in isolated laboratory environments'
              ],
              correctAnswer: 'The primary governing mechanism that drives the system equilibrium',
              explanation: 'This captures the fundamental principle introduced in today’s concept overview.'
            },
            {
              id: `q-${Date.now()}-2`,
              type: 'True / False',
              question: `The principles of ${formData.topic} apply universally regardless of initial boundary conditions.`,
              options: ['True', 'False'],
              correctAnswer: 'False',
              explanation: 'Specific environmental and system constraints always influence the behavioral outcome.'
            },
            {
              id: `q-${Date.now()}-3`,
              type: 'Short Answer',
              question: `Briefly summarize how the primary objective ("${formData.learningObjective.slice(0, 80)}...") is achieved through today's examples.`,
              correctAnswer: 'By demonstrating the theoretical principles across both controlled and applied examples, students observe direct cause-and-effect relationships.',
              rubric: 'Full credit for clearly linking theoretical concept to real-world demonstration.'
            },
            {
              id: `q-${Date.now()}-4`,
              type: 'Application Based',
              question: `Given a novel scenario in ${formData.subject}, describe step-by-step how you would apply ${formData.topic} to diagnose and solve the problem.`,
              correctAnswer: 'Step 1: Identify given variables and boundary parameters. Step 2: Apply the governing formula or rule. Step 3: Verify the predicted result against empirical constraints.',
              rubric: 'Evaluate systematic methodology, logical progression, and conceptual accuracy.'
            }
          ]
        },
        conclusion: `In this lesson, we established a firm understanding of ${formData.topic}, bridged theory with tangible demonstrations, and practiced diagnostic problem-solving. This knowledge serves as an essential springboard for our next module.`
      }
    };

    const lessons = getStoredLessons();
    lessons.unshift(newLesson);
    saveStoredLessons(lessons);

    return newLesson;
  },

  /**
   * Generates a lesson with simulated multi-stage progress callbacks
   */
  async generateLesson(
    formData: CreateLessonFormData,
    onStageChange?: (stage: GenerationStage) => void
  ): Promise<Lesson> {
    for (let i = 0; i < GENERATION_STAGES.length; i++) {
      if (onStageChange) {
        onStageChange(GENERATION_STAGES[i]);
      }
      // Meaningful brief pause per stage for a delightful visual experience
      await new Promise((r) => setTimeout(r, 700));
    }

    return await this.createLesson(formData);
  },

  /**
   * Regenerate a single section in isolation
   */
  async regenerateSection(
    lessonId: string,
    sectionKey: LessonSectionKey
  ): Promise<{ sectionKey: LessonSectionKey; newContent: any }> {
    // Isolated operation simulation
    await new Promise((r) => setTimeout(r, 1100));
    const lesson = await this.getLesson(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    const timestamp = new Date().toLocaleTimeString();

    let updatedSectionData: any;

    switch (sectionKey) {
      case 'introduction':
        updatedSectionData = `[Freshly Regenerated ${timestamp}] Imagine stepping into an interactive laboratory where ${lesson.topic} unfolds in vivid detail. This refreshed introduction highlights how ${lesson.subject} connects deeply to modern problem solving for ${lesson.classLevel} students.`;
        break;
      case 'learningObjectives':
        updatedSectionData = [
          `[Updated] Clearly define and explain the fundamental mechanisms of ${lesson.topic}.`,
          `[Updated] Formulate predictive hypotheses based on real-world observations in ${lesson.subject}.`,
          `[Updated] Critically assess multiple viewpoints and experimental evidence with confidence.`
        ];
        break;
      case 'conceptExplanation':
        updatedSectionData = `[Freshly Regenerated Concept Analysis - ${timestamp}]\n\n1. Deep Dive Breakdown: The core behavior of ${lesson.topic} revolves around primary interactions governed by the fundamental rules of ${lesson.subject}.\n\n2. Analytical Perspective: By examining variables systematically, students can dismantle complex scenarios into manageable parts.\n\n3. Common Pitfalls: Watch for common misinterpretations where students confuse correlation with causation in this context.`;
        break;
      case 'examples':
        updatedSectionData = [
          {
            id: `ex-regen-1`,
            title: `Alternative Real-World Case: Industrial Application of ${lesson.topic}`,
            scenario: `Modern commercial facilities leveraging ${lesson.topic} to optimize throughput.`,
            explanation: `Demonstrates scalability and cost efficiency in applied ${lesson.subject}.`
          },
          {
            id: `ex-regen-2`,
            title: `Historical Breakthrough Case`,
            scenario: `The original discovery that altered our understanding of ${lesson.topic}.`,
            explanation: `Provides vital epistemological context showing how science progresses iteratively.`
          }
        ];
        break;
      case 'classroomActivity':
        updatedSectionData = {
          title: `Refreshed Active Challenge: Hands-On ${lesson.topic}`,
          durationMinutes: 15,
          materialsNeeded: [
            'Student activity sheets',
            'Diagnostic cards',
            'Collaborative board markers'
          ],
          stepByStepInstructions: [
            'Pair up students to examine a contrasting counter-example.',
            'Draft a 3-point explanation identifying the key difference in variables.',
            'Exchange peer reviews with the neighboring pair.',
            'Conclude with a whole-group consensus definition.'
          ],
          expectedOutcome:
            'Deepened conceptual retention through peer debate and rapid argumentation.'
        };
        break;
      case 'discussionQuestions':
        updatedSectionData = [
          {
            id: `dq-regen-1`,
            question: `What would occur if one of the central conditions of ${lesson.topic} was suddenly removed?`,
            facilitatorGuidance:
              'Push students to reason from first principles rather than memorized outcomes.'
          },
          {
            id: `dq-regen-2`,
            question: `Why is this concept frequently tested in national entrance examinations?`,
            facilitatorGuidance:
              'Discuss the multidisciplinary nature of this topic across diverse fields.'
          }
        ];
        break;
      case 'assessment':
        updatedSectionData = {
          instructions:
            'Refreshed diagnostic assessment with updated questions across multiple cognitive levels.',
          questions: [
            {
              id: `q-regen-1`,
              type: 'MCQ' as const,
              question: `In the context of ${lesson.topic}, which parameter exhibits the strongest direct correlation?`,
              options: [
                'Primary input variable under standard temperature',
                'Secondary environmental disturbance',
                'Unrelated background noise',
                'Transient random fluctuations'
              ],
              correctAnswer: 'Primary input variable under standard temperature',
              explanation: 'Refreshed answer based on calibrated rubric.'
            },
            {
              id: `q-regen-2`,
              type: 'Short Answer' as const,
              question: `Explain how the updated examples reinforce the core learning objective of this session.`,
              correctAnswer: 'They demonstrate boundary cases and illustrate resilience under variable conditions.',
              rubric: 'Award full marks for clear mention of variable conditions.'
            }
          ]
        };
        break;
      case 'conclusion':
        updatedSectionData = `[Refreshed Synthesis ${timestamp}] We have synthesized the essential pillars of ${lesson.topic}, tested our reasoning with new diagnostic prompts, and built a solid bridge to the upcoming unit. Excellent work, class!`;
        break;
      default:
        updatedSectionData = lesson.content[sectionKey];
    }

    // Save update to storage
    const allLessons = getStoredLessons();
    const targetIdx = allLessons.findIndex((l) => l.id === lessonId);
    if (targetIdx !== -1) {
      (allLessons[targetIdx].content as any)[sectionKey] = updatedSectionData;
      allLessons[targetIdx].updatedAt = new Date().toISOString();
      saveStoredLessons(allLessons);
    }

    return { sectionKey, newContent: updatedSectionData };
  },

  /**
   * Update full lesson state
   */
  async saveLesson(lesson: Lesson): Promise<Lesson> {
    await new Promise((r) => setTimeout(r, 180));
    const all = getStoredLessons();
    const idx = all.findIndex((l) => l.id === lesson.id);
    const updated = {
      ...lesson,
      updatedAt: new Date().toISOString()
    };
    if (idx !== -1) {
      all[idx] = updated;
    } else {
      all.unshift(updated);
    }
    saveStoredLessons(all);
    return updated;
  },

  /**
   * Partially update lesson properties
   */
  async updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson> {
    const lesson = await this.getLesson(id);
    if (!lesson) throw new Error('Lesson not found');
    const merged: Lesson = {
      ...lesson,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return await this.saveLesson(merged);
  },

  /**
   * Check alignment of all sections with the lesson objectives
   */
  async checkAlignment(lessonId: string): Promise<SectionAlignment[]> {
    await new Promise((r) => setTimeout(r, 200));
    const lesson = await this.getLesson(lessonId);
    if (!lesson) return [];
    return lesson.alignments;
  },

  /**
   * Export lesson: trigger print dialog for teacher handout or download JSON
   */
  async exportLesson(lessonId: string, format: 'print' | 'json'): Promise<void> {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) return;

    if (format === 'print') {
      window.print();
    } else if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lesson, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${lesson.title.replace(/\s+/g, '_')}_package.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  },

  /**
   * Reset to initial sample data for test & demo convenience
   */
  resetToSampleData(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LESSONS));
  },

  /**
   * Clear all lessons to test empty states
   */
  clearAllLessons(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};
