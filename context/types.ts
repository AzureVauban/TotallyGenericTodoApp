export interface TaskItem {
  id: string;
  text: string;
  done: boolean;
  flagged: boolean;
  indent: number;
  scheduleDate?: string;
  recentlyDeleted?: boolean;
  listName?: string;
}
