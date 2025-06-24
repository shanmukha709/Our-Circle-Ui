import React from 'react';

const Posts = () => {
  const mockPosts = [
    { id: 1, content: "Hello Circle!" },
    { id: 2, content: "Welcome to Our Circle App." }
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Posts</h2>
      {mockPosts.map(post => (
        <div key={post.id} className="mb-2 p-2 border rounded shadow-sm">
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Posts;