import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

interface Order {
  orderId: string
  userId?: string
  amount: number
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  public orders: Order[] = []
  public num: number = 0
  public order: Order = {orderId : '', userId : '', amount : 0}

  constructor(private dbService: DbService) { }

  ngOnInit(): void {
    this.dbService.getOrders()?.subscribe(orders => {
      this.orders = orders
    })
    this.dbService.countOrder()?.subscribe(num => {
      this.num = num
    })
  }

  onCreateOrder(orderId: string, amount: string): void {
    this.dbService.createOrder(orderId, Number(amount))?.subscribe(order => {
      this.order = order
    })
  }

  onFindOrder(orderId: string): void {
    this.dbService.findOrder(orderId)?.subscribe(order => {
      this.order = order
    })
  }
}
