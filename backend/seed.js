const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Create a test user
        const email = 'benchmark@example.com';
        const password = 'password123';
        let user = await User.findOne({ email });

        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({
                name: 'Benchmark User',
                email,
                password: hashedPassword,
            });
            await user.save();
            console.log('Created benchmark user:', email);
        } else {
            console.log('Using existing benchmark user:', email);
        }

        // Clear existing tasks for this user to have a clean slate (optional, but good for consistent benchmark)
        // await Task.deleteMany({ user: user._id });
        // console.log('Cleared existing tasks for user');

        const tasks = [];
        const priorities = ['HIGH PRIORITY', 'MODERATE PRIORITY', 'LOW PRIORITY'];
        const taskTypes = ['Backlog', 'To do', 'In progress', 'Done'];

        console.log('Generating 1000 tasks...');
        for (let i = 0; i < 1000; i++) {
            const priority = priorities[Math.floor(Math.random() * priorities.length)];
            const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];

            // Random due date within next 30 days
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));

            tasks.push({
                title: `Benchmark Task ${i + 1}`,
                priority,
                checklist: [{ text: 'Sample item', done: false }],
                taskType,
                due_date: Math.random() > 0.5 ? dueDate : undefined, // 50% chance of due date
                user: user._id,
            });
        }

        await Task.insertMany(tasks);
        console.log(`Successfully seeded ${tasks.length} tasks.`);

        mongoose.connection.close();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
