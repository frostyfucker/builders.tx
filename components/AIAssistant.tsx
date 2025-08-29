import React, { useState, useRef, useEffect } from 'react';
import { streamAIResponse } from '../services/geminiService';
import { Message, Person, Property } from '../types';

const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3.375a.75.75 0 0 0 0 1.5h6.75a.75.75 0 0 0 0-1.5h-6.75Z" clipRule="evenodd" />
    </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537a5.25 5.25 0 0 1-3.722-1.651L12 16.5h-1.5a5.25 5.25 0 0 1-3.722-1.651L5.22 12.21a5.25 5.25 0 0 1-1.65-3.722V7.489c0-.99.616-1.815 1.5-2.097L6.6 5.195a5.25 5.25 0 0 1 6.275 0l2.385.621Zm-4.5.385c.623.23.99.862.99 1.528v3.834a2.25 2.25 0 0 1-2.25 2.25H12a2.25 2.25 0 0 1-2.25-2.25V10.84a2.25 2.25 0 0 1 2.25-2.25h3.75Zm-9-1.528c-.623-.23-.99-.862-.99-1.528V5.195a5.25 5.25 0 0 1 6.275 0l2.385.621c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537a5.25 5.25 0 0 1-3.722-1.651L6.78 13.71a5.25 5.25 0 0 1-1.65-3.722V8.489Z" />
    </svg>
);


interface AIAssistantProps {
    property: Property | null;
    people: Person[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ property, people }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const prevPropertyId = useRef<number | null | undefined>(undefined);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    useEffect(() => {
        const currentPropertyId = property?.id ?? null;
        if (currentPropertyId !== prevPropertyId.current) {
            setMessages([]);
            setIsLoading(false);
            prevPropertyId.current = currentPropertyId;
        }
    }, [property]);
    
    const handleOpen = () => {
        setIsOpen(true);
        if (messages.length === 0) {
            let initialMessageText = "How can I help you with your projects?";
            if (property) {
                initialMessageText = `Now assisting with ${property.address}. What would you like to know?`;
            }
            const initialMessage: Message = { sender: 'ai', text: initialMessageText };
            setMessages([initialMessage]);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await streamAIResponse(input, property, people);
            let aiResponseText = '';
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

            for await (const chunk of stream) {
                aiResponseText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponseText };
                    return newMessages;
                });
            }
        } catch (error) {
            const errorMessage: Message = { sender: 'ai', text: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => {
                const newMessages = [...prev];
                // Replace the empty AI message with the error
                if (newMessages[newMessages.length - 1].sender === 'ai' && newMessages[newMessages.length - 1].text === '') {
                   newMessages[newMessages.length - 1] = errorMessage;
                   return newMessages;
                }
                return [...newMessages, errorMessage];
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) {
        return (
            <button
                onClick={handleOpen}
                className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-brand-secondary transition-transform hover:scale-110"
                aria-label="Open AI Assistant"
            >
                <ChatBubbleLeftRightIcon className="w-8 h-8"/>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 z-50 transition-colors animate-fade-in-fast">
            <div className="flex flex-col justify-between items-center p-4 pb-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-t-2xl">
                 <div className="flex justify-between items-center w-full">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <BotIcon className="w-6 h-6 text-brand-primary" />
                        AI Construction Assistant
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {property && (
                    <div className="w-full pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-600 dark:text-slate-400 text-center truncate" title={property.address}>
                            Discussing: <span className="font-semibold">{property.address}</span>
                        </p>
                    </div>
                )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-slate-100 dark:bg-slate-900">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                             {msg.sender === 'ai' && <div className="bg-brand-primary text-white p-2 rounded-full flex-shrink-0"><BotIcon className="w-5 h-5"/></div>}
                             <div className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-secondary text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none'}`}>
                                 <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && <div className="bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200 p-2 rounded-full flex-shrink-0"><UserIcon className="w-5 h-5"/></div>}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <div className="bg-brand-primary text-white p-2 rounded-full">
                                <BotIcon className="w-5 h-5"/>
                            </div>
                            <div className="max-w-xs md:max-w-sm px-4 py-3 rounded-2xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none">
                                 <div className="flex items-center space-x-1">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Thinking</span>
                                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl transition-colors">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about this property..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-700 border-transparent text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        disabled={isLoading}
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-secondary text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-colors" disabled={isLoading || !input.trim()}>
                        <SendIcon className="w-5 h-5"/>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AIAssistant;