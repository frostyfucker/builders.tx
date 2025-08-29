import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Property, Task, TaskStatus, Person, PermitDetail } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Cache for chat sessions, one for global, and one for each property.
const chatCache = new Map<string, Chat>();

const getPropertyContextSummary = (property: Property, people: Person[]): string => {
    const getTaskSummary = (tasks: Task[]): string => {
        return tasks.map(task => 
            `- ${task.name} (Status: ${task.status})${task.personId ? ` Assigned to: ${people.find(p=>p.id === task.personId)?.name ?? 'N/A'}` : ''}${task.notes ? ' | Notes: ' + task.notes : ''}`
        ).join('\n');
    };

    const permittingSummary = getTaskSummary(property.permitting.tasks);
    const constructionSummary = getTaskSummary(property.construction.tasks);

    return `
    You are now focused on a single property. Use the following information as your primary context for answering questions.
    
    PROPERTY ADDRESS: ${property.address}.
    
    == PERMITTING TASKS ==
    ${permittingSummary}

    == CONSTRUCTION TASKS ==
    ${constructionSummary}
    `;
};


const getChatInstance = (property: Property | null, people: Person[]): Chat => {
    const cacheKey = property ? `property-${property.id}` : 'global';
    
    if (chatCache.has(cacheKey)) {
        return chatCache.get(cacheKey)!;
    }

    let systemInstruction = `You are an expert assistant for construction project management and navigating building permit processes.
    Provide clear, concise, and actionable advice.
    When asked about specific trades or steps, offer best practices, potential pitfalls, and typical timelines.
    Be friendly and professional.`;

    if (property) {
        systemInstruction += getPropertyContextSummary(property, people);
    }
    
    const chatConfig = {
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
    };

    const newChat = ai.chats.create(chatConfig);
    chatCache.set(cacheKey, newChat);
    return newChat;
}

export const streamAIResponse = async (prompt: string, property: Property | null, people: Person[]) => {
    const chatInstance = getChatInstance(property, people);
    try {
        const result = await chatInstance.sendMessageStream({ message: prompt });
        return result;
    } catch (error) {
        console.error("Gemini API error:", error);
        const cacheKey = property ? `property-${property.id}` : 'global';
        chatCache.delete(cacheKey);
        throw new Error("Failed to get response from AI. The chat has been reset for this context.");
    }
};

const getFullTaskSummary = (tasks: Task[], people: Person[]): string => {
    return tasks.map(task => {
        const person = people.find(p => p.id === task.personId);
        let summary = `- Task: "${task.name}"\n  Status: ${task.status}`;
        if (person) summary += `\n  Assigned to: ${person.name} (${person.role})`;
        if (task.startDate) summary += `\n  Start: ${task.startDate}`;
        if (task.endDate) summary += `\n  End: ${task.endDate}`;
        if (task.notes) summary += `\n  Notes: ${task.notes}`;
        return summary;
    }).join('\n');
};

export const getAIActions = async (property: Property, people: Person[]): Promise<GenerateContentResponse> => {
    const permittingSummary = getFullTaskSummary(property.permitting.tasks, people);
    const constructionSummary = getFullTaskSummary(property.construction.tasks, people);

    const prompt = `
        You are an expert construction project manager assistant.
        Analyze the following project status for the property at ${property.address}.
        Your goal is to identify the most critical next steps to keep the project moving forward efficiently.
        Focus on resolving blockers, preparing for upcoming tasks, and ensuring deadlines are met.
        
        Current Status:
        
        == PERMITTING PROCESS ==
        ${permittingSummary}
        
        == CONSTRUCTION PHASES ==
        ${constructionSummary}
        
        Based on this information, provide a list of 3 to 5 concrete, actionable next steps.
        For each step, provide a clear title, a concise description of why it's important, and a suggested action type.
        The action type should be one of: 'FOLLOW_UP', 'SCHEDULE', 'REVIEW', or 'PREPARE'.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: {
                                    type: Type.STRING,
                                    description: 'A short, actionable title for the suggested step.'
                                },
                                description: {
                                    type: Type.STRING,
                                    description: 'A brief explanation of the action and why it is important.'
                                },
                                actionType: {
                                    type: Type.STRING,
                                    description: 'The category of the action. Should be one of: FOLLOW_UP, SCHEDULE, REVIEW, PREPARE.'
                                }
                            },
                            required: ["title", "description", "actionType"]
                        }
                    }
                },
                required: ["suggestions"]
            },
        },
    });

    return response;
};

export const parsePermitInfo = async (text: string): Promise<Task[]> => {
    const prompt = `
        You are an intelligent assistant that parses unstructured text about building permits into structured JSON data.
        Analyze the provided text and extract each permit as a separate task object.
        For each task, extract:
        - A descriptive name for the task (e.g., "Home Addition Permit").
        - The status. It must be one of: "Not Started", "In Progress", "Completed", "Blocked". If not specified, default to "Not Started".
        - Any relevant notes, especially including the permit record number (e.g., "Record: RES-ADD-PMT25-32501044.").
        - startDate and endDate in YYYY-MM-DD format if available.

        The output must be a JSON object with a single key 'tasks' which is an array of these task objects.
        Here is the text to parse:
        ---
        ${text}
        ---
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    tasks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                status: {
                                    type: Type.STRING,
                                    enum: Object.values(TaskStatus)
                                },
                                notes: { type: Type.STRING },
                                startDate: { type: Type.STRING },
                                endDate: { type: Type.STRING },
                            },
                            required: ["name", "status"]
                        }
                    }
                },
                required: ["tasks"]
            },
        },
    });

    try {
        const jsonStr = response.text.trim();
        const data = JSON.parse(jsonStr);
        // Add IDs to the tasks
        return data.tasks.map((task: Omit<Task, 'id'>) => ({
            ...task,
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            attachments: [],
        }));
    } catch (e) {
        console.error("Failed to parse AI response:", e);
        throw new Error("Could not parse permit information from the provided text.");
    }
};

export const parsePermitDetailsFromText = async (text: string): Promise<PermitDetail> => {
    const prompt = `
        You are an expert data extraction assistant. Analyze the following unstructured text about a building permit and parse it into a structured JSON object that conforms to the provided schema. Extract all relevant information accurately.

        Here is the text to parse:
        ---
        ${text}
        ---
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    recordNumber: { type: Type.STRING, description: "The main permit or record number." },
                    recordStatus: { type: Type.STRING, description: "Current status of the permit (e.g., Active, Closed)." },
                    applicant: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            phone: { type: Type.STRING },
                            email: { type: Type.STRING },
                            mailingAddress: { type: Type.STRING },
                        },
                        required: ["name"]
                    },
                    licensedProfessional: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            company: { type: Type.STRING },
                            address: { type: Type.STRING },
                            phone: { type: Type.STRING },
                            licenseInfo: { type: Type.STRING },
                        },
                         required: ["name"]
                    },
                    owner: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            address: { type: Type.STRING },
                        },
                         required: ["name"]
                    },
                    projectDescription: { type: Type.STRING },
                    scopeOfWork: { type: Type.STRING },
                    applicationInfo: {
                        type: Type.OBJECT,
                        properties: {
                            deckSqFt: { type: Type.NUMBER },
                            additionSqFt: { type: Type.NUMBER },
                            trades: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                    },
                    gisInfo: {
                        type: Type.OBJECT,
                        properties: {
                            parcelNumber: { type: Type.STRING },
                            jurisdictions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, value: { type: Type.STRING } } } },
                            landDevelopment: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, value: { type: Type.STRING } } } },
                            waterAreas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, value: { type: Type.STRING } } } },
                            zoningBase: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { baseZone: { type: Type.STRING }, caseNumber: { type: Type.STRING } } } },
                            zoningOverlay: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, value: { type: Type.STRING } } } },
                        }
                    }
                },
                 required: ["recordNumber"]
            }
        },
    });

     try {
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as PermitDetail;
    } catch (e) {
        console.error("Failed to parse AI response for permit details:", e);
        throw new Error("Could not parse permit details from the provided text.");
    }
};
