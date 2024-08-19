export const registerCustomer = async (request,graphql) => {
    const formData = await request.body;
    const { firstName, lastName, email, phone } = formData;
    const query = `
    mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
            userErrors {
            field
            message
            }
            customer {
            email
            phone
            firstName
            lastName
            }
        }
        },
        {
        input: {
        email: ${email},
        phone: ${phone},
        firstName:${firstName},
        lastName: ${lastName}	
        }
        }
            
        `
    const response = await graphql(query);
    if (response.errors) {
        return { status: 400, message: response.errors[0].message };
    }
    return { status: 200, message: response };


}