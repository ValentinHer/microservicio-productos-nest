import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>){}

  async create(createProductDto: CreateProductDto) {
    const productSaved = await this.productRepository.save(createProductDto);

    if(!productSaved) throw new RpcException({success: false, message: 'Error al guarda el producto'});

    return {success: true, message: 'Producto guardado exitosamente', data: productSaved};
  }

  async findAll() {
    const products = await this.productRepository.find();

    return {success: true, message: 'Productos recuperados exitosamente', data: products};
  }

  async findOne(id: string) {
    const productFound = await this.productRepository.findOneBy({id});

    if(!productFound) throw new RpcException({success: false, message: 'Producto no encontrado'});

    return productFound;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
