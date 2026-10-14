import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

export const connectToDB = async (app, PORT) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export const syncDB = async () => {
  try {
    const result = await sequelize.sync({ force: false, alter: false });
    console.log({ models: result.models });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.log('Unable to sync the database:', error);
  }
};
