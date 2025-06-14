'use client';

import { useSocialSupport } from '@/hooks/useSocialSupport';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SupportGroup, GroupPost, Challenge } from '@/types/social-support';

export default function SocialSupportPage() {
  const router = useRouter();
  const {
    state,
    setState,
    loadConnections,
    loadGroups,
    loadPosts,
    loadChallenges,
    createGroup,
    createPost,
    createChallenge,
    joinGroup,
    leaveGroup,
    selectGroup,
    selectChallenge
  } = useSocialSupport();

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupType, setGroupType] = useState<'fitness' | 'nutrition' | 'mental_health' | 'general'>('fitness');
  const [groupRules, setGroupRules] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'message' | 'achievement' | 'challenge' | 'support'>('message');
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [challengeStartDate, setChallengeStartDate] = useState('');
  const [challengeEndDate, setChallengeEndDate] = useState('');
  const [challengeRules, setChallengeRules] = useState<string[]>([]);
  const [challengeRewards, setChallengeRewards] = useState<string[]>([]);

  useEffect(() => {
    loadConnections();
    loadGroups();
  }, [loadConnections, loadGroups]);

  useEffect(() => {
    if (state.selectedGroup) {
      loadPosts(state.selectedGroup.id);
      loadChallenges(state.selectedGroup.id);
    }
  }, [state.selectedGroup, loadPosts, loadChallenges]);

  const handleCreateGroup = async () => {
    await createGroup({
      name: groupName,
      description: groupDescription,
      type: groupType,
      createdBy: 'current-user-id',
      rules: groupRules,
      isPrivate,
      members: ['current-user-id'],
      moderators: ['current-user-id']
    });
    setIsCreatingGroup(false);
    setGroupName('');
    setGroupDescription('');
    setGroupType('fitness');
    setGroupRules([]);
    setIsPrivate(false);
  };

  const handleCreatePost = async () => {
    if (!state.selectedGroup) return;
    await createPost({
      groupId: state.selectedGroup.id,
      userId: 'current-user-id',
      content: postContent,
      type: postType
    });
    setIsCreatingPost(false);
    setPostContent('');
    setPostType('message');
  };

  const handleCreateChallenge = async () => {
    if (!state.selectedGroup) return;
    await createChallenge({
      groupId: state.selectedGroup.id,
      createdBy: 'current-user-id',
      title: challengeTitle,
      description: challengeDescription,
      startDate: challengeStartDate,
      endDate: challengeEndDate,
      type: state.selectedGroup.type,
      rules: challengeRules,
      rewards: challengeRewards,
      status: 'upcoming'
    });
    setIsCreatingChallenge(false);
    setChallengeTitle('');
    setChallengeDescription('');
    setChallengeStartDate('');
    setChallengeEndDate('');
    setChallengeRules([]);
    setChallengeRewards([]);
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
        <h1 className="text-xl font-semibold text-white">Social Support</h1>
        <div className="w-24"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Groups Panel */}
        <div className="w-1/3 bg-[#1A1A1A] border-r border-[#333] p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Groups</h2>
            <button
              onClick={() => setIsCreatingGroup(true)}
              className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2B5FCC] transition-colors"
            >
              Create Group
            </button>
          </div>

          {isCreatingGroup ? (
            <div className="bg-[#2A2A2A] p-4 rounded-lg mb-4">
              <h3 className="text-white font-semibold mb-2">Create New Group</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Type</label>
                  <select
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value as any)}
                    className="w-full bg-[#333] text-white p-2 rounded"
                  >
                    <option value="fitness">Fitness</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="mental_health">Mental Health</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rules (one per line)</label>
                  <textarea
                    value={groupRules.join('\n')}
                    onChange={(e) => setGroupRules(e.target.value.split('\n'))}
                    className="w-full bg-[#333] text-white p-2 rounded"
                    rows={3}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-400">Private Group</label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsCreatingGroup(false)}
                    className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    className="bg-[#357AFF] text-white px-4 py-2 rounded hover:bg-[#2B5FCC] transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            {state.groups.map((group) => (
              <button
                key={group.id}
                onClick={() => selectGroup(group)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  state.selectedGroup?.id === group.id
                    ? 'bg-[#357AFF] text-white'
                    : 'bg-[#2A2A2A] text-white hover:bg-[#333]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{group.name}</span>
                  <span className="text-sm">{group.memberCount} members</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {group.type} | {group.isPrivate ? 'Private' : 'Public'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Group & Posts Panel */}
        <div className="w-2/3 bg-[#1A1A1A] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Group Details & Posts</h2>
          
          {state.selectedGroup ? (
            <div className="space-y-4">
              <div className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{state.selectedGroup.name}</h3>
                <p className="text-gray-400 mb-4">{state.selectedGroup.description}</p>
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    Type: {state.selectedGroup.type}
                  </div>
                  <div className="text-sm text-gray-400">
                    Members: {state.selectedGroup.memberCount}
                  </div>
                  <div className="text-sm text-gray-400">
                    Rules:
                    <ul className="list-disc list-inside mt-1">
                      {state.selectedGroup.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Posts</h3>
                <button
                  onClick={() => setIsCreatingPost(true)}
                  className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2B5FCC] transition-colors"
                >
                  Create Post
                </button>
              </div>

              {isCreatingPost ? (
                <div className="bg-[#2A2A2A] p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Create New Post</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Content</label>
                      <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="w-full bg-[#333] text-white p-2 rounded"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Type</label>
                      <select
                        value={postType}
                        onChange={(e) => setPostType(e.target.value as any)}
                        className="w-full bg-[#333] text-white p-2 rounded"
                      >
                        <option value="message">Message</option>
                        <option value="achievement">Achievement</option>
                        <option value="challenge">Challenge</option>
                        <option value="support">Support</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsCreatingPost(false)}
                        className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePost}
                        className="bg-[#357AFF] text-white px-4 py-2 rounded hover:bg-[#2B5FCC] transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                {state.posts.map((post) => (
                  <div key={post.id} className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{post.type}</span>
                      <span className="text-sm text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2">{post.content}</p>
                    <div className="flex items-center space-x-4">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-heart mr-1"></i>
                        {post.likes}
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-comment mr-1"></i>
                        {post.comments.length}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8">
                <h3 className="text-lg font-semibold text-white">Challenges</h3>
                <button
                  onClick={() => setIsCreatingChallenge(true)}
                  className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2B5FCC] transition-colors"
                >
                  Create Challenge
                </button>
              </div>

              {isCreatingChallenge ? (
                <div className="bg-[#2A2A2A] p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Create New Challenge</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={challengeTitle}
                        onChange={(e) => setChallengeTitle(e.target.value)}
                        className="w-full bg-[#333] text-white p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Description</label>
                      <textarea
                        value={challengeDescription}
                        onChange={(e) => setChallengeDescription(e.target.value)}
                        className="w-full bg-[#333] text-white p-2 rounded"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={challengeStartDate}
                        onChange={(e) => setChallengeStartDate(e.target.value)}
                        className="w-full bg-[#333] text-white p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">End Date</label>
                      <input
                        type="date"
                        value={challengeEndDate}
                        onChange={(e) => setChallengeEndDate(e.target.value)}
                        className="w-full bg-[#333] text-white p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Rules (one per line)</label>
                      <textarea
                        value={challengeRules.join('\n')}
                        onChange={(e) => setChallengeRules(e.target.value.split('\n'))}
                        className="w-full bg-[#333] text-white p-2 rounded"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Rewards (one per line)</label>
                      <textarea
                        value={challengeRewards.join('\n')}
                        onChange={(e) => setChallengeRewards(e.target.value.split('\n'))}
                        className="w-full bg-[#333] text-white p-2 rounded"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsCreatingChallenge(false)}
                        className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateChallenge}
                        className="bg-[#357AFF] text-white px-4 py-2 rounded hover:bg-[#2B5FCC] transition-colors"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                {state.challenges.map((challenge) => (
                  <div key={challenge.id} className="bg-[#2A2A2A] text-white p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{challenge.title}</span>
                      <span className="text-sm text-gray-400">
                        {challenge.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2">{challenge.description}</p>
                    <div className="text-sm text-gray-400">
                      <div>Start: {new Date(challenge.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(challenge.endDate).toLocaleDateString()}</div>
                      <div>Participants: {challenge.participants.length}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Select a group to view details, posts, and challenges.</p>
          )}
        </div>
      </div>
    </div>
  );
} 