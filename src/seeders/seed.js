const { User, Task } = require('../models');
const { Counter } = require('../models/Counter');
const { connectDB } = require('../config/db');

const seedData = async () => {
    try {
        console.log('Starting database seeding...');

        // Connect to database
        await connectDB();

        // Clear existing data
        await Task.deleteMany({});
        await User.deleteMany({});
        await Counter.deleteMany({});
        console.log('Database cleared');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@taskmanager.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Admin user created');

        // Create regular users
        const users = await User.create([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'Bob Johnson',
                email: 'bob@example.com',
                password: 'password123',
                role: 'user'
            }
        ]);
        console.log('Regular users created');

        // Create tasks
        await Task.create([
            {
                title: 'Setup development environment',
                description: 'Install Node.js, Mongoose, and necessary tools',
                status: 'done',
                created_by_id: admin._id,
                assigned_to_id: users[0]._id
            },
            {
                title: 'Design database schema',
                description: 'Define Mongoose schemas and relationships',
                status: 'done',
                created_by_id: admin._id,
                assigned_to_id: users[1]._id
            },
            {
                title: 'Implement authentication',
                description: 'Add JWT-based authentication with bcrypt for password hashing',
                status: 'in_progress',
                created_by_id: admin._id,
                assigned_to_id: users[0]._id
            },
            {
                title: 'Create CRUD endpoints',
                description: 'Build RESTful API endpoints for task management',
                status: 'in_progress',
                created_by_id: users[1]._id,
                assigned_to_id: users[2]._id
            },
            {
                title: 'Write unit tests',
                description: 'Add test coverage for all controllers and models',
                status: 'pending',
                created_by_id: admin._id,
                assigned_to_id: users[1]._id
            },
            {
                title: 'Deploy to cloud',
                description: 'Setup CI/CD pipeline and deploy to production',
                status: 'pending',
                created_by_id: users[0]._id,
                assigned_to_id: users[2]._id
            },
            {
                title: 'Create API documentation',
                description: 'Document all endpoints with examples in Postman',
                status: 'pending',
                created_by_id: admin._id,
                assigned_to_id: users[0]._id
            },
            {
                title: 'Implement role-based access',
                description: 'Add admin and user role permissions',
                status: 'done',
                created_by_id: users[1]._id,
                assigned_to_id: users[1]._id
            }
        ]);
        console.log('Tasks created');

        console.log('\nSeeding completed successfully!\n');
        console.log('Login credentials:');
        console.log('Admin: admin@taskmanager.com / admin123');
        console.log('User1: john@example.com / password123');
        console.log('User2: jane@example.com / password123');
        console.log('User3: bob@example.com / password123\n');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
