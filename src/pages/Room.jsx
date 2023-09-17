import { TextMessage } from './../components/TextMessage';
import React, { useEffect, useRef, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { AiOutlineSend } from 'react-icons/ai';
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/FirebaseConfig';
import { useAuthContext } from '../context/AuthContext';
import { nanoid } from 'nanoid';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FaArrowAltCircleLeft } from 'react-icons/fa';

export const loader = async ({ params }) => {
  const roomID = params.id;

  try {
    const roomDocRef = doc(db, 'rooms', roomID);
    const snapshot = await getDoc(roomDocRef);

    const roomName = snapshot.data().roomName;
    const messagesLoader = snapshot.data().messages;

    return { messagesLoader, roomID, roomName };
  } catch (error) {
    console.log(error);
    return { roomID, messagesLoader: [], error: error.message, roomName };
  }
};

const Room = () => {
  const { roomID, messagesLoader = [], roomName } = useLoaderData();
  const [messages, setMessages] = useState(messagesLoader);
  const messageRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    const roomDocRef = doc(db, 'rooms', roomID);
    onSnapshot(roomDocRef, (snapshot) => {
      const messages = snapshot.data().messages;
      setMessages(messages);
    });
  }, []);

  const handleSubmit = async () => {
    try {
      const roomDocRef = doc(db, 'rooms', roomID);
      //getting length of array
      const roomDoc = await getDoc(roomDocRef);
      const nextOrderUsingLength = roomDoc.data()?.messages?.length || 0;
      //------
      await updateDoc(roomDocRef, {
        messages: arrayUnion({
          text: messageRef.current.value,
          sentBy: {
            name: user.name,
            photoID: user.photoID,
            userUID: user.uid,
          },
          id: nanoid(),
          timeSent: Timestamp.now(),
          order: nextOrderUsingLength,
        }),
      });
      messageRef.current.value = '';
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrag = async (results) => {
    const { type, destination, source } = results;

    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    console.log(results);

    if (type === 'group') {
      try {
        const reorderedMessages = [...messages];
        const [removedMessage] = reorderedMessages.splice(source.index, 1);
        console.log(removedMessage);
        reorderedMessages.splice(destination.index, 0, removedMessage);
        const roomDocRef = doc(db, 'rooms', roomID);
        await updateDoc(roomDocRef, {
          messages: reorderedMessages,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className='h-screen relative bg-slate-700 overflow-hidden'>
      <div className='w-full bg-purple-200 p-6 flex items-center gap-4'>
        <FaArrowAltCircleLeft
          className='w-10 h-10 text-black'
          onClick={() => navigate(-1)}
        />
        <p className='text-lg tracking-wider'>{roomName}</p>
        <p className='text-lg tracking-wider'>
          {roomID !== 'c15Gg1C7BqnHls37RsXI' ? `| ID: ${roomID}` : ''}
        </p>
      </div>
      <div className='h-screen pb-40 overflow-y-scroll'>
        <DragDropContext onDragEnd={handleDrag}>
          <Droppable droppableId='ROOT' type='group'>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='w-11/12 max-w-3xl mx-auto flex flex-col py-8'
              >
                {messages.map((message, index) => {
                  return (
                    <Draggable
                      draggableId={message.id}
                      key={message.id}
                      index={index}
                    >
                      {(provided) => (
                        <TextMessage provided={provided} {...message} />
                      )}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className='w-full absolute bottom-0 padding-4 rounded-xl bg-white color-black flex justify-between items-center'>
        <input
          type='text'
          ref={messageRef}
          placeholder='Send New Message'
          onKeyDown={handleKeyDown}
          className='w-full m-2 p-2 border-transparent outline-none focus:border-transparent focus:ring-0'
        />
        <AiOutlineSend
          className='m-4 text-4xl rounded-full text-black'
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Room;
