import { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import { socket } from './socket';
import { v4 as uuid} from 'uuid';
import { MdSend } from 'react-icons/md'

interface IMessage{
  id: string;
  name: string;
  text: string;
  isOwner?: boolean
}

function App() {
  const [ socketInstance ] = useState(socket());
  // const [ message, setMessage ] = useState<string | null>(null);

  const [messages, setMessage] = useState<IMessage[]>([])

  const message = useRef<HTMLInputElement | null>(null);
  const username = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    socketInstance.on("message", (mensagem) => {
      setMessage((prev) => [...prev, mensagem]);
    });

    return () => {
      socketInstance.off("message");
    }
  }, [])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const messageSend = message.current?.value;

    if(messageSend !== undefined){
      const newMessage = {
        text: messageSend.toString(),
        name: username.toString(),
        id: uuid()
      }
  
      socketInstance.emit('message', newMessage);
  
      setMessage((prev) => [
        ...prev,
        { ...newMessage, isOwner: true },
      ]);
    }

    message.current !== null ? message.current.value = "" : '';
  };
  
  // console.log('name', username.current !== null ? username.current.value : '');

  return (
    <>
      <div className='w-screen h-screen bg-slate-900 flex justify-center items-center'>
        <div className='w-2/12 h-[110px] me-8 flex bg-slate-300 p-2 flex-col justify-between rounded-xl'>
            <div className='w-full h-[50px] mb-3'>
              <h1 className='text-2xl font-semibold '>Digite seu nome</h1>
            </div>
            <div className='w-full h-[50px] flex justify-center items-center'>
              <input type='text' className='w-full h-full ps-2 border-2 border-slate-950 rounded-xl' ref={username}/>
              <button className='w-[55px] h-[50px] bg-slate-900 rounded-2xl ms-2 flex justify-center items-center hover:bg-slate-950'><MdSend className="text-2xl text-slate-50"/></button>
            </div>
        </div>
        <div className='w-5/12 h-5/6 bg-slate-50 rounded-xl p-4 flex flex-col'>
            <div className='w-full h-full'>
              {messages.map(message => ( 
                <div className={`w-full h-100 mb-3 rounded-xl flex flex-col ${message.isOwner ? 'items-end' : 'items-start'}`}>                            
                    <div className='w-[200px] h-[50px] bg-slate-900 p-2 flex items-center rounded-lg'>
                      <h1 className='text-slate-50'>{message.text}</h1>
                    </div>
                </div>
              ))}
            </div>
          <form className='w-full h-100' onSubmit={handleSubmit}>
            <div className='w-full h-[50px] flex justify-center items-center'>
              <input type='text' className='w-full h-full ps-2 border-2 border-slate-950 rounded-xl' ref={message}/>
              <button className='w-[55px] h-[50px] bg-slate-900 rounded-2xl ms-2 flex justify-center items-center hover:bg-slate-950' type='submit'><MdSend className="text-2xl text-slate-50"/></button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
