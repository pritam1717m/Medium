import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import Write from "./pages/write";
import Blogs from "./pages/blogs";
import Blog from "./pages/blog";
import Draft from "./pages/draft";
import Edit from "./pages/edit";
import Stories from "./pages/stories";
import Profile from "./pages/profile";
import {Provider}  from 'jotai'

function App() {
  return (
    <Provider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/write" element={<Write />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/draft" element={<Draft/>} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
