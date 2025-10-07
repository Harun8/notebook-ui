import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router";
import HomePage from "./pages/HomePage";
import Chat from "./pages/chat/Chat";
import Login from "./pages/Login";
import { supabase } from "./utils/supabase";
import { useState, useEffect } from "react";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/chat" element={<Chat />}></Route>
      <Route path="/login" element={<Login />}></Route>

      {/* <Route
        path="/createJobPost"
        element={<CreateJobPost></CreateJobPost>}></Route> */}

      {/*


      <Route path="/blog/:blogId" element={<Blog></Blog>}></Route>

     
      <Route path="create" element={<CreateBlogPost />}></Route>
       */}
    </Route>
  )
);

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // 1️⃣ Try to recover the session from the OAuth redirect (if present)
      const { data: exchangeData, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(window.location.href);

      if (exchangeError) {
        console.error("exchangeCodeForSession error:", exchangeError.message);
      }

      // 2️⃣ Get the current session (from storage or newly exchanged)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) setSession(session);

      // 3️⃣ Subscribe to future auth changes (login/logout)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (mounted) setSession(newSession);
      });

      return () => subscription.unsubscribe();
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Optional logging
  useEffect(() => {
    console.log("Session:", session);
  }, [session]);

  // Example conditional rendering
  if (!session) {
    // return <div>Loading or not signed in…</div>;
  }

  return (
    <>
      <div className="App"></div>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
