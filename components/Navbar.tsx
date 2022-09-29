const Navbar = () => {
  return (
    <nav className="fixed top-0 w-screen bg-opacity-25 bg-primaryBackground filter backdrop-blur-md">
      <div className="max-w-6xl px-6 py-4 m-auto">
        <div className="flex justify-between">
          <h1 className="text-3xl font-black text-white">
            TRACKTR
            <span className="text-primary">.</span>
          </h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
