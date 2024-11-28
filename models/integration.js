import mongoose from 'mongoose';

const IntegrationSchema = new mongoose.Schema({
    githubId: String,
    username: String,
    accessToken: String,
    connectedAt: Date,
});

const Integration = mongoose.model('Integration', IntegrationSchema);

export default Integration;