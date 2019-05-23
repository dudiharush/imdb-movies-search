import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { IMovie, ISearchResults, IGuggestedMovie } from "../type";
import Autosuggest from "react-autosuggest";
import * as debounce from "debounce";

export const SearchPage = props => {
  let [movies, setMovies] = useState<IMovie[]>([]);

  let [value, setValue] = useState<string>("");
  let [suggestions, setSuggestions] = useState<any>([]);

  const getSuggestions = (
    movies: IMovie[],
    title: string
  ): IGuggestedMovie[] => {
    const inputValue = title && title.trim().toLowerCase();
    const allMovies = movies.map(movie => ({
      title: movie.Title,
      imdbID: movie.imdbID
    }));

    return inputValue && inputValue.length === 0
      ? []
      : allMovies.filter(movie =>
          movie.title.toLowerCase().includes(inputValue)
        );
  };

  const getSuggestionValue = suggestion => suggestion.title;

  const renderSuggestion = suggestion => (
    <div key={suggestion.imdbID}>{suggestion.title}</div>
  );

  const onChange = (event, { newValue, method }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = debounce(({ value: title }) => {
    if (title.length > 2) {
      fetchMovies(title);
    }
  }, 300);

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestionValue }) => {
    console.log(suggestionValue);
    fetchMovies(suggestionValue);
  };

  const inputProps = {
    placeholder: "Type a Movie Title",
    value,
    onChange: onChange
  };

  useEffect(() => {
    const { q } = queryString.parse(props.location.search);
    if (q) {
      fetchMovies(q as string);
      setValue(q as string);
    }
  }, []);

  const fetchMovies = (title: string) => {
    fetch(`http://www.omdbapi.com/?s=${title}&apikey=b8cc2fe9`)
      .then(res => res.json())
      .then((jsonRes: ISearchResults) => {
        if (jsonRes.Response === "True") {
          setMovies(jsonRes.Search);
          const suggestedMovies = getSuggestions(jsonRes.Search, value);
          setSuggestions(suggestedMovies);
        }
      });
  };

  return (
    <div>
      <Autosuggest
        onSuggestionSelected={onSuggestionSelected}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {movies.map(movie => {
          return (
            <div
              onClick={() => {
                props.history.push(`/${movie.imdbID}`);
              }}
              style={{
                border: "1px solid black",
                margin: "10px",
                flex: "0 0 200px",
                cursor: "pointer"
              }}
            >
              <div>{`${movie.Title} (${movie.Year})`}</div>
              <div>
                <img src={movie.Poster} style={{ width: "100%" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
