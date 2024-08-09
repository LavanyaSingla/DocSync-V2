const mongoose = require('mongoose');
const Role = require('./models/RoleSchema/role'); // Adjust the path as needed

mongoose.connect('mongodb://localhost:27017/Group-Docs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const createRoles = async () => {
    const roles = ['editor', 'viewer', 'admin'];

    for (const role of roles) {
        const existingRole = await Role.findOne({ type: role });
        if (!existingRole) {
            await Role.create({ type: role });
        }
    }

    console.log('Roles created successfully');
    mongoose.disconnect();
};

createRoles().catch((err) => {
    console.error(err);
    mongoose.disconnect();
});
