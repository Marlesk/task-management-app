export interface Task {
  _id: string;
  created_dt: string;
  last_updated_dt: string;
  title: string;
  description: string;
  priority: number;
  status: 'to_do' | 'in_progress' | 'in_review' | 'completed';
  tag_id: string;
  owner_id: string;
}
