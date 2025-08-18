# XPlore Schaffer: A Web-Based Multi-floor Navigation System

This is a customized version of [indoor-wayfinder](https://github.com/KnotzerIO/indoor-wayfinder), originally created by Mark Knotzer and released under the MIT License.

## About XPlore Schaffer

XPlore Schaffer is a innovative and useful application for multi-floor indoor navigation. It extends the
work of Mark Knotzer on PathPal by adding support for multi-floor traversal and accessibility such as stair avoidance.
<br>
**Demo:** [Visit XPlore Schaffer](https://xplore.schafferlibrarycollections.org)

## Features

- Multi-floor navigation
- Avoid stairs option
- Editable starting location
- Resettable starting location
- Interactive SVG Maps
- Informative zones on the maps
- Different zone shades to indicate restricted areas

## Getting Started

Follow these instructions to get the project running:

1. **Clone the Repository**: Use your preferred Git method to clone this repository to your local machine.

2. **Install Node.js**: This project requires Node.js. If you don't have Node.js version 21 installed, you can download and install it from [nodejs.org](https://nodejs.org/).

3. **Install Dependencies**: Navigate to the project directory in your terminal and run the following command to install the necessary dependencies:

   ```bash
   npm install
   ```

4. **Start the Application**: Once the dependencies are installed, you can start the application by running the following command in your terminal:

   ```bash
   npm run dev
   ```

After running these commands, your default web browser should automatically open and navigate to the running application.

## Contributing to the Repository

To edit the program and update the repository on GitHub:

1. Make the desired software edits after cloning the repository on your local machine.

2. Stage all of the changes made in your local repository using this command:

   ```bash
   git add .
   ```

3. Commit all of the staged changes in your local repository, adding a short message within double quotes to document the software change:

   ```bash
   git commit -m `"Add message"`
   ```

4. Push all of the local changes to the GitHub repository:

   ```bash
   git push
   ```

## Re-deploying After Software Edits

1. Delete the **dist** folder locally on your machine.

2. Re-compile the program:

   ```bash
   npm run build
   ```

You should see a newly generated **dist** folder.

3. Push all of the local edits to GitHub (see the previous section for how to do so).

4. Log in to Reclaim Hosting and upload the **contents** of the dist folder, not the folder itself.