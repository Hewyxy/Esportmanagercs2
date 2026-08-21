export default function Profile() {
  return (
    <div className="profile">
      <img
          src="/src/assets/profile.png"
          alt="Profile"
          className="profile-img"
      />

      <div className="profile-info">
          <h1 className="profile-name">John Doe</h1>
          <p className="profile-team">Cool Team</p>
      </div>
    </div>
  );
}