/* eslint-disable @next/next/no-img-element */
// UI component for user profile

const UserProfile = ({ user }) => {
  // console.log(user);
  return (
    <div className="box-center">
      <img
        src={user.photoURL || "/hacker.png"}
        alt="user-img"
        className="card-img-center"
      />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1> {user.displayName} </h1>
    </div>
  );
};

export default UserProfile;
