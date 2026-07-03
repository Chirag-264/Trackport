import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "@/services/auth.service";



export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const formData = {
        email: email,
        password: password
      }
      const response = await loginUser(formData);
      console.log(response.data);
      navigate('/');
    }

    catch(err) {
      console.error(err);
    }
  }

  return ( <div className="min-h-screen flex items-center justify-center bg-[url('/loginLight.jpg')] bg-cover bg-center">

    <Card className="w-105 rounded-3xl bg-white/80 backdrop-blur-md shadow-xl">
      <CardContent className="p-10">

        <div className="flex flex-col items-center gap-5">

          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
            <img
              src="/login.svg"
              alt="login"
              className="w-8"
            />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Welcome back
            </h1>

            <p className="text-sm text-muted-foreground mt-2">
              Track your projects and tasks in one place.
            </p>
          </div>

        </div>

        <form className="mt-8 space-y-5">

          <div className="space-y-2">

            <Label htmlFor="email">
              Email
            </Label>

            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 h-11 border border-gray-200">

              <Mail className="h-4 w-4 text-gray-500" />

              <input
                id="email"
                type="email"
                value={email}
                placeholder="abc@example.com"
                className="bg-transparent outline-none w-full text-sm"
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

          </div>

          <div className="space-y-2">

            <div className="flex items-center justify-between">  
              <Label htmlFor="password"> Password </Label> 
              <button type="button" className="text-sm text-muted-foreground hover:text-black transition" > 
                Forgot password? 
              </button> 
            </div>

            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 h-11 border border-gray-200">

              <Lock className="h-4 w-4 text-gray-500" />

              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                className="bg-transparent outline-none w-full text-sm"
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>

          </div>

          <Button className="w-full h-11" onClick={handleSubmit}>
            Login
          </Button>

        </form>

        <div className="flex items-center gap-3 my-6">

          <div className="h-px bg-gray-300 flex-1"></div>

          <span className="text-xs text-muted-foreground">
            Or continue with
          </span>

          <div className="h-px bg-gray-300 flex-1"></div>

        </div>

        <div className="grid grid-cols-2 gap-3">

          <Button
            variant="outline"
            className="h-11"
          >
            <img
              src="/google.svg"
              alt="Google"
              className="w-4 h-4 mr-2"
            />

            Google
          </Button>

          <Button
            variant="outline"
            className="h-11"
          >
            <img
              src="/github.svg"
              alt="GitHub"
              className="w-4 h-4 mr-2"
            />

            GitHub
          </Button>

        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <NavLink
            to="/auth/register"
            className="font-medium text-black hover:underline"
          >
            Register
          </NavLink>
        </p>

      </CardContent>
    </Card>

  </div>
    )
}

