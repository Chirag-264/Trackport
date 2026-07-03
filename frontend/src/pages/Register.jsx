import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import { NavLink } from "react-router-dom";
import {
User,
Mail,
Lock,
GraduationCap,
AtSign,
} from "lucide-react";

export default function Register() {
return ( <div className="min-h-screen flex items-center justify-center bg-[url('/loginLight.jpg')] bg-cover bg-center py-10">

  <Card className="w-130 rounded-3xl bg-white/80 backdrop-blur-md shadow-xl">
    <CardContent className="p-10">

      <div className="flex flex-col items-center gap-4">

        

        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="text-sm text-muted-foreground mt-2">
            Start tracking projects, tasks and your development journey.
          </p>
        </div>

      </div>

      <form className="mt-8 space-y-4">

        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name
          </Label>

          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 h-11 border border-gray-200">
            <User className="h-4 w-4 text-gray-500" />

            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">
            Username
          </Label>

          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 h-11 border border-gray-200">
            <AtSign className="h-4 w-4 text-gray-500" />

            <input
              id="username"
              type="text"
              placeholder="johndoe"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email
          </Label>

          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 h-11 border border-gray-200">
            <Mail className="h-4 w-4 text-gray-500" />

            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="college">
            College
          </Label>

          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 h-11 border border-gray-200">
            <GraduationCap className="h-4 w-4 text-gray-500" />

            <input
              id="college"
              type="text"
              placeholder="Your College"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label>
              Branch
            </Label>

            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="CSE">
                  Computer Science Engineering
                </SelectItem>

                <SelectItem value="IT">
                  Information Technology
                </SelectItem>

                <SelectItem value="ECE">
                  Electronics & Communication
                </SelectItem>

                <SelectItem value="EE">
                  Electrical Engineering
                </SelectItem>

                <SelectItem value="ME">
                  Mechanical Engineering
                </SelectItem>

                <SelectItem value="CE">
                  Civil Engineering
                </SelectItem>

                <SelectItem value="AIDS">
                  AI & Data Science
                </SelectItem>

                <SelectItem value="AIML">
                  AI & Machine Learning
                </SelectItem>

                <SelectItem value="CYBER">
                  Cyber Security
                </SelectItem>

                <SelectItem value="OTHER">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Graduation Year
            </Label>

            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
                <SelectItem value="2029">2029</SelectItem>
                <SelectItem value="2030">2030</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>

          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 h-11 border border-gray-200">
            <Lock className="h-4 w-4 text-gray-500" />

            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm Password
          </Label>

          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 h-11 border border-gray-200">
            <Lock className="h-4 w-4 text-gray-500" />

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        <Button className="w-full h-11 mt-2">
          Create Account
        </Button>

      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <NavLink
          to="/auth/login"
          className="font-medium text-black hover:underline"
        >
          Login
        </NavLink>
      </p>

    </CardContent>
  </Card>

</div>
);
}
