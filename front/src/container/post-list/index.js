import { useState, Fragment, useEffect } from "react";

import Title from "../../component/title";
import Grid from "../../component/grid";
import Box from "../../component/box";

import PostCreate from "../post-create";
import PostItem from "../post-item";

import { Alert, Skeleton, LOAD_STATUS } from "../../component/load";

import { getDate } from "../../util/getdate";

import { useWindowListeren } from "../../util/useWindowListeren";

export default function Container() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [data, setData] = useState(null);

  const getData = async () => {
    setStatus(LOAD_STATUS.PROGRESS);
    try {
      const res = await fetch("http://localhost:4000/post-list");

      const data = await res.json();

      if (res.ok) {
        setData(convertData(data));
        setStatus(LOAD_STATUS.SUCCESS);
      } else {
        setMessage(data.message);
        setStatus(LOAD_STATUS.ERROR);
      }
    } catch (error) {
      setMessage(error.message);
      setStatus(LOAD_STATUS.ERROR);
    }
  };

  const convertData = (raw) => ({
    list: raw.list.reverse().map(({ id, username, text, date }) => ({
      id,
      username,
      text,
      date: getDate(date),
    })),
    
    isEmpty: raw.list.length === 0,
  });

  useEffect(() => {
    getData();

    const intervalId = setInterval(() => getData(), 5000);

    //const intervalId = setInterval(() => alert(123), 5000);

    //alert(1);

    return () => {
      clearInterval(intervalId);
      alert(2);
    };
  },[]);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListeren("pointermove", (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <Grid>
      <div
        style={{
          position: "absolute",
          backgroundColor: "pink",
          borderRadius: "50%",
          opacity: 0.6,
          transform: `translate(${position.x}px,${position.y}px)`,
          pointerEvents: "none",
          left: -20,
          top: -20,
          width: 40,
          height: 40,
        }}
      ></div>
      <Box>
        <Grid>
          <Title>Home</Title>
          <PostCreate
            onCreate={getData}
            placeholder="What is happening?!"
            button="Post"
          />
        </Grid>
      </Box>

      {status === LOAD_STATUS.PROGRESS && (
        <Fragment>
          <Box>
            <Skeleton />
          </Box>
          <Box>
            <Skeleton />
          </Box>
        </Fragment>
      )}

      {status === LOAD_STATUS.ERROR && (
        <Alert status={status} message={message} />
      )}

      {status === LOAD_STATUS.SUCCESS && (
        <Fragment>
          {data.isEmpty ? (
            <Alert message="Список постів пустий" />
          ) : (
            data.list.map((item) => (
              <Fragment key={item.id}>
                <PostItem {...item} />
              </Fragment>
            ))
          )}
        </Fragment>
      )}
    </Grid>
  );
}