import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from './../app.service';
import { ApiService } from './../common/api.service';
import { ToastController } from '@ionic/angular';
import { Api } from './../common/api.request';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  categories: any;
  products: any;
  cartItems: any;
  badgeValue: any;
  originalProducts: any;
  constructor(private loadingController: LoadingController, private appService: AppService,
    private apiService: ApiService, private http: HttpClient,
    public toastController: ToastController, public navCtrl: NavController, private router: Router) {
    this.cartItems = [];
    this.badgeValue = JSON.parse(localStorage.getItem('badgeValue'));
    this.products = [];
  }


  ngOnInit() {
    this.getCategories();

    this.setOriginalProducts();

    this.getProducts();
  }

  ionViewWillEnter() {
    this.cartItems = JSON.parse(localStorage.getItem('cartItems'));

    this.badgeValue = JSON.parse(localStorage.getItem('badgeValue'));

  }




  getCategories() {
    this.categories = [
      {
        id : "1",
        name: "Jeans"
      },
      {
        id : "2",
        name: "T-shirts"
      },
      {
        id : "3",
        name: "Jacket"
      },
      {
        id : "4",
        name: "Shoes"
      },
    ];
  }



  getProducts() {
      this.products = [];
      this.products = this.originalProducts
  }

  setOriginalProducts(){
    this.originalProducts = [
      {
        id: 1,
        category_id : "3",
        name: "Nylon-blend bomber jacket",
        description: "Bomber jacket woven in a nylon blend with a ribbed stand-up collar and zip down the front. Zipped chest pocket, pockets in the side seams, an inner ...",
        image_url: "http://clothes.itambition.com/pub/media/catalog/product/cache/d795104010ef3a1433a88a273220b81c/4/_/4.png",
        price: 120,
        qty: 1
      },
      {
        id: 2,
        category_id : "3",
        name: "grey bomber jacket",
        description: "Bomber jacket woven in a nylon blend with a ribbed stand-up collar and zip down the front. Zipped chest pocket, pockets in the side seams, an inner ...",
        image_url: "http://clothes.itambition.com/pub/media/catalog/product/cache/d795104010ef3a1433a88a273220b81c/d/c/dc1b4410992545.560ef38fdf71b.jpg",
        price: 110,
        qty: 1
      },
      {
        id: 3,
        category_id : "2",
        name: "stylish Look",
        description: "Bomber jacket woven in a nylon blend with a ribbed stand-up collar and zip down the front. Zipped chest pocket, pockets in the side seams, an inner ...",
        image_url: "http://clothes.itambition.com/pub/media/catalog/product/cache/d795104010ef3a1433a88a273220b81c/3/_/3.png",
        price: 20,
        qty: 1
      },
      {
        id: 4,
        category_id : "1",
        name: "dark jeans",
        description: "Bomber jacket woven in a nylon blend with a ribbed stand-up collar and zip down the front. Zipped chest pocket, pockets in the side seams, an inner ...",
        image_url: "http://clothes.itambition.com/pub/media/catalog/product/cache/d795104010ef3a1433a88a273220b81c/f/e/fe2c7210992545.560ef4426dd86.jpg",
        price: 100,
        qty: 1
      },
      {
        id: 5,
        category_id : "1",
        name: "Camel Look",
        description: "Bomber jacket woven in a nylon blend with a ribbed stand-up collar and zip down the front. Zipped chest pocket, pockets in the side seams, an inner ...",
        image_url: "http://clothes.itambition.com/pub/media/catalog/product/cache/d795104010ef3a1433a88a273220b81c/2/_/2.png",
        price: 200,
        qty: 1
      },
      {
        id: 6,
        category_id : "4",
        name: "classic dark",
        description: "Bomber jacket woven in a nylon blend with a ribbed stand-up collar and zip down the front. Zipped chest pocket, pockets in the side seams, an inner ...",
        image_url: "http://clothes.itambition.com/pub/media/catalog/product/cache/d795104010ef3a1433a88a273220b81c/6/_/6.png",
        price: 60,
        qty: 1
      },
      {
        id: 7,
        category_id : "4",
        name: "classic brown",
        description: "Bomber jacket woven in a nylon blend with a ribbed stand-up collar and zip down the front. Zipped chest pocket, pockets in the side seams, an inner ...",
        image_url: "http://clothes.itambition.com/pub/media/catalog/product/cache/d795104010ef3a1433a88a273220b81c/5/_/5.png",
        price: 140,
        qty: 1
      },
      {
        id: 8,
        category_id : "4",
        name: "classic dark",
        description: "Bomber jacket woven in a nylon blend with a ribbed stand-up collar and zip down the front. Zipped chest pocket, pockets in the side seams, an inner ...",
        image_url: "http://clothes.itambition.com/pub/media/catalog/product/cache/d795104010ef3a1433a88a273220b81c/6/_/6.png",
        price: 60,
        qty: 1
      },
      

    ];
  }

  addToCart(item) {

    if (this.cartItems.length > 0) {
      let ok = 0;
      this.cartItems.forEach(element => {
        if (element.id === item.id) {
          element.qty += 1;
          ok = 1;
        }
      });
      if (ok == 0) {
        this.cartItems.push(item);
        ok = 0;
      }
    }

    if (this.cartItems.length == 0) {
      this.cartItems.push(item);
    }


    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));

    this.badgeValue += 1;

    localStorage.setItem('badgeValue', JSON.stringify(this.badgeValue));

  }




  openDetailsWithState(item) {
    let navigationExtras: NavigationExtras = {
      state: {
        product: item
      }
    };
    this.router.navigate(['product'], navigationExtras);
  }

  getProductsByCategory(id) {
      this.products = [];
      this.originalProducts.forEach(element => {
        if(element.category_id == id){
          this.products.push(element);
        }
      });    

      
  }

  search(q) {
    if (q && q.trim() != '') {
      this.products = this.products.filter((item) => {
        return (item.name.toLowerCase().indexOf(q.toLowerCase()) > -1);
      })
    } else {
      this.getProducts();
    }

  }

}
