export interface Tag {
  _id: string;
  created_dt: string;
  last_updated_dt: string;
  name: string;
  description: string;
  isEnabled: '0' | '1';
}
