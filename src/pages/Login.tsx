"use client";

// import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabase";
import Forms from "../components/Form";
export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [buttonCliked, setButtonClicked] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    setIsSubmitting(false);
  }, []);

  const otpAuth = async (values) => {
    setIsSubmitting(true);
    setButtonClicked(true);
    let { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      // password: values.password,
      // options: {
      //   emailRedirectTo: "http://localhost:3000/auth/callback",
      // },
    });
    if (error) {
      setIsSubmitting(false);
      console.error("error", error);
    } else {
      setIsSubmitting(false);
    }
  };
  // const passwordAuth = async (values) => {
  //   console.log("passwordAuth", values);
  //   setIsSubmitting(true);
  //   let { error } = await supabase.auth.signInWithPassword({
  //     email: values.email,
  //     password: values.password,
  //   });

  //   if (error) {
  //     setIsSubmitting(false);
  //     console.error("error", error);
  //   } else {
  //     setIsSubmitting(false);
  //     router.push("/"); // Redirects to /auth/callback after login
  //   }
  // };

  // const authMethod = async (values) => {
  //   console.log("got in here", values);
  //   let auth = isPassword ? "password" : "otp";
  //   switch (auth) {
  //     case "otp":
  //       otpAuth(values);
  //       break;
  //     case "password":
  //       passwordAuth(values);
  //   }
  // };
  async function signInWithGoogle() {
    const currentUrl = new URL(window.location.href);
    const source = currentUrl.searchParams.get("source");
    console.log("called", currentUrl, source);
    // Set the base URL for redirection
    const baseUrl = "http://localhost:5173";

    // Define the redirect URL based on the source
    // const redirectTo =
    //   source === "extension" ? `${baseUrl}/` : `${baseUrl}/en/chromeEx`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirectTo: redirectTo,
        redirectTo: window.location.origin, // "http://localhost:5173"
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.log(error);

      navigate("/error");
    }
    console.log(data.url);
    // navigate(data.url);
  }

  return (
    <>
      <title>Login | AskPDFs</title>

      <div className=" flex justify-center md:grid md:grid-cols-2 md:gap-1 h-dvh ">
        <div className="">
          <div className="flex justify-center">
            {/* <LoginForm></LoginForm> */}
            <Forms
              signInWithGoogle={signInWithGoogle}
              isSubmitting={isSubmitting}
              showPassword={false}
              onSubmit={otpAuth}
              link="signin"
              title="login"
              redirect="redirect"
            ></Forms>
          </div>
          <div className=" flex justify-center"></div>
        </div>
        <div className="hidden md:flex md:justify-center md:items-center md:p-12 md:bg-blue-200  ">
          <div className="flex justify-center">
            {" "}
            {/* {buttonCliked
              ? `${t("login.checkMail")}`
              : `${t("login.welcomeBack")}`}{" "} */}
          </div>
        </div>
      </div>
    </>
  );
}
