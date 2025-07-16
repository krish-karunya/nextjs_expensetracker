Mistake need to take care while working with Next js 15 :

- here we no need install dotenv separately in Nextjs 15
- Don't forgot to `return` while using `Next.Response()`
- export const User = mongoose.models.User || mongoose.model("User", userSchema); - `models`
- `Refer-this link mongo db connection best practice`-https://medium.com/@turingvang/next-js-beginner-mongodb-crud-example-tutorial-db2afdb68e25
- while sending response "status"- should be in second parameter only :
- set the token into cookie for that we need import cookie from next/cookie and along with use set method: -` path: "/"` it make the cookie is available for all across our app,if we don't mention this path mean it will be available only for this signup path it will create issue when we try to access other route like "/dashboard" -`NextResponse` send the response using Next Response don't forgot to return here:
- while writing api first thing we should do is`Connect to DB first` await connectDB();
- don't forgot to write await in front of request

eg: `const { email, password } = await request.json();`

- this code is responsible for redirecting to the UI of login page if error occur mean :
  eg: `return NextResponse.redirect(new URL("/login", req.url));`

  - req.url => contain absolute path
  - login => represent where it should redirect
    return NextResponse.redirect - this code took the absolute from `req.url` and relative path is 1st parameter of new URL

- `we should always keep the middleware file in root level`- which means inside the `src` and we need to create a `middleware` in the app level not inside the app folder

# middleware doesn't support the jwt.verify - because it is run on edge function ,it only support small functionality ,it does n't support heavy functionality like jwt.verify , so here we need to user `jose` to very the jwt token and also doesn't get the secret from .env

- process.env.JWT_SECRET is a string like "mysecret123".
- The jose library expects a key for HS256 as a Uint8Array, CryptoKey, or similar.
- TextEncoder().encode() converts the string into a Uint8Array.

# Context-API :

- while creating a context it is kind of component because we are using jsx inside it so naming convention first letter should be always `capital letter only` - other wise it won't work properly

# when using populate while querying we need to import the respective model which we are going to populate otherwise it will throw error

# Mongoose:

- when the querying something using id when we using `find` or some other method behind the scene mongoose will convert the id and `mongodb objectId`
- But when using `aggregation` it won't work , we need to manually convert id and mongodb using `new mongoose.Types.ObjectId(String(user.id))`

# $lookup :

- Basically when we using $lookup it will give the output as `array of object` - we can't use $project ,somehow we need to convert the array in to object - how ? yes Using `$unwind` method we can easily convert the array in to Object
- once we converted the array in to object we can modify the field value , however our wish too
