import { Component, OnInit } from '@angular/core';
import { Api } from './../common/api.request';
import { ApiService } from './../common/api.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AppService } from './../app.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {
  token: any;
  accessToken : any;
  userData: any;
  loaderToShow: any;
  apiUserOrders: any;
  userTotalOrders: any;
  userPendingOrders: any;
  userCartProductsCount: any;
  quote: any;


  constructor(private apiService: ApiService, private httpClient: HTTP, private http: HttpClient,
    private router: Router, private loadingController: LoadingController,
    private appService: AppService) {

    this.token = JSON.parse(localStorage.getItem('AuthToken'));
    this.accessToken = JSON.parse(localStorage.getItem('accessToken'));
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.apiUserOrders = '';
    this.userTotalOrders = '';
    this.userPendingOrders = [];
    this.userCartProductsCount = 0;
    this.quote = JSON.parse(localStorage.getItem('quote_id'));


  }


  ngOnInit() {
  
    this.showLoader();

    this.getUserTotalOrders();

    this.getCartProductsCount();

    this.getProducts();
  }

  forceHideLoader() {
    this.loadingController.dismiss();
  }

  async getProducts() {
    

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.accessToken
    })
  };

  this.http.get(Api.orders.getAllOrders + this.userData.id, httpOptions)
    .subscribe(data => {
      this.forceHideLoader();
      
      this.userTotalOrders = data['total_count'];

      for(let item of data['items']) {
        if(item['status'] == 'pending'){
          this.userPendingOrders.push(item);
        }
      }


    }, error => {
      this.router.navigate(['/dashboard'], {});
    });

  };
 

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Loading ...'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
      });
    });
    this.hideLoader();
  }

  hideLoader() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 3000);
  }




  getUserTotalOrders() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.accessToken
      })
    };

    this.http.get(Api.orders.getAllOrders + this.userData.id, httpOptions)
      .subscribe(data => {

        this.userTotalOrders = data['total_count'];


      }, error => {
        this.router.navigate(['/dashboard'], {});
      });
  }


  openMenu() {
    document.querySelector('ion-menu-controller')
      .open();
  }


  getCartProductsCount(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.accessToken,

      }),
    };


    this.http.get(Api.cart.getCart + this.quote, httpOptions)
      .subscribe(res => {
        this.userCartProductsCount = res['items_qty'];
      });
    }
}

