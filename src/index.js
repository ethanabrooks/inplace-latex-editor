import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Helmet } from "react-helmet";
import { parse, HtmlGenerator } from "latex.js";

const divStyle = {
  color: "blue",
  backgroundImage: "url( http://www.hvallison.com/assets/1915-008a.jpg )"
};
const dom = (
  <html lang="en">
    <Helmet>
      <meta charset="UTF-8" />
      <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
      <meta http-equiv="content-language" content="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script type="module">
        import latexjs from
        "https://cdn.jsdelivr.net/npm/latex.js/dist/latex.component.esm.js"
        customElements.define('latex-js', latexjs)
      </script>
      <title>LaTeX.js Web Component Test</title>
    </Helmet>
    <h1>Compiling LaTeX</h1>

    <latex-js baseURL="https://cdn.jsdelivr.net/npm/latex.js@0.11.1/dist/">
      {`
\\documentclass{article}
\\begin{document}
Hello World.
\\end{document}
    `}
    </latex-js>

    <latex-js hyphenate="false">Another $x$.</latex-js>
  </html>
);

ReactDOM.render(dom, document.getElementById("root"));
