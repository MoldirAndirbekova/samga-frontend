import { NextResponse } from 'next/server';
import api from "@/features/page";

// Handler for submitting game statistics
export async function POST(request: Request) {
  try {
    const statsData = await request.json();
    
    // Validate the stats data
    if (!statsData.gameId || !statsData.score) {
      return NextResponse.json(
        { error: 'Missing required fields: gameId and score are required' },
        { status: 400 }
      );
    }
    
    // Forward the stats to the backend API
    const response = await api.post('/stats', statsData);
    
    return NextResponse.json(
      { message: 'Game statistics saved successfully', data: response.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error submitting game stats:', error);
    
    return NextResponse.json(
      { error: 'Failed to save game statistics', message: error.message },
      { status: 500 }
    );
  }
} 