import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "LogRocket Express API with Swagger",
            version: "1.0",
            description:
                "This is a simple CRUD API application for restaurants made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            schemas: {
                Restaurant: {
                    type: "object",
                    properties: {
                        restaurant_id: {
                            type: 'string',
                            description: "The auto-generated id of the restaurant"
                        },
                        name: {
                            type: 'string',
                            description: "The name of your restaurant"
                        },
                        grades: {
                            type: 'array',
                            description: "The restaurant's grades (array of object with a date, a grade and a score)"
                        },
                        cuisine: {
                            type: 'string',
                            description: "Type of foods the restaurant propose"
                        },
                        borough: {
                            type: 'array',
                            description: "The borough of the restaurant"
                        },
                        address: {
                            type: 'object',
                            description: "The restaurant's address (object with a building number, coord, street and zipcode"
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        uuid: {
                            type: 'string',
                            description: "The auto-generated id of the user"
                        },
                        name: {
                            type: 'string',
                            description: "The user's name"
                        },
                        email: {
                            type: 'string',
                            description: "The user's email"
                        } ,
                        password: {
                            type: 'string',
                            description: "The user's password"
                        }
                    }
                }
            }
        }
    },
    apis: ["**/*.controller.ts"],
};

export const specs = swaggerJsdoc(options);