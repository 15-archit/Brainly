import DocumentIcon from "../icons/DocumentIcon";
import NotionIcon from "../icons/NotionIcon";
import DeleteIcon from "../icons/DeleteIcon";
import Tags from "./Tags";
import { format } from 'date-fns'
import { type JSX, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TwitterIcon from "../icons/TwitterIcon";


interface CardProps {
  icon: "Youtube" | "Twitter" | "Notion";
  tag: "Productivity" | "Tech & Tools" | "Mindset" | "Learning & Skills" | "Workflows" | "Inspiration";
  title: string;
  link: string; 
  reload?: ()=> void
}

const Card = (props: CardProps) => {
  const navigate = useNavigate();
  const date = format(new Date(), "dd MMM yyyy");

  const getYoutubeId = (url: string): string | null => {
    const regularFormat = url.split("v=");
    if (regularFormat.length > 1) {
      return regularFormat[1].split("&")[0];
    }

    const shortFormat = url.split("youtu.be/");
    if (shortFormat.length > 1) {
      return shortFormat[1].split("?")[0];
    }

    return null;
  };

  const thumbnail = useMemo(() => {
    const videoId = getYoutubeId(props.link);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  }, [props.link]);

  let contentPreview: JSX.Element = (
    <p className="text-gray-500">No content available</p>
  );

  if (props.icon === "Youtube") {
    contentPreview = (
      <div className="flex justify-center pt-6 items-center">
        {thumbnail ? (
          <a href={props.link} target="_blank" rel="noopener noreferrer">
            <img
              src={thumbnail}
              alt={props.title}
              className="w-[90%] rounded-lg ml-3"
            />
          </a>
        ) : (
          <p className="text-gray-500">No thumbnail available</p>
        )}
      </div>
    );
  } else if (props.icon === "Twitter") {
    contentPreview = (
      <div className="flex justify-center pt-6 items-center">
          <a href={props.link} target="_blank" rel="noopener noreferrer">
            <div className="w-[90%] rounded-lg ml-3">
              <TwitterIcon />
            </div>
          </a>
      </div>
    );
  } else if(props.icon === "Notion"){
    contentPreview = (
      <div className="flex justify-center pt-6 items-center">
          <a href={props.link} target="_blank" rel="noopener noreferrer">
            <div className="w-[90%] rounded-lg ml-3">
              <NotionIcon />
            </div>
          </a>
      </div>
    );
  }

  useEffect(() => {
  }, [props.link]);
  
  async function deleteHandle(){
    try{
      const token = localStorage.getItem("token");
      if(!token){
        alert("Please log in first");
        navigate("/"); 
        return;
      }

      const res = await fetch(`http://localhost:5000/api/v1/delete/${props.title}`, {
        method: "Delete",
        headers: {
          "token": token
        },
        credentials: "include"
      });
      if(res.ok){
        alert("Item deleted");
         props.reload?.();
        return;
      }
    }catch(err){
      console.log("item not deleted");
      return;
    }
  }

  return (
    <div className="border-2 w-[19vw] h-[50vh] rounded-md relative bg-white shadow-md">
      <div className="flex justify-between pt-4 pl-2 pr-4 items-center pb-2 border-b-2 border-slate-300 shadow-md rounded-2xl">
        <div className="flex gap-2">
          <span className="pt-1"><DocumentIcon /></span>
          <span className="font-semibold text-2xl">{props.title}</span>
        </div>
        <div className="cursor-pointer" onClick={deleteHandle}>
          <DeleteIcon />
        </div>
      </div>
      <div>
        {contentPreview}
      </div>
      <div className="flex gap-3 pt-4 pl-5">
        <Tags tagTypes={props.tag} />
      </div>
      <div className="text-sm text-gray-500 pl-5 pt-3 pb-2 absolute fixed bottom-2">
        Created on: <span className="font-medium">{date}</span>
      </div>
    </div>
  );
};

export default Card;