import React, { useState, useEffect } from "react";
import { IMovie } from "../type";
export const MoviePage = props => {
  let [movie, setMovie] = useState<IMovie>();

  const fetchMovie = (id: string) => {
    fetch(`http://www.omdbapi.com/?i=${id}&apikey=b8cc2fe9`)
      .then(res => res.json())
      .then((movie: IMovie) => {
        if (movie) {
          setMovie(movie);
        }
      });
  };

  useEffect(() => {
    const { imdbid } = props.match.params;
    fetchMovie(imdbid);
  }, []);
  if (!movie) return <div>Loading...</div>;
  return (
    <>
      <div>
        <b>Movie Details</b>
      </div>
      <div>
        {Object.entries(movie)
          .filter(([key, value]) => {
            return !["imdbID", "type", "DVD", "BoxOffice"].some(
              field => field === key
            );
          })
          .map(([key, value]) => {
            return <div>{`${key}: ${value}`}</div>;
          })}
      </div>
    </>
  );
};
