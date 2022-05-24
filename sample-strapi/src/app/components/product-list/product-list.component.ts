import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

interface Product {
  id: string
  productName: string
  unitPrice: number
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public products: Product[] = [];
  public num: number = 0;
  public product: Product = {id : '', productName : '', unitPrice : 0};

  constructor(
    private dbService: DbService
  ) { }

  ngOnInit(): void {
    this.dbService.getProducts()?.subscribe(products => {
      this.products = products;
    })
    this.dbService.countProducts()?.subscribe(num => {
      this.num = num;
    })
  }
  
  onFindProduct(id: string) {
    this.dbService.findProducts(id)?.subscribe(product => {
      this.product = product;
    })
  }

}
