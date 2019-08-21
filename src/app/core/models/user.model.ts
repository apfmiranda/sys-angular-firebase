export class User {
  id: string;
  name?: string;
  email?: string;
  createdAt?: string;

  constructor(user: User) {
    Object.keys(user)
      .forEach(key => this[key] = user[key]);
  }

}
