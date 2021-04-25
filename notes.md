https://www.youtube.com/watch?v=Gwru3BueuiE

**_ backend _**

npm init -y

npm i bcryptjs cookie-parser cors dotenv express express-session mongoose passport passport-local

npm i @types/bcryptjs @types/cookie-parser @types/cors @types/dotenv @types/express @types/express-session @types/mongoose @types/passport @types/passport-local -D

npm i nodemon ts-node typescript -D

touch tsconfig.json

create src/index.ts

in package.json include in "scripts":
"start": "nodemon --exec ts-node src/index.ts",

mongo: dbUser, admin

**_ frontend _**
npx create-react-app --template typescript client

npm i axios @types/react-router-dom
