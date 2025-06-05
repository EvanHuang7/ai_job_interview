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
   - [⭐ Create a Project in Firebase](#create-firebase-project)
   - [⭐ Set up Cloudinary](#set-up-cloudinary)
   - [⭐ Set Up Environment Variables](#set-up-env-variables)
   - [⭐ Running the Project](#running-project)
6. ☁️ [Deploy App in Vercel](#deploy-app)
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
git clone https://github.com/EvanHuang7/ai_job_interview.git
```

### <a name="install-packages">⭐ Packages Installation</a>

Install the project dependencies using npm:

```bash
cd ai_job_interview
npm install
```

### <a name="create-firebase-project">⭐ Create a Project in Firebase</a>

- Set up Firebase Authentication
    - After project created, go to **Build > Authentication** tab
    - Click **Get started** button
    - Select `Email/Password` for **Native providers**
    - Click **Save** button
- Set up Firestore Database
    - Go to **Build > Firestore Database** tab
    - Click **Create database** button
    - Keep the **Databse ID** as default and select the closest location to you for **Location**
    - Click **Next** button
    - Select `Start in production mode`
    - Click **Create** button
- Replace `firebaseConfig` in `ai_job_interview/lib/firebase/client.ts` file
    - Go to **Project Overview** tab
    - Click `</>` icon (web) button
    - Enter your desired **App nickname**
    - Click **Register app** button
    - Copy your `firebaseConfig` in the script and replace the `firebaseConfig` in `ai_job_interview/lib/firebase/client.ts` file to yours
    - Click **Continue to console** button
- Get Firebase Private Key
    - Click the ⚙️ setting icon the right side of **Project Overview** button
    - Click **Project settings** button
    - Click **Service accounts** tab
    - Click **Generate new private key** button
    - Click **Generate key** button, which will download a json file
    - Note down your `project_id`, `private_key` and `client_email`—you'll need them later in the **Set Up Environment Variables step**.

⚠️ **Important**: You may encounter a `missing compound index` error when querying Firestore data. If this happens, simply click the link provided in the error message to automatically create the required compound index. Once the index is built, the app will be able to access the Firestore data successfully.

📌 Note: Feel free to follow any Firebase setup tutorial on YouTube to complete this step.

### <a name="set-up-cloudinary">⭐ Set up Cloudinary</a>

Set up your free Cloudinary account and note down your Cloudinary **API key, API Secret and Cloud Name**—you'll need them later in the **Set Up Environment Variables step**. (Feel free to follow any Cloudinary setup tutorial on YouTube to complete this step.)

### <a name="set-up-env-variables">⭐ Set Up Environment Variables</a>

Create a `.env.local` file under **ai_job_interview** folder of your project and add the following content:

```
FIREBASE_PROJECT_ID=""
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=""

GOOGLE_GENERATIVE_AI_API_KEY=""
NEXT_PUBLIC_VAPI_WEB_TOKEN=""

CLOUDINARY_CLOUD_NAME = ""
CLOUDINARY_API_KEY = ""
CLOUDINARY_API_SECRET = ""
```

Replace the placeholder values with your actual credentials from Firbase, Cloudinary, Vapi and Google Gemini (via Google AI Studio).
  - 📌 Note: Feel free to follow YouTube tutorials on Vapi and Google AI Studio to obtain the required tokens and configuration.

### <a name="running-project">⭐ Running the Project</a>

Open **a terminal window** and run the following commands to start the project:

**Terminal** – Start the Project (Next.js App):

```bash
cd ai_job_interview
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) in your browser to view the project.

## <a name="deploy-app">☁️ Deploy App in Vercel</a>

Follow these steps to deploy app in Vercel:

1. Go to Vercel.com
2. Deploy app
    - Click **Add New > Project** button on the top right of the page
    - Select your GitHub Repo for **Import Git Repository**
    - Click **Import** button
    - Copy all environment variables in your local `.env.local` file and paste to **Environment Variables** section
    - Keep the rest of things by default in this page
    - Click **Deploy** button
3. 🎉🎉🎉 Check Your Deployed App 🎉🎉🎉
    - Once deployment is complete, click the **Visit** button in the top-right corner of the page to open your deployed app. You can fully test the functionality by signing in as a user.
    - If everything is working correctly, **congratulations**—you’ve successfully deployed your app! 🥳🥳🥳

## <a name="about-the-author">👨‍💼 About the Author</a>

Hi! I'm Evan Huang — a full-stack software developer with 4+ years of experience in web applications, real-time systems, and cloud integration. I’m passionate about building scalable products with clean architecture, elegant UI/UX, and modern technologies like Next.js, Firebase, Google Gemini AI.

This chat app project was completed on **May 17, 2025**, and reflects my focus on full stack development, cloud infrastructure, and responsive design into real-world solutions.

Feel free to connect with me in LinkedIn or GitHub!

<a href="https://www.linkedin.com/in/evan-huang-97336b1a9/" target="_blank">
  <img src="https://res.cloudinary.com/dapo3wc6o/image/upload/v1748926619/Screenshot_2025-06-02_at_22.40.32_mxzsbh.png" alt="LinkedIn" width="150" />
</a>
<br/>
<a href="https://github.com/EvanHuang7" target="_blank">
  <img src="https://res.cloudinary.com/dapo3wc6o/image/upload/v1748926611/Screenshot_2025-06-02_at_22.52.45_jtlfww.png" alt="GitHub" width="150" />
</a>
