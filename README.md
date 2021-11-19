## RangeSlider
```bash
Slider for selecting a range of values.
```

## Build Setup:
```bash
# Download repository:

$ git clone https://github.com/WhiteDevilMan/RangeSlider

# Go to the folder:
$ cd RangeSlider

# Install dependencies from package.json:
$ npm install (or 'npm i')

# Start server with hot reload
$ npm run dev

# Build project. Output will be at 'dist' folder
$ npm run build

# Deploy project to gh-pages (after "npm run build")
$ npm run deploy

# Run test
$ npm run test (or 'npm test')
```

## Architecture
```bash
This Slider uses MVP architecture

M - Model     | Works with data, performs calculations and manages business processes
V - View      | Shows the user the interface and data from the model
P - Presenter | Serves as a layer between the model and the view
```

![Architecture](./src/assets/img/architecture.svg)
