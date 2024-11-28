import axios from 'axios';
import Integration from '../models/integration.js';

console.log('process.env in controller ', process.env.GITHUB_CLIENT_ID)
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

export const authenticate = (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
    res.redirect(githubAuthUrl);
};

export const callback = async ( req, res) => {
    const { code } = req.query;
    try {
       const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: clientId,
            client_secret: clientSecret,
            code,
        },
        { headers: { Accept: 'application/json'}}
       );
       const accessToken = tokenResponse.data.access_token;
       const userResponse = await axios.get('https://api.github.com/user', {
           headers: { Authorization: `Bearer ${accessToken}`},
       });

       const user = userResponse.data;
       await Integration.create({
           githubId: user.id,
           username: user.login,
           accessToken,
           connectedAt: new Date(),
       });
       res.redirect(`http://localhost:4200/integration?githubId=${user.id}`);
    } catch (error) {
       res.status(500).send({ success: false, message: error.message}); 
    }
}

// TODO pass in id
export const getStatus = async (req, res) => {
    const { githubId } = req.query;
    const integration = await Integration.findOne({githubId});
    if ( integration ) {
        res.send({ connected: true, integration});
    } else {
        res.send( { connected: false})
    }
}

export const removeIntegration = async (req, res ) => {
    try {
       const { githubId} = req.body;
       if (!githubId) {
        return res.status(400).send({ success: false, message: 'Github ID required'})
       } 
       await Integration.deleteOne({ githubId});
       res.send({ success: true });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}