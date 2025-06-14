import { useState, useCallback } from 'react';
import useUser from './useUser';
import {
  VirtualAssistantState,
  Message,
  AssistantResponse,
  AssistantSettings
} from '@/types/virtual-assistant';

export function useVirtualAssistant() {
  const { data: user } = useUser();
  const [state, setState] = useState<VirtualAssistantState>({
    loading: false,
    error: null,
    messages: [],
    responses: [],
    settings: null,
    isTyping: false
  });

  // Load messages
  const loadMessages = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/virtual-assistant/messages?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load messages');
      const messages: Message[] = await response.json();
      setState(prev => ({ ...prev, messages }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load messages' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Load settings
  const loadSettings = useCallback(async () => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/virtual-assistant/settings?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load settings');
      const settings: AssistantSettings = await response.json();
      setState(prev => ({ ...prev, settings }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load settings' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!user) return;
    setState(prev => ({ ...prev, loading: true, error: null, isTyping: true }));
    try {
      const response = await fetch('/api/virtual-assistant/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          content,
          timestamp: new Date().toISOString(),
          isUser: true
        })
      });
      if (!response.ok) throw new Error('Failed to send message');
      const message: Message = await response.json();
      setState(prev => ({ ...prev, messages: [message, ...prev.messages] }));
      // Simulate assistant response
      setTimeout(() => {
        const assistantResponse: AssistantResponse = {
          id: Date.now().toString(),
          messageId: message.id,
          content: 'This is a mock response from the assistant.',
          timestamp: new Date().toISOString()
        };
        setState(prev => ({ ...prev, responses: [assistantResponse, ...prev.responses], isTyping: false }));
      }, 1000);
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to send message', isTyping: false }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  return {
    state,
    setState,
    loadMessages,
    loadSettings,
    sendMessage
  };
} 