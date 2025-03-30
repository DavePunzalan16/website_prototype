// DOM Elements
const fileUpload = document.getElementById('fileUpload');
const fileName = document.getElementById('fileName');
const extractBtn = document.getElementById('extractBtn');
const uploadModal = document.getElementById('uploadModal');
const resultsView = document.getElementById('resultsView');
const messagesContainer = document.getElementById('messagesContainer');
const promptInput = document.getElementById('promptInput');
const sendBtn = document.getElementById('sendBtn');
const uploadedImage = document.getElementById('uploadedImage');
const codeContent = document.getElementById('codeContent');
const outputContent = document.getElementById('outputContent');
const themeToggle = document.querySelector('.theme-toggle');
const fixCodeBtn = document.getElementById('fixCodeBtn');
const explainCodeBtn = document.getElementById('explainCodeBtn');
const checkErrorsBtn = document.getElementById('checkErrorsBtn');

// State management
let currentTheme = 'dark';
let selectedFile = null;
let extractedCode = '';
let chatHistory = [];

// Initialize the application
function init() {
    // Event listeners
    fileUpload.addEventListener('change', handleFileSelect);
    extractBtn.addEventListener('click', handleExtraction);
    sendBtn.addEventListener('click', handleSendMessage);
    promptInput.addEventListener('keydown', handleKeyDown);
    themeToggle.addEventListener('click', toggleTheme);
    fixCodeBtn.addEventListener('click', () => handleCodeAction('fix'));
    explainCodeBtn.addEventListener('click', () => handleCodeAction('explain'));
    checkErrorsBtn.addEventListener('click', () => handleCodeAction('check'));
    
    // Set initial view
    showWelcomeMessage();
    
    // Auto-resize textarea
    promptInput.addEventListener('input', () => {
        promptInput.style.height = 'auto';
        promptInput.style.height = (promptInput.scrollHeight) + 'px';
    });
}

// File handling
function handleFileSelect(e) {
    selectedFile = e.target.files[0];
    
    if (selectedFile) {
        fileName.textContent = selectedFile.name;
        extractBtn.disabled = false;
        
        // Add active class for visual feedback
        document.querySelector('.file-upload-container').classList.add('active');
    } else {
        fileName.textContent = 'No file chosen';
        extractBtn.disabled = true;
        document.querySelector('.file-upload-container').classList.remove('active');
    }
}

// Extract code from image
function handleExtraction() {
    if (!selectedFile) return;
    
    // Show loading state
    extractBtn.innerHTML = '<span class="loading"></span> Extracting...';
    extractBtn.disabled = true;
    
    // Simulating API call with timeout
    setTimeout(() => {
        // Create object URL for image preview
        const imageUrl = URL.createObjectURL(selectedFile);
        uploadedImage.src = imageUrl;
        
        // Simulate extracted code (would come from API in real app)
        extractedCode = `1  # Extracted Python code
2  def calculate_sum(a, b):
3      return a + b
4
5  # Call the function
6  result = calculate_sum(5, 3)
7  print(f"The sum is {result}")`;
        
        codeContent.textContent = extractedCode;
        outputContent.textContent = '> The sum is 8';
        
        // Add syntax highlighting (simplified version)
        applySyntaxHighlighting();
        
        // Show results view
        uploadModal.style.display = 'none';
        resultsView.style.display = 'block';
        
        // Add message to chat
        addMessage('Extracted code from: ' + selectedFile.name, 'bot');
        
        // Reset button state
        extractBtn.innerHTML = 'Extract Code';
        extractBtn.disabled = false;
    }, 2000);
}

// Apply basic syntax highlighting
function applySyntaxHighlighting() {
    const codeLines = extractedCode.split('\n');
    let highlightedCode = '';
    
    codeLines.forEach((line, index) => {
        const lineNumber = index + 1;
        const highlightedLine = line
            .replace(/(def|return|print|import|from|as|if|else|elif|for|while|try|except|class|and|or|not|in|is)/g, '<span class="keyword">$1</span>')
            .replace(/(".*?")/g, '<span class="string">$1</span>')
            .replace(/(\d+)/g, '<span class="number">$1</span>')
            .replace(/(#.*$)/gm, '<span class="comment">$1</span>');
            
        highlightedCode += `<div class="code-line">
            <span class="line-number">${lineNumber}</span>
            <span class="line-content">${highlightedLine}</span>
        </div>`;
    });
    
    codeContent.innerHTML = highlightedCode;
}

// Handle code actions (fix, explain, check)
function handleCodeAction(action) {
    addMessage(`Please ${action} the code`, 'user');
    
    // Simulate thinking with timeout
    setTimeout(() => {
        let response = '';
        
        switch(action) {
            case 'fix':
                response = 'The code looks correct. It defines a function `calculate_sum` that adds two numbers, then calls it with parameters 5 and 3, giving the result 8.';
                break;
            case 'explain':
                response = 'This code defines a function called `calculate_sum` that takes two parameters (a and b) and returns their sum. Then it calls this function with values 5 and 3, stores the result (8) in a variable called `result`, and prints "The sum is 8" using an f-string.';
                break;
            case 'check':
                response = 'No errors found. The code follows Python syntax rules and should run without issues.';
                break;
        }
        
        addMessage(response, 'bot');
    }, 1000);
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    if (currentTheme === 'dark') {
        body.classList.add('light-theme');
        themeToggle.querySelector('i').classList.replace('lni-sun', 'lni-night');
        currentTheme = 'light';
    } else {
        body.classList.remove('light-theme');
        themeToggle.querySelector('i').classList.replace('lni-night', 'lni-sun');
        currentTheme = 'dark';
    }
}

// Chat functionality
function handleSendMessage() {
    const message = promptInput.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    promptInput.value = '';
    promptInput.style.height = 'auto';
    
    // Simulate response with timeout
    setTimeout(() => {
        // Simple response logic
        let response = '';
        
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            response = 'Hello! How can I help you with code extraction today?';
        } else if (message.toLowerCase().includes('help')) {
            response = 'I can help you extract code from images. Just upload an image using the form, and I\'ll try to recognize and extract any code in it.';
        } else if (message.toLowerCase().includes('thank')) {
            response = 'You\'re welcome! Is there anything else I can help you with?';
        } else if (resultsView.style.display === 'block' && 
                  (message.toLowerCase().includes('explain') || message.toLowerCase().includes('what'))) {
            response = 'This code defines a simple function to add two numbers together and then calls it with the values 5 and 3.';
        } else {
            response = 'I\'m here to help extract and analyze code from images. Would you like to upload an image or do you have questions about the extracted code?';
        }
        
        addMessage(response, 'bot');
    }, 1000);
}

// Handle Enter key in textarea
function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to chat history
    chatHistory.push({
        sender,
        text
    });
}

// Show welcome message
function showWelcomeMessage() {
    setTimeout(() => {
        addMessage('Welcome to Photo to Code AI! Upload an image containing code, and I\'ll extract it for you.', 'bot');
    }, 500);
}

// Go back to upload view
function backToUpload() {
    resultsView.style.display = 'none';
    uploadModal.style.display = 'flex';
    fileName.textContent = 'No file chosen';
    extractBtn.disabled = true;
    selectedFile = null;
    document.querySelector('.file-upload-container').classList.remove('active');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);


