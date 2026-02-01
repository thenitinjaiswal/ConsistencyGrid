// Load environment variables from .env file
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function grantAccess() {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address.');
        console.log('Usage: node scripts/grant-access.js <email>');
        process.exit(1);
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        console.log(`Found user: ${user.name} (${user.email})`);
        console.log(`Current plan: ${user.plan}`);

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                plan: 'lifetime',
                subscriptionStatus: 'active',
                subscriptionStartDate: new Date(),
                paymentProvider: 'manual_grant', // Marking as manually granted
            },
        });

        console.log('-----------------------------------');
        console.log('✅ Access granted successfully!');
        console.log(`New plan: ${updatedUser.plan}`);
        console.log(`Status: ${updatedUser.subscriptionStatus}`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('Error granting access:', error);
    } finally {
        await prisma.$disconnect();
    }
}

grantAccess();
