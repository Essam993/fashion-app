import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToasterChildService } from './../toaster/toaster-child.service';
import { LoadingController } from '@ionic/angular';
import { Api } from './../common/api.request';


@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {

  @Input() name: string;
  countries: any;
  regions: any;
  userData: any;
  token: any;
  loaderToShow: any;

  constructor(private loadingController: LoadingController,public navParams: NavParams, public modalCtrl: ModalController, private router: Router,
    private httpClient: HTTP, private http: HttpClient, public toastController: ToastController, public toaster: ToasterChildService ) {

    console.log(navParams.get('name'));
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.countries = [];
    this.regions = [];
    this.token = JSON.parse(localStorage.getItem('AuthToken'));

  }

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
    }, 5000);
  }

  public closeModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  ngOnInit() {
    this.getAllCountries();
  }

  getAllCountries() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    this.http.get(Api.countries.getCountries, httpOptions)
      .subscribe(data => {

        this.countries = data;

      }, error => {
      });
  }

  catched(value: any) {
    let countryId = value.detail['value'];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    this.http.get(Api.countries.getCountries + countryId, httpOptions)
      .subscribe(data => {

        this.regions = data['available_regions'];

      }, error => {
      });
  }

  submitForm(form: any) {
    this.showLoader();

    let region_id = '';
    let region = '';
    let country_id = form._directives[6].model;
    let street = form._directives[2].model;
    let postcode = form._directives[4].model;
    let city = form._directives[3].model;
    let firstname = form._directives[0].model;
    let lastname = form._directives[1].model;
    let email = this.userData.email;
    let telephone = form._directives[5].model;

    if (parseInt(form._directives[7].model) == NaN) {
      region = form._directives[7].model;
    } else {
      region_id = form._directives[7].model;
    }
    let formData: any;
    let orderData: any;
    let addressData: any;

    if(region_id == ''  || country_id == '' || street == '' ||
        postcode == '' || city == '' || firstname == '' || lastname == '' || 
        email == '' || telephone == ''){

          this.toastError();
          stop();
      }

    formData = {
      "addressInformation": {
        "shipping_address": {
          "region": region,
          "region_id": region_id,
          "region_code": "",
          "country_id": country_id,
          "street": [
            street
          ],
          "postcode": postcode,
          "city": city,
          "firstname": firstname,
          "lastname": lastname,
          "email": email,
          "telephone": telephone
        },
        "billing_address": {
          "region": region,
          "region_id": region_id,
          "region_code": "",
          "country_id": country_id,
          "street": [
            street
          ],
          "postcode": postcode,
          "city": city,
          "firstname": firstname,
          "lastname": lastname,
          "email": email,
          "telephone": telephone
        },
        "shipping_carrier_code": "flatrate",
        "shipping_method_code": "flatrate"
      }

    }

    addressData = {
      "address": {
        "region": region,
        "region_id": region_id,
        "region_code": "",
        "country_id": country_id,
        "street": [
          street
        ],
        "postcode": postcode,
        "city": city,
        "firstname": firstname,
        "lastname": lastname,
        "customer_id": this.userData.id,
        "email": email,
        "telephone": telephone,
        "same_as_billing": 1
      }
    }

    orderData = {
      "paymentMethod": {
        "method": "checkmo"
      },
      "billing_address": {
        "email": email,
        "region": region,
        "region_id": region_id,
        "region_code": "",
        "country_id": country_id,
        "street": [street],
        "postcode": postcode,
        "city": city,
        "telephone": telephone,
        "firstname": firstname,
        "lastname": lastname
      },
      "shipping_carrier_code": "flatrate",
      "shipping_method_code": "flatrate"
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.token
      })
    };

    this.http.post(Api.cart.shippingInfo, formData, httpOptions)
      .subscribe(data => {

        this.createOrder(orderData, httpOptions);

      }, error => {
        this.toaster.show('danger', error.error.message);
      });


    // this.http.post('http://pharmacy.itambition.com/rest/V1/carts/mine/estimate-shipping-methods', addressData, httpOptions)
    //   .subscribe(data => {

    //     console.log(data);

    //   }, error => {
    //     console.log(error);
    //   });



  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your order has been submitted successfuly.',
      duration: 2000,
      cssClass: "toasterStyle",
    });
    toast.present();
  }

  toastError() {
    this.toaster.show('danger', 'All Fields Are Required.');
  }

  createOrder(orderData, httpOptions) {

    this.http.post(Api.cart.paymentInfo, orderData, httpOptions)
      .subscribe(data => {
        this.presentToast();

        this.createNewCart();

      }, error => {
        this.toaster.show('danger', error.error.message);
      });
  }

  createNewCart() {
    this.http.post(Api.cart.createCart, '', {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + JSON.parse(localStorage.getItem('AuthToken')),
        'Content-Type': 'application/json'
      })
    })
      .subscribe(data => {

        localStorage.setItem('quote_id', JSON.stringify(data));

        this.router.navigate(['/order'], {});

        this.closeModal();

      }, error => {
        this.router.navigate(['/login'], {});
      });

  }





}
