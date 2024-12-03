import { useState,useEffect} from 'react'
import axios from 'axios';

function Cardplaylist({mop ,func ,u}){

    const [time,settime]=useState(0);
useEffect(()=>{
    let ttime=0
    try{
        mop.songs.forEach(element => {
            ttime=(element.duration_ms) +ttime;
           // console.log(element.duration_ms)
           
        });
    }catch(error){
        console.log("error",error)
    }
    settime(Math.floor(ttime/60000));
},[])



    return(
        <>
         <div className='my-3 ml-3 bg-black shadow-md cursor-pointer rounded-md w-60' onClick={()=>{func();
            u(mop.songs);
         }}>
            <img src={mop.songs.length>0 ?mop.songs[0].album.images[0].url:""  } alt='helo' className="w-full h-40 object-cover rounded-md"></img>
            <div className=' flex justify-between items-center'>
            <h2 className="text-xl text-white font-semibold ">{mop.name}</h2>
            <p className="text-gray-600">Songs:{mop.songs.length}</p>
            <p className='text-gray-600'>time:{time}mins</p>
            </div>
        </div>
        </>
    )
}

export default Cardplaylist;