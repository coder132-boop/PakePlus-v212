import { projectId, publicAnonKey } from './supabase/info';

export async function checkDatabaseSetup(): Promise<{
  isSetup: boolean;
  missingTables: string[];
  error?: string;
}> {
  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996`;
  
  try {
    // Try to query the tables through a health check endpoint
    const response = await fetch(`${serverUrl}/database-check`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        isSetup: false,
        missingTables: ['user_profiles', 'recurring_tasks', 'chores'],
        error: 'Database check endpoint failed',
      };
    }

    const data = await response.json();
    return {
      isSetup: data.isSetup || false,
      missingTables: data.missingTables || [],
    };
  } catch (error) {
    console.error('Database check error:', error);
    return {
      isSetup: false,
      missingTables: ['user_profiles', 'recurring_tasks', 'chores'],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}