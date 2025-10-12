import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

interface AppInfo {
  name?: string;
  id?: string;
  version?: string;
  build?: number | string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: false,
})
export class AboutPage implements OnInit {
  appInfo: AppInfo = {};
  platform: string = '';

  constructor(private router: Router, private toastCtrl: ToastController) {}

  async ngOnInit() {
    try {
      const info = await App.getInfo();
      this.appInfo = {
        name: info.name,
        id: info.id,
        version: info.version,
        build: info.build,
      };
      this.platform = Capacitor.getPlatform();
    } catch (err) {
      // Fallback if Capacitor not available (web preview)
      this.appInfo = {
        name: 'iraqi-lottery-mobile',
        id: 'io.ionic.starter',
        version: '0.0.0-dev',
        build: 'dev',
      };
      this.platform = 'web';
    }
  }

  async copyVersion() {
    const text = `${this.appInfo.version} (${this.appInfo.build})`;
    try {
      await navigator.clipboard.writeText(text);
      const toast = await this.toastCtrl.create({
        message: 'تم نسخ الإصدار',
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
    } catch (e) {
      // ignore
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
