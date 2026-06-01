import { Component, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../core/services/auth.store';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: Date;
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span class="online-indicator"></span>
            </div>
            <div>
              <h4>XpertBot Support</h4>
              <span class="subtitle">AI Virtual Assistant</span>
            </div>
          </div>
          
          <button class="btn-close-header" (click)="toggleChat()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Message History Log -->
        <div class="chat-messages" #scrollContainer>
          <div 
            *ngFor="let msg of chatLog()" 
            class="message-row"
            [class.user-row]="msg.sender === 'user'"
            [class.bot-row]="msg.sender === 'bot'"
          >
            <div class="msg-bubble">
              <p>{{ msg.text }}</p>
              <span class="time-label">{{ msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
          </div>

          <!-- Typing state dot pulse -->
          <div class="message-row bot-row" *ngIf="isTyping()">
            <div class="msg-bubble typing-bubble">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
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
          <button type="submit" [disabled]="!userInput.trim() || isTyping()">
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
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--primary);
      color: var(--on-primary);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 30px rgba(var(--primary-rgb), 0.4);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
      position: relative;
    }

    .chat-trigger-btn:hover {
      transform: scale(1.08) rotate(3deg);
    }

    .chat-trigger-btn:active {
      transform: scale(0.95);
    }

    .trigger-icon {
      width: 26px;
      height: 26px;
      transition: transform 0.25s;
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
      bottom: 5rem;
      right: 0;
      width: 360px;
      height: 480px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
      background: rgba(20, 18, 30, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transform: scale(0.8) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.15);
      transform-origin: bottom right;
    }

    :host-context(body[data-theme="light"]) .chat-window {
      background: rgba(255, 255, 255, 0.98);
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    }

    .chat-window.show {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Chat Header */
    .chat-header {
      padding: 1rem 1.25rem;
      background: rgba(0, 0, 0, 0.15);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    :host-context(body[data-theme="light"]) .chat-header {
      background: rgba(0, 0, 0, 0.015);
      border-bottom-color: rgba(0, 0, 0, 0.05);
    }

    .bot-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .bot-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--primary);
      color: var(--on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .bot-avatar svg {
      width: 18px;
      height: 18px;
    }

    .online-indicator {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 10px;
      height: 10px;
      background: #22c55e;
      border: 2px solid rgba(20, 18, 30, 0.95);
      border-radius: 50%;
    }

    :host-context(body[data-theme="light"]) .online-indicator {
      border-color: #ffffff;
    }

    .bot-info h4 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .bot-info .subtitle {
      font-size: 0.7rem;
      color: #22c55e;
      font-weight: 600;
    }

    .btn-close-header {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .btn-close-header:hover {
      opacity: 1;
    }

    .btn-close-header svg {
      width: 16px;
      height: 16px;
    }

    /* Chat Messages Box */
    .chat-messages {
      flex: 1;
      padding: 1.25rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .chat-messages::-webkit-scrollbar {
      width: 5px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(var(--primary-rgb), 0.15);
      border-radius: 4px;
    }

    .message-row {
      display: flex;
      width: 100%;
    }

    .bot-row {
      justify-content: flex-start;
    }

    .user-row {
      justify-content: flex-end;
    }

    .msg-bubble {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 0.825rem;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .bot-row .msg-bubble {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary);
      border-bottom-left-radius: 3px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    :host-context(body[data-theme="light"]) .bot-row .msg-bubble {
      background: rgba(0, 0, 0, 0.03);
      border-color: rgba(0, 0, 0, 0.05);
    }

    .user-row .msg-bubble {
      background: var(--primary);
      color: var(--on-primary);
      border-bottom-right-radius: 3px;
    }

    .time-label {
      font-size: 0.625rem;
      align-self: flex-end;
      opacity: 0.6;
    }

    /* Typing Dots Animation */
    .typing-bubble {
      padding: 12px 16px;
    }

    .typing-dots {
      display: flex;
      gap: 3px;
      align-items: center;
      height: 8px;
    }

    .typing-dots span {
      width: 5px;
      height: 5px;
      background: var(--text-secondary);
      border-radius: 50%;
      display: inline-block;
      animation: chat-typing-dot 1.4s infinite ease-in-out both;
    }

    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes chat-typing-dot {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }

    /* Form input fields */
    .chat-input-form {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      gap: 8px;
      background: rgba(0, 0, 0, 0.1);
    }

    :host-context(body[data-theme="light"]) .chat-input-form {
      background: rgba(0, 0, 0, 0.01);
      border-top-color: rgba(0, 0, 0, 0.05);
    }

    .chat-input-form input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.2);
      color: var(--text-primary);
      font-size: 0.85rem;
      outline: none;
    }

    :host-context(body[data-theme="light"]) .chat-input-form input {
      background: #ffffff;
      border-color: rgba(0, 0, 0, 0.1);
    }

    .chat-input-form input:focus {
      border-color: var(--primary);
    }

    .chat-input-form button {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: var(--primary);
      color: var(--on-primary);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .chat-input-form button:hover {
      opacity: 0.9;
    }

    .chat-input-form button svg {
      width: 15px;
      height: 15px;
      transform: rotate(45deg) translate(-1px, 1px);
    }
  `]
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = signal(false);
  hasUnread = signal(true); // Glows at start
  userInput = '';
  isTyping = signal(false);

  chatLog = signal<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hi there! I am XpertBot. Ask me about booking slots, cancellations, or promo offers, and I will guide you instantly!',
      time: new Date()
    }
  ]);

  constructor(public authStore: AuthStore) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen.update(val => !val);
    if (this.isOpen()) {
      this.hasUnread.set(false);
    }
  }

  sendMessage(event: Event) {
    event.preventDefault();
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
    this.scrollToBottom();

    // Answer generator
    setTimeout(() => {
      let response = "I'm sorry, I didn't catch that. Could you ask about 'refunds', 'slots', 'cancellations', or 'offers'?";
      
      const text = query.toLowerCase();
      if (text.includes('refund') || text.includes('money') || text.includes('cashback')) {
        response = "Refunds are processed back to your original source payment in 2-3 business days. Or instant if you choose TurfXpert Wallet credit!";
      } else if (text.includes('cancel') || text.includes('refund request')) {
        response = "To cancel your turf slot, go to the 'Bookings' tab in the navigation bar, choose your active card, and click 'Cancel'. Remember to do it 6 hours before kickoff!";
      } else if (text.includes('slot') || text.includes('book') || text.includes('reserve')) {
        response = "Browse live ground times by clicking 'Dashboard'. Pick any arena, choose a date from the calendar ribbon, and select your slot!";
      } else if (text.includes('offer') || text.includes('promo') || text.includes('discount')) {
        response = "Open the 'Offers' tab in your navbar to view active promotional coupons! Copy and paste them on checkout to enjoy immediate discounts.";
      } else if (text.includes('hello') || text.includes('hi ') || text.includes('hey')) {
        response = "Hi! XpertBot here. How can I help you dominate the pitch today?";
      } else if (text.includes('thank') || text.includes('thanks')) {
        response = "You're welcome! Let me know if you need anything else. Game on!";
      }

      const botMsg: ChatMessage = {
        sender: 'bot',
        text: response,
        time: new Date()
      };

      this.chatLog.update(log => [...log, botMsg]);
      this.isTyping.set(false);
      this.scrollToBottom();
    }, 1100);
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
