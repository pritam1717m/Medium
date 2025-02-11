import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import Write from "./pages/write";
import Blogs from "./pages/blogs";
import { RecoilRoot } from "recoil";
import Blog from "./pages/blog";
import Draft from "./pages/draft";

function App() {
  return (
    <RecoilRoot>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/write" element={<Write />} />
            <Route path="/draft" element={<Draft/>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
