import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { INITIAL_PROPERTIES } from './constants';
import { Property, TaskStatus, ProcessType, Task, Person, Attachment, LogEntry, PermitDetail } from './types';
import AIAssistant from './components/AIAssistant';

// --- Icon Components ---
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const WrenchScrewdriverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-4.243-4.243l3.275-3.275a4.5 4.5 0 0 0-6.336 4.486c.046.58.193 1.193.343 1.743m-8.121 8.121L2.87 22.22c.421.421.99.67 1.597.67s1.176-.249 1.597-.67l4.655-4.655m3.11-3.11.583-.583m0 0l-1.061-1.061m1.06 1.06-1.06 1.061" />
    </svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75-.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 19.5a2.25 2.25 0 0 1-1.061.642l-3.327 1.178a.75.75 0 0 1-.94-1.258l1.178-3.327a2.25 2.25 0 0 1 .642-1.06l9.819-9.819Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232 18.768 8.768" />
    </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25c0 5.385 4.365 9.75 9.75 9.75 2.138 0 4.125-.683 5.752-1.848Z" />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
    </svg>
);

const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.51.056 1.02.082 1.535.082a9.094 9.094 0 0 1 5.862-1.986 3 3 0 0 0-4.682-2.72m-7.5-2.962a3 3 0 0 0-4.682 2.72 9.094 9.094 0 0 0 3.74.479m-1.5-4.59a3 3 0 0 1-5.862 1.986 9.094 9.094 0 0 1 5.862-1.986ZM14.25 5.25a3 3 0 0 1-5.862 1.986 9.094 9.094 0 0 1 5.862-1.986a3 3 0 0 1 0 4.507M12 21a9.094 9.094 0 0 0-3.741-.479 3 3 0 0 0-4.682 2.72" />
    </svg>
);

const CurrencyDollarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" />
    </svg>
);

const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 4.811 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

const PaperClipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3.375 3.375 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" />
    </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537a5.25 5.25 0 0 1-3.722-1.651L12 16.5h-1.5a5.25 5.25 0 0 1-3.722-1.651L5.22 12.21a5.25 5.25 0 0 1-1.65-3.722V7.489c0-.99.616-1.815 1.5-2.097L6.6 5.195a5.25 5.25 0 0 1 6.275 0l2.385.621Zm-4.5.385c.623.23.99.862.99 1.528v3.834a2.25 2.25 0 0 1-2.25 2.25H12a2.25 2.25 0 0 1-2.25-2.25V10.84a2.25 2.25 0 0 1 2.25-2.25h3.75Zm-9-1.528c-.623-.23-.99-.862-.99-1.528V5.195a5.25 5.25 0 0 1 6.275 0l2.385.621c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537a5.25 5.25 0 0 1-3.722-1.651L6.78 13.71a5.25 5.25 0 0 1-1.65-3.722V8.489Z" />
    </svg>
);

const statusConfig = {
    [TaskStatus.Completed]: { icon: CheckCircleIcon, color: 'text-status-completed', bg: 'bg-status-completed/10' },
    [TaskStatus.InProgress]: { icon: ClockIcon, color: 'text-status-inprogress', bg: 'bg-status-inprogress/10' },
    [TaskStatus.Blocked]: { icon: XCircleIcon, color: 'text-status-blocked', bg: 'bg-status-blocked/10' },
    [TaskStatus.NotStarted]: { icon: ClockIcon, color: 'text-status-notstarted', bg: 'bg-status-notstarted/10' },
};

// --- Child Components ---

interface PersonAvatarProps {
    person: Person;
}

const PersonAvatar: React.FC<PersonAvatarProps> = ({ person }) => (
    <div className="relative group" aria-label={`Contact info for ${person.name}`}>
        <img
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800"
            src={person.avatarUrl}
            alt={person.name}
        />
        <div role="tooltip" className="absolute bottom-full mb-2 w-64 -translate-x-1/2 left-1/2 bg-slate-800 dark:bg-slate-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
            <p className="font-bold text-base text-slate-100">{person.name}</p>
            <p className="text-sm text-slate-300 mb-2">{person.role}</p>
            <div className="border-t border-slate-600 my-1"></div>
            <a href={`tel:${person.phone}`} className="flex items-center gap-2 hover:text-brand-secondary transition-colors">
                <PhoneIcon className="w-4 h-4" />
                <span>{person.phone}</span>
            </a>
            <a href={`mailto:${person.email}`} className="flex items-center gap-2 mt-1 hover:text-brand-secondary transition-colors">
                <EnvelopeIcon className="w-4 h-4" />
                <span>{person.email}</span>
            </a>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800 dark:border-t-slate-900"></div>
        </div>
    </div>
);

interface TaskItemProps {
    task: Task;
    person?: Person;
    onStatusChange: (newStatus: TaskStatus) => void;
    onEdit: (task: Task) => void;
    onShowDetails: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, person, onStatusChange, onEdit, onShowDetails }) => {
    const { icon: Icon, color } = statusConfig[task.status];
    const [isOpen, setIsOpen] = useState(false);
    const hasDetails = !!task.permitDetails;

    const handleSelect = (status: TaskStatus) => {
        onStatusChange(status);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-sm mb-2 transition-colors">
            <div className="flex flex-col items-start gap-1 flex-grow overflow-hidden">
                 <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <button
                        onClick={hasDetails ? () => onShowDetails(task) : undefined}
                        disabled={!hasDetails}
                        className={`text-left text-slate-700 dark:text-slate-300 ${hasDetails ? 'hover:underline cursor-pointer' : 'cursor-default'}`}
                        aria-label={hasDetails ? `View details for ${task.name}` : task.name}
                    >
                        {task.name}
                    </button>
                </div>
                {task.notes && <p className="text-xs text-slate-500 dark:text-slate-400 ml-8 italic">Note: {task.notes}</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 ml-8">
                    {task.date && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <CalendarDaysIcon className="w-4 h-4" />
                            <span>
                                {task.dateLabel && <span className="font-medium">{task.dateLabel}: </span>}
                                {new Date(task.date).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                    {task.fee && (
                         <div className={`flex items-center gap-1.5 text-xs font-medium ${task.fee.paid ? 'text-green-600' : 'text-amber-600'}`}>
                             <CurrencyDollarIcon className="w-4 h-4" />
                             <span>${task.fee.amount} {task.fee.paid ? 'Paid' : 'Due'}</span>
                         </div>
                    )}
                </div>
                {task.attachments && task.attachments.length > 0 && (
                     <div className="w-full mt-2 ml-8 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                           <PaperClipIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                            <div className="flex flex-wrap gap-2">
                                {task.attachments.map(att => (
                                    <a 
                                        key={att.id} 
                                        href={att.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-xs text-brand-secondary hover:underline bg-blue-50 dark:bg-slate-700 px-2 py-1 rounded"
                                        title={att.name}
                                    >
                                        {att.name.length > 20 ? `${att.name.substring(0, 18)}...` : att.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1 ml-4">
                {person && <PersonAvatar person={person} />}
                {hasDetails && (
                    <button onClick={() => onShowDetails(task)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" aria-label="View permit details">
                        <InformationCircleIcon className="w-4 h-4" />
                    </button>
                )}
                 <button onClick={() => onEdit(task)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" aria-label="Edit task">
                    <PencilIcon className="w-4 h-4" />
                </button>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 ${statusConfig[task.status].bg} ${statusConfig[task.status].color}`}
                    >
                        {task.status}
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-700 rounded-md shadow-lg z-10 border border-slate-200 dark:border-slate-600">
                            {Object.values(TaskStatus).map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleSelect(status)}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


interface TaskListProps {
    title: string;
    tasks: Task[];
    people: Person[];
    icon: React.ReactNode;
    onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    onEditTask: (task: Task) => void;
    onAddTask: () => void;
    onShowTaskDetails: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ title, tasks, people, icon, onTaskStatusChange, onEditTask, onAddTask, onShowTaskDetails }) => (
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl transition-colors">
        <div className="flex items-center gap-2 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>
        <div>
            {tasks.length > 0 ? tasks.map(task => {
                const person = task.personId ? people.find(p => p.id === task.personId) : undefined;
                return (
                    <TaskItem 
                        key={task.id} 
                        task={task} 
                        person={person}
                        onStatusChange={(newStatus) => onTaskStatusChange(task.id, newStatus)}
                        onEdit={onEditTask}
                        onShowDetails={onShowTaskDetails}
                    />
                );
            }) : (
                <div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
                    No active tasks.
                </div>
            )}
             <button
                onClick={onAddTask}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
             >
                <PlusCircleIcon className="w-5 h-5" />
                Add Task
            </button>
        </div>
    </div>
);


interface ActivityLogProps {
    log: LogEntry[];
    people: Person[];
    onAddComment: (commentText: string, attachments: Attachment[]) => void;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ log, people, onAddComment }) => {
    const [comment, setComment] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim() || attachments.length > 0) {
            onAddComment(comment.trim(), attachments);
            setComment('');
            setAttachments([]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                alert(`File "${file.name}" is too large. Please select files smaller than 4MB.`);
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const newAttachment: Attachment = {
                    id: `att-${Date.now()}-${Math.random()}`,
                    name: file.name,
                    url: event.target?.result as string,
                    type: file.type.startsWith('image/') ? 'image' : 'document',
                };
                setAttachments(prev => [...prev, newAttachment]);
            };
            reader.readAsDataURL(file);
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
     const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(att => att.id !== id));
    };
    
    const timeAgo = (timestamp: string) => {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "just now";
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl transition-colors h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Activity Log</h3>
            <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                {log.map(entry => {
                    const person = entry.personId ? people.find(p => p.id === entry.personId) : null;
                    return (
                        <div key={entry.id} className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                                {person ? (
                                    <img src={person.avatarUrl} alt={person.name} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                                        <InformationCircleIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-800 dark:text-slate-200">
                                    {person && <span className="font-semibold">{person.name} </span>}
                                    {entry.text}
                                </p>
                                {entry.attachments && entry.attachments.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                         <div className="flex flex-wrap gap-2">
                                            {entry.attachments.map(att => (
                                                att.type === 'image' ? (
                                                    <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-md overflow-hidden">
                                                        <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                                                    </a>
                                                ) : (
                                                    <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-secondary hover:underline bg-blue-50 dark:bg-slate-700 px-2 py-1 rounded" title={att.name}>
                                                        <DocumentTextIcon className="w-4 h-4 inline-block mr-1" />
                                                        {att.name.length > 20 ? `${att.name.substring(0, 18)}...` : att.name}
                                                    </a>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{timeAgo(entry.timestamp)}</p>
                            </div>
                        </div>
                    );
                })}
                 <div ref={logEndRef} />
            </div>
            <form onSubmit={handleCommentSubmit} className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="relative">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment or update..."
                        rows={2}
                        className="w-full pl-4 pr-24 py-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                        <input type="file" multiple onChange={handleFileChange} ref={fileInputRef} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                         <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full text-slate-500 hover:text-brand-secondary transition-colors" aria-label="Add attachments">
                             <PaperClipIcon className="w-5 h-5" />
                         </button>
                         <button type="submit" className="px-3 py-1.5 text-sm font-semibold rounded-md bg-brand-secondary text-white hover:bg-brand-primary disabled:bg-slate-300 dark:disabled:bg-slate-600" disabled={!comment.trim() && attachments.length === 0}>
                            Post
                        </button>
                    </div>
                </div>
                 {attachments.length > 0 && (
                    <div className="mt-2 text-xs">
                        <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                        {attachments.map(att => (
                            <div key={att.id} className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 rounded-full pl-2 pr-1 py-0.5">
                                <span>{att.name.length > 15 ? `${att.name.substring(0, 13)}...` : att.name}</span>
                                <button type="button" onClick={() => removeAttachment(att.id)} className="text-slate-500 hover:text-red-500">
                                    <XMarkIcon className="w-3 h-3"/>
                                </button>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

interface PropertyDetailProps {
    property: Property;
    onBack: () => void;
    onTaskStatusChange: (propertyId: number, processType: ProcessType, taskId: string, newStatus: TaskStatus) => void;
    onImageChange: (propertyId: number, newImageUrl: string) => void;
    onAddressChange: (propertyId: number, newAddress: string) => void;
    onOpenTaskModal: (propertyId: number, processType: ProcessType, task?: Task) => void;
    onAddComment: (propertyId: number, commentText: string, attachments: Attachment[]) => void;
    onShowTaskDetails: (task: Task) => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, onBack, onTaskStatusChange, onImageChange, onAddressChange, onOpenTaskModal, onAddComment, onShowTaskDetails }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [address, setAddress] = useState(property.address);
    const [showCompleted, setShowCompleted] = useState(true);
    const addressInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingAddress) {
            addressInputRef.current?.focus();
        }
    }, [isEditingAddress]);

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) { // 4MB limit
            alert("File is too large. Please select an image smaller than 4MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const newImageUrl = reader.result as string;
            if (newImageUrl) {
                onImageChange(property.id, newImageUrl);
            }
        };
        reader.onerror = () => {
            console.error("Error reading file.");
            alert("There was a problem uploading the image.");
        };
        reader.readAsDataURL(file);
    };
    
    const handleNavigate = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.address)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleAddressSave = () => {
        if (address.trim() && address.trim() !== property.address) {
            onAddressChange(property.id, address.trim());
        } else {
            setAddress(property.address); // Revert if empty or unchanged
        }
        setIsEditingAddress(false);
    };

    const permittingTasks = useMemo(() => 
        showCompleted ? property.permitting.tasks : property.permitting.tasks.filter(t => t.status !== TaskStatus.Completed),
        [property.permitting.tasks, showCompleted]
    );

    const constructionTasks = useMemo(() =>
        showCompleted ? property.construction.tasks : property.construction.tasks.filter(t => t.status !== TaskStatus.Completed),
        [property.construction.tasks, showCompleted]
    );

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-secondary dark:text-blue-400 hover:text-brand-primary dark:hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back to Dashboard
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-6 transition-colors">
                <div className="relative group">
                    <img src={property.imageUrl} alt={property.address} className="w-full h-48 object-cover rounded-xl mb-4" />
                    <button
                        onClick={handleImageUploadClick}
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-xl cursor-pointer transition-opacity duration-300"
                        aria-label="Change property image"
                    >
                        <PencilIcon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                    />
                </div>
                 <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2">
                            {isEditingAddress ? (
                                <input
                                    ref={addressInputRef}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    onBlur={handleAddressSave}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddressSave()}
                                    className="text-2xl font-bold bg-transparent text-slate-900 dark:text-slate-100 border-b-2 border-brand-secondary focus:outline-none w-full"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{property.address}</h2>
                            )}
                             <button onClick={() => setIsEditingAddress(!isEditingAddress)} className="p-1 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white" aria-label="Edit address">
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleNavigate}
                        className="ml-4 flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-secondary bg-brand-light dark:bg-slate-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-slate-600 transition-colors"
                        aria-label={`Navigate to ${property.address}`}
                    >
                        <MapPinIcon className="w-5 h-5" />
                        <span>Navigate</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <div className="flex justify-end">
                        <label htmlFor="show-completed" className="flex items-center cursor-pointer">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mr-3">Show Completed</span>
                            <div className="relative">
                                <input type="checkbox" id="show-completed" className="sr-only peer" checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />
                                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-secondary"></div>
                            </div>
                        </label>
                    </div>
                    <TaskList
                        title="Permitting Process"
                        icon={<DocumentTextIcon className="w-6 h-6 text-brand-secondary" />}
                        tasks={permittingTasks}
                        people={property.people}
                        onTaskStatusChange={(taskId, newStatus) => onTaskStatusChange(property.id, ProcessType.Permitting, taskId, newStatus)}
                        onEditTask={(task) => onOpenTaskModal(property.id, ProcessType.Permitting, task)}
                        onAddTask={() => onOpenTaskModal(property.id, ProcessType.Permitting)}
                        onShowTaskDetails={onShowTaskDetails}
                    />
                    <TaskList
                        title="Construction Phases"
                        icon={<WrenchScrewdriverIcon className="w-6 h-6 text-brand-secondary" />}
                        tasks={constructionTasks}
                        people={property.people}
                        onTaskStatusChange={(taskId, newStatus) => onTaskStatusChange(property.id, ProcessType.Construction, taskId, newStatus)}
                        onEditTask={(task) => onOpenTaskModal(property.id, ProcessType.Construction, task)}
                        onAddTask={() => onOpenTaskModal(property.id, ProcessType.Construction)}
                        onShowTaskDetails={onShowTaskDetails}
                    />
                </div>
                 <div className="lg:col-span-1">
                     <ActivityLog 
                        log={property.activityLog} 
                        people={property.people}
                        onAddComment={(comment, attachments) => onAddComment(property.id, comment, attachments)}
                    />
                </div>
            </div>
        </div>
    );
};

interface DashboardProps {
    data: any[];
    theme: 'light' | 'dark';
}

const Dashboard: React.FC<DashboardProps> = ({ data, theme }) => {
    const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
    const tooltipBg = theme === 'dark' ? '#1e293b' : 'white';
    const tooltipBorder = theme === 'dark' ? '#334155' : '#e2e8f0';

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg animate-fade-in transition-colors">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Project Status Overview</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Aggregate task status across all properties.</p>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="name" tick={{ fill: tickColor }} />
                        <YAxis tick={{ fill: tickColor }} />
                        <Tooltip
                            cursor={{fill: theme === 'dark' ? 'rgba(100, 116, 139, 0.3)' : 'rgba(203, 213, 225, 0.5)' }}
                            contentStyle={{
                                background: tooltipBg,
                                border: `1px solid ${tooltipBorder}`,
                                borderRadius: '0.5rem',
                            }}
                            labelStyle={{ color: tickColor }}
                        />
                        <Legend wrapperStyle={{ color: tickColor, paddingTop: '20px' }} />
                        <Bar dataKey={TaskStatus.Completed} stackId="a" fill="#10b981" name="Completed" />
                        <Bar dataKey={TaskStatus.InProgress} stackId="a" fill="#3b82f6" name="In Progress" />
                        <Bar dataKey={TaskStatus.Blocked} stackId="a" fill="#ef4444" name="Blocked" />
                        <Bar dataKey={TaskStatus.NotStarted} stackId="a" fill="#6b7280" name="Not Started" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

interface TeamDirectoryProps {
    people: Person[];
    onEditPerson: (person: Person) => void;
}

const TeamDirectory: React.FC<TeamDirectoryProps> = ({ people, onEditPerson }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPeople = useMemo(() => {
        if (!searchTerm) return people;
        return people.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [people, searchTerm]);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg animate-fade-in transition-colors">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Team Directory</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Contact information for all project members.</p>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, role, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-transparent text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPeople.map(person => (
                    <div key={person.id} className="relative bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => onEditPerson(person)}
                            className="absolute top-2 right-2 p-1.5 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
                            aria-label={`Edit ${person.name}`}
                        >
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-4 mb-3">
                            <img src={person.avatarUrl} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="font-bold text-slate-800 dark:text-slate-100">{person.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{person.role}</p>
                            </div>
                        </div>
                         <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2 text-sm">
                            <a href={`tel:${person.phone}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-secondary dark:hover:text-blue-400 transition-colors">
                                <PhoneIcon className="w-4 h-4" />
                                <span>{person.phone}</span>
                            </a>
                            <a href={`mailto:${person.email}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-secondary dark:hover:text-blue-400 transition-colors">
                                <EnvelopeIcon className="w-4 h-4" />
                                <span>{person.email}</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getNextStep = (property: Property): { task: Task; person?: Person } | null => {
    const tasks = [...property.permitting.tasks, ...property.construction.tasks];
    
    const findTaskByStatus = (status: TaskStatus) => tasks.find(t => t.status === status);

    let nextTask = findTaskByStatus(TaskStatus.InProgress) || findTaskByStatus(TaskStatus.Blocked);

    if (!nextTask) return null;

    const person = property.people.find(p => p.id === nextTask?.personId);
    return { task: nextTask, person };
}

interface PropertyCardProps {
    property: Property;
    onSelectProperty: (id: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelectProperty }) => {
    const nextStep = getNextStep(property);

    return (
        <button
            onClick={() => onSelectProperty(property.id)}
            className="relative block w-full h-64 rounded-xl overflow-hidden shadow-lg group text-left transform hover:-translate-y-1 transition-transform duration-300"
            aria-label={`View details for ${property.address}`}
        >
            <img src={property.imageUrl} alt={property.address} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full text-white flex flex-col justify-end h-full">
                <div>
                    <h3 className="font-bold text-lg leading-tight">{property.address}</h3>
                    {nextStep ? (
                        <div className="mt-2 pt-2 border-t border-white/20">
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Next Step</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 flex-shrink-0 ${statusConfig[nextStep.task.status].color.replace('text-', 'text-white/80')}`}>
                                    {React.createElement(statusConfig[nextStep.task.status].icon, { className: 'w-5 h-5' })}
                                </div>
                                <span className="text-sm truncate font-medium">{nextStep.task.name}</span>
                                {nextStep.person && (
                                    <img src={nextStep.person.avatarUrl} title={nextStep.person.name} alt={nextStep.person.name} className="w-6 h-6 rounded-full ml-auto flex-shrink-0 ring-1 ring-white object-cover" />
                                )}
                            </div>
                        </div>
                    ) : (
                         <div className="mt-2 pt-2 border-t border-white/20">
                             <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Status</p>
                            <div className="flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 text-status-completed" />
                                <span className="text-sm font-medium">All tasks completed</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
};


interface HeaderProps {
    onDashboardClick: () => void;
    onTeamClick: () => void;
    toggleTheme: () => void;
    theme: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ onDashboardClick, onTeamClick, toggleTheme, theme }) => (
  <header className="bg-white dark:bg-slate-800 shadow-sm mb-8 transition-colors">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-brand-primary p-2 rounded-lg">
          <HomeIcon className="w-6 h-6 text-white"/>
        </div>
        <h1 className="text-2xl font-bold text-brand-primary dark:text-brand-light">
          Builders.TX
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
            onClick={onDashboardClick} 
            className="px-4 py-2 text-sm font-medium text-brand-secondary bg-brand-light dark:bg-slate-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-slate-600 transition"
        >
            Dashboard
        </button>
        <button 
            onClick={onTeamClick} 
            className="px-4 py-2 text-sm font-medium text-brand-secondary bg-brand-light dark:bg-slate-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-slate-600 transition"
        >
            Team
        </button>
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 focus:ring-brand-secondary"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>
    </div>
  </header>
);

interface TaskEditModalProps {
    taskInfo: { propertyId: number; processType: ProcessType; task?: Task };
    people: Person[];
    onClose: () => void;
    onSave: (propertyId: number, processType: ProcessType, taskData: Task) => void;
    onDelete: (propertyId: number, processType: ProcessType, taskId: string) => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ taskInfo, people, onClose, onSave, onDelete }) => {
    const { task } = taskInfo;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: task?.name || '',
        status: task?.status || TaskStatus.NotStarted,
        personId: task?.personId || '',
        date: task?.date ? task.date.split('T')[0] : '',
        dateLabel: task?.dateLabel || '',
        notes: task?.notes || '',
        feeAmount: task?.fee?.amount || 0,
        feePaid: task?.fee?.paid || false,
    });
    const [attachments, setAttachments] = useState<Attachment[]>(task?.attachments || []);


    useEffect(() => {
        setFormData({
            name: task?.name || '',
            status: task?.status || TaskStatus.NotStarted,
            personId: task?.personId || '',
            date: task?.date ? task.date.split('T')[0] : '',
            dateLabel: task?.dateLabel || '',
            notes: task?.notes || '',
            feeAmount: task?.fee?.amount || 0,
            feePaid: task?.fee?.paid || false,
        });
        setAttachments(task?.attachments || []);
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                alert(`File "${file.name}" is too large. Please select files smaller than 4MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const newAttachment: Attachment = {
                    id: `att-${Date.now()}-${Math.random()}`,
                    name: file.name,
                    url: event.target?.result as string,
                    type: file.type.startsWith('image/') ? 'image' : 'document',
                };
                setAttachments(prev => [...prev, newAttachment]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(att => att.id !== id));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const savedTask: Task = {
            id: task?.id || `task-${Date.now()}`,
            name: formData.name,
            status: formData.status,
            personId: formData.personId || undefined,
            notes: formData.notes || undefined,
            date: formData.date || undefined,
            dateLabel: formData.dateLabel || undefined,
            fee: formData.feeAmount > 0 ? {
                amount: Number(formData.feeAmount),
                paid: formData.feePaid,
            } : undefined,
            attachments: attachments,
        };
        onSave(taskInfo.propertyId, taskInfo.processType, savedTask);
    };

    const handleDelete = () => {
        if (task && window.confirm(`Are you sure you want to delete the task "${task.name}"?`)) {
            onDelete(taskInfo.propertyId, taskInfo.processType, task.id);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{task ? 'Edit Task' : 'Add New Task'}</h2>
                        <div className="space-y-4">
                             <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Task Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary">
                                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned To</label>
                                    <select name="personId" value={formData.personId} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary">
                                        <option value="">Unassigned</option>
                                        {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date Label</label>
                                    <input type="text" name="dateLabel" placeholder="e.g., Due, Issued" value={formData.dateLabel} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4 items-center">
                                 <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fee Amount ($)</label>
                                    <input type="number" name="feeAmount" value={formData.feeAmount} onChange={handleChange} min="0" className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
                                </div>
                                 <div className="pt-6">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <input type="checkbox" name="feePaid" checked={formData.feePaid} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"/>
                                        Fee Paid
                                    </label>
                                </div>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Attachments</label>
                                <div className="mt-1 space-y-2">
                                    {attachments.map(att => (
                                        <div key={att.id} className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md">
                                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-secondary hover:underline truncate" title={att.name}>
                                                {att.name}
                                            </a>
                                            <button type="button" onClick={() => removeAttachment(att.id)} className="text-slate-500 hover:text-red-500 ml-2">
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <input type="file" multiple onChange={handleFileChange} ref={fileInputRef} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                    <PaperClipIcon className="w-4 h-4" />
                                    Add Files...
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
                        <div>
                        {task && (
                             <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md">
                                 <TrashIcon className="w-4 h-4" />
                                 Delete
                             </button>
                        )}
                        </div>
                        <div className="flex gap-2">
                             <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
                             <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-md">Save Changes</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface PersonEditModalProps {
    person: Person;
    onClose: () => void;
    onSave: (personData: Person) => void;
}

const PersonEditModal: React.FC<PersonEditModalProps> = ({ person, onClose, onSave }) => {
    const [formData, setFormData] = useState<Person>(person);

    useEffect(() => {
        setFormData(person);
    }, [person]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Edit Contact Info</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                                <input type="text" name="role" value={formData.role} onChange={handleChange} required className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
                                </div>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Avatar URL</label>
                                <input type="text" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
                        <div className="flex gap-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-md">Save Changes</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface PermitDetailModalProps {
    task: Task;
    onClose: () => void;
}

const PermitDetailModal: React.FC<PermitDetailModalProps> = ({ task, onClose }) => {
    if (!task.permitDetails) return null;
    const { permitDetails: details } = task;

    const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div>
            <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 pb-2 mb-3">{title}</h3>
            {children}
        </div>
    );

    const InfoPair: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
        value ? <p className="text-sm"><span className="font-semibold text-slate-600 dark:text-slate-400">{label}: </span>{value}</p> : null
    );
    
    const ContactBlock: React.FC<{ title: string; person: {name: string; company?: string; phone: string; email?: string; address: string; licenseInfo?: string;} }> = ({title, person}) => (
        <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300">{title}</h4>
            <p className="text-sm">{person.name}{person.company && `, ${person.company}`}</p>
            <p className="text-sm">{person.address}</p>
            {person.phone && <p className="text-sm">Phone: {person.phone}</p>}
            {person.email && <p className="text-sm">Email: {person.email}</p>}
            {person.licenseInfo && <p className="text-sm">License: {person.licenseInfo}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl m-4" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{task.name} - Details</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Record: {details.recordNumber} | Status: <span className="font-semibold">{details.recordStatus}</span></p>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                    <DetailSection title="Project & Scope">
                        <InfoPair label="Project Description" value={details.projectDescription} />
                        <p className="text-sm mt-2"><span className="font-semibold text-slate-600 dark:text-slate-400">Scope of Work: </span>{details.scopeOfWork}</p>
                    </DetailSection>

                    <DetailSection title="Key Contacts">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <ContactBlock title="Owner" person={{name: details.owner.name, address: details.owner.address, phone: ''}} />
                             <ContactBlock title="Applicant" person={{name: details.applicant.name, address: details.applicant.mailingAddress, phone: details.applicant.phone, email: details.applicant.email}} />
                             <ContactBlock title="Licensed Professional" person={details.licensedProfessional} />
                         </div>
                    </DetailSection>
                    
                     <DetailSection title="Application Information">
                        <InfoPair label="Addition Square Footage" value={details.applicationInfo.additionSqFt} />
                        <InfoPair label="Deck Square Footage" value={details.applicationInfo.deckSqFt} />
                        <InfoPair label="Trades Involved" value={details.applicationInfo.trades.join(', ')} />
                    </DetailSection>

                    <DetailSection title="GIS Information">
                        <InfoPair label="Parcel Number" value={details.gisInfo.parcelNumber} />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                        {details.gisInfo.jurisdictions.map(i => <InfoPair key={i.type} label={i.type} value={i.value} />)}
                        {details.gisInfo.landDevelopment.map(i => <InfoPair key={i.type} label={i.type} value={i.value} />)}
                        {details.gisInfo.waterAreas.map(i => <InfoPair key={i.type} label={i.type} value={i.value} />)}
                        {details.gisInfo.zoningBase.map(i => <InfoPair key={i.baseZone} label="Base Zone" value={`${i.baseZone} (Case: ${i.caseNumber})`} />)}
                        {details.gisInfo.zoningOverlay.map(i => <InfoPair key={i.type} label={i.type} value={i.value} />)}
                        </div>
                    </DetailSection>

                </div>
                 <div className="flex justify-end p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-md">Close</button>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---
const App: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [mainView, setMainView] = useState<'dashboard' | 'team'>('dashboard');
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
    const [editingTaskInfo, setEditingTaskInfo] = useState<{ propertyId: number; processType: ProcessType; task?: Task } | null>(null);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<Task | null>(null);


    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleTaskStatusChange = useCallback((propertyId: number, processType: ProcessType, taskId: string, newStatus: TaskStatus) => {
        setProperties(prevProperties =>
            prevProperties.map(prop => {
                if (prop.id === propertyId) {
                    const task = prop[processType].tasks.find(t => t.id === taskId);
                    if (!task) return prop;

                    const person = prop.people.find(p => p.id === task.personId);
                    const logText = `Status of "${task.name}" changed to ${newStatus}.`;
                    
                    const newLogEntry: LogEntry = {
                        id: `log-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        personId: person?.id,
                        type: 'event',
                        text: logText,
                    };

                    const updatedProcess = {
                        ...prop[processType],
                        tasks: prop[processType].tasks.map(t =>
                            t.id === taskId ? { ...t, status: newStatus } : t
                        ),
                    };
                    return { ...prop, [processType]: updatedProcess, activityLog: [newLogEntry, ...prop.activityLog] };
                }
                return prop;
            })
        );
    }, []);

    const handlePropertyImageChange = useCallback((propertyId: number, newImageUrl: string) => {
        setProperties(prevProperties =>
            prevProperties.map(prop => {
                 if (prop.id === propertyId) {
                    const newLogEntry: LogEntry = {
                        id: `log-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        type: 'event',
                        text: 'Property image was updated.',
                    };
                    return { ...prop, imageUrl: newImageUrl, activityLog: [newLogEntry, ...prop.activityLog] };
                }
                return prop;
            })
        );
    }, []);
    
    const handleAddressChange = useCallback((propertyId: number, newAddress: string) => {
        setProperties(prevProperties =>
            prevProperties.map(prop => {
                if (prop.id === propertyId) {
                    const newLogEntry: LogEntry = {
                        id: `log-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        type: 'event',
                        text: `Property address was updated to "${newAddress}".`,
                    };
                    return { ...prop, address: newAddress, activityLog: [newLogEntry, ...prop.activityLog] };
                }
                return prop;
            })
        );
    }, []);

    const handleSaveTask = useCallback((propertyId: number, processType: ProcessType, taskData: Task) => {
        setProperties(prev => prev.map(prop => {
            if (prop.id !== propertyId) return prop;
            
            const process = prop[processType];
            const oldTask = process.tasks.find(t => t.id === taskData.id);

            let logText = '';
            const person = prop.people.find(p => p.id === taskData.personId);

            if (oldTask) {
                logText = `Task "${taskData.name}" was updated.`;
                const oldAttachmentsCount = oldTask.attachments?.length || 0;
                const newAttachmentsCount = taskData.attachments?.length || 0;
                if (newAttachmentsCount > oldAttachmentsCount) {
                    const addedCount = newAttachmentsCount - oldAttachmentsCount;
                    logText += ` ${addedCount} attachment(s) added.`
                }
            } else {
                logText = `Task "${taskData.name}" was created`;
                if (person) logText += ` and assigned to ${person.name}.`;
            }

            const newLogEntry: LogEntry = {
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString(),
                personId: person?.id,
                type: 'event',
                text: logText,
            };

            const newTasks = oldTask
                ? process.tasks.map(t => t.id === taskData.id ? taskData : t)
                : [...process.tasks, taskData];

            return { 
                ...prop, 
                [processType]: { ...process, tasks: newTasks },
                activityLog: [newLogEntry, ...prop.activityLog]
            };
        }));
        setEditingTaskInfo(null);
    }, []);

    const handleDeleteTask = useCallback((propertyId: number, processType: ProcessType, taskId: string) => {
        setProperties(prev => prev.map(prop => {
            if (prop.id !== propertyId) return prop;
            const process = prop[processType];
            const taskToDelete = process.tasks.find(t => t.id === taskId);
            if (!taskToDelete) return prop;

            const newLogEntry: LogEntry = {
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: 'event',
                text: `Task "${taskToDelete.name}" was deleted.`,
            };

            return {
                ...prop,
                [processType]: {
                    ...process,
                    tasks: process.tasks.filter(t => t.id !== taskId),
                },
                activityLog: [newLogEntry, ...prop.activityLog]
            };
        }));
        setEditingTaskInfo(null);
    }, []);
    
    const handleSavePerson = useCallback((updatedPerson: Person) => {
        setProperties(prevProperties =>
            prevProperties.map(prop => ({
                ...prop,
                people: prop.people.map(p =>
                    p.id === updatedPerson.id ? updatedPerson : p
                ),
            }))
        );
        setEditingPerson(null);
    }, []);

    const handleAddComment = useCallback((propertyId: number, commentText: string, attachments: Attachment[]) => {
        const newLogEntry: LogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            personId: 'person-roy', // NOTE: In a real app, this would be the current logged-in user.
            type: 'comment',
            text: commentText,
            attachments: attachments.length > 0 ? attachments : undefined,
        };
        setProperties(prev => prev.map(p => 
            p.id === propertyId 
            ? { ...p, activityLog: [newLogEntry, ...p.activityLog] }
            : p
        ));
    }, []);
    
    const dashboardData = useMemo(() => {
        const statusCounts = properties.reduce((acc, prop) => {
            const allTasks = [...prop.permitting.tasks, ...prop.construction.tasks];
            allTasks.forEach(task => {
                acc[task.status] = (acc[task.status] || 0) + 1;
            });
            return acc;
        }, {} as Record<TaskStatus, number>);

        return [{
            name: 'All Projects',
            [TaskStatus.Completed]: statusCounts[TaskStatus.Completed] || 0,
            [TaskStatus.InProgress]: statusCounts[TaskStatus.InProgress] || 0,
            [TaskStatus.Blocked]: statusCounts[TaskStatus.Blocked] || 0,
            [TaskStatus.NotStarted]: statusCounts[TaskStatus.NotStarted] || 0,
        }];

    }, [properties]);
    
    const allPeople = useMemo(() => {
        const peopleMap = new Map<string, Person>();
        properties.forEach(prop => {
            prop.people.forEach(person => {
                if (!peopleMap.has(person.id)) {
                    peopleMap.set(person.id, person);
                }
            });
        });
        return Array.from(peopleMap.values());
    }, [properties]);
    
    const selectedProperty = useMemo(() => {
        return properties.find(p => p.id === selectedPropertyId) || null;
    }, [properties, selectedPropertyId]);

    const handleSelectProperty = (id: number) => {
        setSelectedPropertyId(id);
        setMainView('dashboard');
    };
    
    const showDashboard = () => {
        setSelectedPropertyId(null);
        setMainView('dashboard');
    }
    
    const showTeam = () => {
        setSelectedPropertyId(null);
        setMainView('team');
    }
    
    const handleShowTaskDetails = useCallback((task: Task) => {
        if(task.permitDetails) {
            setSelectedTaskForDetails(task);
        }
    }, []);

    const renderMainContent = () => {
        if (selectedProperty) {
            return (
                 <PropertyDetail
                    property={selectedProperty}
                    onBack={showDashboard}
                    onTaskStatusChange={handleTaskStatusChange}
                    onImageChange={handlePropertyImageChange}
                    onAddressChange={handleAddressChange}
                    onOpenTaskModal={(propId, procType, task) => setEditingTaskInfo({ propertyId: propId, processType: procType, task })}
                    onAddComment={handleAddComment}
                    onShowTaskDetails={handleShowTaskDetails}
                />
            );
        }
        if (mainView === 'team') {
            return <TeamDirectory people={allPeople} onEditPerson={setEditingPerson} />;
        }
        
        // Main Dashboard View
        return (
             <div className="animate-fade-in">
                <Dashboard data={dashboardData} theme={theme} />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">Properties</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(prop => (
                        <PropertyCard 
                            key={prop.id}
                            property={prop}
                            onSelectProperty={handleSelectProperty} 
                        />
                    ))}
                </div>
             </div>
        )
    };

    return (
        <>
            <Header onDashboardClick={showDashboard} onTeamClick={showTeam} toggleTheme={toggleTheme} theme={theme} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {renderMainContent()}
            </main>
            {editingTaskInfo && (
                <TaskEditModal
                    taskInfo={editingTaskInfo}
                    people={allPeople}
                    onClose={() => setEditingTaskInfo(null)}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                />
            )}
            {editingPerson && (
                <PersonEditModal
                    person={editingPerson}
                    onClose={() => setEditingPerson(null)}
                    onSave={handleSavePerson}
                />
            )}
            {selectedTaskForDetails && (
                <PermitDetailModal
                    task={selectedTaskForDetails}
                    onClose={() => setSelectedTaskForDetails(null)}
                />
            )}
            <AIAssistant />
        </>
    );
};

export default App;