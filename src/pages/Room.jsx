import { NavBar } from './../components/NavBar';
import { TextMessage } from './../components/TextMessage';
import React, { useEffect, useRef, useState } from 'react';
import { useLoaderData, useNavigation } from 'react-router-dom';
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
import LoaderAnimation from '../components/LoaderAnimation';

export const loader = async ({ params }) => {
  const roomID = params.id;

  // try {
  //   const roomDocRef = doc(db, 'rooms', roomID);
  //   const snapshot = await getDoc(roomDocRef);

  //   const roomName = await snapshot.data().roomName;
  //   const messagesLoader = await snapshot.data().messages;

  //   return { messagesLoader, roomID, roomName };
  // } catch (error) {
  //   console.log(error);
  //   return { roomID, messagesLoader: [], error: error.message, roomName };
  // }
  return { roomID };
};

const Room = () => {
  const { roomID } = useLoaderData();
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(null);
  const { user } = useAuthContext();

  const getRoomInfoFromFirebase = async () => {
    const roomDocRef = doc(db, 'rooms', roomID);
    onSnapshot(roomDocRef, async (snapshot) => {
      try {
        const messages = await snapshot.data().messages;
        setMessages(messages);
      } catch (error) {
        console.log('Error in room.jsx ' + error.message);
      }
    });
  };

  useEffect(() => {
    getRoomInfoFromFirebase();
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
      window.scrollTo(0, document.body.scrollHeight);
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

    if (type === 'group') {
      try {
        const reorderedMessages = [...messages];
        const [removedMessage] = reorderedMessages.splice(source.index, 1);
        reorderedMessages.splice(destination.index, 0, removedMessage);
        const roomDocRef = doc(db, 'rooms', roomID);
        await updateDoc(roomDocRef, {
          messages: reorderedMessages,
        });
      } catch (error) {
        console.log('Error in Room in if type === group ' + error.message);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className='bg-sky-950'>
      <div className='relative h-screen overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar'>
        <NavBar roomID={roomID} />
        <div className='mb-16 py-10'>
          <DragDropContext onDragEnd={handleDrag}>
            <Droppable droppableId='ROOT' type='group'>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className='sm:w-11/12 max-w-6xl mx-auto flex flex-col py-4 '
                >
                  {messages?.map((message, index) => (
                    <Draggable
                      draggableId={message.id}
                      key={message.id}
                      index={index}
                    >
                      {(provided) => (
                        <TextMessage provided={provided} {...message} />
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className='w-full fixed h-16 bottom-0 bg-white border-t border-gray-200 '>
          <div className='flex justify-between items-center mx-4'>
            <input
              type='text'
              ref={messageRef}
              placeholder='Send New Message'
              onKeyDown={handleKeyDown}
              className='w-full p-4 text-xl rounded outline-none'
            />
            <AiOutlineSend
              className='text-3xl text-blue-500 cursor-pointer'
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
