import { faker } from '@faker-js/faker';
import { Voucher } from '@prisma/client';

export async function __createVoucer(): Promise<Voucher> {
    return await {              
        id: faker.datatype.number(),
        code: faker.name.jobArea(),
        discount: Number(faker.random.numeric(2)),
        used: faker.datatype.boolean()
    }
}