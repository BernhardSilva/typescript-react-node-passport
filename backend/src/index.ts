import mongoose, { Error } from 'mongoose';
import express, { Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './User';
import { IUser } from './Interfaces/IUser';

const LocalStrategy = passportLocal.Strategy;

dotenv.config();

mongoose.connect(
  `mongodb+srv://${process.env.DB_HOST}/${process.env.DB_ADMIN_USERNAME}?authSource=${process.env.DB_ADMIN_PASSWORD}&replicaSet=atlas-11j7aw-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`,
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  (err: Error) => {
    if (err) throw err;
    console.log('Connected to Mongo');
  },
);

//Middleware
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: `${process.env.HOST}:${process.env.PORT}`,
    credentials: true,
  }),
);
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//Passport
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err: Error, user: any) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  }),
);

passport.serializeUser((user: any, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: Error, user: any) => {
    const userInformation = {
      usernae: user.usernae,
      isAdmin: user.isAdmin,
    };
    cb(err, userInformation);
  });
});

//Routes
//username, password
app.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req?.body;

  if (
    !username ||
    !password ||
    typeof username !== 'string' ||
    typeof password !== 'string'
  ) {
    res.status(401).send('Improper values');
    return;
  }
  User.findOne({ username }, async (err: Error, doc: IUser) => {
    if (err) throw err;
    if (doc) res.status(400).send('User Already Exists');
    if (!doc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(200).send('Success');
    }
  });
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).send('Successfully Autyhenticated');
});

app.get('/user', (req, res) => {
  res.status(200).send(req.user);
});

app.listen(3000, () => {
  console.log(`Server Started at port: ${process.env.PORT}`);
});
