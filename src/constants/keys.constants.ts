import { config } from 'dotenv';

config();

export const SECURITY_KEY = process.env.security_key;
export const AUTH_CODE = process.env.auth_code;
