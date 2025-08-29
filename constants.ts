import { Property, TaskStatus, Person } from './types';

export const ALL_PEOPLE: Person[] = [
  { id: 'person-roy', name: 'Roy Hodge Jr.', role: 'Administrative Assistant', phone: '(930) 280-7805', email: 'rhodge@cbbtx.org', avatarUrl: 'https://github.com/frostyfucker/Resume/blob/main/486383399_1887378762072833_5696250165872260052_n.jpg?raw=true' },
  { id: 'person-dane', name: 'Dane Walter', role: 'Founder', phone: '(512) 757-7934', email: 'dwalter@cbbtx.org', avatarUrl: 'https://i.pravatar.cc/40?u=dane.walter@builders.tx' },
  { id: 'person-jaime', name: 'Jaime Vega', role: 'City Clerk', phone: '210-400-0805', email: 'eagleconstruction2326@gmail.com', avatarUrl: 'https://i.pravatar.cc/40?u=jaime.vega' },
  { id: 'person-dcanales', name: 'Daniel Canales', role: 'City Clerk', phone: '(210) 207-7253', email: 'd.canales@sanantonio.gov', avatarUrl: 'https://i.pravatar.cc/40?u=d.canales' },
  { id: 'person-paez', name: 'Paez Leal Construction', role: 'General Contractor', phone: '(210) 555-0120', email: 'contact@paezleal.com', avatarUrl: 'https://i.pravatar.cc/40?u=paezleal' },
  { id: 'person-raulg', name: 'Raul G. Flores', role: 'City Clerk', phone: '(210) 555-0113', email: 'raul.flores@sanantonio.gov', avatarUrl: 'https://i.pravatar.cc/40?u=raul.flores' },
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    address: "945 Potomac St, San Antonio, TX 78202",
    imageUrl: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CW9f25koQJpdDUitCuUbPg&cb_client=search.gws-prod.gps&w=800&h=400&yaw=346.67825&pitch=0&thumbfov=100",
    permitting: {
      tasks: [
        {
          id: 'p1-1',
          name: "Home Addition Permit",
          status: TaskStatus.InProgress,
          personId: 'person-jaime',
          startDate: '2024-07-01',
          endDate: '2024-09-30',
          notes: 'Record: RES-ADD-PMT25-32501044. Rewire existing residence with addition and new 200 amp meter loop.',
          permitDetails: {
            recordNumber: 'RES-ADD-PMT25-32501044',
            recordStatus: 'Active',
            applicant: {
              name: 'JAIME VEGA',
              phone: '210-400-0805',
              email: 'eagleconstruction2326@gmail.com',
              mailingAddress: '130 COTTONWOOD, SAN ANTONIO, TX, 78214',
            },
            licensedProfessional: {
              name: 'JAIME VEGA',
              company: 'EAGLE CONSTRUCTION',
              address: '130 COTTONWOOD, SAN ANTONIO, TX, 78214',
              phone: '210-400-0805',
              licenseInfo: 'City Residential Building Cntr H928261',
            },
            owner: {
              name: 'NEXUS SERIES B LLC',
              address: '1008 SPENCE ST, AUSTIN, TX, 78702',
            },
            projectDescription: '945 POTOMAC ST',
            scopeOfWork: 'ADDITION TO REAR OF THE HOUSE WITH MASTER BATHROOM AND CLOSET "New 241 sq. ft. one story room addition, attached to Rear of existing residence on new foundation. Must Comply with setbacks. Must comply with UDC and IRC. Building over easements no permitted. Homeowner/Contractor are aware of inspections required. Homeowner/Contractor has been notified that an engineers letter is required to clear foundation inspection. **Any Electrical, Mechanical, or Plumbing work will require a separate, additional permit by a State Licensed Contractor, complete with inspections. ***All permits EXPIRE after 180 days with no activity.***',
            applicationInfo: {
              deckSqFt: 126,
              additionSqFt: 241,
              trades: ['Electrical', 'Mechanical', 'Plumbing'],
            },
            gisInfo: {
              parcelNumber: '129205',
              jurisdictions: [
                { type: 'San Antonio City Limits', value: 'City of San Antonio' },
                { type: 'Council District', value: '2' },
              ],
              landDevelopment: [
                { type: 'Military Notification Area', value: 'Fort Sam Houston MNA' },
                { type: 'Neighborhood Association(s)', value: 'Jefferson Heights - 64' },
                { type: 'School District', value: 'San Antonio ISD' },
              ],
              waterAreas: [{ type: 'Watershed', value: 'Salado Creek' }],
              zoningBase: [{ baseZone: 'R-4', caseNumber: '20020139' }],
              zoningOverlay: [
                { type: 'Airport Hazard Overlay District (AHOD)', value: 'AHOD' },
                { type: 'Facility Parking/Traffic Control Districts (EP)', value: 'EP-1' },
              ],
            }
          }
        },
        { id: 'p1-2', name: "Deck Permit", status: TaskStatus.InProgress, personId: 'person-jaime', startDate: '2024-07-01', endDate: '2024-09-15', notes: 'Record: RES-DCK-PMT25-32401044.' },
        { id: 'p1-3', name: "Electrical TOPS Permit", status: TaskStatus.InProgress, personId: 'person-dcanales', startDate: '2024-08-01', endDate: '2024-08-15', notes: 'Record: MEP-TOP-PMT25-33619871. Rewire w meterloop.' },
        { id: 'p1-4', name: "Residential Repair Permit", status: TaskStatus.Completed, personId: 'person-dcanales', startDate: '2024-06-20', endDate: '2024-06-28', notes: 'Record: REP-RRP-PMT-25-35302256.' },
        { id: 'p1-5', name: "Plumbing Completion Permit", status: TaskStatus.Completed, startDate: '2024-06-25', endDate: '2024-07-03', notes: 'Record: MEP-PCP-PMT25-34118788. Installation of 6 Fixtures (2 Full Bath) 1 Water Heater and 1 Kitchen Sink.' },
        { id: 'p1-6', name: "Minor Building Repair Application", status: TaskStatus.Completed, personId: 'person-jaime', startDate: '2024-06-15', endDate: '2024-06-22', notes: 'Record: REP-MBR-APP25-35008197.' },
        { id: 'p1-7', name: "Re-Roof Permit", status: TaskStatus.Completed, personId: 'person-raulg', startDate: '2024-06-01', endDate: '2024-06-10', notes: 'Record: REP-ROF-PMT23-35202507.' },
        { id: 'p1-8', name: "Mechanical Permit", status: TaskStatus.InProgress, startDate: '2024-08-05', endDate: '2024-09-20', notes: 'Record: MEP-MEC-PMT23-33921187. Awaiting framing inspection to proceed with rough-in.' },
        { id: 'p1-9', name: "Plumbing Sewer Permit", status: TaskStatus.Completed, personId: 'person-paez', startDate: '2024-06-10', endDate: '2024-06-20', notes: 'Record: MEP-SEW-PMT23-34820007. Sewer line work.' },
        { id: 'p1-10', name: "Electrical General Permit", status: TaskStatus.Completed, personId: 'person-paez', startDate: '2024-06-15', endDate: '2024-06-30', notes: 'Record: MEP-ELE-PMT23-33319983. Initial electrical work approved.' },
      ]
    },
    construction: {
      tasks: [
        { id: 'c1-1', name: 'Foundation Work', status: TaskStatus.Completed, personId: 'person-dane', startDate: '2024-08-01', endDate: '2024-08-15' },
        { id: 'c1-2', name: 'Framing & Deck Construction', status: TaskStatus.InProgress, personId: 'person-dane', startDate: '2024-08-16', endDate: '2024-10-05' },
        { id: 'c1-3', name: 'Roofing Installation', status: TaskStatus.NotStarted, personId: 'person-dane', startDate: '2024-10-06', endDate: '2024-10-20' },
        { id: 'c1-4', name: 'Electrical & Plumbing Rough-in', status: TaskStatus.NotStarted, personId: 'person-dane', startDate: '2024-10-21', endDate: '2024-11-05' },
        { id: 'c1-5', name: 'HVAC Installation', status: TaskStatus.Blocked, personId: 'person-dane', notes: 'Waiting for framing inspection.', startDate: '2024-10-21', endDate: '2024-10-30' },
        { id: 'c1-6', name: 'Insulation and Drywall', status: TaskStatus.NotStarted, personId: 'person-dane', startDate: '2024-11-06', endDate: '2024-11-20' },
        { id: 'c1-7', name: 'Final Fixes (Plumbing, Electrical)', status: TaskStatus.NotStarted, personId: 'person-dane', startDate: '2024-11-21', endDate: '2024-11-30' },
      ]
    },
    management: {
      tasks: [
        { id: 'm1-1', name: 'Final Inspections', status: TaskStatus.NotStarted, personId: 'person-roy', startDate: '2024-11-25', endDate: '2024-12-05' },
      ]
    },
    activityLog: []
  },
  {
    id: 2,
    address: "2207 BURNET ST, San Antonio, TX 78202",
    imageUrl: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=pcFZfeIu30nOiLln82ui_w&cb_client=search.gws-prod.gps&w=800&h=400&yaw=0.21&pitch=0&thumbfov=100",
    permitting: {
      tasks: [
        { id: 'p2-1', name: "Plumbing General Permit", status: TaskStatus.InProgress, startDate: '2024-09-01', endDate: '2024-09-15', notes: 'Record: MEP-PLM-PMT25-34321515.', personId: 'person-dane' },
        { id: 'p2-2', name: "Plumbing Sewer Permit", status: TaskStatus.InProgress, startDate: '2024-09-01', endDate: '2024-09-15', notes: 'Record: MEP-SEW-PMT25-34821520.', personId: 'person-dane' },
        { id: 'p2-3', name: "Plumbing Gas Permit", status: TaskStatus.InProgress, startDate: '2024-09-01', endDate: '2024-09-15', notes: 'Record: MEP-GAS-PMT25-34221522.', personId: 'person-dane' },
        { id: 'p2-4', name: "Electrical TOPS Permit", status: TaskStatus.InProgress, startDate: '2024-08-15', endDate: '2024-08-30', notes: 'Record: MEP-TOP-PMT25-33619876.', personId: 'person-dcanales' },
        { id: 'p2-5', name: "Electrical General Permit", status: TaskStatus.InProgress, startDate: '2024-08-10', endDate: '2024-08-25', notes: 'Record: MEP-ELE-PMT25-33317989.', personId: 'person-dcanales' },
        { id: 'p2-6', name: "Residential Repair Permit", status: TaskStatus.InProgress, startDate: '2024-08-01', endDate: '2024-08-15', notes: 'Record: REP-RRP-PMT-23-35302701.', personId: 'person-roy' },
        { id: 'p2-7', name: "Complaint", status: TaskStatus.Completed, startDate: '2024-07-15', endDate: '2024-07-22', notes: 'Record: INV-COM-INV23-22700864. Resolved.'},
        { id: 'p2-8', name: "Plumbing Sewer Permit (Old)", status: TaskStatus.Completed, startDate: '2023-06-28', endDate: '2023-07-05', notes: 'Record: MEP-SEW-PMT23-34820248. sewer', personId: 'person-dane' },
        { id: 'p2-9', name: "Plumbing Gas Permit (Old)", status: TaskStatus.Completed, startDate: '2023-06-28', endDate: '2023-07-05', notes: 'Record: MEP-GAS-PMT23-34220249. gas', personId: 'person-dane' },
        { id: 'p2-10', name: "Electrical Completion Permit (Old)", status: TaskStatus.Blocked, startDate: '2023-07-12', endDate: '2023-07-19', notes: 'Record: MEP-ECP-PMT23-33221342. Refers to old permit MEP-ELE-PMT23-33307816.', personId: 'person-jaime' },
        { id: 'p2-11', name: "Electrical General Permit (Old)", status: TaskStatus.Blocked, startDate: '2023-03-01', endDate: '2023-03-14', notes: 'Record: MEP-ELE-PMT23-33307816. Rewire existing residence. Upgrade meter loop.', personId: 'person-jaime' },
        { id: 'p2-12', name: "Plumbing General Permit (Old)", status: TaskStatus.Blocked, startDate: '2023-06-28', endDate: '2023-07-05', notes: 'Record: MEP-PLM-PMT23-34320247. remodle on plbg', personId: 'person-dane' },
      ]
    },
    construction: {
      tasks: [
        { id: 'c2-1', name: "General Electrical Work", status: TaskStatus.InProgress, personId: 'person-dcanales', notes: 'Active permits MEP-ELE-PMT25-33317989 and MEP-TOP-PMT25-33619876.', startDate: '2024-08-26', endDate: '2024-09-20' },
        { id: 'c2-2', name: "General Plumbing Work", status: TaskStatus.InProgress, personId: 'person-dane', notes: 'Active permits for general, sewer, and gas.', startDate: '2024-09-16', endDate: '2024-10-10' },
        { id: 'c2-3', name: "Electrical Rewire & Meter Upgrade", status: TaskStatus.Blocked, personId: 'person-jaime', notes: 'Permit withdrawn.' },
        { id: 'c2-4', name: "Plumbing Remodel", status: TaskStatus.Blocked, personId: 'person-dane', notes: 'Permit inactive.'},
        { id: 'c2-5', name: "Sewer Line Work", status: TaskStatus.Completed, personId: 'person-dane', startDate: '2023-07-06', endDate: '2023-07-20' },
        { id: 'c2-6', name: "Gas Line Work", status: TaskStatus.Completed, personId: 'person-dane', startDate: '2023-07-06', endDate: '2023-07-20' },
      ]
    },
    management: {
      tasks: [
        { id: 'm2-1', name: "Final Inspections", status: TaskStatus.NotStarted, personId: 'person-roy', startDate: '2024-10-15', endDate: '2024-10-22' },
      ]
    },
    activityLog: []
  },
  {
    id: 3,
    address: "1343 Mckinley St, Houston, TX 77002",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&h=400&auto=format&fit=crop",
    permitting: {
      tasks: [
        { id: 'p3-1', name: "Residential Remodel Permit", status: TaskStatus.Completed, personId: 'person-roy', attachments: [], startDate: '2024-01-10', endDate: '2024-02-10' },
        { id: 'p3-2', name: "Plumbing General", status: TaskStatus.Blocked, notes: "Strike Team Status: Waiting Electrical. still waiting for electrician to sign strike team letter, then we start roughin inspections", personId: 'person-dane', attachments: [], startDate: '2024-02-11', endDate: '2024-03-01' },
        { id: 'p3-3', name: "Electric General", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [], startDate: '2024-02-11', endDate: '2024-03-01' },
        { id: 'p3-4', name: "HVAC General", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [], startDate: '2024-02-11', endDate: '2024-03-01' },
      ]
    },
    construction: {
      tasks: [
        { id: 'c3-1', name: "Framing Inspection", status: TaskStatus.Blocked, personId: 'person-roy', attachments: [], startDate: '2024-03-02', endDate: '2024-03-10' },
        { id: 'c3-2', name: "Plumbing Final", status: TaskStatus.Blocked, personId: 'person-roy', attachments: [], startDate: '2024-03-11', endDate: '2024-03-18' },
        { id: 'c3-3', name: "Electric Final", status: TaskStatus.Blocked, personId: 'person-roy', attachments: [], startDate: '2024-03-11', endDate: '2024-03-18' },
        { id: 'c3-4', name: "Hvac Final", status: TaskStatus.Blocked, personId: 'person-roy', attachments: [], startDate: '2024-03-11', endDate: '2024-03-18' },
      ]
    },
    management: {
      tasks: [],
    },
    activityLog: []
  },
  {
    id: 4,
    address: "110 Nellina Dr, Houston, TX 77061",
    imageUrl: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=800&h=400&auto=format&fit=crop",
    permitting: {
      tasks: [
        { id: 'p4-1', name: "Residential Remodel Permit", status: TaskStatus.Completed, personId: 'person-roy', attachments: [], startDate: '2024-05-01', endDate: '2024-05-20' },
        { id: 'p4-2', name: "Minor Building Repair Application", status: TaskStatus.Completed, personId: 'person-roy', attachments: [], startDate: '2024-05-01', endDate: '2024-05-15' },
        { id: 'p4-3', name: "Plumbing General", status: TaskStatus.Completed, notes: "Fees Due", personId: 'person-dane', fee: { amount: 80, paid: true }, attachments: [], startDate: '2024-05-21', endDate: '2024-06-05' },
        { id: 'p4-4', name: "Plumbing Gas", status: TaskStatus.Completed, personId: 'person-dane', attachments: [], startDate: '2024-05-21', endDate: '2024-06-05' },
        { id: 'p4-5', name: "Plumbing Sewer", status: TaskStatus.Completed, personId: 'person-dane', attachments: [], startDate: '2024-05-21', endDate: '2024-06-05' },
        { id: 'p4-6', name: "Electric General", status: TaskStatus.Completed, personId: 'person-dane', attachments: [], startDate: '2024-06-06', endDate: '2024-06-20' },
        { id: 'p4-7', name: "HVAC General", status: TaskStatus.InProgress, personId: 'person-dane', attachments: [], startDate: '2024-06-21', endDate: '2024-07-05' },
      ]
    },
    construction: {
      tasks: [
        { id: 'c4-1', name: "Framing Inspection", status: TaskStatus.InProgress, personId: 'person-roy', attachments: [], startDate: '2024-07-06', endDate: '2024-07-16' },
        { id: 'c4-2', name: "Plumbing Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [], startDate: '2024-07-17', endDate: '2024-07-24' },
        { id: 'c4-3', name: "Electric Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [], startDate: '2024-07-17', endDate: '2024-07-24' },
        { id: 'c4-4', name: "Hvac Final", status: TaskStatus.Blocked, personId: 'person-dane', attachments: [], startDate: '2024-07-17', endDate: '2024-07-24' },
      ]
    },
    management: {
      tasks: [],
    },
    activityLog: []
  },
  {
    id: 5,
    address: "628 FLEMING ST, San Antonio, TX 78211",
    imageUrl: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=-DbLMg_N_wVCstCQqwjmzg&cb_client=search.gws-prod.gps&w=800&h=400&yaw=79.205157774667&pitch=0&thumbfov=100",
    permitting: {
      tasks: [
        { id: 'p5-1', name: "Mechanical Permit", status: TaskStatus.InProgress, startDate: '2024-09-01', endDate: '2024-09-15', notes: 'Record: MEP-MEC-PMT25-33917962. Full Mechanical installation of a 3.5 Ton straight cool/electric heat.', personId: 'person-dane' },
        { id: 'p5-2', name: "Electrical General Permit", status: TaskStatus.InProgress, startDate: '2024-08-20', endDate: '2024-09-05', notes: 'Record: MEP-ELE-PMT25-33308056. Rewire existing residence.', personId: 'person-dane' },
        { id: 'p5-3', name: "Plumbing General Permit", status: TaskStatus.InProgress, startDate: '2024-08-15', endDate: '2024-08-30', notes: 'Record: MEP-PLM-PMT25-34306938.', personId: 'person-dane' },
        { id: 'p5-4', name: "Residential Repair Permit", status: TaskStatus.InProgress, startDate: '2024-08-01', endDate: '2024-08-10', notes: 'Record: REP-RRP-PMT-25-35300750.', personId: 'person-roy' },
        { id: 'p5-5', name: "Minor Building Repair Application", status: TaskStatus.InProgress, startDate: '2024-08-01', endDate: '2024-08-10', notes: 'Record: REP-MBR-APP25-35002384.', personId: 'person-roy' },
        { id: 'p5-6', name: "Electrical General Permit (Old)", status: TaskStatus.Blocked, startDate: '2023-08-20', endDate: '2023-09-06', notes: 'Record: MEP-ELE-PMT23-33328071.', personId: 'person-dane' },
        { id: 'p5-7', name: "Foundation Repair Permit", status: TaskStatus.Blocked, startDate: '2023-05-24', endDate: '2023-06-07', notes: 'Record: REP-FND-PMT23-35101439.', personId: 'person-roy' },
      ]
    },
    construction: {
      tasks: [
        { id: 'c5-1', name: "Electrical Rewire", status: TaskStatus.InProgress, personId: 'person-dane', notes: 'Permit MEP-ELE-PMT25-33308056 is active.', startDate: '2024-09-06', endDate: '2024-09-27' },
        { id: 'c5-2', name: "HVAC Installation (3.5 Ton)", status: TaskStatus.NotStarted, personId: 'person-dane', notes: 'Permit MEP-MEC-PMT25-33917962 is active.', startDate: '2024-09-16', endDate: '2024-10-04' },
        { id: 'c5-3', name: "Plumbing Work", status: TaskStatus.InProgress, personId: 'person-dane', notes: 'Permit MEP-PLM-PMT25-34306938 is active.', startDate: '2024-09-01', endDate: '2024-09-20' },
        { id: 'c5-4', name: "Foundation Repair", status: TaskStatus.Blocked, personId: 'person-roy', notes: 'Permit REP-FND-PMT23-35101439 is inactive.' },
      ]
    },
    management: {
      tasks: [
        { id: 'm5-1', name: 'Final Inspections', status: TaskStatus.NotStarted, personId: 'person-roy', startDate: '2024-10-10', endDate: '2024-10-18' },
      ]
    },
    activityLog: []
  }
];