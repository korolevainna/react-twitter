import { useState, Fragment, useEffect, useReducer  } from "react";
import Box from "../../component/box";
import Grid from "../../component/grid";
import PostCreate from "../post-create";
import { Alert, Skeleton, LOAD_STATUS } from "../../component/load";
import { getDate } from "../../util/getdate";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

import PostContent from "../../component/post-content";

// import "./index.css";

export default function Container({ id, username, text, date }) {
  const [state, dispatch] = useReducer(
    requestReducer, 
    requestInitialState, 
    (state) => ({...state, data: {id, username, text, date, reply: null}})
  );

  // const [status, setStatus] = useState(null);
  // const [message, setMessage] = useState("");

  const getData = async () => {
    dispatch({ type:REQUEST_ACTION_TYPE.PROGRESS});

    try {
      const res = await fetch(`http://localhost:4000/post-item?id=${state.data.id}`);

      const resData = await res.json();

      if (res.ok) {
        dispatch({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: convertData(resData),
        });
      } else {
        dispatch({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: resData.message,
        });
      }
    } catch (error) {
      dispatch({
        type: REQUEST_ACTION_TYPE.ERROR,
        payload: error.message,
      });
    }
  };

  const convertData = ({ post }) => ({
    id: post.id,
    text: post.text,
    username: post.username,
    date: getDate(post.date),

    reply: post.reply.reverse().map(({ id, username, text, date }) => ({
      id,
      text,
      username,
      date: getDate(date),
    })),
    isEmpty: post.reply.legnth === 0,
  });

  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen === true) {
      getData();
    }
  }, [isOpen]);


  return (
    <Box style={{ padding: "0" }}>
      <div
         style={{
           padding: "20px", 
           cursor: "pointer",
           }} 
          onClick={handleOpen}
      >
        <PostContent
          username={state.data.username}
          data={state.data.date}
          text={state.data.text}
        />
      </div>

      {isOpen && (
        <div style={{ padding: "0px 20px 20px 20px" }}>
          <Grid>
            <Box>
              <PostCreate
                onCreate={getData}
                placeholder="Post your reply!"
                button="Reply"
                id={state.data.id}
              />
            </Box>
            {state.status === LOAD_STATUS.PROGRESS && (
              <Fragment>
                <Box>
                  <Skeleton />
                </Box>
                <Box>
                  <Skeleton />
                </Box>
              </Fragment>
            )}

            {state.status === LOAD_STATUS.ERROR && (
              <Alert status={state.status} message={state.message} />
            )}

            {state.status === LOAD_STATUS.SUCCESS &&
              state.data.isEmpty === false &&
              state.data.reply.map((item) => (
                <Fragment key={item.id}>
                  <Box>
                    <PostContent {...item} />
                  </Box>
                </Fragment>
              ))}
          </Grid>
        </div>
      )}
    </Box>
  );
} 