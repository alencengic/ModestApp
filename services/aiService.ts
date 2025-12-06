import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  context?: string;
}

export const initializeAIChat = async (): Promise<ChatSession> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const sessionId = `chat_${Date.now()}`;
    
    // Get recent mood and journal context
    const { data: recentMood } = await supabase
      .from('mood_ratings')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5);

    const { data: recentJournal } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(3);

    const context = buildContextFromData(recentMood || [], recentJournal || []);

    return {
      id: sessionId,
      userId: user.id,
      messages: [],
      createdAt: DateTime.now().toISO() || '',
      updatedAt: DateTime.now().toISO() || '',
      context,
    };
  } catch (error) {
    console.error('Error initializing chat:', error);
    throw error;
  }
};

const buildContextFromData = (moodData: any[], journalData: any[]): string => {
  let context = 'User context:\n';
  
  if (moodData && moodData.length > 0) {
    const avgMood = moodData.reduce((sum, m) => sum + m.mood_level, 0) / moodData.length;
    context += `- Average mood over last entries: ${Math.round(avgMood)}/10\n`;
    context += `- Recent emotions: ${moodData[0].emotions || 'Not specified'}\n`;
  }

  if (journalData && journalData.length > 0) {
    context += `- Recently journaled about: ${journalData[0].content?.substring(0, 100)}...\n`;
  }

  return context;
};

export const sendMessage = async (
  session: ChatSession,
  userMessage: string
): Promise<Message> => {
  try {
    const timestamp = DateTime.now().toISO() || '';
    
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp,
    };

    session.messages.push(userMsg);

    // Generate AI response (using Claude API or mock for now)
    const aiResponse = await generateAIResponse(userMessage, session.context || '');

    const assistantMsg: Message = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: aiResponse,
      timestamp: DateTime.now().toISO() || '',
    };

    session.messages.push(assistantMsg);
    session.updatedAt = DateTime.now().toISO() || '';

    // Save conversation
    await saveChatSession(session);

    return assistantMsg;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const generateAIResponse = async (userMessage: string, context: string): Promise<string> => {
  // This is a mock implementation. In production, integrate with Claude API:
  // const response = await fetch('https://api.anthropic.com/v1/messages', {
  //   method: 'POST',
  //   headers: {
  //     'x-api-key': process.env.CLAUDE_API_KEY,
  //     'content-type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: 'claude-3-sonnet-20240229',
  //     max_tokens: 1024,
  //     system: `You are a compassionate mental health support assistant. ${context}`,
  //     messages: [{ role: 'user', content: userMessage }],
  //   }),
  // });

  // For now, return empathetic responses
  const responses = [
    "That sounds challenging. I'm here to listen. Tell me more about what you're experiencing.",
    "I appreciate you sharing that with me. It takes courage to open up. What do you think might help right now?",
    "It sounds like you're going through a lot. Remember to be kind to yourself. What small step could help you feel better today?",
    "Thank you for trusting me with that. Your feelings are valid. Have you considered talking to someone close to you about this?",
    "I hear you. Difficult emotions are a normal part of life. What's one thing that usually helps you feel better?",
  ];

  // Select response based on keyword matching
  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
    return responses[1];
  }
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
    return "It sounds like anxiety is present. Remember to breathe deeply. What's one thing you can do right now to ground yourself?";
  }
  if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
    return "Exhaustion is real. It's okay to rest and be gentle with yourself. What does self-care look like for you?";
  }

  return responses[Math.floor(Math.random() * responses.length)];
};

export const saveChatSession = async (session: ChatSession): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if session exists
    const { data: existing } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', session.id)
      .single();

    if (existing) {
      await supabase
        .from('chat_sessions')
        .update({
          messages: session.messages,
          updated_at: session.updatedAt,
        })
        .eq('id', session.id);
    } else {
      await supabase.from('chat_sessions').insert({
        id: session.id,
        user_id: user.id,
        messages: session.messages,
        created_at: session.createdAt,
        updated_at: session.updatedAt,
      });
    }
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
};

export const getChatHistory = async (limit: number = 10): Promise<ChatSession[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(session => ({
      id: session.id,
      userId: session.user_id,
      messages: session.messages || [],
      createdAt: session.created_at,
      updatedAt: session.updated_at,
      context: session.context,
    }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

export const clearChatSession = async (sessionId: string): Promise<void> => {
  try {
    await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);
  } catch (error) {
    console.error('Error clearing chat session:', error);
  }
};

export const getEmpatheticReminder = (moodLevel: number): string => {
  if (moodLevel >= 8) return 'You seem to be in a great place! Keep nurturing what\'s working for you.';
  if (moodLevel >= 6) return 'Things are looking positive! Continue taking care of yourself.';
  if (moodLevel >= 4) return 'You\'re managing well. Remember, one day at a time.';
  if (moodLevel >= 2) return 'Tough times don\'t last. Reach out if you need support.';
  return 'Please be gentle with yourself. Professional support is available if needed.';
};

export const suggestCopingStrategy = (emotion: string): string => {
  const strategies: { [key: string]: string } = {
    'anxious': 'Try deep breathing: Inhale for 4 counts, hold for 4, exhale for 4. Repeat 5 times.',
    'sad': 'Consider reaching out to a friend or journaling your feelings. Movement can also help.',
    'angry': 'Take a break, go for a walk, or try progressive muscle relaxation.',
    'tired': 'Rest is important. Even a 15-minute nap or quiet time can help.',
    'overwhelmed': 'Break things down into smaller steps. One task at a time.',
    'lonely': 'Connect with someone. Even a text or call can make a difference.',
  };

  return strategies[emotion.toLowerCase()] || 'Take a moment to pause and breathe. What do you need right now?';
};
