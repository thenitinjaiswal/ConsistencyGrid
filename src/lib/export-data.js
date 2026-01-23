/**
 * Clean data export utilities
 */

export async function fetchUserData() {
  const response = await fetch('/api/export-data', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch data');
  }

  return response.json();
}

export function convertToJSON(data) {
  return JSON.stringify(data, null, 2);
}

export function convertToCSV(data) {
  const rows = [];
  
  // User section
  rows.push('=== USER PROFILE ===');
  if (data.user) {
    rows.push(`Name,${data.user.name || 'N/A'}`);
    rows.push(`Email,${data.user.email}`);
    rows.push(`Joined,${new Date(data.user.createdAt).toLocaleDateString()}`);
  }
  rows.push('');

  // Goals section
  rows.push('=== GOALS ===');
  if (data.goals && data.goals.length > 0) {
    rows.push('Title,Category,Progress,Status,Deadline');
    data.goals.forEach(goal => {
      rows.push(`"${goal.title}","${goal.category}",${goal.progress}%,"${goal.isCompleted ? 'Completed' : 'Active'}","${goal.targetDeadline ? new Date(goal.targetDeadline).toLocaleDateString() : 'N/A'}"`);
    });
  } else {
    rows.push('No goals yet');
  }
  rows.push('');

  // Habits section
  rows.push('=== HABITS ===');
  if (data.habits && data.habits.length > 0) {
    rows.push('Habit,Time,Status');
    data.habits.forEach(habit => {
      rows.push(`"${habit.title}","${habit.scheduledTime || 'Anytime'}","${habit.isActive ? 'Active' : 'Inactive'}"`);
    });
  } else {
    rows.push('No habits yet');
  }
  rows.push('');

  // Habit logs section
  rows.push('=== HABIT COMPLETION LOG ===');
  if (data.habitLogs && data.habitLogs.length > 0) {
    rows.push('Habit ID,Date,Completed');
    data.habitLogs.forEach(log => {
      rows.push(`${log.habitId},"${new Date(log.date).toLocaleDateString()}","${log.done ? 'Yes' : 'No'}"`);
    });
  } else {
    rows.push('No habit logs yet');
  }
  rows.push('');

  // Milestones section
  rows.push('=== MILESTONES ===');
  if (data.milestones && data.milestones.length > 0) {
    rows.push('Milestone,Age,Status');
    data.milestones.forEach(m => {
      rows.push(`"${m.title}",${m.age},"${m.status}"`);
    });
  } else {
    rows.push('No milestones yet');
  }
  rows.push('');

  // Reminders section
  rows.push('=== REMINDERS ===');
  if (data.reminders && data.reminders.length > 0) {
    rows.push('Title,Date Range,Priority');
    data.reminders.forEach(r => {
      const startDate = new Date(r.startDate).toLocaleDateString();
      const endDate = new Date(r.endDate).toLocaleDateString();
      rows.push(`"${r.title}","${startDate} to ${endDate}",${r.priority}`);
    });
  } else {
    rows.push('No reminders yet');
  }
  rows.push('');

  // Export timestamp
  rows.push(`=== EXPORT INFO ===`);
  rows.push(`Exported on,${new Date().toLocaleString()}`);

  return rows.join('\n');
}

export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportData(format = 'json') {
  try {
    const data = await fetchUserData();
    
    let content, filename, mimeType;
    
    if (format === 'csv') {
      content = convertToCSV(data);
      filename = `consistency-grid-export-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv;charset=utf-8;';
    } else {
      content = convertToJSON(data);
      filename = `consistency-grid-export-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json;charset=utf-8;';
    }
    
    downloadFile(content, filename, mimeType);
    
    return {
      success: true,
      filename,
      message: `Data exported as ${format.toUpperCase()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
