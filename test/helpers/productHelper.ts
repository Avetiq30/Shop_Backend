import { UserModel } from '../../src/user/user.model';

export const loginData = {
  email: 'testProduct@mail.ru',
  password: 'test123123',
};
export const userData: UserModel = {
  name: 'test',
  lastname: 'lasttest',
  email: loginData.email,
  password: loginData.password,
  role: undefined,
  phone: '1234567890',
  address: 'erevan',
};

export const createProductsDto = {
  name: 'testProduct',
  description: 'test product with my online shop',
  price: 555,
  category: '',
  image: '',
};
