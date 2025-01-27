// import { DataSource } from 'typeorm';
// import { config } from 'dotenv';
// import { User } from '../modules/user/entities/user.entity';
// import { Role } from '../modules/user/entities/role.entity';

// // Remplace cette configuration par celle utilisée dans ton AppModule
// const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432', 10),
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'psql_archi_db',
//   entities: [User, Role],
//   synchronize: false,
//   logging: true,
// });

// async function testTypeORM() {
//   await AppDataSource.initialize();

//   const userRepository = AppDataSource.getRepository(User);
//   const roleRepository = AppDataSource.getRepository(Role);

//   // Créer un rôle
//   const role = new Role();
//   role.name = 'admin';
//   await roleRepository.save(role);

//   // Créer un utilisateur avec un rôle
//   const user = new User();
//   user.username = 'john';
//   user.email = 'john@example.com';
//   user.password = 'password123';
//   await userRepository.save(user);

//   // Récupérer l'utilisateur avec ses rôles
//   const userWithRoles = await userRepository.find({
//     where: { username: 'john' },
//     relations: ['roles'],
//   });

//   console.log('User with roles:', userWithRoles);

//   await AppDataSource.destroy();
// }

// testTypeORM().catch((err) => {
//   console.error('Error:', err);
// });
