const dev = process.env.NODE_ENV !== 'production';

export const NEXT_SERVER = dev
  ? process.env.LOCAL_SERVER
  : process.env.PROD_SERVER;

export const AWS_SERVER = process.env.AWS_SERVER;
