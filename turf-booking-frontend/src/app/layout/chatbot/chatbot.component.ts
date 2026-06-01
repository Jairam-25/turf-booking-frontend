import { Component, signal, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../../core/services/auth.store';

interface ChatAction {
  label: string;
  route: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: Date;
  action?: ChatAction;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-wrapper" *ngIf="authStore.isLoggedIn()">
      
      <!-- Chat Toggle Floating Trigger Button -->
      <button 
        class="chat-trigger-btn" 
        [class.active]="isOpen()" 
        (click)="toggleChat()"
        aria-label="Toggle XpertBot Chat"
      >
        <!-- Chat Icon -->
        <svg *ngIf="!isOpen()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="trigger-icon">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        
        <!-- Close Icon -->
        <svg *ngIf="isOpen()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="trigger-icon close-icon">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>

        <!-- Unread badge indicator -->
        <span class="unread-dot" *ngIf="hasUnread() && !isOpen()"></span>
      </button>

      <!-- Floating Chat Window Card -->
      <div class="chat-window glass" [class.show]="isOpen()">
        
        <!-- Header -->
        <div class="chat-header">
          <div class="bot-info">
            <div class="bot-avatar">
              <!-- Animated glowing status ring -->
              <div class="avatar-ring"></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z"></path>
                <path d="M8 10h.01"></path>
                <path d="M16 10h.01"></path>
                <path d="M9 15a3 3 0 0 0 6 0"></path>
              </svg>
              <span class="online-indicator"></span>
            </div>
            <div>
              <h4>XpertBot</h4>
              <span class="subtitle">AI Virtual Concierge</span>
            </div>
          </div>
          
          <div class="header-actions">
            <!-- Reset chat icon button -->
            <button class="btn-header-action" (click)="clearChat()" title="Reset Conversation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <!-- Close icon button -->
            <button class="btn-header-action close-btn" (click)="toggleChat()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Message History Log -->
        <div class="chat-messages" #scrollContainer>
          <!-- Welcome Card Banner -->
          <div class="welcome-card">
            <div class="welcome-icon">⚡</div>
            <h5>Welcome to TurfXpert Assistant</h5>
            <p>Our virtual agent is online and ready to help. Check turf slots, claim discounts, manage bookings, or ask questions!</p>
          </div>

          <div 
            *ngFor="let msg of chatLog()" 
            class="message-row"
            [class.user-row]="msg.sender === 'user'"
            [class.bot-row]="msg.sender === 'bot'"
          >
            <!-- Bot Avatar inside the row -->
            <div class="message-avatar" *ngIf="msg.sender === 'bot'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z"></path>
                <path d="M8 10h.01"></path>
                <path d="M16 10h.01"></path>
                <path d="M9 15a3 3 0 0 0 6 0"></path>
              </svg>
            </div>

            <div class="message-bubble-wrapper">
              <div class="msg-bubble">
                <p>{{ msg.text }}</p>
                <span class="time-label">{{ msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
              </div>
              
              <!-- Action Button / Route Trigger -->
              <button 
                *ngIf="msg.action" 
                class="msg-action-btn" 
                (click)="handleAction(msg.action.route)"
              >
                <span>{{ msg.action.label }}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-icon">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <!-- Typing state dot pulse -->
          <div class="message-row bot-row" *ngIf="isTyping()">
            <div class="message-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z"></path>
                <path d="M8 10h.01"></path>
                <path d="M16 10h.01"></path>
                <path d="M9 15a3 3 0 0 0 6 0"></path>
              </svg>
            </div>
            <div class="msg-bubble typing-bubble">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Suggestion Chips Wrapper -->
        <div class="suggestions-container" *ngIf="suggestions().length > 0 && !isTyping()">
          <div class="suggestions-title">Quick Actions:</div>
          <div class="suggestions-scroll">
            <button 
              type="button" 
              *ngFor="let sug of suggestions()" 
              class="suggestion-pill"
              (click)="selectSuggestion(sug)"
            >
              {{ sug }}
            </button>
          </div>
        </div>

        <!-- Chat Input Form -->
        <form (submit)="sendMessage($event)" class="chat-input-form">
          <input 
            type="text" 
            placeholder="Ask about slots, refunds, bookings..." 
            [(ngModel)]="userInput" 
            name="userInput"
            [disabled]="isTyping()"
            required
            autocomplete="off"
          />
          <button type="submit" [disabled]="!userInput.trim() || isTyping()" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>

      </div>

    </div>
  `,
  styles: [`
    .chatbot-wrapper {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 999;
      font-family: 'Manrope', sans-serif;
    }

    /* Floating Bubble Button Trigger */
    .chat-trigger-btn {
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
      color: var(--on-primary);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(var(--primary-rgb), 0.4);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
      position: relative;
    }

    .chat-trigger-btn:hover {
      transform: scale(1.06) translateY(-2px);
      box-shadow: 0 14px 35px rgba(var(--primary-rgb), 0.5);
    }

    .chat-trigger-btn:active {
      transform: scale(0.95);
    }

    .trigger-icon {
      width: 26px;
      height: 26px;
      transition: transform 0.25s ease-in-out;
    }

    .close-icon {
      transform: rotate(0);
    }

    .chat-trigger-btn.active .close-icon {
      transform: rotate(90deg);
    }

    .unread-dot {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: #ef4444;
      border: 2px solid #ffffff;
      border-radius: 50%;
      animation: pulse-badge 1.8s infinite;
    }

    :host-context(body[data-theme="dark"]) .unread-dot {
      border-color: #0c0a14;
    }

    @keyframes pulse-badge {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    /* Floating Chat window */
    .chat-window {
      position: absolute;
      bottom: 5.2rem;
      right: 0;
      width: 380px;
      height: 540px;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: var(--shadow-float);
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transform: scale(0.9) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.15);
      transform-origin: bottom right;
    }

    :host-context(body[data-theme="light"]) .chat-window {
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: var(--shadow-float);
    }

    .chat-window.show {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Chat Header */
    .chat-header {
      padding: 1rem 1.25rem;
      background: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    :host-context(body[data-theme="light"]) .chat-header {
      background: rgba(255, 255, 255, 0.4);
      border-bottom-color: rgba(0, 0, 0, 0.05);
    }

    .bot-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bot-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
      color: var(--on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .bot-avatar svg {
      width: 18px;
      height: 18px;
      stroke-width: 2.2;
    }

    .avatar-ring {
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      border: 2px solid var(--primary);
      opacity: 0.4;
      animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
      0% { transform: scale(1); opacity: 0.4; }
      50% { transform: scale(1.1); opacity: 0.1; }
      100% { transform: scale(1); opacity: 0.4; }
    }

    .online-indicator {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 11px;
      height: 11px;
      background: #22c55e;
      border: 2px solid rgba(17, 24, 39, 0.85);
      border-radius: 50%;
    }

    :host-context(body[data-theme="light"]) .online-indicator {
      border-color: #ffffff;
    }

    .bot-info h4 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .bot-info .subtitle {
      font-size: 0.725rem;
      color: #22c55e;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-header-action {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: all 0.2s ease;
    }

    .btn-header-action:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
    }

    :host-context(body[data-theme="light"]) .btn-header-action:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .btn-header-action svg {
      width: 16px;
      height: 16px;
    }

    /* Welcome Banner inside the Chat */
    .welcome-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 16px;
      padding: 1.25rem;
      text-align: center;
      margin-bottom: 0.5rem;
      animation: fadeIn 0.4s ease-out;
    }

    :host-context(body[data-theme="light"]) .welcome-card {
      background: rgba(0, 0, 0, 0.02);
      border-color: rgba(0, 0, 0, 0.04);
    }

    .welcome-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      display: inline-block;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    .welcome-card h5 {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .welcome-card p {
      font-size: 0.75rem;
      color: var(--text-secondary);
      line-height: 1.4;
      margin: 0;
    }

    /* Chat Messages Box */
    .chat-messages {
      flex: 1;
      padding: 1.25rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .chat-messages::-webkit-scrollbar {
      width: 5px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(var(--primary-rgb), 0.2);
      border-radius: 4px;
    }

    .message-row {
      display: flex;
      width: 100%;
      gap: 10px;
      animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .bot-row {
      justify-content: flex-start;
    }

    .user-row {
      justify-content: flex-end;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(var(--primary-rgb), 0.1);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1px solid rgba(var(--primary-rgb), 0.15);
    }

    .message-avatar svg {
      width: 15px;
      height: 15px;
      stroke-width: 2.2;
    }

    .message-bubble-wrapper {
      max-width: 78%;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .msg-bubble {
      padding: 12px 14px;
      border-radius: 18px;
      font-size: 0.825rem;
      line-height: 1.45;
      display: flex;
      flex-direction: column;
      gap: 4px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    .bot-row .msg-bubble {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary);
      border-top-left-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    :host-context(body[data-theme="light"]) .bot-row .msg-bubble {
      background: rgba(0, 0, 0, 0.03);
      border-color: rgba(0, 0, 0, 0.05);
    }

    .user-row .msg-bubble {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
      color: var(--on-primary);
      border-top-right-radius: 4px;
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
    }

    .time-label {
      font-size: 0.625rem;
      align-self: flex-end;
      opacity: 0.6;
    }

    /* Message CTA Action Buttons */
    .msg-action-btn {
      background: rgba(var(--primary-rgb), 0.12);
      border: 1px solid rgba(var(--primary-rgb), 0.25);
      color: var(--primary);
      font-weight: 700;
      font-size: 0.775rem;
      padding: 8px 14px;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: fit-content;
      transition: all 0.2s ease;
      align-self: flex-start;
      margin-top: 2px;
      outline: none;
    }

    .msg-action-btn:hover {
      background: var(--primary);
      color: var(--on-primary);
      border-color: var(--primary);
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.25);
    }

    .msg-action-btn svg {
      width: 13px;
      height: 13px;
      transition: transform 0.2s ease;
    }

    .msg-action-btn:hover svg {
      transform: translateX(2px);
    }

    /* Typing Dots Animation */
    .typing-bubble {
      padding: 12px 16px;
      border-top-left-radius: 4px;
    }

    .typing-dots {
      display: flex;
      gap: 4px;
      align-items: center;
      height: 8px;
    }

    .typing-dots span {
      width: 6px;
      height: 6px;
      background: var(--text-secondary);
      border-radius: 50%;
      display: inline-block;
      animation: chat-typing-dot 1.4s infinite ease-in-out both;
    }

    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes chat-typing-dot {
      0%, 80%, 100% { transform: scale(0.3); opacity: 0.4; }
      40% { transform: scale(1.0); opacity: 1; }
    }

    /* Suggestion Chips Section */
    .suggestions-container {
      padding: 0.5rem 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    :host-context(body[data-theme="light"]) .suggestions-container {
      background: rgba(0, 0, 0, 0.01);
      border-top-color: rgba(0, 0, 0, 0.03);
    }

    .suggestions-title {
      font-size: 0.675rem;
      font-weight: 800;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .suggestions-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: none; /* Firefox */
    }

    .suggestions-scroll::-webkit-scrollbar {
      display: none; /* Safari and Chrome */
    }

    .suggestion-pill {
      background: rgba(var(--primary-rgb), 0.08);
      border: 1px solid rgba(var(--primary-rgb), 0.18);
      color: var(--primary);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      flex-shrink: 0;
      outline: none;
    }

    .suggestion-pill:hover {
      background: var(--primary);
      color: var(--on-primary);
      border-color: var(--primary);
      transform: translateY(-1px);
    }

    /* Form input fields */
    .chat-input-form {
      padding: 1rem 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      gap: 10px;
      background: rgba(0, 0, 0, 0.2);
    }

    :host-context(body[data-theme="light"]) .chat-input-form {
      background: rgba(255, 255, 255, 0.4);
      border-top-color: rgba(0, 0, 0, 0.05);
    }

    .chat-input-form input {
      flex: 1;
      padding: 11px 16px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.25);
      color: var(--text-primary);
      font-size: 0.85rem;
      outline: none;
      transition: all 0.2s ease;
    }

    :host-context(body[data-theme="light"]) .chat-input-form input {
      background: #ffffff;
      border-color: rgba(0, 0, 0, 0.08);
      color: var(--text-primary);
    }

    .chat-input-form input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.15);
      background: rgba(0, 0, 0, 0.3);
    }

    :host-context(body[data-theme="light"]) .chat-input-form input:focus {
      background: #ffffff;
    }

    .chat-input-form button {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
      color: var(--on-primary);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.2);
    }

    .chat-input-form button:hover:not(:disabled) {
      transform: scale(1.04) translateY(-1px);
      box-shadow: 0 6px 14px rgba(var(--primary-rgb), 0.35);
    }

    .chat-input-form button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .chat-input-form button svg {
      width: 16px;
      height: 16px;
      transform: rotate(45deg) translate(-1px, 1px);
    }

    /* Mobile Responsive Customization */
    @media (max-width: 480px) {
      .chatbot-wrapper {
        bottom: 1rem;
        right: 1rem;
      }
      .chat-window {
        width: calc(100vw - 2rem);
        height: calc(100vh - 8rem);
        max-height: 520px;
        right: 0;
        bottom: 4.8rem;
      }
    }
  `]
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = signal(false);
  hasUnread = signal(true); // Glows at start
  userInput = '';
  isTyping = signal(false);

  chatLog = signal<ChatMessage[]>([]);
  suggestions = signal<string[]>([]);

  constructor(public authStore: AuthStore, private router: Router) {}

  ngOnInit() {
    this.loadChatHistory();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen.update(val => !val);
    if (this.isOpen()) {
      this.hasUnread.set(false);
    }
  }

  handleAction(route: string) {
    this.router.navigate([route]);
    this.isOpen.set(false);
  }

  clearChat() {
    if (confirm('Are you sure you want to clear your conversation history?')) {
      this.resetToDefaultChat();
    }
  }

  selectSuggestion(suggestion: string) {
    this.userInput = suggestion;
    this.sendMessage();
  }

  sendMessage(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    const query = this.userInput.trim();
    if (!query) return;

    // Push User message
    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      time: new Date()
    };

    this.chatLog.update(log => [...log, userMsg]);
    this.userInput = '';
    this.isTyping.set(true);
    this.suggestions.set([]);
    this.saveChatHistory();
    this.scrollToBottom();

    // Answer generator
    setTimeout(() => {
      let response = "I'm sorry, I didn't catch that. Could you ask about booking slots, active offers, cancellation rules, or refund status?";
      let action: ChatAction | undefined = undefined;
      
      const text = query.toLowerCase();
      if (text.includes('refund') || text.includes('money') || text.includes('cashback')) {
        response = "Refunds are processed back to your original source payment in 2-3 business days. Or instant if you choose TurfXpert Wallet credit!";
        action = { label: 'Go to Support Center', route: '/support' };
      } else if (text.includes('cancel') || text.includes('refund request')) {
        response = "To cancel your turf slot, go to the 'Bookings' tab in the navigation bar, choose your active card, and click 'Cancel'. Remember to do it 6 hours before kickoff!";
        action = { label: 'Go to Bookings', route: '/bookings' };
      } else if (text.includes('slot') || text.includes('book') || text.includes('reserve')) {
        response = "Browse live ground times by clicking 'Dashboard'. Pick any arena, choose a date from the calendar ribbon, and select your slot!";
        action = { label: 'Browse Grounds', route: '/dashboard' };
      } else if (text.includes('offer') || text.includes('promo') || text.includes('discount')) {
        response = "Open the 'Offers' tab in your navbar to view active promotional coupons! Copy and paste them on checkout to enjoy immediate discounts.";
        action = { label: 'View Active Offers', route: '/offers' };
      } else if (text.includes('support') || text.includes('contact') || text.includes('help') || text.includes('ticket')) {
        response = "Need technical assistance or want to talk to our team? You can submit a support request directly from the Support tab.";
        action = { label: 'Open Support Page', route: '/support' };
      } else if (text === 'hi' || text.startsWith('hi ') || text.includes('hello') || text.includes('hey')) {
        response = "Hi! XpertBot here. How can I help you dominate the pitch today?";
      } else if (text.includes('thank') || text.includes('thanks')) {
        response = "You're welcome! Let me know if you need anything else. Game on!";
      }

      const botMsg: ChatMessage = {
        sender: 'bot',
        text: response,
        time: new Date(),
        action: action
      };

      this.chatLog.update(log => [...log, botMsg]);
      this.updateSuggestionsBasedOnText(response);
      this.isTyping.set(false);
      this.saveChatHistory();
      this.scrollToBottom();
    }, 1000);
  }

  private loadChatHistory() {
    const saved = localStorage.getItem('xpertbot_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as any[];
        const mapped = parsed.map(m => ({
          sender: m.sender,
          text: m.text,
          time: new Date(m.time),
          action: m.action
        }));
        this.chatLog.set(mapped);
        
        const lastMsg = mapped[mapped.length - 1];
        if (lastMsg && lastMsg.sender === 'bot') {
          this.updateSuggestionsBasedOnText(lastMsg.text);
        } else {
          this.suggestions.set(['📅 Book a Turf', '🏷️ View Offers', '❌ Cancel Booking', '💳 Refund Status', '📞 Contact Support']);
        }
      } catch (e) {
        this.resetToDefaultChat();
      }
    } else {
      this.resetToDefaultChat();
    }
  }

  private saveChatHistory() {
    localStorage.setItem('xpertbot_chat_history', JSON.stringify(this.chatLog()));
  }

  private resetToDefaultChat() {
    const initialMsg: ChatMessage = {
      sender: 'bot',
      text: 'Hi there! I am XpertBot. Ask me about booking slots, cancellations, or promo offers, and I will guide you instantly!',
      time: new Date()
    };
    this.chatLog.set([initialMsg]);
    this.suggestions.set(['📅 Book a Turf', '🏷️ View Offers', '❌ Cancel Booking', '💳 Refund Status', '📞 Contact Support']);
    this.saveChatHistory();
  }

  private updateSuggestionsBasedOnText(text: string) {
    const lower = text.toLowerCase();
    if (lower.includes('dashboard') || lower.includes('slot') || lower.includes('book')) {
      this.suggestions.set(['🏷️ View Offers', '❌ Cancel Booking', '📞 Contact Support']);
    } else if (lower.includes('cancel') || lower.includes('bookings tab')) {
      this.suggestions.set(['💳 Refund Status', '📞 Contact Support', '📅 Book a Turf']);
    } else if (lower.includes('refund')) {
      this.suggestions.set(['❌ Cancel Booking', '📅 Book a Turf', '📞 Contact Support']);
    } else if (lower.includes('offer') || lower.includes('promo')) {
      this.suggestions.set(['📅 Book a Turf', '❌ Cancel Booking', '📞 Contact Support']);
    } else if (lower.includes('support') || lower.includes('ticket')) {
      this.suggestions.set(['📅 Book a Turf', '🏷️ View Offers', '❌ Cancel Booking']);
    } else {
      this.suggestions.set(['📅 Book a Turf', '🏷️ View Offers', '❌ Cancel Booking', '💳 Refund Status', '📞 Contact Support']);
    }
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
