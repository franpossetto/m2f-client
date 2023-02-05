import { useEffect, useState } from "react";
import Map2FictionService from "../../services/Map2FictonService";
import TMDBService from "../../services/TMDBService";
import "./addMovie.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MediaType } from "../../types/MediaType";

interface Fiction {
  title: string;
  id: number;
  img: string;
  overview: string;
}

interface Season {
  number_of_seasons: number;
}

export const AddMovie = () => {
  const [movieChecked, setMovieChecked] = useState<boolean>(true);
  const [tvChecked, setTvChecked] = useState<boolean>(false);
  const [bookChecked, setBookChecked] = useState<boolean>(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.movie);

  function handleChange(selectedOption: string) {
    if (selectedOption == "movie") {
      setMovieChecked(true);
      setTvChecked(false);
      setBookChecked(false);
      setMediaType(MediaType.movie);
    }
    if (selectedOption == "tv") {
      setMovieChecked(false);
      setTvChecked(true);
      setBookChecked(false);
      setMediaType(MediaType.tv);
    }
    if (selectedOption == "book") {
      setMovieChecked(false);
      setTvChecked(false);
      setBookChecked(true);
      setMediaType(MediaType.book);
    }
  }
  const searchMovie = async (fictionName: string) => {
    if (fictionName == "") {
      setResults([]);
    } else {
      try {
        const res = await TMDBService.search(fictionName, mediaType);
        if (MediaType[mediaType] == "movie") {
          setResults(
            res.results.map((movie: any) => ({
              title: movie.title,
              id: movie.id,
              img: movie.poster_path,
              overview:
                movie.overview.length > 30
                  ? movie.overview.slice(0, 120) + "..."
                  : movie.overview,
            }))
          );
        } else if (MediaType[mediaType] == "tv") {
          setResults(
            res.results.map((tv: any) => ({
              title: tv.name,
              id: tv.id,
              img: tv.poster_path,
              overview:
                tv.overview.length > 30
                  ? tv.overview.slice(0, 120) + "..."
                  : tv.overview.length > 0
                  ? tv.overview
                  : "No description provided",
            }))
          );
        }
      } catch (err) {
        console.log("err");
      }
    }
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Fiction[]>([]);
  const [selected, setSelected] = useState<boolean>(false);
  const [close, setClose] = useState<boolean>(false);
  const [seasons, setSeasons] = useState<Season>();

  const setQueryCustom = async (res: Fiction) => {
    setQuery(res.title);
    setSelected(true);
    setResults([res]);
    const seasons = await TMDBService.getDetails(res.id, mediaType);
    setSeasons(seasons);
    console.log(res.id);
  };

  useEffect(() => {
    if (!selected) {
      searchMovie(query);
      setSelected(false);
    }
  }, [query]);

  useEffect(() => {
    setQuery("");
    setSelected(false);
  }, [close, mediaType]);

  function formatTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const minutesLeft = minutes % 60;
    return `${hours}:${minutesLeft < 10 ? "0" : ""}${minutesLeft}`;
  }

  const [min, setMin] = useState(0);

  const handleTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMin(Number(event.target.value));
  };

  return (
    <>
      <div className="container" style={{ width: "30%", paddingTop: "30px" }}>
        <h1> New Place </h1>
        <p> Add a new Place and specify the Fiction you wanna to associate</p>

        <div
          className="btn-group"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          <input
            type="radio"
            className="btn-check"
            name="btnradio1"
            id="movie"
            onChange={() => handleChange("movie")}
            checked={movieChecked}
          />
          <label className="btn btn-outline-primary" htmlFor="movie">
            Movie
          </label>
          <input
            type="radio"
            className="btn-check"
            name="btnradio2"
            id="tv"
            onChange={() => handleChange("tv")}
            checked={tvChecked}
          />
          <label className="btn btn-outline-primary" htmlFor="tv">
            TV Show
          </label>
          <input
            type="radio"
            className="btn-check"
            name="btnradio3"
            id="book"
            onChange={() => handleChange("book")}
            checked={bookChecked}
            disabled
          />
          <label className="btn btn-outline-primary" htmlFor="book">
            Book
          </label>
        </div>

        <br />
        <br />
        <div className="row">
          <div className="col">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Fiction
              </label>

              <input
                type="input"
                value={query}
                disabled={selected}
                onChange={(e) => setQuery(e.target.value)}
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Movie Name"
              />

              {results.length > 0 && (
                <div
                  className="card"
                  style={{
                    marginTop: "15px",
                    // height: !selected ? "300px" : "auto",
                    // overflowY: !selected ? "scroll" : "hidden",
                  }}
                >
                  {results.map((result: Fiction) => (
                    <div
                      key={result.id}
                      className="row selected-title"
                      style={{
                        borderBottom: "1px solid lightgray",
                        margin: "0px",
                        paddingLeft: "0px",
                      }}
                      onClick={() => setQueryCustom(result)}
                    >
                      <div className="col-2">
                        {result.img && (
                          <img
                            src={
                              "https://image.tmdb.org/t/p/w500/" + result.img
                            }
                            className="img-fluid"
                            style={{
                              objectFit: "cover",
                              height: "100%",
                            }}
                          />
                        )}
                      </div>
                      <div className="col-9">
                        <h6 className="fiction-title">{result.title}</h6>
                        <p className="fiction-desc">{result.overview}</p>
                      </div>
                      {selected && (
                        <div className="col-1" style={{ paddingTop: "3px" }}>
                          <i
                            className="bi bi-x-circle-fill"
                            style={{
                              color: "lightgrey",
                            }}
                            onClick={() => setClose(!close)}
                          ></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {MediaType[mediaType] == "tv" && selected && (
          <>
            <select className="form-select" aria-label="Default select example">
              {seasons?.number_of_seasons !== undefined
                ? Array.from({ length: seasons.number_of_seasons }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))
                : null}
            </select>
            <br />
          </>
        )}

        <label htmlFor="customRange1" className="form-label">
          Example range
        </label>
        <input
          type="range"
          className="form-range"
          id="customRange1"
          min="0"
          max="1440"
          step="1"
          value={min}
          onChange={handleTime}
        />
        <span className="form-range-value">{formatTime(min)}</span>

        <div className="row">
          <div className="col">
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              placeholder="Describe how the place is related with the scene..."
            ></textarea>
          </div>
        </div>
        <br></br>
        <br></br>
        <div className="row">
          <div className="col">
            <div className="d-grid gap-2">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => console.log("Wohoooo")}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
