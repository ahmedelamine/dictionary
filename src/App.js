import axios from "axios";
import { useState, useEffect } from "react";
import { Container, Typography, TextField, MenuItem } from "@material-ui/core";

const languages = [
  { value: "English", label: "en" },
  { value: "French", label: "fr" },
];

function App() {
  const [language_code, setLanguageCode] = useState("en");
  const [word, setWord] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  const dictionaryApi = async (language_code, word) => {
    try {
      const { data } = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/${language_code}/${word}`
      );
      // console.log(data);
      setError(false);
      setData(data);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (word !== "") {
      dictionaryApi(language_code, word);
    } else {
      setData([]);
    }
  }, [word, language_code]);

  return (
    <div className="App" style={appStyle}>
      <Container maxWidth="md" style={containerStyle}>
        {error && (
          <Typography variant="h5" color="secondary">Something went wrong!!</Typography>
        )}
        <Typography variant="h3">Word Hunt</Typography>
        <TextField
          id="standard-basic"
          label="Search Word"
          variant="standard"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <TextField
          id="outlined-select-currency-native"
          select
          label="languages"
          value={language_code}
          onChange={(e) => setLanguageCode(e.target.value)}
          helperText="Please select language"
          variant="filled"
        >
          {languages.map(({ value, label }) => (
            <MenuItem key={value} value={label}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <Container maxWidth="md">
          {word === "" ? (
            <Typography>Start with typing word in search input</Typography>
          ) : (
            <div>
              <div>
                <audio src={data[0]?.phonetics[0]?.audio} controls>
                  Your Browser doesn't support audio element.
                </audio>
              </div>
              {data[0]?.meanings?.map(
                ({ partOfSpeech, definitions }, index) => (
                  <div key={index}>
                    <Typography variant="h4">{word}</Typography>
                    <Typography>{partOfSpeech}</Typography>
                    <hr />{" "}
                    <div>
                      {definitions?.map(
                        ({ definition, example, synonyms }, secondIndex) => (
                          <div key={`${index}_${secondIndex}`}>
                            {definition && (
                              <Typography paragraph={true}>
                                <b>Definition:</b> {definition}
                              </Typography>
                            )}
                            {example && (
                              <Typography>
                                <b>Example:</b> {example}
                              </Typography>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </Container>
      </Container>
    </div>
  );
}

const appStyle = {
  height: "100vh",
  // background: "#282c34",
  // color: "white",
};
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
};

export default App;
