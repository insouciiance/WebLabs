export const baseURL =
    process.env.NODE_ENV.toLowerCase() === 'development'
        ? 'https://localhost:5001/graphql'
        : 'https://insouciiance-todos-api.azurewebsites.net/graphql';

export const baseURLWSS =
    process.env.NODE_ENV.toLowerCase() === 'development'
        ? 'wss://localhost:5001/graphql'
        : 'wss://insouciiance-todos-api.azurewebsites.net/graphql';
