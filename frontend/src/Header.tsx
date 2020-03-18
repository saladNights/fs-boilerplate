import React from 'react'
import {useUserQuery} from './generated/graphql';

const Header: React.FC =  () => {
	const { data } = useUserQuery();

  return (
	  <div>{data && data.user && `You are logged in as ${data.user.email}`}</div>
  )
};

export default Header;
