import React, { useState, useEffect, useRef } from 'react';
import styles from './EmbeddedAIChat.module.scss';

interface Message {
  id: string;
  speaker: 'customer' | 'ai' | 'agent';
  message: string;
  timestamp: Date;
}

interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface AIResponse {
  response: string;
  next_step?: string;
  requirement_complete?: boolean;
  quote_ready?: boolean;
}

const EmbeddedAIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo] = useState<CustomerInfo>({});
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [requirementComplete, setRequirementComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Send initial greeting when component mounts
    const timer = setTimeout(() => {
      sendMessage('Hello');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const sendMessage = async (messageText: string = inputMessage) => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      speaker: 'customer',
      message: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/ai-chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: messageText,
          customer_info: customerInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponseData: AIResponse = data.data;

      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        speaker: 'ai',
        message: aiResponseData.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      if (aiResponseData.requirement_complete) {
        setRequirementComplete(true);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        speaker: 'ai',
        message: 'Sorry, I encountered an error. Please try again or contact our support team directly.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.embeddedChat}>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${styles[message.speaker]}`}
          >
            <div className={styles.messageContent}>
              {message.speaker === 'ai' && (
                <div className={styles.avatarContainer}>
                  <span className={styles.avatar}>👩‍💼</span>
                  <span className={styles.assistantName}>Sarah</span>
                </div>
              )}
              <div className={styles.messageText}>
                {message.message.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < message.message.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div className={styles.messageTime}>
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className={`${styles.message} ${styles.ai}`}>
            <div className={styles.messageContent}>
              <div className={styles.avatarContainer}>
                <span className={styles.avatar}>👩‍💼</span>
                <span className={styles.assistantName}>Sarah</span>
              </div>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
                Sarah is typing...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Type your message to Sarah..."
          disabled={isLoading}
          className={styles.messageInput}
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className={styles.sendButton}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
          </svg>
        </button>
      </form>

      {requirementComplete && (
        <div className={styles.completionNotice}>
          ✅ Requirements gathered! Sarah has all the information needed. Our team will contact you within 24 hours with a detailed project estimate.
        </div>
      )}
    </div>
  );
};

export default EmbeddedAIChat;
