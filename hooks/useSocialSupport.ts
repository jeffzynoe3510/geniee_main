import { useState, useCallback } from 'react';
import { SocialSupportState, UserConnection, SupportGroup, GroupPost, Challenge } from '@/types/social-support';

const initialState: SocialSupportState = {
  loading: false,
  error: null,
  connections: [],
  groups: [],
  posts: [],
  challenges: [],
  selectedGroup: null,
  selectedChallenge: null,
  isCreating: false
};

export const useSocialSupport = () => {
  const [state, setState] = useState<SocialSupportState>(initialState);

  const loadConnections = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      const response = await fetch('/api/social/connections');
      const data = await response.json();
      setState(prev => ({ ...prev, connections: data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to load connections', loading: false }));
    }
  }, []);

  const loadGroups = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      const response = await fetch('/api/social/groups');
      const data = await response.json();
      setState(prev => ({ ...prev, groups: data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to load groups', loading: false }));
    }
  }, []);

  const loadPosts = useCallback(async (groupId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      const response = await fetch(`/api/social/groups/${groupId}/posts`);
      const data = await response.json();
      setState(prev => ({ ...prev, posts: data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to load posts', loading: false }));
    }
  }, []);

  const loadChallenges = useCallback(async (groupId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      const response = await fetch(`/api/social/groups/${groupId}/challenges`);
      const data = await response.json();
      setState(prev => ({ ...prev, challenges: data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to load challenges', loading: false }));
    }
  }, []);

  const createGroup = useCallback(async (group: Omit<SupportGroup, 'id' | 'createdAt' | 'memberCount'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      const response = await fetch('/api/social/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
      });
      const data = await response.json();
      setState(prev => ({ ...prev, groups: [...prev.groups, data], loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to create group', loading: false }));
    }
  }, []);

  const createPost = useCallback(async (post: Omit<GroupPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      const response = await fetch(`/api/social/groups/${post.groupId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      const data = await response.json();
      setState(prev => ({ ...prev, posts: [...prev.posts, data], loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to create post', loading: false }));
    }
  }, []);

  const createChallenge = useCallback(async (challenge: Omit<Challenge, 'id' | 'participants'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      const response = await fetch(`/api/social/groups/${challenge.groupId}/challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challenge)
      });
      const data = await response.json();
      setState(prev => ({ ...prev, challenges: [...prev.challenges, data], loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to create challenge', loading: false }));
    }
  }, []);

  const joinGroup = useCallback(async (groupId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      await fetch(`/api/social/groups/${groupId}/join`, { method: 'POST' });
      setState(prev => ({
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? { ...group, members: [...group.members, 'current-user-id'], memberCount: group.memberCount + 1 }
            : group
        ),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to join group', loading: false }));
    }
  }, []);

  const leaveGroup = useCallback(async (groupId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock API call
      await fetch(`/api/social/groups/${groupId}/leave`, { method: 'POST' });
      setState(prev => ({
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? { ...group, members: group.members.filter(id => id !== 'current-user-id'), memberCount: group.memberCount - 1 }
            : group
        ),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to leave group', loading: false }));
    }
  }, []);

  const selectGroup = useCallback((group: SupportGroup | null) => {
    setState(prev => ({ ...prev, selectedGroup: group }));
  }, []);

  const selectChallenge = useCallback((challenge: Challenge | null) => {
    setState(prev => ({ ...prev, selectedChallenge: challenge }));
  }, []);

  return {
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
  };
}; 