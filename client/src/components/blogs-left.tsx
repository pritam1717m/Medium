import BlogCard from "./blog-card"

const blogs = [
    {
      "author": "Mate Marschalko",
      "title": "18 Advanced React Techniques Every Senior Dev Needs to Know",
      "description": "As React applications grow more complex, the patterns that were 'just fine' when you were starting out might start to feel limiting...",
      "date": "Jan 6",
      "views": 482,
      "comments": 13,
      "image": "beach-developer.jpg"
    },
    {
      "author": "Let's Code Future",
      "title": "7 React Custom Hooks I Can’t Live Without in My Projects 🚀",
      "description": "React’s functional programming paradigm has revolutionized front-end development, making it easier to create reusable and...",
      "date": "Dec 27, 2024",
      "views": 640,
      "comments": 13,
      "image": "developer-car.jpg"
    },
    {
      "author": "Tech Enthusiast",
      "title": "Mastering State Management in React with Redux & Context API",
      "description": "State management is crucial for scaling React applications. This guide explores when to use Redux vs Context API...",
      "date": "Feb 2, 2025",
      "views": 520,
      "comments": 8,
      "image": "state-management.jpg"
    },
    {
      "author": "Frontend Guru",
      "title": "Building a Scalable Component Library in React",
      "description": "Learn how to create a scalable, reusable component library in React to boost development efficiency and maintainability...",
      "date": "Jan 15, 2025",
      "views": 710,
      "comments": 21,
      "image": "component-library.jpg"
    },
    {
      "author": "Dev Insights",
      "title": "Optimizing Performance in React Apps: Tips & Tricks",
      "description": "Slow React apps? Learn optimization techniques like memoization, lazy loading, and reducing re-renders...",
      "date": "Feb 5, 2025",
      "views": 835,
      "comments": 17,
      "image": "performance-tips.jpg"
    }
  ]
  
function BlogsLeft() {
  return (
    <div className="px-10 pt-10 flex flex-col">
        <p>Navigation</p>
        <div className="mt-5">
            {blogs.map((blog) => {
                return <BlogCard blog={blog}/>
            })}
        </div>
    </div>
  )
}

export default BlogsLeft