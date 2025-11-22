import React, { useEffect, useRef, useState } from 'react';

function ChatStage({ messages, darkMode, onSendMessage }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className={`chat-stage ${darkMode ? 'dark' : ''}`}>
      {messages.length === 0 ? (
        <div className="chat-empty">
          <div className="chat-empty-icon">💬</div>
          <h3>Chat-First Interface</h3>
          <p>Type messages below or connect blocks to see results here</p>
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.type === 'input' ? 'user' : 'ai'}`}
            >
              <div className="message-bubble">
                <div className="message-header">
                  <span className="message-icon">
                    {msg.type === 'input' ? '👤' : '🤖'}
                  </span>
                  <span className="message-label">
                    {msg.type === 'input' ? 'You' : 'Blokks'}
                  </span>
                  {msg.blockName && (
                    <span className="message-block-name">• {msg.blockName}</span>
                  )}
                </div>
                <div className="message-content">
                  {msg.content}
                </div>
                {msg.timestamp && (
                  <div className="message-timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <form className="chat-input-bar" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="chat-send-btn" disabled={!inputValue.trim()}>
          <span>Send</span>
          <span className="send-icon">↑</span>
        </button>
      </form>
    </div>
  );
}

export default ChatStage;
