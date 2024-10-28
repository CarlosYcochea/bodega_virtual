import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './services/auth-service.service';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.authService.getAuthState().subscribe(state => {
      this.isLoggedIn = state;
      if (!state) {
        this.menuCtrl.enable(false, 'main-menu');
      } else {
        this.menuCtrl.enable(true, 'main-menu');
      }
    });
  }

  async checkLoginStatus() {
    this.isLoggedIn = await this.authService.isLoggedIn();
  }
  
  logout() {
    this.menuCtrl.close('main-menu');
    this.authService.logout();
  }

}
