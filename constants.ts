import { Property, TaskStatus, Person } from './types';

const people: Person[] = [
  { id: 'person-roy', name: 'Roy Hodge Jr.', role: 'Project Manager', phone: '(930) 280-7805', email: 'roy.hodge@builders.tx', avatarUrl: 'https://github.com/frostyfucker/Resume/blob/main/486383399_1887378762072833_5696250165872260052_n.jpg?raw=true' },
  { id: 'person-dane', name: 'Dane Walter', role: 'Lead Contractor', phone: '(713) 555-0101', email: 'dane.walter@builders.tx', avatarUrl: 'https://i.pravatar.cc/40?u=dane.walter@builders.tx' },
  { id: 'person-jaime', name: 'Jaime Vega', role: 'City Clerk', phone: '(210) 555-0111', email: 'jaime.vega@sanantonio.gov', avatarUrl: 'https://i.pravatar.cc/40?u=jaime.vega' },
  { id: 'person-dcanales', name: 'Daniel Canales', role: 'City Clerk', phone: '(210) 555-0112', email: 'd.canales@sanantonio.gov', avatarUrl: 'https://i.pravatar.cc/40?u=d.canales' },
  { id: 'person-paez', name: 'Paez Leal Construction', role: 'Contractor', phone: '(210) 555-0120', email: 'contact@paezleal.com', avatarUrl: 'https://i.pravatar.cc/40?u=paezleal' },
  { id: 'person-raulg', name: 'Raul G. Flores', role: 'City Clerk', phone: '(210) 555-0113', email: 'raul.flores@sanantonio.gov', avatarUrl: 'https://i.pravatar.cc/40?u=raul.flores' },
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    address: "945 Potomac St, San Antonio, TX 78202",
    imageUrl: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CW9f25koQJpdDUitCuUbPg&cb_client=search.gws-prod.gps&w=800&h=400&yaw=346.67825&pitch=0&thumbfov=100",
    permitting: {
      tasks: [
        { id: 'p1-1', name: "Home Addition Permit", status: TaskStatus.InProgress, personId: 'person-jaime', date: '2025-07-23', dateLabel: 'Applied', notes: 'Record: RES-ADD-PMT25-32501044. Rewire existing residence with addition and new 200 amp meter loop.' },
        { id: 'p1-2', name: "Deck Permit", status: TaskStatus.InProgress, personId: 'person-jaime', date: '2025-07-23', dateLabel: 'Applied', notes: 'Record: RES-DCK-PMT25-32401044.' },
        { id: 'p1-3', name: "Electrical TOPS Permit", status: TaskStatus.InProgress, personId: 'person-dcanales', date: '2025-07-14', dateLabel: 'Applied', notes: 'Record: MEP-TOP-PMT25-33619871. Rewire w meterloop.' },
        { id: 'p1-4', name: "Residential Repair Permit", status: TaskStatus.Completed, personId: 'person-dcanales', date: '2025-07-14', dateLabel: 'Issued', notes: 'Record: REP-RRP-PMT-25-35302256.' },
        { id: 'p1-5', name: "Plumbing Completion Permit", status: TaskStatus.Completed, date: '2025-07-03', dateLabel: 'Issued', notes: 'Record: MEP-PCP-PMT25-34118788. Installation of 6 Fixtures (2 Full Bath) 1 Water Heater and 1 Kitchen Sink.' },
        { id: 'p1-6', name: "Minor Building Repair Application", status: TaskStatus.Completed, personId: 'person-jaime', date: '2025-07-03', dateLabel: 'Issued', notes: 'Record: REP-MBR-APP25-35008197.' },
        { id: 'p1-7', name: "Re-Roof Permit", status: TaskStatus.Completed, personId: 'person-raulg', date: '2023-07-14', dateLabel: 'Issued', notes: 'Record: REP-ROF-PMT23-35202507.' },
        { id: 'p1-8', name: "Mechanical Permit", status: TaskStatus.Blocked, date: '2023-07-12', dateLabel: 'Date', notes: 'Record: MEP-MEC-PMT23-33921187. Status is Inactive. 2.5 HVAC Equipment installation.' },
        { id: 'p1-9', name: "Plumbing Sewer Permit", status: TaskStatus.Completed, personId: 'person-paez', date: '2023-06-30', dateLabel: 'Issued', notes: 'Record: MEP-SEW-PMT23-34820007. Sewer line work.' },
        { id: 'p1-10', name: "Electrical General Permit", status: TaskStatus.Blocked, personId: 'person-paez', date: '2023-06-30', dateLabel: 'Date', notes: 'Record: MEP-ELE-PMT23-33319983. Status is Inactive.' },
      ]
    },
    construction: {
      tasks: [
        { id: 'c1-1', name: 'Foundation Work', status: TaskStatus.Completed, personId: 'person-dane', date: '2024-08-15', dateLabel: 'Completed' },
        { id: 'c1-2', name: 'Framing & Deck Construction', status: TaskStatus.InProgress, personId: 'person-dane', date: '2024-09-25', dateLabel: 'Due' },
        { id: 'c1-3', name: 'Roofing Installation', status: TaskStatus.InProgress, personId: 'person-dane' },
        { id: 'c1-4', name: 'Electrical & Plumbing Rough-in', status: TaskStatus.NotStarted, personId: 'person-dane' },
        { id: 'c1-5', name: 'HVAC Installation', status: TaskStatus.Blocked, personId: 'person-dane', notes: 'Waiting for framing inspection.' },
        { id: 'c1-6', name: 'Insulation and Drywall', status: TaskStatus.NotStarted, personId: 'person-dane' },
        { id: 'c1-7', name: 'Final Fixes (Plumbing, Electrical)', status: TaskStatus.NotStarted, personId: 'person-dane' },
        { id: 'c1-8', name: 'Final Inspections', status: TaskStatus.NotStarted, personId: 'person-roy', date: '2024-11-15', dateLabel: 'Target' },
      ]
    },
    people: people,
    activityLog: []
  },
  {
    id: 2,
    address: "2207 Burnet St, Houston, TX 77009",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&h=400&auto=format&fit=crop",
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
        { id: 'c2-1', name: "Framing Inspection", status: TaskStatus.InProgress, personId: 'person-roy', date: '2024-09-01', dateLabel: 'Due', attachments: [] },
        { id: 'c2-2', name: "Plumbing Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
        { id: 'c2-3', name: "Electric Final", status: TaskStatus.Completed, personId: 'person-dane', attachments: [] },
        { id: 'c2-4', name: "Hvac Final", status: TaskStatus.Blocked, personId: 'person-dane', date: '2024-09-10', dateLabel: 'Due', attachments: [] },
      ]
    },
    people: people,
    activityLog: []
  },
  {
    id: 3,
    address: "1343 Mckinley St, Houston, TX 77002",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&h=400&auto=format&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=800&h=400&auto=format&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&h=400&auto=format&fit=crop",
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
        { id: 'c5-1', name: "Framing Inspection", status: TaskStatus.InProgress, personId: 'person-roy', date: '2024-08-30', dateLabel: 'Due', attachments: [] },
        { id: 'c5-2', name: "Plumbing Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
        { id: 'c5-3', name: "Electric Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
        { id: 'c5-4', name: "Hvac Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [] },
      ]
    },
    people: people,
    activityLog: []
  }
];