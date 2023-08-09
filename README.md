# Warehouse Management System
### REACT and Nodejs Framework


#### Client-side using React APP
```
npx create-react-app . // this allow to be installed on the current directory
remove unecessary files
mkdir components
npm install react-router-dom --save
npm i react-bootstrap bootstrap
npm install @mui/material @emotion/react @emotion/styled
npm install @fontsource/roboto
npm install @mui/icons-material


<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>

<meta name="viewport" content="initial-scale=1, width=device-width" />

import * as React from 'react';
import Button from '@mui/material/Button';

export default function MyApp() {
  return (
    <div>
      <Button variant="contained">Hello World</Button>
    </div>
  );
}


```