import { NextResponse } from 'next/server';
import { GroupPost } from '@/types/social-support';

// Mock data
const mockPosts: GroupPost[] = [
  {
    id: 'post-1',
    groupId: 'group-1',
    userId: 'user-2',
    content: 'Just completed a 5K run! Feeling great!',
    type: 'achievement',
    likes: 5,
    comments: [
      {
        id: 'comment-1',
        postId: 'post-1',
        userId: 'user-3',
        content: 'Great job! Keep it up!',
        likes: 2,
        createdAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z'
      }
    ],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'post-2',
    groupId: 'group-1',
    userId: 'user-3',
    content: 'Looking for a workout buddy. Anyone interested?',
    type: 'message',
    likes: 3,
    comments: [],
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  }
];

export async function GET(request: Request, { params }: { params: { groupId: string } }) {
  const { groupId } = params;
  const posts = mockPosts.filter(post => post.groupId === groupId);
  return NextResponse.json(posts);
}

export async function POST(request: Request, { params }: { params: { groupId: string } }) {
  const { groupId } = params;
  const post = await request.json();
  const newPost: GroupPost = {
    ...post,
    id: `post-${mockPosts.length + 1}`,
    groupId,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockPosts.push(newPost);
  return NextResponse.json(newPost);
} 