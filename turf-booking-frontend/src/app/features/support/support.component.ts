import { Component, signal, computed , inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface FAQ {
  question: string;
  answer: string;
  category: 'general' | 'bookings' | 'payments' | 'cancellation' | 'troubleshooting';
  isOpen: boolean;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: Date;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: Date;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="support-page-container fade-in">
      
      <!-- Back Button -->
      <div class="navigation-bar">
        <button class="btn-back" routerLink="/dashboard" title="Back">
          <svg  class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Book Turf
        </button>
      </div>

      <!-- Hero Banner -->
      <header class="support-hero glass">
        <div class="glow-blob"></div>
        <div class="hero-content">
          <span class="support-badge">HELP & SUPPORT HUB</span>
          <h1>How Can We Help You Today?</h1>
          <p>Get instant answers from our knowledge base, submit a ticket to our team, or chat with our live virtual assistant.</p>
        </div>
      </header>

      <!-- Main Support Layout Grid -->
      <div class="support-grid">
        
        <!-- Left Column: FAQ Hub & Ticket form -->
        <div class="left-section">
          
          <!-- Knowledge Base Section -->
          <div class="support-card glass kb-section">
            <div class="card-header">
              <h2>Frequently Asked Questions</h2>
              <p>Search or filter our comprehensive user guide</p>
            </div>

            <!-- Search and Filter Bar -->
            <div class="filter-bar">
              <div class="search-box glass" title="Search">
                <svg  class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search questions or keywords..." 
                  [(ngModel)]="searchQuery" 
                  (ngModelChange)="onSearchChange($event)"
                />
              </div>

              <div class="category-tabs">
                <button 
                  *ngFor="let cat of categories" 
                  class="cat-tab"
                  [class.active]="selectedCategory() === cat.id"
                  (click)="selectedCategory.set(cat.id)"
                >
                  {{ cat.name }}
                </button>
              </div>
            </div>

            <!-- FAQ List -->
            <div class="faq-list">
              <div 
                *ngFor="let faq of filteredFAQs()" 
                class="faq-item glass"
                [class.open]="faq.isOpen"
              >
                <button class="faq-trigger" (click)="toggleFAQ(faq)">
                  <span class="faq-question">{{ faq.question }}</span>
                  <span class="faq-icon" title="Support">
                    <svg  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                <div class="faq-answer-wrapper">
                  <p class="faq-answer">{{ faq.answer }}</p>
                </div>
              </div>

              <div class="no-results" *ngIf="filteredFAQs().length === 0">
                <p>No FAQs match your search query.</p>
                <span>Try looking for "refund", "cancellation", or "booking".</span>
              </div>
            </div>
          </div>

          <!-- Submit Ticket Form Section -->
          <div class="support-card glass ticket-form-section">
            <div class="card-header">
              <h2>Open a Support Ticket</h2>
              <p>Can't find what you need? File a query and our team will get back to you within 2 hours.</p>
            </div>

            <form (submit)="submitTicket($event)" class="ticket-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="ticket-category">Query Category</label>
                  <select id="ticket-category" [(ngModel)]="newTicket.category" name="category" required>
                    <option value="" disabled>-- Select Category --</option>
                    <option value="Booking Conflict">Booking Conflict</option>
                    <option value="Payment Failure">Payment & Billing Failure</option>
                    <option value="Cancellation / Refund">Refund Request</option>
                    <option value="Technical Bug">Technical Glitch / Bug</option>
                    <option value="Feedback / Suggestion">Feedback & Suggestion</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="ticket-priority">Priority Level</label>
                  <select id="ticket-priority" [(ngModel)]="newTicket.priority" name="priority" required>
                    <option value="low">Low (General Query)</option>
                    <option value="medium">Medium (Requires review)</option>
                    <option value="high">High (Urgent Booking / Payment)</option>
                    <option value="urgent">Urgent (Match active / starting now)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="ticket-subject">Subject</label>
                <input 
                  type="text" 
                  id="ticket-subject" 
                  placeholder="Brief summary of the issue..." 
                  [(ngModel)]="newTicket.subject" 
                  name="subject" 
                  required
                />
              </div>

              <div class="form-group">
                <label for="ticket-message">Detailed Description</label>
                <textarea 
                  id="ticket-message" 
                  rows="4" 
                  placeholder="Please provide booking ID, transaction references, or any specific details..." 
                  [(ngModel)]="newTicket.message" 
                  name="message" 
                  required
                ></textarea>
              </div>

              <button type="submit" class="btn-submit-ticket btn-premium">
                Submit Support Ticket
              </button>
            </form>

            <!-- User's Existing Support Tickets -->
            <div class="tickets-list-wrapper" *ngIf="myTickets().length > 0">
              <h3 class="subsection-title">My Support Tickets ({{ myTickets().length }})</h3>
              <div class="tickets-timeline">
                <div *ngFor="let t of myTickets()" class="ticket-item glass">
                  <div class="ticket-header">
                    <span class="ticket-id">#{{ t.id }}</span>
                    <span class="ticket-priority-badge" [attr.data-priority]="t.priority">
                      {{ t.priority | uppercase }}
                    </span>
                    <span class="ticket-status-badge">
                      {{ t.status }}
                    </span>
                  </div>
                  <h4 class="ticket-subject">{{ t.subject }}</h4>
                  <p class="ticket-msg">{{ t.message }}</p>
                  <div class="ticket-footer">
                    <span class="ticket-cat">{{ t.category }}</span>
                    <span class="ticket-date">{{ t.createdAt.toLocaleTimeString() }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Right Column: Interactive Chatbot Assistant -->
        <div class="right-section">
          <div class="support-card glass chat-card">
            <div class="chat-header">
              <div class="agent-avatar">
                <div class="avatar-inner">
                  <!-- <svg  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
<title>Information</title>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg> -->
                  <i class="bi bi-robot"></i>
                </div>
                <span class="pulse-indicator"></span>
              </div>
              <div class="agent-info">
                <h3>XpertBot Support</h3>
                <span>Online Assistant</span>
              </div>
            </div>

            <!-- Message Area -->
            <div class="chat-messages" #chatScrollContainer>
              <div 
                *ngFor="let msg of chatLog()" 
                class="message-bubble-wrapper"
                [class.user-message]="msg.sender === 'user'"
                [class.bot-message]="msg.sender === 'bot'"
              >
                <div class="message-bubble">
                  <p>{{ msg.text }}</p>
                  <span class="msg-time">{{ msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </div>
              
              <!-- Typing Indicator -->
              <div class="message-bubble-wrapper bot-message" *ngIf="isBotTyping()">
                <div class="message-bubble typing-bubble">
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Send Input -->
            <form (submit)="sendChatMessage($event)" class="chat-input-form">
              <input 
                type="text" 
                placeholder="Ask about refunds, cancellation, slots..." 
                [(ngModel)]="chatInput" 
                name="chatInput"
                [disabled]="isBotTyping()"
                required
              />
              <button type="submit" [disabled]="!chatInput.trim() || isBotTyping()" title="Action">
                <svg  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .navigation-bar {
      display: flex;
      align-items: center;
    }
    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 8px 16px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: var(--transition-smooth);
    }
    @media (max-width: 768px) {
      .btn-back {
        padding: 6px 10px;
        font-size: 0.75rem; 
        border-radius: 6px;
        gap: 4px;
        min-height: 32px !important;
      }
      .back-icon, .btn-back svg {
        width: 14px;
        height: 14px;
      }
    }
    .btn-back:hover {
      background: rgba(255,255,255,0.05);
      border-color: var(--primary);
    }
    .back-icon {
      width: 16px;
      height: 16px;
    }

    .support-page-container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 3rem;
      font-family: 'Manrope', sans-serif;
    }

    .support-hero {
      position: relative;
      padding: 4.5rem 3rem;
      border-radius: 24px;
      text-align: center;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(12, 10, 20, 0.8) 0%, rgba(31, 41, 55, 0.45) 100%);
    }

    :host-context(body[data-theme="light"]) .support-hero {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(241, 245, 249, 0.95) 100%);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.06);
    }

    .glow-blob {
      position: absolute;
      width: 400px;
      height: 400px;
      top: -100px;
      left: -100px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(123, 57, 252, 0.12) 0%, transparent 70%);
      z-index: 0;
      pointer-events: none;
    }

    .hero-content {
      position: relative;
      z-index: 10;
      max-width: 750px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .support-badge {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.2em;
      color: var(--primary);
      background: rgba(var(--primary-rgb), 0.1);
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid rgba(var(--primary-rgb), 0.25);
    }

    .hero-content h1 {
      font-size: clamp(2rem, 5vw, 2.75rem);
      font-weight: 850;
      line-height: 1.15;
      margin: 0;
      color: var(--text-primary);
    }

    .hero-content p {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;
    }

    /* main split support layout */
    .support-grid {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 2.5rem;
      align-items: start;
    }

    @media (max-width: 1024px) {
      .support-grid {
        grid-template-columns: 1fr;
      }
    }

    .left-section {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .support-card {
      border-radius: 24px;
      padding: 2.5rem;
      background: var(--bg-card);
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    :host-context(body[data-theme="light"]) .support-card {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }

    .card-header h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .card-header p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 6px 0 0 0;
      opacity: 0.8;
    }

    /* Filter Bar inside Knowledge base */
    .filter-bar {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background: rgba(0, 0, 0, 0.2);
    }

    :host-context(body[data-theme="light"]) .search-box {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .search-icon {
      width: 18px;
      height: 18px;
      color: var(--text-secondary);
    }

    .search-box input {
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-size: 0.95rem;
      outline: none;
      width: 100%;
    }

    .category-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .cat-tab {
      background: rgba(var(--primary-rgb), 0.05);
      border: 1px solid rgba(var(--primary-rgb), 0.1);
      color: var(--text-primary);
      padding: 6px 14px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      text-transform: capitalize;
      transition: var(--transition-smooth);
    }

    .cat-tab.active, .cat-tab:hover {
      background: var(--primary);
      color: var(--on-primary);
      border-color: var(--primary);
    }

    /* FAQ accordion styling */
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .faq-item {
      border: 1px solid var(--border-color);
      border-radius: 14px;
      overflow: hidden;
      transition: var(--transition-smooth);
      background: rgba(255, 255, 255, 0.01);
    }

    :host-context(body[data-theme="light"]) .faq-item {
      background: rgba(0, 0, 0, 0.01);
      border: 1px solid rgba(0, 0, 0, 0.06);
    }

    .faq-trigger {
      width: 100%;
      padding: 16px 20px;
      background: transparent;
      border: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      text-align: left;
    }

    .faq-question {
      font-weight: 750;
      font-size: 0.95rem;
      color: var(--text-primary);
    }

    .faq-icon {
      width: 18px;
      height: 18px;
      color: var(--text-secondary);
      transition: transform 0.25s ease;
    }

    .faq-item.open .faq-icon {
      transform: rotate(180deg);
      color: var(--primary);
    }

    .faq-answer-wrapper {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0, 1, 0, 1);
    }

    .faq-item.open .faq-answer-wrapper {
      max-height: 500px;
      transition: max-height 0.3s cubic-bezier(1, 0, 1, 0);
    }

    .faq-answer {
      padding: 0 20px 20px 20px;
      font-size: 0.875rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;
    }

    .no-results {
      padding: 2.5rem 1rem;
      text-align: center;
      color: var(--text-secondary);
    }

    .no-results p {
      font-weight: 700;
      margin: 0 0 4px 0;
    }

    .no-results span {
      font-size: 0.8rem;
      opacity: 0.7;
    }

    /* Ticket form styling */
    .ticket-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-secondary);
    }

    .form-group input, 
    .form-group select, 
    .form-group textarea {
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background: rgba(0, 0, 0, 0.2);
      color: var(--text-primary);
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.2s;
    }

    :host-context(body[data-theme="light"]) .form-group input,
    :host-context(body[data-theme="light"]) .form-group select,
    :host-context(body[data-theme="light"]) .form-group textarea {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .form-group textarea {
      resize: none;
    }

    .form-group input:focus, 
    .form-group select:focus, 
    .form-group textarea:focus {
      border-color: var(--primary);
    }

    .btn-submit-ticket {
      height: 48px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 750;
      margin-top: 0.5rem;
    }

    /* Ticket timeline */
    .tickets-list-wrapper {
      margin-top: 1.5rem;
      border-top: 1px solid var(--border-color);
      padding-top: 2rem;
    }

    .subsection-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 0 1.25rem 0;
    }

    .tickets-timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .ticket-item {
      padding: 1.25rem;
      border-radius: 16px;
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    :host-context(body[data-theme="light"]) .ticket-item {
      border-color: rgba(0, 0, 0, 0.06);
    }

    .ticket-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .ticket-id {
      font-family: monospace;
      font-weight: 800;
      color: var(--primary);
      font-size: 0.85rem;
    }

    .ticket-priority-badge {
      font-size: 0.65rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.02em;
    }

    .ticket-priority-badge[data-priority="low"] {
      background: rgba(34, 197, 94, 0.1);
      color: rgb(34, 197, 94);
    }

    .ticket-priority-badge[data-priority="medium"] {
      background: rgba(234, 179, 8, 0.1);
      color: rgb(234, 179, 8);
    }

    .ticket-priority-badge[data-priority="high"] {
      background: rgba(249, 115, 22, 0.1);
      color: rgb(249, 115, 22);
    }

    .ticket-priority-badge[data-priority="urgent"] {
      background: rgba(239, 68, 68, 0.1);
      color: rgb(239, 68, 68);
    }

    .ticket-status-badge {
      font-size: 0.65rem;
      font-weight: 750;
      background: rgba(var(--primary-rgb), 0.1);
      color: var(--primary);
      padding: 3px 8px;
      border-radius: 6px;
      margin-left: auto;
    }

    .ticket-subject {
      font-weight: 800;
      font-size: 0.95rem;
      color: var(--text-primary);
      margin: 0;
    }

    .ticket-msg {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }

    .ticket-footer {
      display: flex;
      justify-content: space-between;
      font-size: 0.725rem;
      color: var(--text-secondary);
      opacity: 0.7;
      margin-top: 4px;
    }

    /* Virtual Assistant Chatbot */
    .chat-card {
      padding: 0;
      overflow: hidden;
      height: 600px;
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 0, 0, 0.1);
    }

    :host-context(body[data-theme="light"]) .chat-header {
      background: rgba(0, 0, 0, 0.02);
      border-bottom-color: rgba(0, 0, 0, 0.06);
    }

    .agent-avatar {
      position: relative;
      width: 42px;
      height: 42px;
    }

    .avatar-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: var(--primary);
      color: var(--on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-inner svg {
      width: 20px;
      height: 20px;
    }

    .pulse-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 12px;
      height: 12px;
      background: #22c55e;
      border: 2px solid var(--bg-card);
      border-radius: 50%;
    }

    :host-context(body[data-theme="light"]) .pulse-indicator {
      border-color: #ffffff;
    }

    .agent-info h3 {
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
    }

    .agent-info span {
      font-size: 0.725rem;
      color: #22c55e;
      font-weight: 600;
    }

    .chat-messages {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(var(--primary-rgb), 0.2);
      border-radius: 10px;
    }

    .message-bubble-wrapper {
      display: flex;
      width: 100%;
    }

    .message-bubble {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 0.875rem;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .bot-message {
      justify-content: flex-start;
    }

    .bot-message .message-bubble {
      background: rgba(0, 0, 0, 0.25);
      color: var(--text-primary);
      border-bottom-left-radius: 4px;
      border: 1px solid var(--border-color);
    }

    :host-context(body[data-theme="light"]) .bot-message .message-bubble {
      background: rgba(0, 0, 0, 0.03);
      border-color: rgba(0, 0, 0, 0.06);
    }

    .user-message {
      justify-content: flex-end;
    }

    .user-message .message-bubble {
      background: var(--primary);
      color: var(--on-primary);
      border-bottom-right-radius: 4px;
    }

    .msg-time {
      font-size: 0.65rem;
      align-self: flex-end;
      opacity: 0.6;
    }

    /* Typing Dots */
    .typing-bubble {
      padding: 14px 20px;
    }

    .typing-dots {
      display: flex;
      gap: 4px;
      align-items: center;
      height: 10px;
    }

    .typing-dots span {
      width: 6px;
      height: 6px;
      background: var(--text-secondary);
      border-radius: 50%;
      display: inline-block;
      animation: typing-dot 1.4s infinite ease-in-out both;
    }

    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing-dot {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }

    /* Input box */
    .chat-input-form {
      padding: 1.25rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: 10px;
      background: rgba(0, 0, 0, 0.08);
    }

    :host-context(body[data-theme="light"]) .chat-input-form {
      background: rgba(0, 0, 0, 0.01);
      border-top-color: rgba(0, 0, 0, 0.06);
    }

    .chat-input-form input {
      flex: 1;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background: rgba(0, 0, 0, 0.15);
      color: var(--text-primary);
      font-size: 0.875rem;
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
      width: 44px;
      height: 44px;
      border-radius: 12px;
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
      width: 18px;
      height: 18px;
      transform: rotate(45deg) translate(-2px, 2px);
    }
    
    @media (max-width: 768px) {
      .support-page-container { padding: 1rem; gap: 1.5rem; }
      .support-hero { padding: 2rem 1rem; border-radius: 16px; }
      .support-badge { font-size: 0.65rem; padding: 4px 12px; }
      .hero-content h1 { font-size: 1.5rem; }
      .hero-content p { font-size: 0.85rem; }
      
      .support-card { padding: 1.25rem; border-radius: 16px; gap: 1.25rem; }
      .card-header h2 { font-size: 1.25rem; }
      .card-header p { font-size: 0.8rem; }
      
      .search-box { padding: 8px 12px; }
      .search-box input { font-size: 0.8rem; }
      .cat-tab { padding: 4px 10px; font-size: 0.75rem; }
      
      .faq-trigger { padding: 12px 14px; }
      .faq-question { font-size: 0.85rem; }
      .faq-answer { font-size: 0.8rem; padding: 0 14px 14px 14px; }
      
      .form-group label { font-size: 0.75rem; }
      .form-group input, .form-group select, .form-group textarea { padding: 10px 12px; font-size: 0.8rem; }
      .btn-submit-ticket { height: 40px; font-size: 0.85rem; }
      
      .tickets-list-wrapper { padding-top: 1.5rem; margin-top: 1rem; }
      .subsection-title { font-size: 1rem; }
      .ticket-item { padding: 1rem; gap: 6px; }
      .ticket-id { font-size: 0.75rem; }
      .ticket-subject { font-size: 0.85rem; }
      .ticket-msg { font-size: 0.8rem; }
      
      .chat-card { height: 450px; }
      .chat-header { padding: 1rem; }
      .agent-avatar { width: 32px; height: 32px; }
      .agent-info h3 { font-size: 0.85rem; }
      .agent-info span { font-size: 0.65rem; }
      .chat-messages { padding: 1rem; gap: 0.75rem; }
      .message-bubble { font-size: 0.8rem; padding: 10px 14px; }
      .chat-input-form { padding: 0.75rem; gap: 8px; }
      .chat-input-form input { padding: 10px 12px; font-size: 0.8rem; }
      .chat-input-form button { width: 38px; height: 38px; }
    }
  `]
})
export class SupportComponent {
  private location = inject(Location);

  goBack() {
    this.location.back();
  }

  searchQuery = '';
  selectedCategory = signal<string>('all');

  categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'general', name: 'General' },
    { id: 'bookings', name: 'Bookings' },
    { id: 'payments', name: 'Payments' },
    { id: 'cancellation', name: 'Cancellations' },
    { id: 'troubleshooting', name: 'Troubleshooting' }
  ];

  faqs = signal<FAQ[]>([
    {
      question: 'How do I book a slot on TurfXpert?',
      answer: 'Simply log into your dashboard, select your preferred turf, choose an available date and time slot from the calendar, and proceed to checkout. You will get a booking confirmation SMS and Email instantly.',
      category: 'bookings',
      isOpen: false
    },
    {
      question: 'What is the refund policy?',
      answer: 'If you cancel your booking at least 6 hours before the reserved time, you will receive a full 100% refund. Cancellations made within 6 hours of the booking will not be eligible for a refund.',
      category: 'cancellation',
      isOpen: false
    },
    {
      question: 'Do you offer discount codes or promo offers?',
      answer: 'We regular release promo codes! Check out our dedicated "Offers" tab in the navbar. Copy any promo code and paste it on the checkout screen to apply discount.',
      category: 'general',
      isOpen: false
    },
    {
      question: 'What happens if it rains during our booked slot?',
      answer: 'Most premium turfs have high-grade drainage systems. If the match is unplayable, the turf owner will cancel the slot, and you will receive a full automatic refund.',
      category: 'bookings',
      isOpen: false
    },
    {
      question: 'What payment options are supported?',
      answer: 'We support all major payment networks including Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), NetBanking, and our native TurfXpert Wallet.',
      category: 'payments',
      isOpen: false
    },
    {
      question: 'How do I report a listing conflict or double booking?',
      answer: 'Our real-time engine prevents double booking. However, if there is a conflict, please open a support ticket immediately on this page with the booking ID or start a chat with XpertBot.',
      category: 'payments',
      isOpen: false
    },
    {
      question: 'The application is stuck on "Processing Payment".',
      answer: 'Do not refresh the page. This occasionally happens due to bank server delays. If money was deducted but the booking failed, it will be automatically refunded to your original payment method within 2-3 business days. Please open a ticket if it exceeds this timeframe.',
      category: 'troubleshooting',
      isOpen: false
    },
    {
      question: 'My location is not updating / GPS error.',
      answer: 'Please ensure you have granted location permissions to the TurfXpert app in your browser or device settings. Try refreshing the page after enabling location services.',
      category: 'troubleshooting',
      isOpen: false
    }
  ]);

  filteredFAQs = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    const cat = this.selectedCategory();
    
    return this.faqs().filter(f => {
      const matchQuery = !query || f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query);
      const matchCat = cat === 'all' || f.category === cat;
      return matchQuery && matchCat;
    });
  });

  // Ticket submission state
  newTicket = {
    category: '',
    priority: 'low' as 'low' | 'medium' | 'high' | 'urgent',
    subject: '',
    message: ''
  };

  myTickets = signal<SupportTicket[]>([]);

  // Chatbot State
  chatInput = '';
  isBotTyping = signal(false);
  chatLog = signal<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hi there! I am XpertBot, your TurfXpert digital support assistant. How can I help you today? Ask me about refunds, cancellation, or bookings!',
      time: new Date()
    }
  ]);

  onSearchChange(value: string) {
    this.searchQuery = value;
  }

  toggleFAQ(faq: FAQ) {
    // Toggle clicked FAQ and close others
    this.faqs.update(list => 
      list.map(f => {
        if (f.question === faq.question) {
          return { ...f, isOpen: !f.isOpen };
        }
        return { ...f, isOpen: false };
      })
    );
  }

  submitTicket(event: Event) {
    event.preventDefault();
    if (!this.newTicket.category || !this.newTicket.subject.trim() || !this.newTicket.message.trim()) {
      return;
    }

    const created: SupportTicket = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      category: this.newTicket.category,
      priority: this.newTicket.priority,
      subject: this.newTicket.subject,
      message: this.newTicket.message,
      status: 'Open',
      createdAt: new Date()
    };

    this.myTickets.update(list => [created, ...list]);

    // Reset Form
    this.newTicket = {
      category: '',
      priority: 'low',
      subject: '',
      message: ''
    };
  }

  sendChatMessage(event: Event) {
    event.preventDefault();
    const query = this.chatInput.trim();
    if (!query) return;

    // Add user message
    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      time: new Date()
    };
    
    this.chatLog.update(log => [...log, userMsg]);
    this.chatInput = '';
    this.isBotTyping.set(true);

    // Auto-scroll logic helper
    setTimeout(() => this.scrollChatToBottom(), 50);

    // Bot response delay simulator
    setTimeout(() => {
      let replyText = "I'm analyzing your request using our new AI-powered resolution engine... It looks like I need a bit more detail. Could you try asking about 'refund', 'cancellation', 'booking slots', 'wallet', or 'troubleshooting'?";
      
      const normalizedQuery = query.toLowerCase();
      if (normalizedQuery.includes('refund') || normalizedQuery.includes('money') || normalizedQuery.includes('cashback')) {
        replyText = "AI Instant Resolution: Refunds are processed automatically when you cancel a booking at least 6 hours before kickoff. It usually takes 2-3 business days to hit your source account, or it is instant if credited to your TurfXpert wallet.";
      } else if (normalizedQuery.includes('cancel') || normalizedQuery.includes('delete booking')) {
        replyText = "AI Instant Resolution: To cancel your booking, head to the 'Bookings' section from the top navbar, select the booking card you want to cancel, and click the 'Cancel' button. Remember to cancel at least 6 hours in advance for a full refund!";
      } else if (normalizedQuery.includes('slot') || normalizedQuery.includes('book') || normalizedQuery.includes('date')) {
        replyText = "AI Instant Resolution: You can browse premium open slots by heading over to the 'Dashboard'. Select your favorite turf arena, and pick any highlighted green slot from our rolling 7-day calendar strip.";
      } else if (normalizedQuery.includes('offer') || normalizedQuery.includes('promo') || normalizedQuery.includes('discount')) {
        replyText = "AI Instant Resolution: We have a dedicated 'Offers' tab in the navbar filled with active promo codes! Copy any active coupon and paste it in the Coupon section during checkout for direct discounts.";
      } else if (normalizedQuery.includes('wallet') || normalizedQuery.includes('balance') || normalizedQuery.includes('split')) {
        replyText = "AI Instant Resolution: You can check your wallet balance during checkout. The 'Split with Team' feature allows you to instantly generate a payment link to share with your friends, dividing the cost equally!";
      } else if (normalizedQuery.includes('stuck') || normalizedQuery.includes('gps') || normalizedQuery.includes('error')) {
        replyText = "AI Troubleshooting: It seems you're facing a technical issue. Please check the Troubleshooting guides on the left panel, or submit a High Priority ticket so our tech team can assist you within minutes.";
      } else if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi ') || normalizedQuery.includes('hey')) {
        replyText = "Hello! I am XpertBot, powered by AI to instantly resolve your queries. How can I assist you with your Turf bookings today?";
      } else if (normalizedQuery.includes('thank') || normalizedQuery.includes('thanks')) {
        replyText = "You're very welcome! Let me know if there's anything else I can do to get you back on the pitch.";
      }

      const botMsg: ChatMessage = {
        sender: 'bot',
        text: replyText,
        time: new Date()
      };

      this.chatLog.update(log => [...log, botMsg]);
      this.isBotTyping.set(false);

      setTimeout(() => this.scrollChatToBottom(), 50);
    }, 1200);
  }

  private scrollChatToBottom() {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
}
