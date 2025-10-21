import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../src/product/entities/product.entity';
import { ProductModule } from '../src/product/product.module';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';

describe('ProductController (e2e)', () => {
  let app: INestMicroservice;
  let client: ClientProxy;
  let container: StartedPostgreSqlContainer;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:17.0')
      .withDatabase('testdb')
      .withUsername('test')
      .withPassword('test')
      .start();

    const pgPort = container.getMappedPort(5432); 
    const pgHost = container.getHost();
    const pgUser = container.getUsername();
    const pgPassword = container.getPassword();
    const pgDb = container.getDatabase();
      

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: pgHost,
          port: pgPort,
          username: pgUser,
          password: pgPassword,
          database: pgDb,
          entities: [Product],
          synchronize: true
        }),
        ProductModule
      ],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 6000
      }
    });

    await app.listen();

    client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: "127.0.0.1",
        port: 6000
      }
    })

    await client.connect();
  });

  afterAll(async () => {
    if (client) await client.close();
    if (app) await app.close();
    if (container) await container.stop();
  })

  it('Should create a product', async () => {
    const image = fs.readFileSync(path.join(__dirname, '/assets/fondo_2.jpg'));

    const data = {name: 'Producto 1', description: 'Imagen del producto 1', price: 20.50, stock: 30, image};

    const result = await firstValueFrom(client.send({cmd: 'create_product'}, data));

    expect(result.success).toEqual(true);
    expect(result.message).toEqual('Producto guardado exitosamente');
    expect(result.data).toEqual(expect.objectContaining({name: data.name, description: data.description, price: data.price, stock: data.stock}));
  });

  it('Should retrieve a product', async () => {
    const image = fs.readFileSync(path.join(__dirname, '/assets/fondo_2.jpg'));

    const data = {name: 'Producto 2', description: 'Imagen del producto 2', price: 25.50, stock: 20, image};

    const result = await firstValueFrom(client.send({cmd: 'create_product'}, data));

    const productId = result.data.id;
    const resultGetProduct = await firstValueFrom(client.send({cmd: 'find_one_product_by_id'}, productId));

    expect(resultGetProduct).toEqual(expect.objectContaining({id: productId, name: data.name, description: data.description, price: String(data.price), stock: data.stock}));
  });

  it(`Should throw a error when the product doesn't exits by id`, async () => {
    const id = "a0aaaa99-9a0a-4aa8-aa6a-6aa9aa293a22";

    try {
      await firstValueFrom(client.send({cmd: 'find_one_product_by_id'}, id));
      fail('El get de un producto por el id no falló como se esperaba');
    } catch (error) {
      expect(error.success).toEqual(false);
      expect(error.message).toEqual('Producto no encontrado');
    }
  });

  it('Should retrieve all products from the DB', async () => {
    const image = fs.readFileSync(path.join(__dirname, '/assets/fondo_2.jpg'));

    const products = [
      {name: 'Producto 10', description: 'Imagen del producto 10', price: 20.50, stock: 30, image},
      {name: 'Producto 11', description: 'Imagen del producto 11', price: 30.00, stock: 40, image},
      {name: 'Producto 12', description: 'Imagen del producto 12', price: 35.50, stock: 50, image},
      {name: 'Producto 13', description: 'Imagen del producto 13', price: 50.50, stock: 80, image}
    ];

    for(let i = 0; i < products.length; i++) {
      const product = products[i];
      await firstValueFrom(client.send({cmd: 'create_product'}, product));
    }

    const result = await firstValueFrom(client.send({cmd: 'find_all_product'}, {}));

    expect(result.success).toEqual(true);
    expect(result.message).toEqual("Productos recuperados exitosamente");
    expect(result.data).toEqual(expect.arrayContaining([
      expect.objectContaining({name: products[0].name, description: products[0].description, price: String(products[0].price), stock: products[0].stock}),
      expect.objectContaining({name: products[1].name, description: products[1].description, price: String(products[1].price), stock: products[1].stock}),
      expect.objectContaining({name: products[2].name, description: products[2].description, price: String(products[2].price), stock: products[2].stock}),
      expect.objectContaining({name: products[3].name, description: products[3].description, price: String(products[3].price), stock: products[3].stock}),
    ]))
  });

});
