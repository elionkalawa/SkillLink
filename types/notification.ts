export type NotificationType = 'invite' | 'approval' | 'message' | 'project-update';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  created_at: string;
}
