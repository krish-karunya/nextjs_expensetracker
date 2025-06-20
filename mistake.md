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
