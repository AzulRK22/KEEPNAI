import React, { useState } from 'react';
import axios from 'axios';
import styles from './chatgpt.module.css'; // Ensure this file exists and has the correct styles

const ChatGPT = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEmergencyForm, setShowEmergencyForm] = useState(false);

    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = { text: input, sender: 'user' };
            setMessages([...messages, userMessage]);
            setInput('');
            setIsLoading(true);

            try {
                const response = await axios.post('/api/chat', { message: input });
                const botMessage = {
                    text: response.data.message,
                    sender: 'bot',
                };
                setMessages([...messages, userMessage, botMessage]);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleEmergencyReport = () => {
        setShowEmergencyForm(true);
        const emergencyQuestions = [
            "¿Cuál es la emergencia?",
            "¿Dónde está ocurriendo?",
            "¿Cuándo ocurrió?",
            "¿Hay alguien herido?"
        ];
        setMessages([...messages, { text: "Por favor, responde las siguientes preguntas:", sender: 'bot' }]);
        emergencyQuestions.forEach(question => {
            setMessages(prevMessages => [...prevMessages, { text: question, sender: 'bot' }]);
        });
    };

    return (
        <div className={styles.chatbotContainer}>
            <div className={styles.chatbotHeader}>
                <h2>KeepNAI Chatbot</h2>
            </div>
            <div className={styles.chatbotMessages}>
                {messages.map((message, index) => (
                    <div key={index} className={`${styles.chatbotMessage} ${styles[message.sender]}`}>
                        {message.text}
                    </div>
                ))}
                {isLoading && <div className={`${styles.chatbotMessage} ${styles.bot} ${styles.loading}`}>...</div>}
            </div>
            {showEmergencyForm && (
                <div className={styles.emergencyForm}>
                    <p>Por favor, responde a las siguientes preguntas:</p>
                    <input
                        type="text"
                        placeholder="¿Cuál es la emergencia?"
                        className={styles.emergencyInput}
                    />
                    <input
                        type="text"
                        placeholder="¿Dónde está ocurriendo?"
                        className={styles.emergencyInput}
                    />
                    <input
                        type="text"
                        placeholder="¿Cuándo ocurrió?"
                        className={styles.emergencyInput}
                    />
                    <input
                        type="text"
                        placeholder="¿Hay alguien herido?"
                        className={styles.emergencyInput}
                    />
                    <button className={styles.submitButton}>Enviar</button>
                </div>
            )}
            <div className={styles.chatbotInput}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
                <button onClick={handleEmergencyReport} className={styles.emergencyButton}>Reportar Incendio</button>
            </div>
        </div>
    );
};

export default ChatGPT;
