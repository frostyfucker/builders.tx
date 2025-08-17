import { Property, TaskStatus, Person } from './types';

const people: Person[] = [
  { id: 'person-roy', name: 'Roy Hodge Jr.', role: 'Project Manager', phone: '(930) 280-7805', email: 'roy.hodge@builders.tx', avatarUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAHgAeADAREAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAgMAAQQFBgf/xAA5EAACAQMDAwIFAgQFBAMBAAAAAQIDBBESITEFQVEGEyJhcYEHkaGxMkLB0RQjUmLR4fAVFjOCkv/EABoBAQEBAQEBAQAAAAAAAAAAAAABAgMEBQb/xAAxEQEBAAEDAgQDBwUBAAAAAAAAAQIRAxIhMQRBURMyYXGBkaGx0fAUIkLB4ULxI//' },
  { id: 'person-dane', name: 'Dane Walter', role: 'Lead Contractor', phone: '555-333-4444', email: 'dane.walter@builders.tx', avatarUrl: 'https://i.pravatar.cc/40?u=dane.walter@builders.tx' },
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    address: "945 Potomac St, Houston, TX 77057",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78d9dba3b914?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    permitting: {
      tasks: [
        { id: 'p1-1', name: "Residential Remodel Permit", status: TaskStatus.Completed, personId: 'person-roy', attachments: [] },
        { id: 'p1-2', name: "Minor Building Repair Application", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
        { id: 'p1-3', name: "Addition Permit", status: TaskStatus.Completed, personId: 'person-roy', attachments: [] },
        { id: 'p1-4', name: "Deck Permit", status: TaskStatus.Completed, personId: 'person-roy', attachments: [] },
        { id: 'p1-5', name: "Plumbing General", status: TaskStatus.Completed, notes: "Fees Due", personId: 'person-dane', fee: { amount: 150, paid: false }, attachments: [] },
        { id: 'p1-6', name: "Electric General", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
        { id: 'p1-7', name: "HVAC General", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
      ]
    },
    construction: {
      tasks: [
        { id: 'c1-1', name: "Framing Inspection", status: TaskStatus.InProgress, notes: "Waiting for Letters", personId: 'person-roy', dueDate: '2024-08-20', attachments: [] },
        { id: 'c1-2', name: "Plumbing Final", status: TaskStatus.Blocked, personId: 'person-dane', dueDate: '2024-08-25', attachments: [] },
        { id: 'c1-3', name: "Electric Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
        { id: 'c1-4', name: "Hvac Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
      ]
    },
    people: people,
    activityLog: []
  },
  {
    id: 2,
    address: "2207 Burnet St, Houston, TX 77009",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    permitting: {
      tasks: [
        { id: 'p2-1', name: "Residential Remodel Permit", status: TaskStatus.Completed, personId: 'person-roy', attachments: [] },
        { id: 'p2-2', name: "Plumbing General", status: TaskStatus.InProgress, notes: "Stairs need to be resized, air ducts need to be installed upstairs, drywall opened up for framing, plumbing for gas line done, conduit resized for the service to the main", personId: 'person-dane', attachments: [] },
        { id: 'p2-3', name: "Electric General", status: TaskStatus.Completed, notes: "Fees Due", personId: 'person-dane', fee: { amount: 225, paid: true }, attachments: [] },
        { id: 'p2-4', name: "HVAC General", status: TaskStatus.InProgress, personId: 'person-dane', attachments: [] },
      ]
    },
    construction: {
      tasks: [
        { id: 'c2-1', name: "Framing Inspection", status: TaskStatus.InProgress, personId: 'person-roy', dueDate: '2024-09-01', attachments: [] },
        { id: 'c2-2', name: "Plumbing Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
        { id: 'c2-3', name: "Electric Final", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
        { id: 'c2-4', name: "Hvac Final", status: TaskStatus.Blocked, personId: 'person-dane', dueDate: '2024-09-10', attachments: [] },
      ]
    },
    people: people,
    activityLog: []
  },
  {
    id: 3,
    address: "1343 Mckinley St, Houston, TX 77002",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    permitting: {
      tasks: [
        { id: 'p3-1', name: "Residential Remodel Permit", status: TaskStatus.Completed, personId: 'person-roy', attachments: [] },
        { id: 'p3-2', name: "Plumbing General", status: TaskStatus.Blocked, notes: "Strike Team Status: Waiting Electrical. still waiting for electrician to sign strike team letter, then we start roughin inspections", personId: 'person-dane', attachments: [] },
        { id: 'p3-3', name: "Electric General", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
        { id: 'p3-4', name: "HVAC General", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
      ]
    },
    construction: {
      tasks: [
        { id: 'c3-1', name: "Framing Inspection", status: TaskStatus.Blocked, personId: 'person-roy', attachments: [] },
        { id: 'c3-2', name: "Plumbing Final", status: TaskStatus.Blocked, personId: 'person-roy', attachments: [] },
        { id: 'c3-3', name: "Electric Final", status: TaskStatus.Blocked, personId: 'person-roy', attachments: [] },
        { id: 'c3-4', name: "Hvac Final", status: TaskStatus.Blocked, personId: 'person-roy', attachments: [] },
      ]
    },
    people: people,
    activityLog: []
  },
  {
    id: 4,
    address: "110 Nellina Dr, Houston, TX 77061",
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    permitting: {
      tasks: [
        { id: 'p4-1', name: "Residential Remodel Permit", status: TaskStatus.Completed, personId: 'person-roy', attachments: [] },
        { id: 'p4-2', name: "Minor Building Repair Application", status: TaskStatus.Completed, personId: 'person-roy', attachments: [] },
        { id: 'p4-3', name: "Plumbing General", status: TaskStatus.Completed, notes: "Fees Due", personId: 'person-dane', fee: { amount: 80, paid: true }, attachments: [] },
        { id: 'p4-4', name: "Plumbing Gas", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
        { id: 'p4-5', name: "Plumbing Sewer", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
        { id: 'p4-6', name: "Electric General", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
        { id: 'p4-7', name: "HVAC General", status: TaskStatus.InProgress, personId: 'person-dane', attachments: [] },
      ]
    },
    construction: {
      tasks: [
        { id: 'c4-1', name: "Framing Inspection", status: TaskStatus.InProgress, personId: 'person-roy', attachments: [] },
        { id: 'c4-2', name: "Plumbing Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
        { id: 'c4-3', name: "Electric Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
        { id: 'c4-4', name: "Hvac Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
      ]
    },
    people: people,
    activityLog: []
  },
  {
    id: 5,
    address: "628 Fleming Dr, Houston, TX 77012",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    permitting: {
      tasks: [
        { id: 'p5-1', name: "Residential Remodel Permit", status: TaskStatus.Completed, personId: 'person-roy', attachments: [] },
        { id: 'p5-2', name: "Minor Building Repair Application", status: TaskStatus.Completed, personId: 'person-roy', attachments: [] },
        { id: 'p5-3', name: "Plumbing General", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
        { id: 'p5-4', name: "Electric General", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
        { id: 'p5-5', name: "HVAC General", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
      ]
    },
    construction: {
      tasks: [
        { id: 'c5-1', name: "Framing Inspection", status: TaskStatus.InProgress, personId: 'person-roy', dueDate: '2024-08-30', attachments: [] },
        { id: 'c5-2', name: "Plumbing Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
        { id: 'c5-3', name: "Electric Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
        { id: 'c5-4', name: "Hvac Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
      ]
    },
    people: people,
    activityLog: []
  }
];