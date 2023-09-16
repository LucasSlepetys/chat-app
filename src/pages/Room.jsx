import React, { useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AiOutlineSend } from 'react-icons/ai';
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/FirebaseConfig';
import { useAuthContext } from '../context/AuthContext';
import { nanoid } from 'nanoid';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export const loader = async ({ params }) => {
  const roomID = params.id;

  try {
    const roomDocRef = doc(db, 'rooms', roomID);
    const snapshot = await getDoc(roomDocRef);

    const messagesLoader = snapshot.data().messages;

    return { messagesLoader, roomID };
  } catch (error) {
    console.log(error);
    return { roomID, messagesLoader: [], error: error.message };
  }
};

const Room = () => {
  const { roomID, messagesLoader = [] } = useLoaderData();
  const [messages, setMessages] = useState(messagesLoader);
  const messageRef = useRef(null);
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

  const handleDrag = () => {
    return null;
  };

  return (
    <div className='h-screen relative bg-slate-700 overflow-hidden'>
      <div className='h-screen pb-20 overflow-y-scroll'>
        <DragDropContext onDragEnd={handleDrag}>
          <Droppable droppableId='ROOT' type='group'>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='w-11/12 max-w-3xl mx-auto flex flex-col py-8'
              >
                {messages.map((message, index) => {
                  const { id, text, sentBy, sentAt } = message;
                  return (
                    <Draggable draggableId={id} key={id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className={
                            sentBy.userUID === user.uid
                              ? 'text-right m-3'
                              : 'm-3'
                          }
                        >
                          <div className='rounded-md p-2 inline-block gap-2 max-w-90 bg-white text-black '>
                            <p className='capitalize mb-2 italic text-left'>
                              {sentBy.name}:
                            </p>
                            <p className='inline mr-2'>{text}</p>
                            <p className='inline text-slate-400'>{sentAt}</p>
                          </div>
                        </div>
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
