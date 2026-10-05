import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home, Compass, Bell, MessageCircle, Bookmark, Users, Settings,
  Search, Plus, Heart, MessageSquare, Share2, MoreHorizontal,
  Image as ImageIcon, Smile, Send, Moon, Sun, X, Menu, UserPlus,
  Check, TrendingUp, LogOut, Sparkles
} from "lucide-react";
import "./styles.css";

const initialPosts = [
  {
    id: 1,
    name: "Ayesha Khan",
    handle: "@ayeshak",
    avatar: "images/avatar-1.svg",
    time: "18 min ago",
    text: "Beautiful evening! Sometimes the best ideas arrive when you simply slow down. ✨",
    image: "images/post-1.svg",
    likes: 248,
    comments: 32,
    shares: 12,
    liked: false
  },
  {
    id: 2,
    name: "Hamza Ali",
    handle: "@hamzaali",
    avatar: "images/avatar-2.svg",
    time: "1 hr ago",
    text: "Working on a new side project today. React + JavaScript is a seriously fun combination. 🚀",
    image: "images/post-2.svg",
    likes: 174,
    comments: 19,
    shares: 8,
    liked: true
  },
  {
    id: 3,
    name: "Sarah Ahmed",
    handle: "@sarahcreates",
    avatar: "images/avatar-3.svg",
    time: "3 hrs ago",
    text: "A little inspiration for your feed: create something, share something, learn something.",
    image: "",
    likes: 96,
    comments: 14,
    shares: 5,
    liked: false
  }
];

const people = [
  { id: 1, name: "Maya Patel", role: "Product Designer", avatar: "images/avatar-4.svg" },
  { id: 2, name: "Omar Hassan", role: "Frontend Developer", avatar: "images/avatar-5.svg" },
  { id: 3, name: "Noah Wilson", role: "Photographer", avatar: "images/avatar-6.svg" }
];

function Avatar({ src, name, size="" }) {
  return <img className={`avatar ${size}`} src={src} alt={name} />;
}

function App() {
  const [active, setActive] = useState("Home");
  const [posts, setPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pulse-posts")) || initialPosts; }
    catch { return initialPosts; }
  });
  const [dark, setDark] = useState(() => localStorage.getItem("pulse-dark") === "true");
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("pulse-posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("pulse-dark", String(dark));
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const toggleLike = (id) => {
    setPosts(posts.map(p => p.id === id
      ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
      : p
    ));
  };

  const addPost = (text, imageUrl) => {
    const newPost = {
      id: Date.now(),
      name: "Kashif Ali",
      handle: "@kashif",
      avatar: "images/avatar-me.svg",
      time: "Just now",
      text,
      image: imageUrl || "",
      likes: 0, comments: 0, shares: 0, liked: false
    };
    setPosts([newPost, ...posts]);
    setShowCreate(false);
    notify("Your post was published!");
  };

  const filtered = posts.filter(p =>
    `${p.name} ${p.handle} ${p.text}`.toLowerCase().includes(query.toLowerCase())
  );

  const navItems = [
    [Home, "Home"], [Compass, "Explore"], [Bell, "Notifications"],
    [MessageCircle, "Messages"], [Bookmark, "Saved"], [Users, "Communities"]
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}><Menu /></button>
        <div className="brand"><div className="brand-mark"><Sparkles size={19}/></div><span>pulse</span></div>
        <div className="search">
          <Search size={18}/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people, posts..." />
        </div>
        <div className="top-actions">
          <button className="icon-btn" onClick={() => setDark(!dark)} title="Toggle theme">{dark ? <Sun/> : <Moon/>}</button>
          <button className="icon-btn notification-btn" onClick={() => setShowNotifications(!showNotifications)}><Bell/><i/></button>
          <Avatar src="images/avatar-me.svg" name="Kashif Ali" />
        </div>
        {showNotifications && <NotificationPanel />}
      </header>

      <div className="layout">
        <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
          <div className="profile-mini">
            <Avatar src="images/avatar-me.svg" name="Kashif Ali" size="large"/>
            <div><strong>Kashif Ali</strong><span>@kashif</span></div>
          </div>
          <nav>
            {navItems.map(([Icon, label]) =>
              <button key={label} className={active === label ? "active" : ""} onClick={() => {setActive(label); setMobileMenu(false);}}>
                <Icon size={20}/><span>{label}</span>{label === "Notifications" && <b>4</b>}
              </button>
            )}
          </nav>
          <div className="sidebar-bottom">
            <button onClick={() => notify("Settings are ready in the demo.")}><Settings size={20}/>Settings</button>
            <button onClick={() => notify("Logged out of demo mode.")}><LogOut size={20}/>Log out</button>
          </div>
        </aside>

        <main className="main">
          <div className="page-heading">
            <div><span className="eyebrow">YOUR SPACE</span><h1>{active}</h1></div>
            <button className="primary-btn" onClick={() => setShowCreate(true)}><Plus size={18}/> Create post</button>
          </div>

          {active === "Home" &&
            <>
              <Stories />
              <div className="feed-layout">
                <section className="feed">
                  {filtered.length ? filtered.map(post =>
                    <PostCard key={post.id} post={post} onLike={toggleLike} notify={notify}/>
                  ) : <div className="empty">No posts match your search.</div>}
                </section>
                <RightRail notify={notify}/>
              </div>
            </>
          }

          {active !== "Home" && <SectionPage active={active} notify={notify}/>}
        </main>
      </div>

      {showCreate && <CreatePost onClose={() => setShowCreate(false)} onPublish={addPost}/>}
      {showMessages && <Messages onClose={() => setShowMessages(false)}/>}
      {toast && <div className="toast"><Check size={17}/>{toast}</div>}
    </div>
  );
}

function Stories() {
  const stories = [
    ["Your story", "images/avatar-me.svg", true],
    ["Ayesha", "images/avatar-1.svg"], ["Hamza", "images/avatar-2.svg"],
    ["Sarah", "images/avatar-3.svg"], ["Maya", "images/avatar-4.svg"]
  ];
  return <div className="stories">{stories.map(([name,img,own]) =>
    <div className="story" key={name}><div className={`story-ring ${own ? "own" : ""}`}><Avatar src={img} name={name} /></div><span>{name}</span></div>
  )}</div>
}

function PostCard({ post, onLike, notify }) {
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  return <article className="post-card">
    <div className="post-head">
      <Avatar src={post.avatar} name={post.name}/>
      <div className="post-user"><strong>{post.name}</strong><span>{post.handle} · {post.time}</span></div>
      <button className="more"><MoreHorizontal/></button>
    </div>
    <p className="post-text">{post.text}</p>
    {post.image && <img className="post-image" src={post.image} alt="Post artwork"/>}
    <div className="post-stats"><span>{post.likes.toLocaleString()} likes</span><span>{post.comments} comments · {post.shares} shares</span></div>
    <div className="post-actions">
      <button className={post.liked ? "liked" : ""} onClick={() => onLike(post.id)}><Heart fill={post.liked ? "currentColor" : "none"}/>Like</button>
      <button onClick={() => setShowComment(!showComment)}><MessageSquare/>Comment</button>
      <button onClick={() => notify("Post link copied to clipboard.")}><Share2/>Share</button>
      <button onClick={() => notify("Saved to your collection.")}><Bookmark/></button>
    </div>
    {showComment && <div className="comment-box"><Avatar src="images/avatar-me.svg" name="You"/><input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..." onKeyDown={e => {if(e.key==="Enter" && comment){setComment("");notify("Comment added!");}}}/><button onClick={() => {if(comment){setComment("");notify("Comment added!");}}}><Send size={17}/></button></div>}
  </article>
}

function RightRail({notify}) {
  return <aside className="right-rail">
    <div className="rail-card">
      <div className="card-title"><strong>Trending today</strong><TrendingUp size={18}/></div>
      {["#ReactJS", "#CreativeLife", "#TechCommunity"].map((x,i) =>
        <div className="trend" key={x}><span>0{i+1}</span><div><b>{x}</b><small>{(18-i*4)}.{i+2}K posts</small></div></div>
      )}
      <button className="text-btn" onClick={() => notify("Showing all trends...")}>View all trends</button>
    </div>
    <div className="rail-card">
      <div className="card-title"><strong>People to follow</strong></div>
      {people.map(p => <div className="person" key={p.id}><Avatar src={p.avatar} name={p.name}/><div><b>{p.name}</b><small>{p.role}</small></div><button onClick={() => notify(`Following ${p.name}`)}><UserPlus size={16}/></button></div>)}
    </div>
    <div className="footer-links">About · Privacy · Terms · Help<br/><span>© 2026 Pulse Social</span></div>
  </aside>
}

function NotificationPanel() {
  return <div className="notification-panel">
    <div className="panel-head"><b>Notifications</b><span>Mark all read</span></div>
    <div className="notice"><Heart fill="currentColor"/><span><b>Ayesha</b> liked your post.<small>8 min ago</small></span></div>
    <div className="notice"><UserPlus/><span><b>Omar</b> started following you.<small>24 min ago</small></span></div>
    <div className="notice"><MessageSquare/><span><b>Sarah</b> commented on your post.<small>1 hr ago</small></span></div>
  </div>
}

function CreatePost({onClose,onPublish}) {
  const [text,setText] = useState("");
  const [image,setImage] = useState("");
  return <div className="modal-backdrop" onMouseDown={e => e.target===e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal-head"><h2>Create a post</h2><button onClick={onClose}><X/></button></div>
      <div className="composer"><Avatar src="images/avatar-me.svg" name="Kashif Ali"/><textarea autoFocus value={text} onChange={e=>setText(e.target.value)} placeholder="What's happening?"></textarea></div>
      {image && <img className="preview" src={image} alt="Preview"/>}
      <div className="composer-tools">
        <button onClick={() => setImage("images/post-3.svg")}><ImageIcon/> Photo</button>
        <button onClick={() => setText(text+" 😊")}><Smile/> Feeling</button>
      </div>
      <button className="publish" disabled={!text.trim()} onClick={() => onPublish(text.trim(),image)}>Publish post</button>
    </div>
  </div>
}

function SectionPage({active,notify}) {
  const content = {
    Explore: ["Discover new communities and creators.", "Explore topics, creators and conversations that match your interests."],
    Notifications: ["You're all caught up.", "We'll show likes, follows and comments here."],
    Messages: ["Your conversations", "Open a chat to continue a conversation with your community."],
    Saved: ["Your saved posts", "Posts you save will appear here for quick access."],
    Communities: ["Find your community", "Join groups around technology, design, photography and more."]
  }[active];
  return <div className="section-page"><div className="big-icon"><Sparkles size={34}/></div><h2>{content?.[0] || active}</h2><p>{content?.[1] || "This section is ready for your next feature."}</p><button className="primary-btn" onClick={()=>notify("Feature opened in demo mode.")}>Explore demo</button></div>
}

function Messages({onClose}) {
  return <div className="modal-backdrop"><div className="modal messages"><div className="modal-head"><h2>Messages</h2><button onClick={onClose}><X/></button></div><div className="chat"><Avatar src="images/avatar-4.svg" name="Maya"/><div><b>Maya Patel</b><p>Hey! Loved your latest post 👋</p><small>Today, 4:32 PM</small></div></div><div className="chat"><Avatar src="images/avatar-5.svg" name="Omar"/><div><b>Omar Hassan</b><p>Are you joining the React community?</p><small>Today, 2:10 PM</small></div></div></div></div>
}

function main() {}
createRoot(document.getElementById("root")).render(<App />);
