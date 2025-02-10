import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { SignInInput, SignUpInput } from "@rafael1717/common";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userAtom } from "@/store/atom/user";

export function Auth({
  label,
  textColor,
}: {
  label: string;
  textColor?: string;
}) {
  const navigate = useNavigate();
  const [signin, setSignin] = useState<SignInInput>({
    email: "",
    password: "",
  });

  const [signup, setSignup] = useState<SignUpInput>({
    name: "",
    email: "",
    password: "",
  });

  const setUser = useSetRecoilState(userAtom);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <a href="#" className={`${textColor} font-[HostGrotesk] text-sm`}>
          {label}
        </a>
      </DialogTrigger>
      <DialogContent className="px-10 md:max-w-[425px] flex flex-col items-center justify-center font-[HostGrotesk] bg-transparent backdrop-blur-3xl border-slate-300 shadow-4xl">
        <DialogTitle></DialogTitle>
        <Tabs defaultValue="signin" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2 bg-transparent space-x-1">
            <TabsTrigger value="signin" className="border border-black data-[state=active]:bg-black data-[state=active]:text-white text-black ">
              SignIn
            </TabsTrigger>
            <TabsTrigger value="signup" className="border border-black data-[state=active]:bg-black data-[state=active]:text-white text-black">
              SignUp
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="bg-transparent text-black border-none shadow-none">
              <CardContent className="space-y-5 mt-5 ">
                <div className="space-y-1">
                  <Label htmlFor="username">Username/Email</Label>
                  <Input
                    className="border-black"
                    id="username"
                    placeholder="john123@xyz.com"
                    onInput={(e) => {
                      setSignin({ ...signin, email: e.currentTarget.value });
                    }}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    className="border-black"
                    type="password"
                    onInput={(e) => {
                      setSignin({ ...signin, password: e.currentTarget.value });
                    }}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={async () => {
                    toast.promise(
                      axios.post(
                        `${import.meta.env.VITE_domain_uri}/user/signin`,
                        signin
                      ),
                      {
                        loading: "Signing in...",
                        success: (response) => {
                          localStorage.setItem("token", response.data.token);
                          setUser(response.data)
                          navigate("/blogs");

                          return "Signed in successfully!";
                        },
                        error: (response) => {
                          return response.data
                            ? response.data.message
                            : "Internal server error!";
                        },
                      }
                    );
                  }}
                >
                  SignIn
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="bg-transparent text-black border-none shadow-none">
              <CardContent className="space-y-2 mt-5">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    className="border-black"
                    placeholder="John Doe"
                    onInput={(e) => {
                      setSignup({ ...signup, name: e.currentTarget.value });
                    }}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    className="border-black"
                    type="email"
                    placeholder="john123@xyz.com"
                    onInput={(e) => {
                      setSignup({ ...signup, email: e.currentTarget.value });
                    }}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    className="border-black"
                    type="password"
                    onInput={(e) => {
                      setSignup({ ...signup, password: e.currentTarget.value });
                    }}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={"secondary"}
                  onClick={async () => {
                    toast.promise(
                      axios.post(
                        `${import.meta.env.VITE_domain_uri}/user/signup`,
                        signup
                      ),
                      {
                        loading: "Signing up...",
                        success: (response) => {
                          localStorage.setItem("token", response.data.token);
                          navigate("/blogs");
                          return "Account created successfully!";
                        },
                        error: (response) => {
                          return response.data
                            ? response.data.message
                            : "Internal server error!";
                        },
                      }
                    );
                  }}
                >
                  Sign Up
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <DialogFooter className="text-center text-black">
          Click “Sign in” to agree to Medium’s Terms of Service and acknowledge
          that Medium’s Privacy Policy applies to you.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
