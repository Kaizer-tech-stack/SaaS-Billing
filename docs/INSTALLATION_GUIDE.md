# Bilyntra — Installation and Setup Guide

## 1. Introduction

This guide explains how to install, configure, and run Bilyntra in a local development environment.

## 2. Prerequisites

Before installing the project, make sure the following tools are available:

| Requirement        | Purpose                     |
| ------------------ | --------------------------- |
| Node.js            | JavaScript runtime          |
| npm                | Package manager             |
| Visual Studio Code | Recommended code editor     |
| Git                | Source code version control |

Node.js installation includes npm.

You can verify the installation using:

```bash
node -v
npm -v
```

## 3. Getting the Project

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Replace `YOUR_REPOSITORY_URL` with the actual Git repository URL.

Alternatively, download the project and extract its contents.

## 4. Open the Project

Navigate to the project directory:

```bash
cd Bilyntra
```

Open the project in Visual Studio Code:

```bash
code .
```

## 5. Install Dependencies

Run the following command in the integrated terminal:

```bash
npm install
```

This installs the dependencies defined in `package.json`.

## 6. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The terminal will display a local development URL.

Open that URL in your browser to access Bilyntra.

## 7. Available Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Starts the development server.                   |
| `npm run build`   | Creates a production build.                      |
| `npm run preview` | Previews the production build.                   |
| `npm run lint`    | Runs the configured ESLint checks, if available. |

The available scripts depend on the project's `package.json`.

## 8. Building the Application

To create a production build, execute:

```bash
npm run build
```

Vite generates the production files in the `dist/` directory.

## 9. Troubleshooting

### Dependencies are missing

Run:

```bash
npm install
```

### Development server is already running on the port

Vite may automatically select another available port. Check the terminal for the correct local URL.

### Application is not displaying correctly

Try the following:

1. Check the terminal for compilation errors.
2. Check the browser developer console.
3. Verify that the required files and imports exist.
4. Restart the development server.

### Changes are not appearing

Save the modified files and refresh the browser if necessary.

## 10. Summary

Bilyntra uses Vite and npm to provide a straightforward development environment. After installing the dependencies, developers can run the application locally and modify its source code using Visual Studio Code or another compatible editor.
