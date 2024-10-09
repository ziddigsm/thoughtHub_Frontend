import React, { useState } from 'react';
import './Home.css'; 
import GoogleLoginComponent from './google';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 

  const openSignInModal = () => {
    setIsModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsModalOpen(false);
  };

  const blogPosts = [
    { id: 1, title: "Post 1", content: "This is blog post 1."},
    { id: 2, title: "Post 2", content: "This is blog post 2.", image: "https://source.unsplash.com/random/300x200?sig=2" },
    { id: 3, title: "Post 3", content: "This is blog post 3.", image: "https://source.unsplash.com/random/300x200?sig=3" },
    { id: 4, title: "Post 4", content: "This is blog post 4.", image: "https://source.unsplash.com/random/300x200?sig=4" },
    { id: 5, title: "Post 5", content: "This is blog post 5.", image: "https://source.unsplash.com/random/300x200?sig=5" },
    { id: 6, title: "Post 6", content: "This is blog post 6.", image: "https://source.unsplash.com/random/300x200?sig=6" },
    { id: 7, title: "Post 7", content: "This is blog post 7.", image: "https://source.unsplash.com/random/300x200?sig=7" },
    { id: 8, title: "Post 8", content: "This is blog post 8.", image: "https://source.unsplash.com/random/300x200?sig=8" },
    { id: 9, title: "Post 9", content: "This is blog post 9.", image: "https://source.unsplash.com/random/300x200?sig=9" }
  ];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="main-content">
        <header className={isModalOpen ? "blur" : ""}>
          <div className="logo">
            <span className="thought">thought</span>
            <span className="hub">Hub</span>
          </div>
          <h1>A Modern, Minimalist Blog Channel</h1>
          <p>Welcome to ThoughtHub, a blog that offers a refreshing take on modern topics.</p>
          <GoogleLoginComponent isInModal={false} />
        </header>

        <section className={`section-container ${isModalOpen ? "blur" : ""}`}>
          <div className="search-container">
            <input 
              type="text"
              className="search-input"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={handleSearchChange} 
            />
            <button className="search-button">Search</button>
          </div>

          <div className="blog-container">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="blog-post" onClick={openSignInModal}>
                   <img 
                  src={post.image} 
                  alt={post.title} 
                  className="blog-image"
                  />
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </div>
              ))
            ) : (
              <p>No blog posts found.</p>
            )}
          </div>
        </section>
      </div>

      <footer className={isModalOpen ? "blur" : ""}>
      <p>&copy; 2024 ThoughtHub. All rights reserved.</p>
      </footer>

      {isModalOpen && (
        <div id="signInModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeSignInModal}>&times;</span>
            <h2>Sign in to ThoughtHub</h2>
            <p>You must be signed in to access the blog. Please sign in using your Google account.</p>
            <GoogleLoginComponent isInModal={true} /> 
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
