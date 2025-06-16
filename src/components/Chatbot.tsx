import { useEffect } from 'react';

export const Chatbot = () => {
  useEffect(() => {
    // Bot responses based on keywords
    const botResponses = {
      hello: "Hello! How can I help you today?",
      hi: "Hi there! How can I assist you?",
      hey: "Hey! What can I do for you?",
      help: "I'm here to help! You can ask me about our products, services, or any general questions.",
      product: "We offer a range of chemical products including water treatment chemicals, agricultural chemicals, food grade chemicals, and more. Would you like more specific information?",
      products: "We offer a range of chemical products including water treatment chemicals, agricultural chemicals, food grade chemicals, and more. Would you like more specific information?",
      service: "Our services include chemical consultation, custom formulations, quality testing, and technical support. What specific service are you interested in?",
      services: "Our services include chemical consultation, custom formulations, quality testing, and technical support. What specific service are you interested in?",
      price: "Our pricing varies depending on the product and quantity. Can you specify which chemical product you're interested in?",
      pricing: "Our pricing varies depending on the product and quantity. Can you specify which chemical product you're interested in?",
      contact: "Phone: +91 96775 22201\nEmail: info@dropschemicals.com",
      hours: "Our business hours are Monday to Saturday, 9:00 AM to 8:00 PM. Sunday: Closed.",
      location: "We are located at 3rd floor, No.76, East Power House Road, Gandhipuram, Coimbatore - 641012, Tamil Nadu, India.",
      address: "We are located at 3rd floor, No.76, East Power House Road, Gandhipuram, Coimbatore - 641012, Tamil Nadu, India.",
      thanks: "You're welcome! Is there anything else I can help you with?",
      "thank you": "You're welcome! Is there anything else I can help you with?",
      bye: "Goodbye! Feel free to chat again if you have more questions.",
      goodbye: "Goodbye! Have a great day!",
      water: "We offer comprehensive water treatment chemicals including coagulants, flocculants, disinfectants, and pH adjusters. Would you like specific product details?",
      agriculture: "Our agricultural chemicals include fertilizers, micronutrients, soil conditioners, and crop protection products. What specific agricultural solution do you need?",
      food: "We provide food-grade chemicals that meet stringent safety standards for food processing and preservation. What food application are you looking for?",
      industrial: "We supply basic industrial chemicals for various manufacturing processes. What industrial application do you need chemicals for?",
      pharmaceutical: "We offer high-purity pharmaceutical raw materials meeting strict quality standards. What pharmaceutical ingredient are you looking for?",
      hygiene: "We provide raw materials for hygiene and detergent manufacturing including surfactants and cleaning agents. What hygiene product are you developing?",
      quote: "Please submit your requirements here: https://wa.me/919677522201",
      msds: "For Material Safety Data Sheets (MSDS), please contact us at info@dropschemicals.com with the specific product name.",
      quality: "We maintain strict quality standards with comprehensive testing and certifications. All our products meet international quality requirements.",
      delivery: "We offer fast local delivery within 24-48 hours across Tamil Nadu. For other locations, delivery time may vary.",
      experience: "Drops Chemicals has over 22 years of experience in chemical manufacturing and supply, serving diverse industries since 2004."
    };

    // Default response when no keyword matches
    const defaultResponse = "I'm not sure I understand. Could you rephrase your question or ask about our chemical products, services, contact information, or business hours?";

    // DOM Elements
    const chatToggle = document.getElementById("chatToggle");
    const chatBox = document.getElementById("chatBox");
    const closeChat = document.getElementById("closeChat");
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const chatIcon = document.querySelector(".chat-icon");
    const closeIcon = document.querySelector(".close-icon");

    // Toggle chat box visibility
    function toggleChat() {
      if (chatBox) {
        chatBox.classList.toggle("active");

        // Toggle icons
        if (chatBox.classList.contains("active")) {
          if (chatIcon) chatIcon.style.display = "none";
          if (closeIcon) closeIcon.style.display = "block";
        } else {
          if (chatIcon) chatIcon.style.display = "block";
          if (closeIcon) closeIcon.style.display = "none";
        }
      }
    }

    // Add a message to the chat
    function addMessage(message: string, isUser = false) {
      if (!chatMessages) return;

      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");
      messageDiv.classList.add(isUser ? "user-message" : "bot-message");

      const messageContent = document.createElement("div");
      messageContent.classList.add("message-content");
      messageContent.textContent = message;

      messageDiv.appendChild(messageContent);
      chatMessages.appendChild(messageDiv);

      // Scroll to the bottom of the chat
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add quick reply buttons
    function addQuickReplyButtons() {
      if (!chatMessages) return;

      const quickReplyDiv = document.createElement("div");
      quickReplyDiv.classList.add("quick-reply-container");

      const buttons = [
        { text: "Contact", action: "contact" },
        { text: "Product Categories", action: "categories" },
        { text: "Request Quote", action: "quote" }
      ];

      buttons.forEach(button => {
        const btn = document.createElement("button");
        btn.classList.add("quick-reply-btn");
        btn.textContent = button.text;
        btn.onclick = () => handleQuickReply(button.action);
        quickReplyDiv.appendChild(btn);
      });

      chatMessages.appendChild(quickReplyDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle quick reply button clicks
    function handleQuickReply(action: string) {
      let response = "";
      
      switch (action) {
        case "contact":
          response = "Phone: +91 96775 22201\nEmail: info@dropschemicals.com";
          break;
        case "categories":
          response = "We serve the following sectors:\n- Agro & Aquaculture\n- Poultry\n- Food Processing\n- Hygiene & Cleaning\n- Water Treatment\n- Metal Finishing\n- Textile Manufacturing\n- Petrochemicals\n- Solvent Recovery\n- Soap & Detergent Production\n- Boiler & ETP Chemicals\n- Cooling Tower Solutions";
          break;
        case "quote":
          response = "Please submit your requirements here: https://wa.me/919677522201";
          break;
      }

      // Remove quick reply buttons
      const quickReplyContainer = document.querySelector(".quick-reply-container");
      if (quickReplyContainer) {
        quickReplyContainer.remove();
      }

      // Add user message (button text)
      const buttonTexts = {
        "contact": "Contact",
        "categories": "Product Categories", 
        "quote": "Request Quote"
      };
      addMessage(buttonTexts[action as keyof typeof buttonTexts], true);

      // Add bot response
      setTimeout(() => {
        addMessage(response);
      }, 500);
    }

    // Get bot response based on user input
    function getBotResponse(userMessage: string) {
      userMessage = userMessage.toLowerCase();

      // Check for keyword matches
      for (const keyword in botResponses) {
        if (userMessage.includes(keyword)) {
          return botResponses[keyword as keyof typeof botResponses];
        }
      }

      // Return default response if no match
      return defaultResponse;
    }

    // Handle user message submission
    function handleUserMessage(e: Event) {
      e.preventDefault();

      if (!userInput) return;
      const message = (userInput as HTMLInputElement).value.trim();
      if (!message) return;

      // Add user message to chat
      addMessage(message, true);
      (userInput as HTMLInputElement).value = "";

      // Simulate bot thinking with a slight delay
      setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage(botResponse);
      }, 500);
    }

    // Event Listeners
    if (chatToggle) chatToggle.addEventListener("click", toggleChat);
    if (closeChat) closeChat.addEventListener("click", toggleChat);
    if (chatForm) chatForm.addEventListener("submit", handleUserMessage);

    // Add welcome message and quick reply buttons when component mounts
    setTimeout(() => {
      addMessage("Hello! I'm Drops Chemical's Bot. How can I help you today?");
      addQuickReplyButtons();
    }, 1000);

    // Cleanup function
    return () => {
      if (chatToggle) chatToggle.removeEventListener("click", toggleChat);
      if (closeChat) closeChat.removeEventListener("click", toggleChat);
      if (chatForm) chatForm.removeEventListener("submit", handleUserMessage);
    };
  }, []);

  return (
    <>
      {/* Chat Toggle Button */}
      <div id="chatToggle" className="chat-toggle">
        <div className="chat-icon">
          <img
            src="https://ik.imagekit.io/dvuz4klnl/Screenshot_2025-06-03-15-28-07-28_c37d74246d9c81aa0bb824b57eaf7062.jpg?updatedAt=1748944738882"
            alt="Drops Chemicals Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div className="close-icon" style={{ display: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Chat Box */}
      <div id="chatBox" className="chat-box">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="bot-avatar">
              <img
                src="https://ik.imagekit.io/dvuz4klnl/Screenshot_2025-06-03-15-28-07-28_c37d74246d9c81aa0bb824b57eaf7062.jpg?updatedAt=1748944738882"
                alt="Drops Chemicals Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <div>
              <h4>Drops Chemical's Bot</h4>
              <span className="status">Online</span>
            </div>
          </div>
          <button id="closeChat" className="close-chat-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div id="chatMessages" className="chat-messages">
          {/* Messages will be added here dynamically */}
        </div>
        
        <form id="chatForm" className="chat-form">
          <input
            type="text"
            id="userInput"
            placeholder="Type your message..."
            autoComplete="off"
          />
          <button type="submit" className="send-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};