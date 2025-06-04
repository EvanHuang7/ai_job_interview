<div align="center">
  <h3 align="center">🌟 AI Job Interview</h3>
  <p align="center">
    🚀 <a href="https://ai-job-interview-l5wyt5aco-evan-huangs-projects-53e2b658.vercel.app/" target="_blank"><b>Live App</b></a> &nbsp;|&nbsp;
    📂 <a href="https://github.com/EvanHuang7/ai_job_interview" target="_blank"><b>Source Code</b></a>
  </p>
</div>

## 📚 <a name="table">Table of Contents</a>

1. 📋 [Introduction](#introduction)
2. 🛠️ [Tech Stack](#tech-stack)
3. 🚀 [Features](#features)
4. 📸 [Screenshots](#diagram-screenshots)
5. ⚙️ [Installation and Start Project](#installation-start-project)
   - [⭐ Prerequisites](#prerequisites)
   - [⭐ Cloning the Repository](#clone-repo)
   - [⭐ Packages Installation](#install-packages)
   - [⭐ Create a Cluster in MongoDB](#create-mongodb-cluster)
   - [⭐ Set up Cloudinary](#set-up-cloudinary)
   - [⭐ Set up Stream.io](#set-up-stream)
   - [⭐ Set Up Environment Variables](#set-up-env-variables)
   - [⭐ Running the Project](#running-project)
6. ☁️ [Deploy App in Render](#deploy-app)
7. 👨‍💼 [About the Author](#about-the-author)

## <a name="introduction">📋 Introduction</a>

💬 **AI Job Interview** is a **full-stack Next.js** application that enables users to conduct mock interviews with AI. After each session, the AI provides personalized feedback to help users improve their interview skills.

## <a name="tech-stack">🛠️ Tech Stack</a>

- **🖥️ Frontend & Backend**:
  - Next.js, TypeScript
  - Firebase for authentication and database
  - Shadcn & Tailwind CSS for UI
  - React Hook Form + Zod for forms and validation
- **🤖 AI Tools**:
  - VAPI AI (voice assistant)
  - Google Gemini API (AI interaction)

## <a name="features">🚀 Features</a>

**🔐 Authentication**: Secure sign-up and sign-in with email and password using **Firebase**.

**📝 Generate Interview**: Easily generate a mock interview tailored to any company or role by filling out a simple form and pasting the job description.

**🤖 Start Interview & Receive Feedback**: Start an AI-powered mock interview and receive a score with detailed, personalized feedback upon completion.

**📂 View All Interviews**: Access all your interviews — both ongoing and completed — directly from the home page.

**🔁 Retake Interviews & Review Feedback History**: Revisit finished interviews, review all feedback, and retake interviews to track your improvement over time.

**👤 Profile Settings**: Upload your resume to help the AI generate more personalized and relevant interview questions.

**🎨 Modern UI/UX**: Clean, intuitive interface designed for clarity and ease of use.

**📱 Responsive Design**: Seamlessly adapts to any screen size or device.

## <a name="diagram-screenshots">📸 Screenshots</a>

- **📸 Screenshots**: [Miro Link](https://miro.com/app/board/uXjVIsYJrYw=/?share_link_id=34405013011)

  ![🖼️ Screenshots Preview](https://res.cloudinary.com/dapo3wc6o/image/upload/v1749076130/AI-Job-Interview-Screenshots_idjlmc.jpg)

## <a name="installation-start-project">📦 Installation and ⚙️ Start Project</a>

Follow these steps to set up the project locally on your machine.

### <a name="prerequisites">⭐ Prerequisites</a>

Make sure you have the following installed on your machine:

- Git
- Node.js and npm(Node Package Manager)

### <a name="clone-repo">⭐ Cloning the Repository</a>

```bash
git clone https://github.com/EvanHuang7/LetsChat.git
```

### <a name="install-packages">⭐ Packages Installation</a>

Install the project dependencies using npm:

```bash
cd LetsChat/backend
npm install
cd ..
cd frontend
npm install
```

### <a name="create-mongodb-cluster">⭐ Create a Cluster in MongoDB</a>

Create a cluster by selecting a free plan and `Drivers` connection method under a project in MongoDB, and note down your cluster **connection string**—you'll need them later in the **Set Up Environment Variables step**. (Feel free to follow any MongoDB setup tutorial on YouTube to complete this step.)

⚠️ **Note**: Make sure your MongoDB proejct has public access
  - Go to **SECURITY > Network Access** tab
  - Click **ADD IP ADDRESS** button
  - Click **ALLOW ACCESS FROM ANYWHERE** button
  - Click **Confirm** button

### <a name="set-up-cloudinary">⭐ Set up Cloudinary</a>

Set up your free Cloudinary account and note down your Cloudinary **API key, API Secret and Cloud Name**—you'll need them later in the **Set Up Environment Variables step**. (Feel free to follow any Cloudinary setup tutorial on YouTube to complete this step.)

### <a name="set-up-stream">⭐ Set up Stream.io</a>
Set up your free Stream.io account and note down your Stream.io **API key, API Secret**—you'll need them later in the **Set Up Environment Variables step**. (Feel free to follow any Stream.io setup tutorial on YouTube to complete this step.)

### <a name="set-up-env-variables">⭐ Set Up Environment Variables</a>

Create a `.env` file under **backend** folder of your project and add the following content:

```env
PORT = 5001
MONGODB_URL = 
JWT_SECRET =
NODE_ENV = development

CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 

STREAM_API_KEY = 
STREAM_API_SECRET = 
```

Replace the placeholder values with your actual credentials from MongoDB, Cloudinary, Stream.io.
  - 📌 Note: For `JWT_SECRET`, you can use `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` command line to generate a random key for it.

### <a name="running-project">⭐ Running the Project</a>

Open **two separate terminal windows** and run the following commands to start the frontend and backend servers:

**Terminal 1** – Start the Client (Vite App):

```bash
cd LetsChat/frontend
npm run dev
```

**Terminal 2** – Start the Server (Express API):

```bash
cd LetsChat/backend
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser to view the project.

## <a name="deploy-app">☁️ Deploy App in Render</a>

Follow these steps to deploy app in Render:

1. Go to Render.com
2. Deploy app
    - Click **New > Web Service** button on the top right of the page
    - Select your GitHub Repo for **Git Provider**
    - Click **Connect** button
    - Change **Build Command** to `npm run build`
    - Change **Start Command** to `npm run start`
    - Select `Free` plan for **Instance Type**
    - Copy all environment variables except for `NODE_ENV` in your local `.env` file and paste to **Environment Variables** section
    - Keep the rest of things by default in this page
    - Click **Deploy Web Service** button
3. 🎉🎉🎉 Check Your Deployed App 🎉🎉🎉
    - Once deployment is complete, the app’s URL will appear at the top left of the page.
    - After the service status changes to **Live**, you can fully test the app by signing in as a user.
    - If everything is working correctly, **congratulations**—you’ve successfully deployed your app! 🥳🥳🥳

## <a name="about-the-author">👨‍💼 About the Author</a>

Hi! I'm Evan Huang — a full-stack software developer with 4+ years of experience in web applications, real-time systems, and cloud integration. I’m passionate about building scalable products with clean architecture, elegant UI/UX, and modern technologies like React, Node.js, MongoDB.

This chat app project was completed on **May 4, 2025**, and reflects my focus on full stack development, cloud infrastructure, and responsive design into real-world solutions.

Feel free to connect with me in LinkedIn or GitHub!

<a href="https://www.linkedin.com/in/evan-huang-97336b1a9/" target="_blank">
  <img src="https://res.cloudinary.com/dapo3wc6o/image/upload/v1748926619/Screenshot_2025-06-02_at_22.40.32_mxzsbh.png" alt="LinkedIn" width="150" />
</a>
<br/>
<a href="https://github.com/EvanHuang7" target="_blank">
  <img src="https://res.cloudinary.com/dapo3wc6o/image/upload/v1748926611/Screenshot_2025-06-02_at_22.52.45_jtlfww.png" alt="GitHub" width="150" />
</a>
