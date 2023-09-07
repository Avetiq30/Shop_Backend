import {Column} from 'typeorm'
export class Product {
@Column()
name: string;

@Column()
category: string;

@Column('decimal', { precision: 10, scale: 2 })
price: number;

@Column('text')
description: string;

 @Column()
image: string;
}