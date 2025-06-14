'use client';

import { useProgressTracking } from '@/hooks/useProgressTracking';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Goal, GoalCategory, GoalPriority } from '@/types/progress-tracking';

export default function ProgressTrackingPage() {
  const router = useRouter();
  const {
    state,
    setState,
    loadGoals,
    loadProgressEntries,
    loadAchievements,
    createGoal,
    updateGoalProgress,
    updateGoalStatus
  } = useProgressTracking();

  const [isCreating, setIsCreating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  // New goal form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('fitness');
  const [priority, setPriority] = useState<GoalPriority>('medium');
  const [startDate, setStartDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [milestones, setMilestones] = useState<{ title: string; description: string; dueDate: string }[]>([]);

  useEffect(() => {
    loadGoals();
    loadProgressEntries();
    loadAchievements();
  }, [loadGoals, loadProgressEntries, loadAchievements]);

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal);
    setProgress(goal.progress);
  };

  const handleCreateGoal = async () => {
    await createGoal(
      title,
      description,
      category,
      priority,
      startDate,
      targetDate,
      milestones
    );
    setIsCreating(false);
    setTitle('');
    setDescription('');
    setCategory('fitness');
    setPriority('medium');
    setStartDate('');
    setTargetDate('');
    setMilestones([]);
  };

  const handleUpdateProgress = async () => {
    if (!selectedGoal) return;
    await updateGoalProgress(selectedGoal.id, progress, notes, attachments);
    setIsUpdating(false);
    setProgress(0);
    setNotes('');
    setAttachments([]);
  };

  const handleUpdateStatus = async (status: 'not_started' | 'in_progress' | 'completed' | 'abandoned') => {
    if (!selectedGoal) return;
    await updateGoalStatus(selectedGoal.id, status);
  };

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
        <h1 className="text-xl font-semibold text-white">Progress Tracking</h1>
        <div className="w-24"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Goals Panel */}
        <div className="w-1/3 bg-[#1A1A1A] border-r border-[#333] p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Goals</h2>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2B5FCC] transition-colors"
            >
              Create Goal
            </button>
          </div>

          {isCreating ? (
            <div className="bg-[#2A2A2A] p-4 rounded-lg mb-4">
              <h3 className="text-white font-semibold mb-2">Create New Goal</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                  >
                    <option value="fitness">Fitness</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="sleep">Sleep</option>
                    <option value="mental_health">Mental Health</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as GoalPriority)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGoal}
                    className="bg-[#357AFF] text-white px-4 py-2 rounded hover:bg-[#2B5FCC] transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            {state.goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleGoalSelect(goal)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedGoal?.id === goal.id
                    ? 'bg-[#357AFF] text-white'
                    : 'bg-[#2A2A2A] text-white hover:bg-[#333]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{goal.title}</span>
                  <span className="text-sm">{goal.progress}%</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {goal.category} | {goal.priority} priority
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Goal & Progress Panel */}
        <div className="w-2/3 bg-[#1A1A1A] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Goal Details & Progress</h2>
          
          {selectedGoal ? (
            <div className="space-y-4">
              <div className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{selectedGoal.title}</h3>
                <p className="text-gray-400 mb-4">{selectedGoal.description}</p>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Progress: {selectedGoal.progress}%</span>
                    <div className="w-full bg-[#333] h-2 rounded-full mt-1">
                      <div
                        className="bg-[#357AFF] h-2 rounded-full"
                        style={{ width: `${selectedGoal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Start: {new Date(selectedGoal.startDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    Target: {new Date(selectedGoal.targetDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Milestones</h3>
                <div className="space-y-3">
                  {selectedGoal.milestones.map((milestone) => (
                    <div key={milestone.id} className="border-t border-[#333] pt-3">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{milestone.description}</p>
                      <div className="text-sm text-gray-400 mt-1">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        Status: {milestone.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!isUpdating ? (
                <button
                  onClick={() => setIsUpdating(true)}
                  className="w-full bg-[#357AFF] text-white py-3 rounded-lg hover:bg-[#2B5FCC] transition-colors"
                >
                  Update Progress
                </button>
              ) : (
                <div className="bg-[#2A2A2A] p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Update Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Progress (0-100)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">{progress}%</span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-[#333] text-white p-2 rounded"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsUpdating(false)}
                        className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateProgress}
                        className="bg-[#357AFF] text-white px-4 py-2 rounded hover:bg-[#2B5FCC] transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateStatus('in_progress')}
                  className="flex-1 bg-[#357AFF] text-white py-2 rounded hover:bg-[#2B5FCC] transition-colors"
                >
                  Start
                </button>
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleUpdateStatus('abandoned')}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Abandon
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Select a goal to view details and update progress.</p>
          )}
        </div>
      </div>
    </div>
  );
} 