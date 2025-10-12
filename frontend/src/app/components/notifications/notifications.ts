import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService, Notification } from '../../services/notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications; trackBy: trackByFn"
        class="notification"
        [ngClass]="'notification-' + notification.type"
        [@slideIn]
      >
        <div class="notification-content">
          <div class="notification-icon">
            <i [ngClass]="getIconClass(notification.type)"></i>
          </div>
          <div class="notification-body">
            <h4 class="notification-title">{{ notification.title }}</h4>
            <p class="notification-message">{{ notification.message }}</p>
            <div class="notification-actions" *ngIf="notification.actions?.length">
              <button 
                *ngFor="let action of notification.actions"
                class="notification-action"
                [ngClass]="{ 'primary': action.primary }"
                (click)="executeAction(action, notification.id)"
              >
                {{ action.label }}
              </button>
            </div>
          </div>
          <button 
            class="notification-close"
            (click)="removeNotification(notification.id)"
            aria-label="Close notification"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div 
          class="notification-progress" 
          *ngIf="!notification.persistent && notification.duration && notification.duration > 0"
          [style.animation-duration]="notification.duration + 'ms'"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      width: 100%;
    }

    .notification {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(220, 38, 38, 0.3);
      margin-bottom: 16px;
      overflow: hidden;
      border-left: 6px solid #ffffff;
      position: relative;
      animation: slideInRight 0.4s ease-out;
      backdrop-filter: blur(10px);
    }

    .notification-success {
      border-left-color: #ffffff;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    }

    .notification-error {
      border-left-color: #ffffff;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    }

    .notification-warning {
      border-left-color: #ffffff;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    }

    .notification-info {
      border-left-color: #ffffff;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      padding: 20px;
      gap: 16px;
    }

    .notification-icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 16px;
      color: #dc2626;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }

    .notification-success .notification-icon {
      background-color: rgba(255, 255, 255, 0.9);
      color: #dc2626;
    }

    .notification-error .notification-icon {
      background-color: rgba(255, 255, 255, 0.9);
      color: #dc2626;
    }

    .notification-warning .notification-icon {
      background-color: rgba(255, 255, 255, 0.9);
      color: #dc2626;
    }

    .notification-info .notification-icon {
      background-color: rgba(255, 255, 255, 0.9);
      color: #dc2626;
    }

    .notification-body {
      flex: 1;
    }

    .notification-title {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      font-family: 'Cairo', 'Tajawal', sans-serif;
    }

    .notification-message {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #ffffff;
      line-height: 1.6;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
      font-family: 'Inter', 'Cairo', sans-serif;
    }

    .notification-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }

    .notification-action {
      padding: 8px 16px;
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    }

    .notification-action:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .notification-action.primary {
      background: rgba(255, 255, 255, 0.9);
      color: #2c3e50;
      border-color: rgba(255, 255, 255, 0.9);
      text-shadow: none;
    }

    .notification-action.primary:hover {
      background: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    .notification-close {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      cursor: pointer;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .notification-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .notification-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0.8));
      width: 100%;
      animation: shrink linear;
      border-radius: 0 0 16px 16px;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%) scale(0.8);
        opacity: 0;
      }
      to {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
    }

    @keyframes shrink {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    /* RTL Support */
    [dir="rtl"] .notification-container {
      right: auto;
      left: 20px;
    }

    [dir="rtl"] .notification {
      border-left: none;
      border-right: 4px solid;
    }

    [dir="rtl"] .notification-success {
      border-right-color: #10b981;
    }

    [dir="rtl"] .notification-error {
      border-right-color: #ef4444;
    }

    [dir="rtl"] .notification-warning {
      border-right-color: #f59e0b;
    }

    [dir="rtl"] .notification-info {
      border-right-color: #3b82f6;
    }

    @keyframes slideInLeft {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    [dir="rtl"] .notification {
      animation: slideInLeft 0.3s ease-out;
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  executeAction(action: any, notificationId: string): void {
    action.action();
    this.removeNotification(notificationId);
  }

  trackByFn(index: number, item: Notification): string {
    return item.id;
  }

  getIconClass(type: string): string {
    const icons = {
      success: 'fas fa-check',
      error: 'fas fa-exclamation-triangle',
      warning: 'fas fa-exclamation',
      info: 'fas fa-info'
    };
    return icons[type as keyof typeof icons] || icons.info;
  }
}
