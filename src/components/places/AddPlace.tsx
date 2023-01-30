import { useEffect, useState } from "react";
import { SearchPlace } from "./SearchPlace";
import Map2FictionService from "../../services/Map2FictonService";
import TMDBService from "../../services/TMDBService";

export const AddPlace = () => {
  const [movieChecked, setMovieChecked] = useState<boolean>(true);
  const [tvShowChecked, setTvShowChecked] = useState<boolean>(false);
  const [bookChecked, setBookChecked] = useState<boolean>(false);

  function handleChange(selectedOption: string) {
    console.log(selectedOption);
    if (selectedOption == "movie") {
      setMovieChecked(true);
      setTvShowChecked(false);
      setBookChecked(false);
    }
    if (selectedOption == "tvshow") {
      setMovieChecked(false);
      setTvShowChecked(true);
      setBookChecked(false);
    }
    if (selectedOption == "book") {
      setMovieChecked(false);
      setTvShowChecked(false);
      setBookChecked(true);
    }
  }

  const createNewPlace = (obj: any) => {
    Map2FictionService.post("api/v1/cities/", obj)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const [place, setPlace] = useState("");

  useEffect(() => {
    console.log("the place: " + place);
  }, [place]);

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
            id="tvshow"
            onChange={() => handleChange("tvshow")}
            checked={tvShowChecked}
            disabled
          />
          <label className="btn btn-outline-primary" htmlFor="tvshow">
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
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Movie Name"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Location
              </label>
              <input
                type="input"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Name"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="mb-3">
              <SearchPlace setPlace={setPlace} />
            </div>
          </div>
        </div>
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
                onClick={() => createNewPlace(place)}
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
