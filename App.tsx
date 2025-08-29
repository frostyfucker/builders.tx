import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Property, Task, ProcessType, TaskStatus, Person, Process, LogEntry, PermitDetail } from './types';
import { INITIAL_PROPERTIES, ALL_PEOPLE } from './constants';
import { getAIActions, parsePermitInfo, parsePermitDetailsFromText } from './services/geminiService';
import AIAssistant from './components/AIAssistant';

const CURRENT_USER_ID = 'person-dane';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const ArrowUpOnSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3v11.25" />
    </svg>
);

const WrenchScrewdriverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.206-.862m-3.702 3.894L9.42 11.42l-2.496 3.03c-.317.384-.74.664-1.206.862M11.42 15.17 6.375 20.22a2.652 2.652 0 0 1-3.75 0L1.5 18.885a2.652 2.652 0 0 1 0-3.75l5.046-5.046m5.877 5.877L15.17 11.42m0 0L9.42 5.667a2.652 2.652 0 0 1 0-3.75l1.06-1.061a2.652 2.652 0 0 1 3.75 0l5.877 5.877m-5.877 5.877L11.42 15.17" />
    </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253 9.5 9.5 0 0 0-1.255-7.147 9.383 9.383 0 0 0-2.822-2.185 9.337 9.337 0 0 0-4.121 2.253 9.5 9.5 0 0 0 1.255 7.147 9.383 9.383 0 0 0 2.822 2.185ZM15 19.128v-1.128M15 19.128a9.383 9.383 0 0 1-2.822 2.185 9.337 9.337 0 0 1-4.121-2.253 9.5 9.5 0 0 1 1.255-7.147 9.383 9.383 0 0 1 2.822-2.185 9.337 9.337 0 0 1 4.121 2.253 9.5 9.5 0 0 1-1.255 7.147 9.383 9.383 0 0 1-2.822-2.185Zm-3-9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3 20.25a3 3 0 0 1 3-3h1.372a9.38 9.38 0 0 0-.16-1.128 9.5 9.5 0 0 0-1.215-3.033 9.383 9.383 0 0 0-2.822-2.185 9.337 9.337 0 0 0-4.121 2.253 9.5 9.5 0 0 0 1.255 7.147 9.383 9.383 0 0 0 2.822 2.185 9.337 9.337 0 0 0 4.121-2.253 9.5 9.5 0 0 0-1.255-7.147 9.383 9.383 0 0 0-2.822-2.185Zm-3-9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);


// --- Helper Functions ---
const getStatusColor = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.Completed: return 'bg-status-completed';
        case TaskStatus.InProgress: return 'bg-status-inprogress';
        case TaskStatus.Blocked: return 'bg-status-blocked';
        case TaskStatus.NotStarted: return 'bg-status-notstarted';
        default: return 'bg-gray-500';
    }
};

const getStatusBorderColor = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.Completed: return 'border-status-completed';
        case TaskStatus.InProgress: return 'border-status-inprogress';
        case TaskStatus.Blocked: return 'border-status-blocked';
        case TaskStatus.NotStarted: return 'border-status-notstarted';
        default: return 'border-gray-500';
    }
};

const getStatusTextAndBgColor = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.Completed: return 'text-emerald-800 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/50';
        case TaskStatus.InProgress: return 'text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/50';
        case TaskStatus.Blocked: return 'text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/50';
        case TaskStatus.NotStarted: return 'text-slate-800 bg-slate-200 dark:text-slate-200 dark:bg-slate-700';
        default: return 'text-gray-800 bg-gray-100';
    }
};

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
};

const calculateProgress = (tasks: Task[]): number => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.Completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
};

// --- Child Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'md' | 'lg' | 'xl' | '2xl' }> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity animate-fade-in-fast" onClick={onClose}>
            <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} relative transform transition-all animate-slide-in-up-fast`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

const TaskCard: React.FC<{ task: Task; processType: ProcessType; people: Person[]; onEditTask: (task: Task, processType: ProcessType) => void; onDeleteTask: (taskId: string, processType: ProcessType) => void; onViewDetails: (task: Task) => void; }> = ({ task, processType, people, onEditTask, onDeleteTask, onViewDetails }) => {
    const person = people.find(p => p.id === task.personId);

    return (
        <div className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border-l-4 ${getStatusBorderColor(task.status)} hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start">
                <p className="font-semibold text-slate-800 dark:text-slate-100 pr-2">{task.name}</p>
                <div className="flex-shrink-0 relative group">
                    <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                    </button>
                    <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                        <button onClick={() => onEditTask(task, processType)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">Edit</button>
                        <button onClick={() => onDeleteTask(task.id, processType)} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600">Delete</button>
                    </div>
                </div>
            </div>
            {task.notes && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{task.notes}</p>}
            
            {processType === ProcessType.Permitting && (
                 <div className="mt-3">
                     <button onClick={() => onViewDetails(task)} className="text-xs font-semibold text-brand-secondary hover:underline">
                         {task.permitDetails ? 'View Details' : 'Add Details'}
                     </button>
                 </div>
             )}

            <div className="flex justify-between items-center mt-3">
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusTextAndBgColor(task.status)}`}>{task.status}</div>
                {person && (
                    <div className="flex items-center gap-2" title={`${person.name} (${person.role})`}>
                        <img src={person.avatarUrl} alt={person.name} className="w-6 h-6 rounded-full" />
                    </div>
                )}
            </div>
        </div>
    );
};

const ProcessSection: React.FC<{ title: string; processType: ProcessType; process: Process; people: Person[]; onEditTask: (task: Task, processType: ProcessType) => void; onAddTask: (processType: ProcessType, initialTask?: Partial<Task>) => void; onDeleteTask: (taskId: string, processType: ProcessType) => void; onViewDetails: (task: Task) => void; }> = ({ title, processType, process, people, onEditTask, onAddTask, onDeleteTask, onViewDetails }) => {
    return (
        <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
                <button onClick={() => onAddTask(processType)} className="text-brand-secondary hover:text-blue-700 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                {process.tasks.map(task => (
                    <TaskCard key={task.id} task={task} processType={processType} people={people} onEditTask={onEditTask} onDeleteTask={onDeleteTask} onViewDetails={onViewDetails} />
                ))}
            </div>
        </div>
    );
};

const AISuggestions: React.FC<{ property: Property; people: Person[]; onAddTask: (processType: ProcessType, initialTask?: Partial<Task>) => void; }> = ({ property, people, onAddTask }) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getAIActions(property, people);
                const data = JSON.parse(response.text);
                setSuggestions(data.suggestions || []);
            } catch (e: any) {
                setError("Failed to load AI suggestions.");
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [property, people]);

    const handleCreateTask = (processType: ProcessType, suggestion: any) => {
        onAddTask(processType, {
            name: suggestion.title,
            notes: suggestion.description,
            status: TaskStatus.NotStarted
        });
    };

    return (
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-brand-primary" />
                AI Suggested Next Steps
            </h3>
            {isLoading && <p>Loading suggestions...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p className="font-semibold">{suggestion.title}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-3">{suggestion.description}</p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleCreateTask(ProcessType.Permitting, suggestion)} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900">Add to Permitting</button>
                                <button onClick={() => handleCreateTask(ProcessType.Construction, suggestion)} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900">Add to Construction</button>
                                <button onClick={() => handleCreateTask(ProcessType.Management, suggestion)} className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900">Add to Management</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TaskFormModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (task: Task, processType: ProcessType) => void; task: Partial<Task>; processType: ProcessType; people: Person[]; }> = ({ isOpen, onClose, onSave, task, processType, people }) => {
    const [formData, setFormData] = useState<Partial<Task>>({});

    useEffect(() => {
        setFormData(task);
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Task, processType);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={task.id ? "Edit Task" : "Add Task"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Task Name</label>
                    <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                    <select name="status" id="status" value={formData.status || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600">
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="personId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Assign To</label>
                    <select name="personId" id="personId" value={formData.personId || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600">
                        <option value="">Unassigned</option>
                        {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
                    <textarea name="notes" id="notes" rows={3} value={formData.notes || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                        <input type="date" name="startDate" id="startDate" value={formData.startDate || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
                        <input type="date" name="endDate" id="endDate" value={formData.endDate || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">Save Task</button>
                </div>
            </form>
        </Modal>
    );
};

type DetailViewMode = 'board' | 'list' | 'timeline';
type AppView = 'dashboard' | 'property' | 'team';


// --- View Components ---

const ListView: React.FC<{ property: Property, people: Person[], onEditTask: (task: Task, processType: ProcessType) => void; }> = ({ property, people, onEditTask }) => {
    const renderProcessList = (title: string, process: Process, processType: ProcessType) => (
        <div key={title}>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-3">{title}</h3>
            <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg overflow-hidden">
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {process.tasks.map(task => {
                        const person = people.find(p => p.id === task.personId);
                        return (
                            <li key={task.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                    <div className="md:col-span-2">
                                        <p className="font-semibold">{task.name}</p>
                                        <p className="text-sm text-slate-500 truncate">{task.notes}</p>
                                    </div>
                                    <div><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusTextAndBgColor(task.status)}`}>{task.status}</span></div>
                                    <div className="flex items-center gap-2">
                                        {person && <>
                                            <img src={person.avatarUrl} alt={person.name} className="w-6 h-6 rounded-full" />
                                            <span className="text-sm">{person.name}</span>
                                        </>}
                                    </div>
                                    <div className="text-sm text-slate-500">{formatDate(task.startDate)} - {formatDate(task.endDate)}</div>
                                    <div className="text-right">
                                        <button onClick={() => onEditTask(task, processType)} className="text-sm font-medium text-brand-secondary hover:underline">Edit</button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
    return (
        <div>
            {renderProcessList('Permitting', property.permitting, ProcessType.Permitting)}
            {renderProcessList('Construction', property.construction, ProcessType.Construction)}
            {renderProcessList('Management', property.management, ProcessType.Management)}
        </div>
    );
};

const TimelineView: React.FC<{ property: Property }> = ({ property }) => {
    const allTasks = useMemo(() => [
        ...property.permitting.tasks.map(t => ({ ...t, processType: 'Permitting' })),
        ...property.construction.tasks.map(t => ({ ...t, processType: 'Construction' })),
        ...property.management.tasks.map(t => ({ ...t, processType: 'Management' }))
    ].filter(t => t.startDate && t.endDate), [property]);

    const { minDate, maxDate } = useMemo(() => {
        if (allTasks.length === 0) return { minDate: new Date(), maxDate: new Date() };
        const dates = allTasks.flatMap(t => [new Date(t.startDate!), new Date(t.endDate!)]);
        return {
            minDate: new Date(Math.min(...dates.map(d => d.getTime()))),
            maxDate: new Date(Math.max(...dates.map(d => d.getTime())))
        };
    }, [allTasks]);

    const totalDays = Math.max(1, (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    const renderTaskBar = (task: any) => {
        const startDate = new Date(task.startDate!);
        const endDate = new Date(task.endDate!);
        const startOffset = (startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
        const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;

        const left = (startOffset / totalDays) * 100;
        const width = (duration / totalDays) * 100;
        
        return (
            <div
                key={task.id}
                className="absolute h-8 flex items-center px-2 rounded-md text-white text-xs font-medium overflow-hidden"
                style={{ left: `${left}%`, width: `${width}%`, top: '0.5rem' }}
                title={`${task.name} (${task.status})\n${formatDate(task.startDate)} - ${formatDate(task.endDate)}`}
            >
                <div className={`w-full h-full absolute top-0 left-0 ${getStatusColor(task.status)} opacity-80`}></div>
                <span className="relative z-10 truncate">{task.name}</span>
            </div>
        );
    };

    const renderProcessTimeline = (title: string, process: Process) => {
        const tasksWithDates = process.tasks.filter(t => t.startDate && t.endDate);
        if (tasksWithDates.length === 0) return null;

        return (
            <div key={title} className="mb-6">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{title}</h3>
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg">
                    {tasksWithDates.map(task => (
                        <div key={task.id} className="relative h-12 mb-1">
                            {renderTaskBar(task)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                <span>{formatDate(minDate.toISOString())}</span>
                <span>{formatDate(maxDate.toISOString())}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-6"></div>

            {renderProcessTimeline('Permitting', property.permitting)}
            {renderProcessTimeline('Construction', property.construction)}
            {renderProcessTimeline('Management', property.management)}
        </div>
    );
};

const TeamDirectory: React.FC<{ people: Person[], onBack: () => void }> = ({ people, onBack }) => {
    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                 <button onClick={onBack} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors md:hidden" title="Back to Dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                 </button>
                 <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Team Directory</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {people.map(person => (
                    <div key={person.id} className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={person.avatarUrl} alt={person.name} className="w-16 h-16 rounded-full object-cover"/>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{person.name}</h3>
                                <p className="text-sm text-brand-secondary dark:text-blue-400">{person.role}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                             <p><strong>Email:</strong> <a href={`mailto:${person.email}`} className="hover:underline text-brand-primary dark:text-brand-light">{person.email}</a></p>
                            <p><strong>Phone:</strong> <a href={`tel:${person.phone}`} className="hover:underline text-brand-primary dark:text-brand-light">{person.phone}</a></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ActivityLog: React.FC<{
  log: LogEntry[];
  people: Person[];
  onAddComment: (text: string) => void;
  currentUser: Person;
}> = ({ log, people, onAddComment, currentUser }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            onAddComment(comment.trim());
            setComment('');
        }
    };

    const formatTimestamp = (timestamp: string): string => {
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
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Activity & Comments</h3>
            <form onSubmit={handleSubmit} className="flex items-start gap-3 mb-6">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full mt-1 flex-shrink-0" />
                <div className="flex-1">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={`Comment as ${currentUser.name}...`}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600"
                        rows={3}
                    />
                    <div className="text-right mt-2">
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50" disabled={!comment.trim()}>Post Comment</button>
                    </div>
                </div>
            </form>
            <ul className="space-y-6">
                {[...log].reverse().map(entry => {
                    const person = people.find(p => p.id === entry.personId);
                    if (entry.type === 'comment' && person) {
                        return (
                            <li key={entry.id} className="flex items-start gap-3">
                                <img src={person.avatarUrl} alt={person.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm">
                                        <span className="font-semibold text-slate-800 dark:text-slate-100">{person.name}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{formatTimestamp(entry.timestamp)}</span>
                                    </p>
                                    <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{entry.text}</div>
                                </div>
                            </li>
                        );
                    }
                    if (entry.type === 'event') {
                        return (
                            <li key={entry.id} className="flex items-center gap-3">
                                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-full">
                                    <ClockIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{person?.name || 'System'}</span> {entry.text}
                                    <span className="block text-xs mt-0.5">{formatTimestamp(entry.timestamp)}</span>
                                </p>
                            </li>
                        );
                    }
                    return null;
                })}
            </ul>
        </div>
    );
};


const SideNav: React.FC<{
    onNavigateToDashboard: () => void;
    onShowTeam: () => void;
    onOpenImportModal: () => void;
    onToggleDarkMode: () => void;
    isDarkMode: boolean;
    currentView: AppView;
}> = ({ onNavigateToDashboard, onShowTeam, onOpenImportModal, onToggleDarkMode, isDarkMode, currentView }) => {
    
    const navItemClasses = "flex items-center w-full gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left";
    const activeNavItemClasses = "bg-slate-200 dark:bg-slate-700 font-semibold text-brand-primary dark:text-white";

    const isDashboardActive = currentView === 'dashboard' || currentView === 'property';

    return (
        <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col p-4 z-40">
            <button onClick={onNavigateToDashboard} className="flex items-center gap-2 mb-8 text-left">
                 <WrenchScrewdriverIcon className="w-8 h-8 text-brand-primary flex-shrink-0" />
                 <h1 className="text-2xl font-bold text-brand-primary dark:text-brand-light">Builders.TX</h1>
            </button>
            <nav className="flex-1 flex flex-col gap-2">
                <button onClick={onNavigateToDashboard} className={`${navItemClasses} ${isDashboardActive ? activeNavItemClasses : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>
                    <span>Dashboard</span>
                </button>
                <button onClick={onShowTeam} className={`${navItemClasses} ${currentView === 'team' ? activeNavItemClasses : ''}`}>
                    <UsersIcon className="w-6 h-6 flex-shrink-0" />
                    <span>Team</span>
                </button>
                <button onClick={onOpenImportModal} className={navItemClasses}>
                    <ArrowUpOnSquareIcon className="w-6 h-6 flex-shrink-0" />
                    <span>Import Permits</span>
                </button>
            </nav>
            <div className="mt-auto">
                <button onClick={onToggleDarkMode} className="w-full flex items-center justify-between p-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                     <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isDarkMode ? "M12 3v1m0 16v1m8.66-15.66l-.707.707M5.05 18.95l-.707.707M21 12h-1M4 12H3m15.66 8.66l-.707-.707M5.05 5.05l-.707-.707" : "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"} />
                     </svg>
                </button>
            </div>
        </aside>
    );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [people] = useState<Person[]>(ALL_PEOPLE);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{ task: Partial<Task>; processType: ProcessType } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isGlobalImportModalOpen, setIsGlobalImportModalOpen] = useState(false);
  const [detailViewMode, setDetailViewMode] = useState<DetailViewMode>('board');
  const [appView, setAppView] = useState<AppView>('dashboard');
  const [permitDetailTask, setPermitDetailTask] = useState<Task | null>(null);

  const currentUser = useMemo(() => people.find(p => p.id === CURRENT_USER_ID)!, [people]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSelectProperty = useCallback((property: Property) => {
    setSelectedProperty(property);
    setAppView('property');
  }, []);
  
  const handleReturnToDashboard = () => {
      setSelectedProperty(null);
      setAppView('dashboard');
  };

  const handleShowTeam = () => {
      setSelectedProperty(null);
      setAppView('team');
  }

  const handleSaveTask = useCallback((taskToSave: Task, processType: ProcessType) => {
    setProperties(prevProperties =>
      prevProperties.map(p => {
        if (p.id === selectedProperty?.id) {
            const oldTask = p[processType].tasks.find(t => t.id === taskToSave.id);
            let logEntry: LogEntry | null = null;
            
            if (!oldTask) { // It's a new task
                const logData = { text: `created task "${taskToSave.name}".`, type: 'event' as const, personId: CURRENT_USER_ID };
                logEntry = { ...logData, id: `log-create-${Date.now()}`, timestamp: new Date().toISOString() };
            } else { // It's an update
                let logText: string | null = null;
                 if(oldTask.status !== taskToSave.status) {
                    logText = `changed status of "${taskToSave.name}" from ${oldTask.status} to ${taskToSave.status}.`;
                } else if (oldTask.personId !== taskToSave.personId) {
                    const oldPerson = people.find(p => p.id === oldTask.personId)?.name ?? 'Unassigned';
                    const newPerson = people.find(p => p.id === taskToSave.personId)?.name ?? 'Unassigned';
                    logText = `reassigned task "${taskToSave.name}" from ${oldPerson} to ${newPerson}.`;
                }
                if(logText) {
                    const logData = { text: logText, type: 'event' as const, personId: CURRENT_USER_ID };
                    logEntry = { ...logData, id: `log-update-${Date.now()}`, timestamp: new Date().toISOString() };
                }
            }

          const updatedProcess = {
            ...p[processType],
            tasks: oldTask
              ? p[processType].tasks.map(t => t.id === taskToSave.id ? taskToSave : t)
              : [...p[processType].tasks, { ...taskToSave, id: `task-${Date.now()}` }]
          };

          const newActivityLog = logEntry ? [...p.activityLog, logEntry] : p.activityLog;
          const newProperty = { ...p, [processType]: updatedProcess, activityLog: newActivityLog };
          
          setSelectedProperty(newProperty); // Update selected property state as well
          return newProperty;
        }
        return p;
      })
    );
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, [selectedProperty, people]);

  const handleEditTask = useCallback((task: Task, processType: ProcessType) => {
    setEditingTask({ task, processType });
    setIsTaskModalOpen(true);
  }, []);

  const handleAddTask = useCallback((processType: ProcessType, initialTask: Partial<Task> = {}) => {
    setEditingTask({ task: { status: TaskStatus.NotStarted, ...initialTask }, processType });
    setIsTaskModalOpen(true);
  }, []);
  
  const handleAddComment = useCallback((text: string) => {
    if (!selectedProperty) return;
    const logData: Omit<LogEntry, 'id' | 'timestamp'> = {
        text,
        type: 'comment',
        personId: CURRENT_USER_ID
    };
    
    const newLogEntry: LogEntry = {
      ...logData,
      id: `log-comment-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setProperties(prev => prev.map(p => {
        if (p.id === selectedProperty.id) {
            const newProperty = { ...p, activityLog: [...p.activityLog, newLogEntry] };
            setSelectedProperty(newProperty);
            return newProperty;
        }
        return p;
    }));

}, [selectedProperty]);

  const handleSaveImportedTasks = useCallback((importedTasks: Task[], propertyId: number) => {
    setProperties(prevProperties =>
      prevProperties.map(p => {
        if (p.id === propertyId) {
          const existingTaskNames = new Set(p.permitting.tasks.map(t => t.name.toLowerCase()));
          const newTasks = importedTasks.filter(t => !existingTaskNames.has(t.name.toLowerCase()));
          const newProperty = { ...p, permitting: { ...p.permitting, tasks: [...p.permitting.tasks, ...newTasks] } };
          if(p.id === selectedProperty?.id) {
              setSelectedProperty(newProperty);
          }
          return newProperty;
        }
        return p;
      })
    );
  }, [selectedProperty?.id]);

  const handleDeleteTask = useCallback((taskId: string, processType: ProcessType) => {
    if (!selectedProperty || !window.confirm("Are you sure you want to delete this task?")) return;

    setProperties(prevProperties =>
        prevProperties.map(p => {
            if (p.id === selectedProperty.id) {
                const taskToDelete = p[processType].tasks.find(t => t.id === taskId);
                if (!taskToDelete) return p;

                const logData = { text: `deleted task "${taskToDelete.name}".`, type: 'event' as const, personId: CURRENT_USER_ID };
                const logEntry: LogEntry = { ...logData, id: `log-delete-${Date.now()}`, timestamp: new Date().toISOString() };
                
                const updatedTasks = p[processType].tasks.filter(t => t.id !== taskId);
                const newProperty = { 
                    ...p, 
                    [processType]: { ...p[processType], tasks: updatedTasks },
                    activityLog: [...p.activityLog, logEntry]
                };
                setSelectedProperty(newProperty);
                return newProperty;
            }
            return p;
        })
    );
  }, [selectedProperty]);

  const handleSavePermitDetails = useCallback((taskId: string, details: PermitDetail) => {
    if(!selectedProperty) return;
    
    setProperties(prev => prev.map(p => {
        if(p.id === selectedProperty.id) {
            const updatedPermittingTasks = p.permitting.tasks.map(t => t.id === taskId ? {...t, permitDetails: details} : t);
            
            const taskName = p.permitting.tasks.find(t=>t.id === taskId)?.name || 'a permit';
            const logData = { text: `added details to permit "${taskName}".`, type: 'event' as const, personId: CURRENT_USER_ID };
            const logEntry: LogEntry = { ...logData, id: `log-permit-details-${Date.now()}`, timestamp: new Date().toISOString() };
            
            const newProperty = {
                ...p,
                permitting: { ...p.permitting, tasks: updatedPermittingTasks },
                activityLog: [...p.activityLog, logEntry]
            };
            setSelectedProperty(newProperty);
            return newProperty;
        }
        return p;
    }));
    setPermitDetailTask(null);
}, [selectedProperty]);

  const openGlobalImportModal = () => setIsGlobalImportModalOpen(true);
  
  const DetailViewSwitcher: React.FC<{ current: DetailViewMode; onChange: (view: DetailViewMode) => void; }> = ({ current, onChange }) => {
    const views: { id: DetailViewMode; name: string }[] = [
        { id: 'board', name: 'Board' },
        { id: 'list', name: 'List' },
        { id: 'timeline', name: 'Timeline' },
    ];
    return (
        <div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-lg flex items-center">
            {views.map(view => (
                <button
                    key={view.id}
                    onClick={() => onChange(view.id)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-full ${current === view.id ? 'bg-white dark:bg-slate-800 text-brand-primary dark:text-brand-light shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}
                >
                    {view.name}
                </button>
            ))}
        </div>
    );
  };
  
  const renderPropertyDetails = (property: Property) => (
    <div key={property.id} className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50">
      <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
        <div className='flex items-center gap-4'>
            <button onClick={handleReturnToDashboard} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors md:hidden" title="Back to All Properties">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            </button>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{property.address}</h2>
              <div className="text-sm text-slate-500 dark:text-slate-400">Project Overview</div>
            </div>
        </div>
        <div className="w-full md:w-auto md:max-w-xs">
            <DetailViewSwitcher current={detailViewMode} onChange={setDetailViewMode} />
        </div>
      </div>
      
      {detailViewMode === 'board' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ProcessSection title="Permitting" processType={ProcessType.Permitting} process={property.permitting} people={people} onEditTask={handleEditTask} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask} onViewDetails={setPermitDetailTask} />
              <ProcessSection title="Construction" processType={ProcessType.Construction} process={property.construction} people={people} onEditTask={handleEditTask} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask} onViewDetails={setPermitDetailTask}/>
              <ProcessSection title="Management" processType={ProcessType.Management} process={property.management} people={people} onEditTask={handleEditTask} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask} onViewDetails={setPermitDetailTask}/>
          </div>
      )}

      {detailViewMode === 'list' && <ListView property={property} people={people} onEditTask={handleEditTask} />}
      {detailViewMode === 'timeline' && <TimelineView property={property} />}
      
      <ActivityLog
        log={property.activityLog}
        people={people}
        onAddComment={handleAddComment}
        currentUser={currentUser}
      />
      <AISuggestions property={property} people={people} onAddTask={handleAddTask} />
    </div>
  );

  const ProgressBar: React.FC<{ label: string; progress: number, colorClass: string }> = ({ label, progress, colorClass }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className={`${colorClass} h-2 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
        </div>
    </div>
  );

  const PropertyCard: React.FC<{ property: Property, onSelect: (property: Property) => void }> = ({ property, onSelect }) => {
    const permittingProgress = calculateProgress(property.permitting.tasks);
    const constructionProgress = calculateProgress(property.construction.tasks);
    const managementProgress = calculateProgress(property.management.tasks);

    return (
        <div onClick={() => onSelect(property)} className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50 overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <img src={property.imageUrl} alt={property.address} className="w-full h-40 object-cover" />
            <div className="p-5">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate mb-3">{property.address}</h3>
                <div className="space-y-3">
                    <ProgressBar label="Permitting" progress={permittingProgress} colorClass="bg-blue-500" />
                    <ProgressBar label="Construction" progress={constructionProgress} colorClass="bg-emerald-500" />
                    <ProgressBar label="Management" progress={managementProgress} colorClass="bg-purple-500" />
                </div>
            </div>
        </div>
    );
  };
  
  const PropertiesDashboard: React.FC<{properties: Property[], onSelectProperty: (property: Property) => void}> = ({ properties, onSelectProperty }) => (
    <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">All Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {properties.map(p => (
                <PropertyCard key={p.id} property={p} onSelect={onSelectProperty} />
            ))}
        </div>
    </div>
  );

  const renderCurrentView = () => {
    switch(appView) {
        case 'property':
            return selectedProperty ? renderPropertyDetails(selectedProperty) : <PropertiesDashboard properties={properties} onSelectProperty={handleSelectProperty} />;
        case 'team':
            return <TeamDirectory people={people} onBack={handleReturnToDashboard} />;
        case 'dashboard':
        default:
            return <PropertiesDashboard properties={properties} onSelectProperty={handleSelectProperty} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <PermitImportModal
          isOpen={isGlobalImportModalOpen}
          onClose={() => setIsGlobalImportModalOpen(false)}
          onSave={handleSaveImportedTasks}
          properties={properties}
          initialSelectedPropertyId={selectedProperty?.id}
      />
      
      {permitDetailTask && (
        <PermitDetailModal 
            task={permitDetailTask}
            onClose={() => setPermitDetailTask(null)}
            onSave={handleSavePermitDetails}
        />
      )}

      {isTaskModalOpen && editingTask && selectedProperty && (
         <TaskFormModal
            isOpen={isTaskModalOpen}
            onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
            onSave={handleSaveTask}
            task={editingTask.task}
            processType={editingTask.processType}
            people={people}
        />
      )}
      
      <SideNav
        onNavigateToDashboard={handleReturnToDashboard}
        onShowTeam={handleShowTeam}
        onOpenImportModal={openGlobalImportModal}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        currentView={appView}
      />
      <main className="ml-64 p-4 sm:p-6 lg:p-8">
        {renderCurrentView()}
      </main>

      {appView === 'property' && selectedProperty && <AIAssistant property={selectedProperty} people={people} />}
    </div>
  );
};

interface PermitImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tasks: Task[], propertyId: number) => void;
  properties: Property[];
  initialSelectedPropertyId?: number;
  isPropertyLocked?: boolean;
}

const PermitImportModal: React.FC<PermitImportModalProps> = ({ isOpen, onClose, onSave, properties, initialSelectedPropertyId, isPropertyLocked = false }) => {
    const [text, setText] = useState('');
    const [parsedTasks, setParsedTasks] = useState<Task[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | undefined>(initialSelectedPropertyId);

    useEffect(() => {
        if(!isPropertyLocked){
            setSelectedPropertyId(initialSelectedPropertyId);
        }
    }, [initialSelectedPropertyId, isPropertyLocked]);


    const handleParse = async () => {
        if (!text.trim()) {
            setError("Please paste some text to parse.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setParsedTasks(null);
        try {
            const tasks = await parsePermitInfo(text);
            setParsedTasks(tasks);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred during parsing.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (parsedTasks && selectedPropertyId) {
            onSave(parsedTasks, selectedPropertyId);
            onClose();
            setText('');
            setParsedTasks(null);
            setError(null);
        }
    };

    const handleClose = () => {
        onClose();
        setText('');
        setParsedTasks(null);
        setError(null);
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Import Permit Data with AI">
            <div className="space-y-4">
                {!isPropertyLocked && (
                     <div>
                        <label htmlFor="property-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Select Property
                        </label>
                        <select
                            id="property-select"
                            value={selectedPropertyId || ''}
                            onChange={(e) => setSelectedPropertyId(Number(e.target.value))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm rounded-md bg-white dark:bg-slate-700 dark:border-slate-600"
                        >
                            <option value="" disabled>-- Choose a property --</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>{p.address}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label htmlFor="permit-text" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Paste Permit Information
                    </label>
                    <textarea
                        id="permit-text"
                        rows={8}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600"
                        placeholder="Paste permit details, notes, or any unstructured text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <button onClick={handleParse} disabled={isLoading || !text.trim() || !selectedPropertyId} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all">
                        {isLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Parsing...</span></> : <><SparklesIcon className="w-5 h-5" /><span>Parse with AI</span></>}
                    </button>
                </div>

                {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm">{error}</div>}

                {parsedTasks && (
                    <div>
                        <h4 className="text-lg font-semibold mb-2">AI-Generated Tasks Preview</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Review the tasks below. If they look correct, save them to the project. Note: This will not create duplicates of existing tasks.</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md bg-slate-50 dark:bg-slate-800/50">
                            {parsedTasks.map(task => (
                                <div key={task.id} className="p-2 border-l-4 rounded-r-md" style={{ borderColor: getStatusColor(task.status) }}>
                                    <p className="font-semibold">{task.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{task.notes}</p>
                                    <p className="text-xs text-slate-400">Status: {task.status}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">Cancel</button>
                <button type="button" onClick={handleSave} disabled={!parsedTasks || parsedTasks.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-400 dark:disabled:bg-slate-600">
                    Save Imported Tasks
                </button>
            </div>
        </Modal>
    );
};

const PermitDetailModal: React.FC<{ task: Task; onClose: () => void; onSave: (taskId: string, details: PermitDetail) => void; }> = ({ task, onClose, onSave }) => {
    const [mode, setMode] = useState<'view' | 'import'>(task.permitDetails ? 'view' : 'import');
    const [importText, setImportText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsedDetails, setParsedDetails] = useState<PermitDetail | null>(null);
    
    const handleParse = async () => {
        if (!importText.trim()) {
            setError("Please paste some text to parse.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setParsedDetails(null);
        try {
            const details = await parsePermitDetailsFromText(importText);
            setParsedDetails(details);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred during parsing.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSave = () => {
        if(parsedDetails) {
            onSave(task.id, parsedDetails);
        }
    };
    
    const renderDetail = (label: string, value?: string | number | null) => value ? (
        <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-slate-800 dark:text-slate-200">{value}</p>
        </div>
    ) : null;
    
    return (
         <Modal isOpen={true} onClose={onClose} title={`Permit Details: ${task.name}`} size="2xl">
            {mode === 'view' && task.permitDetails && (
                <div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            {renderDetail('Record #', task.permitDetails.recordNumber)}
                            {renderDetail('Status', task.permitDetails.recordStatus)}
                            {renderDetail('Owner', task.permitDetails.owner.name)}
                            {renderDetail('Owner Address', task.permitDetails.owner.address)}
                        </div>
                        <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                             {renderDetail('Applicant', task.permitDetails.applicant.name)}
                            {renderDetail('Applicant Email', task.permitDetails.applicant.email)}
                             {renderDetail('Licensed Professional', task.permitDetails.licensedProfessional.name)}
                             {renderDetail('Company', task.permitDetails.licensedProfessional.company)}
                        </div>
                     </div>
                     <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        {renderDetail('Scope of Work', task.permitDetails.scopeOfWork)}
                     </div>
                     <div className="mt-4 flex justify-end">
                        <button onClick={() => setMode('import')} className="text-sm font-medium text-brand-secondary hover:underline">
                            Re-import with new data
                        </button>
                     </div>
                </div>
            )}
            
            {(mode === 'import') && (
                <div className="space-y-4">
                     <div>
                        <label htmlFor="permit-text-details" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Paste Full Permit Information
                        </label>
                        <textarea
                            id="permit-text-details"
                            rows={10}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600"
                            placeholder="Paste full permit details from city website..."
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                        />
                    </div>
                     <div className="flex justify-end">
                        <button onClick={handleParse} disabled={isLoading || !importText.trim()} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all">
                            {isLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Parsing...</span></> : <><SparklesIcon className="w-5 h-5" /><span>Parse Details with AI</span></>}
                        </button>
                    </div>

                    {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm">{error}</div>}

                    {parsedDetails && (
                        <div>
                            <h4 className="text-lg font-semibold mb-2">AI-Generated Preview</h4>
                            <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 max-h-64 overflow-y-auto">
                                <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(parsedDetails, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">Cancel</button>
                        <button type="button" onClick={handleSave} disabled={!parsedDetails} className="px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded-md shadow-sm hover:bg-emerald-600 disabled:bg-slate-400 dark:disabled:bg-slate-600">
                            Save Details
                        </button>
                    </div>
                </div>
            )}

         </Modal>
    );
};


export default App;