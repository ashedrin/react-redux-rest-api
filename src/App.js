import React, { useContext } from 'react';
import { useDispatch } from "react-redux";
import { RESTResourcesContext } from "./ResourceManager";

const App = props => {
  const { manager } = useContext(RESTResourcesContext);
  const dispatch = useDispatch();

  manager.getResource('post').list({ dispatch });
  manager.getResource('post').get({ resourceId: 3, dispatch });
  manager.getResource('post').create({
    bodyParams: {
      title: 'New Post',
      content: 'Content of new post'
    },
    dispatch
  });
  manager.getResource('post').update({
    resourceId: 1,
    bodyParams: {
      title: 'Updated Post',
      content: 'Content of new updated post'
    },
    dispatch
  });

  manager.getResource('post').remove({
    resourceId: 2,
    dispatch
  });

  return (
    <div>App</div>
  )
};

export default App;
