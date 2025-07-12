// Get DOM elements
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Show a welcome message
chatWindow.innerHTML = `<div class="msg ai">👋 Hello! How can I help you today?</div>`;

// Store chat history as an array of messages
const messages = [
  {
    role: "system",
    content:
      "You are a helpful assistant for L’Oréal. Only answer questions related to L’Oréal products, beauty routines, product recommendations, and beauty-related topics. If a question is outside these topics, politely refuse to answer and inform the user that you can only assist with L’Oréal-related and beauty-related queries.",
  },
];

// Function to add a message to the chat window
function addMessage(role, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `msg ${role}`;
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user input
  const userText = userInput.value.trim();
  if (!userText) return;

  // Add user message to chat window
  addMessage("user", userText);

  // Add user message to messages array
  messages.push({ role: "user", content: userText });

  // Clear input box
  userInput.value = "";

  // Show loading message
  addMessage("ai", "Thinking...");

  // Send request to OpenAI API
  try {
    // Replace YOUR_API_KEY with your actual OpenAI API key
    // Send request to your deployed Cloudflare Worker endpoint
    // Replace with your actual Worker URL
    const workerUrl = "https://developers.cloudflare.com/workersv";
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    // Remove loading message
    const loadingMsg = chatWindow.querySelector(".msg.ai:last-child");
    if (loadingMsg && loadingMsg.textContent === "Thinking...") {
      chatWindow.removeChild(loadingMsg);
    }

    // Get chatbot reply
    const aiReply =
      data.choices && data.choices[0] && data.choices[0].message.content
        ? data.choices[0].message.content
        : "Sorry, I couldn't get a response.";

    // Add AI reply to chat window
    addMessage("ai", aiReply);

    // Add AI reply to messages array
    messages.push({ role: "assistant", content: aiReply });
  } catch (error) {
    // Remove loading message
    const loadingMsg = chatWindow.querySelector(".msg.ai:last-child");
    if (loadingMsg && loadingMsg.textContent === "Thinking...") {
      chatWindow.removeChild(loadingMsg);
    }
    addMessage("ai", "Sorry, there was a problem connecting to the AI.");
  }
});
