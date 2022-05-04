const GoogleStrategy = require('passport-google-oauth20');

const Google = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/callback/google',
    scope: ['profile'],
    passReqToCallback: true
},
    async function (req, accessToken, refreshToken, profile, done) {
        try {
            const email = profile.emails[0].value;
            const google_id = profile.id;
            const user = await req.db.collection('users').findOne({ google_id });
            if (!user) {
                await req.db
                    .collection('users')
                    .insertOne({
                        _id: profile.id,
                        google_id: profile.id,
                        email: email,
                        password: "<GOOGLE_ACCOUNT>",
                        name: profile.displayName,
                        lastLogin: new Date(),
                        currentLogin: new Date(),
                        role: 'pending',
                        token: '',
                    })
                    .then(({ insertedId }) => {
                        return insertedId;
                    });
            } else {
                const lastLogin = user.currentLogin;
                await req.db.collection('users').updateOne(
                    { email: email },
                    {
                        $set: {
                            currentLogin: new Date(),
                            lastLogin: lastLogin,
                        },
                    }
                );
                return done(null, { ...user, id: req.session.id });
            }
        } catch (e) {
            console.error('error');
            return done(null, false, { message: 'An error occured' });
        }

        return done(null, profile);
    }
);

export default Google;
