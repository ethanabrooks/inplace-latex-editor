import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Helmet} from 'react-helmet';
import {parse, HtmlGenerator} from 'latex.js';

// Fragment renders a document fragment.
function Fragment({fragment}) {
  // A ref makes it possible to refer to the HTML node rendered by React after
  // it's rendered so we can manually make manipulations.
  const ref = React.useRef(null);

  // Whenever the fragment changes, this effect will run.
  React.useEffect(() => {
    // Store the current container to make sure the cleanup function runs on
    // the same container as the effect.
    const container = ref.current;

    // Add our fragment to the container.
    container.appendChild(fragment);

    // This is the cleanup function. Whenever the effect has to run again, this
    // cleanup function will run first. It simply cleans up by removing all
    // nodes from inside the container.
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [fragment]);

  return <div ref={ref} />;
}

// Latex renders a given Latex string.
function Latex({text}) {
  // useMemo will only rerun the given function if `text` changes. Because
  // parse can fail, we might return an Error.
  const fragmentOrError = React.useMemo(() => {
    try {
      return parse(text, {generator: new HtmlGenerator()}).domFragment();
    } catch (e) {
      return e;
    }
  }, [text]);

  // If parse failed, show a div displaying the error. Otherwise, display the
  // fragment.
  if (fragmentOrError instanceof Error) {
    return <div style={{color: 'red'}}>{fragmentOrError.message}</div>;
  } else {
    return <Fragment fragment={fragmentOrError} />;
  }
}

function App() {
  // latex.js needs some tags in the head, but it returns them as a document
  // fragment, so we parse an empty latex document and append its head nodes
  // to the <head> tag. Because we specify no dependencies (with the empty
  // array), this will only run once when <App/> mounts. This isn't totally
  // clean because there's no cleanup function, but it's not a big deal since
  // it's
  // the top-level App component which never unmounts.
  React.useEffect(() => {
    const doc = parse('', {generator: new HtmlGenerator()});
    document.head.appendChild(
      doc.stylesAndScripts(
        'https://cdn.jsdelivr.net/npm/latex.js@0.11.1/dist/',
      ),
    );
  }, []);

  const [text, setText] = React.useState('');

  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />
        <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
        <meta http-equiv="content-language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LaTeX.js Web Component Test</title>
      </Helmet>
      <h1>Compiling LaTeX</h1>
      <p>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </p>
      <Latex text={text} />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
