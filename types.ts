export enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Blocked = 'Blocked',
}

export enum ProcessType {
    Permitting = 'permitting',
    Construction = 'construction',
}

export interface Attachment {
  id: string;
  name: string;
  url: string; // data URL
  type: 'image' | 'document';
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  notes?: string;
  personId?: string;
  dueDate?: string;
  fee?: {
    amount: number;
    paid: boolean;
  };
  attachments?: Attachment[];
}

export interface Process {
  tasks: Task[];
}

export interface Person {
  id:string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatarUrl: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  personId?: string; // Optional: for system events
  type: 'comment' | 'event';
  text: string;
  attachments?: Attachment[];
}

export interface Property {
  id: number;
  address: string;
  imageUrl: string;
  permitting: Process;
  construction: Process;
  people: Person[];
  activityLog: LogEntry[];
}

export interface Message {
    sender: 'user' | 'ai';
    text: string;
}