import type BackendUser from "~/model/api/user";

const User = ({ type, name }: Omit<BackendUser, 'uuid'> ) => {
  return <div className="px-4">{type}: <br /> {name}</div>;
};

export default User;
