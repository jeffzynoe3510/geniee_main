'use client';

import { useMentalHealth } from '@/hooks/useMentalHealth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoodLevel, RatingLevel } from '@/types/mental-health';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface Activity {
  id: string;
  name: string;
  category: string;
}

interface Trigger {
  id: string;
  name: string;
  category: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
}

interface MoodPattern {
  id: string;
  title: string;
  description: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  activities: string[];
  triggers: string[];
}

function MentalHealthContent() {
  const router = useRouter();
  const {
    state,
    setState,
    loadMoodLogs,
    loadRecommendations,
    loadInsights,
    logMood,
    generateInsights
  } = useMentalHealth();

  const [isLogging, setIsLogging] = useState(false);
  const [mood, setMood] = useState<MoodLevel>('neutral');
  const [energy, setEnergy] = useState<RatingLevel>(3);
  const [stress, setStress] = useState<RatingLevel>(3);
  const [anxiety, setAnxiety] = useState<RatingLevel>(3);
  const [sleep, setSleep] = useState<RatingLevel>(3);
  const [notes, setNotes] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [activityCategory, setActivityCategory] = useState('general');
  const [triggerCategory, setTriggerCategory] = useState('general');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [moodPatterns, setMoodPatterns] = useState<MoodPattern[]>([]);
  const [showGoals, setShowGoals] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'general',
    target: 0,
    current: 0,
    unit: '',
    deadline: undefined as Date | undefined
  });

  const commonActivities: Activity[] = [
    { id: '1', name: 'Exercise', category: 'physical' },
    { id: '2', name: 'Meditation', category: 'mental' },
    { id: '3', name: 'Reading', category: 'mental' },
    { id: '4', name: 'Socializing', category: 'social' },
    { id: '5', name: 'Work', category: 'professional' },
    { id: '6', name: 'Hobbies', category: 'leisure' },
  ];

  const commonTriggers: Trigger[] = [
    { id: '1', name: 'Work Stress', category: 'professional' },
    { id: '2', name: 'Social Anxiety', category: 'social' },
    { id: '3', name: 'Sleep Issues', category: 'physical' },
    { id: '4', name: 'Financial Worries', category: 'personal' },
    { id: '5', name: 'Health Concerns', category: 'physical' },
    { id: '6', name: 'Relationship Issues', category: 'social' },
  ];

  useEffect(() => {
    loadMoodLogs();
    loadRecommendations();
    loadInsights();
  }, [loadMoodLogs, loadRecommendations, loadInsights]);

  const handleLogMood = async () => {
    await logMood(mood, energy, stress, anxiety, sleep, notes, selectedActivities, selectedTriggers);
    setIsLogging(false);
    setMood('neutral');
    setEnergy(3);
    setStress(3);
    setAnxiety(3);
    setSleep(3);
    setNotes('');
    setSelectedActivities([]);
    setSelectedTriggers([]);
  };

  const handleGenerateInsights = async () => {
    await generateInsights();
  };

  const addActivity = () => {
    if (newActivity.trim()) {
      const activity: Activity = {
        id: Date.now().toString(),
        name: newActivity.trim(),
        category: activityCategory,
      };
      commonActivities.push(activity);
      setNewActivity('');
    }
  };

  const addTrigger = () => {
    if (newTrigger.trim()) {
      const trigger: Trigger = {
        id: Date.now().toString(),
        name: newTrigger.trim(),
        category: triggerCategory,
      };
      commonTriggers.push(trigger);
      setNewTrigger('');
    }
  };

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const toggleTrigger = (triggerId: string) => {
    setSelectedTriggers(prev =>
      prev.includes(triggerId)
        ? prev.filter(id => id !== triggerId)
        : [...prev, triggerId]
    );
  };

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal: Goal = {
        id: Date.now().toString(),
        ...newGoal
      };
      setGoals(prev => [...prev, goal]);
      setNewGoal({
        title: '',
        description: '',
        category: 'general',
        target: 0,
        current: 0,
        unit: '',
        deadline: undefined
      });
    }
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: Math.min(goal.target, Math.max(0, progress)) }
        : goal
    ));
  };

  const detectMoodPatterns = () => {
    // Analyze mood logs to detect patterns
    const patterns: MoodPattern[] = [];
    const moodLogs = state.moodLogs;

    // Group logs by activities and triggers
    const activityGroups = new Map<string, { count: number; moods: string[] }>();
    const triggerGroups = new Map<string, { count: number; moods: string[] }>();

    moodLogs.forEach(log => {
      log.activities?.forEach(activity => {
        const group = activityGroups.get(activity) || { count: 0, moods: [] };
        group.count++;
        group.moods.push(log.mood);
        activityGroups.set(activity, group);
      });

      log.triggers?.forEach(trigger => {
        const group = triggerGroups.get(trigger) || { count: 0, moods: [] };
        group.count++;
        group.moods.push(log.mood);
        triggerGroups.set(trigger, group);
      });
    });

    // Create patterns based on frequency and mood impact
    activityGroups.forEach((group, activity) => {
      if (group.count >= 3) {
        const positiveMoods = group.moods.filter(m => m === 'very_happy' || m === 'happy').length;
        const negativeMoods = group.moods.filter(m => m === 'sad' || m === 'very_sad').length;
        
        patterns.push({
          id: Date.now().toString(),
          title: `Activity Pattern: ${activity}`,
          description: `This activity appears ${group.count} times in your logs`,
          frequency: group.count,
          impact: positiveMoods > negativeMoods ? 'positive' : negativeMoods > positiveMoods ? 'negative' : 'neutral',
          activities: [activity],
          triggers: []
        });
      }
    });

    triggerGroups.forEach((group, trigger) => {
      if (group.count >= 3) {
        const positiveMoods = group.moods.filter(m => m === 'very_happy' || m === 'happy').length;
        const negativeMoods = group.moods.filter(m => m === 'sad' || m === 'very_sad').length;
        
        patterns.push({
          id: Date.now().toString(),
          title: `Trigger Pattern: ${trigger}`,
          description: `This trigger appears ${group.count} times in your logs`,
          frequency: group.count,
          impact: positiveMoods > negativeMoods ? 'positive' : negativeMoods > positiveMoods ? 'negative' : 'neutral',
          activities: [],
          triggers: [trigger]
        });
      }
    });

    setMoodPatterns(patterns);
  };

  useEffect(() => {
    detectMoodPatterns();
  }, [state.moodLogs]);

  if (state.loading && !state.moodLogs.length && !state.recommendations.length && !state.insights.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <LoadingSpinner size="lg" color="primary" message="Loading mental health data..." />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-4 bg-black min-h-screen">
        <ErrorMessage
          message={state.error}
          onRetry={() => {
            setState(prev => ({ ...prev, error: null }));
            loadMoodLogs();
            loadRecommendations();
            loadInsights();
          }}
          variant="danger"
          className="max-w-2xl mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Navigation Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-[#333]">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-white hover:text-[#357AFF] transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          <span>Back to Home</span>
        </button>
        <h1 className="text-xl font-semibold text-white">Mental Health Support</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowPatterns(!showPatterns)}
            className="text-white hover:text-[#357AFF] transition-colors"
          >
            <i className="fas fa-chart-line text-xl"></i>
          </button>
          <button
            onClick={() => setShowGoals(!showGoals)}
            className="text-white hover:text-[#357AFF] transition-colors"
          >
            <i className="fas fa-bullseye text-xl"></i>
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-white hover:text-[#357AFF] transition-colors"
          >
            <i className="fas fa-history text-xl"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mood Logging Panel */}
        <div className="w-1/3 bg-[#1A1A1A] border-r border-[#333] p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Mood Tracking</h2>
            <button
              onClick={() => setIsLogging(true)}
              className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2B5FCC] transition-colors"
            >
              Log Mood
            </button>
          </div>

          {isLogging ? (
            <div className="bg-[#2A2A2A] p-4 rounded-lg mb-4">
              <h3 className="text-white font-semibold mb-4">Log Your Mood</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Mood</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['very_happy', 'happy', 'neutral', 'sad', 'very_sad'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m as MoodLevel)}
                        className={`p-2 rounded-lg text-center transition-colors ${
                          mood === m
                            ? 'bg-[#357AFF] text-white'
                            : 'bg-[#333] text-gray-400 hover:bg-[#444]'
                        }`}
                      >
                        <i className={`fas fa-${m === 'very_happy' ? 'laugh' : m === 'happy' ? 'smile' : m === 'neutral' ? 'meh' : m === 'sad' ? 'frown' : 'sad-tear'} text-xl`}></i>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Energy Level</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={energy}
                      onChange={(e) => setEnergy(Number(e.target.value) as RatingLevel)}
                      className="flex-1"
                    />
                    <span className="text-white w-8 text-center">{energy}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Stress Level</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={stress}
                      onChange={(e) => setStress(Number(e.target.value) as RatingLevel)}
                      className="flex-1"
                    />
                    <span className="text-white w-8 text-center">{stress}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Anxiety Level</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={anxiety}
                      onChange={(e) => setAnxiety(Number(e.target.value) as RatingLevel)}
                      className="flex-1"
                    />
                    <span className="text-white w-8 text-center">{anxiety}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Sleep Quality</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={sleep}
                      onChange={(e) => setSleep(Number(e.target.value) as RatingLevel)}
                      className="flex-1"
                    />
                    <span className="text-white w-8 text-center">{sleep}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Activities</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        placeholder="Add new activity..."
                        className="flex-1 bg-[#333] text-white p-2 rounded"
                      />
                      <select
                        value={activityCategory}
                        onChange={(e) => setActivityCategory(e.target.value)}
                        className="bg-[#333] text-white p-2 rounded"
                      >
                        <option value="general">General</option>
                        <option value="physical">Physical</option>
                        <option value="mental">Mental</option>
                        <option value="social">Social</option>
                        <option value="professional">Professional</option>
                        <option value="leisure">Leisure</option>
                      </select>
                      <button
                        onClick={addActivity}
                        className="bg-[#357AFF] text-white px-3 rounded hover:bg-[#2B5FCC] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {commonActivities.map((activity) => (
                        <button
                          key={activity.id}
                          onClick={() => toggleActivity(activity.id)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedActivities.includes(activity.id)
                              ? 'bg-[#357AFF] text-white'
                              : 'bg-[#333] text-gray-400 hover:bg-[#444]'
                          }`}
                        >
                          {activity.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Triggers</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTrigger}
                        onChange={(e) => setNewTrigger(e.target.value)}
                        placeholder="Add new trigger..."
                        className="flex-1 bg-[#333] text-white p-2 rounded"
                      />
                      <select
                        value={triggerCategory}
                        onChange={(e) => setTriggerCategory(e.target.value)}
                        className="bg-[#333] text-white p-2 rounded"
                      >
                        <option value="general">General</option>
                        <option value="professional">Professional</option>
                        <option value="social">Social</option>
                        <option value="physical">Physical</option>
                        <option value="personal">Personal</option>
                      </select>
                      <button
                        onClick={addTrigger}
                        className="bg-[#357AFF] text-white px-3 rounded hover:bg-[#2B5FCC] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {commonTriggers.map((trigger) => (
                        <button
                          key={trigger.id}
                          onClick={() => toggleTrigger(trigger.id)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTriggers.includes(trigger.id)
                              ? 'bg-[#357AFF] text-white'
                              : 'bg-[#333] text-gray-400 hover:bg-[#444]'
                          }`}
                        >
                          {trigger.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                    rows={3}
                    placeholder="How are you feeling today?"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsLogging(false)}
                    className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogMood}
                    disabled={state.loading}
                    className="bg-[#357AFF] text-white px-4 py-2 rounded hover:bg-[#2B5FCC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {state.loading ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" color="white" className="mr-2" />
                        Saving...
                      </div>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {state.loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" color="white" />
            </div>
          ) : (
            <div className="space-y-3">
              {state.moodLogs.map((log) => (
                <div key={log.id} className="bg-[#2A2A2A] text-white p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                    <span className="text-sm">
                      <i className={`fas fa-${log.mood === 'very_happy' ? 'laugh' : log.mood === 'happy' ? 'smile' : log.mood === 'neutral' ? 'meh' : log.mood === 'sad' ? 'frown' : 'sad-tear'} mr-1`}></i>
                      {log.mood.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Energy: {log.energy} | Stress: {log.stress} | Anxiety: {log.anxiety} | Sleep: {log.sleep}
                  </div>
                  {log.activities && log.activities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {log.activities.map((activity) => (
                        <span key={activity} className="px-2 py-1 bg-[#357AFF] text-white text-xs rounded-full">
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}
                  {log.triggers && log.triggers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {log.triggers.map((trigger) => (
                        <span key={trigger} className="px-2 py-1 bg-[#FF3B30] text-white text-xs rounded-full">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  )}
                  {log.notes && (
                    <p className="text-sm text-gray-400 mt-2">{log.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations & Insights Panel */}
        <div className="flex-1 bg-[#1A1A1A] p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Recommendations & Insights</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleGenerateInsights}
                disabled={state.loading || state.isAnalyzing}
                className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2B5FCC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.loading || state.isAnalyzing ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                    Analyzing...
                  </div>
                ) : (
                  'Generate Insights'
                )}
              </button>
            </div>
          </div>

          {state.loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" color="white" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Goals Summary */}
              <div className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Goals Progress</h3>
                <div className="space-y-3">
                  {goals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="border-t border-[#333] pt-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{goal.title}</h4>
                        <span className="text-sm text-gray-400">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-[#333] rounded-full h-2 mt-2">
                        <div
                          className="bg-[#357AFF] h-2 rounded-full"
                          style={{ width: `${(goal.current / goal.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  {goals.length > 3 && (
                    <button
                      onClick={() => setShowGoals(true)}
                      className="text-[#357AFF] hover:text-[#2563EB] transition-colors"
                    >
                      View all goals
                    </button>
                  )}
                </div>
              </div>

              {/* Mood Patterns */}
              <div className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Mood Patterns</h3>
                <div className="space-y-3">
                  {moodPatterns.slice(0, 3).map((pattern) => (
                    <div key={pattern.id} className="border-t border-[#333] pt-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{pattern.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          pattern.impact === 'positive' ? 'bg-green-500' :
                          pattern.impact === 'negative' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}>
                          {pattern.impact}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{pattern.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {pattern.activities.map((activity) => (
                          <span key={activity} className="px-2 py-1 bg-[#357AFF] text-white text-xs rounded-full">
                            {activity}
                          </span>
                        ))}
                        {pattern.triggers.map((trigger) => (
                          <span key={trigger} className="px-2 py-1 bg-[#FF3B30] text-white text-xs rounded-full">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {moodPatterns.length > 3 && (
                    <button
                      onClick={() => setShowPatterns(true)}
                      className="text-[#357AFF] hover:text-[#2563EB] transition-colors"
                    >
                      View all patterns
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <div className="space-y-3">
                  {state.recommendations.map((rec) => (
                    <div key={rec.id} className="border-t border-[#333] pt-3">
                      <h4 className="font-semibold">{rec.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                      <div className="text-sm text-gray-400 mt-1">
                        Priority: {rec.priority} | Type: {rec.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Insights</h3>
                <div className="space-y-3">
                  {state.insights.map((insight) => (
                    <div key={insight.id} className="border-t border-[#333] pt-3">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{insight.description}</p>
                      <div className="mt-2">
                        {/* In a real app, render charts/graphs here */}
                        <div className="text-sm text-gray-400">
                          {insight.data.labels.join(' | ')}
                        </div>
                        <div className="text-sm text-gray-400">
                          {insight.data.values.join(' | ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Goals Panel */}
      {showGoals && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-xl border border-[#333] shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Goals</h2>
                <button
                  onClick={() => setShowGoals(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">Add New Goal</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Goal title"
                      className="w-full bg-[#333] text-white p-2 rounded"
                    />
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Goal description"
                      className="w-full bg-[#333] text-white p-2 rounded"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={newGoal.category}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                        className="bg-[#333] text-white p-2 rounded"
                      >
                        <option value="general">General</option>
                        <option value="physical">Physical</option>
                        <option value="mental">Mental</option>
                        <option value="social">Social</option>
                        <option value="professional">Professional</option>
                      </select>
                      <input
                        type="text"
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                        placeholder="Unit (e.g., minutes, times)"
                        className="bg-[#333] text-white p-2 rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Target</label>
                        <input
                          type="number"
                          value={newGoal.target}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                          className="w-full bg-[#333] text-white p-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Current</label>
                        <input
                          type="number"
                          value={newGoal.current}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, current: Number(e.target.value) }))}
                          className="w-full bg-[#333] text-white p-2 rounded"
                        />
                      </div>
                    </div>
                    <button
                      onClick={addGoal}
                      className="w-full bg-[#357AFF] text-white py-2 rounded hover:bg-[#2563EB] transition-colors"
                    >
                      Add Goal
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div key={goal.id} className="bg-[#2a2a2a] p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-[#357AFF]">{goal.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{goal.description}</p>
                        </div>
                        <span className="text-sm text-gray-400">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-[#333] rounded-full h-2 mt-2">
                        <div
                          className="bg-[#357AFF] h-2 rounded-full"
                          style={{ width: `${(goal.current / goal.target) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm text-gray-400 mb-1">Update Progress</label>
                        <input
                          type="range"
                          min="0"
                          max={goal.target}
                          value={goal.current}
                          onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patterns Panel */}
      {showPatterns && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-xl border border-[#333] shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Mood Patterns</h2>
                <button
                  onClick={() => setShowPatterns(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              {moodPatterns.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No patterns detected yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {moodPatterns.map((pattern) => (
                    <div
                      key={pattern.id}
                      className="bg-[#2a2a2a] rounded-lg p-4 border border-[#333]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-[#357AFF]">{pattern.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          pattern.impact === 'positive' ? 'bg-green-500' :
                          pattern.impact === 'negative' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}>
                          {pattern.impact}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{pattern.description}</p>
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {pattern.activities.map((activity) => (
                            <span key={activity} className="px-2 py-1 bg-[#357AFF] text-white text-xs rounded-full">
                              {activity}
                            </span>
                          ))}
                          {pattern.triggers.map((trigger) => (
                            <span key={trigger} className="px-2 py-1 bg-[#FF3B30] text-white text-xs rounded-full">
                              {trigger}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-400">
                        Frequency: {pattern.frequency} times
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-xl border border-[#333] shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Mood History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              {state.moodLogs.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No mood logs found.</p>
              ) : (
                <div className="space-y-4">
                  {state.moodLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-[#2a2a2a] rounded-lg p-4 border border-[#333]"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-[#357AFF]">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </h3>
                          <div className="flex items-center mt-1">
                            <i className={`fas fa-${log.mood === 'very_happy' ? 'laugh' : log.mood === 'happy' ? 'smile' : log.mood === 'neutral' ? 'meh' : log.mood === 'sad' ? 'frown' : 'sad-tear'} mr-2 text-[#357AFF]`}></i>
                            <span className="text-white">{log.mood.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            Energy: {log.energy}/5
                          </div>
                          <div className="text-sm text-gray-400">
                            Stress: {log.stress}/5
                          </div>
                          <div className="text-sm text-gray-400">
                            Anxiety: {log.anxiety}/5
                          </div>
                          <div className="text-sm text-gray-400">
                            Sleep: {log.sleep}/5
                          </div>
                        </div>
                      </div>
                      {log.activities && log.activities.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Activities</h4>
                          <div className="flex flex-wrap gap-1">
                            {log.activities.map((activity) => (
                              <span key={activity} className="px-2 py-1 bg-[#357AFF] text-white text-xs rounded-full">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {log.triggers && log.triggers.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Triggers</h4>
                          <div className="flex flex-wrap gap-1">
                            {log.triggers.map((trigger) => (
                              <span key={trigger} className="px-2 py-1 bg-[#FF3B30] text-white text-xs rounded-full">
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {log.notes && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Notes</h4>
                          <p className="text-sm text-gray-300">{log.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MentalHealthPage() {
  return (
    <ErrorBoundary>
      <MentalHealthContent />
    </ErrorBoundary>
  );
} 