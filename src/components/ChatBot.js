import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

function ChatBot({ onClose }) {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const fetchOpenAIResponse = async (userInput) => {
        const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY; // Updated line
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `I am a chatbot designed to converse with you.`,
                        },
                        {
                            role: 'user',
                            content: userInput,
                        },
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${openaiApiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error fetching response from OpenAI:', error);
            return 'There was an error communicating with the chat service.';
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = { sender: 'user', message };
        setChatHistory([...chatHistory, userMessage]);
        setMessage('');

        const botResponse = await fetchOpenAIResponse(message);
        const botMessage = { sender: 'bot', message: botResponse };
        setChatHistory(history => [...history, botMessage]);
    };

    return (
        <div className="chat-container">
            <IconButton className="chat-close-btn" onClick={onClose}>
                <CloseIcon />
            </IconButton>
            <div className="chat-history">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`chat-message ${chat.sender}`}>
                        <span className="chat-message-content">{chat.message}</span>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="chat-input-container">
                <input
                    className="chat-input"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                    placeholder="Type your message here..."
                />
                <IconButton className="chat-send-btn" onClick={handleSendMessage}>
                    <SendIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default ChatBot;
