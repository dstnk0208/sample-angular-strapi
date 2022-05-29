export interface Product {
    id: string
    productName: string
    unitPrice: number
}
  
export interface Order {
    orderId: string
    userId?: string
    amount: number
}

export interface UserSignUp {
    email: string,
    password: string,
    username: string
}

export interface UserSignIn {
    identifier: string,
    password: string
}

export interface UserRegister {
    email: string,
    password: string,
    username: string
}