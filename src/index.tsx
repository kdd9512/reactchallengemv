import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createGlobalStyle, ThemeProvider} from "styled-components";
import {RecoilRoot} from "recoil";
import {theme} from "./theme";
import {QueryClient, QueryClientProvider} from "react-query";

// 출처 : https://meyerweb.com/eric/tools/css/reset/
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;400&display=swap');

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  body {
    line-height: 1;
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  * {
    box-sizing: border-box;
  }

  // 만약 상단에서 @import 가 실패하면 이하의 글꼴을 적용한다.
  body {
    font-weight: 300;
    font-family: 'Source Sans Pro', sans-serif;
    color: ${props => props.theme.white.darker};
    line-height: 1.2;
    background-color: black;
  }

  // Link 태그는 결국 HTML 에서 a 태그로 바뀌므로 이곳에서 CSS 를 설정한다.
  a {
    text-decoration: none;
    color: inherit;
  }
`;

// API 를 가져오기 위한 QueryClient / QueryClientProvider
const client = new QueryClient();

ReactDOM.render(
    <RecoilRoot>
        <QueryClientProvider client={client}>
            <ThemeProvider theme={theme}>
                <GlobalStyle/>
                <App/>
            </ThemeProvider>
        </QueryClientProvider>
    </RecoilRoot>
    , document.getElementById('root')
);
