const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile received:', profile.id);
      
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        console.log('Existing Google user found:', user.email, 'Role:', user.role, 'Complete:', user.isProfileComplete);
        return done(null, user);
      }
      
      // Check if user exists with the same email (non-Google account)
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        console.log('Linking Google to existing email user:', user.email);
        // Link Google account to existing user
        user.googleId = profile.id;
        user.isGoogleAuth = true;
        user.profilePicture = profile.photos[0].value;
        await user.save();
        return done(null, user);
      }
      
      // Create new user with Google account (NO ROLE SET)
      console.log('Creating new Google user:', profile.emails[0].value);
      const newUser = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        isGoogleAuth: true,
        role: '', // Empty role - user must select
        isProfileComplete: false // Profile not complete until role is selected
      });
      
      await newUser.save();
      return done(null, newUser);
      
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});