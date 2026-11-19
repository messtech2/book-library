const jwtSecretValue = process.env.JWT_SECRET;
if (!jwtSecretValue) {
throw new Error('JWT_SECRET is not defined');
}

export const jwtSecret: string = jwtSecretValue;